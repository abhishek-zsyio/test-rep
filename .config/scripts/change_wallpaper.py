
#!/usr/bin/env python3
"""
change_wallpaper.py — Dynamic wallpaper switcher for Hyprland (supports swww & hyprpaper)
"""

import sys
import random
import json
import subprocess
from pathlib import Path

# === CONFIG ===
WALLPAPER_DIR = Path.home() / ".config/hypr/wall"
STATE_FILE = Path.home() / ".cache" / "swww_wallpaper_state.json"
TRANSITION_TYPE = "right"
TRANSITION_DURATION = "2"


def is_installed(cmd: str) -> bool:
    return subprocess.run(["which", cmd], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0


def get_wallpapers():
    if not WALLPAPER_DIR.exists():
        print(f"❌ Wallpaper directory not found: {WALLPAPER_DIR}")
        sys.exit(1)
    
    wallpapers = sorted(
        [
            str(f)
            for f in WALLPAPER_DIR.glob("**/*")
            if f.suffix.lower() in [".jpg", ".jpeg", ".png", ".webp"]
        ]
    )
    if not wallpapers:
        print("❌ No wallpapers found.")
        sys.exit(1)
    return wallpapers


def save_state(index: int):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump({"index": index}, f)


def load_state() -> int:
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE) as f:
                data = json.load(f)
                return data.get("index", 0)
        except Exception:
            return 0
    return 0


def set_wallpaper(path: str):
    # Option A: Try swww if installed
    if is_installed("swww"):
        try:
            # Ensure daemon is running
            pgrep = subprocess.run(["pgrep", "-x", "swww-daemon"], stdout=subprocess.DEVNULL)
            if pgrep.returncode != 0:
                subprocess.Popen(["swww-daemon"])
            
            subprocess.run(
                [
                    "swww",
                    "img",
                    path,
                    "--transition-type",
                    TRANSITION_TYPE,
                    "--transition-duration",
                    TRANSITION_DURATION,
                ],
                check=True,
            )
            print(f"🌄 Wallpaper set via swww: {path}")
            return
        except Exception as e:
            print(f"⚠️ swww wallpaper set warning: {e}")

    # Option B: Fallback to hyprpaper
    if is_installed("hyprpaper") and is_installed("hyprctl"):
        try:
            subprocess.run(["hyprctl", "hyprpaper", "preload", path], stdout=subprocess.DEVNULL)
            subprocess.run(["hyprctl", "hyprpaper", "wallpaper", f",{path}"], stdout=subprocess.DEVNULL)
            print(f"🌄 Wallpaper set via hyprpaper: {path}")
            return
        except Exception as e:
            print(f"⚠️ hyprpaper wallpaper set warning: {e}")

    print(f"🌄 Wallpaper path ready: {path}")


def main():
    wallpapers = get_wallpapers()
    total = len(wallpapers)
    index = load_state()

    if len(sys.argv) < 2:
        print("Usage:")
        print("  -i → random wallpaper")
        print("  -0 → next wallpaper")
        print("  -p → previous wallpaper")
        sys.exit(1)

    arg = sys.argv[1]

    if arg == "-i":
        index = random.randint(0, total - 1)
    elif arg == "-0":
        index = (index + 1) % total
    elif arg == "-p":
        index = (index - 1) % total
    else:
        print("❌ Invalid argument. Use -i / -0 / -p")
        sys.exit(1)

    set_wallpaper(wallpapers[index])
    save_state(index)


if __name__ == "__main__":
    main()
