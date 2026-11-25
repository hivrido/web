"""Tests end-to-end de los flujos críticos de hivrido.com.

Corren con el Playwright de Python que ya está instalado en la máquina (el
proyecto no suma dependencias para esto) contra un build servido en local:

    npm run build
    npx next start -p 3311
    python -I tests/e2e/flujos.py            # todos
    python -I tests/e2e/flujos.py -k whatsapp

Otra base: BASE=https://hivrido.com python -I tests/e2e/flujos.py
(contra producción son solo lecturas: ningún test envía un formulario).
"""

import json
import os
import re
import unittest
from urllib.parse import parse_qs, unquote, urlparse

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3311").rstrip("/")
NUMERO = "5491156072460"
MOVIL = dict(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
ESCRITORIO = dict(viewport={"width": 1440, "height": 900})
# Dónde vive el catálogo de PLAY: /play/ con la home de RYTMOS, la raíz si se
# volvió a la portada anterior (PORTADA=play, ver app/lib/portada.ts).
CATALOGO = "/" if os.environ.get("PORTADA") == "play" else "/play/"

RUTAS = [
    "/", "/play/", "/web/", "/okupas/", "/casting/", "/cesion/", "/origen/", "/estudio/", "/orbital/",
    "/diseno-web/", "/branding/", "/equipo/", "/publicidad/", "/colmena-agentes/", "/artistas/",
    "/artistas/amplax/", "/artistas/zurdosound/",
    "/play/el-rectangulo-de-angeles/", "/play/erase-una-vez-en-virreyes/", "/play/mia/",
    "/play/cuchillo-paz/", "/play/insomnio/", "/play/rytmos/",
]
if CATALOGO == "/":
    RUTAS.remove("/play/")  # con la portada anterior, /play/ es un duplicado con canónica "/"


class Flujos(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def pagina(self, ruta, movil=False, js=True):
        ctx = self.browser.new_context(locale="es-AR", java_script_enabled=js, **(MOVIL if movil else ESCRITORIO))
        self.addCleanup(ctx.close)
        page = ctx.new_page()
        page.goto(BASE + ruta, wait_until="load")
        return page

    # ── Catálogo ────────────────────────────────────────────────────────────

    def test_catalogo_lleva_a_la_ficha(self):
        page = self.pagina(CATALOGO)
        self.assertEqual(page.locator("h1").count(), 1)
        card = page.locator("#peliculas .hp-card-link").first
        destino = card.get_attribute("href")
        self.assertRegex(destino, r"^/play/[a-z0-9-]+/?$")
        card.click()
        page.wait_for_url(re.compile(r"/play/"))
        self.assertTrue(page.locator("h1.tv-title").inner_text().strip())

    def test_buscador_encuentra_por_genero(self):
        page = self.pagina(CATALOGO)
        page.locator(".hp-search-btn").click()
        campo = page.locator(".hp-search-input")
        campo.fill("terror")
        page.wait_for_timeout(400)
        self.assertGreater(page.locator(".hp-search-grid a[href^='/play/']").count(), 0)
        page.keyboard.press("Escape")

    def test_hero_usa_imagen_con_variantes(self):
        page = self.pagina(CATALOGO, movil=True)
        img = page.locator(".hp-hero-slide.is-active img.hp-hero-img")
        self.assertIn("-960.webp", img.get_attribute("srcset") or "")
        self.assertEqual(img.get_attribute("fetchpriority"), "high")

    # ── Tráiler ─────────────────────────────────────────────────────────────

    def test_trailer_no_carga_youtube_hasta_el_clic(self):
        ctx = self.browser.new_context(**ESCRITORIO)
        self.addCleanup(ctx.close)
        page = ctx.new_page()
        pedidos = []
        page.on("request", lambda r: pedidos.append(r.url))
        page.goto(BASE + "/play/el-rectangulo-de-angeles/", wait_until="load")
        page.wait_for_timeout(1500)
        self.assertFalse([u for u in pedidos if "youtube" in u], "YouTube no debe pedirse antes del clic")
        page.locator(".cp-big-play").click()
        page.wait_for_timeout(2500)
        self.assertTrue([u for u in pedidos if "youtube.com/iframe_api" in u], "al dar play se pide el reproductor")

    # ── Avisame ─────────────────────────────────────────────────────────────

    def test_avisame_lleva_el_titulo_en_el_mensaje(self):
        page = self.pagina(CATALOGO)
        tarjetas = page.locator("#proximamente .hp-soon")
        self.assertGreater(tarjetas.count(), 0)
        for i in range(tarjetas.count()):
            t = tarjetas.nth(i)
            titulo = t.locator(".hp-soon-title").inner_text().strip()
            href = t.locator("a.hp-btn").get_attribute("href")
            self.assertTrue(href.startswith(f"https://wa.me/{NUMERO}?text="), href)
            self.assertIn(titulo.lower(), unquote(href).lower())

    # ── Casting ─────────────────────────────────────────────────────────────

    def test_casting_valida_y_arma_el_mail_del_selftape(self):
        page = self.pagina("/casting/", movil=True)
        page.wait_for_timeout(2500)
        self.assertEqual(page.locator(".mp-casting-pasos li").count(), 4, "los cuatro pasos de la consigna")
        page.locator("form [type=submit]").first.click()
        page.wait_for_timeout(300)
        self.assertGreater(page.locator("[aria-invalid=true]").count(), 0, "sin datos tiene que avisar")
        page.locator("form input[name=nombre]").fill("Prueba Automática")
        # Sin perfil no deja enviar: es lo que decide qué improvisa.
        page.locator("form [type=submit]").first.click()
        page.wait_for_timeout(300)
        self.assertEqual(page.locator(".mp-casting-done").count(), 0, "sin perfil no se envía")
        page.locator(".mp-casting-opcion", has_text="Freestyler").click()
        page.locator("form [type=submit]").first.click()
        page.wait_for_timeout(600)
        self.assertGreater(page.locator(".mp-casting-done").count(), 0, "tiene que confirmar el armado")
        gmail = unquote(page.locator(".mp-casting-done a.mp-casting-submit").get_attribute("href").replace("+", " "))
        self.assertIn("to=hivridoads@gmail.com", gmail)
        self.assertIn("Selftape RYTMOS · Freestyler · Prueba Automática", gmail)

    # ── WhatsApp ────────────────────────────────────────────────────────────

    def test_whatsapp_un_solo_formato_y_mensaje_en_cada_enlace(self):
        for ruta in RUTAS:
            with self.subTest(ruta=ruta):
                page = self.pagina(ruta, js=False)
                enlaces = page.eval_on_selector_all("a[href*='whatsapp.com'], a[href*='wa.me']", "els => els.map(e => e.href)")
                for href in enlaces:
                    u = urlparse(href)
                    self.assertEqual(u.netloc, "wa.me", f"{ruta}: formato viejo en {href}")
                    self.assertEqual(u.path, f"/{NUMERO}")
                    self.assertTrue(parse_qs(u.query).get("text", [""])[0].strip(), f"{ruta}: enlace sin mensaje")

    def test_boton_flotante_dice_la_seccion(self):
        page = self.pagina("/diseno-web/")
        href = page.locator("a.wa-btn").get_attribute("href")
        self.assertIn("Diseño web", unquote(href))

    def test_boton_flotante_no_tapa_el_cta_en_movil(self):
        page = self.pagina("/diseno-web/", movil=True)
        page.wait_for_timeout(3500)
        a = page.locator("a.wa-btn").bounding_box()
        b = page.locator(".dw-hero-btn").bounding_box()
        solapan = not (a["x"] >= b["x"] + b["width"] or a["x"] + a["width"] <= b["x"] or a["y"] >= b["y"] + b["height"] or a["y"] + a["height"] <= b["y"])
        self.assertFalse(solapan)

    # ── Menú móvil ──────────────────────────────────────────────────────────

    def test_menu_movil_abre_navega_y_cierra(self):
        page = self.pagina("/diseno-web/", movil=True)
        page.wait_for_timeout(3500)
        page.locator(".nav-btn-wrap").click()
        cajon = page.locator("nav.nav-drawer.open")
        cajon.wait_for(state="visible")
        hrefs = cajon.locator(".nav-menu a").evaluate_all("els => els.map(e => e.getAttribute('href'))")
        self.assertIn("/artistas/", hrefs)
        self.assertTrue(all(h.endswith("/") for h in hrefs), hrefs)
        cajon.locator(".nav-menu a", has_text="Artistas").click()
        page.wait_for_url(re.compile(r"/artistas/$"))

    def test_menu_de_play_en_movil(self):
        page = self.pagina(CATALOGO, movil=True)
        page.locator(".hp-tabbar button", has_text="Más").click()
        page.locator("nav.nav-drawer.open").wait_for(state="visible")
        page.keyboard.press("Escape")
        page.wait_for_timeout(600)
        self.assertEqual(page.locator("nav.nav-drawer.open").count(), 0)

    # ── Colmena ─────────────────────────────────────────────────────────────

    def test_colmena_se_usa_con_teclado(self):
        page = self.pagina("/colmena-agentes/")
        page.wait_for_timeout(3500)
        nodo = page.locator(".orb-node").first
        nodo.scroll_into_view_if_needed()
        nodo.focus()
        page.keyboard.press("Enter")
        page.wait_for_timeout(700)
        self.assertEqual(nodo.get_attribute("aria-pressed"), "true")
        self.assertIn("wa.me", page.locator("a", has_text="Activar este agente").get_attribute("href"))

    # ── Sin JavaScript ──────────────────────────────────────────────────────

    def test_sin_javascript_el_contenido_esta_y_se_ve(self):
        for ruta in ["/", CATALOGO, "/web/", "/diseno-web/", "/artistas/", "/play/mia/", "/casting/"]:
            with self.subTest(ruta=ruta):
                page = self.pagina(ruta, js=False)
                page.wait_for_timeout(300)
                self.assertEqual(page.locator("h1").count(), 1)
                self.assertEqual(page.locator(".hv-noscript").count(), 0, "no debe quedar el cartel que tapaba todo")
                h1 = page.locator("h1")
                if ruta != CATALOGO:  # el h1 de la portada de PLAY es solo para lectores
                    self.assertTrue(h1.is_visible())
                texto = page.locator("body").inner_text()
                self.assertGreater(len(texto.split()), 80, "tiene que haber texto visible")
                self.assertNotIn("requiere JavaScript", texto)

    def test_web_lleva_sus_secciones_en_el_html(self):
        page = self.pagina("/web/", js=False)
        self.assertEqual(page.locator(".eco-item").count(), 7)
        for destino in ["/artistas/", "/diseno-web/", "/branding/", "/equipo/", "/publicidad/", "/colmena-agentes/"]:
            self.assertGreater(page.locator(f".eco a[href='{destino}']").count(), 0, destino)

    # ── SEO ─────────────────────────────────────────────────────────────────

    def test_cabeza_de_cada_pagina(self):
        titulos = {}
        for ruta in RUTAS:
            with self.subTest(ruta=ruta):
                page = self.pagina(ruta, js=False)
                self.assertEqual(page.locator("html").get_attribute("lang"), "es-AR")
                titulo = page.title()
                self.assertTrue(titulo)
                self.assertNotIn(titulo, titulos, f"título repetido con {titulos.get(titulo)}")
                titulos[titulo] = ruta
                canon = page.locator("link[rel=canonical]").get_attribute("href")
                self.assertEqual(canon, f"https://hivrido.com{ruta}")
                self.assertTrue(page.locator("meta[name=description]").get_attribute("content"))

    def test_json_ld_valido(self):
        esperado = {
            "/diseno-web/": "Service", "/colmena-agentes/": "Service", "/equipo/": "Person",
            "/play/el-rectangulo-de-angeles/": "Movie", "/okupas/": "TVSeries", "/": "Organization",
        }
        for ruta, tipo in esperado.items():
            with self.subTest(ruta=ruta):
                page = self.pagina(ruta, js=False)
                bloques = page.eval_on_selector_all("script[type='application/ld+json']", "els => els.map(e => e.textContent)")
                self.assertTrue(bloques, "sin JSON-LD")
                tipos = []
                for b in bloques:
                    data = json.loads(b)
                    for nodo in data.get("@graph", [data]):
                        t = nodo.get("@type")
                        tipos += t if isinstance(t, list) else [t]
                self.assertIn(tipo, tipos)
        page = self.pagina("/play/el-rectangulo-de-angeles/", js=False)
        data = json.loads(page.locator("script[type='application/ld+json']").first.text_content())
        obra = data["@graph"][0]
        self.assertEqual(obra["duration"], "PT1H13M")
        self.assertEqual(obra["trailer"]["@type"], "VideoObject")

    # ── Enlaces ─────────────────────────────────────────────────────────────

    def test_no_hay_enlaces_internos_rotos_ni_con_salto(self):
        ctx = self.browser.new_context()
        self.addCleanup(ctx.close)
        vistos, cola, problemas = set(), ["/", "/web/"], []
        while cola:
            ruta = cola.pop()
            if ruta in vistos:
                continue
            vistos.add(ruta)
            r = ctx.request.get(BASE + ruta, max_redirects=0)
            if r.status >= 400:
                problemas.append(f"{r.status} {ruta}")
                continue
            if 300 <= r.status < 400:
                problemas.append(f"{r.status} {ruta} -> {r.headers.get('location')}")
                continue
            if "text/html" not in r.headers.get("content-type", ""):
                continue
            for href in re.findall(r'<a[^>]+href="(/[^"#?]*)', r.text()):
                if href.startswith("//") or href.startswith("/alejandradelfino") or href in vistos:
                    continue
                cola.append(href)
        self.assertGreaterEqual(len(vistos), 35, "el rastreo tiene que llegar a casi todo el sitio")
        self.assertEqual(problemas, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
