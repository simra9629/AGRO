import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";

export function Splash() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("agro_splash_shown")) {
      setShow(false);
      return;
    }
    sessionStorage.setItem("agro_splash_shown", "1");
    const t1 = setTimeout(() => setFade(true), 700);
    const t2 = setTimeout(() => setShow(false), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center agro-gradient transition-opacity duration-300 ${fade ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse" />
      <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-amber-alert/20 blur-3xl" />
      <div className="relative flex flex-col items-center text-white">
        <div className="relative h-24 w-24 rounded-3xl bg-white/15 backdrop-blur-md ring-1 ring-white/30 flex items-center justify-center shadow-glow animate-[float_2s_ease-in-out_infinite]">
          <Sprout className="h-12 w-12 text-white" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">AGRO</h1>
        <p className="mt-2 text-xs uppercase tracking-[0.4em] text-white/80">Intelligence for farmers</p>
        <div className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-1/2 bg-white animate-[slide_1s_ease-in-out_infinite]" />
        </div>
      </div>
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
      `}</style>
    </div>
  );
}
