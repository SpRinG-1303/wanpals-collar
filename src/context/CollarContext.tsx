import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * CollarContext — single source of truth for the smart-collar link.
 *
 * No sensor values exist until a collar is connected. While connected, the
 * collar streams live readings (this feed is where the real BLE/backend
 * device payload plugs in — swap `nextSample` for the device listener).
 * When disconnected, every reading is null and the UI shows empty states
 * instead of dummy numbers.
 */

export type SensorKey = "bark" | "skin" | "motion" | "temp" | "pressure" | "light";

export interface LiveReading {
  value: number;
  unit: string;
  /** epoch ms of when the collar reported it */
  at: number;
}

type LiveMap = Record<SensorKey, LiveReading | null>;

const EMPTY_LIVE: LiveMap = {
  bark: null, skin: null, motion: null, temp: null, pressure: null, light: null,
};

export type CollarState = "idle" | "connecting" | "connected";

interface CollarCtx {
  state: CollarState;
  connected: boolean;
  /** device battery % — only known while connected */
  battery: number | null;
  live: LiveMap;
  connect: () => void;
  disconnect: () => void;
}

const Ctx = createContext<CollarCtx | null>(null);
const STORAGE_KEY = "md-collar-connected";

/** One sample from the collar stream. Replace internals with the device payload. */
function nextSample(prev: LiveMap): LiveMap {
  const jitter = (base: number, spread: number, dp = 1) => {
    const v = base + (Math.random() - 0.5) * spread;
    const f = 10 ** dp;
    return Math.round(v * f) / f;
  };
  const at = Date.now();
  return {
    bark: { value: 0, unit: "calm", at }, // classification label handled by pages
    skin: { value: 0, unit: "normal", at },
    motion: { value: Math.round((prev.motion?.value ?? 1200) + Math.random() * 60), unit: "steps", at },
    temp: { value: jitter(38.5, 0.3), unit: "°C", at },
    pressure: { value: jitter(101.3, 0.4), unit: "kPa", at },
    light: { value: Math.round(jitter(320, 80, 0)), unit: "lux", at },
  };
}

export function CollarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CollarState>("idle");
  const [battery, setBattery] = useState<number | null>(null);
  const [live, setLive] = useState<LiveMap>(EMPTY_LIVE);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore a previously linked collar.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setState("connected");
    } catch { /* ignore */ }
  }, []);

  // Live stream only while connected.
  useEffect(() => {
    if (state !== "connected") {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
      setLive(EMPTY_LIVE);
      setBattery(null);
      return;
    }
    setBattery(87);
    setLive((p) => nextSample(p));
    timer.current = setInterval(() => setLive((p) => nextSample(p)), 4000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [state]);

  const connect = useCallback(() => {
    setState((s) => (s === "connected" || s === "connecting" ? s : "connecting"));
    setTimeout(() => {
      setState("connected");
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
    }, 1400);
  }, []);

  const disconnect = useCallback(() => {
    setState("idle");
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  return (
    <Ctx.Provider value={{ state, connected: state === "connected", battery, live, connect, disconnect }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCollar(): CollarCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCollar must be used inside CollarProvider");
  return v;
}
