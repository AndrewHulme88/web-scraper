import requests
from bs4 import BeautifulSoup
import sys

def fetch_wikipedia_content(url):
    try:
        # Send a GET request to the Wikipedia URL
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful

        # Parse the content of the request with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the main content div - this might change based on Wikipedia's structure
        content_div = soup.find('div', {'id': 'mw-content-text'})

        # Extract paragraphs from the content
        paragraphs = content_div.find_all('p')
        return '\n'.join(para.get_text() for para in paragraphs)

    except requests.RequestException as e:
        print(f"Failed to fetch the page: {e}")
        return None

def save_to_file(content, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f"Content saved to {filename}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide a Wikipedia URL as an argument.")
        sys.exit(1)

    url = sys.argv[1]
    filename = 'wikipedia_content.txt'  # Default filename

    if len(sys.argv) >= 3:
        filename = sys.argv[2]

    content = fetch_wikipedia_content(url)
    if content:
        save_to_file(content, filename)
    else:
        print("No content to save.")
