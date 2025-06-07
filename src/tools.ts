import axios from 'axios';
import {
  ToolResponse,
  Network,
  Line,
  StopArea,
  Schedule,
  Disruption,
  VehicleJourneyDirection,
  Proximity
} from './types.js';
import config from './config.js';

// API client for Instant-System
const instantSystemApi = axios.create({
  baseURL: config.instantSystem.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get network information
 */
export async function networkGet(): Promise<ToolResponse> {
  try {
    const response = await instantSystemApi.get(`/v3/networks/${config.instantSystem.networkId}`);
    const network: Network = response.data;
    
    return {
      content: [{
        type: "text",
        text: `Network: ${network.name} (ID: ${network.id})`
      }],
      metadata: network
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error getting network: ${error instanceof Error ? error.message : String(error)}` }]
    };
  }
}

/**
 * Get all lines for a network
 */
export async function linesGet(): Promise<ToolResponse> {
  try {
    const response = await instantSystemApi.get(`/v3/networks/${config.instantSystem.networkId}/lines`);
    const lines: Line[] = response.data;
    
    return {
      content: [{
        type: "text",
        text: `Found ${lines.length} lines for network ${config.instantSystem.networkId}`
      }],
      metadata: { lines }
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error getting lines: ${error instanceof Error ? error.message : String(error)}` }]
    };
  }
}

/**
 * Get information about a specific line
 */
export async function lineGet(lineId: string): Promise<ToolResponse> {
  try {
    const response = await instantSystemApi.get(`/v3/networks/${config.instantSystem.networkId}/lines/${lineId}`);
    const line: Line = response.data;
    
    return {
      content: [{
        type: "text",
        text: `Line ${line.sName}: ${line.lName} (ID: ${line.id})`
      }],
      metadata: line
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error getting line: ${error instanceof Error ? error.message : String(error)}` }]
    };
  }
}

/**
 * Get stop areas for a line
 * 
 * This function is essential for finding stop area IDs that are required for other operations.
 * The stop area IDs returned by this function should be used as the stopAreaId parameter
 * in lineStopAreaSchedulesGet to get schedules for specific stops.
 * 
 * @param lineId - The ID of the line (e.g., "B", "1", "2")
 * @returns A ToolResponse containing the list of stop areas with their IDs
 * 
 * Example usage:
 * 1. First call lineStopAreasGet("B") to get all stop areas for line B
 * 2. From the response, extract the stopAreaId from the metadata.stopAreas array
 * 3. Use that stopAreaId in lineStopAreaSchedulesGet to get schedules for that specific stop
 */
export async function lineStopAreasGet(lineId: string): Promise<ToolResponse> {
  try {
    const response = await instantSystemApi.get(`/v3/networks/${config.instantSystem.networkId}/lines/${lineId}/stopAreas`);
    const stopAreas: StopArea[] = response.data.stopAreas;
    
    if (stopAreas.length === 0) {
      return {
        isError: true,
        content: [{
          type: "text",
          text: `No stop areas found for line ${lineId}. Please verify the line ID is correct.`
        }]
      };
    }

    const stopAreasList = stopAreas.map(sa => `- ${sa.name} (ID: ${sa.id})`).join('\n');
    
    return {
      content: [{
        type: "text",
        text: `Found ${stopAreas.length} stop areas for line ${lineId}:\n${stopAreasList}\n\nUse these stop area IDs with lineStopAreaSchedulesGet to get schedules for specific stops.`
      }],
      metadata: { stopAreas }
    };
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: `Error getting stop areas: ${error instanceof Error ? error.message : String(error)}\n\nMake sure to call this function first to get the stop area IDs before using lineStopAreaSchedulesGet.`
      }]
    };
  }
}

/**
 * Get schedules for a stop area on a line
 */
export async function lineStopAreaSchedulesGet(
  lineId: string,
  stopAreaId: string,
  displayName: string,
  key: string,
  userlatlon: string
): Promise<ToolResponse> {
  try {
    const response = await instantSystemApi.get(`/v3/networks/${config.instantSystem.networkId}/lines/${lineId}/stopAreas/${stopAreaId}/schedules`, {
      params: { displayName, key, userlatlon }
    });
    const schedules: Schedule[] = response.data;
    
    return {
      content: [{
        type: "text",
        text: `Found ${schedules.length} schedules for stop area ${stopAreaId} on line ${lineId}`
      }],
      metadata: { schedules }
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error getting schedules: ${error instanceof Error ? error.message : String(error)}` }]
    };
  }
}

/**
 * Get disruptions for a network
 */
export async function disruptionsGet(
  subNetworks: string[],
  key: string,
  userlatlon: string
): Promise<ToolResponse> {
  try {
    const response = await instantSystemApi.get(`/v3/networks/${config.instantSystem.networkId}/lines/disruptions`, {
      params: { subNetworks, key, userlatlon }
    });
    const disruptions: Disruption[] = response.data;
    
    return {
      content: [{
        type: "text",
        text: `Found ${disruptions.length} disruptions for network ${config.instantSystem.networkId}`
      }],
      metadata: { disruptions }
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error getting disruptions: ${error instanceof Error ? error.message : String(error)}` }]
    };
  }
}

/**
 * Get vehicle journey directions for a line
 */
export async function vehicleJourneysDirectionsGet(
  lineId: string
): Promise<ToolResponse> {
  try {
    const response = await instantSystemApi.get(`/v3/networks/${config.instantSystem.networkId}/lines/${lineId}/vehicleJourneys/directions`, {
      params: { key: config.instantSystem.networkId }
    });
    const directions: VehicleJourneyDirection[] = response.data;
    
    return {
      content: [{
        type: "text",
        text: `Found ${directions.length} directions for line ${lineId}`
      }],
      metadata: { directions }
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error getting directions: ${error instanceof Error ? error.message : String(error)}` }]
    };
  }
}

/**
 * Get nearby stop areas based on coordinates
 * 
 * This function finds stop areas near a given location (latitude/longitude).
 * It's useful for finding the closest bus stops to a specific location.
 * 
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @param precision - Search precision (optional)
 * @param accessibility - Whether to consider accessibility (optional)
 * @param scholar - Scholar mode (optional)
 * @param context - Context for the search (optional)
 * @param key - API key (optional)
 * @returns A ToolResponse containing nearby stop areas with distances
 * 
 * Example usage:
 * 1. Call proximityGet(45.5646, 5.9178) to find stops near Chambéry
 * 2. The response will include stop areas sorted by distance
 */
export async function proximityGet(
  lat: number,
  lon: number,
  precision?: number,
  accessibility?: boolean,
  scholar?: number,
  context?: string,
  key?: string
): Promise<ToolResponse> {
  try {
    const response = await instantSystemApi.get(`/v3/networks/${config.instantSystem.networkId}/proximity`, {
      params: {
        lat,
        lon,
        precision,
        accessibility,
        scholar,
        context,
        key: key || config.instantSystem.networkId
      }
    });

    if (!response.data || !Array.isArray(response.data.proximities)) {
      return {
        isError: true,
        content: [{
          type: "text",
          text: `Invalid response format from proximity API. Response: ${JSON.stringify(response.data)}`
        }]
      };
    }
    
    const proximities: Proximity[] = response.data.proximities;
    const shapes: string[] = response.data.shapes || [];
    
    if (proximities.length === 0) {
      return {
        content: [{
          type: "text",
          text: `No points of interest found near the specified location (${lat}, ${lon}). Try adjusting the search area.`
        }]
      };
    }

    // Group proximities by type
    const stopAreas = proximities.filter(p => p.stopArea);
    const bikeParks = proximities.filter(p => p.bikePark);
    const parkAndRides = proximities.filter(p => p.parkAndRide);
    const carSharingStations = proximities.filter(p => p.carSharingStation);

    let responseText = `Found ${proximities.length} points of interest near the location (${lat}, ${lon}):\n\n`;

    if (stopAreas.length > 0) {
      responseText += `Bus Stops (${stopAreas.length}):\n`;
      responseText += stopAreas.map(sa => 
        `- ${sa.stopArea!.name} (${sa.stopArea!.city}) - ${sa.distance}m away\n` +
        `  Lines: ${sa.stopArea!.lines.map(l => l.sName).join(', ')}\n` +
        `  ID: ${sa.stopArea!.id}`
      ).join('\n') + '\n\n';
    }

    if (bikeParks.length > 0) {
      responseText += `Bike Parks (${bikeParks.length}):\n`;
      responseText += bikeParks.map(bp => 
        `- ${bp.bikePark!.name} (${bp.bikePark!.city}) - ${bp.distance}m away\n` +
        `  Capacity: ${bp.bikePark!.capacity > 0 ? bp.bikePark!.capacity : 'unknown'}\n` +
        `  Covered: ${bp.bikePark!.covered ? 'yes' : 'no'}`
      ).join('\n') + '\n\n';
    }

    if (parkAndRides.length > 0) {
      responseText += `Park & Ride (${parkAndRides.length}):\n`;
      responseText += parkAndRides.map(pr => 
        `- ${pr.parkAndRide!.name} (${pr.parkAndRide!.city}) - ${pr.distance}m away\n` +
        `  Available spots: ${pr.parkAndRide!.availableParks}`
      ).join('\n') + '\n\n';
    }

    if (carSharingStations.length > 0) {
      responseText += `Car Sharing Stations (${carSharingStations.length}):\n`;
      responseText += carSharingStations.map(cs => 
        `- ${cs.carSharingStation!.name} (${cs.carSharingStation!.city}) - ${cs.distance}m away\n` +
        `  Available vehicles: ${cs.carSharingStation!.availableVehicles}\n` +
        `  Address: ${cs.carSharingStation!.address}`
      ).join('\n') + '\n\n';
    }

    return {
      content: [{
        type: "text",
        text: responseText
      }],
      metadata: { proximities, shapes }
    };
  } catch (error) {
    console.error('[ERROR] Proximity API error:', error);
    return {
      isError: true,
      content: [{
        type: "text",
        text: `Error finding nearby points of interest: ${error instanceof Error ? error.message : String(error)}\n\nMake sure the coordinates are valid and within the network's coverage area.`
      }]
    };
  }
} 