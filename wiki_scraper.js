const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Fetches content from a Wikipedia URL
 * @param {string} url - The URL to fetch content from
 * @return {Promise<string>} The extracted text content
 */
async function fetchWikipediaContent(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Assuming Wikipedia's content structure for the main text
        let content = '';
        $('#mw-content-text p').each((i, element) => {
            content += $(element).text() + '\n';
        });

        return content.trim();
    } catch (error) {
        console.error('Failed to fetch the page:', error);
        return null;
    }
}

/**
 * Saves the provided content to a file
 * @param {string} content - Content to save
 * @param {string} filename - Name of the file to save to
 */
function saveToFile(content, filename) {
    fs.writeFile(filename, content, 'utf8', (err) => {
        if (err) {
            console.error('An error occurred while writing to the file:', err);
            return;
        }
        console.log(`Content saved to ${filename}`);
    });
}

// Command line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
    console.log('Please provide a Wikipedia URL as an argument.');
    process.exit(1);
}

const url = args[0];
let filename = 'wikipedia_content.txt';

if (args[1]) {
    filename = args[1];
}

fetchWikipediaContent(url).then(content => {
    if (content) {
        saveToFile(content, filename);
    } else {
        console.log('No content to save.');
    }
});
