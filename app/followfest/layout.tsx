import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Follow Fest — by Hivrido | 9 de Mayo · Adrogué",
  description:
    "Una noche diseñada para que tus redes crezcan de verdad. DJ en vivo, stand de glitter, content spots y más. Sábado 9 de Mayo, Adrogué.",
  openGraph: {
    title: "Follow Fest — by Hivrido",
    description: "Una noche diseñada para que tus redes crezcan de verdad. Sábado 9 de Mayo · Adrogué.",
    images: ["/followfest/followfest.jpeg"],
    type: "website",
  },
};

export default function FollowFestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
