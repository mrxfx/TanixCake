import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'bakery-api-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // Secure API Route: Upload Image
            if (req.url?.startsWith('/api/upload') && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => { body += chunk; });
              req.on('end', async () => {
                try {
                  const { file, fileName, provider } = JSON.parse(body);

                  if (!file) {
                    res.statusCode = 400;
                    res.end('Missing file payload');
                    return;
                  }

                  if (provider === 'imagekit') {
                    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
                    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || 'https://upload.imagekit.io/api/v1/files/upload';

                    if (!privateKey) {
                      res.statusCode = 500;
                      res.end('ImageKit private key not configured on server');
                      return;
                    }

                    // Prepare ImageKit upload
                    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
                    
                    const ikFormData = new FormData();
                    ikFormData.append('file', file); // can be base64 URL directly
                    ikFormData.append('fileName', fileName || 'cake_upload.png');

                    const ikResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                      method: 'POST',
                      headers: {
                        'Authorization': authHeader,
                      },
                      body: ikFormData
                    });

                    if (!ikResponse.ok) {
                      const errText = await ikResponse.text();
                      res.statusCode = ikResponse.status;
                      res.end(`ImageKit upload failed: ${errText}`);
                      return;
                    }

                    const ikData = await ikResponse.json();
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                      url: ikData.url,
                      provider: 'imagekit',
                      fileId: ikData.fileId,
                      fileName: ikData.name
                    }));
                    return;

                  } else {
                    // Fall back or default to ImgBB
                    const imgbbKey = process.env.IMGBB_API_KEY;
                    if (!imgbbKey) {
                      res.statusCode = 500;
                      res.end('ImgBB API key not configured on server');
                      return;
                    }

                    // Strip base64 prefix if exists (ImgBB needs the pure base64 string or binary)
                    const base64Content = file.split(',')[1] || file;

                    const imgbbFormData = new FormData();
                    imgbbFormData.append('image', base64Content);

                    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
                      method: 'POST',
                      body: imgbbFormData
                    });

                    if (!imgbbResponse.ok) {
                      const errText = await imgbbResponse.text();
                      res.statusCode = imgbbResponse.status;
                      res.end(`ImgBB upload failed: ${errText}`);
                      return;
                    }

                    const imgbbData = await imgbbResponse.json();

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                      url: imgbbData.data.url,
                      provider: 'imgbb',
                      fileId: imgbbData.data.delete_url, // Use the delete URL since free ImgBB doesn't have an API deletion id
                      fileName: fileName || 'cake_upload.png'
                    }));
                    return;
                  }

                } catch (e: any) {
                  res.statusCode = 500;
                  res.end(`Server Error: ${e.message}`);
                }
              });
              return;
            }

            // Secure API Route: Delete Image
            if (req.url?.startsWith('/api/delete') && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => { body += chunk; });
              req.on('end', async () => {
                try {
                  const { fileId, provider } = JSON.parse(body);

                  if (!fileId) {
                    res.statusCode = 400;
                    res.end('Missing fileId payload');
                    return;
                  }

                  if (provider === 'imagekit') {
                    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
                    if (!privateKey) {
                      res.statusCode = 500;
                      res.end('ImageKit private key not configured on server');
                      return;
                    }

                    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
                    
                    const deleteResponse = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': authHeader
                      }
                    });

                    if (deleteResponse.status === 204 || deleteResponse.status === 200) {
                      res.writeHead(200, { 'Content-Type': 'application/json' });
                      res.end(JSON.stringify({ success: true }));
                    } else {
                      const errText = await deleteResponse.text();
                      res.statusCode = deleteResponse.status;
                      res.end(`ImageKit deletion failed: ${errText}`);
                    }
                    return;
                  } else {
                    // For ImgBB we do not have programmatic API deletion, so return success
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'ImgBB deletion is manual via delete_url' }));
                    return;
                  }

                } catch (e: any) {
                  res.statusCode = 500;
                  res.end(`Server Error: ${e.message}`);
                }
              });
              return;
            }

            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
