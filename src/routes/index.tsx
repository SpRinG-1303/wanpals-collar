import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import PhoneFrame from "@/components/PhoneFrame";
import dogImg from "@/assets/fluffy-dog.png";
import pawLogo from "@/assets/paw-heartbeat-pink.png";

export const Route = createFileRoute("/")({ component: Splash });

function Splash() {
  const nav = useNavigate();

  return (
    <PhoneFrame>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          minHeight: "100vh",
          height: "100dvh",
          background:
            "linear-gradient(180deg, #FFE8EF 0%, #FFF8F9 50%, #FFE8EF 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px 24px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* TOP — logo + title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <img src={pawLogo} alt="Pawsitive" style={{ width: 52, height: 52, objectFit: "contain" }} />
          <div style={{ fontSize: 22, fontWeight: 600, color: "#1A1A2E", letterSpacing: "-0.01em" }}>
            Pawsitive Diagnostics
          </div>
          <div style={{ fontSize: 13, fontWeight: 400, color: "#9CA3AF", letterSpacing: "0.1em" }}>
            ポジティブ診断
          </div>
        </motion.div>

        {/* MIDDLE — dog hero */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginTop: -8,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 110, damping: 14 }}
            style={{
              width: "65%",
              maxWidth: 280,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.img
              src={dogImg}
              alt="Fluffy companion"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 1.3 }}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <motion.div
              animate={{ scaleX: [1, 0.85, 1] }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 1.3 }}
              style={{
                width: "40%",
                height: 8,
                marginTop: -4,
                background: "rgba(244, 63, 114, 0.18)",
                borderRadius: "50%",
                filter: "blur(4px)",
              }}
            />
          </motion.div>

          {/* Greeting */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            style={{ marginTop: 20, textAlign: "center", display: "flex", flexDirection: "column", gap: 4 }}
          >
            <div style={{ fontSize: 20, fontWeight: 300, color: "#374151" }}>
              こんにちは！/ Hi there!
            </div>
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>
              あなたの愛犬の健康パートナー
            </div>
            <div style={{ fontSize: 11, color: "#C4B5B8" }}>
              Your dog's health companion
            </div>
          </motion.div>
        </div>

        {/* BOTTOM — CTA */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
        >
          <motion.button
            onClick={() => nav({ to: "/language" })}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                "0 8px 24px rgba(244, 63, 114, 0.35)",
                "0 12px 32px rgba(244, 63, 114, 0.55)",
                "0 8px 24px rgba(244, 63, 114, 0.35)",
              ],
            }}
            transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
            style={{
              width: "80%",
              height: 54,
              borderRadius: 50,
              border: "none",
              background: "linear-gradient(90deg, #F43F72 0%, #FF6B8A 100%)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            はじめる / Get Started
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.3 }}
            style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 2 }}
          >
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>
              すでにアカウントをお持ちですか？
            </div>
            <div style={{ fontSize: 11, color: "#C4B5B8" }}>
              Already have an account?
            </div>
            <button
              onClick={() => nav({ to: "/auth" })}
              style={{
                marginTop: 4,
                background: "none",
                border: "none",
                fontSize: 13,
                color: "#F43F72",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              ログイン / Login
            </button>
          </motion.div>

          {/* Pagination dots */}
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8 }}>
            <span style={{ width: 20, height: 8, borderRadius: 50, background: "#F43F72" }} />
            <span style={{ width: 8, height: 8, borderRadius: 50, background: "#F3D0D9" }} />
            <span style={{ width: 8, height: 8, borderRadius: 50, background: "#F3D0D9" }} />
          </div>
        </motion.div>
      </motion.div>
    </PhoneFrame>
  );
}
