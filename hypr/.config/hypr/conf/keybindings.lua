-- Keybindings Configuration (macOS Style: SUPER = Cmd)

-- Core Applications
hl.bind("SUPER + RETURN", hl.dsp.exec_cmd("kitty"))
hl.bind("SUPER + E", hl.dsp.exec_cmd("nautilus"))
hl.bind("SUPER + SPACE", hl.dsp.exec_cmd("walker"))

-- Window Management
hl.bind("SUPER + Q", hl.dsp.window.close())
hl.bind("SUPER + V", hl.dsp.window.float({ action = "toggle" }))
hl.bind("SUPER + F", hl.dsp.window.fullscreen())
hl.bind("SUPER + P", hl.dsp.window.pseudo({ action = "toggle" }))
hl.bind("SUPER + J", hl.dsp.layout("togglesplit"))

-- Focus Movement
hl.bind("SUPER + left", hl.dsp.focus({ direction = "l" }))
hl.bind("SUPER + right", hl.dsp.focus({ direction = "r" }))
hl.bind("SUPER + up", hl.dsp.focus({ direction = "u" }))
hl.bind("SUPER + down", hl.dsp.focus({ direction = "d" }))

-- Window Movement
hl.bind("SUPER + SHIFT + left", hl.dsp.window.move({ direction = "l" }))
hl.bind("SUPER + SHIFT + right", hl.dsp.window.move({ direction = "r" }))
hl.bind("SUPER + SHIFT + up", hl.dsp.window.move({ direction = "u" }))
hl.bind("SUPER + SHIFT + down", hl.dsp.window.move({ direction = "d" }))

-- AGS Shell Toggles
hl.bind("SUPER + C", hl.dsp.exec_cmd("ags request control-center toggle"))
hl.bind("SUPER + UP", hl.dsp.exec_cmd("ags request overview toggle"))
hl.bind("SUPER + SHIFT + T", hl.dsp.exec_cmd("ags request theme-picker toggle"))
hl.bind("SUPER + SHIFT + S", hl.dsp.exec_cmd("ags request screenshot toggle"))

-- Hardware Media & Brightness Controls
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("volume --inc"))
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("volume --dec"))
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("volume --toggle"))
hl.bind("XF86MonBrightnessUp", hl.dsp.exec_cmd("brightness --inc"))
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_cmd("brightness --dec"))

-- Workspaces Switch & Move (1-9)
for i = 1, 9 do
    hl.bind("SUPER + " .. i, hl.dsp.focus({ workspace = i }))
    hl.bind("SUPER + SHIFT + " .. i, hl.dsp.window.move({ workspace = i }))
end

-- Mouse Binds (Move/Resize)
hl.bind("SUPER + mouse:272", hl.dsp.window.drag(), { mouse = true })
hl.bind("SUPER + mouse:273", hl.dsp.window.resize(), { mouse = true })
