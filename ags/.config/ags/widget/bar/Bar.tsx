import { Astal, Gtk, Gdk } from "astal/gtk3";
import { Workspaces } from "./modules/Workspaces";
import { Clock } from "./modules/Clock";
import { BatteryModule } from "./modules/BatteryModule";
import { NetworkModule } from "./modules/NetworkModule";
import { MediaModule } from "./modules/MediaModule";
import { TrayModule } from "./modules/TrayModule";

export function Bar(monitor: Gdk.Monitor) {
  return (
    <window
      name={`bar-${monitor}`}
      className="bar-window"
      gdkmonitor={monitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
    >
      <centerbox className="bar-container">
        <box className="left" halign={Gtk.Align.START}>
          <Workspaces />
        </box>
        <box className="center" halign={Gtk.Align.CENTER}>
          <Clock />
        </box>
        <box className="right" halign={Gtk.Align.END}>
          <MediaModule />
          <NetworkModule />
          <BatteryModule />
          <TrayModule />
        </box>
      </centerbox>
    </window>
  );
}
