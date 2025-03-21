const path = require('path');
const fs = require('fs');

exports.handler = async (event, context) => {
  const { path: requestPath } = event;
  
  // Déterminer le chemin du fichier
  let filePath = requestPath === '/' 
    ? 'index.html'
    : requestPath.substring(1);
  
  // Obtenir l'extension du fichier
  const extname = path.extname(filePath).toLowerCase();
  
  // Types MIME
  const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };
  
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  try {
    // Lire le fichier
    const content = fs.readFileSync(path.join(__dirname, '../../', filePath));
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType
      },
      body: content.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    // Gérer les erreurs
    if (error.code === 'ENOENT') {
      try {
        // Page non trouvée
        const notFoundContent = fs.readFileSync(path.join(__dirname, '../../404.html'));
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'text/html'
          },
          body: notFoundContent.toString()
        };
      } catch (e) {
        return {
          statusCode: 404,
          body: 'Page not found'
        };
      }
    } else {
      return {
        statusCode: 500,
        body: `Server Error: ${error.code}`
      };
    }
  }
};
