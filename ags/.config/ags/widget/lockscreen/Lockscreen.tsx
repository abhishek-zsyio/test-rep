import { Astal, Gtk } from "astal/gtk3";

export function Lockscreen() {
  return (
    <window
      name="lockscreen"
      className="lockscreen-window"
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      visible={false}
    >
      <box className="lockscreen-container" vertical halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
        <label className="lockscreen-title" label="System Locked" />
        <entry className="lockscreen-input" visibility={false} placeholderText="Password..." />
      </box>
    </window>
  );
}
