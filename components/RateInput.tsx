"use client";

import { useState } from "react";

const NEGOTIABLE = "เจรจาต่อรองได้";

/** ช่องค่าตัว/เรทต่อแมตช์ + ตัวเลือก "เจรจาต่อรองได้" (ติ๊กแล้วไม่ต้องกรอกตัวเลข) */
export default function RateInput({ defaultValue = "" }: { defaultValue?: string }) {
  const [negotiable, setNegotiable] = useState(defaultValue === NEGOTIABLE);
  const [val, setVal] = useState(defaultValue === NEGOTIABLE ? "" : defaultValue);

  return (
    <>
      <input
        type="text"
        name="rate"
        value={negotiable ? NEGOTIABLE : val}
        onChange={(e) => setVal(e.target.value)}
        readOnly={negotiable}
        placeholder="เช่น 500/แมตช์"
        style={negotiable ? { opacity: 0.6 } : undefined}
      />
      <label className="checkline">
        <input
          type="checkbox"
          checked={negotiable}
          onChange={(e) => setNegotiable(e.target.checked)}
        />
        เจรจาต่อรองได้ (ไม่ระบุตัวเลข)
      </label>
    </>
  );
}
