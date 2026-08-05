import { Widget, Astal } from "astal/gtk3";
import { sh } from "../../utils/exec";

export function ScreenshotUI() {
    const captureFullscreen = async () => {
        await sh("grim ~/Pictures/Screenshots/$(date +'%Y-%m-%d_%H-%M-%S').png");
        App.toggle_window("screenshot");
    };

    const captureArea = async () => {
        await sh("grim -g \"$(slurp)\" ~/Pictures/Screenshots/$(date +'%Y-%m-%d_%H-%M-%S').png");
        App.toggle_window("screenshot");
    };

    return (
        <window
            name="screenshot"
            anchor={Astal.WindowAnchor.CENTER}
            layer={Astal.Layer.OVERLAY}
            keymode={Astal.Keymode.EXCLUSIVE}
            visible={false}
        >
            <box vertical className="screenshot-ui">
                <label label="Screenshot Tool" />
                <box className="actions">
                    <button onClicked={captureArea}>Selection Area</button>
                    <button onClicked={captureFullscreen}>Full Screen</button>
                </box>
            </box>
        </window>
    );
}
