const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const url = require('url');

class WikipediaScraper {
    constructor() {
        this.defaultFilename = 'wikipedia_content.txt';
    }

    async fetchContent(url) {
        try {
            const response = await axios.get(url);
            return this.parseContent(response.data);
        } catch (error) {
            this.handleError('Failed to fetch page:', error);
            return null;
        }
    }

    parseContent(html) {
        const $ = cheerio.load(html);
        const paragraphs = $('#mw-content-text').find('p').map((i, el) => $(el).text()).get().join('\n\n');
        return paragraphs;
    }

    saveContent(content, filename) {
        filename = filename || this.defaultFilename;
        fs.writeFile(filename, content, { encoding: 'utf8' }, (err) => {
            if (err) {
                this.handleError(`Error writing to file ${filename}:`, err);
                return;
            }
            console.log(`Content saved to ${filename}`);
        });
    }

    handleError(message, error) {
        console.error(message, error.message);
    }

    run(args) {
        if (args.length < 1) {
            console.log('Usage: node script.js <wikipedia_url> [output_filename]');
            process.exit(1);
        }

        const parsedUrl = url.parse(args[0]);
        if (!parsedUrl.protocol || !parsedUrl.host) {
            this.handleError('Invalid URL provided:', args[0]);
            process.exit(1);
        }

        const filename = args[1] || this.defaultFilename;
        this.fetchContent(args[0]).then(content => {
            if (content) {
                this.saveContent(content, filename);
            }
        });
    }
}

const scraper = new WikipediaScraper();
scraper.run(process.argv.slice(2));
