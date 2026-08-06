---
name: hyprland-rice-build
description: Build, extend, or debug Abhishek's Arch Linux + Hyprland + AGS/Astal desktop rice (Stow-managed dotfiles, macOS-style keybindings, Rose Pine reference theme, UTM-VM-first workflow migrating to an IdeaPad Gaming 3 laptop with hybrid NVIDIA/AMD graphics). Use this whenever the task touches Hyprland config, the AGS/Astal shell (bar, notifications, dock, lockscreen, OSD, control-center, tray, theme-picker, workspace overview), the theme-switch/hardware-switch scripts, the GNU Stow dotfiles folder layout, or any tool in the stack (Walker, elephant, cliphist, swww, kitty, Nautilus). Trigger even if the user just says "the rice", "the dotfiles", "my hypr config", or asks to add/fix a widget, theme, or keybinding — don't wait for them to restate the full spec.
---

# Hyprland Rice Build

Full build spec lives in `references/build-spec.md` — read it before
generating or editing any file in `~/dotfiles/`. It's the single
source of truth for folder layout, package choices, and the reasoning
behind each decision (don't re-derive architecture choices already
made there).

`references/keybindings.conf` is the finished macOS-style keybind file
— reuse it as-is rather than regenerating.

## Before doing anything

1. Read `references/build-spec.md` in full — it's ~475 lines but every
   section is load-bearing (folder structure, theme color contract,
   AGS `services/`→`widget/`→`style/` split, hardware-profile pattern).
2. If the task involves Hyprland, Astal, AGS, Walker, elephant,
   cliphist, or swww config specifically: clone that tool's repo/wiki
   per the "Ground truth first" section before writing config for it.
   Do not write Hyprland or AGS config from training-data memory alone
   — both projects move fast enough that assumptions go stale.
3. Check which phase we're in: **UTM VM** (default, until told
   otherwise) or **real laptop** (after `hardware-switch laptop` has
   been run). The build spec's two-phase build order and the
   `hardware/vm.conf` vs `hardware/laptop.conf` split assume this
   distinction — don't apply NVIDIA-specific fixes while still in the
   VM, and don't skip the dual-monitor/battery re-verification once
   migrated to the laptop.

## Quick facts (full detail in build-spec.md)

- Stow packages, one per app: `hypr/`, `hardware/`, `ags/`, `kitty/`,
  `walker/`, `gtk/`, `themes/`, `scripts/`
- Shell layer is one AGS/Astal codebase — not Waybar/SwayNC/hyprlock
- Reference theme: Rose Pine, built first and fully polished; clone
  its pattern for Gruvbox, Catppuccin, Tokyo Night, Nord after
- Every theme folder satisfies the same 8-file color contract
  (`hypr.conf`, `ags.scss`, `kitty.conf`, `walker.css`,
  `gtk3-settings.ini`, `gtk4-settings.ini`, `qt-theme-name`,
  `wallpaper.png`) — adding a theme means adding one folder, not
  editing five apps
- Keybind modifier: SUPER, styled after macOS shortcuts
- Machine: IdeaPad Gaming 3 15ARH05, hybrid NVIDIA GTX 1650 + AMD Vega,
  dual monitor, laptop battery/brightness tooling required

## When something in build-spec.md conflicts with a cloned repo

Trust the cloned repo. The build spec says this explicitly in its own
"Ground truth first" section — it was written without live access to
current tool versions, and Hyprland/Astal/AGS/Walker all move fast.
Flag the discrepancy to the user rather than silently picking one.

## Updating this skill

If a build decision changes (different theme picked, tool swapped,
hardware changes), update `references/build-spec.md` directly rather
than letting this SKILL.md and the spec drift out of sync — this file
should stay a thin pointer, not a second copy of the content.