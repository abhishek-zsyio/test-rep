import { bind } from "astal";
import { audio } from "../../../services/audio";

export function VolumeSlider() {
  return (
    <box className="volume-slider-box">
      <slider
        className="slider"
        value={bind(audio, "defaultSpeaker").as((s) => s?.volume || 0)}
        onValueChanged={(s) => {
          if (audio.defaultSpeaker) audio.defaultSpeaker.volume = s.value;
        }}
      />
    </box>
  );
}
