import { Widget, Astal } from "astal/gtk3";
import { bind, Variable } from "astal";
import audio from "../../services/audio";

export const volumeVisible = Variable(false);

export function VolumeOSD() {
    const speaker = audio?.defaultSpeaker;
    if (!speaker) return null;

    const volume = bind(speaker, "volume").as((v) => Math.round(v * 100));

    return (
        <window
            name="volume-osd"
            anchor={Astal.WindowAnchor.BOTTOM}
            layer={Astal.Layer.OVERLAY}
            visible={volumeVisible()}
        >
            <box className="osd volume-osd">
                <label label={volume.as((v) => `󰕾 Volume: ${v}%`)} />
            </box>
        </window>
    );
}
