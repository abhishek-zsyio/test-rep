import { Widget } from "astal/gtk3";
import { bind } from "astal";
import audio from "../../../services/audio";

export function VolumeSlider() {
    const speaker = audio?.defaultSpeaker;
    if (!speaker) return null;

    const volume = bind(speaker, "volume");

    return Widget.Box({
        className: "volume-slider-box",
        children: [
            Widget.Label({ label: "󰕾 " }),
            Widget.Slider({
                hexpand: true,
                value: volume,
                onDragged: (self) => {
                    speaker.set_volume(self.value);
                },
            }),
        ],
    });
}
