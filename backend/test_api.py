import requests

def test_category_fetch(category_name):
    print(f"Testing fetch for category: '{category_name}'")
    url = f"http://localhost:8000/courses?category={category_name}"
    try:
        res = requests.get(url)
        print(f"Status: {res.status_code}")
        data = res.json()
        print(f"Courses found: {len(data)}")
        for c in data:
            print(f"- {c['title']}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_category_fetch("IT / Technical")
    print("-" * 30)
    test_category_fetch("Non Technical")
