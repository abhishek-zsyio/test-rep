import { Astal, Gtk } from "astal/gtk3";
import { bind } from "astal";
import { hyprland } from "../../services/hyprland";

export function Overview() {
  return (
    <window
      name="overview"
      className="overview-window"
      layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      visible={false}
    >
      <box className="overview-container" halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
        {bind(hyprland, "workspaces").as((wss) =>
          wss.map((ws) => (
            <box className="overview-card" vertical onClicked={() => ws.focus()}>
              <label label={`Workspace ${ws.id}`} />
            </box>
          ))
        )}
      </box>
    </window>
  );
}
