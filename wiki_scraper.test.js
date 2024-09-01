// wiki_scraper.test.js

const wikiScraper = require('./wiki_scraper'); // Adjust the path if necessary
const nock = require('nock'); // For mocking HTTP requests

describe('Wiki Scraper', () => {

  // This will mock Wikipedia's response
  beforeAll(() => {
    nock('https://en.wikipedia.org')
      .get('/wiki/Test_Page')
      .reply(200, `
        <div id="mw-content-text">
          <p>This is a test paragraph.</p>
          <p>Another paragraph for testing.</p>
        </div>
      `, {
        'Content-Type': 'text/html'
      });
  });

  afterAll(() => {
    nock.cleanAll();
  });

  test('fetchWikipediaContent should return content correctly', async () => {
    const content = await wikiScraper.fetchWikipediaContent('https://en.wikipedia.org/wiki/Test_Page');
    expect(content).toContain('This is a test paragraph');
    expect(content).toContain('Another paragraph for testing');
  });

  test('saveToFile should resolve without errors', async () => {
    // Here we're not actually writing to a file to keep our test environment clean
    // We'll mock fs.promises to ensure the method behaves as expected
    const fs = require('fs').promises;
    const mockWriteFile = jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);

    await wikiScraper.saveToFile('Test content', 'test.txt');
    expect(mockWriteFile).toHaveBeenCalledWith('test.txt', 'Test content', 'utf8');

    mockWriteFile.mockRestore();
  });

  test('fetchWikipediaContent should handle errors', async () => {
    nock('https://en.wikipedia.org')
      .get('/wiki/NonExistentPage')
      .reply(404);

    const content = await wikiScraper.fetchWikipediaContent('https://en.wikipedia.org/wiki/NonExistentPage');
    expect(content).toBeNull();
  });
});
