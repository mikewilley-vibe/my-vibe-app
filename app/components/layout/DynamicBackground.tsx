"use client";

import { useEffect, useState } from "react";
import { isPersonalMode } from "@/lib/appConfig";

export default function DynamicBackground({ children }: { children: React.ReactNode }) {
  const [isPersonal, setIsPersonal] = useState(false);

  useEffect(() => {
    setIsPersonal(isPersonalMode());
  }, []);

  const backgroundImage = isPersonal ? "/images/background.png" : "/images/space.png";

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-50 relative"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {children}
    </div>
  );
}
