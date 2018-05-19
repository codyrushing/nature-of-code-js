const budo = require('budo')
const babelify = require('babelify')

const { path, live, port, css } = require('yargs').argv

if(!path){
  console.error('Path must be provided');
  process.exit(1);
}

budo(
  path,
  {
    live: typeof live === 'undefined'
      ? true
      : live,
    open: typeof open === 'undefined'
      ? true
      : open,
    css: typeof css === 'undefined'
      ? 'public/main.css'
      : css,
    port: port || 8000,
    browserify: {
      transform: [babelify],
      debug: true
    }
  }
)
.on(
  'connect',
  ev => console.log(`Server running on ${ev.uri}`)
)
.on(
  'update',
  buffer => console.log(`bundle - ${buffer.length} bytes`)
)
