/** ไอคอน 3D (Fluent Emoji 3D — MIT) แทน emoji แบนๆ ทั่วเว็บ */
export default function Icon3D({
  name,
  size = 22,
  alt = "",
  style,
}: {
  name: string;
  size?: number;
  alt?: string;
  style?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/i3d/${name}.png`}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size, display: "inline-block", verticalAlign: "-0.18em", flex: "none", ...style }}
    />
  );
}
