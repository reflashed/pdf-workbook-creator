module.exports = (config, images, data) => {

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

    let contentConcatinated = tableContents + contentPages.join('');

    return `
    <!DOCTYPE html>
    <html>
        <head>
            <mate charest="utf-8" />
            <link rel="stylesheet" type="text/css" href="/layout.css">

            <title>pdf-workbook-creator</title>
            <style>
                
            .page-dim {
                position: relative;
                width: ${config.width};
                height: ${config.height};
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