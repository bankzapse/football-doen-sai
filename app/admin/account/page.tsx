import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/server";
import AccountForm from "@/components/AccountForm";

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <>
      <div className="admin-head">
        <h1>บัญชีผู้ดูแล</h1>
        <Link href="/admin" className="btn ghost">← กลับ</Link>
      </div>
      <AccountForm email={user?.email ?? "-"} />
    </>
  );
}
