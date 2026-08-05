import { App } from "astal/gtk3";
import style from "./style/main.scss";
import { forMonitors } from "./utils/monitors";
import { Bar } from "./widget/bar/Bar";
import { NotificationPopup } from "./widget/notifications/NotificationPopup";
import { NotificationCenter } from "./widget/notifications/NotificationCenter";
import { Dock } from "./widget/dock/Dock";
import { Lockscreen } from "./widget/lockscreen/Lockscreen";
import { VolumeOSD } from "./widget/osd/VolumeOSD";
import { BrightnessOSD } from "./widget/osd/BrightnessOSD";
import { ControlCenter } from "./widget/control-center/ControlCenter";
import { ThemePicker } from "./widget/theme-picker/ThemePicker";
import { Overview } from "./widget/overview/Overview";
import { ScreenshotUI } from "./widget/screenshot/ScreenshotUI";
import { Spotlight } from "./widget/spotlight/Spotlight";

App.start({
    css: style,
    main() {
        // Multi-monitor Bar instances
        forMonitors(Bar);

        // Core shell surface overlays
        NotificationPopup();
        NotificationCenter();
        Lockscreen();
        VolumeOSD();
        BrightnessOSD();
        ControlCenter();
        ThemePicker();
        Overview();
        ScreenshotUI();
        Spotlight();
    },
    requestHandler(request, res) {
        const [cmd, arg] = request.split(" ");
        if (cmd === "control-center") App.toggle_window("control-center");
        else if (cmd === "overview") App.toggle_window("overview");
        else if (cmd === "theme-picker") App.toggle_window("theme-picker");
        else if (cmd === "screenshot") App.toggle_window("screenshot");
        else if (cmd === "lockscreen") App.toggle_window("lockscreen");
        else if (cmd === "spotlight") App.toggle_window("spotlight");
        else if (cmd === "reload-styles") App.reset_css();
        res("ok");
    },
});
