import { bind } from "astal";
import { hyprland } from "../../services/hyprland";

export function Workspaces() {
  return (
    <box className="workspaces">
      {bind(hyprland, "workspaces").as((wss) =>
        wss
          .sort((a, b) => a.id - b.id)
          .map((ws) => (
            <button
              className={bind(hyprland, "focusedWorkspace").as((fws) =>
                fws?.id === ws.id ? "focused" : ""
              )}
              onClicked={() => ws.focus()}
            >
              <label label={String(ws.id)} />
            </button>
          ))
      )}
    </box>
  );
}
