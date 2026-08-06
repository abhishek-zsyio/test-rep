#!/usr/bin/env python3
"""
focus_mode.py — Toggle Hyprland Focus Mode dynamically via hyprctl
"""

import subprocess
from pathlib import Path

# === Paths & State ===
state_file = Path.home() / ".config" / ".hypr_rule_state"
wall_dir = Path.home() / ".config" / "hypr" / "wall"

wallpaper_on_add = wall_dir / "08.png"
if not wallpaper_on_add.exists():
    wallpaper_on_add = wall_dir / "01.jpg"

wallpaper_on_remove = wall_dir / "24.jpg"
if not wallpaper_on_remove.exists():
    wallpaper_on_remove = wall_dir / "02.png"


def is_installed(cmd: str) -> bool:
    return subprocess.run(["which", cmd], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0


def set_wallpaper(path: Path):
    if not path.exists():
        return

    if is_installed("swww"):
        try:
            subprocess.run(["swww", "img", str(path)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return
        except Exception:
            pass

    if is_installed("hyprpaper") and is_installed("hyprctl"):
        try:
            subprocess.run(["hyprctl", "hyprpaper", "preload", str(path)], stdout=subprocess.DEVNULL)
            subprocess.run(["hyprctl", "hyprpaper", "wallpaper", f",{str(path)}"], stdout=subprocess.DEVNULL)
        except Exception:
            pass


def send_notification(title: str, body: str, icon: str):
    if is_installed("notify-send"):
        subprocess.run(["notify-send", "-i", icon, title, body], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def add_rule():
    if is_installed("hyprctl"):
        subprocess.run(["hyprctl", "keyword", "windowrulev2", "opacity 1 1,class:^(.*)$"], stdout=subprocess.DEVNULL)
    
    state_file.parent.mkdir(parents=True, exist_ok=True)
    state_file.touch()
    set_wallpaper(wallpaper_on_add)
    send_notification("🧠 Focus Mode", "Activated", "dialog-information")


def remove_rule():
    if is_installed("hyprctl"):
        subprocess.run(["hyprctl", "reload"], stdout=subprocess.DEVNULL)

    state_file.unlink(missing_ok=True)
    set_wallpaper(wallpaper_on_remove)
    send_notification("💤 Focus Mode", "Deactivated", "weather-clear")


def main():
    if state_file.exists():
        remove_rule()
    else:
        add_rule()


if __name__ == "__main__":
    main()
