/**
 * @fileoverview Authentication utilities for Kagi session token handling
 */

const os = require("os");
const fs = require("fs");
const path = require("path");

/**
 * Reads Kagi session token from ~/.kagi_session_token file
 * @returns {string|null} Token content (trimmed) or null if file doesn't exist/is empty
 */
function readTokenFromFile() {
  try {
    const tokenPath = path.join(os.homedir(), ".kagi_session_token");
    const content = fs.readFileSync(tokenPath, "utf8").trim();
    return content || null;
  } catch (error) {
    if (error.code === "ENOENT") {
      return null; // File doesn't exist
    }
    throw new Error(`Unable to read token file: ${error.message}`);
  }
}

/**
 * Resolves session token from flag or file
 * @param {string|undefined} tokenFlag - Token from --token flag
 * @returns {string} Resolved token
 * @throws {Error} If no token is available
 */
function resolveToken(tokenFlag) {
  const token = tokenFlag || readTokenFromFile();
  
  if (!token) {
    throw new Error(
      "Authentication required: provide --token flag or create ~/.kagi_session_token file"
    );
  }
  
  return token;
}

/**
 * Validates token format (basic validation)
 * @param {string} token - Token to validate
 * @returns {boolean} True if token appears valid
 */
function isValidTokenFormat(token) {
  return typeof token === 'string' && token.trim().length > 0;
}

module.exports = {
  readTokenFromFile,
  resolveToken,
  isValidTokenFormat,
};