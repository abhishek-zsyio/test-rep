#!/usr/bin/env bash
set -euo pipefail

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DOTFILES_DIR"

echo "========================================================"
echo "   Arch Linux Dotfiles & Hyprland Rice Reset Script     "
echo "========================================================"

PACKAGES=(
    "hypr"
    "hardware"
    "ags"
    "kitty"
    "walker"
    "gtk"
    "themes"
    "scripts"
)

# Unstow all stowed dotfile packages
echo "--> Unstowing packages from $HOME..."
for pkg in "${PACKAGES[@]}"; do
    if [ -d "$pkg" ]; then
        stow -D -v -t "$HOME" "$pkg" 2>/dev/null || true
    fi
done

# Terminate desktop services
echo "--> Stopping running rice daemons..."
pkill ags 2>/dev/null || true
pkill swww-daemon 2>/dev/null || true
pkill elephant 2>/dev/null || true
pkill cliphist 2>/dev/null || true
pkill hypridle 2>/dev/null || true

# Remove active symlinks and empty dotfile config directories
echo "--> Cleaning up managed config links and directories..."
rm -f "$HOME/.config/hypr/hardware/active.lua"
rm -f "$HOME/.config/themes/active"
rm -f "$HOME/.local/bin/theme-switch"
rm -f "$HOME/.local/bin/hardware-switch"
rm -f "$HOME/.local/bin/volume"
rm -f "$HOME/.local/bin/brightness"
rm -f "$HOME/.local/bin/battery-limit"
rm -f "$HOME/.local/bin/gpu-offload"

rm -rf "$HOME/.config/hypr"
rm -rf "$HOME/.config/themes"
rm -rf "$HOME/.config/ags"
rm -rf "$HOME/.config/kitty"
rm -rf "$HOME/.config/walker"
rm -rf "$HOME/.config/gtk-3.0"
rm -rf "$HOME/.config/gtk-4.0"

# Restore most recent backup if available
LATEST_BACKUP=$(ls -td "$HOME"/.config/dotfiles_backup_* 2>/dev/null | head -n 1 || true)
if [ -n "$LATEST_BACKUP" ] && [ -d "$LATEST_BACKUP" ]; then
    echo "--> Restoring pre-installation backup from: $LATEST_BACKUP"
    cp -rn "$LATEST_BACKUP/"* "$HOME/.config/" 2>/dev/null || true
    echo "--> Backup restored successfully!"
fi

echo "========================================================"
echo "   Reset Complete! Dotfiles restored to default state.  "
echo "========================================================"
