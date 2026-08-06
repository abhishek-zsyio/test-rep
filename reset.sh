#!/usr/bin/env bash
# reset.sh — Reset Arch Linux Hyprland dotfiles configuration, remove config files & optionally uninstall packages

set -euo pipefail

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}"
LOCAL_BIN="${HOME}/.local/bin"

FORCE=false
REMOVE_PACKAGES=false

for arg in "$@"; do
    case "$arg" in
        -f|--force)
            FORCE=true
            ;;
        --remove-packages|--all)
            REMOVE_PACKAGES=true
            ;;
    esac
done

echo "================================================================="
echo " Arch Linux Hyprland Dotfiles Reset Tool"
echo "================================================================="
echo " This script will:"
echo " 1. Stop running desktop processes (ags, swww-daemon, hypridle, elephant)."
echo " 2. Unstow dotfile packages from ~/.config and ~/.local/bin."
echo " 3. Completely remove configuration directories (~/.config/hypr, ags, kitty, walker, themes)."
echo " 4. Reset active theme and hardware symlinks to default (rose-pine / vm.lua)."
echo " 5. Optionally uninstall installed rice packages (pacman / AUR)."
echo "================================================================="

if [[ "$FORCE" != true ]]; then
    read -r -p "Are you sure you want to reset your configuration and remove config files? [y/N] " response
    case "$response" in
        [yY][eE][sS]|[yY])
            echo "Proceeding with reset..."
            ;;
        *)
            echo "Reset cancelled."
            exit 0
            ;;
    esac
fi

echo "[1/5] Stopping background desktop services..."
for proc in ags swww-daemon hypridle elephant cliphist; do
    if pgrep -x "$proc" >/dev/null 2>&1; then
        echo "  - Stopping $proc..."
        pkill -x "$proc" || true
    fi
done

echo "[2/5] Unstowing GNU Stow packages..."
if command -v stow >/dev/null 2>&1; then
    cd "$DOTFILES_DIR"
    for pkg in hypr hardware themes ags kitty walker gtk scripts; do
        if [ -d "$pkg" ]; then
            echo "  - Unstowing package: $pkg"
            stow -D "$pkg" 2>/dev/null || true
        fi
    done
else
    echo "  - GNU Stow not installed, skipping stow -D..."
fi

echo "[3/5] Removing configuration files and directories in ~/.config..."
TARGET_DIRS=(
    "$CONFIG_DIR/hypr"
    "$CONFIG_DIR/ags"
    "$CONFIG_DIR/kitty"
    "$CONFIG_DIR/walker"
    "$CONFIG_DIR/gtk-3.0"
    "$CONFIG_DIR/gtk-4.0"
    "$CONFIG_DIR/themes"
)

for target in "${TARGET_DIRS[@]}"; do
    if [ -e "$target" ] || [ -L "$target" ]; then
        echo "  - Removing: $target"
        rm -rf "$target"
    fi
done

# Remove stowed scripts from ~/.local/bin
for script in theme-switch hardware-switch volume brightness battery-limit gpu-offload; do
    if [ -e "$LOCAL_BIN/$script" ] || [ -L "$LOCAL_BIN/$script" ]; then
        echo "  - Removing script: $LOCAL_BIN/$script"
        rm -f "$LOCAL_BIN/$script"
    fi
done

echo "[4/5] Resetting repository default active symlinks..."
cd "$DOTFILES_DIR"

mkdir -p themes/.config/themes
ln -sfn rose-pine themes/.config/themes/active

mkdir -p hardware/.config/hypr/hardware
ln -sfn vm.lua hardware/.config/hypr/hardware/active.lua

mkdir -p hypr/.config/hypr/conf
ln -sfn "../../themes/active/hypr.lua" hypr/.config/hypr/conf/colors.lua
ln -sfn "../hardware/active.lua" hypr/.config/hypr/conf/env.lua

echo "[5/5] Checking for installed rice packages..."
RICE_PACKAGES=(
    # base system packages
    hyprland hypridle stow kitty jq brightnessctl acpi upower playerctl
    polkit-gnome network-manager-applet pipewire pipewire-pulse wireplumber
    ttf-font-awesome nautilus qt5ct qt6ct nwg-look
    # AUR packages
    aylurs-gtk-shell libastal-io libastal-hyprland libastal-battery
    libastal-network libastal-bluetooth libastal-wireplumber libastal-tray
    libastal-notifd libastal-mpris libastal-apps swww walker-bin walker
    elephant-bin elephant cliphist ttf-jetbrains-mono-nerd
)

INSTALLED_TO_REMOVE=()
if command -v pacman >/dev/null 2>&1; then
    for pkg in "${RICE_PACKAGES[@]}"; do
        if pacman -Qq "$pkg" >/dev/null 2>&1; then
            INSTALLED_TO_REMOVE+=("$pkg")
        fi
    done

    if [ ${#INSTALLED_TO_REMOVE[@]} -gt 0 ]; then
        echo "  - Found installed rice packages: ${INSTALLED_TO_REMOVE[*]}"
        if [[ "$REMOVE_PACKAGES" == true ]]; then
            echo "  - Removing installed packages with pacman..."
            sudo pacman -Rns --noconfirm "${INSTALLED_TO_REMOVE[@]}" || true
        elif [[ "$FORCE" != true ]]; then
            read -r -p "Do you want to uninstall these packages with pacman? [y/N] " pkg_resp
            case "$pkg_resp" in
                [yY][eE][sS]|[yY])
                    sudo pacman -Rns "${INSTALLED_TO_REMOVE[@]}" || true
                    ;;
                *)
                    echo "  - Skipping package uninstallation."
                    ;;
            esac
        else
            echo "  - Skipping package uninstallation (use --remove-packages to remove)."
        fi
    else
        echo "  - No rice packages currently installed."
    fi
else
    echo "  - pacman not found on this environment, skipping package uninstallation."
fi

echo "================================================================="
echo " Reset complete! Configuration and user files removed."
echo " To reinstall dotfiles, run: ./install.sh (or stow packages manually)."
echo "================================================================="
