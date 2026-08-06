import { App } from "astal/gtk3";
import { SidePanel } from "./sidepanel.js";
import { NotificationsPopup } from "./notifications.js";

App.start({
    css: `${App.configDir}/style.css`,
    main() {
        SidePanel();
        NotificationsPopup();
    },
});
