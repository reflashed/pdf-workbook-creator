const yaml = require("js-yaml");
const fs = require('fs-extra');
const { parse } =  require('node-html-parser');
const data = require('../mount/input/data.json');






module.exports = (config) => {

    let pageCountTC = -1;
    let pageCount = -1;
    let image_data = [];

    let playlistList = data.playlists.map(playlists => {
        let itemList = playlists.images.map(item => {
            image_data.push(item.image_id);
            pageCountTC += 2;

            return `
            <div class="item">
            <span class="item-left">${item.image_name}</span><span class="item-right">${pageCountTC}</span>
            </div>
            `
        })

        return `

        <span class="playlist-title">${playlists.playlist_name}</span>
        <div class="playlist">
        ${itemList.join('')}
        </div>
        `
    })

    let tableContents =
        `
        <div class="page-dim">
            <div class="playlist-container">
                <h1>Table of Contents</h1>
                ${playlistList.join('')}
            </div>  
        </div>
    `

    let contentPages = image_data.map(image => {
        pageCount += 2;
        return `
        <div class="page-dim">
            <div class="image">
                <img src="http://localhost:3000/${image}.jpg" alt="Image not loading."/>
            </div>
            <div class="footer">
                ${pageCount}
            </div>
        </div>
        <div class="page-dim">
            <div class="notes">
            
            </div>
        <div class="footer">
        ${pageCount + 1}
        </div>
        </div>

        
        `
    })

    const tc_inject = parse(fs.readFileSync("./mount/" + config.pages.page.layout_table.html, "utf-8")).querySelector('#table-of-contents').appendChild(parse(playlistList.join('')));
    const tc_body = parse(fs.readFileSync("./mount/" + config.pages.page.layout_table.html, "utf-8")).querySelector('#root').appendChild(tc_inject);
    // const image_body = parse(fs.readFileSync("./mount/" + config.pages[1].page_sequence.layout_image.html, "utf-8")).querySelector('#root');
    // const notes_body = parse(fs.readFileSync("./mount/" + config.pages[1].page_sequence.layout_notes.html, "utf-8")).querySelector('#root');
    let contentConcatinated = tc_body.parentNode + contentPages.join('');


    return `
    <!DOCTYPE html>
    <html>
        <head>
            <mate charest="utf-8" />
            <link rel="stylesheet" type="text/css" href="${config.pages.page.layout_table.css}">
            <link rel="stylesheet" type="text/css" href="${config.pages.page_sequence.layout_image.css}">
            <link rel="stylesheet" type="text/css" href="${config.pages.page_sequence.layout_notes.css}">


            <title>pdf-workbook-creator</title>
            <style>
                
            .page-dim {
                position: relative;
                width: ${config.size.width};
                height: ${config.size.height};
                border:solid black 1px
                }

                
            </style>
        </head>
        <body>
        ${contentConcatinated}
            
        </body>
        <script src="/reload/reload.js"></script>
    </html>
    `;
};