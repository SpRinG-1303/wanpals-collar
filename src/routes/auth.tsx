import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type CSSProperties } from "react";
import {
  PawPrint, Heart, Stethoscope, Mail, Lock, User, Building2,
  ArrowLeft, Eye, EyeOff, Check,
} from "lucide-react";
import { toast } from "sonner";
import logoUrl from "@/assets/logo.png";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { usePet } from "@/context/PetContext";
import { BREEDS } from "@/lib/mock";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Pawsitive" },
      { name: "description", content: "Log in or create your Pawsitive account as a pet parent or veterinarian." },
      { property: "og:title", content: "Sign In — Pawsitive" },
      { property: "og:description", content: "Log in or create your Pawsitive account as a pet parent or veterinarian." },
    ],
  }),
  component: AuthPage,
});

/* Home page palette */
const P = {
  bg: "#FAFAF8",
  card: "#FFFFFF",
  sumi: "#2C2C2C",
  usuzumi: "#8A8A8A",
  divider: "#F5F0EC",
  sakura: "#E8829A",
  sakuraDark: "#C86882",
  sakuraSoft: "#FFF0F3",
  sora: "#5B9BD5",
  soraDark: "#4A83B8",
  soraSoft: "#E8F2FF",
  matcha: "#6BAF92",
  matchaSoft: "#E8F5EE",
  yuzu: "#D4A843",
  border: "#F0ECE8",
  danger: "#E53935",
};
const SHADOW = "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";

type Step = "role" | "auth" | "profile";
type Mode = "login" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { pet, updatePet } = usePet();

  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<UserRole>("owner");
  const [mode, setMode] = useState<Mode>("login");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // auth form
  const [name, setName] = useState("");
  const [clinic, setClinic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // owner profile setup
  const [petName, setPetName] = useState(pet.name ?? "");
  const [breed, setBreed] = useState(pet.breedEn || "Indian Pariah Dog");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [vax, setVax] = useState<"yes" | "partial" | "unsure" | null>(null);

  const accent = role === "owner" ? P.sakura : P.sora;
  const accentDark = role === "owner" ? P.sakuraDark : P.soraDark;
  const accentSoft = role === "owner" ? P.sakuraSoft : P.soraSoft;

  const breedOptions = Array.from(new Set([breed, ...BREEDS.map((b) => b.en)]));

  function validateAuth(): string | null {
    if (mode === "signup" && !name.trim()) return "Please enter your name.";
    if (mode === "signup" && role === "vet" && !clinic.trim()) return "Please enter your clinic name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Please enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  }

  function handleAuthSubmit() {
    const v = validateAuth();
    if (v) { setError(v); return; }
    setError(null);
    if (mode === "login") {
      const err = signIn(email.trim(), password);
      if (err) { setError(err); return; }
      toast.success("Welcome back!");
      navigate({ to: "/home" });
      return;
    }
    const err = signUp({
      role, name: name.trim(), email: email.trim(), password,
      clinic: role === "vet" ? clinic.trim() : undefined,
    });
    if (err) { setError(err); return; }
    if (role === "owner") {
      setStep("profile");
    } else {
      const vetName = /^dr\.?/i.test(name.trim()) ? name.trim() : `Dr. ${name.trim()}`;
      toast.success(`Welcome, ${vetName}!`);
      navigate({ to: "/home" });
    }
  }

  function handleProfileSubmit(skip = false) {
    if (!skip) {
      if (!petName.trim()) { setError("Pet name is required."); return; }
      updatePet({
        name: petName.trim(),
        breedEn: breed,
        breedJp: breed,
        age: age ? Number(age) : null,
        weight: weight ? Number(weight) : null,
        gender,
        vaccinated: vax === "yes",
        vaccinationStatus: vax,
        justCompletedOnboarding: true,
      });
      toast.success(`Profile saved — welcome, ${petName.trim()}!`);
    }
    navigate({ to: "/home" });
  }

  const inputStyle: CSSProperties = {
    width: "100%", height: 50, borderRadius: 14, border: `1.5px solid ${P.border}`,
    background: "#FCFBFA", padding: "0 14px 0 42px", fontSize: 15, color: P.sumi,
    outline: "none", fontFamily: "'Nunito', sans-serif",
  };

  const Field = ({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) => (
    <div className="relative" style={{ marginBottom: 12 }}>
      <Icon size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: P.usuzumi, pointerEvents: "none" }} />
      {children}
    </div>
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ background: `linear-gradient(170deg, ${accentSoft} 0%, ${P.bg} 40%)`, padding: "28px 20px 40px", fontFamily: "'Nunito', sans-serif" }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Brand header */}
        <div className="flex flex-col items-center" style={{ marginBottom: 26 }}>
          <div
            className="flex items-center justify-center"
            style={{ width: 72, height: 72, borderRadius: "50%", background: P.card, border: "2.5px solid #E8829A", boxShadow: "0 8px 24px rgba(232,130,154,0.25)" }}
          >
            <img src={logoUrl} alt="Pawsitive logo" style={{ width: 44, height: 44, objectFit: "contain" }} />
          </div>
          <div style={{ marginTop: 12, fontSize: 26, fontWeight: 900, color: P.sumi, letterSpacing: "-0.02em" }}>Pawsitive</div>
          <div className="flex items-center" style={{ gap: 5, marginTop: 3, fontSize: 12, fontWeight: 600, color: P.usuzumi }}>
            <PawPrint size={12} style={{ color: P.sakura }} /> Smart Dog Care for India
          </div>
        </div>

        {step !== "role" && (
          <button
            onClick={() => { setError(null); setStep(step === "profile" ? "auth" : "role"); }}
            className="flex items-center"
            style={{ gap: 4, fontSize: 13, fontWeight: 700, color: P.usuzumi, marginBottom: 14 }}
          >
            <ArrowLeft size={15} /> Back
          </button>
        )}

        {/* STEP 1 — role selection */}
        {step === "role" && (
          <>
            <div style={{ textAlign: "center", fontSize: 20, fontWeight: 800, color: P.sumi, marginBottom: 4 }}>
              Who's joining today?
            </div>
            <div style={{ textAlign: "center", fontSize: 13, color: P.usuzumi, marginBottom: 20 }}>
              Pick your account type to continue
            </div>

            <RoleCard
              tint={P.sakura} soft={P.sakuraSoft}
              title="Pet Parent"
              desc="Track your dog's health, location & vibes"
              icon={
                <div className="relative">
                  <PawPrint size={30} strokeWidth={2} style={{ color: P.sakura }} />
                  <Heart size={15} style={{ position: "absolute", right: -8, bottom: -4, color: P.sakuraDark, fill: P.sakuraDark }} />
                </div>
              }
              onClick={() => { setRole("owner"); setError(null); setStep("auth"); }}
            />

            {/* or divider */}
            <div className="flex items-center" style={{ gap: 14, margin: "16px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#E8E2DC" }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: P.usuzumi, letterSpacing: "0.18em", textTransform: "uppercase" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#E8E2DC" }} />
            </div>

            <RoleCard
              tint={P.sora} soft={P.soraSoft}
              title="Veterinarian"
              desc="Monitor patients & review sensor reports"
              icon={
                <div className="relative">
                  <Stethoscope size={30} strokeWidth={2} style={{ color: P.sora }} />
                  <div
                    className="flex items-center justify-center"
                    style={{ position: "absolute", right: -9, bottom: -5, width: 16, height: 16, borderRadius: "50%", background: P.soraDark }}
                  >
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 900, lineHeight: 1, marginTop: -1 }}>+</span>
                  </div>
                </div>
              }
              onClick={() => { setRole("vet"); setError(null); setStep("auth"); }}
            />

            <button
              onClick={() => navigate({ to: "/home" })}
              style={{ display: "block", margin: "22px auto 0", fontSize: 13, fontWeight: 700, color: P.usuzumi, textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Continue as guest
            </button>
          </>
        )}

        {/* STEP 2 — login / signup */}
        {step === "auth" && (
          <div style={{ background: P.card, borderRadius: 24, boxShadow: SHADOW, padding: "22px 20px", borderTop: `6px solid ${accent}` }}>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
              <span
                className="flex items-center justify-center"
                style={{ padding: "4px 12px", borderRadius: 20, background: accentSoft, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                {role === "owner" ? "Pet Parent" : "Veterinarian"}
              </span>
            </div>

            {/* mode tabs */}
            <div className="flex" style={{ background: "#F6F3F0", borderRadius: 14, padding: 4, marginBottom: 18 }}>
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(null); }}
                  style={{
                    flex: 1, height: 40, borderRadius: 11, fontSize: 14, fontWeight: 800,
                    background: mode === m ? P.card : "transparent",
                    color: mode === m ? accent : P.usuzumi,
                    boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.18s ease",
                  }}
                >
                  {m === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>

            {mode === "signup" && (
              <Field icon={User}>
                <input style={inputStyle} placeholder={role === "vet" ? "Your name (Dr. ...)" : "Your name"} value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
            )}
            {mode === "signup" && role === "vet" && (
              <Field icon={Building2}>
                <input style={inputStyle} placeholder="Clinic name (e.g. Bandra Pet Hospital)" value={clinic} onChange={(e) => setClinic(e.target.value)} />
              </Field>
            )}
            <Field icon={Mail}>
              <input style={inputStyle} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </Field>
            <Field icon={Lock}>
              <input
                style={{ ...inputStyle, paddingRight: 44 }}
                type={showPw ? "text" : "password"}
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAuthSubmit()}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute flex items-center justify-center"
                style={{ right: 6, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, color: P.usuzumi }}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </Field>

            {error && (
              <div style={{ fontSize: 12, fontWeight: 700, color: P.danger, background: "#FFEBEA", borderRadius: 10, padding: "9px 12px", marginBottom: 12 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleAuthSubmit}
              className="w-full flex items-center justify-center active:scale-[0.98] transition-transform"
              style={{
                height: 54, borderRadius: 14, fontSize: 16, fontWeight: 800, color: "#fff", gap: 8,
                background: `linear-gradient(135deg, ${accent}, ${accentDark})`,
                boxShadow: `0 8px 20px ${accent}59`,
              }}
            >
              <PawPrint size={16} />
              {mode === "login" ? "Log In" : role === "owner" ? "Continue" : "Create Account"}
            </button>

            <div style={{ textAlign: "center", fontSize: 12, color: P.usuzumi, marginTop: 14, lineHeight: 1.5 }}>
              {mode === "login" ? "New here? Switch to Sign Up above." : "By signing up you agree to our Terms & Privacy Policy."}
            </div>
          </div>
        )}

        {/* STEP 3 — owner profile setup */}
        {step === "profile" && (
          <div style={{ background: P.card, borderRadius: 24, boxShadow: SHADOW, padding: "22px 20px", borderTop: `6px solid ${P.sakura}` }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: P.sumi }}>Set up your pet's profile</div>
            <div style={{ fontSize: 12, color: P.usuzumi, marginTop: 3, marginBottom: 18 }}>
              Only the pet name is required — fill the rest anytime.
            </div>

            <Label required>Pet Name</Label>
            <Field icon={PawPrint}>
              <input style={inputStyle} placeholder="e.g. Bruno" value={petName} onChange={(e) => { setPetName(e.target.value); setError(null); }} />
            </Field>

            <Label>Breed <span style={{ fontWeight: 500, color: P.usuzumi }}>(pre-filled from selection)</span></Label>
            <Field icon={Check}>
              <select style={{ ...inputStyle, appearance: "none" }} value={breed} onChange={(e) => setBreed(e.target.value)}>
                {breedOptions.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>

            <div className="flex" style={{ gap: 10 }}>
              <div style={{ flex: 1 }}>
                <Label>Age (yrs)</Label>
                <input style={{ ...inputStyle, padding: "0 12px" }} type="number" min={0} max={30} placeholder="Optional" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <Label>Weight (kg)</Label>
                <input style={{ ...inputStyle, padding: "0 12px" }} type="number" min={0} max={90} placeholder="Optional" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
            </div>
            <div style={{ height: 12 }} />

            <Label>Gender</Label>
            <div className="flex" style={{ gap: 8, marginBottom: 14 }}>
              {(["male", "female"] as const).map((g) => (
                <Chip key={g} active={gender === g} accent={P.sakura} soft={P.sakuraSoft} onClick={() => setGender(gender === g ? null : g)}>
                  {g === "male" ? "Male" : "Female"}
                </Chip>
              ))}
            </div>

            <Label>Vaccination Status</Label>
            <div className="flex flex-wrap" style={{ gap: 8, marginBottom: 16 }}>
              {([["yes", "Up to date"], ["partial", "Partially"], ["unsure", "Not sure"]] as const).map(([k, label]) => (
                <Chip key={k} active={vax === k} accent={P.matcha} soft={P.matchaSoft} onClick={() => setVax(vax === k ? null : k)}>
                  {label}
                </Chip>
              ))}
            </div>

            {error && (
              <div style={{ fontSize: 12, fontWeight: 700, color: P.danger, background: "#FFEBEA", borderRadius: 10, padding: "9px 12px", marginBottom: 12 }}>
                {error}
              </div>
            )}

            <button
              onClick={() => handleProfileSubmit(false)}
              className="w-full flex items-center justify-center active:scale-[0.98] transition-transform"
              style={{
                height: 54, borderRadius: 14, fontSize: 16, fontWeight: 800, color: "#fff", gap: 8,
                background: `linear-gradient(135deg, ${P.sakura}, ${P.sakuraDark})`,
                boxShadow: `0 8px 20px ${P.sakura}59`,
              }}
            >
              <PawPrint size={16} /> Start Caring
            </button>
            <button
              onClick={() => handleProfileSubmit(true)}
              style={{ display: "block", margin: "12px auto 0", fontSize: 13, fontWeight: 700, color: P.usuzumi, textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 800, color: P.sumi, marginBottom: 6, letterSpacing: "0.02em" }}>
      {children} {required && <span style={{ color: P.sakura }}>*</span>}
    </div>
  );
}

function Chip({ active, accent, soft, onClick, children }: { active: boolean; accent: string; soft: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="active:scale-95 transition-transform"
      style={{
        flex: 1, height: 40, borderRadius: 12, fontSize: 13, fontWeight: 700,
        background: active ? soft : "#F9F7F5",
        color: active ? accent : P.usuzumi,
        border: `1.5px solid ${active ? accent : P.border}`,
        whiteSpace: "nowrap", padding: "0 10px",
      }}
    >
      {children}
    </button>
  );
}

function RoleCard({ tint, soft, title, desc, icon, onClick }: { tint: string; soft: string; title: string; desc: string; icon: React.ReactNode; onClick: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className="w-full flex items-center text-left"
      style={{
        gap: 16, padding: "18px 18px", borderRadius: 20, background: P.card,
        border: `1.5px solid ${tint}55`, boxShadow: SHADOW,
        transform: pressed ? "scale(0.98)" : "scale(1)", transition: "transform 0.15s ease",
      }}
    >
      <div className="flex items-center justify-center shrink-0" style={{ width: 64, height: 64, borderRadius: 18, background: soft }}>
        {icon}
      </div>
      <div className="flex-1">
        <div style={{ fontSize: 17, fontWeight: 800, color: P.sumi }}>{title}</div>
        <div style={{ fontSize: 12, color: P.usuzumi, marginTop: 3, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <div
        className="flex items-center justify-center"
        style={{ width: 30, height: 30, borderRadius: "50%", background: soft, color: tint, fontSize: 16, fontWeight: 800 }}
      >
        →
      </div>
    </button>
  );
}
