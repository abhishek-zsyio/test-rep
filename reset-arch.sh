#!/usr/bin/env bash
# Reset script for Arch Linux + Hyprland environment
# Safely unstows dotfiles, cleans symlinks, and resets user caches.
set -euo pipefail

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DOTFILES_DIR"

echo "=========================================="
echo "==> Resetting Arch Linux Dotfiles & Configs..."
echo "=========================================="

PACKAGES=(themes hypr ags kitty walker gtk scripts)

# 1. Unstow all packages from $HOME
if command -v stow &>/dev/null; then
    for pkg in "${PACKAGES[@]}"; do
        if [ -d "$pkg" ]; then
            echo "==> Unstowing package: $pkg"
            stow -D -v -t "$HOME" "$pkg" 2>/dev/null || true
        fi
    done
fi

# 2. Clean up residual symlinks & target directories in $HOME/.config
for pkg in hypr ags kitty walker themes gtk-3.0 gtk-4.0; do
    TARGET_DIR="$HOME/.config/$pkg"
    if [ -L "$TARGET_DIR" ] || [ -d "$TARGET_DIR" ]; then
        echo "==> Removing configuration: $TARGET_DIR"
        rm -rf "$TARGET_DIR"
    fi
done

# 3. Clean up installed scripts in $HOME/.local/bin
SCRIPTS=(battery-limit brightness copy-mac gpu-offload keybinds report-log theme-switch volume wallpaper-switch)
for scr in "${SCRIPTS[@]}"; do
    TARGET_FILE="$HOME/.local/bin/$scr"
    if [ -L "$TARGET_FILE" ] || [ -f "$TARGET_FILE" ]; then
        echo "==> Removing script: $TARGET_FILE"
        rm -f "$TARGET_FILE"
    fi
done

# 4. Clear desktop & theme cache files
echo "==> Clearing theme & wallpaper caches..."
rm -f "$HOME/.cache/current-theme"
rm -f "$HOME/.cache/current-wallpaper"
rm -rf "$HOME/.cache/ags"

# 5. Reload Hyprland if running
if command -v hyprctl &>/dev/null && hyprctl activewindow &>/dev/null; then
    echo "==> Reloading Hyprland..."
    hyprctl reload 2>/dev/null || true
fi

echo "=========================================="
echo "==> Reset Complete! Your environment is clean."
echo "=========================================="
