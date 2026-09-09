import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type SensorKey = "skin" | "motion" | "temp" | "pressure" | "light";

export interface LiveReading {
  value: number;
  unit: string;
  /** epoch ms of when the collar reported it */
  at: number;
}

type LiveMap = Record<SensorKey, LiveReading | null>;

const EMPTY_LIVE: LiveMap = {
  skin: null, motion: null, temp: null, pressure: null, light: null,
};

export type CollarState = "idle" | "connecting" | "connected";

interface CollarCtx {
  state: CollarState;
  connected: boolean;
  /** true once at least one real packet has been received from the collar */
  receiving: boolean;
  /** device battery % — only known once the collar reports it */
  battery: number | null;
  live: LiveMap;
  /** last connection/parsing problem, if any */
  error: string | null;
  connect: () => void;
  disconnect: () => void;
}

const Ctx = createContext<CollarCtx | null>(null);

/* Nordic UART Service — the standard BLE serial profile most ESP32 sketches use */
const UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"; // collar -> phone (notify)
const BATTERY_SERVICE = 0x180f;
const BATTERY_LEVEL = 0x2a19;

const UNITS: Record<SensorKey, string> = {
  skin: "", motion: "steps", temp: "°C", pressure: "kPa", light: "lux",
};

interface BLEDevice {
  gatt?: { connect: () => Promise<BLEServer>; disconnect: () => void; connected: boolean };
  addEventListener: (t: string, fn: () => void) => void;
}
interface BLEServer { getPrimaryService: (s: string | number) => Promise<BLEService> }
interface BLEService { getCharacteristic: (c: string | number) => Promise<BLEChar> }
interface BLEChar {
  startNotifications: () => Promise<void>;
  readValue: () => Promise<DataView>;
  addEventListener: (t: string, fn: (e: Event) => void) => void;
}

/** Parse one text packet from the collar into live readings.
 *  Accepts JSON like {"temp":38.5,"motion":12} or lines like "temp:38.5". */
function parsePacket(text: string, prev: LiveMap): { live: LiveMap; battery: number | null; got: boolean } {
  const live: LiveMap = { ...prev };
  let battery: number | null = null;
  let got = false;

  const set = (key: string, raw: unknown) => {
    const v = typeof raw === "number" ? raw : parseFloat(String(raw));
    if (Number.isNaN(v)) return;
    if (key === "battery" || key === "batt") { battery = Math.round(v); got = true; return; }
    if (key in UNITS) {
      live[key as SensorKey] = { value: v, unit: UNITS[key as SensorKey], at: Date.now() };
      got = true;
    }
  };

  const trimmed = text.trim();
  if (!trimmed) return { live, battery, got };
  try {
    const obj = JSON.parse(trimmed) as Record<string, unknown>;
    for (const [k, v] of Object.entries(obj)) set(k.toLowerCase(), v);
    return { live, battery, got };
  } catch { /* not JSON — fall through to key:value parsing */ }
  for (const part of trimmed.split(/[\n;,]+/)) {
    const m = part.match(/^\s*([a-zA-Z]+)\s*[:=]\s*(-?[\d.]+)/);
    if (m) set(m[1].toLowerCase(), m[2]);
  }
  return { live, battery, got };
}

import { appendReading, type HistoryKey } from "@/lib/sensorHistory";

export function CollarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CollarState>("idle");
  const [battery, setBattery] = useState<number | null>(null);
  const [live, setLive] = useState<LiveMap>(EMPTY_LIVE);
  // Persist every real reading so the health report can show true history.
  useEffect(() => {
    (Object.keys(live) as SensorKey[]).forEach((k) => {
      const r = live[k];
      if (r && typeof r.value === "number") appendReading(k as HistoryKey, r.value, r.at ?? Date.now());
    });
  }, [live]);
  const [receiving, setReceiving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deviceRef = useRef<BLEDevice | null>(null);
  const bufferRef = useRef("");

  const teardown = useCallback(() => {
    deviceRef.current = null;
    setState("idle");
    setLive(EMPTY_LIVE);
    setBattery(null);
    setReceiving(false);
  }, []);

  const connect = useCallback(() => {
    const nav = navigator as Navigator & { bluetooth?: { requestDevice: (o: unknown) => Promise<BLEDevice> } };
    if (!nav.bluetooth) {
      setError("This browser doesn't support Bluetooth. Open the app in Chrome on your phone.");
      return;
    }
    setError(null);
    setState("connecting");

    void (async () => {
      try {
        const device = await nav.bluetooth!.requestDevice({
          filters: [{ services: [UART_SERVICE] }, { namePrefix: "MOooMENTUM" }, { namePrefix: "ESP32" }],
          optionalServices: [UART_SERVICE, BATTERY_SERVICE],
        });
        device.addEventListener("gattserverdisconnected", teardown);
        const server = await device.gatt!.connect();
        deviceRef.current = device;

        const service = await server.getPrimaryService(UART_SERVICE);
        const tx = await service.getCharacteristic(UART_TX);
        await tx.startNotifications();
        tx.addEventListener("characteristicvaluechanged", (e) => {
          const dv = (e.target as unknown as { value: DataView }).value;
          bufferRef.current += new TextDecoder().decode(dv);
          // process complete packets (newline-delimited); keep partial tail
          const parts = bufferRef.current.split("\n");
          bufferRef.current = parts.pop() ?? "";
          for (const line of parts) {
            const { live: next, battery: b, got } = parsePacket(line, EMPTY_LIVE);
            if (!got) continue;
            setLive((prev) => ({ ...prev, ...Object.fromEntries(
              (Object.keys(next) as SensorKey[]).filter((k) => next[k]).map((k) => [k, next[k]]),
            ) }));
            if (b != null) setBattery(b);
            setReceiving(true);
          }
          // also try parsing the tail when the sketch sends without newlines
          if (bufferRef.current.length > 2 && /[:={]/.test(bufferRef.current)) {
            const { live: next, battery: b, got } = parsePacket(bufferRef.current, EMPTY_LIVE);
            if (got) {
              setLive((prev) => ({ ...prev, ...Object.fromEntries(
                (Object.keys(next) as SensorKey[]).filter((k) => next[k]).map((k) => [k, next[k]]),
              ) }));
              if (b != null) setBattery(b);
              setReceiving(true);
              bufferRef.current = "";
            }
          }
        });

        // battery level is optional — don't fail the connection without it
        try {
          const bs = await server.getPrimaryService(BATTERY_SERVICE);
          const bl = await bs.getCharacteristic(BATTERY_LEVEL);
          const dv = await bl.readValue();
          setBattery(dv.getUint8(0));
        } catch { /* no battery service on this collar */ }

        setState("connected");
      } catch (err) {
        teardown();
        const msg = err instanceof Error ? err.message : String(err);
        setError(/cancel|cancelled|User cancelled/i.test(msg)
          ? null // user closed the picker — silent
          : "Couldn't connect to the collar. Make sure it's on and nearby, then try again.");
      }
    })();
  }, [teardown]);

  const disconnect = useCallback(() => {
    try { deviceRef.current?.gatt?.disconnect(); } catch { /* ignore */ }
    teardown();
  }, [teardown]);

  useEffect(() => () => { try { deviceRef.current?.gatt?.disconnect(); } catch { /* ignore */ } }, []);

  return (
    <Ctx.Provider value={{
      state, connected: state === "connected", receiving, battery, live, error, connect, disconnect,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCollar(): CollarCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCollar must be used inside CollarProvider");
  return v;
}
