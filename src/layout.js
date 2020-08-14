const yaml = require('js-yaml');
const fs = require('fs-extra');
const { parse } =  require('node-html-parser');

module.exports = (config) => {
  const data = require('/mounted-volume/' + config.data);

  let pageCountTC = -1;
  let pageCount = -1;
  let image_data = [];

  let playlistList = data.playlists.map(playlists => {
    let itemList = playlists.images.map(item => {
      image_data.push(item.image_id);
      pageCountTC += 2;

      return `
        <div class='item'>
          <span class='item-left'>${item.image_name}</span>
          <span class='item-right'>${pageCountTC}</span>
        </div>
      `;
    })

    return `
      <span class='playlist-title'>${playlists.playlist_name}</span>
      <div class='playlist'>${itemList.join('')}</div>
    `;
  })

  const tc_body = parse(fs.readFileSync('/mounted-volume/' + config.pages.page.layout_table.html, 'utf-8')).querySelector('#root');
  tc_body.querySelector('#playlist').set_content(`${playlistList.join('')}`)

  const image_body = parse(fs.readFileSync('/mounted-volume/' + config.pages.page_sequence.layout_image.html, 'utf-8')).querySelector('#root')
  const notes_body = parse(fs.readFileSync('/mounted-volume/' + config.pages.page_sequence.layout_notes.html, 'utf-8')).querySelector('#root');

  let contentPages = image_data.map(image => {
    pageCount += 2;

    if(image_body.querySelector('#image') != null) {
      image_body.querySelectorAll('#image').forEach((element) => {
        element.set_content(`<img src='http://localhost:3000/${image}.jpg' alt='Image not loading.'/> `)
      })
    }

    if(image_body.querySelector('#page-count') != null) {
      image_body.querySelectorAll('#page-count').forEach((element) => {
        element.set_content(`${pageCount}`)
      })
    }

    if( notes_body.querySelector('#page-count') != null) {
      notes_body.querySelectorAll('#page-count').forEach((element) => {
        element.set_content(`${pageCount + 1}`);
      })
    }
    return image_body.innerHTML + notes_body.innerHTML
  })

  const contentConcatinated = tc_body.innerHTML + contentPages.join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <mate charest='utf-8' />
        <link rel='stylesheet' type='text/css' href='${config.pages.page.layout_table.css}'>
        <link rel='stylesheet' type='text/css' href='${config.pages.page_sequence.layout_image.css}'>
        <link rel='stylesheet' type='text/css' href='${config.pages.page_sequence.layout_notes.css}'>
        <title>${config.name}</title>
        <style>

        .page-dim {
          position: relative;
          width: ${config.size.width};
          height: ${config.size.height};
          border:solid black 1px
        }

        </style>
      </head>

      <body>${contentConcatinated}</body>

      <script src='/reload/reload.js'></script>
    </html>
  `;
};
