import { Astal, Gtk } from "astal/gtk3";
import { bind } from "astal";
import { hyprland } from "../../services/hyprland";

export function Dock() {
  return (
    <window
      name="dock"
      className="dock-window"
      anchor={Astal.WindowAnchor.BOTTOM}
      exclusivity={Astal.Exclusivity.NORMAL}
    >
      <box className="dock-container">
        {bind(hyprland, "clients").as((clients) =>
          clients.slice(0, 10).map((c) => (
            <button className="dock-item" onClicked={() => c.focus()}>
              <label label={c.initialClass || "App"} />
            </button>
          ))
        )}
      </box>
    </window>
  );
}
