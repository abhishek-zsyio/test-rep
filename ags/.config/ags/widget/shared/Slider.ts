import { Widget } from "astal/gtk3";
import { Binding } from "astal";

export function Slider({
    value,
    onDragged,
    className = "",
}: {
    value: Binding<number> | number;
    onDragged?: (value: number) => void;
    className?: string;
}) {
    return Widget.Slider({
        className: `slider ${className}`,
        value: value,
        onDragged: (self) => onDragged && onDragged(self.value),
    });
}
