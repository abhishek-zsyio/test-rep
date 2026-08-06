#!/usr/bin/env bash
# install.sh — Automated installer & bootstrapper for NamiConfig dotfiles
# Arch Linux + Hyprland Rice

set -euo pipefail

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}"
THEMES_DIR="$HOME/.themes"
BACKUP_DIR="$HOME/.dotfiles_backup_$(date +%Y%m%d_%H%M%S)"

# Default flags
YES_MODE=false
FORCE_MODE=false
SKIP_PKG=false

# ANSI Color Codes
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

info()    { echo -e "${BLUE}${BOLD}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}${BOLD}[SUCCESS]${NC} $*"; }
warn()    { echo -e "${YELLOW}${BOLD}[WARNING]${NC} $*"; }
error()   { echo -e "${RED}${BOLD}[ERROR]${NC} $*"; }

usage() {
    cat << EOF
Usage: ./install.sh [OPTIONS]

Options:
  -y, --yes          Automatic yes to all prompts (non-interactive mode)
  -f, --force        Force backup & overwriting of conflicting configurations
  --no-pkg           Skip system package installation check
  -h, --help         Show this help message

Description:
  Bootstraps the NamiConfig Hyprland dotfiles repository by installing
  dependencies, backing up existing configurations, and linking dotfiles cleanly
  using GNU Stow.
EOF
    exit 0
}

# Parse command line flags
for arg in "$@"; do
    case "$arg" in
        -y|--yes)
            YES_MODE=true
            ;;
        -f|--force)
            FORCE_MODE=true
            ;;
        --no-pkg)
            SKIP_PKG=true
            ;;
        -h|--help)
            usage
            ;;
        *)
            error "Unknown argument: $arg"
            echo "Run ./install.sh --help for usage information."
            exit 1
            ;;
    esac
done

echo -e "${BOLD}=================================================================${NC}"
echo -e "${BOLD}              🌊 NamiConfig 2.0 Dotfiles Installer               ${NC}"
echo -e "${BOLD}=================================================================${NC}"
echo " Dotfiles directory: $DOTFILES_DIR"
echo " Target config path: $CONFIG_DIR"
echo " Target themes path: $THEMES_DIR"
echo -e "${BOLD}=================================================================${NC}"

if [[ "$YES_MODE" != true ]]; then
    read -r -p "Do you want to proceed with the installation? [Y/n] " response
    case "$response" in
        [nN][oO]|[nN])
            warn "Installation cancelled by user."
            exit 0
            ;;
        *)
            info "Starting installation..."
            ;;
    esac
fi

# -----------------------------------------------------------------------------
# 1. Package Installation (Arch Linux / Pacman / AUR)
# -----------------------------------------------------------------------------
if [[ "$SKIP_PKG" != true ]]; then
    info "[1/4] Checking system dependencies..."
    
    REQUIRED_PACKAGES=(
        hyprland waybar swaync kitty rofi nemo bat cava swappy stow
        python python-gobject qt5ct qt6ct nwg-look brightnessctl pamixer
        wireplumber playerctl swww mako zathura ttf-jetbrains-mono-nerd
        ttf-font-awesome papirus-icon-theme bibata-cursor-theme
    )
    
    MISSING_PACKAGES=()

    if command -v pacman >/dev/null 2>&1; then
        for pkg in "${REQUIRED_PACKAGES[@]}"; do
            if ! pacman -Qq "$pkg" >/dev/null 2>&1; then
                MISSING_PACKAGES+=("$pkg")
            fi
        done

        if [ ${#MISSING_PACKAGES[@]} -gt 0 ]; then
            warn "The following packages appear to be missing: ${MISSING_PACKAGES[*]}"
            
            INSTALL_PKGS=false
            if [[ "$YES_MODE" == true ]]; then
                INSTALL_PKGS=true
            else
                read -r -p "Would you like to install missing packages via pacman/AUR helper? [Y/n] " pkg_ans
                case "$pkg_ans" in
                    [nN][oO]|[nN])
                        warn "Skipping package installation. Note that missing packages may affect functionality."
                        ;;
                    *)
                        INSTALL_PKGS=true
                        ;;
                esac
            fi

            if [[ "$INSTALL_PKGS" == true ]]; then
                AUR_HELPER=""
                if command -v yay >/dev/null 2>&1; then
                    AUR_HELPER="yay"
                elif command -v paru >/dev/null 2>&1; then
                    AUR_HELPER="paru"
                fi

                if [ -n "$AUR_HELPER" ]; then
                    info "Installing packages using $AUR_HELPER..."
                    "$AUR_HELPER" -S --needed --noconfirm "${MISSING_PACKAGES[@]}" || warn "Some packages could not be installed."
                else
                    info "Installing available official packages with pacman..."
                    sudo pacman -S --needed --noconfirm "${MISSING_PACKAGES[@]}" || warn "Some pacman packages failed to install."
                fi
            fi
        else
            success "All core required packages are installed!"
        fi
    else
        warn "pacman not detected on this system. Skipping automated package installation."
    fi
else
    info "[1/4] Skipping package installation check (--no-pkg specified)."
fi

# -----------------------------------------------------------------------------
# 2. Backup Existing Conflicting Configs
# -----------------------------------------------------------------------------
info "[2/4] Checking for pre-existing configuration conflicts..."

TARGET_CONFIG_ITEMS=(
    "cava" "ghostty" "hypr" "kitty" "Kvantum" "mako" "NamiThemes"
    "nvim" "qt5ct" "qt6ct" "rofi" "scripts" "spicetify" "starship.toml"
    "swappy" "swaync" "waybar" "zathura" ".current_theme"
)

NEEDS_BACKUP=()

# Check .config items
for item in "${TARGET_CONFIG_ITEMS[@]}"; do
    target_path="$CONFIG_DIR/$item"
    if [ -e "$target_path" ] || [ -L "$target_path" ]; then
        # Check if it's already a symlink pointing to our dotfiles
        real_path="$(realpath "$target_path" 2>/dev/null || true)"
        if [[ "$real_path" != "$DOTFILES_DIR/.config/$item"* ]]; then
            NEEDS_BACKUP+=("$CONFIG_DIR/$item")
        fi
    fi
done

# Check .themes item
if [ -e "$THEMES_DIR" ] || [ -L "$THEMES_DIR" ]; then
    real_path="$(realpath "$THEMES_DIR" 2>/dev/null || true)"
    if [[ "$real_path" != "$DOTFILES_DIR/.themes"* ]]; then
        NEEDS_BACKUP+=("$THEMES_DIR")
    fi
fi

# Check .zshrc item
ZSHRC_TARGET="$HOME/.zshrc"
if [ -e "$ZSHRC_TARGET" ] || [ -L "$ZSHRC_TARGET" ]; then
    real_path="$(realpath "$ZSHRC_TARGET" 2>/dev/null || true)"
    if [[ "$real_path" != "$DOTFILES_DIR/.zshrc"* ]]; then
        NEEDS_BACKUP+=("$ZSHRC_TARGET")
    fi
fi

if [ ${#NEEDS_BACKUP[@]} -gt 0 ]; then
    warn "Found ${#NEEDS_BACKUP[@]} existing item(s) that conflict with NamiConfig dotfiles."
    info "Creating backup at: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"

    for item in "${NEEDS_BACKUP[@]}"; do
        rel_rel="$(basename "$item")"
        if [[ "$item" == "$CONFIG_DIR"* ]]; then
            mkdir -p "$BACKUP_DIR/.config"
            mv "$item" "$BACKUP_DIR/.config/"
            info "  - Backed up: $item -> $BACKUP_DIR/.config/$rel_rel"
        else
            mv "$item" "$BACKUP_DIR/"
            info "  - Backed up: $item -> $BACKUP_DIR/$rel_rel"
        fi
    done
    success "Backup completed successfully!"
else
    success "No conflicting configuration items found."
fi

# -----------------------------------------------------------------------------
# 3. Deploy Dotfiles (Stow or Symlink Fallback)
# -----------------------------------------------------------------------------
info "[3/4] Deploying dotfiles configurations..."

# Ensure executable permissions for scripts
if [ -d "$DOTFILES_DIR/.config/scripts" ]; then
    chmod +x "$DOTFILES_DIR/.config/scripts/"* 2>/dev/null || true
fi

mkdir -p "$CONFIG_DIR"

if command -v stow >/dev/null 2>&1; then
    info "Using GNU Stow to symlink configurations..."
    cd "$DOTFILES_DIR"
    stow --target="$HOME" --restow . || {
        warn "GNU Stow encountered an issue. Falling back to direct symlinking..."
        for item in "${TARGET_CONFIG_ITEMS[@]}"; do
            ln -sfn "$DOTFILES_DIR/.config/$item" "$CONFIG_DIR/$item"
        done
        ln -sfn "$DOTFILES_DIR/.themes" "$THEMES_DIR"
        ln -sfn "$DOTFILES_DIR/.zshrc" "$HOME/.zshrc"
    }
else
    info "GNU Stow not found. Deploying via direct symlinks..."
    for item in "${TARGET_CONFIG_ITEMS[@]}"; do
        ln -sfn "$DOTFILES_DIR/.config/$item" "$CONFIG_DIR/$item"
    done
    ln -sfn "$DOTFILES_DIR/.themes" "$THEMES_DIR"
    ln -sfn "$DOTFILES_DIR/.zshrc" "$HOME/.zshrc"
fi

success "Dotfiles linked successfully!"

# -----------------------------------------------------------------------------
# 4. Initialization & Permissions
# -----------------------------------------------------------------------------
info "[4/4] Finalizing setup and state..."

# Initialize theme state file if missing
STATE_FILE="$CONFIG_DIR/.current_theme"
if [ ! -f "$STATE_FILE" ]; then
    echo "dark" > "$STATE_FILE"
fi

# Make python mode toggle executable if python script exists
if [ -f "$CONFIG_DIR/scripts/mode_toggle.py" ]; then
    chmod +x "$CONFIG_DIR/scripts/mode_toggle.py"
fi

echo -e "${BOLD}=================================================================${NC}"
echo -e "${GREEN}${BOLD}      🎉 NamiConfig 2.0 installation completed successfully!     ${NC}"
echo -e "${BOLD}=================================================================${NC}"
if [ ${#NEEDS_BACKUP[@]} -gt 0 ]; then
    echo -e " 📁 Backup saved to: ${YELLOW}$BACKUP_DIR${NC}"
fi
echo " 🌗 Switch themes anytime with: ~/.config/scripts/mode_toggle.py"
echo " 🚀 Log out and log back into Hyprland to experience your new rice!"
echo -e "${BOLD}=================================================================${NC}"
