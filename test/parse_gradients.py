import json
import re

css_gradients = [
    "linear-gradient(90deg, #a47451 0.000%, #9c9881 16.667%, #73a09d 33.333%, #3b899a 50.000%, #095b79 66.667%, #002847 83.333%, #000116 100.000%)",
    "conic-gradient(from 210deg, #c5bbb8 0.000deg, #c5bbb8 24.000deg, #b8b5b8 calc(24.000deg + 0.1deg), #b8b5b8 48.000deg, #a9afb7 calc(48.000deg + 0.1deg), #a9afb7 72.000deg, #9aa8b5 calc(72.000deg + 0.1deg), #9aa8b5 96.000deg, #8ba1b3 calc(96.000deg + 0.1deg), #8ba1b3 120.000deg, #7d98af calc(120.000deg + 0.1deg), #7d98af 144.000deg, #7090ab calc(144.000deg + 0.1deg), #7090ab 168.000deg, #6587a6 calc(168.000deg + 0.1deg), #6587a6 192.000deg, #5c7ea1 calc(192.000deg + 0.1deg), #5c7ea1 216.000deg, #55759b calc(216.000deg + 0.1deg), #55759b 240.000deg, #516c94 calc(240.000deg + 0.1deg), #516c94 264.000deg, #4f638d calc(264.000deg + 0.1deg), #4f638d 288.000deg, #505a85 calc(288.000deg + 0.1deg), #505a85 312.000deg, #54537d calc(312.000deg + 0.1deg), #54537d 336.000deg, #5b4b74 calc(336.000deg + 0.1deg) 360.000deg)",
    "linear-gradient(90deg, #000004 0.000%, #000c4f 16.667%, #5b8183 33.333%, #e8cd7e 50.000%, #ffb244 66.667%, #9e4700 83.333%, #000000 100.000%)",
    "linear-gradient(90deg, #dac574 0.000%, #dac574 7.692%, #d9b656 calc(7.692% + 1px), #d9b656 15.385%, #d5a337 calc(15.385% + 1px), #d5a337 23.077%, #d08f17 calc(23.077% + 1px), #d08f17 30.769%, #c87900 calc(30.769% + 1px), #c87900 38.462%, #be6100 calc(38.462% + 1px), #be6100 46.154%, #b24800 calc(46.154% + 1px), #b24800 53.846%, #a52f00 calc(53.846% + 1px), #a52f00 61.538%, #961600 calc(61.538% + 1px), #961600 69.231%, #860000 calc(69.231% + 1px), #860000 76.923%, #740000 calc(76.923% + 1px), #740000 84.615%, #620000 calc(84.615% + 1px), #620000 92.308%, #500000 calc(92.308% + 1px) 100.000%)",
    "conic-gradient(from 45deg, #0a4a59 0.000deg, #0a4a59 27.692deg, #0b527c calc(27.692deg + 0.1deg), #0b527c 55.385deg, #0d5c9f calc(55.385deg + 0.1deg), #0d5c9f 83.077deg, #1068c2 calc(83.077deg + 0.1deg), #1068c2 110.769deg, #1276e3 calc(110.769deg + 0.1deg), #1276e3 138.462deg, #1585ff calc(138.462deg + 0.1deg), #1585ff 166.154deg, #1896ff calc(166.154deg + 0.1deg), #1896ff 193.846deg, #1ca9ff calc(193.846deg + 0.1deg), #1ca9ff 221.538deg, #1fbcff calc(221.538deg + 0.1deg), #1fbcff 249.231deg, #23d1ff calc(249.231deg + 0.1deg), #23d1ff 276.923deg, #27e6ff calc(276.923deg + 0.1deg), #27e6ff 304.615deg, #2bfbff calc(304.615deg + 0.1deg), #2bfbff 332.308deg, #2fffff calc(332.308deg + 0.1deg) 360.000deg)",
    "linear-gradient(90deg, #df3000 0.000%, #ff9125 16.667%, #dad99a 33.333%, #72e0e8 50.000%, #14a3d6 66.667%, #004373 83.333%, #3a0005 100.000%)",
    "linear-gradient(135deg, #d0415e 0.000%, #d0415e 20.000%, #d65767 calc(20.000% + 1px), #d65767 40.000%, #db7971 calc(40.000% + 1px), #db7971 60.000%, #e0a57c calc(60.000% + 1px), #e0a57c 80.000%, #e6d886 calc(80.000% + 1px) 100.000%)",
    "linear-gradient(90deg, #d9b3e2 0.000%, #d2a4e3 8.333%, #ca94e2 16.667%, #c183e1 25.000%, #b673de 33.333%, #aa63da 41.667%, #9d54d5 50.000%, #9047ce 58.333%, #833cc7 66.667%, #7533bf 75.000%, #692eb7 83.333%, #5d2bae 91.667%, #522ca4 100.000%)"
]

names = [
    "Rustic Ocean",
    "Metallic Slate",
    "Solar Midnight",
    "Ember Gold",
    "Electric Tides",
    "Vivid Spectrum",
    "Rosy Gold",
    "Lavender Dream"
]

def extract_colors(css):
    # Match hex colors
    colors = re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}', css)
    # Return unique colors in order
    result = []
    seen = set()
    for c in colors:
        c = c.upper()
        if c not in seen:
            result.append(c)
            seen.add(c)
    return result

new_gradients = []
for i, css in enumerate(css_gradients):
    colors = extract_colors(css)
    grad = {
        "name": names[i],
        "colors": colors,
        "colorsname": ["color"] * len(colors),  # Placeholder
        "keywords": [["vibrant", "premium", "modern"]] * len(colors)  # Placeholder
    }
    new_gradients.append(grad)

print(json.dumps(new_gradients, indent=2))
