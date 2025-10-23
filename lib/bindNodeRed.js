const fs = require("fs");
const path = require("path");

function getNodeRedAuth() {
  return {
    tokens: function(token) {
      return new Promise(function(resolve, reject) {
        const validTokens = [];
  
        if(process.env.NODE_RED_TOKEN) {
           validTokens.push(process.env.NODE_RED_TOKEN) 
        }
  
        // ?access_token=<ACCESS_TOKEN>
        if(validTokens.includes(token)) {
          var user = { username: 'admin', permissions: '*' };
          resolve(user);
        } else {
          resolve(null);
        }
      });
    }
  }
}

// Функция для создания символических ссылок и удаления существующих
const createSymlinks = (sourceDir, targetDir) => {
    try {
        const files = fs.readdirSync(sourceDir);
        files.forEach(file => {
            const sourcePath = path.join(sourceDir, file);
            const targetPath = path.join(targetDir, file);
            try {
                fs.unlinkSync(targetPath);
                console.log(`Removed existing symlink or target: ${targetPath}`);
            } catch (err) {
                // Если символической ссылки или целевого объекта нет, продолжаем
            }
            fs.symlinkSync(sourcePath, targetPath, 'dir');
            console.log(`Created symlink: ${targetPath} -> ${sourcePath}`);
        });
    } catch (error) {
        console.error('Error while creating symlinks:', error);
    }
};

const sourceDir = path.join(process.cwd(), 'api', 'nodered');
const targetDir = path.join(process.cwd(), '.tmp', 'nodered', 'node_modules');

// Check if the target directory exists, and create it if it does not
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

createSymlinks(sourceDir, targetDir);
/**
 * Add nodes by dir
 *   
 * example: 
  if(typeof addREDNodesDir !== undefined) {
    addREDNodesDir(path.join(__dirname, 'nodered')
  } else {
    console.error(`addREDNodesDir not found`)
    setTimeout(()=> sails.log.error(`addREDNodesDir not found`),  10000)
  }
 */
global.addREDNodesDir = (sourceDir) => {
  if (fs.existsSync(sourceDir)) { 
    createSymlinks(sourceDir, targetDir);
  } else {
    console.error(`addREDNodesDir error: Dir \`${sourceDir}\` not exist`);
    console.trace()
  }
};

module.exports = {
  getNodeRedAuth
};