"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <Link href="/" className="brand" style={{ justifyContent: "center", marginBottom: 8 }}>
          <Logo size={40} />
          <span>
            FDS <span className="hi">Cup</span>
          </span>
        </Link>
        <h1>เข้าสู่ระบบหลังบ้าน</h1>
        <p className="muted" style={{ textAlign: "center", marginTop: 0, fontSize: 13 }}>
          สำหรับทีมงานผู้ดูแลเท่านั้น
        </p>

        {error ? <div className="notice" style={{ marginBottom: 4 }}>{error}</div> : null}

        <div className="field">
          <label>อีเมล</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="admin@doensai.fc"
          />
        </div>
        <div className="field">
          <label>รหัสผ่าน</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn green block" disabled={loading}>
          {loading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
        </button>
        <Link href="/" className="muted" style={{ textAlign: "center", fontSize: 13, marginTop: 4 }}>
          ← กลับหน้าเว็บ
        </Link>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="login-wrap" />}>
      <LoginForm />
    </Suspense>
  );
}
