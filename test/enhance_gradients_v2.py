"""
Smart gradient data enhancer v2.

Analyzes actual hex colors via HSL to generate accurate:
- Color names (descriptive, not generic)
- Keywords (themes, moods, use-cases based on REAL color properties)
- Combination-aware keywords (green+brown=nature, blue+purple=galaxy, etc.)

Rules:
- "dark" only if avg lightness < 30
- "nature" only if greens are actually present
- "ocean" only if blues/cyans are present
- Combination logic for multi-color gradients
"""

import json
import colorsys
import os


INPUT_PATH = r'c:\Users\Baraa\Desktop\work\eng\openSource\gradlyAI\client\src\shared\lib\gradients.json'
OUTPUT_PATH = INPUT_PATH


# =============================================================================
# Color Analysis Utilities
# =============================================================================

def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex to RGB (0-255)."""
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
    """Convert RGB (0-255) to HSL (h:0-360, s:0-100, l:0-100)."""
    r_n, g_n, b_n = r / 255.0, g / 255.0, b / 255.0
    h, l, s = colorsys.rgb_to_hls(r_n, g_n, b_n)
    return round(h * 360), round(s * 100), round(l * 100)


def classify_color(hex_color: str) -> dict:
    """Fully classify a single color into family, lightness, saturation, etc."""
    r, g, b = hex_to_rgb(hex_color)
    h, s, l = rgb_to_hsl(r, g, b)

    # --- Is it achromatic? ---
    is_achromatic = s < 10

    # --- Lightness category ---
    if l < 10:
        lightness_cat = "black"
    elif l < 25:
        lightness_cat = "very_dark"
    elif l < 40:
        lightness_cat = "dark"
    elif l < 60:
        lightness_cat = "medium"
    elif l < 75:
        lightness_cat = "light"
    elif l < 90:
        lightness_cat = "very_light"
    else:
        lightness_cat = "white"

    # --- Saturation category ---
    if s < 10:
        sat_cat = "gray"
    elif s < 30:
        sat_cat = "muted"
    elif s < 60:
        sat_cat = "moderate"
    elif s < 85:
        sat_cat = "vivid"
    else:
        sat_cat = "neon"

    # --- Hue family ---
    if is_achromatic:
        hue_family = "neutral"
    elif h < 10 or h >= 350:
        hue_family = "red"
    elif h < 30:
        hue_family = "orange"
    elif h < 50:
        hue_family = "amber"
    elif h < 70:
        hue_family = "yellow"
    elif h < 90:
        hue_family = "lime"
    elif h < 150:
        hue_family = "green"
    elif h < 175:
        hue_family = "teal"
    elif h < 200:
        hue_family = "cyan"
    elif h < 245:
        hue_family = "blue"
    elif h < 275:
        hue_family = "indigo"
    elif h < 310:
        hue_family = "purple"
    elif h < 340:
        hue_family = "pink"
    else:
        hue_family = "red"

    # --- Is it a pastel? ---
    is_pastel = l > 65 and s > 20 and s < 70
    # --- Is it neon-like? ---
    is_neon = s > 80 and l > 40 and l < 70
    # --- Is it earthy? ---
    is_earthy = (hue_family in ("orange", "amber", "yellow", "red") and s < 50 and l < 50)
    is_earthy = is_earthy or (hue_family == "green" and s < 40 and l < 45)

    return {
        "hex": hex_color,
        "r": r, "g": g, "b": b,
        "h": h, "s": s, "l": l,
        "hue_family": hue_family,
        "lightness_cat": lightness_cat,
        "sat_cat": sat_cat,
        "is_achromatic": is_achromatic,
        "is_pastel": is_pastel,
        "is_neon": is_neon,
        "is_earthy": is_earthy,
    }


# =============================================================================
# Rich Color Naming
# =============================================================================

COLOR_NAME_MAP = {
    # (hue_family, lightness_cat) -> name
    # Reds
    ("red", "black"): "blood red",
    ("red", "very_dark"): "maroon",
    ("red", "dark"): "crimson",
    ("red", "medium"): "scarlet",
    ("red", "light"): "coral",
    ("red", "very_light"): "salmon",
    ("red", "white"): "blush",
    # Oranges
    ("orange", "black"): "burnt umber",
    ("orange", "very_dark"): "rust",
    ("orange", "dark"): "burnt sienna",
    ("orange", "medium"): "tangerine",
    ("orange", "light"): "peach",
    ("orange", "very_light"): "apricot",
    ("orange", "white"): "champagne",
    # Ambers
    ("amber", "black"): "dark bronze",
    ("amber", "very_dark"): "bronze",
    ("amber", "dark"): "ochre",
    ("amber", "medium"): "amber",
    ("amber", "light"): "honey",
    ("amber", "very_light"): "butter",
    ("amber", "white"): "vanilla",
    # Yellows
    ("yellow", "black"): "dark olive",
    ("yellow", "very_dark"): "olive",
    ("yellow", "dark"): "citrine",
    ("yellow", "medium"): "goldenrod",
    ("yellow", "light"): "lemon",
    ("yellow", "very_light"): "canary",
    ("yellow", "white"): "cream",
    # Limes
    ("lime", "black"): "dark moss",
    ("lime", "very_dark"): "moss",
    ("lime", "dark"): "fern",
    ("lime", "medium"): "chartreuse",
    ("lime", "light"): "spring green",
    ("lime", "very_light"): "pistachio",
    ("lime", "white"): "honeydew",
    # Greens
    ("green", "black"): "dark forest",
    ("green", "very_dark"): "forest green",
    ("green", "dark"): "emerald",
    ("green", "medium"): "jade",
    ("green", "light"): "sage",
    ("green", "very_light"): "mint",
    ("green", "white"): "seafoam",
    # Teals
    ("teal", "black"): "deep teal",
    ("teal", "very_dark"): "dark teal",
    ("teal", "dark"): "teal",
    ("teal", "medium"): "aquamarine",
    ("teal", "light"): "turquoise",
    ("teal", "very_light"): "robin egg",
    ("teal", "white"): "ice blue",
    # Cyans
    ("cyan", "black"): "midnight cyan",
    ("cyan", "very_dark"): "dark cyan",
    ("cyan", "dark"): "cerulean",
    ("cyan", "medium"): "azure",
    ("cyan", "light"): "sky blue",
    ("cyan", "very_light"): "powder blue",
    ("cyan", "white"): "alice blue",
    # Blues
    ("blue", "black"): "midnight blue",
    ("blue", "very_dark"): "navy",
    ("blue", "dark"): "cobalt",
    ("blue", "medium"): "sapphire",
    ("blue", "light"): "cornflower",
    ("blue", "very_light"): "periwinkle",
    ("blue", "white"): "lavender blue",
    # Indigos
    ("indigo", "black"): "deep indigo",
    ("indigo", "very_dark"): "dark indigo",
    ("indigo", "dark"): "indigo",
    ("indigo", "medium"): "iris",
    ("indigo", "light"): "wisteria",
    ("indigo", "very_light"): "thistle",
    ("indigo", "white"): "pale lavender",
    # Purples
    ("purple", "black"): "deep plum",
    ("purple", "very_dark"): "dark plum",
    ("purple", "dark"): "amethyst",
    ("purple", "medium"): "violet",
    ("purple", "light"): "orchid",
    ("purple", "very_light"): "lilac",
    ("purple", "white"): "lavender",
    # Pinks
    ("pink", "black"): "dark magenta",
    ("pink", "very_dark"): "magenta",
    ("pink", "dark"): "fuchsia",
    ("pink", "medium"): "hot pink",
    ("pink", "light"): "pink",
    ("pink", "very_light"): "rose",
    ("pink", "white"): "baby pink",
    # Neutrals
    ("neutral", "black"): "jet black",
    ("neutral", "very_dark"): "charcoal",
    ("neutral", "dark"): "slate",
    ("neutral", "medium"): "steel gray",
    ("neutral", "light"): "silver",
    ("neutral", "very_light"): "pearl",
    ("neutral", "white"): "white",
}


def get_color_name(info: dict) -> str:
    """Get a descriptive color name from classification."""
    key = (info["hue_family"], info["lightness_cat"])
    base_name = COLOR_NAME_MAP.get(key, info["hue_family"])

    # Add saturation modifier for vivid/neon/muted
    if info["is_neon"] and info["hue_family"] != "neutral":
        return f"neon {base_name}" if "neon" not in base_name else base_name
    if info["sat_cat"] == "muted" and info["hue_family"] != "neutral":
        return f"muted {base_name}"
    return base_name


# =============================================================================
# Keyword Generation - Per Color
# =============================================================================

def get_color_keywords(info: dict) -> list:
    """Generate accurate keywords for a single color."""
    kws = set()

    # 1. Hue family as keyword (always)
    if info["hue_family"] != "neutral":
        kws.add(info["hue_family"])

    # 2. Lightness keywords - ONLY if truly dark/light
    if info["lightness_cat"] in ("black", "very_dark"):
        kws.add("dark")
    elif info["lightness_cat"] == "dark":
        kws.add("dark")
    elif info["lightness_cat"] in ("white", "very_light"):
        kws.add("light")
    elif info["lightness_cat"] == "light":
        kws.add("light")

    # 3. Saturation keywords
    if info["is_neon"]:
        kws.update(["neon", "electric", "vivid"])
    elif info["sat_cat"] == "vivid":
        kws.add("vivid")
    elif info["sat_cat"] == "muted":
        kws.add("muted")

    # 4. Pastel
    if info["is_pastel"]:
        kws.update(["pastel", "soft"])

    # 5. Earthy
    if info["is_earthy"]:
        kws.update(["earthy", "natural"])

    # 6. Specific hue-related search terms people actually type
    hue_search_map = {
        "red": ["red", "crimson"],
        "orange": ["orange", "warm"],
        "amber": ["amber", "golden"],
        "yellow": ["yellow", "gold"],
        "lime": ["lime", "green"],
        "green": ["green", "emerald"],
        "teal": ["teal", "turquoise"],
        "cyan": ["cyan", "aqua"],
        "blue": ["blue", "ocean"],
        "indigo": ["indigo", "purple"],
        "purple": ["purple", "violet"],
        "pink": ["pink", "magenta"],
        "neutral": ["gray", "grey", "neutral"],
    }
    kws.update(hue_search_map.get(info["hue_family"], []))

    return sorted(kws)


# =============================================================================
# Keyword Generation - Gradient Level (Combination Logic)
# =============================================================================

def get_gradient_keywords(color_infos: list) -> list:
    """Generate gradient-level keywords based on color combinations."""
    kws = set()

    families = set(c["hue_family"] for c in color_infos)
    avg_l = sum(c["l"] for c in color_infos) / len(color_infos)
    avg_s = sum(c["s"] for c in color_infos) / len(color_infos)
    min_l = min(c["l"] for c in color_infos)
    max_l = max(c["l"] for c in color_infos)
    contrast = max_l - min_l

    has_dark = any(c["lightness_cat"] in ("black", "very_dark", "dark") for c in color_infos)
    has_light = any(c["lightness_cat"] in ("white", "very_light", "light") for c in color_infos)
    has_neon = any(c["is_neon"] for c in color_infos)
    has_pastel = any(c["is_pastel"] for c in color_infos)
    has_earthy = any(c["is_earthy"] for c in color_infos)
    all_achromatic = all(c["is_achromatic"] for c in color_infos)

    # ---- OVERALL BRIGHTNESS ----
    if avg_l < 25:
        kws.update(["dark", "moody", "dramatic"])
    elif avg_l < 40:
        kws.add("deep")
    elif avg_l > 75:
        kws.update(["light", "airy", "clean"])
    elif avg_l > 60:
        kws.add("bright")

    # ---- OVERALL SATURATION ----
    if avg_s > 70:
        kws.update(["vibrant", "bold", "energetic"])
    elif avg_s < 20:
        kws.update(["muted", "subtle", "minimal"])
    elif avg_s < 40:
        kws.update(["calm", "serene"])

    # ---- CONTRAST ----
    if contrast > 50:
        kws.update(["high-contrast", "striking"])
    elif contrast < 15 and len(color_infos) > 1:
        kws.update(["smooth", "harmonious"])

    # ---- MONOCHROMATIC ----
    if len(families) == 1 and not all_achromatic:
        kws.add("monochromatic")
    elif len(families) >= 3:
        kws.add("colorful")

    # ---- ALL PASTELS ----
    if all(c["is_pastel"] for c in color_infos):
        kws.update(["pastel", "soft", "dreamy"])
    elif has_pastel:
        kws.add("soft")

    # ---- NEUTRAL/GRAYSCALE ----
    if all_achromatic:
        kws.update(["grayscale", "neutral", "minimal", "monochrome"])

    # =======================================
    # COMBINATION LOGIC
    # =======================================

    # -- NATURE: requires actual greens or green+brown/earthy --
    if "green" in families or "lime" in families:
        kws.update(["nature", "natural", "organic"])
        if has_dark:
            kws.add("forest")
        if has_earthy or "amber" in families or "orange" in families:
            kws.update(["earthy", "autumn"])
        if "teal" in families or "cyan" in families:
            kws.add("tropical")
        if has_light or has_pastel:
            kws.update(["fresh", "spring"])

    # -- OCEAN/WATER: requires blues or cyans --
    if "blue" in families or "cyan" in families:
        kws.update(["ocean", "water"])
        if "teal" in families or "green" in families:
            kws.update(["sea", "aquatic", "tropical"])
        if has_dark:
            kws.update(["deep-sea", "midnight"])
        if has_light:
            kws.update(["sky", "fresh"])

    # -- SUNSET: warm colors together --
    warm_families = families & {"red", "orange", "amber", "yellow", "pink"}
    if len(warm_families) >= 2:
        kws.update(["sunset", "sunrise", "warm"])
    elif len(warm_families) == 1 and avg_s > 50:
        kws.add("warm")

    # -- FIRE: reds + oranges/ambers, vivid --
    if ("red" in families or "orange" in families) and avg_s > 60:
        kws.update(["fire", "energy", "passionate"])

    # -- GALAXY/COSMIC: blue + purple/indigo --
    if ("blue" in families or "indigo" in families) and ("purple" in families or "indigo" in families):
        kws.update(["galaxy", "cosmic", "space"])
    if ("purple" in families or "indigo" in families) and has_dark:
        kws.update(["mystic", "twilight"])

    # -- CYBERPUNK: dark + neon --
    if has_dark and has_neon:
        kws.update(["cyberpunk", "gaming", "neon"])

    # -- ROYAL/LUXURY: purple/indigo + gold/amber or dark --
    if ("purple" in families or "indigo" in families):
        kws.update(["royal", "luxury"])
        if "amber" in families or "yellow" in families:
            kws.update(["premium", "elegant", "regal"])

    # -- ROMANTIC: pink + purple or pink + red --
    if "pink" in families:
        kws.update(["romantic", "feminine"])
        if "purple" in families:
            kws.update(["dreamy", "whimsical"])
        if "red" in families:
            kws.add("love")

    # -- EARTH/AUTUMN: browns, ambers, muted oranges --
    if has_earthy or (warm_families and avg_s < 50):
        kws.update(["earthy", "rustic"])
        if "orange" in families or "amber" in families:
            kws.update(["autumn", "fall"])

    # -- MINIMAL/CLEAN: neutral + one color --
    if "neutral" in families and len(families) == 2:
        kws.update(["minimal", "clean", "modern"])

    # -- TECH/CORPORATE: blues with moderate saturation --
    if "blue" in families and 30 < avg_s < 80:
        kws.update(["professional", "corporate", "tech"])

    # -- TROPICAL: bright greens/teals/cyans --
    if ("teal" in families or "cyan" in families) and avg_s > 50 and avg_l > 40:
        kws.update(["tropical", "exotic"])

    # -- NEON --
    if has_neon:
        kws.update(["neon", "electric", "futuristic"])

    # -- WARM vs COOL overall --
    warm_count = sum(1 for c in color_infos if c["hue_family"] in ("red", "orange", "amber", "yellow"))
    cool_count = sum(1 for c in color_infos if c["hue_family"] in ("blue", "cyan", "teal", "indigo"))
    if warm_count > cool_count and warm_count > 0:
        kws.add("warm")
    elif cool_count > warm_count and cool_count > 0:
        kws.add("cool")

    # -- GRADIENT with white/very light + a color -> "fading", "gradient" --
    if has_light and has_dark:
        kws.add("gradient")

    return sorted(kws)


# =============================================================================
# Gradient Name Enhancement
# =============================================================================

_used_names = set()

TECH_JARGON = [
    "container", "orchestration", "kubernetes", "docker",
    "computer graphics", "solar panel", "api", "devops",
    "microservice", "pipeline", "backend", "frontend",
    "database", "server", "framework", "algorithm",
    "machine learning", "blockchain", "protocol",
    "function", "variable", "module", "binary",
    "compiler", "runtime", "kernel", "daemon",
    "socket", "thread", "mutex", "cache",
    "endpoint", "middleware", "proxy", "gateway",
    "terraform", "ansible", "jenkins", "cicd",
    "webpack", "npm", "git ", "linux",
    "neural network", "deep learning", "serverless",
    "load balancer", "message queue", "event loop",
    "data struct", "hash map", "linked list",
    "version control",
]


def should_rename(name: str) -> bool:
    name_lower = name.lower()
    return any(pat in name_lower for pat in TECH_JARGON)


NAME_POOLS = {
    "warm_dark": ["Ember Glow", "Molten Core", "Firelight", "Smoked Amber", "Volcanic Dusk",
                  "Dark Flame", "Burnt Earth", "Midnight Fire", "Copper Night", "Lava Flow"],
    "warm_light": ["Peach Blossom", "Golden Hour", "Sunrise Mist", "Honey Glaze", "Warm Breeze",
                   "Tangerine Dream", "Apricot Cloud", "Cream Soda", "Vanilla Sky", "Morning Glow"],
    "warm_mid": ["Autumn Harvest", "Copper Sun", "Desert Rose", "Terracotta", "Canyon Sunset",
                 "Amber Wave", "Marigold", "Saffron Bloom", "Paprika", "Sienna"],
    "cool_dark": ["Midnight Ocean", "Deep Space", "Arctic Night", "Shadow Reef", "Abyss",
                  "Dark Waters", "Naval Command", "Storm Front", "Blue Depth", "Deep Current"],
    "cool_light": ["Morning Frost", "Crystal Lake", "Winter Sky", "Icy Breeze", "Cloud Nine",
                   "Pale Stream", "Frozen Lake", "Arctic Mist", "Cool Haze", "Blue Whisper"],
    "cool_mid": ["Ocean Drift", "Steel Stream", "Glacier Blue", "Marine Layer", "Cobalt Wave",
                 "Azure Coast", "Pacific Rim", "Blue Lagoon", "Tidal Pool", "Silver Bay"],
    "purple_dark": ["Mystic Twilight", "Plum Velvet", "Dark Orchid", "Nebula Night", "Eclipse",
                    "Witching Hour", "Dark Magic", "Shadow Iris", "Midnight Bloom", "Royal Night"],
    "purple_light": ["Lavender Dream", "Lilac Mist", "Soft Iris", "Pastel Dusk", "Wisteria",
                     "Purple Haze", "Orchid Bloom", "Mauve Cloud", "Violet Mist", "Fairy Dust"],
    "purple_mid": ["Violet Storm", "Amethyst", "Purple Haze", "Royal Veil", "Majestic",
                   "Crown Jewel", "Iris Field", "Plum Garden", "Purple Reign", "Velvet Night"],
    "green_dark": ["Dark Forest", "Emerald Depth", "Midnight Pine", "Shadow Grove", "Deep Moss",
                   "Ancient Wood", "Jungle Night", "Dark Fern", "Pine Shadow", "Moss Rock"],
    "green_light": ["Spring Meadow", "Fresh Mint", "Morning Dew", "Lime Sorbet", "Pistachio",
                    "Garden Party", "Green Tea", "Cucumber Cool", "Jade Mist", "Meadow Breeze"],
    "green_mid": ["Forest Canopy", "Jade Garden", "Sage Retreat", "Fern Valley", "Evergreen",
                  "Emerald Isle", "Green Valley", "Herb Garden", "Botanical", "Leaf Shade"],
    "neutral": ["Smoky Quartz", "Misty Gray", "Silver Haze", "Graphite", "Platinum",
                "Iron Mist", "Concrete", "Ash Cloud", "Ghost White", "Steel Wool"],
    "pink_all": ["Rose Garden", "Cherry Blossom", "Pink Lemonade", "Flamingo", "Berry Blush",
                 "Raspberry", "Cotton Candy", "Fuchsia Dream", "Petal Soft", "Magenta Pulse"],
}


def generate_name(color_infos: list, original: str) -> str:
    if not should_rename(original):
        return original

    families = set(c["hue_family"] for c in color_infos)
    avg_l = sum(c["l"] for c in color_infos) / len(color_infos)
    avg_s = sum(c["s"] for c in color_infos) / len(color_infos)

    if avg_s < 15:
        key = "neutral"
    elif "pink" in families and len(families) <= 2:
        key = "pink_all"
    elif any(f in families for f in ("purple", "indigo")):
        key = f"purple_{'dark' if avg_l < 35 else 'light' if avg_l > 65 else 'mid'}"
    elif any(f in families for f in ("green", "lime", "teal")):
        key = f"green_{'dark' if avg_l < 35 else 'light' if avg_l > 65 else 'mid'}"
    elif any(f in families for f in ("blue", "cyan")):
        key = f"cool_{'dark' if avg_l < 35 else 'light' if avg_l > 65 else 'mid'}"
    elif any(f in families for f in ("red", "orange", "amber", "yellow")):
        key = f"warm_{'dark' if avg_l < 35 else 'light' if avg_l > 65 else 'mid'}"
    else:
        key = "neutral"

    pool = NAME_POOLS.get(key, NAME_POOLS["neutral"])
    colors_str = "".join(c["hex"] for c in color_infos)
    idx = abs(hash(colors_str)) % len(pool)
    name = pool[idx]

    if name not in _used_names:
        _used_names.add(name)
        return name

    # Deduplicate
    base = name
    counter = 2
    while name in _used_names:
        name = f"{base} {counter}"
        counter += 1
    _used_names.add(name)
    return name


# =============================================================================
# Main Enhancement
# =============================================================================

def enhance_gradient(gradient: dict) -> dict:
    colors = gradient.get('colors', [])
    if not colors:
        return gradient

    original_name = gradient.get('name', 'Unnamed')

    # Classify each color
    color_infos = [classify_color(c) for c in colors]

    # Generate rich color names
    new_colorsname = [get_color_name(info) for info in color_infos]

    # Generate per-color keywords
    per_color_keywords = [get_color_keywords(info) for info in color_infos]

    # Generate gradient-level (combination) keywords
    gradient_keywords = get_gradient_keywords(color_infos)

    # Merge gradient keywords into the first color's list
    if per_color_keywords:
        combined_first = sorted(set(per_color_keywords[0] + gradient_keywords))
        per_color_keywords[0] = combined_first

    # Name
    new_name = generate_name(color_infos, original_name)

    return {
        'name': new_name,
        'colors': colors,
        'colorsname': new_colorsname,
        'keywords': per_color_keywords,
    }


def main():
    print(f"Loading: {INPUT_PATH}")
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

    print(f"Writing to: {OUTPUT_PATH}")
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(enhanced, f, indent=2, ensure_ascii=False)

    print("Done!")

    # Verification: check what "nature" and "dark" match
    nature_count = sum(1 for g in enhanced if any("nature" in kw for kws in g.get("keywords", []) for kw in kws))
    dark_count = sum(1 for g in enhanced if any("dark" in kw for kws in g.get("keywords", []) for kw in kws))
    ocean_count = sum(1 for g in enhanced if any("ocean" in kw for kws in g.get("keywords", []) for kw in kws))
    sunset_count = sum(1 for g in enhanced if any("sunset" in kw for kws in g.get("keywords", []) for kw in kws))
    cyberpunk_count = sum(1 for g in enhanced if any("cyberpunk" in kw for kws in g.get("keywords", []) for kw in kws))
    fresh_count = sum(1 for g in enhanced if any("fresh" in kw for kws in g.get("keywords", []) for kw in kws))
    warm_count = sum(1 for g in enhanced if any("warm" in kw for kws in g.get("keywords", []) for kw in kws))

    print(f"\nKeyword coverage:")
    print(f"  'nature': {nature_count} gradients")
    print(f"  'dark': {dark_count} gradients")
    print(f"  'ocean': {ocean_count} gradients")
    print(f"  'sunset': {sunset_count} gradients")
    print(f"  'cyberpunk': {cyberpunk_count} gradients")
    print(f"  'fresh': {fresh_count} gradients")
    print(f"  'warm': {warm_count} gradients")

    # Show samples
    for i in [0, 50, 100, 500, 1000]:
        if i < len(enhanced):
            g = enhanced[i]
            print(f"\n[{i}] {g['name']}")
            print(f"  colors: {g['colors']}")
            print(f"  colorsname: {g['colorsname']}")
            print(f"  keywords: {g['keywords']}")


if __name__ == "__main__":
    main()
