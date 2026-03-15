'use strict';

const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

/**
 * Protected tool — image upload.
 * Accepts multipart/form-data with a single `image` field.
 * Saves the file to assets/uploads/ and returns the public URL and slug+hash filename.
 *
 * Request (multipart/form-data):
 *   POST /mcp/call/upload-image
 *   X-Mcp-Key: <admin-key>
 *   Content-Type: multipart/form-data
 *   Body: image=<file>
 *
 * Response:
 *   { filename, slug, url }
 */
module.exports = function register(mcp) {
  mcp.registerTool({
    name: 'upload-image',
    description: 'Upload an image file. Saves to assets/uploads/ and returns the public URL. Filename is <slug>-<hash>.<ext>. Send as multipart/form-data with field name "image".',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file (multipart/form-data field name: "image"). Allowed: jpg, jpeg, png, gif, webp, svg.',
        },
      },
      required: ['image'],
    },
    handler: async (_params, { req, res }) => {
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      const ALLOWED_EXT  = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const MAX_SIZE     = 10 * 1024 * 1024; // 10 MB

      const uploadDir = path.join(process.cwd(), 'assets', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      return new Promise((resolve, reject) => {
        req.file('image').upload(
          {
            dirname: uploadDir,
            maxBytes: MAX_SIZE,
          },
          (err, uploadedFiles) => {
            if (err) return reject(new Error(`Upload failed: ${err.message}`));
            if (!uploadedFiles || uploadedFiles.length === 0) {
              return reject(new Error('No file received. Send multipart/form-data with field "image".'));
            }

            const file = uploadedFiles[0];
            const ext  = path.extname(file.filename || '').toLowerCase();

            // Validate extension
            if (!ALLOWED_EXT.includes(ext)) {
              fs.unlink(file.fd, () => {});
              return reject(new Error(`File type not allowed. Allowed: ${ALLOWED_EXT.join(', ')}`));
            }

            // Validate MIME type
            if (file.type && !ALLOWED_TYPES.includes(file.type)) {
              fs.unlink(file.fd, () => {});
              return reject(new Error(`MIME type not allowed: ${file.type}`));
            }

            // Build slug from original filename (strip ext, slugify)
            const baseName   = path.basename(file.filename || 'image', ext);
            const slug       = slugify(baseName);
            const hash       = uuid().replace(/-/g, '').slice(0, 12);
            const newFilename = `${slug}-${hash}${ext}`;
            const newPath     = path.join(uploadDir, newFilename);

            fs.rename(file.fd, newPath, (renameErr) => {
              if (renameErr) return reject(new Error(`Failed to save file: ${renameErr.message}`));

              const url = `/uploads/${newFilename}`;
              resolve({ filename: newFilename, slug, hash, url });
            });
          }
        );
      });
    },
  });
};

/**
 * Simple slugify: lowercase, replace non-alphanumeric with dash, trim dashes.
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'image';
}
