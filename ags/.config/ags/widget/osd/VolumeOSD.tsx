import { Widget, Astal, bind } from "astal/gtk3";
import { Variable, bind as bindAstal } from "astal";
import audio from "../../services/audio";

export const volumeVisible = Variable(false);

export function VolumeOSD() {
    const speaker = audio?.defaultSpeaker;
    if (!speaker) {
        return (
            <window
                name="volume-osd"
                anchor={Astal.WindowAnchor.BOTTOM}
                layer={Astal.Layer.OVERLAY}
                visible={bindAstal(volumeVisible)}
            >
                <box className="osd volume-osd">
                    <label label="󰕾 Volume" />
                </box>
            </window>
        );
    }

    const volume = bind(speaker, "volume").as((v) => Math.round(v * 100));

    return (
        <window
            name="volume-osd"
            anchor={Astal.WindowAnchor.BOTTOM}
            layer={Astal.Layer.OVERLAY}
            visible={bindAstal(volumeVisible)}
        >
            <box className="osd volume-osd">
                <label label={volume.as((v) => `󰕾 Volume: ${v}%`)} />
            </box>
        </window>
    );
}
