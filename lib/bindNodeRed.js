const fs = require("fs");
const path = require("path");

/**
 * Single source of truth for Node-RED admin token strength.
 *
 * A weak token would expose the Admin API (and, through functionGlobalContext —
 * `sails`/`process`) to RCE. Both the bootstrap (whether to start Node-RED) and
 * the MCP tools (whether to register) gate on `NodeRedToken.gate()`, so the rule
 * lives in exactly one place.
 */
class NodeRedToken {
  /**
   * Shannon entropy of a string, scaled by length, in bits.
   * H = -Σ pᵢ·log₂(pᵢ) per char; total = H · length.
   *
   * @param {string} str
   * @returns {number} estimated bits of entropy
   */
  static entropyBits(str) {
    if (!str) return 0;
    const freq = new Map();
    for (const ch of str) freq.set(ch, (freq.get(ch) || 0) + 1);
    let perChar = 0;
    for (const count of freq.values()) {
      const p = count / str.length;
      perChar -= p * Math.log2(p);
    }
    return perChar * str.length;
  }

  /**
   * Validates an explicit token value by Shannon entropy.
   *
   * @param {string|undefined} token
   * @returns {{ ok: boolean, reason?: string, bits?: number }}
   */
  static validate(token) {
    if (token === undefined || token === null) {
      return { ok: false, reason: "NODE_RED_TOKEN is not set" };
    }
    if (typeof token !== "string" || token.trim() === "") {
      return { ok: false, reason: "NODE_RED_TOKEN is empty" };
    }
    const bits = NodeRedToken.entropyBits(token);
    if (bits < NodeRedToken.MIN_ENTROPY_BITS) {
      return {
        ok: false,
        bits,
        reason: `NODE_RED_TOKEN has low entropy (${bits.toFixed(1)} bits, min ${NodeRedToken.MIN_ENTROPY_BITS})`,
      };
    }
    return { ok: true, bits };
  }

  /** Boolean wrapper around {@link NodeRedToken.validate}. */
  static isValid(token) {
    return NodeRedToken.validate(token).ok;
  }

  /**
   * The gate both callers use: reads NODE_RED_TOKEN from the environment and
   * returns the validation decision. This is the single entry point — no caller
   * should read the env var or re-implement the rule itself.
   *
   * @returns {{ ok: boolean, reason?: string, bits?: number }}
   */
  static gate() {
    return NodeRedToken.validate(process.env.NODE_RED_TOKEN);
  }
}

// Minimum Shannon entropy (in bits) required of the admin token.
// ~64 bits is the practical floor for an admin secret.
NodeRedToken.MIN_ENTROPY_BITS = 64;

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
  getNodeRedAuth,
  NodeRedToken
};