import { Astal, Gtk } from "astal/gtk3";

export function BrightnessOSD() {
  return (
    <window
      name="brightness-osd"
      className="osd-window"
      anchor={Astal.WindowAnchor.BOTTOM}
      visible={false}
    >
      <box className="osd-container">
        <label label="Brightness" />
      </box>
    </window>
  );
}
