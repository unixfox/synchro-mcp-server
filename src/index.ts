#!/usr/bin/env node
/**
 * Synchro Bus MCP Server
 *
 * A Model Context Protocol server for accessing Synchro Bus (Instant-System) API with TypeScript.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import config from './config.js';
import * as tools from './tools.js';
import {
  networkGetSchema,
  linesGetSchema,
  lineGetSchema,
  lineStopAreasGetSchema,
  lineStopAreaSchedulesGetSchema,
  disruptionsGetSchema,
  vehicleJourneysDirectionsGetSchema,
  proximityGetSchema
} from './types.js';

// Create MCP server instance
const server = new McpServer({
  name: config.server.name,
  version: config.server.version,
});

// Tool: networkGet - get network information
server.tool(
  'networkGet',
  networkGetSchema.shape,
  async ({}, extra) => {
    try {
      const response = await tools.networkGet();
      if (!response) {
        return {
          content: [{
            type: "text",
            text: "Failed to get network information"
          }],
          isError: true
        };
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error(`[ERROR] networkGet failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        content: [{
          type: "text",
          text: `Error getting network: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Tool: linesGet - get all lines for a network
server.tool(
  'linesGet',
  linesGetSchema.shape,
  async ({}, extra) => {
    try {
      const response = await tools.linesGet();
      if (!response) {
        return {
          content: [{
            type: "text",
            text: "Failed to get lines information"
          }],
          isError: true
        };
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error(`[ERROR] linesGet failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        content: [{
          type: "text",
          text: `Error getting lines: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Tool: lineGet - get information about a specific line
server.tool(
  'lineGet',
  lineGetSchema.shape,
  async ({ lineId }, extra) => {
    try {
      const response = await tools.lineGet(lineId);
      if (!response) {
        return {
          content: [{
            type: "text",
            text: "Failed to get line information"
          }],
          isError: true
        };
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error(`[ERROR] lineGet failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        content: [{
          type: "text",
          text: `Error getting line: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Tool: lineStopAreasGet - get stop areas for a line
server.tool(
  'lineStopAreasGet',
  lineStopAreasGetSchema.shape,
  async ({ lineId }, extra) => {
    try {
      const response = await tools.lineStopAreasGet(lineId);
      if (!response) {
        return {
          content: [{
            type: "text",
            text: "Failed to get line stop areas information"
          }],
          isError: true
        };
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error(`[ERROR] lineStopAreasGet failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        content: [{
          type: "text",
          text: `Error getting stop areas: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Tool: lineStopAreaSchedulesGet - get schedules for a stop area on a line
server.tool(
  'lineStopAreaSchedulesGet',
  lineStopAreaSchedulesGetSchema.shape,
  async ({ lineId, stopAreaId, displayName, key, userlatlon }, extra) => {
    try {
      const response = await tools.lineStopAreaSchedulesGet(
        lineId,
        stopAreaId,
        displayName || '',
        key?.toString() || '0',
        userlatlon || ''
      );
      if (!response) {
        return {
          content: [{
            type: "text",
            text: "Failed to get line stop area schedules information"
          }],
          isError: true
        };
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error(`[ERROR] lineStopAreaSchedulesGet failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        content: [{
          type: "text",
          text: `Error getting schedules: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Tool: disruptionsGet - get disruptions for a network
server.tool(
  'disruptionsGet',
  disruptionsGetSchema.shape,
  async ({ subNetworks, key, userlatlon }, extra) => {
    try {
      const response = await tools.disruptionsGet(
        subNetworks ? [subNetworks] : [],
        key?.toString() || '0',
        userlatlon || ''
      );
      if (!response) {
        return {
          content: [{
            type: "text",
            text: "Failed to get disruptions information"
          }],
          isError: true
        };
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error(`[ERROR] disruptionsGet failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        content: [{
          type: "text",
          text: `Error getting disruptions: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Tool: vehicleJourneysDirectionsGet - get vehicle journey directions for a line
server.tool(
  'vehicleJourneysDirectionsGet',
  vehicleJourneysDirectionsGetSchema.shape,
  async ({ lineId }, extra) => {
    try {
      const response = await tools.vehicleJourneysDirectionsGet(lineId);
      if (!response) {
        return {
          content: [{
            type: "text",
            text: "Failed to get vehicle journeys directions information"
          }],
          isError: true
        };
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error(`[ERROR] vehicleJourneysDirectionsGet failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        content: [{
          type: "text",
          text: `Error getting directions: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Tool: proximityGet - get nearby stop areas based on coordinates
server.tool(
  'proximityGet',
  proximityGetSchema.shape,
  async ({ lat, lon, precision, accessibility, scholar, context, key }, extra) => {
    try {
      const response = await tools.proximityGet(
        lat,
        lon,
        precision,
        accessibility,
        scholar,
        context,
        key?.toString()
      );
      if (!response) {
        return {
          content: [{
            type: "text",
            text: "Failed to get proximity information"
          }],
          isError: true
        };
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error(`[ERROR] proximityGet failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        content: [{
          type: "text",
          text: `Error getting proximity: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

async function startServer(): Promise<void> {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('[INFO] MCP Server started successfully');
  } catch (error) {
    console.error(`[ERROR] Failed to start MCP Server: ${error instanceof Error ? error.message : String(error)}`);
    
    if (error instanceof Error && error.stack) {
      console.error(`[ERROR] Stack trace: ${error.stack}`);
    }
    
    process.exit(1);
  }
}

startServer().catch(error => {
  console.error(`[ERROR] Unhandled exception: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}); 