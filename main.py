import requests
from bs4 import BeautifulSoup

def get_wiki_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Wikipedia content is usually within the div with id 'bodyContent'
    content_div = soup.find('div', {'id': 'bodyContent'})

    if not content_div:
        return "No content found."

    # Remove unnecessary parts like edit links
    for edit_link in content_div.find_all('span', {'class': 'mw-editsection'}):
        edit_link.decompose()

    return content_div.get_text()

def save_to_file(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(data)

if __name__ == "__main__":
    url = input("Enter the URL of the Wikipedia page: ")
    content = get_wiki_content(url)
    filename = input("Enter the filename to save the content: ")

    save_to_file(content, filename + ".txt")
    print(f"Content saved to {filename}.txt")
