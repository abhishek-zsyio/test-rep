import { Astal, Widget, Gdk } from "astal/gtk3";
import { Workspaces } from "./modules/Workspaces";
import { Clock } from "./modules/Clock";
import { BatteryModule } from "./modules/BatteryModule";
import { NetworkModule } from "./modules/NetworkModule";
import { MediaModule } from "./modules/MediaModule";
import { TrayModule } from "./modules/TrayModule";
import { App } from "astal/gtk3";

export function Bar(gdkmonitor: Gdk.Monitor) {
    return (
        <window
            className="bar-window"
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        >
            <centerbox className="bar">
                <box startBox className="bar-start">
                    <button
                        className="menu-btn module"
                        onClicked={() => App.toggle_window("overview")}
                    >
                        󰣇 Activities
                    </button>
                    <Workspaces />
                </box>
                <box centerBox className="bar-center">
                    <Clock />
                </box>
                <box endBox className="bar-end">
                    <MediaModule />
                    <TrayModule />
                    <button
                        className="quick-settings-btn module"
                        onClicked={() => App.toggle_window("control-center")}
                    >
                        <box className="qs-box">
                            <NetworkModule />
                            <BatteryModule />
                        </box>
                    </button>
                </box>
            </centerbox>
        </window>
    );
}
