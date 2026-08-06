import { Astal, Gtk } from "astal/gtk3";
import { Binding } from "astal";

export function Slider({
  value,
  onDraw,
  onChange,
}: {
  value: Binding<number> | number;
  onDraw?: () => void;
  onChange?: (v: number) => void;
}) {
  return (
    <slider
      value={value}
      onValueChanged={(self) => onChange?.(self.value)}
      className="slider"
    />
  );
}
