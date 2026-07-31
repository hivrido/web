import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro Follow Fest — by Hivrido | 9 de Mayo · Adrogué",
  description:
    "Aplicá para formar parte de la lista exclusiva de Follow Fest. Una noche diseñada para que tus redes crezcan de verdad. Sábado 9 de Mayo, Adrogué.",
  openGraph: {
    title: "Registro Follow Fest — by Hivrido",
    description: "Aplicá para ser parte de Follow Fest. Sábado 9 de Mayo · Adrogué.",
    images: ["/followfest/followfest.jpeg"],
    type: "website",
  },
};

export default function FollowFestFormLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
