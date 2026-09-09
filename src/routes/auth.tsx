import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import {
  PawPrint, Heart, Stethoscope, Mail, Lock, User, Building2,
  ArrowLeft, Eye, EyeOff, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import pawLogoAsset from "@/assets/paw-logo.png.asset.json";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { usePet } from "@/context/PetContext";
import { SPECIES, getSpecies, type SpeciesId } from "@/lib/species";

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

/* Minimal role palettes — pastel purple (owner) / pastel blue (vet), on white */
const OWNER = { accent: "var(--acc-strong)", dark: "var(--acc-strong)", soft: "var(--acc-pale)" };
const VET = { accent: "var(--acc-strong)", dark: "var(--acc-strong)", soft: "var(--acc-pale)" };

const INK = "var(--acc-deep)";
const SUB = "var(--text-placeholder)";
const LINE = "var(--acc-pale)";
const INPUT_BG = "var(--bg-card)";
const DANGER = "var(--accent-red)";
const CARD_SHADOW = "var(--shadow-card)";

type Step = "role" | "auth" | "species" | "profile";
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
  const [species, setSpecies] = useState<SpeciesId>(pet.species ?? "dog");
  const [petName, setPetName] = useState(pet.name ?? "");
  const [breed, setBreed] = useState(getSpecies(pet.species).breeds[0]);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [vax, setVax] = useState<"yes" | "partial" | "unsure" | null>(null);

  const rc = role === "owner" ? OWNER : VET;

  // Preview the selected role's theme while on the auth screen
  useEffect(() => {
    document.documentElement.dataset.role = role;
  }, [role]);

  const sp = getSpecies(species);
  const breedOptions = Array.from(new Set([breed, ...sp.breeds]));

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
      const err = signIn(email.trim(), password, role);
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
      setStep("species");
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
        species,
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
    } else {
      updatePet({ species });
    }
    navigate({ to: "/home" });
  }

  const inputStyle: CSSProperties = {
    width: "100%", height: 52, borderRadius: 16, border: `1px solid ${LINE}`,
    background: INPUT_BG, padding: "0 14px 0 42px", fontSize: 15, color: INK,
    outline: "none", fontFamily: "var(--font-sans)",
  };


  return (
    <div style={{ background: "var(--bg-outside)", minHeight: "100dvh", display: "flex", justifyContent: "center" }}>
      <div
        className="jaipur-buti"
        style={{
          width: "100%", maxWidth: 430, minHeight: "100dvh",
          background: "var(--bg-page)",
          padding: "28px 20px 48px",
          fontFamily: "var(--font-sans)",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Brand header */}
        <div className="flex flex-col items-center" style={{ marginBottom: 30, marginTop: 8 }}>
          <img src={pawLogoAsset.url} alt="Pawsitive logo" style={{ width: 68, height: 68, objectFit: "contain" }} />
          <div style={{ marginTop: 12, fontSize: 30, fontWeight: 500, color: INK, fontFamily: "var(--font-display)" }}>
            Pawsitive
          </div>
          <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500, color: SUB, letterSpacing: "0.02em" }}>
            Smart dog care, made simple
          </div>
        </div>

        {step !== "role" && (
          <button
            onClick={() => { setError(null); setStep(step === "profile" ? "species" : step === "species" ? "auth" : "role"); }}
            className="flex items-center"
            style={{ gap: 4, fontSize: 13, fontWeight: 600, color: SUB, marginBottom: 14 }}
          >
            <ArrowLeft size={15} /> Back
          </button>
        )}

        {/* STEP 1 — role selection */}
        {step === "role" && (
          <>
            <div style={{ textAlign: "center", fontSize: 22, fontWeight: 500, color: INK, fontFamily: "var(--font-display)", marginBottom: 6 }}>
              Welcome
            </div>
            <div style={{ textAlign: "center", fontSize: 13.5, color: SUB, marginBottom: 26, lineHeight: 1.5 }}>
              Choose how you'll use Pawsitive
            </div>

            <RoleCard
              tint={OWNER.accent} soft={OWNER.soft}
              title="Pet Parent"
              desc="Track your animal's health, location and wellbeing"
              icon={
                <div className="relative">
                  <PawPrint size={26} strokeWidth={1.8} style={{ color: OWNER.accent }} />
                  <Heart size={13} style={{ position: "absolute", right: -7, bottom: -3, color: OWNER.dark, fill: OWNER.dark }} />
                </div>
              }
              onClick={() => { setRole("owner"); setError(null); setStep("auth"); }}
            />

            {/* or divider */}
            <div className="flex items-center" style={{ gap: 14, margin: "18px 0" }}>
              <div style={{ flex: 1, height: 1, background: LINE }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: SUB, letterSpacing: "0.16em", textTransform: "uppercase" }}>or</span>
              <div style={{ flex: 1, height: 1, background: LINE }} />
            </div>

            <RoleCard
              tint={VET.accent} soft={VET.soft}
              title="Veterinarian"
              desc="Monitor patients and review health reports"
              icon={
                <div className="relative">
                  <Stethoscope size={26} strokeWidth={1.8} style={{ color: VET.accent }} />
                  <div
                    className="flex items-center justify-center"
                    style={{ position: "absolute", right: -8, bottom: -4, width: 15, height: 15, borderRadius: "50%", background: VET.dark }}
                  >
                    <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1, marginTop: -1 }}>+</span>
                  </div>
                </div>
              }
              onClick={() => { setRole("vet"); setError(null); setStep("auth"); }}
            />

            <button
              onClick={() => navigate({ to: "/home" })}
              style={{ display: "block", margin: "26px auto 0", fontSize: 13, fontWeight: 600, color: SUB, textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Continue as guest
            </button>
          </>
        )}

        {/* STEP 2 — login / signup */}
        {step === "auth" && (
            <div style={{ background: "var(--bg-card)", borderRadius: 24, boxShadow: CARD_SHADOW, border: `1px solid ${LINE}`, padding: "22px 20px" }}>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
              <span
                className="flex items-center justify-center"
                style={{ padding: "4px 12px", borderRadius: 20, background: rc.soft, color: rc.dark, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                {role === "owner" ? "Pet Parent" : "Veterinarian"}
              </span>
            </div>

            {/* mode tabs */}
            <div className="flex" style={{ background: rc.soft, borderRadius: 12, padding: 4, marginBottom: 18 }}>
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(null); }}
                  style={{
                    flex: 1, height: 40, borderRadius: 9, fontSize: 14, fontWeight: 600,
                     background: mode === m ? "var(--bg-card)" : "transparent",
                    color: mode === m ? rc.dark : SUB,
                    boxShadow: mode === m ? "0 1px 4px color-mix(in oklab, var(--acc-deep) 8.0%, transparent)" : "none",
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
                style={{ right: 6, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, color: SUB }}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </Field>

            {error && (
              <div style={{ fontSize: 12.5, fontWeight: 500, color: DANGER, background: "var(--acc-pale)", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleAuthSubmit}
              className="w-full flex items-center justify-center active:scale-[0.98] transition-transform"
              style={{
                 height: 52, borderRadius: 16, fontSize: 15, fontWeight: 600, color: "var(--primary-foreground)", gap: 8,
                background: rc.accent,
                boxShadow: `0 6px 16px ${rc.accent}40`,
              }}
            >
              {mode === "login" ? "Log In" : role === "owner" ? "Continue" : "Create Account"}
              <ChevronRight size={16} />
            </button>

            <div style={{ textAlign: "center", fontSize: 12, color: SUB, marginTop: 14, lineHeight: 1.5 }}>
              {mode === "login" ? "New here? Switch to Sign Up above." : "By signing up you agree to our Terms & Privacy Policy."}
            </div>
          </div>
        )}

        {/* STEP 2b — species selection */}
        {step === "species" && (
          <div style={{ background: "var(--bg-card)", borderRadius: 24, boxShadow: CARD_SHADOW, border: `1px solid ${LINE}`, padding: "22px 20px" }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: INK, fontFamily: "var(--font-display)" }}>What kind of pet do you have?</div>
            <div style={{ fontSize: 12.5, color: SUB, marginTop: 4, marginBottom: 18, lineHeight: 1.5 }}>
              Your dashboard, facts and breed list will be tailored to it.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {SPECIES.map((s) => {
                const active = species === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => { setSpecies(s.id); setBreed(s.breeds[0]); }}
                    className="press-pop flex flex-col items-center justify-center"
                    style={{
                      padding: "16px 8px",
                      borderRadius: 18,
                      border: `1.5px solid ${active ? OWNER.accent : LINE}`,
                      background: active ? OWNER.soft : "var(--bg-card)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: 30, lineHeight: 1 }}>{s.emoji}</span>
                    <span style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: active ? OWNER.accent : INK }}>{s.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => { setError(null); setStep("profile"); }}
              className="w-full flex items-center justify-center active:scale-[0.98] transition-transform"
              style={{
                marginTop: 20, height: 52, borderRadius: 16, fontSize: 15, fontWeight: 600,
                color: "var(--primary-foreground)", gap: 8,
                background: OWNER.accent, boxShadow: `0 6px 16px ${OWNER.accent}40`,
              }}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 3 — owner profile setup */}
        {step === "profile" && (
           <div style={{ background: "var(--bg-card)", borderRadius: 24, boxShadow: CARD_SHADOW, border: `1px solid ${LINE}`, padding: "22px 20px" }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: INK, fontFamily: "var(--font-display)" }}>Set up your {sp.label.toLowerCase()}'s profile</div>
            <div style={{ fontSize: 12.5, color: SUB, marginTop: 4, marginBottom: 18, lineHeight: 1.5 }}>
              Only the pet name is required — you can fill in the rest anytime.
            </div>

            <Label required>{sp.label} Name</Label>
            <Field icon={PawPrint}>
              <input style={inputStyle} placeholder={sp.namePlaceholder} value={petName} onChange={(e) => { setPetName(e.target.value); setError(null); }} />
            </Field>

            <Label>Breed <span style={{ fontWeight: 400, color: SUB }}>({sp.label.toLowerCase()} breeds)</span></Label>
            <Field icon={ChevronRight}>
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
                <Chip key={g} active={gender === g} accent={OWNER.accent} soft={OWNER.soft} onClick={() => setGender(gender === g ? null : g)}>
                  {g === "male" ? "Male" : "Female"}
                </Chip>
              ))}
            </div>

            <Label>Vaccination Status</Label>
            <div className="flex flex-wrap" style={{ gap: 8, marginBottom: 16 }}>
              {([["yes", "Up to date"], ["partial", "Partially"], ["unsure", "Not sure"]] as const).map(([k, label]) => (
                <Chip key={k} active={vax === k} accent="var(--acc2-strong)" soft="var(--acc2-pale)" onClick={() => setVax(vax === k ? null : k)}>
                  {label}
                </Chip>
              ))}
            </div>

            {error && (
              <div style={{ fontSize: 12.5, fontWeight: 500, color: DANGER, background: "var(--acc-pale)", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                {error}
              </div>
            )}

            <button
              onClick={() => handleProfileSubmit(false)}
              className="w-full flex items-center justify-center active:scale-[0.98] transition-transform"
              style={{
                 height: 52, borderRadius: 16, fontSize: 15, fontWeight: 600, color: "var(--primary-foreground)", gap: 8,
                background: OWNER.accent,
                boxShadow: `0 6px 16px ${OWNER.accent}40`,
              }}
            >
              Start Caring <ChevronRight size={16} />
            </button>
            <button
              onClick={() => handleProfileSubmit(true)}
              style={{ display: "block", margin: "12px auto 0", fontSize: 13, fontWeight: 600, color: SUB, textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div className="relative" style={{ marginBottom: 12 }}>
      <Icon size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: SUB, pointerEvents: "none" }} />
      {children}
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: INK, marginBottom: 6, letterSpacing: "0.02em" }}>
      {children} {required && <span style={{ color: OWNER.accent }}>*</span>}
    </div>
  );
}

function RoleCard({
  tint, soft, title, desc, icon, onClick,
}: {
  tint: string; soft: string; title: string; desc: string; icon: React.ReactNode; onClick: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className="w-full flex items-center text-left"
      style={{
        gap: 14,
        background: "var(--bg-card)",
        border: `1px solid ${LINE}`,
        borderRadius: 24,
        padding: "20px 18px",
        boxShadow: CARD_SHADOW,
        transform: pressed ? "scale(0.98)" : "scale(1)",
        transition: "transform 0.15s ease, border-color 0.15s ease",
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: 54, height: 54, borderRadius: 18, background: soft }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 500, color: INK, fontFamily: "var(--font-display)" }}>{title}</div>
        <div style={{ fontSize: 12.5, color: SUB, marginTop: 2, lineHeight: 1.45 }}>{desc}</div>
      </div>
      <ChevronRight size={18} style={{ color: tint, flexShrink: 0 }} />
    </button>
  );
}

function Chip({
  active, accent, soft, onClick, children,
}: {
  active: boolean; accent: string; soft: string; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 16px",
        borderRadius: 14,
        fontSize: 13,
        fontWeight: 600,
        border: `1px solid ${active ? accent : LINE}`,
        background: active ? soft : "var(--bg-card)",
        color: active ? accent : SUB,
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}
