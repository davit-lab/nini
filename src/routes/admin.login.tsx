import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Sign in — Admin" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("მოგესალმებით!");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-5">
      <form onSubmit={onSubmit} className="w-full max-w-md p-10 rounded-3xl bg-card border border-border flex flex-col gap-5">
        <div>
          <span className="micro-label">Studio Admin</span>
          <h1 className="mt-3 text-4xl font-display font-black uppercase tracking-editorial">
            Sign in
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            მხოლოდ ავტორიზებული ადმინისტრატორებისთვის.
          </p>
        </div>
        <input
          type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-primary"
        />
        <input
          type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
          className="bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-primary"
        />
        <button disabled={busy} className="rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold uppercase tracking-wider disabled:opacity-50">
          {busy ? "..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
