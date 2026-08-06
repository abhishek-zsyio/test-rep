import App from 'ags';
import { SidePanel } from './sidepanel.js';
import { NotificationsPopup } from './notifications.js';

const scss = `${App.configDir}/style.css`;

App.config({
    style: scss,
    windows: [
        SidePanel(),
        NotificationsPopup(),
    ],
    notificationTimeout: 5000,
    cacheNotificationActions: true,
});
