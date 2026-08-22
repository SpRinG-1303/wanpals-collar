import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Video, ScanSearch, Pill, Activity, Thermometer, Wind, HeartPulse,
  ChevronRight, AlertTriangle, Flame, Stethoscope,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import DogAvatar from "@/components/DogAvatar";
import { useAuth } from "@/context/AuthContext";
import {
  APPOINTMENTS, CURRENT_VITALS, DEFAULT_GAIT, DEFAULT_PANTING, GAIT_FEED,
  PANTING_FEED, SIZE_LABEL, VET_PATIENTS, VITAL_BASELINES, gaitAsymmetry,
  heatStressRisk, riskTagsFor, scratchSpike, scratchWeekFor, type VetPatient,
} from "./vetData";

const T = {
  card: "#FFFFFF",
  ink: "var(--text-primary)",
  sub: "var(--text-secondary)",
  accent: "var(--accent-sakura)",
  accentDark: "var(--accent-sakura-dark)",
  soft: "var(--accent-sakura-soft)",
  pale: "var(--acc-pale)",
  deep: "var(--acc-deep)",
  strong: "var(--acc-strong)",
  green: "#3D9B6E",
  greenSoft: "#E9F6EF",
  amber: "#D9930D",
  amberSoft: "#FCF3E0",
  red: "#D9534F",
  redSoft: "#FBEBEA",
  blue: "var(--accent-sora)",
  blueSoft: "var(--acc2-pale)",
};
const SHADOW = "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";

const TONE: Record<string, { fg: string; bg: string }> = {
  red: { fg: T.red, bg: T.redSoft },
  amber: { fg: T.amber, bg: T.amberSoft },
  blue: { fg: T.blue, bg: T.blueSoft },
};

function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: T.card, borderRadius: 20, boxShadow: SHADOW, ...style }}>{children}</div>
  );
}

function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between" style={{ margin: "22px 0 12px" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, letterSpacing: "-0.01em" }}>{children}</div>
      {right}
    </div>
  );
}

/* Vital row with green-zone bracket scaled to breed size */
function VitalRow({ label, Icon, value, unit, range, decimals = 0 }: {
  label: string; Icon: typeof HeartPulse; value: number; unit: string; range: [number, number]; decimals?: number;
}) {
  const inRange = value >= range[0] && value <= range[1];
  const span = range[1] - range[0];
  const min = range[0] - span * 0.4;
  const max = range[1] + span * 0.4;
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const lo = ((range[0] - min) / (max - min)) * 100;
  const hi = ((range[1] - min) / (max - min)) * 100;
  return (
    <div style={{ padding: "10px 0" }}>
      <div className="flex items-center" style={{ gap: 8 }}>
        <Icon size={16} strokeWidth={2} style={{ color: T.accent, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: T.sub, flex: 1 }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 800, color: T.ink, fontVariantNumeric: "tabular-nums" }}>
          {value.toFixed(decimals)} <span style={{ fontSize: 10, fontWeight: 600, color: T.sub }}>{unit}</span>
        </span>
        <span
          style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", padding: "3px 7px", borderRadius: 8,
            color: inRange ? T.green : T.red, background: inRange ? T.greenSoft : T.redSoft,
          }}
        >
          {inRange ? "NORMAL" : "REVIEW"}
        </span>
      </div>
      <div style={{ position: "relative", height: 8, borderRadius: 4, background: "var(--border-subtle)", marginTop: 7, marginLeft: 24 }}>
        {/* Green zone bracket */}
        <div
          style={{
            position: "absolute", top: 0, bottom: 0, borderRadius: 4,
            left: `${lo}%`, width: `${hi - lo}%`,
            background: "color-mix(in srgb, #3D9B6E 30%, transparent)",
          }}
        />
        <div
          style={{
            position: "absolute", top: -2, width: 4, height: 12, borderRadius: 2,
            left: `calc(${pct}% - 2px)`, background: inRange ? T.green : T.red,
          }}
        />
      </div>
      <div className="flex justify-between" style={{ marginLeft: 24, marginTop: 3 }}>
        <span style={{ fontSize: 9, color: T.sub }}>Normal {range[0]}–{range[1]} {unit} · {range === VITAL_BASELINES.toy.hr ? "" : ""}</span>
      </div>
    </div>
  );
}

/* Scratch & shake sparkline */
function ScratchCard({ patient }: { patient: VetPatient }) {
  const week = scratchWeekFor(patient.id);
  const { spike, pct } = scratchSpike(week);
  const max = Math.max(...week.map((d) => d.events));
  return (
    <Card style={{ padding: 14 }}>
      <div className="flex items-center" style={{ gap: 8 }}>
        <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 11, background: spike ? T.redSoft : T.pale, flexShrink: 0 }}>
          <Activity size={17} strokeWidth={2} style={{ color: spike ? T.red : T.accent }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Scratch & Shake Index</div>
          <div style={{ fontSize: 10, color: T.sub }}>MotionSense · neck scratch + head shake frequency</div>
        </div>
        {spike && (
          <span style={{ fontSize: 9, fontWeight: 800, color: T.red, background: T.redSoft, borderRadius: 8, padding: "3px 7px", letterSpacing: "0.04em" }}>
            +{pct}% SPIKE
          </span>
        )}
      </div>
      <div className="flex items-end" style={{ gap: 6, height: 52, marginTop: 12, paddingLeft: 2 }}>
        {week.map((d) => {
          const isToday = d.day === "Today";
          const h = Math.max(14, (d.events / max) * 100);
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center" style={{ gap: 4 }}>
              <div
                style={{
                  width: "100%", maxWidth: 22, height: `${h}%`, minHeight: 6, borderRadius: 5,
                  background: isToday ? (spike ? T.red : T.accent) : "var(--acc2-soft)",
                }}
                aria-label={`${d.day}: ${d.events} events`}
              />
              <span style={{ fontSize: 8.5, fontWeight: isToday ? 700 : 500, color: isToday ? T.ink : T.sub }}>{d.day}</span>
            </div>
          );
        })}
      </div>
      {spike && (
        <div className="flex items-start" style={{ gap: 7, marginTop: 10, background: T.redSoft, borderRadius: 12, padding: "9px 11px" }}>
          <AlertTriangle size={14} strokeWidth={2.2} style={{ color: T.red, flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11, lineHeight: 1.45, color: T.red, fontWeight: 600 }}>
            Scratching is up {pct}% this week — check for ear infection or fleas/ticks before the owner mentions it.
          </span>
        </div>
      )}
    </Card>
  );
}

/* Thermal panting correlator */
function PantingCard({ patient }: { patient: VetPatient }) {
  const feed = PANTING_FEED[patient.id] ?? DEFAULT_PANTING;
  const risk = heatStressRisk(feed);
  const tone = risk === "high" ? { fg: T.red, bg: T.redSoft, label: "Heat Stress Warning" }
    : risk === "moderate" ? { fg: T.amber, bg: T.amberSoft, label: "Watch for overheating" }
    : { fg: T.green, bg: T.greenSoft, label: "Thermally comfortable" };
  return (
    <Card style={{ padding: 14 }}>
      <div className="flex items-center" style={{ gap: 8 }}>
        <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 11, background: tone.bg, flexShrink: 0 }}>
          <Flame size={17} strokeWidth={2} style={{ color: tone.fg }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Thermal Panting Correlator</div>
          <div style={{ fontSize: 10, color: T.sub }}>TempSense + BarkSense acoustic fusion</div>
        </div>
      </div>
      <div className="flex" style={{ gap: 8, marginTop: 12 }}>
        {[
          { label: "Ambient", val: `${feed.ambientC}°C` },
          { label: "Panting", val: `${feed.pantingPerMin}/min` },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, background: T.pale, borderRadius: 12, padding: "9px 11px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: T.sub, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center" style={{ gap: 7, marginTop: 10, background: tone.bg, borderRadius: 12, padding: "9px 11px" }}>
        <span className="relative" style={{ width: 8, height: 8, flexShrink: 0 }}>
          {risk !== "low" && <span className="pulse-dot" style={{ position: "absolute", inset: 0, color: tone.fg }} />}
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: tone.fg }} />
        </span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: tone.fg }}>
          {tone.label}
          {risk === "high" && " — advise shade, water and rest immediately."}
        </span>
      </div>
    </Card>
  );
}

/* Gait asymmetry radar — 4-leg weight distribution diamond */
function GaitCard({ patient }: { patient: VetPatient }) {
  const readings = GAIT_FEED[patient.id] ?? DEFAULT_GAIT;
  const { flag, worst, deficit } = gaitAsymmetry(readings);
  // Radar: axes order Front L (top), Front R (right), Hind R (bottom), Hind L (left)
  const order = ["Front L", "Front R", "Hind R", "Hind L"];
  const pts = order.map((leg) => readings.find((r) => r.leg === leg)?.pct ?? 25);
  const C = 60, R = 44, MAXP = 34;
  const toXY = (i: number, v: number): [number, number] => {
    const ang = (Math.PI / 2) * i - Math.PI / 2;
    const r = (v / MAXP) * R;
    return [C + r * Math.cos(ang), C + r * Math.sin(ang)];
  };
  const poly = pts.map((v, i) => toXY(i, v).join(",")).join(" ");
  const idealPoly = order.map((_, i) => toXY(i, 25).join(",")).join(" ");
  return (
    <Card style={{ padding: 14 }}>
      <div className="flex items-center" style={{ gap: 8 }}>
        <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 11, background: flag ? T.amberSoft : T.pale, flexShrink: 0 }}>
          <ScanSearch size={17} strokeWidth={2} style={{ color: flag ? T.amber : T.accent }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Gait Asymmetry Radar</div>
          <div style={{ fontSize: 10, color: T.sub }}>Weight distribution per leg · MotionSense</div>
        </div>
      </div>
      <div className="flex items-center" style={{ gap: 12, marginTop: 8 }}>
        <svg viewBox="0 0 120 120" style={{ width: 116, height: 116, flexShrink: 0 }}>
          {[0.5, 0.75, 1].map((f) => (
            <polygon key={f} points={order.map((_, i) => toXY(i, MAXP * f).join(",")).join(" ")} fill="none" stroke="var(--border-card)" strokeWidth="1" />
          ))}
          {order.map((_, i) => {
            const [x, y] = toXY(i, MAXP);
            return <line key={i} x1={C} y1={C} x2={x} y2={y} stroke="var(--border-card)" strokeWidth="1" />;
          })}
          {/* Ideal 25% square */}
          <polygon points={idealPoly} fill="none" stroke={T.green} strokeWidth="1.2" strokeDasharray="3 3" />
          {/* Actual */}
          <polygon points={poly} fill="color-mix(in srgb, var(--accent-sakura) 25%, transparent)" stroke={T.accent} strokeWidth="1.6" />
          {pts.map((v, i) => {
            const [x, y] = toXY(i, v);
            const isWorst = flag && order[i] === worst.leg;
            return <circle key={i} cx={x} cy={y} r={isWorst ? 4 : 2.6} fill={isWorst ? T.red : T.accent} />;
          })}
          {/* Labels */}
          {order.map((leg, i) => {
            const [x, y] = toXY(i, MAXP + 6);
            const short = leg.replace("Front ", "FL ").replace("Hind ", "HL ").replace(" L", "L").replace(" R", "R").replace(" ", "");
            return (
              <text key={leg} x={x} y={y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 8.5, fontWeight: 700, fill: flag && leg === worst.leg ? T.red : T.sub }}>
                {short}
              </text>
            );
          })}
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          {readings.map((r) => (
            <div key={r.leg} className="flex items-center" style={{ gap: 6, marginBottom: 5 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: T.sub, width: 48 }}>{r.leg}</span>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--border-subtle)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(r.pct / 34) * 100}%`, borderRadius: 3, background: flag && r.leg === worst.leg ? T.red : T.accent }} />
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: flag && r.leg === worst.leg ? T.red : T.ink, width: 32, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      {flag && (
        <div className="flex items-start" style={{ gap: 7, marginTop: 8, background: T.amberSoft, borderRadius: 12, padding: "9px 11px" }}>
          <AlertTriangle size={14} strokeWidth={2.2} style={{ color: T.amber, flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11, lineHeight: 1.45, color: T.amber, fontWeight: 600 }}>
            {worst.leg} leg is bearing {deficit}% less weight — high probability of osteoarthritis or an ACL tear. Recommend orthopaedic exam.
          </span>
        </div>
      )}
    </Card>
  );
}

export default function VetHome() {
  const { session } = useAuth();
  const [patientId, setPatientId] = useState(VET_PATIENTS[0].id);
  const patient = VET_PATIENTS.find((p) => p.id === patientId) ?? VET_PATIENTS[0];
  const tags = riskTagsFor(patient);
  const vitals = CURRENT_VITALS[patient.id] ?? { hr: 90, temp: 38.5, rr: 20 };
  const base = VITAL_BASELINES[patient.size];
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const drName = session?.name ? `Dr. ${session.name.split(" ")[0]}` : "Doctor";

  return (
    <AppShell titleJp="" titleEn="" noPadding>
      <div style={{ padding: "8px 16px 0" }}>
        {/* Greeting */}
        <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
          <div>
            <div style={{ fontSize: 11, color: T.sub, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>Veterinary Console</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: T.ink, letterSpacing: "-0.01em", marginTop: 2 }}>
              {greet}, {drName}
            </div>
          </div>
          <div className="flex items-center justify-center" style={{ width: 42, height: 42, borderRadius: 14, background: T.pale, color: T.accent }}>
            <Stethoscope size={20} strokeWidth={1.9} />
          </div>
        </div>

        {/* Today's schedule */}
        <div
          style={{
            marginTop: 16, borderRadius: 20, padding: 16, position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg, var(--accent-sakura) 0%, var(--accent-sakura-dark) 100%)",
            boxShadow: "0 10px 28px color-mix(in oklab, var(--accent-sakura) 40%, transparent)",
          }}
        >
          <div style={{ position: "absolute", top: -26, right: 36, width: 84, height: 84, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Today's Consults · {APPOINTMENTS.length}
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {APPOINTMENTS.map((a) => {
              const p = VET_PATIENTS.find((x) => x.id === a.patientId)!;
              return (
                <button
                  key={a.time + a.patientId}
                  onClick={() => setPatientId(a.patientId)}
                  className="flex items-center active:scale-[0.98] transition-transform"
                  style={{ gap: 10, background: "rgba(255,255,255,0.14)", borderRadius: 14, padding: "9px 12px", border: "none", textAlign: "left" }}
                >
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums", width: 40 }}>{a.time}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#fff" }}>{p.name} · {p.breed}</span>
                    <span style={{ display: "block", fontSize: 10.5, color: "rgba(255,255,255,0.85)", marginTop: 1 }}>{a.reason}</span>
                  </span>
                  {a.type === "Video" && <Video size={15} strokeWidth={2} style={{ color: "#fff", flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Patient switcher */}
        <SectionTitle>Canine Profile</SectionTitle>
        <div className="flex scrollbar-hide" style={{ gap: 8, overflowX: "auto", margin: "-4px -16px 12px", padding: "4px 16px" }}>
          {VET_PATIENTS.map((p) => {
            const active = p.id === patientId;
            return (
              <button
                key={p.id}
                onClick={() => setPatientId(p.id)}
                className="active:scale-95 transition-transform"
                style={{
                  flexShrink: 0, borderRadius: 14, padding: "7px 13px", fontSize: 12, fontWeight: 700,
                  border: active ? "none" : "1.5px solid var(--border-card)",
                  background: active ? T.accent : T.card, color: active ? "#fff" : T.sub,
                  boxShadow: active ? "0 4px 12px color-mix(in oklab, var(--accent-sakura) 35%, transparent)" : "none",
                }}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Canine profile header */}
        <Card style={{ padding: 16 }}>
          <div className="flex items-center" style={{ gap: 13 }}>
            <DogAvatar breed={patient.breedKey} size={64} ring />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center" style={{ gap: 7 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: T.ink, letterSpacing: "-0.01em" }}>{patient.name}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.sub, background: T.pale, borderRadius: 7, padding: "3px 7px", letterSpacing: "0.04em" }}>
                  {SIZE_LABEL[patient.size].toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>
                {patient.breed} · {patient.age} · {patient.weightKg} kg
              </div>
              <div style={{ fontSize: 11, color: T.sub, marginTop: 1 }}>Owner: {patient.owner}</div>
            </div>
          </div>
          {/* Breed-specific risk tags */}
          <div className="flex flex-wrap" style={{ gap: 6, marginTop: 12 }}>
            {tags.map((t) => (
              <span
                key={t.label}
                style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.02em",
                  color: TONE[t.tone].fg, background: TONE[t.tone].bg,
                  borderRadius: 9, padding: "5px 9px",
                }}
              >
                {t.label}
              </span>
            ))}
          </div>
          {patient.conditions.length > 0 && (
            <div style={{ marginTop: 10, fontSize: 11, color: T.sub, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: T.ink }}>History: </span>
              {patient.conditions.join(" · ")}
            </div>
          )}
        </Card>

        {/* Vital baselines */}
        <Card style={{ padding: "14px 16px", marginTop: 12 }}>
          <div className="flex items-center justify-between">
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Live Vitals</div>
            <span style={{ fontSize: 9.5, fontWeight: 600, color: T.sub }}>
              Green zone scaled for {SIZE_LABEL[patient.size].toLowerCase()}s
            </span>
          </div>
          <VitalRow label="Heart rate" Icon={HeartPulse} value={vitals.hr} unit="bpm" range={base.hr} />
          <div style={{ height: 1, background: "var(--border-subtle)" }} />
          <VitalRow label="Body temp" Icon={Thermometer} value={vitals.temp} unit="°C" range={base.temp} decimals={1} />
          <div style={{ height: 1, background: "var(--border-subtle)" }} />
          <VitalRow label="Respiratory" Icon={Wind} value={vitals.rr} unit="rpm" range={base.rr} />
        </Card>

        {/* Collar telemetry */}
        <SectionTitle>Collar Telemetry</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ScratchCard patient={patient} />
          <PantingCard patient={patient} />
          <GaitCard patient={patient} />
        </div>

        {/* Tools */}
        <SectionTitle>Consult Tools</SectionTitle>
        <div className="flex" style={{ gap: 20, marginBottom: 24 }}>
          {[
            { to: "/vet-consult", Icon: ScanSearch, label: "Body Map", sub: "Tap-to-log exam", bg: T.pale, fg: T.accent },
            { to: "/vet-rx", Icon: Pill, label: "e-Rx & Toxins", sub: "Safety engine", bg: T.blueSoft, fg: T.deep },
          ].map((q) => (
            <Link key={q.label} to={q.to} className="flex flex-col items-center active:scale-95 transition-transform" style={{ width: 76, gap: 7 }} aria-label={q.label}>
              <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: "50%", background: q.bg, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                <q.Icon size={23} strokeWidth={1.8} style={{ color: q.fg }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.ink, lineHeight: 1.2 }}>{q.label}</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: T.sub, marginTop: 1 }}>{q.sub}</div>
              </div>
            </Link>
          ))}
          <Link
            to="/vet-consult"
            className="flex-1 flex items-center active:scale-[0.98] transition-transform"
            style={{
              gap: 10, background: T.accent, borderRadius: 18, padding: "0 16px", minHeight: 64,
              boxShadow: "0 8px 20px color-mix(in oklab, var(--accent-sakura) 35%, transparent)",
            }}
          >
            <Video size={20} strokeWidth={2} style={{ color: "#fff", flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>Start Consult</span>
            <ChevronRight size={17} strokeWidth={2.4} style={{ color: "#fff" }} />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
