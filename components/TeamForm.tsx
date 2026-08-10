"use client";

import { useState } from "react";
import { createTeam } from "@/app/admin/actions";
import ProvinceSelect from "@/components/ProvinceSelect";

type Row = { key: number };

export default function TeamForm() {
  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: 7 }, (_, i) => ({ key: i }))
  );
  const [nextKey, setNextKey] = useState(7);

  const addRow = () => {
    setRows((r) => [...r, { key: nextKey }]);
    setNextKey((k) => k + 1);
  };
  const removeRow = (key: number) => setRows((r) => r.filter((x) => x.key !== key));

  return (
    <form action={createTeam}>
      <div className="formgrid">
        <div className="field">
          <label>ชื่อทีม *</label>
          <input name="name" required placeholder="KWANSIRI CS" />
        </div>
        <div className="field">
          <label>จังหวัด</label>
          <ProvinceSelect />
        </div>
        <div className="field full">
          <label>โลโก้ทีม</label>
          <input type="file" name="logo_file" accept="image/*" />
          <span className="hint">อัปโหลดรูปโลโก้ทีม (ไม่บังคับ)</span>
        </div>
        <div className="field">
          <label>ผู้จัดการทีม</label>
          <input name="manager_name" placeholder="ยามาล" />
        </div>
        <div className="field">
          <label>ผู้ฝึกสอน</label>
          <input name="coach_name" placeholder="โค้ชนก" />
        </div>
        <div className="field">
          <label>ผู้ช่วยผู้ฝึกสอน</label>
          <input name="coach2_name" placeholder="โค้ชโรตี" />
        </div>
      </div>

      <div className="section-title" style={{ marginTop: 22 }}>
        <h2 style={{ fontSize: 16 }}>รายชื่อนักเตะ</h2>
        <span>{rows.length} คน</span>
      </div>

      <div className="player-rows">
        {rows.map((row, i) => (
          <div className="player-row" key={row.key}>
            <span className="player-idx muted tnum">{i + 1}</span>
            <input name="player_name" placeholder="ชื่อนักเตะ" className="pr-name" />
            <input name="player_number" placeholder="เบอร์" inputMode="numeric" className="pr-num" />
            <select name="player_position" className="pr-pos" defaultValue="">
              <option value="">ตำแหน่ง</option>
              <option value="GK">GK</option>
              <option value="DF">DF</option>
              <option value="MF">MF</option>
              <option value="FW">FW</option>
            </select>
            <input type="file" name="player_photo" accept="image/*" className="pr-photo" title="รูปนักเตะ" />
            <button type="button" className="rowbtn" onClick={() => removeRow(row.key)} aria-label="ลบแถว">✕</button>
          </div>
        ))}
      </div>

      <button type="button" className="btn ghost" onClick={addRow} style={{ marginTop: 12 }}>
        + เพิ่มนักเตะ
      </button>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button type="submit" className="btn green">บันทึกทีม</button>
        <a href="/admin/teams" className="btn ghost">ยกเลิก</a>
      </div>
    </form>
  );
}
