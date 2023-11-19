const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { MessageAttachment, EmbedBuilder } = require('discord.js');


const getXMedia = (link) => {
    (async () => {
        
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const client = await page.target().createCDPSession();
        

        async function waitUntilDownload(page, fileName = '') {
            return new Promise((resolve, reject) => {
                page._client().on('Page.downloadProgress', e => { // or 'Browser.downloadProgress'
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
                downloadPath: 'C:\\Users\\apvan\\OneDrive\\Desktop\\discordBot\\socialMediaGrabbers',
            })
            await page.goto('https://ssstwitter.com/', { waitUntil: 'domcontentloaded' });
            await page.setViewport({ width: 1200, height: 800 });
            const button = '#submit'
            const textbox = '#main_page_text';
            const downloadBtn = '[class="pure-button pure-button-primary is-center u-bl dl-button download_link without_watermark vignette_active"]'
            await page.waitForSelector(textbox);
            await page.waitForSelector(button);
            await page.type(textbox, link);
            await page.click(button);
            
            await page.waitForSelector(downloadBtn);
            console.log('download link found');
            page.click(downloadBtn);
            await waitUntilDownload(page,'temp');
            
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            await browser.close();
        }
    })();
}

const sendXMedia = async () => {
    try {
        const directoryPath = __dirname; // Gets the current directory of the script
        const files = fs.readdirSync(directoryPath);

        // Filter for .mp4 files
        const mp4Files = files.filter(file => path.extname(file).toLowerCase() === '.mp4');

        if (mp4Files.length !== 1) {
            return console.error('There is not exactly one MP4 file in the directory');
        }

        const filePath = path.join(directoryPath, mp4Files[0]);
        console.log('got here');
        return filePath;

    } catch (err) {
        console.error('Error sending the video:', err);
    }
}


const deleteMedia = () => {

    const directoryPath = __dirname; // Gets the current directory of the script
    const files = fs.readdirSync(directoryPath);

    // Filter for .mp4 files
    const mp4Files = files.filter(file => path.extname(file).toLowerCase() === '.mp4');

    if (mp4Files.length !== 1) {
        return console.error('There is not exactly one MP4 file in the directory');
    }

    const filePath = path.join(directoryPath, mp4Files[0]);

    fs.unlink(filePath, err => {
        if (err) {
            console.error('Error deleting the file:', err);
        } else {
            console.log('File deleted successfully');
        }
    });
}

module.exports = {
    getXMedia,
    sendXMedia,
    deleteMedia
}