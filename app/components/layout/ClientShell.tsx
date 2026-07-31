"use client";
import { useCallback, useState } from "react";
import Loader from "./Loader";
import Cursor from "../ui/Cursor";
import SmoothScroll from "../ui/SmoothScroll";
import WhatsAppBtn from "../ui/WhatsAppBtn";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, forceUpdate] = useState(0);
  const handleDone = useCallback(() => forceUpdate(n => n + 1), []);

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Loader onDone={handleDone} />
      <WhatsAppBtn />
      <div id="main" className="visible">
        {children}
      </div>
    </>
  );
}
