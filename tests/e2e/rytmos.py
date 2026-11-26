"""Tests end-to-end de la home de RYTMOS y del catálogo en /play/.

Mismo arranque que flujos.py (Playwright de Python, fuera del repo):

    npm run build
    npx next start -p 3311
    python -I tests/e2e/rytmos.py

Vuelta a la portada anterior (app/lib/portada.ts): se construye con la
variable puesta y se corren los tests con la misma variable, que activa la
clase `PortadaAnterior` y saltea las de la home nueva:

    PORTADA=play npm run build && npx next start -p 3311
    PORTADA=play python -I tests/e2e/rytmos.py
"""

import json
import os
import re
import unittest
from urllib.parse import unquote

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3311").rstrip("/")
NUMERO = "5491156072460"
ANTERIOR = os.environ.get("PORTADA") == "play"
MOVIL = dict(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
ESCRITORIO = dict(viewport={"width": 1440, "height": 900})

PUERTAS = {
    "Hivrido PLAY": "/play/", "Casting": "/casting/", "La productora": "/web/", "Artistas": "/artistas/",
    "Grow Digital": "/diseno-web/", "Branding": "/branding/", "Publicidad": "/publicidad/",
    "Agentes IA": "/colmena-agentes/", "Equipo": "/equipo/",
}


class Base(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def pagina(self, ruta, movil=False, js=True, reducido=False):
        ctx = self.browser.new_context(locale="es-AR", java_script_enabled=js, reduced_motion="reduce" if reducido else "no-preference", **(MOVIL if movil else ESCRITORIO))
        self.addCleanup(ctx.close)
        page = ctx.new_page()
        page.goto(BASE + ruta, wait_until="load")
        return page

    def json_ld(self, page):
        nodos = []
        for b in page.eval_on_selector_all("script[type='application/ld+json']", "els => els.map(e => e.textContent)"):
            data = json.loads(b)
            nodos += data.get("@graph", [data])
        return nodos


@unittest.skipIf(ANTERIOR, "la portada vigente es la anterior")
class HomeRytmos(Base):
    def test_cabeza_dice_serie_y_plataforma(self):
        page = self.pagina("/", js=False)
        titulo = page.title()
        self.assertIn("RYTMOS", titulo)
        self.assertIn("serie", titulo.lower())
        self.assertIn("Hivrido PLAY", titulo)
        self.assertEqual(page.locator("link[rel=canonical]").get_attribute("href"), "https://hivrido.com/")
        self.assertEqual(page.locator("meta[property='og:image']").get_attribute("content"), "https://hivrido.com/images/share/rytmos-portada-v2.jpg")
        self.assertEqual(page.locator("meta[name='twitter:card']").get_attribute("content"), "summary_large_image")
        self.assertEqual(page.locator("h1").count(), 1)
        self.assertIn("RYTMOS", page.locator("h1").inner_text())

    def test_json_ld_serie_organizacion_y_migas(self):
        tipos = {n.get("@type") if isinstance(n.get("@type"), str) else n["@type"][0] for n in self.json_ld(self.pagina("/", js=False))}
        self.assertTrue({"TVSeries", "Organization", "BreadcrumbList", "WebSite"} <= tipos, tipos)

    def test_no_hay_bloques_vacios_ni_marcas_de_pendiente(self):
        page = self.pagina("/")
        texto = page.locator("body").inner_text()
        self.assertNotIn("TODO-CONTENIDO", texto)
        self.assertNotIn("undefined", texto)
        for sec in page.locator("main section.ry-sec").all():
            self.assertTrue(sec.locator(".ry-h2").inner_text().strip(), "sección sin titular")

    def test_llamados_del_hero(self):
        """Con casting abierto, todo lleva al casting; sin él, Avisame abre WhatsApp."""
        page = self.pagina("/")
        if page.locator(".ry-hero .ry-cd").count():
            ir = page.locator(".ry-hero a", has_text="Mandá tu selftape")
            self.assertEqual(ir.get_attribute("href"), "/casting/")
            self.assertEqual(ir.locator("svg").count(), 1, "lleva la campanita")
            self.assertEqual(page.locator(".ry-header a", has_text="Sumate al casting").get_attribute("href"), "/casting/")
            self.assertEqual(page.locator(".ry-hero a", has_text="Explorar Hivrido PLAY").count(), 0)
            self.assertEqual(page.locator(".ry-hero .afiche3d-pieza").get_attribute("href"), "/casting/")
            self.assertIn("selftape", page.locator(".ry-hero .afiche3d-pieza img").get_attribute("src"))
            ir.click()
            page.wait_for_url(re.compile(r"/casting/$"))
        else:
            href = page.locator(".ry-hero a", has_text="Avisame").get_attribute("href")
            self.assertTrue(href.startswith(f"https://wa.me/{NUMERO}?text="), href)
            self.assertIn("Avisame cuando se estrene RYTMOS en PLAY", unquote(href))

    def test_equipo_con_sus_instagram(self):
        for ruta in ["/", "/casting/"]:
            with self.subTest(ruta=ruta):
                page = self.pagina(ruta, js=False)
                hrefs = page.eval_on_selector_all(".equipo a", "els => els.map(e => e.href)")
                self.assertIn("https://www.instagram.com/malenaluchetti/", hrefs)
                self.assertIn("https://www.instagram.com/jokospramori/", hrefs)
                self.assertIn("https://www.instagram.com/leandro_dome/", hrefs)

    def test_sin_otras_series_en_la_home(self):
        page = self.pagina("/", js=False)
        self.assertEqual(page.locator(".hp-card").count(), 0)
        self.assertIn("hivrido sale de acá", page.locator("#todo-hivrido h2").text_content().lower())

    def test_trailer_carga_al_tocarlo(self):
        page = self.pagina("/")
        if page.locator("#trailer").count() == 0:
            self.skipTest("TODO-CONTENIDO: todavía no hay tráiler cargado en app/lib/rytmos.ts")
        pedidos = []
        page.on("request", lambda r: pedidos.append(r.url))
        page.wait_for_timeout(1200)
        self.assertFalse([u for u in pedidos if "youtube" in u or ".mp4" in u], "nada del reproductor antes del clic")
        page.locator(".ry-hero a", has_text="Ver tráiler").click()
        page.wait_for_timeout(2500)
        self.assertTrue([u for u in pedidos if "youtube" in u or ".mp4" in u], "al tocar se pide el video")

    def test_hub_lleva_a_cada_puerta(self):
        page = self.pagina("/")
        puertas = page.locator("#todo-hivrido .ry-door")
        self.assertEqual(puertas.count(), 10)
        for label, destino in PUERTAS.items():
            with self.subTest(puerta=label):
                page.goto(BASE + "/", wait_until="load")
                link = page.locator("#todo-hivrido a.ry-door-link", has_text=label)
                self.assertEqual(link.get_attribute("href"), destino)
                link.scroll_into_view_if_needed()
                link.click()
                page.wait_for_url(re.compile(re.escape(destino) + "$"))
                self.assertLess(page.evaluate("document.title").find("404"), 0)
        page.goto(BASE + "/", wait_until="load")
        contacto = page.locator("#todo-hivrido .ry-door.is-contact")
        self.assertIn(f"wa.me/{NUMERO}", contacto.locator("a").first.get_attribute("href"))
        self.assertTrue(contacto.locator("a[href^='mailto:hivridoads@gmail.com']").count())

    def test_menu_movil_mapa_completo_foco_y_escape(self):
        page = self.pagina("/", movil=True)
        page.locator(".ry-burger").click()
        cajon = page.locator("nav.nav-drawer.open")
        cajon.wait_for(state="visible")
        page.wait_for_timeout(300)
        self.assertTrue(page.evaluate("document.activeElement.closest('.nav-drawer') !== null"), "el foco entra al cajón")
        hrefs = cajon.locator(".nav-menu a").evaluate_all("els => els.map(e => e.getAttribute('href'))")
        self.assertEqual(sorted(hrefs), sorted(PUERTAS.values()))
        page.keyboard.press("Escape")
        page.wait_for_timeout(600)
        self.assertEqual(page.locator("nav.nav-drawer.open").count(), 0)
        page.locator(".ry-burger").click()
        page.locator("nav.nav-drawer.open .nav-menu a", has_text="Casting").click()
        page.wait_for_url(re.compile(r"/casting/$"))

    def test_sin_boton_flotante_y_con_cuenta_del_selftape(self):
        page = self.pagina("/", movil=True)
        self.assertEqual(page.locator("a.wa-btn").count(), 0, "la home no lleva botón flotante")
        cuenta = page.locator(".ry-hero .ry-cd [role=timer]")
        if cuenta.count() == 0:
            self.skipTest("el selftape ya cerró: el contador se retira con el deploy")
        page.wait_for_timeout(1500)
        digitos = cuenta.locator(".ry-cd-digit").all_inner_texts()
        self.assertEqual(len(digitos), 4)
        self.assertTrue(all(d.isdigit() for d in digitos), digitos)
        self.assertEqual(cuenta.locator("a.ry-cd-link").get_attribute("href"), "/casting/")
        ancho = page.evaluate("document.documentElement.scrollWidth")
        self.assertLessEqual(ancho, 390, "sin desborde lateral en el teléfono")

    def test_anclas_viejas_llegan_a_su_seccion_en_play(self):
        for ancla in ["series", "peliculas", "proximamente"]:
            with self.subTest(ancla=ancla):
                page = self.pagina(f"/#{ancla}")
                page.wait_for_url(re.compile(rf"/play/#{ancla}$"))
                seccion = page.locator(f"#{ancla}")
                seccion.wait_for()
                page.wait_for_timeout(800)
                caja = seccion.bounding_box()
                self.assertLess(abs(caja["y"]), 400, f"#{ancla} tiene que quedar en pantalla")

    def test_movimiento_reducido_no_anima(self):
        page = self.pagina("/", reducido=True)
        anim = page.eval_on_selector(".ry-mark-l, .ry-logo-l", "e => getComputedStyle(e).animationName")
        self.assertEqual(page.eval_on_selector(".ry-mark-glitch, .ry-logo", "e => getComputedStyle(e).animationName"), "none")
        self.assertEqual(anim, "none")

    def test_sin_javascript_se_lee_todo(self):
        page = self.pagina("/", js=False)
        self.assertTrue(page.locator("h1").is_visible())
        self.assertEqual(page.locator("#todo-hivrido a.ry-door-link").count(), 9)


class Catalogo(Base):
    @unittest.skipIf(ANTERIOR, "con la portada anterior /play/ es un duplicado")
    def test_play_es_el_catalogo_con_su_canonica(self):
        page = self.pagina("/play/", js=False)
        self.assertEqual(page.locator("link[rel=canonical]").get_attribute("href"), "https://hivrido.com/play/")
        self.assertIn("Hivrido PLAY", page.title())
        for ancla in ["series", "peliculas", "proximamente"]:
            self.assertEqual(page.locator(f"#{ancla}").count(), 1, ancla)

    def test_logo_y_pildora_van_a_lugares_distintos(self):
        page = self.pagina("/play/el-rectangulo-de-angeles/")
        self.assertEqual(page.locator(".hp-header .hp-logo-mark").get_attribute("href"), "/")
        self.assertEqual(page.locator(".hp-header a.hp-logo-pill").get_attribute("href"), "/play/")
        self.assertEqual(page.locator(".hp-nav a", has_text="Inicio").get_attribute("href"), "/")
        self.assertEqual(page.locator(".hp-nav a", has_text="Series").get_attribute("href"), "/play/#series")

    def test_rytmos_esta_en_proximamente_y_tiene_ficha(self):
        page = self.pagina("/play/")
        tarjeta = page.locator("#proximamente a.hp-soon-media[href^='/play/rytmos']")
        self.assertEqual(tarjeta.count(), 1)
        tarjeta.click()
        page.wait_for_url(re.compile(r"/play/rytmos/?$"))
        self.assertEqual(page.locator("h1.tv-title").inner_text().strip().upper(), "RYTMOS")

    def test_web_lleva_play_al_catalogo(self):
        page = self.pagina("/web/", js=False)
        self.assertGreater(page.locator(".nav-menu a[href='/play/']").count(), 0)
        self.assertGreater(page.locator(".eco a[href='/play/']", has_text="Ver el catálogo").count(), 0)
        self.assertEqual(page.locator(".eco a[href='/']").count(), 0)

    def test_sitemap(self):
        ctx = self.browser.new_context()
        self.addCleanup(ctx.close)
        xml = ctx.request.get(BASE + "/sitemap.xml").text()
        self.assertIn("<loc>https://hivrido.com/</loc>", xml)
        if not ANTERIOR:
            self.assertIn("<loc>https://hivrido.com/play/</loc>", xml)


@unittest.skipUnless(ANTERIOR, "solo con PORTADA=play")
class PortadaAnterior(Base):
    """La vuelta atrás: con PORTADA=play la raíz es el catálogo de siempre."""

    def test_la_raiz_vuelve_a_ser_el_catalogo(self):
        page = self.pagina("/")
        self.assertEqual(page.title(), "Hivrido PLAY — Series y películas argentinas")
        self.assertEqual(page.locator("link[rel=canonical]").get_attribute("href"), "https://hivrido.com/")
        for ancla in ["series", "peliculas", "proximamente"]:
            self.assertEqual(page.locator(f"#{ancla}").count(), 1, ancla)
        self.assertEqual(page.locator(".ry-hero").count(), 0)

    def test_play_sigue_andando_y_apunta_a_la_raiz(self):
        page = self.pagina("/play/", js=False)
        self.assertEqual(page.locator("link[rel=canonical]").get_attribute("href"), "https://hivrido.com/")

    def test_las_anclas_viejas_no_redirigen(self):
        page = self.pagina("/#series")
        page.wait_for_timeout(800)
        self.assertTrue(page.url.endswith("/#series"), page.url)


if __name__ == "__main__":
    unittest.main(verbosity=2)
