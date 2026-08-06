# Theme Engine & Color Contract Specification

This rice uses a single atomic theme switcher (`scripts/.local/bin/theme-switch`).

## The 8-File Theme Contract

Every theme directory in `~/.config/themes/<theme-name>/` MUST contain exactly these 8 files:

1. **`hypr.lua`**: Hyprland Lua color definitions (`hl.config({ general = { col = { active_border = "...", inactive_border = "..." } } })`).
2. **`ags.scss`**: Central SCSS color palette variables (`$base`, `$surface`, `$text`, `$accent`, `$love`, `$pine`, etc.).
3. **`kitty.conf`**: Kitty terminal color palette configuration.
4. **`walker.css`**: Walker v2 launcher CSS stylesheet.
5. **`gtk3-settings.ini`**: GTK 3 theme configuration.
6. **`gtk4-settings.ini`**: GTK 4 theme configuration.
7. **`qt-theme-name`**: Plaintext GTK/QT theme name for `qt5ct`/`qt6ct` matching.
8. **`wallpaper.png`**: High-resolution wallpaper image for the theme.

## Adding a New Theme

To add a new theme (e.g. `cyberpunk`):

1. Create directory `~/.config/themes/cyberpunk/`.
2. Add all 8 required files satisfying the contract above.
3. Test switching to the new theme:
   ```bash
   theme-switch cyberpunk
   ```

No individual app configurations need to be modified.
