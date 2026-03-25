"""Verify keyword coverage in gradients.json."""
import json

file_path = r'c:\Users\Baraa\Desktop\work\eng\openSource\gradlyAI\client\src\shared\lib\gradients.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def count_keyword(data, keyword):
    count = 0
    for g in data:
        if not isinstance(g, dict):
            continue
        for kws in g.get("keywords", []):
            if not isinstance(kws, list):
                continue
            if any(keyword in kw for kw in kws):
                count += 1
                break
    return count

keywords_to_check = [
    "nature", "dark", "ocean", "sunset", "cyberpunk", "fresh",
    "warm", "cool", "vibrant", "forest", "minimal", "royal",
    "pastel", "neon", "earthy", "romantic", "energy", "purple",
    "blue", "green", "red", "pink", "tropical",
]

print(f"Total gradients: {len(data)}")
print(f"\nKeyword coverage:")
for kw in keywords_to_check:
    c = count_keyword(data, kw)
    print(f"  '{kw}': {c} gradients")

# Show a few samples
for i in [0, 50, 100, 500, 1000]:
    if i < len(data) and isinstance(data[i], dict):
        g = data[i]
        print(f"\n[{i}] {g['name']}")
        print(f"  colors: {g['colors']}")
        print(f"  colorsname: {g['colorsname']}")
        print(f"  keywords: {g['keywords']}")
