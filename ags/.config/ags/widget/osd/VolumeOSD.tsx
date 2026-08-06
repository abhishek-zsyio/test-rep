import { Astal, Gtk } from "astal/gtk3";
import { bind } from "astal";
import { audio } from "../../services/audio";

export function VolumeOSD() {
  return (
    <window
      name="volume-osd"
      className="osd-window"
      anchor={Astal.WindowAnchor.BOTTOM}
      visible={false}
    >
      <box className="osd-container">
        <label label={bind(audio, "defaultSpeaker").as((s) => s ? `Volume: ${Math.round(s.volume * 100)}%` : "Volume")} />
      </box>
    </window>
  );
}
