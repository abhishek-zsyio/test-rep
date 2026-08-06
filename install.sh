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

# Ensure target directories exist as real directories so Stow does not fold them
TARGET_DIRS=(
    "$HOME/.config"
    "$HOME/.config/hypr"
    "$HOME/.config/hypr/conf"
    "$HOME/.config/hypr/hardware"
    "$HOME/.config/themes"
    "$HOME/.config/ags"
    "$HOME/.config/kitty"
    "$HOME/.config/walker"
    "$HOME/.config/gtk-3.0"
    "$HOME/.config/gtk-4.0"
    "$HOME/.local/bin"
)

echo "Ensuring target directories exist as real directories (un-folding Stow trees)..."
for dir in "${TARGET_DIRS[@]}"; do
    if [ -L "$dir" ]; then
        echo "Removing folded directory symlink: $dir"
        rm -f "$dir"
    fi
    mkdir -p "$dir"
done

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

echo "Stowing packages into $HOME (with --no-folding)..."
for pkg in "${PACKAGES[@]}"; do
    if [ -d "$pkg" ]; then
        stow --no-folding -R -v -t "$HOME" "$pkg"
    fi
done

echo "Setting default active theme (rose-pine)..."
ln -sfn rose-pine "$DOTFILES_DIR/themes/.config/themes/active"
mkdir -p "$HOME/.config/themes"
ln -sfn rose-pine "$HOME/.config/themes/active"

echo "Setting default hardware profile (vm.lua)..."
ln -sfn vm.lua "$DOTFILES_DIR/hardware/.config/hypr/hardware/active.lua"
mkdir -p "$HOME/.config/hypr/hardware"
ln -sfn vm.lua "$HOME/.config/hypr/hardware/active.lua"

echo "Ensuring executable permissions on scripts..."
chmod +x "$DOTFILES_DIR/scripts/.local/bin/"* 2>/dev/null || true

echo "=== Installation & Stow Complete ==="


