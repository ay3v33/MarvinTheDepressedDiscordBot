const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const destination = __dirname+'\\downloadedLinks';

const getTokMedia = (link) => {
    (async () => {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        const client = await page.target().createCDPSession();
        await page.setRequestInterception(true);

        const rejectRequestPattern = [
            "googlesyndication.com",
            "/*.doubleclick.net",
            "/*.amazon-adsystem.com",
            "/*.adnxs.com",
            "googleadservices.com",
        ]
        const blockList = [];

        page.on("request", (request) => {
            if (rejectRequestPattern.find((pattern) => request.url().match(pattern))) {
              blockList.push(request.url());
              request.abort();
            } else request.continue();
        });
        
        async function waitUntilDownload(page, fileName = '') {
            return new Promise((resolve, reject) => {
                page._client().on('Page.downloadProgress', e => {
                    if (e.state === 'completed') {
                        resolve(fileName);
                    } else if (e.state === 'canceled') {
                        reject();
                    }
                });
            });
        }

        try {
            await client.send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: destination,
            })
            await page.goto('https://snaptik.app/', { waitUntil: 'domcontentloaded' });
            await page.setViewport({ width: 1200, height: 800 });
            const button = '[class="button button-go is-link transition-all"]';
            const textbox = '[class="link-input"]';
            const downloadBtn = '[class="button download-file"]'
            await page.waitForSelector(textbox);
            await page.waitForSelector(button);
            await page.type(textbox, link);
            await new Promise(r => setTimeout(r, 1000));
            await page.click(button);
            console.log('Video found');
            await page.waitForSelector(downloadBtn);
            await page.click(downloadBtn);
            console.log('Download link found');
            await waitUntilDownload(page, 'temp');
            
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            await browser.close();
        }
    })();
}

const sendTokMedia = async () => {
    try {
        const directoryPath = __dirname+'\\downloadedLinks'; // Gets the current directory of the script
        const files = fs.readdirSync(directoryPath);

        // Filter for .mp4 files
        const mp4Files = files.filter(file => path.extname(file).toLowerCase() === '.mp4');

        if (mp4Files.length !== 1) {
            return console.error('There is not exactly one MP4 file in the directory');
        }

        const filePath = path.join(directoryPath, mp4Files[0]);
        return filePath;

    } catch (err) {
        console.error('Error sending the video:', err);
    }
}




module.exports = {
    getTokMedia,
    sendTokMedia
}