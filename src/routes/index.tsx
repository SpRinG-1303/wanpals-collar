import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import PhoneFrame from "@/components/PhoneFrame";

export const Route = createFileRoute("/")({ component: Splash });

function Splash() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => nav({ to: "/language" }), 2000);
    return () => clearTimeout(t);
  }, [nav]);
  return (
    <PhoneFrame>
    <div className="min-h-screen flex flex-col items-center justify-center paw-bg" style={{ background: "linear-gradient(160deg, #FFE4EA 0%, #FAFAFA 100%)" }}>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="w-28 h-28 rounded-full bg-card shadow-card flex items-center justify-center text-6xl">
          🐕
        </div>
      </motion.div>
      <motion.h1
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="mt-6 text-3xl font-black text-primary tracking-tight"
      >
        WanCare
      </motion.h1>
      <p className="text-secondary-foreground/70 text-sm font-bold">ワンケア</p>
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="text-2xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          >🐾</motion.span>
        ))}
      </div>
    </div>
  );
}
