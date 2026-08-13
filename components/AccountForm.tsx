"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Msg = { ok: boolean; text: string } | null;

export default function AccountForm({ email }: { email: string }) {
  const router = useRouter();

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwMsg, setPwMsg] = useState<Msg>(null);
  const [pwBusy, setPwBusy] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState<Msg>(null);
  const [emailBusy, setEmailBusy] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pw.length < 6) return setPwMsg({ ok: false, text: "รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร" });
    if (pw !== pw2) return setPwMsg({ ok: false, text: "รหัสผ่านทั้งสองช่องไม่ตรงกัน" });
    setPwBusy(true);
    const sb = createSupabaseBrowserClient();
    const { error } = await sb.auth.updateUser({ password: pw });
    setPwBusy(false);
    if (error) return setPwMsg({ ok: false, text: error.message });
    setPw("");
    setPw2("");
    setPwMsg({ ok: true, text: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว ✓ ครั้งต่อไปใช้รหัสใหม่ล็อกอิน" });
  }

  async function changeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailMsg(null);
    if (!newEmail.includes("@")) return setEmailMsg({ ok: false, text: "กรุณากรอกอีเมลให้ถูกต้อง" });
    setEmailBusy(true);
    const sb = createSupabaseBrowserClient();
    const { error } = await sb.auth.updateUser({ email: newEmail });
    setEmailBusy(false);
    if (error) return setEmailMsg({ ok: false, text: error.message });
    setEmailMsg({
      ok: true,
      text: "ส่งลิงก์ยืนยันไปที่อีเมลใหม่แล้ว — กดยืนยันในอีเมลก่อน อีเมลใหม่จึงจะใช้ได้",
    });
  }

  return (
    <>
      <div className="callout">
        บัญชีที่ล็อกอินอยู่: <b>{email}</b>
      </div>

      <h3 style={{ fontSize: 16, margin: "18px 0 10px" }}>เปลี่ยนรหัสผ่าน</h3>
      {pwMsg ? <div className={`notice ${pwMsg.ok ? "ok" : ""}`}>{pwMsg.text}</div> : null}
      <form onSubmit={changePassword}>
        <div className="formgrid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="field">
            <label>รหัสผ่านใหม่</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" placeholder="อย่างน้อย 6 ตัวอักษร" />
          </div>
          <div className="field">
            <label>ยืนยันรหัสผ่านใหม่</label>
            <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" />
          </div>
          <div className="field full">
            <button type="submit" className="btn green" disabled={pwBusy}>
              {pwBusy ? "กำลังบันทึก…" : "บันทึกรหัสผ่านใหม่"}
            </button>
          </div>
        </div>
      </form>

      <h3 style={{ fontSize: 16, margin: "28px 0 10px" }}>เปลี่ยนอีเมล</h3>
      {emailMsg ? <div className={`notice ${emailMsg.ok ? "ok" : ""}`}>{emailMsg.text}</div> : null}
      <form onSubmit={changeEmail}>
        <div className="formgrid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="field">
            <label>อีเมลใหม่</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@email.com" />
            <span className="hint">ต้องกดยืนยันในลิงก์ที่ส่งไปอีเมลใหม่ก่อน</span>
          </div>
          <div className="field" style={{ justifyContent: "flex-end" }}>
            <button type="submit" className="btn ghost" disabled={emailBusy}>
              {emailBusy ? "กำลังส่ง…" : "ส่งลิงก์เปลี่ยนอีเมล"}
            </button>
          </div>
        </div>
      </form>

      <div style={{ marginTop: 22 }}>
        <button
          className="rowbtn"
          onClick={async () => {
            await createSupabaseBrowserClient().auth.signOut();
            router.push("/login");
            router.refresh();
          }}
        >
          ออกจากระบบ
        </button>
      </div>
    </>
  );
}
