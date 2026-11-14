"""Generate Doora favicons, PWA icons and the OG share image.

Run from the client folder:  python scripts/generate-icons.py
Outputs go to client/public/.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = Path(__file__).resolve().parent.parent / "public"
SS = 4  # supersampling factor

INDIGO_A = (99, 102, 241)   # indigo-500
INDIGO_B = (124, 58, 237)   # violet-600
SLATE = (15, 23, 42)        # #0f172a
WHITE = (255, 255, 255)

# Doora mark on a 24-unit grid: letter D with a checkmark inside
# (mirrors src/components/DooraLogo.jsx). Stroke width in grid units:
STROKE = 2.4


def gradient(size, a=INDIGO_A, b=INDIGO_B):
    """Diagonal top-left -> bottom-right gradient."""
    w, h = size
    g = Image.new("RGB", (w, h))
    px = g.load()
    for y in range(h):
        for x in range(w):
            t = (x + y) / (w + h - 2)
            px[x, y] = tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
    return g


def draw_mark(img, size, frac, color=WHITE):
    """Draw the D + check mark centred in a size x size image.
    frac = share of the tile covered by the 24-unit grid."""
    d = ImageDraw.Draw(img)
    k = size * frac / 24
    o = size * (1 - frac) / 2
    w = STROKE * k

    def p(x, y):
        return (o + x * k, o + y * k)

    def cap(x, y):
        X, Y = p(x, y)
        d.ellipse((X - w / 2, Y - w / 2, X + w / 2, Y + w / 2), fill=color)

    def line(pts):
        d.line([p(*q) for q in pts], fill=color, width=round(w), joint="curve")
        for q in pts:
            cap(*q)

    # D: top bar, stem, bottom bar, then the bowl
    line([(11, 4), (5, 4), (5, 20), (11, 20)])
    x0, y0 = p(11 - 8 - STROKE / 2, 12 - 8 - STROKE / 2)
    x1, y1 = p(11 + 8 + STROKE / 2, 12 + 8 + STROKE / 2)
    d.arc((x0, y0, x1, y1), -90, 90, fill=color, width=round(w))
    # checkmark
    line([(8.6, 12.3), (10.9, 14.6), (15, 9.9)])


def rounded_mask(size, radius):
    m = Image.new("L", (size, size), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    return m


def app_icon(size, *, rounded=True, frac=0.66, transparent=True):
    """Gradient tile with the white Doora mark."""
    S = size * SS
    tile = gradient((S, S)).convert("RGBA")
    # soft top highlight for depth
    hl = Image.new("L", (S, S), 0)
    ImageDraw.Draw(hl).ellipse((-S * 0.4, -S * 1.0, S * 1.4, S * 0.5), fill=30)
    hl = hl.filter(ImageFilter.GaussianBlur(S * 0.12))
    tile = Image.composite(Image.new("RGBA", (S, S), WHITE + (255,)), tile, hl)
    draw_mark(tile, S, frac)
    if rounded:
        out = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        out.paste(tile, (0, 0), rounded_mask(S, round(S * 0.225)))
        tile = out
    img = tile.resize((size, size), Image.LANCZOS)
    return img if transparent else img.convert("RGB")


def og_image():
    W, H = 1200, 630
    S = SS // 2  # 2x is plenty here
    img = Image.new("RGB", (W * S, H * S), SLATE)
    # indigo glow behind the logo
    glow = Image.new("RGB", img.size, SLATE)
    ImageDraw.Draw(glow).ellipse((300 * S, -120 * S, 900 * S, 480 * S), fill=(55, 48, 163))
    glow = glow.filter(ImageFilter.GaussianBlur(140 * S))
    img = Image.blend(img, glow, 0.85)

    # subtle dot grid
    d = ImageDraw.Draw(img)
    for y in range(20, H, 36):
        for x in range(24, W, 36):
            d.ellipse(((x - 1) * S, (y - 1) * S, (x + 1) * S, (y + 1) * S), fill=(30, 41, 59))

    logo = app_icon(132).resize((132 * S, 132 * S), Image.LANCZOS)
    img.paste(logo, ((W // 2 - 66) * S, 132 * S), logo)

    title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 96 * S)
    sub = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 34 * S)
    d = ImageDraw.Draw(img)
    d.text((W * S / 2, 350 * S), "Doora", font=title, fill=WHITE, anchor="mm")
    d.text((W * S / 2, 438 * S), "Smart task management for focused work",
           font=sub, fill=(148, 163, 184), anchor="mm")
    return img.resize((W, H), Image.LANCZOS)


def main():
    OUT.mkdir(exist_ok=True)
    # Favicons: tiny sizes get a slightly bigger mark for legibility
    fav32 = app_icon(32, frac=0.8)
    fav16 = app_icon(16, frac=0.84)
    fav48 = app_icon(48, frac=0.76)
    fav32.save(OUT / "favicon-32x32.png")
    fav16.save(OUT / "favicon-16x16.png")
    fav48.save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)],
               append_images=[fav16, fav32])

    # iOS: full-bleed square, no transparency (iOS applies its own mask)
    app_icon(180, rounded=False, transparent=False).save(OUT / "apple-touch-icon.png")

    # PWA icons
    app_icon(192).save(OUT / "icon-192.png")
    app_icon(512).save(OUT / "icon-512.png")
    # Maskable: full-bleed background, mark well inside the 80% safe zone
    app_icon(512, rounded=False, transparent=False, frac=0.56).save(OUT / "maskable-icon-512.png")

    og_image().save(OUT / "og-image.png", optimize=True)
    print("Wrote assets to", OUT)


if __name__ == "__main__":
    main()
