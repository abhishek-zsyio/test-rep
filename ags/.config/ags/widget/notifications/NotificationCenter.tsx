import { bind } from "astal";
import { notifications } from "../../services/notifications";

export function NotificationCenter() {
  return (
    <box className="notification-center" vertical>
      <label className="header" label="Notifications History" />
      {bind(notifications, "notifications").as((notifs) =>
        notifs.map((n) => (
          <box className="notification-item" vertical>
            <label className="title" label={bind(n, "summary")} />
            <label className="body" label={bind(n, "body")} />
          </box>
        ))
      )}
    </box>
  );
}
