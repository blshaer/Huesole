import json

file_path = r'c:\Users\Baraa\Desktop\work\eng\openSource\gradlyAI\client\src\shared\lib\gradients.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for i in [0, 50, 100, 200, 500, 800, 1000, 1300]:
    if i < len(data):
        g = data[i]
        print(f"[{i}]")
        print(f"  name: {g.get('name')}")
        print(f"  colors: {g.get('colors')}")
        print(f"  colorsname: {g.get('colorsname')}")
        print(f"  keywords: {g.get('keywords')}")
        print()
