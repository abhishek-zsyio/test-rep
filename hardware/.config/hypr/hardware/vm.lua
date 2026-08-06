-- UTM VM Hardware Profile
-- virtio-gpu / software rendering fallback profile (no NVIDIA variables)

-- Software / virtio rendering fallbacks if needed
-- hl.env("WLR_RENDERER", "pixman")
-- hl.env("LIBGL_ALWAYS_SOFTWARE", "1")

-- XCursor settings for VM
hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
