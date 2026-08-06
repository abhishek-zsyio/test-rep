import { bind } from "astal";
import { mpris } from "../../services/mpris";

export function MediaModule() {
  return (
    <box className="media-module">
      {bind(mpris, "players").as((players) => {
        const player = players[0];
        if (!player) return <label label="No Media" />;
        return <label label={bind(player, "title").as((t) => t || "Playing")} />;
      })}
    </box>
  );
}
