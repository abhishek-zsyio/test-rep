import { Astal, Gtk } from "astal/gtk3";

export function Icon({ icon, className = "", size = 16 }: { icon: string; className?: string; size?: number }) {
  return (
    <icon
      icon={icon}
      className={`icon ${className}`}
      pixelSize={size}
    />
  );
}
