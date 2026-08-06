import { App, Gdk } from "astal/gtk3";

export function forMonitors(widget: (monitor: Gdk.Monitor) => JSX.Element) {
  const display = Gdk.Display.get_default();
  if (!display) return [];
  const monitors: Gdk.Monitor[] = [];
  const n = display.get_n_monitors();
  for (let i = 0; i < n; i++) {
    const mon = display.get_monitor(i);
    if (mon) monitors.push(mon);
  }
  return monitors.map(widget);
}
