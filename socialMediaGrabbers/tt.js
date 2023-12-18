const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const destination = 'C:\\Users\\apvan\\OneDrive\\Desktop\\discordBot\\socialMediaGrabbers\\downloadedLinks';
/*
const getTokMedia = (link) => {
    (async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const client = await page.target().createCDPSession();
        
        try {
            await client.send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: destination,
            })
            await page.goto('https://snaptik.app/', { waitUntil: 'domcontentloaded' });
            await page.setViewport({ width: 1200, height: 800 });
            const button = '[class="button button-go is-link transition-all"]';
            const textbox = '[class="link-input"]';
            const downloadBtn = '[class="button button-go is-link transition-all"]';
            const downloadBtn2 = '[class="button download-file"]'
            await page.waitForSelector(textbox);
            await page.waitForSelector(button);
            await page.type(textbox, link);
            await new Promise(r => setTimeout(r, 1000));
            await page.waitForSelector(downloadBtn);
            await page.click(button);
            console.log('Video found');
            await new Promise(r => setTimeout(r, 2000));
            await page.waitForSelector(downloadBtn2);
            await page.click(downloadBtn2);
            console.log('Download link found');
            await new Promise(r => setTimeout(r, 500));
            await page.click(downloadBtn2);
            //const iframeSelector = 'your_iframe_selector_here';
            //await page.waitForSelector(iframeSelector, { visible: true, timeout: 4000});
            await page.waitForDownload();
            await page.waitForSelector();
            
        } catch (error) {
            console.error('An error occurred:', error);
        }
    })();
}*/

const getTokMedia = () => {

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