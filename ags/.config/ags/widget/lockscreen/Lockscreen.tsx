import { Widget, Astal } from "astal/gtk3";
import { Variable } from "astal/gtk3";
import { sh } from "../../utils/exec";

export function Lockscreen() {
    const password = Variable("");

    const unlock = async () => {
        // Authenticate password
        const ok = await sh(`echo '${password.get()}' | pamtester login $USER authenticate`);
        if (ok) {
            sh("ags request lockscreen hide");
        } else {
            password.set("");
        }
    };

    return (
        <window
            name="lockscreen"
            anchor={
                Astal.WindowAnchor.TOP |
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT
            }
            layer={Astal.Layer.OVERLAY}
            keymode={Astal.Keymode.EXCLUSIVE}
            visible={false}
        >
            <box centerBox className="lockscreen">
                <box vertical className="lock-card">
                    <label className="user-label" label={GLib.get_user_name()} />
                    <entry
                        visibility={false}
                        text={password()}
                        onChanged={(e) => password.set(e.text)}
                        onActivate={unlock}
                        placeholderText="Password..."
                    />
                </box>
            </box>
        </window>
    );
}
