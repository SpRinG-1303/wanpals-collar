import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { ChevronRight, Sun, Moon, Crown, User, X, PawPrint, Plus, Trash2, Check, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useT, useLanguage, type Language } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { usePet } from "@/context/PetContext";
import { LANGUAGE_COUNT, getDisplayLanguage } from "@/lib/languages";
import { getSpecies } from "@/lib/species";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const nav = useNavigate();
  const t = useT();
  const { language, setLanguage } = useLanguage();
  const [displayLang] = useState(getDisplayLanguage);
  const { session, signOut, updateProfile } = useAuth();
  const [dark, setDark] = useState(false);
  const [editField, setEditField] = useState<"name" | "email" | "password" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [shareData, setShareData] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ---- Multi-pet management ----
  const { pet, updatePet } = usePet();
  const PETS_KEY = "pawsitive_pets";
  type PetEntry = { id: string; name: string; breed: string };
  const [pets, setPets] = useState<PetEntry[]>([]);
  const [addPetOpen, setAddPetOpen] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const [newPetBreed, setNewPetBreed] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(PETS_KEY);
      if (raw) setPets(JSON.parse(raw) as PetEntry[]);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistPets = (next: PetEntry[]) => {
    setPets(next);
    try { localStorage.setItem(PETS_KEY, JSON.stringify(next)); } catch {}
  };

  // If no list stored yet, show the current profile pet as the single entry.
  const displayPets: PetEntry[] = pets.length
    ? pets
    : pet.name
      ? [{ id: "current", name: pet.name, breed: pet.breedEn || pet.breed || "Mixed" }]
      : [];

  function switchPet(p: PetEntry) {
    updatePet({ name: p.name, breed: p.breed, breedEn: p.breed, breedJp: p.breed, species: "dog" });
    toast.success(`Switched to ${p.name}`);
  }

  function savePet() {
    const name = newPetName.trim();
    if (!name) { toast.error("Please enter your pet's name."); return; }
    const sp = getSpecies("dog");
    const breed = newPetBreed.trim() || sp.breeds[0];
    const entry: PetEntry = { id: `p${Date.now()}`, name, breed };
    persistPets([...(pets.length ? pets : displayPets), entry]);
    updatePet({ name: entry.name, breed: entry.breed, breedEn: entry.breed, breedJp: entry.breed, species: "dog" });
    toast.success(`${name} was added to your family.`);
    setAddPetOpen(false);
    setNewPetName("");
    setNewPetBreed("");
  }

  function removePet(id: string) {
    const removed = pets.find((p) => p.id === id);
    const next = pets.filter((p) => p.id !== id);
    persistPets(next);
    if (removed && removed.name === pet.name && next.length > 0) switchPet(next[0]);
    toast.success("Pet removed.");
  }


  function saveEdit() {
    if (!editField) return;
    const v = editValue.trim();
    if (editField !== "password" && !v) { toast.error("Please enter a value."); return; }
    if (editField === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { toast.error("Please enter a valid email."); return; }
    if (editField === "password" && v.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    const err = updateProfile({ [editField]: v });
    if (err) { toast.error(err); return; }
    toast.success("Profile updated.");
    setEditField(null);
    setEditValue("");
  }

  function exportData() {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("pawsitive") || k.startsWith("wancare"))) {
        try { data[k] = JSON.parse(localStorage.getItem(k) ?? ""); } catch { data[k] = localStorage.getItem(k); }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pawsitive-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Your data has been downloaded.");
  }

  function handleSignOut() {
    signOut();
    toast.success("Signed out. See you soon!");
    nav({ to: "/auth", replace: true });
  }

  function deleteAccount() {
    try {
      localStorage.removeItem("pawsitive_session");
      localStorage.removeItem("pawsitive_users");
    } catch {}
    signOut();
    setConfirmDelete(false);
    toast.success("Account deleted.");
    nav({ to: "/auth" });
  }
  useEffect(() => {
    if (typeof window === "undefined") return;
    const d = localStorage.getItem("wancare-theme") === "dark";
    setDark(d);
    document.getElementById("mooomentum-frame")?.classList.toggle("dark", d);
  }, []);
  const toggleDark = (v: boolean) => {
    setDark(v);
    document.getElementById("mooomentum-frame")?.classList.toggle("dark", v);
    if (typeof window !== "undefined") localStorage.setItem("wancare-theme", v ? "dark" : "light");
  };

  const langLabel: Record<Language, string> = {
    english: "English",
    japanese: "English",
    mixed: "English",
  };

  return (
    <AppShell titleJp=" 設定" titleEn=" Settings">
      <div className="bg-card rounded-3xl border border-border p-5 shadow-card flex items-center gap-3">
        <div className="relative">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--accent-sakura-soft)", border: "1.5px solid var(--acc-soft)" }}>
            <User size={26} style={{ color: "var(--accent-sakura)" }} />
          </div>
        </div>
        <div>
          <div className="font-bold">{session?.name || "Pet Parent"}</div>
          <div className="text-xs text-muted-foreground">{session?.email || "Signed in"}</div>
        </div>
      </div>

      <Section title={t("プロフィール", "Profile")}>
        <Row label={t("メールを変更", "Change Email")} onClick={() => { setEditField("email"); setEditValue(session?.email ?? ""); }}/>
        <Row label={t("名前を変更", "Change Name")} onClick={() => { setEditField("name"); setEditValue(session?.name ?? ""); }}/>
        <Row label={t("パスワード変更", "Change Password")} onClick={() => { setEditField("password"); setEditValue(""); }}/>
      </Section>

      <Section title={t("表示", "Appearance")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold">
            {dark
              ? <Moon className="w-5 h-5" style={{ color: "var(--acc-strong)" }} />
              : <Sun className="w-5 h-5" style={{ color: "var(--accent-yuzu)" }} />}
            <span>{dark ? t("ダークモード", "Dark Mode") : t("ライトモード", "Light Mode")}</span>
          </div>
          <button
            onClick={() => toggleDark(!dark)}
            aria-label="Toggle dark mode"
            style={{
              width: 52, height: 28, borderRadius: 14, position: "relative",
              background: dark ? "var(--accent-fuji)" : "var(--border-card)",
              transition: "background 0.3s ease",
            }}
          >
            <span
              style={{
                position: "absolute", top: 3, left: dark ? 27 : 3,
                width: 22, height: 22, borderRadius: "50%",
                background: "#FFFFFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                transition: "left 0.3s ease",
              }}
            />
          </button>
        </div>
      </Section>

      <Section title={t("言語", "Language")}>
        <button
          onClick={() => nav({ to: "/language" })}
          className="w-full text-left text-sm flex items-center justify-between"
          style={{ padding: "12px 14px", borderRadius: 14, background: "var(--bg-card)", border: "1px solid var(--border-card)" }}
        >
          <span>
            <span className="block font-semibold" style={{ color: "var(--text-primary)" }}>{displayLang}</span>
            <span className="block text-xs" style={{ color: "var(--text-secondary)" }}>{LANGUAGE_COUNT} languages available</span>
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground"/>
        </button>
      </Section>

      <Section title={t("通知", "Notifications")}>
        <NotifRow label={` ${t("緊急アラート", "Emergency Alerts")}`} sub={t("常にON", "Always On")} locked/>
        <NotifRow label={` ${t("デイリーインサイト", "Daily Insights")}`}/>
        <NotifRow label={` ${t("コミュニティ返信", "Community Replies")}`}/>
        <NotifRow label={` ${t("獣医リマインダー", "Vet Reminders")}`}/>
      </Section>

      <Section title={t("データ", "Data")}>
        <Row label={` ${t("データをエクスポート", "Export Data")}`} onClick={exportData}/>
        <Row label={` ${t("プライバシー設定", "Privacy Settings")}`} onClick={() => setPrivacyOpen(true)}/>
      </Section>

      <Section title={t("マイペット", "My Pets")}>
        {displayPets.map((p) => {
          const active = p.name === pet.name;
          const spImg = getSpecies("dog").image;
          return (
            <div key={p.id} className="flex items-center gap-3">
              <button onClick={() => switchPet(p)} className="flex items-center gap-3 flex-1 text-left min-w-0">
                <span
                  className="shrink-0 overflow-hidden"
                  style={{ width: 48, height: 48, borderRadius: 12, background: "var(--acc-pale)" }}
                >
                  {spImg ? (
                    <img src={spImg} alt="Dog" loading="lazy" width={512} height={512} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center">
                      <PawPrint size={20} style={{ color: "var(--acc-strong)" }} />
                    </span>
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    <span className="truncate">{p.name}</span>
                    {active && <Check size={14} strokeWidth={3} style={{ color: "var(--accent-matcha)", flexShrink: 0 }} />}
                  </span>
                  <span className="block text-[11px] text-muted-foreground truncate">{p.breed}</span>
                </span>
                {active ? (
                  <span
                    className="shrink-0 text-[10px] font-bold"
                    style={{ color: "var(--acc-strong)", background: "var(--acc-pale)", borderRadius: 12, padding: "3px 8px" }}
                  >
                    Active
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
              {pets.length > 1 && (
                <button
                  onClick={() => removePet(p.id)}
                  aria-label={`Remove ${p.name}`}
                  className="shrink-0 flex items-center justify-center"
                  style={{ width: 32, height: 32, borderRadius: "50%", color: "var(--destructive, #E53935)" }}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          );
        })}
        <button onClick={() => setAddPetOpen(true)} className="w-full flex items-center gap-3 text-left pt-1">
          <span
            className="flex items-center justify-center shrink-0"
            style={{ width: 48, height: 48, borderRadius: 12, border: "1.5px dashed var(--acc-soft)", color: "var(--acc-strong)" }}
          >
            <Plus size={20} />
          </span>
          <span className="text-sm font-bold" style={{ color: "var(--acc-strong)" }}>{t("ペットを追加", "Add Another Pet")}</span>
        </button>
      </Section>

      <div className="mt-5 rounded-3xl border border-border p-5 shadow-card text-foreground" style={{ background: "linear-gradient(145deg,var(--bg-card-peach),var(--bg-card))" }}>
        <div className="flex items-center gap-2"><Crown className="w-5 h-5"/><div className="font-black">{t("プロプランにアップグレード", "Upgrade to Pawsitive Diagnostics Pro")}</div></div>
        <ul className="mt-3 text-xs space-y-1">
          <li>✓ {t("無制限AI診断", "Unlimited AI diagnosis")}</li>
          <li>✓ {t("24時間獣医チャット", "24h vet chat")}</li>
          <li>✓ {t("詳細レポート", "Detailed reports")}</li>
          <li>✓ {t("複数ペット対応", "Multiple pets")}</li>
        </ul>
        <button onClick={() => toast.success(t("Proプランは近日公開 — 先行アクセスに登録しました", "Pawsitive Diagnostics Pro launches soon — you're on the early-access list"))} className="mt-3 w-full bg-primary text-primary-foreground rounded-2xl py-3 font-bold text-sm">{t("月額 ₹799", "₹799 / month")} →</button>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold active:scale-[0.98] transition-transform"
          style={{ background: "var(--acc-pale)", color: "var(--acc-strong)" }}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>

        <div className="mt-4">
          {confirmDelete ? (
            <div className="rounded-2xl p-4" style={{ background: "var(--acc-pale)" }}>
              <div className="text-sm font-bold text-destructive mb-1">Delete your account?</div>
              <div className="text-xs text-muted-foreground mb-3">This permanently removes your account and local data. This cannot be undone.</div>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDelete(false)} className="flex-1 bg-muted rounded-xl py-2.5 text-sm font-medium">Cancel</button>
                <button onClick={deleteAccount} className="flex-1 bg-destructive text-destructive-foreground rounded-xl py-2.5 text-sm font-bold">Yes, Delete</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="w-full text-destructive font-bold text-sm py-3">Delete Account</button>
          )}
        </div>
      </div>

      {/* Edit profile modal */}
      {editField && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center" style={{ maxWidth: 430, margin: "0 auto" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditField(null)} />
          <div className="relative w-full rounded-t-3xl p-5 pb-8" style={{ background: "var(--bg-card)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold">
                {editField === "name" ? "Change Name" : editField === "email" ? "Change Email" : "Change Password"}
              </div>
              <button onClick={() => setEditField(null)} aria-label="Close"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <input
              autoFocus
              type={editField === "password" ? "password" : editField === "email" ? "email" : "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); }}
              placeholder={editField === "name" ? "Your name" : editField === "email" ? "you@example.com" : "New password (min 6 chars)"}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: "var(--acc-pale)", color: "var(--text-primary)" }}
            />
            <button onClick={saveEdit} className="mt-3 w-full rounded-xl py-3 font-bold text-sm text-white" style={{ background: "var(--acc-strong)" }}>Save</button>
          </div>
        </div>
      )}

      {/* Privacy sheet */}
      {privacyOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center" style={{ maxWidth: 430, margin: "0 auto" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setPrivacyOpen(false)} />
          <div className="relative w-full rounded-t-3xl p-5 pb-8" style={{ background: "var(--bg-card)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold">Privacy Settings</div>
              <button onClick={() => setPrivacyOpen(false)} aria-label="Close"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            {[
              { label: "Share anonymized health data", sub: "Helps improve AI diagnosis", on: shareData, set: setShareData },
              { label: "Public community profile", sub: "Others can see your posts", on: publicProfile, set: setPublicProfile },
            ].map((p) => (
              <div key={p.label} className="flex items-center justify-between py-2">
                <div><div className="text-sm font-medium">{p.label}</div><div className="text-[10px] text-muted-foreground">{p.sub}</div></div>
                <button onClick={() => { p.set(!p.on); toast.success("Privacy preference saved."); }} className={`w-12 h-7 rounded-full relative ${p.on ? "" : "bg-muted"}`} style={p.on ? { background: "var(--acc-strong)" } : undefined}>
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${p.on ? "left-6" : "left-1"}`}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add pet sheet */}
      {addPetOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center" style={{ maxWidth: 430, margin: "0 auto" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddPetOpen(false)} />
          <div className="relative w-full rounded-t-3xl p-5 pb-8" style={{ background: "var(--bg-card)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold">Add a Pet</div>
              <button onClick={() => setAddPetOpen(false)} aria-label="Close"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <input
              autoFocus
              type="text"
              value={newPetName}
              onChange={(e) => setNewPetName(e.target.value)}
              placeholder="Dog name *"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: "var(--acc-pale)", color: "var(--text-primary)" }}
            />
            <input
              type="text"
              value={newPetBreed}
              onChange={(e) => setNewPetBreed(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") savePet(); }}
              placeholder="Breed"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none mt-2"
              style={{ background: "var(--acc-pale)", color: "var(--text-primary)" }}
            />
            <button onClick={savePet} className="mt-3 w-full rounded-xl py-3 font-bold text-sm text-white" style={{ background: "var(--acc-strong)" }}>Add Pet</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide px-2 mb-1">{title}</div>
      <div className="bg-card rounded-3xl border border-border p-4 shadow-card space-y-3">{children}</div>
    </div>
  );
}
function Row({ label, onClick }: { label: string; onClick?: () => void }) {
  return <button onClick={onClick} className="w-full text-left text-sm flex items-center justify-between"><span>{label}</span><ChevronRight className="w-4 h-4 text-muted-foreground"/></button>;
}
function NotifRow({ label, sub, locked }: { label: string; sub?: string; locked?: boolean }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between">
      <div><div className="text-sm font-medium">{label}</div>{sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}</div>
      <button disabled={locked} onClick={() => setOn(!on)} className={`w-12 h-7 rounded-full relative ${on ? "" : "bg-muted"} ${locked ? "opacity-60" : ""}`} style={on ? { background: "var(--acc-strong)" } : undefined}>
        <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${on ? "left-6" : "left-1"}`}/>
      </button>
    </div>
  );
}
