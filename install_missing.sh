#!/usr/bin/env bash
# install_missing.sh — Install all missing system packages, binaries & fonts for NamiConfig
# Supports Arch Linux / Pacman / AUR helpers (yay, paru)

set -euo pipefail

# ANSI Colors
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${BLUE}${BOLD}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}${BOLD}[SUCCESS]${NC} $*"; }
warn()    { echo -e "${YELLOW}${BOLD}[WARNING]${NC} $*"; }
error()   { echo -e "${RED}${BOLD}[ERROR]${NC} $*"; }

YES_MODE=false

for arg in "$@"; do
    case "$arg" in
        -y|--yes)
            YES_MODE=true
            ;;
        -h|--help)
            echo "Usage: ./install_missing.sh [-y|--yes]"
            echo "Detects and installs all missing packages required by NamiConfig Hyprland environment."
            exit 0
            ;;
    esac
done

echo -e "${BOLD}=================================================================${NC}"
echo -e "${BOLD}         🛠️  NamiConfig Missing Dependencies Installer           ${NC}"
echo -e "${BOLD}=================================================================${NC}"

# Full manifest of packages required across all configs and scripts
ALL_PACKAGES=(
    # Core Hyprland Desktop Ecosystem
    hyprland
    hyprpaper
    swww
    hyprlock
    hypridle
    hyprpolkitagent
    hyprshade
    
    # Status bar, notifications & overlays
    waybar
    mako
    swaync
    swayosd
    
    # Terminals, Launchers & Shell Utilities
    ghostty
    kitty
    rofi-wayland
    dolphin
    nemo
    zathura
    cava
    glow
    kdeconnect
    firefox
    waypaper
    stow
    bat
    bc
    libnotify
    libpulse
    luajit
    
    # Audio, Media & Brightness Controls
    playerctl
    brightnessctl
    wireplumber
    pamixer
    
    # Clipboard & Screenshot Tools
    cliphist
    wl-clipboard
    grim
    slurp
    grimblast
    swappy
    
    # GTK / Qt Customization & Fonts
    python
    python-gobject
    qt5ct
    qt6ct
    kvantum
    nwg-look
    ttf-jetbrains-mono-nerd
    ttf-font-awesome
    papirus-icon-theme
    bibata-cursor-theme
)

if ! command -v pacman >/dev/null 2>&1; then
    warn "pacman package manager not detected on this system."
    warn "Please ensure the following packages are installed manually on your Linux distribution:"
    for pkg in "${ALL_PACKAGES[@]}"; do
        echo "  - $pkg"
    done
    exit 0
fi

info "Checking system package status via pacman..."

MISSING=()
for pkg in "${ALL_PACKAGES[@]}"; do
    if ! pacman -Qq "$pkg" >/dev/null 2>&1 && ! command -v "$pkg" >/dev/null 2>&1; then
        MISSING+=("$pkg")
    fi
done

if [ ${#MISSING[@]} -eq 0 ]; then
    success "All required system dependencies are already installed!"
    exit 0
fi

warn "Found ${#MISSING[@]} missing package(s):"
for m in "${MISSING[@]}"; do
    echo "  • $m"
done

if [[ "$YES_MODE" != true ]]; then
    read -r -p "Would you like to install all missing packages now? [Y/n] " choice
    case "$choice" in
        [nN][oO]|[nN])
            warn "Package installation skipped."
            exit 0
            ;;
    esac
fi

# Detect AUR helper or use pacman
AUR_HELPER=""
if command -v yay >/dev/null 2>&1; then
    AUR_HELPER="yay"
elif command -v paru >/dev/null 2>&1; then
    AUR_HELPER="paru"
fi

if [ -n "$AUR_HELPER" ]; then
    info "Installing missing packages with $AUR_HELPER..."
    "$AUR_HELPER" -S --needed --noconfirm "${MISSING[@]}" || warn "Some packages failed to install via $AUR_HELPER."
else
    info "Installing missing packages with pacman..."
    sudo pacman -S --needed --noconfirm "${MISSING[@]}" || warn "Some packages failed to install via pacman."
fi

success "Dependency check and installation process finished!"
