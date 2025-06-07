/**
 * Configuration manager for the MCP server
 * Validates required environment variables and exports config settings
 */
import { Config } from './types.js';

const config: Config = {
  instantSystem: {
    baseUrl: 'https://prod.instant-system.com/InstantCore',
    networkId: 3 // Synchro Bus Chambéry
  },
  server: {
    name: 'synchro-bus-mcp-server',
    version: '1.0.0'
  }
};

export default config; 