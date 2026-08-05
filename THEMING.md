# Theme System & Palette Architecture

This dotfiles repository implements a single-point atomic theme switching mechanism powered by **GNU Stow** and the `theme-switch` CLI tool.

## The 8-File Theme Contract

Every theme directory in `themes/.config/themes/<theme-name>/` MUST contain exactly 8 files to fulfill the system-wide theming contract:

| Filename | Target / Purpose |
| --- | --- |
| `hypr.conf` | Hyprland border colors, active/inactive window glows, and solid `$bg_color` |
| `ags.scss` | SCSS variables (`$base`, `$surface`, `$text`, `$accent`, `$red`, etc.) compiled into AGS styles |
| `kitty.conf` | Terminal color scheme (foreground, background, selection, 16-color ANSI palette) |
| `walker.css` | Walker app launcher GTK styling |
| `gtk3-settings.ini` | GTK 3 interface theme name & font settings |
| `gtk4-settings.ini` | GTK 4 interface theme name & font settings |
| `qt-theme-name` | Single-line plain text containing the QT / GTK matching theme name |
| `wallpapers/` | Directory containing multiple wallpaper images for this theme (`.png`, `.jpg`, `.webp`) |

## Multi-Wallpaper & Solid Fallback Architecture

Each theme folder can contain a `wallpapers/` subfolder with multiple wallpaper images (`wall1.png`, `wall2.jpg`, etc.).

1. **Cycle Wallpapers**: Use **`SUPER + ALT + Right`** (next), **`SUPER + ALT + Left`** (previous), or **`SUPER + ALT + R`** (random) to cycle wallpapers within the current active theme.
2. **Solid Color Fallback**: If the `wallpapers/` folder is empty or contains no images, the system automatically falls back to the theme's solid `$bg_color` background without error.

`~/.config/themes/active` is a symlink pointing to the currently active theme directory (`~/.config/themes/rose-pine`, etc.).

Subsystems symlink directly into `active`:
- Hyprland: `hypr/.config/hypr/conf/colors.conf` -> `../../themes/active/hypr.conf`
- AGS: `ags/.config/ags/style/colors.scss` -> `../../themes/active/ags.scss`
- Kitty: `kitty/.config/kitty/colors.conf` -> `../../themes/active/kitty.conf`
- Walker: `walker/.config/walker/colors.css` -> `../../themes/active/walker.css`
- GTK 3: `gtk/.config/gtk-3.0/settings.ini` -> `../../themes/active/gtk3-settings.ini`
- GTK 4: `gtk/.config/gtk-4.0/settings.ini` -> `../../themes/active/gtk4-settings.ini`

## Switching Themes

Use the `theme-switch` command (or the visual AGS Theme Picker widget via `SUPER + A` or `SUPER + SHIFT + T`):

```bash
theme-switch rose-pine
theme-switch gruvbox
theme-switch catppuccin
theme-switch tokyo-night
theme-switch nord
```

When invoked:
1. `theme-switch` updates `~/.config/themes/active` atomically using `ln -sfn`.
2. Reloads Hyprland (`hyprctl reload`), setting the solid background color (`$bg_color`).
3. Recompiles AGS SCSS styles live (`ags request reload-styles`).
4. Updates Kitty colors on all active terminal windows (`kitty @ set-colors`).
5. Updates GTK settings (`gsettings`).
