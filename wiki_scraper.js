const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises; // Using promises for async file operations

/**
 * Fetches and extracts content from Wikipedia
 * @param {string} url - The Wikipedia URL to scrape
 * @returns {Promise<string>} - Promise resolving to the scraped content
 */
async function fetchWikipediaContent(url) {
    try {
        // Use a custom user agent to mimic a real browser request
        const response = await axios.get(url, {
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'}
        });
        const $ = cheerio.load(response.data);

        // Extract content from paragraphs within the main content area
        return $('#mw-content-text').find('p').map((_, element) =>
            $(element).text().trim()
        ).get().join('\n\n');
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Server responded with status code:', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from the server');
        } else {
            // Something happened in setting up the request
            console.error('Error setting up the request:', error.message);
        }
        return null;
    }
}

/**
 * Saves content to a file using async/await for better error handling
 * @param {string} content - Content to save
 * @param {string} filename - Filename for saving the content
 * @returns {Promise<void>}
 */
async function saveToFile(content, filename) {
    try {
        await fs.writeFile(filename, content, 'utf8');
        console.log(`Content successfully saved to ${filename}`);
    } catch (err) {
        console.error('Failed to save the file:', err);
    }
}

// Main execution block, only runs if the script is run directly
if (require.main === module) {
    (async () => {
        const args = process.argv.slice(2);

        if (args.length === 0) {
            console.log('Usage: node script.js <Wikipedia URL> [output filename]');
            return process.exit(1);
        }

        const url = args[0];
        const filename = args[1] || 'wikipedia_content.txt';

        const content = await fetchWikipediaContent(url);
        if (content) {
            await saveToFile(content, filename);
        } else {
            console.log('Failed to fetch or extract content.');
        }
    })();
}

module.exports = {
    fetchWikipediaContent,
    saveToFile
};
