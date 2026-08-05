import { Widget, Astal } from "astal/gtk3";
import { Variable } from "astal/gtk3";
import { sh } from "../../utils/exec";

export const brightnessVisible = Variable(false);
export const brightnessLevel = Variable(100);

export async function updateBrightness() {
    const val = await sh("brightnessctl g");
    const max = await sh("brightnessctl m");
    if (val && max) {
        brightnessLevel.set(Math.round((parseInt(val) / parseInt(max)) * 100));
    }
}

export function BrightnessOSD() {
    return (
        <window
            name="brightness-osd"
            anchor={Astal.WindowAnchor.BOTTOM}
            layer={Astal.Layer.OVERLAY}
            visible={brightnessVisible()}
        >
            <box className="osd brightness-osd">
                <label label={brightnessLevel().as((v) => `󰃠 Brightness: ${v}%`)} />
            </box>
        </window>
    );
}
