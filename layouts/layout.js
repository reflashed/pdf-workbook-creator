module.exports = (config, images, data) => {

    let pageCountTC = -1;
    let pageCount = -1;


    let playlistList = data.playlists.map(playlists => {
        let itemList = playlists.images.map(item => {

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
        <div class="playlist-container">
            <h1>Table of Contents</h1>
            ${playlistList.join('')}
        </div>  
    `

    let contentPages = images.map(image => {
        pageCount += 2;
        return `
        <div class="page-dim">
            <div class="image">
                <img src="http://localhost:3000/${image}" alt="Image not loading. Idk go ask Ryan wuts wrong"/>
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

    let contentConcatinated = tableContents + `<div style="page-break-after: always;"></div>` + contentPages.join('');

    return `
    <!DOCTYPE html>
    <html>
        <head>
            <mate charest="utf-8" />
            <title>Hello world!</title>
            <style>
                body {
                    font-size:14px;
                    margin:0;
                }

                .page-dim {
                position: relative;
                width: ${config.width};
                height: ${config.height};
                }

                .footer {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 50px;
                    border-top: solid black 1px;
                }

                .playlist-container {
                    padding: 0px 30px 15px 30px;
                }
       

                .playlist {
                    display: grid;
                    grid-column-gap: 30px;
                    grid-template-columns:  33.3% auto 33.3%;
                    padding-bottom: 15px;

                  }
                  
                .playlist > div {
                background-color: rgba(255, 255, 255, 0.8);
                text-align: center;
                }

                .playlist-title {
                    font-weight: bold;
                    font-size: 16px;
                }

                .item {
                    display: flex;
                    justify-content: space-between;
                }

                img {
                    width:80%;
                    height:auto;
                }

                .grid {
                    display:grid;
                }

                .image {
                    text-align:center;
                    padding: 15% 0;
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