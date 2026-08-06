import { bind } from "astal";
import { notifications } from "../../services/notifications";

export function NotificationPopup() {
  return (
    <window
      name="notifications-popup"
      className="notifications-window"
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    >
      <box className="notifications-popup-container" vertical>
        {bind(notifications, "notifications").as((notifs) =>
          notifs.slice(0, 3).map((n) => (
            <box className="notification-toast" vertical>
              <label className="title" label={bind(n, "summary")} />
              <label className="body" label={bind(n, "body")} />
            </box>
          ))
        )}
      </box>
    </window>
  );
}
