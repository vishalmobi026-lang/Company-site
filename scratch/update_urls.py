import os
import glob
import re

search_dir = r"c:\G-Tec-Azhagiyamandapam\Company-site\react\src"

pattern_localhost = re.compile(r"http://localhost:8000")
pattern_127 = re.compile(r"http://127\.0\.0\.1:8000")
new_url = "https://company-site-jrbr.onrender.com"

count = 0
for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = pattern_localhost.sub(new_url, content)
            new_content = pattern_127.sub(new_url, new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                print(f"Updated {filepath}")

print(f"Total files updated: {count}")
