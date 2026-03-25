import json
from collections import Counter
import os

def analyze_keywords():
    file_path = r'c:\Users\Baraa\Desktop\work\eng\openSource\gradlyAI\client\src\shared\lib\gradients.json'
    
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    keyword_counter = Counter()
    
    for gradient in data:
        if not isinstance(gradient, dict):
            continue
        keywords_list = gradient.get('keywords', [])
        if not isinstance(keywords_list, list):
            continue
        for sub_list in keywords_list:
            if not isinstance(sub_list, list):
                continue
            for keyword in sub_list:
                if isinstance(keyword, str) and keyword:
                    keyword_counter[keyword.lower().strip()] += 1

    # Get top 50 keywords
    top_keywords = keyword_counter.most_common(50)
    
    print("Top 50 Keywords:")
    for kw, count in top_keywords:
        print(f"{kw}: {count}")

if __name__ == "__main__":
    analyze_keywords()
