#!/usr/bin/env bash
set -euo pipefail

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DOTFILES_DIR"

echo "=== Initializing Abhishek's Arch Linux + Hyprland Rice ==="

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

BACKUP_DIR="$HOME/.config/dotfiles_backup_$(date +%Y%m%d_%H%M%S)"

mkdir -p "$HOME/.config" "$HOME/.local/bin"

echo "Checking for conflicting pre-existing files in $HOME..."
for pkg in "${PACKAGES[@]}"; do
    if [ -d "$pkg" ]; then
        find "$pkg" -mindepth 1 | while read -r src; do
            rel_path="${src#$pkg/}"
            target="$HOME/$rel_path"
            
            # If target exists and is NOT a symlink (i.e. regular file), back it up
            if [ -f "$target" ] && [ ! -L "$target" ]; then
                echo "Backing up pre-existing conflicting file: $target"
                mkdir -p "$(dirname "$BACKUP_DIR/$rel_path")"
                mv "$target" "$BACKUP_DIR/$rel_path"
            fi
        done
    fi
done

echo "Stowing packages into $HOME..."
for pkg in "${PACKAGES[@]}"; do
    if [ -d "$pkg" ]; then
        stow -R -v -t "$HOME" "$pkg"
    fi
done

echo "Setting default active theme (rose-pine)..."
ln -sfn rose-pine "$DOTFILES_DIR/themes/.config/themes/active"

echo "Setting default hardware profile (vm.lua)..."
ln -sfn vm.lua "$DOTFILES_DIR/hardware/.config/hypr/hardware/active.lua"

echo "Ensuring executable permissions on scripts..."
chmod +x "$DOTFILES_DIR/scripts/.local/bin/"* 2>/dev/null || true

echo "=== Installation & Stow Complete ==="

