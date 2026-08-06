import { Variable } from "astal";
import { sh } from "../utils/exec";

export const activeTheme = Variable("rose-pine");

async function syncTheme() {
    const current = await sh("cat ~/.cache/current-theme 2>/dev/null || echo 'rose-pine'");
    activeTheme.set(current.trim() || "rose-pine");
}

syncTheme();

export function setTheme(name: string) {
    sh(`theme-switch ${name}`);
    activeTheme.set(name);
}
