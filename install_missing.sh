#!/usr/bin/env bash
# install_missing.sh — Install all missing system packages, binaries, fonts & Zsh environment for NamiConfig
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
            echo "Detects and installs all missing packages & Zsh setup required by NamiConfig Hyprland environment."
            exit 0
            ;;
    esac
done

echo -e "${BOLD}=================================================================${NC}"
echo -e "${BOLD}         🛠️  NamiConfig Missing Dependencies Installer           ${NC}"
echo -e "${BOLD}=================================================================${NC}"

# Full manifest of packages required across all configs and scripts
ALL_PACKAGES=(
    # Zsh & Shell Tools
    zsh
    starship
    eza
    fastfetch
    stow
    bat
    bc
    libnotify
    libpulse
    luajit

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
    
    # Terminals, Launchers & Apps
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
    ttf-nerd-fonts-symbols
    noto-fonts-emoji
    papirus-icon-theme
    bibata-cursor-theme
)

if command -v pacman >/dev/null 2>&1; then
    info "Checking system package status via pacman..."

    MISSING=()
    for pkg in "${ALL_PACKAGES[@]}"; do
        if ! pacman -Qq "$pkg" >/dev/null 2>&1 && ! command -v "$pkg" >/dev/null 2>&1; then
            MISSING+=("$pkg")
        fi
    done

    if [ ${#MISSING[@]} -gt 0 ]; then
        warn "Found ${#MISSING[@]} missing package(s):"
        for m in "${MISSING[@]}"; do
            echo "  • $m"
        done

        INSTALL_OK=true
        if [[ "$YES_MODE" != true ]]; then
            read -r -p "Would you like to install missing packages now? [Y/n] " choice
            case "$choice" in
                [nN][oO]|[nN])
                    INSTALL_OK=false
                    warn "Package installation skipped."
                    ;;
            esac
        fi

        if [[ "$INSTALL_OK" == true ]]; then
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
        fi
    else
        success "All core system packages are installed!"
    fi
else
    warn "pacman package manager not detected. Skipping system package installation."
fi

# -----------------------------------------------------------------------------
# Font Cache Rebuild
# -----------------------------------------------------------------------------
if command -v fc-cache >/dev/null 2>&1; then
    info "Updating system font caches with fc-cache..."
    fc-cache -fv >/dev/null 2>&1 || true
fi

# -----------------------------------------------------------------------------
# Zsh & Oh My Zsh Environment Setup
# -----------------------------------------------------------------------------
info "Setting up Zsh environment & Oh My Zsh plugins..."

# Install Oh My Zsh if missing
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    info "Installing Oh My Zsh framework..."
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended || warn "Oh My Zsh automated installation encountered an issue."
fi

# Install custom Zsh plugins required by .zshrc
ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"
mkdir -p "$ZSH_CUSTOM/plugins"

if [ ! -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ]; then
    info "Cloning zsh-autosuggestions plugin..."
    git clone https://github.com/zsh-users/zsh-autosuggestions "$ZSH_CUSTOM/plugins/zsh-autosuggestions" || true
fi

if [ ! -d "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting" ]; then
    info "Cloning zsh-syntax-highlighting plugin..."
    git clone https://github.com/zsh-users/zsh-syntax-highlighting "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting" || true
fi

# Set default shell to zsh if available
if command -v zsh >/dev/null 2>&1; then
    CURRENT_SHELL="$(basename "$SHELL" 2>/dev/null || echo "")"
    if [ "$CURRENT_SHELL" != "zsh" ]; then
        info "Setting user default shell to Zsh..."
        chsh -s "$(which zsh)" "$USER" 2>/dev/null || true
    fi
fi

success "Dependency check, font cache rebuild, and Zsh setup finished successfully!"
