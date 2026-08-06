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

mkdir -p "$HOME/.config" "$HOME/.local/bin"

echo "Stowing packages into $HOME..."
for pkg in "${PACKAGES[@]}"; do
    if [ -d "$pkg" ]; then
        stow -R -v -t "$HOME" "$pkg" 2>/dev/null || stow -v -t "$HOME" "$pkg"
    fi
done

echo "Setting default active theme (rose-pine)..."
ln -sfn rose-pine "$DOTFILES_DIR/themes/.config/themes/active"

echo "Setting default hardware profile (vm.lua)..."
ln -sfn vm.lua "$DOTFILES_DIR/hardware/.config/hypr/hardware/active.lua"

echo "Ensuring executable permissions on scripts..."
chmod +x "$DOTFILES_DIR/scripts/.local/bin/"* 2>/dev/null || true

echo "=== Installation & Stow Complete ==="
