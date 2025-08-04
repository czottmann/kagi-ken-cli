/**
 * @fileoverview Shared help text constants for CLI commands
 */

/**
 * Standard authentication help text for commands
 */
const AUTHENTICATION_HELP = `Authentication:
  Provide session token via --token flag or create ~/.kagi_session_token file.

  Get your session token from https://kagi.com/settings/user_details
  → Session Link → copy to clipboard → extract "token" parameter.`;

module.exports = {
  AUTHENTICATION_HELP,
};