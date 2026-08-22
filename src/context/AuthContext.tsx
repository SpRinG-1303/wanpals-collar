import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type UserRole = "owner" | "vet";

export type Session = {
  role: UserRole;
  name: string;
  email: string;
};

type StoredUser = Session & { password: string; clinic?: string };

const SESSION_KEY = "pawsitive_session";
const USERS_KEY = "pawsitive_users";

type Ctx = {
  session: Session | null;
  hydrated: boolean;
  signIn: (email: string, password: string) => string | null;
  signUp: (u: StoredUser) => string | null;
  signOut: () => void;
  updateProfile: (patch: { name?: string; email?: string; password?: string }) => string | null;
};

const AuthContext = createContext<Ctx>({
  session: null,
  hydrated: false,
  signIn: () => "Not ready",
  signUp: () => "Not ready",
  signOut: () => {},
  updateProfile: () => "Not ready",
});

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // Drive the role-based color theme (owner = pastel purple, vet = pastel blue)
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.role = session?.role ?? "owner";
  }, [session]);

  const persistSession = (s: Session | null) => {
    setSession(s);
    try {
      if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else localStorage.removeItem(SESSION_KEY);
    } catch {}
  };

  const signUp = (u: StoredUser): string | null => {
    const users = readUsers();
    if (users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())) {
      return "An account with this email already exists. Try logging in.";
    }
    users.push(u);
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {}
    persistSession({ role: u.role, name: u.name, email: u.email });
    return null;
  };

  const signIn = (email: string, password: string): string | null => {
    const users = readUsers();
    const found = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!found) return "No account found for this email. Please sign up first.";
    if (found.password !== password) return "Incorrect password. Please try again.";
    persistSession({ role: found.role, name: found.name, email: found.email });
    return null;
  };

  const signOut = () => persistSession(null);

  const updateProfile = (patch: { name?: string; email?: string; password?: string }): string | null => {
    if (!session) return "Not signed in.";
    const users = readUsers();
    const idx = users.findIndex((x) => x.email.toLowerCase() === session.email.toLowerCase());
    if (idx === -1) {
      // Session exists without a stored account (legacy/imported session) — update the session only.
      persistSession({ ...session, ...(patch.name ? { name: patch.name } : {}), ...(patch.email ? { email: patch.email } : {}) });
      return null;
    }
    if (patch.email && users.some((x, i) => i !== idx && x.email.toLowerCase() === patch.email!.toLowerCase())) {
      return "That email is already used by another account.";
    }
    const updated = { ...users[idx], ...patch };
    users[idx] = updated;
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {}
    persistSession({ role: updated.role, name: updated.name, email: updated.email });
    return null;
  };

  return (
    <AuthContext.Provider value={{ session, hydrated, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
