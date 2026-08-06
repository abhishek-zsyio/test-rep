# Master Build Prompt — Arch Linux + Hyprland + AGS/Astal Rice

Paste this entire document to your coding agent as the build brief.

---

## Project summary

A modular, theme-switchable Hyprland rice for Arch Linux, managed with
**GNU Stow**. The desktop-shell layer — bar, notifications, dock, lock
screen, OSD, control center, screenshot tool, system tray, theme
picker, and workspace overview — is **one AGS/Astal codebase**, not
five separately configured apps. Hyprland itself only handles window
management, keybindings, and monitor/input config.

## Machine profile

- Laptop: IdeaPad Gaming 3 15ARH05, AMD Ryzen 5 4600H
- **Hybrid GPU**: NVIDIA GTX 1650 Mobile (discrete) + AMD Radeon Vega (integrated) — see NVIDIA section below, do not skip
- Dual monitor (built-in 1920x1080 120Hz + external)
- Shell: zsh, Terminal: kitty
- Reference theme (build first, fully polished): **Rose Pine**
- Full theme set: Rose Pine, Gruvbox, Catppuccin, Tokyo Night, Nord
- Eye-candy level: balanced (visible blur/animation, not flat, not a showcase build)
- Primary keybind modifier: SUPER, styled after macOS shortcuts (see keybindings section)

---

## Ground truth first — clone every tool's real docs before writing config

Don't write config for any of these from memory/training data. Clone
each repo (and its wiki, where it has one) locally and read it before
touching that tool's files:

```bash
mkdir -p ~/dev/reference

git clone https://github.com/hyprwm/Hyprland ~/dev/reference/hyprland
git clone https://github.com/hyprwm/hyprland-wiki ~/dev/reference/hyprland-wiki   # or browse wiki.hypr.land directly

git clone https://github.com/Aylur/astal ~/dev/reference/astal                   # core Vala/C libs, one subfolder per module
git clone https://github.com/Aylur/ags ~/dev/reference/ags                       # scaffolding CLI, wiki has getting-started

git clone https://github.com/abenz1267/walker ~/dev/reference/walker             # wiki: github.com/abenz1267/walker/wiki
git clone https://github.com/abenz1267/elephant ~/dev/reference/elephant         # Walker v2 requires this running as a service — read its README before assuming Walker works standalone

git clone https://github.com/sentriz/cliphist ~/dev/reference/cliphist           # README only, no wiki
git clone https://github.com/LGFae/swww ~/dev/reference/swww                     # README only, check for a wiki when you clone — may have grown one since this prompt was written
```

**Flag worth resolving before writing `hyprland.conf`/`hyprland.lua`:**
Hyprland shipped a Lua-based config system starting in 0.55 (you're on
0.56.1), which may supersede the older `hyprlang`/`.conf` format this
whole prompt has been written against — including whether it's fully
replaced or optional. **Check `~/dev/reference/hyprland-wiki` for the
current config-language guidance before deciding the file extension**
for every `.conf` file in the tree below; the entrypoint may need to
be `hyprland.lua` with `conf/*.lua`, not `.conf`, depending on what
the wiki says for 0.56.x. Don't guess — this affects every single
Hyprland config file in the structure that follows.

- `~/dev/reference/astal/<module>/` — check each module's own
  README/examples for its exact GObject property names before writing
  a `services/*.ts` wrapper around it (property names are the #1
  thing that silently breaks between versions)
- Astal docs site (rendered, easier to search): `https://aylur.github.io/astal/`
- `Aylur/ags` wiki: `https://github.com/Aylur/ags/wiki` — the actual getting-started walkthrough for the CLI itself
- Walker docs: also has a GitBook at `https://benz.gitbook.io/walker` in addition to the wiki — check both, they may not be in sync
- When any tool's cloned repo disagrees with what this prompt assumes about it, **trust the cloned repo, not this document** — this prompt was written without live access to current API/config surfaces

---

## Shell architecture — AGS/Astal owns all of this

Everything below is **one AGS application** with multiple windows/layers, not separate daemons:

| Piece | Astal module(s) it's built on |
|---|---|
| Top bar (dual-monitor, per-output instance) | `AstalHyprland`, `AstalBattery`, `AstalNetwork`, `AstalMpris` |
| Notifications (replaces swaync/mako/dunst entirely) | `AstalNotifd` |
| Dock (macOS-style, workspace-aware) | `AstalHyprland`, `AstalApps` |
| Lock screen (replaces hyprlock) | `gtk4-layer-shell` session lock protocol via Astal |
| OSD — volume/brightness popups on key press | `AstalWireplumber` (volume), custom brightness binding |
| Control Center — separate macOS-style panel (wifi/bluetooth/volume/battery toggles) | `AstalNetwork`, `AstalBluetooth`, `AstalWireplumber`, `AstalBattery` |
| System tray | `AstalTray` |
| Theme picker — visual UI, click to switch (replaces bare CLI invocation) | custom, shells out to `theme-switch` logic internally |
| Mission-Control-style workspace overview | `AstalHyprland` workspace/client enumeration + custom scrubbable layout |
| Screenshot tool | custom, wraps `grim`/`slurp` internally but presents an AGS-native capture/annotate UI instead of bare CLI |

**Why this matters for the build**: all of these share one theme
source (SCSS variables compiled from the active theme), one language
(TypeScript/GJS), and one process — reload one thing (`ags run` /
`astal` restart) instead of separately reloading waybar, swaync,
hyprlock config, etc. This is the actual payoff of moving off Waybar.

**Still separate / not absorbed into AGS**:
- **Walker** — app launcher, stays a standalone tool (AGS-adjacent by design, no reason to reimplement)
- **cliphist** — clipboard history daemon, feeds into Walker's picker
- **swww** — wallpaper daemon, AGS calls it, doesn't replace it
- **Nautilus** — file manager, standalone GTK app
- **kitty** — terminal, standalone

---

## Folder structure (GNU Stow packages)

```
~/dotfiles/
├── install.sh
├── THEMING.md
│
├── hypr/.config/hypr/
│   ├── hyprland.conf
│   └── conf/
│       ├── monitors.conf         # dual-output, explicit, with single-monitor fallback
│       ├── options.conf
│       ├── animations.conf       # balanced values
│       ├── windowrules.conf
│       ├── keybindings.conf      # macOS-style, SUPER-based
│       ├── startup.conf          # launches: ags, swww-daemon, hypridle, elephant, cliphist, polkit agent
│       ├── colors.conf           # symlink → ../../themes/active/hypr.conf
│       └── env.conf              # symlink → ../hardware/active.conf — SAME PATTERN as theme switching, see VM section below
│
├── hardware/.config/hypr/hardware/    # ← hardware profiles, swapped the same way themes are
│   ├── active.conf                    # symlink → vm.conf or laptop.conf
│   ├── vm.conf                        # UTM profile: no NVIDIA vars, software render fallback
│   └── laptop.conf                    # real-device profile: full NVIDIA hybrid-GPU vars
│
├── ags/.config/ags/
│   ├── app.ts                    # entrypoint — imports every widget below, registers windows, nothing else
│   ├── config.ts                 # global constants: bar height, gaps, monitor names, animation durations
│   │
│   ├── services/                 # ← the layer that actually talks to the system
│   │   │                           ONE FILE PER DATA SOURCE. Widgets never call
│   │   │                           Astal bindings directly — they import a service
│   │   │                           and read its reactive state. This is the single
│   │   │                           biggest thing that keeps an AGS shell maintainable:
│   │   │                           if wireplumber's API ever changes, you fix it in
│   │   │                           ONE file, not in every widget that shows volume.
│   │   ├── hyprland.ts           # wraps AstalHyprland — workspaces, active client, monitors
│   │   ├── battery.ts            # wraps AstalBattery
│   │   ├── network.ts            # wraps AstalNetwork
│   │   ├── bluetooth.ts          # wraps AstalBluetooth
│   │   ├── audio.ts              # wraps AstalWireplumber — volume, mute, devices
│   │   ├── notifications.ts      # wraps AstalNotifd
│   │   ├── tray.ts               # wraps AstalTray
│   │   ├── mpris.ts              # wraps AstalMpris — media player state
│   │   └── theme.ts              # reads $THEMES_DIR/active, exposes current theme as reactive state
│   │
│   ├── widget/                   # ← pure UI, one folder per surface from the table above
│   │   ├── bar/
│   │   │   ├── Bar.ts            # per-monitor bar shell, just lays out modules below
│   │   │   └── modules/          # each is small, imports ONE service, renders it
│   │   │       ├── Workspaces.ts
│   │   │       ├── Clock.ts
│   │   │       ├── BatteryModule.ts
│   │   │       ├── NetworkModule.ts
│   │   │       ├── MediaModule.ts
│   │   │       └── TrayModule.ts
│   │   ├── notifications/
│   │   │   ├── NotificationPopup.ts   # transient toast on new notification
│   │   │   └── NotificationCenter.ts  # scrollable history panel
│   │   ├── dock/
│   │   │   └── Dock.ts
│   │   ├── lockscreen/
│   │   │   └── Lockscreen.ts     # highest-risk widget in the whole shell, keep this one simple
│   │   ├── osd/
│   │   │   ├── VolumeOSD.ts
│   │   │   └── BrightnessOSD.ts
│   │   ├── control-center/
│   │   │   ├── ControlCenter.ts
│   │   │   └── toggles/          # one file per toggle, same pattern as bar/modules
│   │   │       ├── WifiToggle.ts
│   │   │       ├── BluetoothToggle.ts
│   │   │       └── VolumeSlider.ts
│   │   ├── theme-picker/
│   │   │   └── ThemePicker.ts    # calls scripts/theme-switch via utils/exec.ts, doesn't reimplement the switch
│   │   ├── overview/
│   │   │   └── Overview.ts       # Mission-Control-style scrubbable workspace view
│   │   ├── screenshot/
│   │   │   └── ScreenshotUI.ts   # wraps grim/slurp, adds AGS-native capture UI on top
│   │   └── shared/               # ← reusable primitives, imported across multiple widgets
│   │       ├── Icon.ts
│   │       ├── Slider.ts
│   │       └── PopupWindow.ts    # common floating-window wrapper (layer-shell boilerplate lives here once)
│   │
│   ├── style/
│   │   ├── main.scss             # imports colors.scss + every partial below, compiled on `ags request reload-styles`
│   │   ├── colors.scss           # symlink → ../../themes/active/ags.scss — the ONLY file that changes on theme switch
│   │   └── components/           # one partial per widget/ folder — if it has a widget folder, it has a matching scss file, same name
│   │       ├── bar.scss
│   │       ├── notifications.scss
│   │       ├── dock.scss
│   │       ├── lockscreen.scss
│   │       ├── osd.scss
│   │       ├── control-center.scss
│   │       ├── theme-picker.scss
│   │       ├── overview.scss
│   │       └── screenshot.scss
│   │
│   └── utils/                    # generic helpers with no domain knowledge — no "battery" logic belongs here
│       ├── exec.ts               # shared shell-exec wrapper (theme-switch, hyprctl calls go through this)
│       ├── bindings.ts           # reusable Variable/Binding helper functions
│       └── monitors.ts           # per-monitor iteration helper, used by Bar.ts and Overview.ts
│
├── kitty/.config/kitty/
│   ├── kitty.conf
│   └── colors.conf               # symlink → ../../themes/active/kitty.conf
│
├── walker/.config/walker/
│   ├── config.toml
│   └── colors.css                # symlink → ../../themes/active/walker.css
│
├── gtk/
│   ├── .config/gtk-3.0/settings.ini    # symlink → ../../themes/active/gtk3-settings.ini
│   └── .config/gtk-4.0/settings.ini    # symlink → ../../themes/active/gtk4-settings.ini
│
├── themes/.config/themes/
│   ├── active/                   # symlink → one theme dir (the single switch point)
│   ├── rose-pine/
│   │   ├── hypr.conf
│   │   ├── ags.scss
│   │   ├── kitty.conf
│   │   ├── walker.css
│   │   ├── gtk3-settings.ini
│   │   ├── gtk4-settings.ini
│   │   ├── qt-theme-name          # value passed to qt5ct/qt6ct
│   │   └── wallpaper.png
│   ├── gruvbox/        # same 8-file contract
│   ├── catppuccin/     # same 8-file contract
│   ├── tokyo-night/    # same 8-file contract
│   └── nord/            # same 8-file contract
│
└── scripts/.local/bin/
    ├── theme-switch       # CLI entrypoint, AGS theme-picker calls this internally
    ├── hardware-switch    # same atomic-symlink pattern as theme-switch, flips hardware/active.conf between vm.conf and laptop.conf
    ├── volume             # thin brightnessctl/wireplumber wrapper, AGS OSD calls this
    ├── brightness
    ├── battery-limit
    └── gpu-offload        # DRI_PRIME=1 wrapper for discrete GPU on demand — no-op under hardware/vm.conf
```

**The rule of thumb for this layout**: three questions place any new
file.
- *Does it talk to the system* (Hyprland, wireplumber, battery, dbus)?
  → `services/`, one file per data source, never called directly from
  a widget's render logic.
- *Does it render something on screen*? → `widget/`, one folder per
  surface, matching the shell-architecture table above 1:1 — if you
  can't find a widget, its folder name matches the table.
- *Is it generic and would work in a shell with nothing to do with
  this rice*? → `utils/`. If it has any knowledge of what a "battery"
  or "workspace" is, it doesn't belong in `utils/` — that's a service.

**Color contract**: every theme folder has 8 files (was 7, added
`qt-theme-name` for QT app matching). AGS's `colors.scss` is the new
central piece — SCSS variables (`$base`, `$surface`, `$text`,
`$accent`, `$red`, `$green`...) that `main.scss` imports, exactly
mirroring the old CSS-variable contract but compiled at AGS build/reload time.

---

## Testing in UTM before the real laptop — read this first

The build and test cycle happens in a **UTM VM**, then migrates to the
real IdeaPad laptop. These are genuinely different graphics
environments, so hardware-specific config is isolated into the
`hardware/` profile pair from the folder structure above — switching
machines later is `hardware-switch laptop` (same atomic-symlink
pattern as `theme-switch`), not a config rewrite.

**`hardware/vm.conf` (UTM profile) — what's different:**
- No NVIDIA anything. UTM (QEMU under the hood) presents a
  `virtio-gpu` device, not the real hybrid GPU — the NVIDIA env vars
  in `laptop.conf` would actively break rendering if applied in the VM
- Software/virtio rendering fallback if Hyprland fails to start on the
  virtual GPU:
  ```
  env = WLR_RENDERER,pixman
  env = LIBGL_ALWAYS_SOFTWARE,1
  ```
  Try without these first — recent UTM (Apple Silicon hosts) with
  `virtio-gpu-gl`/`virtio-gpu-venus` in the VM's display settings
  often runs Hyprland with real GL acceleration. Only fall back to
  software rendering if the compositor won't start or blur/animation
  is unusably broken.
- `gpu-offload` script becomes a no-op (there's no discrete GPU to
  offload to) — keep the script present so nothing that calls it
  breaks, just have it exec the command directly
- **Single display by default.** UTM can be configured for multiple
  virtual displays, but don't assume dual-monitor works out of the box
  the way `monitors.conf`'s fallback rule already handles — test the
  single-monitor fallback path here specifically, since it's the path
  you'll actually be exercising for most of the build
- **SUPER key capture**: UTM on macOS may intercept `Cmd`/`Super` for
  the host before it reaches the guest depending on capture settings —
  if keybindings seem unresponsive, check UTM's input capture mode
  before assuming `keybindings.conf` is wrong
- Clipboard/cliphist: UTM's shared clipboard (SPICE guest tools) and
  Wayland's `wl-clipboard`/`cliphist` are two separate layers — don't
  debug one when the problem is the other

**Migration to the real laptop, when you get there:**
1. `hardware-switch laptop` — flips `env.conf`'s symlink from
   `vm.conf` to `laptop.conf`, pulling in the NVIDIA vars below
2. Re-run the `monitors.conf` dual-output test for real — the VM can
   only validate the single-monitor fallback path, not the actual
   dual-monitor layout
3. Re-test blur/animation on battery vs AC — this is meaningless in a
   VM and only matters once real hardware and a real battery are involved
4. Everything under `ags/`, `themes/`, `walker/`, `kitty/` needs zero
   changes — that's the point of keeping hardware specifics isolated
   to one profile pair

---

## NVIDIA + AMD hybrid GPU — `hardware/laptop.conf`, required once you're off the VM

```
env = LIBVA_DRIVER_NAME,nvidia
env = __GLX_VENDOR_LIBRARY_NAME,nvidia
env = GBM_BACKEND,nvidia-drm
env = WLR_NO_HARDWARE_CURSORS,1
```

Kernel module param (`/etc/modprobe.d/nvidia.conf`):
```
options nvidia_drm modeset=1
```

- `gpu-offload` script wraps `DRI_PRIME=1 <command>` for GPU-heavy apps — don't run everything on the discrete card by default, it costs battery
- Test blur/animation specifically on battery vs AC — hybrid-GPU laptops are exactly where compositor stutter/tearing shows up
- If blur tears, pin the compositor to the integrated GPU's DRI device via the relevant Hyprland/Aquamarine env var rather than fighting it theme-by-theme
- None of this applies in the UTM VM — see the section above

---

## Dual-monitor requirements

- `monitors.conf`: explicit config for both outputs, **with a fallback rule** for when the external display is unplugged (laptop-only fastfetch output confirmed this happens) — don't let Hyprland error on a monitor that isn't present
- AGS bar: one instance per monitor via Astal's multi-monitor window API, workspace numbers reflect actual per-screen state
- `swww`: separate `--outputs <mon>` call per monitor on theme switch
- Dock: decide primary-monitor-only vs per-monitor (recommend primary-only, matches macOS's single dock)
- Control Center / OSD: primary monitor only, floating utilities don't need to duplicate across screens

---

## Balanced eye-candy — concrete values

- Blur: on for AGS bar/dock/notifications/control-center/lockscreen, 2–3 passes max
- Animations: workspace/window transitions ~150–250ms, simple bezier, no bounce/elastic
- Shadows: subtle, small radius
- Corner rounding: 6–10px, consistent across Hyprland windowrules and every AGS widget — this is the easiest place for visual inconsistency, enforce it as a single SCSS variable, not per-component hardcoding

---

## Keybindings — macOS style (SUPER = Cmd)

Full file already built in this conversation (`keybindings.conf`) — carry it over unchanged. Two known gaps, now resolved by AGS:
- **Mission Control** — previously flagged as having no Hyprland equivalent → now built as a proper AGS overview widget, bind `$mainMod, UP` to open it
- **Spotlight** (`SUPER+Space`) → now opens **Walker**, not rofi

Add these new binds for AGS-owned surfaces:
```
bind = $mainMod, C, exec, ags request control-center toggle
bind = $mainMod, UP, exec, ags request overview toggle
bind = $mainMod SHIFT, T, exec, ags request theme-picker toggle
bind = $mainMod SHIFT, S, exec, ags request screenshot toggle
```

---

## Package list

```bash
# base system
sudo pacman -S --needed hyprland hypridle stow kitty jq \
  brightnessctl acpi upower playerctl polkit-gnome \
  network-manager-applet pipewire pipewire-pulse wireplumber \
  ttf-font-awesome nautilus qt5ct qt6ct nwg-look

# AUR: AGS/Astal shell stack
yay -S aylurs-gtk-shell   # AGS itself
yay -S libastal-io libastal-hyprland libastal-battery \
  libastal-network libastal-bluetooth libastal-wireplumber \
  libastal-tray libastal-notifd libastal-mpris libastal-apps

# AUR: everything else confirmed
yay -S swww walker-bin elephant-bin cliphist \
  ttf-jetbrains-mono-nerd
```

`elephant` must be running as a service before Walker will do anything — check its README for the systemd unit / launch method and add it to `startup.conf`.

---

## `theme-switch` — core logic (AGS-aware)

```bash
#!/usr/bin/env bash
set -euo pipefail
THEMES_DIR="$HOME/.config/themes"
NEW_THEME="${1:?usage: theme-switch <name>}"

[ -d "$THEMES_DIR/$NEW_THEME" ] || { echo "no such theme: $NEW_THEME"; exit 1; }

ln -sfn "$NEW_THEME" "$THEMES_DIR/active.tmp"
mv -T "$THEMES_DIR/active.tmp" "$THEMES_DIR/active"

hyprctl reload
ags request reload-styles          # recompiles main.scss with new colors.scss, no full AGS restart
kitty @ set-colors -a -c "$THEMES_DIR/active/kitty.conf" 2>/dev/null || true

# GTK/QT app matching
gsettings set org.gnome.desktop.interface gtk-theme "$(cat "$THEMES_DIR/active/qt-theme-name")" 2>/dev/null || true

WALLPAPER="$THEMES_DIR/active/wallpaper.png"
if [ -f "$WALLPAPER" ]; then
    for mon in $(hyprctl monitors -j | jq -r '.[].name'); do
        swww img "$WALLPAPER" --outputs "$mon" --transition-type wipe --transition-duration 1
    done
fi

echo "$NEW_THEME" > "$HOME/.cache/current-theme"
```

The AGS theme-picker widget calls this same script under the hood
(`Astal.exec("theme-switch <name>")`) rather than duplicating the
switch logic in TypeScript — one source of truth for what a "switch"
actually does.

---

## Build order

**Phase 1 — UTM VM (all of this happens here first):**

1. Clone every tool's reference repo/wiki listed in "Ground truth
   first" into `~/dev/reference/` and resolve the Hyprland Lua-vs-conf
   question before writing a single Hyprland config file
2. `hardware/vm.conf` active, `monitors.conf` single-monitor fallback
   path verified working — this is the only path the VM can test
3. AGS skeleton: `app.ts` registering empty windows for bar,
   notifications, dock, lockscreen, osd, control-center, tray,
   theme-picker, overview, screenshot — get the app launching cleanly
   before filling in any widget
4. Rose Pine reference theme: all 8 color-contract files, `main.scss`
   importing `colors.scss`
5. Bar (single-monitor for now) + notifications (`AstalNotifd`) —
   these are the two you'll notice immediately if broken
6. `theme-switch` script + AGS theme-picker widget calling it
7. Dock, OSD, control-center
8. Lock screen (session-lock protocol — get this right even in the VM,
   don't leave this until real hardware; a broken lock screen is much
   safer to discover here than on the laptop you actually carry)
9. Tray, screenshot tool, Mission-Control overview
10. Walker + cliphist wiring, GTK/QT theming via nwg-look/qt5ct
11. macOS-style `keybindings.conf`, including the new AGS-surface
    binds — watch for UTM host-key capture issues, see VM section
12. Clone Rose Pine pattern to Gruvbox, Catppuccin, Tokyo Night, Nord
13. `install.sh` (stow all packages, default `theme` symlink to
    Rose Pine, default `hardware` symlink to `vm.conf`) + `THEMING.md`
14. Cold-clone test inside the VM (fresh UTM snapshot or new user
    account): `git clone` → `install.sh` → working rice, no manual
    steps, lock screen confirmed working before calling Phase 1 done

**Phase 2 — migrate to the real laptop:**

15. `hardware-switch laptop` — pulls in the NVIDIA hybrid-GPU vars
16. Re-verify `monitors.conf`'s actual dual-monitor layout, not just
    the fallback path the VM exercised
17. Re-test blur/animation on battery vs AC
18. Confirm everything under `ags/`, `themes/`, `walker/`, `kitty/`
    needed zero changes — if something broke here, the hardware
    isolation in step 2 wasn't clean and is worth fixing properly
    rather than patching around on the laptop directly