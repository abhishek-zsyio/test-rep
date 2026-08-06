import { App } from "astal/gtk3";
import { forMonitors } from "./utils/monitors";
import { Bar } from "./widget/bar/Bar";
import { NotificationPopup } from "./widget/notifications/NotificationPopup";
import { Dock } from "./widget/dock/Dock";
import { Lockscreen } from "./widget/lockscreen/Lockscreen";
import { VolumeOSD } from "./widget/osd/VolumeOSD";
import { BrightnessOSD } from "./widget/osd/BrightnessOSD";
import { ControlCenter } from "./widget/control-center/ControlCenter";
import { ThemePicker } from "./widget/theme-picker/ThemePicker";
import { Overview } from "./widget/overview/Overview";
import { ScreenshotUI } from "./widget/screenshot/ScreenshotUI";
import style from "./style/main.scss";

App.start({
  css: style,
  main() {
    forMonitors(Bar);
    NotificationPopup();
    Dock();
    Lockscreen();
    VolumeOSD();
    BrightnessOSD();
    ControlCenter();
    ThemePicker();
    Overview();
    ScreenshotUI();
  },
  requestHandler(request, res) {
    const [action, target] = request.split(" ");
    if (action === "control-center" && target === "toggle") {
      App.toggle_window("control-center");
      res("ok");
    } else if (action === "overview" && target === "toggle") {
      App.toggle_window("overview");
      res("ok");
    } else if (action === "theme-picker" && target === "toggle") {
      App.toggle_window("theme-picker");
      res("ok");
    } else if (action === "screenshot" && target === "toggle") {
      App.toggle_window("screenshot");
      res("ok");
    } else if (action === "reload-styles") {
      App.reset_css();
      App.apply_css(style);
      res("ok");
    } else {
      res("unknown command");
    }
  },
});
