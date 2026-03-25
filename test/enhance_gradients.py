"""
Enhance gradients.json with better names, colorsname, and keywords.

This script processes every gradient entry and:
1. Generates richer, more descriptive color names (e.g. "dusty rose" instead of "light pink")
2. Generates more meaningful and searchable keywords (moods, themes, use-cases)
3. Keeps the existing `name` unless it's clearly bad (too technical/generic)
"""

import json
import colorsys
import math
import os
import re


INPUT_PATH = r'c:\Users\Baraa\Desktop\work\eng\openSource\gradlyAI\client\src\shared\lib\gradients.json'
OUTPUT_PATH = INPUT_PATH  # Overwrite in place


def hex_to_rgb(hex_color: str) -> tuple:
    """Convert a hex color string to an RGB tuple (0-255)."""
    hex_color = hex_color.strip().lstrip('#')
    if len(hex_color) == 3:
        hex_color = ''.join(c * 2 for c in hex_color)
    if len(hex_color) != 6:
        return (128, 128, 128)
    try:
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    except ValueError:
        return (128, 128, 128)


def rgb_to_hsl(r: int, g: int, b: int) -> tuple:
    """Convert RGB (0-255) to HSL (h: 0-360, s: 0-100, l: 0-100)."""
    r_norm, g_norm, b_norm = r / 255.0, g / 255.0, b / 255.0
    h, l, s = colorsys.rgb_to_hls(r_norm, g_norm, b_norm)
    return round(h * 360), round(s * 100), round(l * 100)


def get_detailed_color_name(hex_color: str) -> str:
    """Get a rich, descriptive color name from a hex value."""
    r, g, b = hex_to_rgb(hex_color)
    h, s, l = rgb_to_hsl(r, g, b)

    # Handle achromatic colors
    if s < 8:
        if l < 5:
            return "jet black"
        elif l < 15:
            return "charcoal"
        elif l < 25:
            return "dark slate"
        elif l < 35:
            return "gunmetal"
        elif l < 45:
            return "steel gray"
        elif l < 55:
            return "silver"
        elif l < 65:
            return "ash gray"
        elif l < 75:
            return "light silver"
        elif l < 85:
            return "pearl"
        elif l < 95:
            return "ivory"
        else:
            return "white"

    # Determine hue family with rich names
    hue_names = _get_hue_based_name(h, s, l)
    return hue_names


def _get_hue_based_name(h: int, s: int, l: int) -> str:
    """Map HSL values to rich descriptive color names."""

    # Lightness prefix
    if l < 15:
        lightness = "deep "
    elif l < 30:
        lightness = "dark "
    elif l < 45:
        lightness = ""
    elif l < 55:
        lightness = ""
    elif l < 70:
        lightness = "soft "
    elif l < 85:
        lightness = "pale "
    else:
        lightness = "pastel "

    # Saturation modifier
    if s < 25:
        sat_mod = "muted "
    elif s < 50:
        sat_mod = "dusty "
    elif s > 85:
        sat_mod = "vivid "
    else:
        sat_mod = ""

    # Hue-based naming with richer vocabulary
    if h < 10 or h >= 350:
        base_names = {
            (0, 15, 0, 100): "crimson",
            (0, 30, 0, 50): "maroon",
            (0, 30, 50, 100): "ruby",
            (0, 45, 0, 100): "red",
            (0, 60, 0, 50): "scarlet",
            (0, 60, 50, 100): "cherry",
            (0, 75, 0, 100): "rose",
            (0, 100, 0, 50): "blush",
            (0, 100, 50, 100): "petal pink",
        }
        base = _match_range(l, s, "red", [
            (15, "crimson"), (30, "maroon"), (45, "scarlet"),
            (60, "cherry"), (75, "rose"), (90, "blush"), (100, "petal pink")
        ])
    elif h < 25:
        base = _match_range(l, s, "vermillion", [
            (20, "rust"), (35, "burnt sienna"), (50, "tangerine"),
            (65, "apricot"), (80, "peach"), (100, "champagne")
        ])
    elif h < 40:
        base = _match_range(l, s, "orange", [
            (20, "burnt orange"), (35, "amber"), (50, "marigold"),
            (65, "honey"), (80, "cantaloupe"), (100, "cream")
        ])
    elif h < 55:
        base = _match_range(l, s, "gold", [
            (20, "bronze"), (35, "ochre"), (50, "goldenrod"),
            (65, "saffron"), (80, "butter"), (100, "vanilla")
        ])
    elif h < 70:
        base = _match_range(l, s, "yellow", [
            (20, "olive"), (35, "citrine"), (50, "chartreuse"),
            (65, "lemon"), (80, "canary"), (100, "cream")
        ])
    elif h < 90:
        base = _match_range(l, s, "lime", [
            (20, "moss"), (35, "fern"), (50, "lime"),
            (65, "spring green"), (80, "pistachio"), (100, "honeydew")
        ])
    elif h < 140:
        base = _match_range(l, s, "green", [
            (20, "forest"), (35, "emerald"), (50, "jade"),
            (65, "sage"), (80, "mint"), (100, "seafoam")
        ])
    elif h < 170:
        base = _match_range(l, s, "teal", [
            (20, "deep teal"), (35, "dark cyan"), (50, "teal"),
            (65, "aquamarine"), (80, "robin egg"), (100, "ice blue")
        ])
    elif h < 200:
        base = _match_range(l, s, "cyan", [
            (20, "midnight blue"), (35, "cerulean"), (50, "azure"),
            (65, "sky blue"), (80, "powder blue"), (100, "alice blue")
        ])
    elif h < 230:
        base = _match_range(l, s, "blue", [
            (15, "navy"), (25, "midnight"), (35, "cobalt"),
            (50, "sapphire"), (65, "cornflower"), (80, "periwinkle"), (100, "lavender blue")
        ])
    elif h < 260:
        base = _match_range(l, s, "indigo", [
            (20, "deep indigo"), (35, "royal purple"), (50, "iris"),
            (65, "wisteria"), (80, "thistle"), (100, "pale lavender")
        ])
    elif h < 290:
        base = _match_range(l, s, "purple", [
            (20, "dark plum"), (35, "amethyst"), (50, "violet"),
            (65, "orchid"), (80, "lilac"), (100, "lavender")
        ])
    elif h < 320:
        base = _match_range(l, s, "magenta", [
            (20, "dark magenta"), (35, "fuchsia"), (50, "magenta"),
            (65, "hot pink"), (80, "pink"), (100, "baby pink")
        ])
    elif h < 350:
        base = _match_range(l, s, "rose", [
            (20, "burgundy"), (35, "wine"), (50, "raspberry"),
            (65, "coral pink"), (80, "salmon"), (100, "rose quartz")
        ])
    else:
        base = "red"

    # Combine, avoiding redundant modifiers
    if lightness.strip() in base.lower() or sat_mod.strip() in base.lower():
        return base
    if l < 15 or l > 85:
        return f"{lightness}{base}"
    if s < 25 or s > 85:
        return f"{sat_mod}{base}"
    return base


def _match_range(lightness: int, saturation: int, default: str,
                 ranges: list) -> str:
    """Pick a name from ranges based on lightness value."""
    for threshold, name in ranges:
        if lightness <= threshold:
            return name
    return default


def get_gradient_mood(colors_hex: list) -> list:
    """Determine mood/theme keywords based on the overall gradient palette."""
    moods = set()
    hsls = [rgb_to_hsl(*hex_to_rgb(c)) for c in colors_hex]

    avg_h = sum(h for h, _, _ in hsls) / len(hsls)
    avg_s = sum(s for _, s, _ in hsls) / len(hsls)
    avg_l = sum(l for _, _, l in hsls) / len(hsls)

    # Lightness-based moods
    if avg_l < 25:
        moods.update(["dark", "bold", "dramatic"])
    elif avg_l < 40:
        moods.update(["moody", "deep"])
    elif avg_l > 75:
        moods.update(["light", "airy", "soft"])
    elif avg_l > 60:
        moods.update(["bright", "cheerful"])

    # Saturation-based moods
    if avg_s > 70:
        moods.update(["vibrant", "energetic"])
    elif avg_s < 20:
        moods.update(["muted", "subtle", "minimal"])
    elif avg_s < 40:
        moods.update(["calm", "serene"])

    # Hue-based theme keywords
    for h, s, l in hsls:
        if 0 <= h < 30 or h >= 340:
            moods.update(["warm", "passionate"])
        elif 30 <= h < 70:
            moods.update(["warm", "golden"])
        elif 70 <= h < 160:
            moods.update(["natural", "organic"])
        elif 160 <= h < 250:
            moods.update(["cool", "professional"])
        elif 250 <= h < 340:
            moods.update(["creative", "artistic"])

    # Contrast-based
    lightness_values = [l for _, _, l in hsls]
    if len(lightness_values) >= 2:
        contrast = max(lightness_values) - min(lightness_values)
        if contrast > 50:
            moods.update(["high-contrast", "striking"])
        elif contrast < 15:
            moods.update(["harmonious", "smooth"])

    # Hue range
    hues = [h for h, _, _ in hsls]
    if len(hues) >= 2:
        hue_range = max(hues) - min(hues)
        if hue_range > 180:
            hue_range = 360 - hue_range
        if hue_range < 30:
            moods.add("monochromatic")
        elif hue_range > 120:
            moods.add("colorful")

    return sorted(moods)


def get_use_case_keywords(colors_hex: list) -> list:
    """Generate use-case keywords based on color analysis."""
    cases = set()
    hsls = [rgb_to_hsl(*hex_to_rgb(c)) for c in colors_hex]

    avg_l = sum(l for _, _, l in hsls) / len(hsls)
    avg_s = sum(s for _, s, _ in hsls) / len(hsls)
    avg_h = sum(h for h, _, _ in hsls) / len(hsls)

    # Design use-cases
    if avg_l < 30:
        cases.update(["dark-mode", "night-theme"])
    if avg_l > 70:
        cases.update(["light-theme", "clean"])

    if avg_s > 60:
        cases.update(["hero-section", "banner"])
    if avg_s < 30:
        cases.update(["background", "subtle-bg"])

    # Industry/context keywords
    for h, s, l in hsls:
        if 200 <= h <= 250 and s > 40:
            cases.update(["tech", "corporate"])
        if 90 <= h <= 150 and s > 40:
            cases.update(["eco", "health", "wellness"])
        if (h < 30 or h > 330) and s > 50:
            cases.update(["food", "lifestyle"])
        if 270 <= h <= 320 and s > 40:
            cases.update(["fashion", "beauty"])
        if 40 <= h <= 65 and s > 40 and l > 50:
            cases.update(["summer", "tropical"])

    return sorted(cases)


def generate_keywords_for_color(hex_color: str, color_name: str) -> list:
    """Generate a list of keywords for a single color stop."""
    r, g, b = hex_to_rgb(hex_color)
    h, s, l = rgb_to_hsl(r, g, b)

    keywords = set()

    # Add the color name words
    for word in color_name.split():
        if len(word) > 2:
            keywords.add(word.lower())

    # Hue family keyword
    hue_families = [
        (15, ["red", "crimson", "fire"]),
        (35, ["orange", "amber", "sunset"]),
        (55, ["yellow", "gold", "solar"]),
        (80, ["lime", "chartreuse", "spring"]),
        (140, ["green", "emerald", "forest"]),
        (175, ["teal", "aqua", "lagoon"]),
        (200, ["cyan", "sky", "ice"]),
        (240, ["blue", "ocean", "sapphire"]),
        (270, ["indigo", "twilight", "dusk"]),
        (300, ["purple", "violet", "amethyst"]),
        (330, ["magenta", "fuchsia", "neon"]),
        (360, ["rose", "coral", "berry"]),
    ]
    for threshold, names in hue_families:
        if h <= threshold:
            keywords.update(names[:2])
            break

    # Lightness keywords
    if l < 20:
        keywords.update(["dark", "deep"])
    elif l < 40:
        keywords.add("dark")
    elif l > 80:
        keywords.update(["light", "pale"])
    elif l > 65:
        keywords.add("light")

    # Saturation keywords
    if s > 80:
        keywords.add("vivid")
    elif s > 60:
        keywords.add("rich")
    elif s < 15:
        keywords.add("muted")

    return sorted(keywords)


def should_rename(name: str) -> bool:
    """Determine if a gradient name should be replaced."""
    bad_patterns = [
        "container", "orchestration", "kubernetes", "docker",
        "computer graphics", "solar panel", "api", "devops",
        "microservice", "pipeline", "backend", "frontend",
        "database", "server", "framework", "algorithm",
        "machine learning", "blockchain", "protocol",
        "function", "variable", "module", "binary",
        "compiler", "runtime", "kernel", "daemon",
        "socket", "thread", "mutex", "cache",
        "endpoint", "middleware", "proxy", "gateway",
        "terraform", "ansible", "jenkins", "CI/CD",
        "webpack", "npm", "git", "linux",
    ]
    name_lower = name.lower()
    for pattern in bad_patterns:
        if pattern in name_lower:
            return True
    return False


def generate_gradient_name(colors_hex: list, original_name: str) -> str:
    """Generate a new gradient name or keep the original if it's good."""
    if not should_rename(original_name):
        return original_name

    hsls = [rgb_to_hsl(*hex_to_rgb(c)) for c in colors_hex]
    avg_h = sum(h for h, _, _ in hsls) / len(hsls)
    avg_l = sum(l for _, _, l in hsls) / len(hsls)
    avg_s = sum(s for _, s, _ in hsls) / len(hsls)

    # Theme name pairs
    name_pools = {
        "warm_dark": ["Ember Glow", "Molten Core", "Firelight", "Smoked Amber", "Volcanic Dusk"],
        "warm_light": ["Peach Blossom", "Golden Hour", "Sunrise Mist", "Honey Glaze", "Warm Breeze"],
        "warm_mid": ["Autumn Harvest", "Copper Sun", "Desert Rose", "Terracotta", "Canyon Sunset"],
        "cool_dark": ["Midnight Ocean", "Deep Space", "Arctic Night", "Shadow Reef", "Abyss Blue"],
        "cool_light": ["Morning Frost", "Crystal Lake", "Winter Sky", "Icy Breeze", "Cloud Nine"],
        "cool_mid": ["Ocean Drift", "Steel Stream", "Glacier Blue", "Marine Layer", "Cobalt Wave"],
        "purple_dark": ["Mystic Twilight", "Plum Velvet", "Dark Orchid", "Nebula Night", "Eclipse"],
        "purple_light": ["Lavender Dream", "Lilac Mist", "Soft Iris", "Pastel Dusk", "Wisteria"],
        "purple_mid": ["Violet Storm", "Amethyst", "Purple Haze", "Royal Veil", "Majestic"],
        "green_dark": ["Dark Forest", "Emerald Depth", "Midnight Pine", "Shadow Grove", "Deep Moss"],
        "green_light": ["Spring Meadow", "Fresh Mint", "Morning Dew", "Lime Sorbet", "Pistachio"],
        "green_mid": ["Forest Canopy", "Jade Garden", "Sage Retreat", "Fern Valley", "Evergreen"],
        "neutral": ["Smoky Quartz", "Misty Gray", "Silver Haze", "Graphite", "Platinum"],
    }

    if avg_s < 15:
        key = "neutral"
    elif 0 <= avg_h < 60 or avg_h >= 330:
        prefix = "warm"
        if avg_l < 35:
            key = f"{prefix}_dark"
        elif avg_l > 65:
            key = f"{prefix}_light"
        else:
            key = f"{prefix}_mid"
    elif 60 <= avg_h < 160:
        prefix = "green"
        if avg_l < 35:
            key = f"{prefix}_dark"
        elif avg_l > 65:
            key = f"{prefix}_light"
        else:
            key = f"{prefix}_mid"
    elif 250 <= avg_h < 330:
        prefix = "purple"
        if avg_l < 35:
            key = f"{prefix}_dark"
        elif avg_l > 65:
            key = f"{prefix}_light"
        else:
            key = f"{prefix}_mid"
    else:
        prefix = "cool"
        if avg_l < 35:
            key = f"{prefix}_dark"
        elif avg_l > 65:
            key = f"{prefix}_light"
        else:
            key = f"{prefix}_mid"

    pool = name_pools.get(key, name_pools["neutral"])
    # Use a hash of the hex colors to deterministically pick a name
    hash_val = hash(tuple(colors_hex))
    return pool[abs(hash_val) % len(pool)]


# Track used names to avoid duplicates
_used_names = set()


def get_unique_name(colors_hex: list, original_name: str) -> str:
    """Ensure gradient names are unique."""
    name = generate_gradient_name(colors_hex, original_name)
    if name not in _used_names:
        _used_names.add(name)
        return name

    # If duplicate, append a suffix
    base = name
    counter = 2
    while name in _used_names:
        name = f"{base} {counter}"
        counter += 1
    _used_names.add(name)
    return name


def enhance_gradient(gradient: dict) -> dict:
    """Enhance a single gradient entry with better data."""
    colors = gradient.get('colors', [])
    if not colors:
        return gradient

    original_name = gradient.get('name', 'Unnamed')

    # 1. Generate better color names
    new_colorsname = [get_detailed_color_name(c) for c in colors]

    # 2. Generate per-color keywords
    new_keywords = []
    for hex_color, color_name in zip(colors, new_colorsname):
        kws = generate_keywords_for_color(hex_color, color_name)
        new_keywords.append(kws)

    # 3. Add gradient-level mood keywords to the first color's keywords
    mood_keywords = get_gradient_mood(colors)
    use_case_keywords = get_use_case_keywords(colors)
    if new_keywords:
        combined_first = sorted(set(new_keywords[0] + mood_keywords + use_case_keywords))
        new_keywords[0] = combined_first

    # 4. Maybe rename
    new_name = get_unique_name(colors, original_name)

    return {
        'name': new_name,
        'colors': colors,
        'colorsname': new_colorsname,
        'keywords': new_keywords,
    }


def main():
    print(f"Loading gradients from: {INPUT_PATH}")
    with open(INPUT_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Total gradients: {len(data)}")

    enhanced = []
    for i, gradient in enumerate(data):
        if not isinstance(gradient, dict):
            enhanced.append(gradient)
            continue
        enhanced.append(enhance_gradient(gradient))
        if (i + 1) % 200 == 0:
            print(f"  Processed {i + 1}/{len(data)}...")

    print(f"Writing enhanced gradients to: {OUTPUT_PATH}")
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(enhanced, f, indent=2, ensure_ascii=False)

    print("Done!")

    # Print a few samples
    for i in [0, 50, 100, 500, 1000]:
        if i < len(enhanced):
            g = enhanced[i]
            print(f"\n[{i}] {g.get('name')}")
            print(f"  colorsname: {g.get('colorsname')}")
            print(f"  keywords: {g.get('keywords')}")


if __name__ == "__main__":
    main()
