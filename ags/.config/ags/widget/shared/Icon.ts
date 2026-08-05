import { Widget } from "astal/gtk3";

export function Icon({ icon, className = "", size = 16 }: { icon: string; className?: string; size?: number }) {
    return Widget.Icon({
        icon: icon,
        className: `icon ${className}`,
        pixelSize: size,
    });
}
