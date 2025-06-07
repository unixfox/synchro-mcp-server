import { z } from 'zod';

// MCP tool schemas
export const networkGetSchema = z.object({});

export const linesGetSchema = z.object({});

export const lineGetSchema = z.object({
  lineId: z.string().min(1, 'Line ID is required'),
});

export const lineStopAreasGetSchema = z.object({
  lineId: z.string().min(1, 'Line ID is required'),
});

export const lineStopAreaSchedulesGetSchema = z.object({
  lineId: z.string().min(1, 'Line ID is required'),
  stopAreaId: z.string().min(1, 'Stop Area ID is required'),
  displayName: z.string().optional(),
  key: z.number().optional(),
  userlatlon: z.string().optional(),
});

export const disruptionsGetSchema = z.object({
  subNetworks: z.string().optional(),
  key: z.number().optional(),
  userlatlon: z.string().optional(),
});

export const vehicleJourneysDirectionsGetSchema = z.object({
  lineId: z.string().min(1, 'Line ID is required'),
});

export const proximityGetSchema = z.object({
  lat: z.number().describe('Latitude of the location'),
  lon: z.number().describe('Longitude of the location'),
  precision: z.number().optional().describe('Search precision'),
  accessibility: z.boolean().optional().describe('Whether to consider accessibility'),
  scholar: z.number().optional().describe('Scholar mode'),
  context: z.string().optional().describe('Context for the search'),
  key: z.string().optional().describe('API key')
});

// MCP response interface
export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{
    [key: string]: unknown;
    type: "text" | "image" | "audio" | "resource";
    text?: string;
    data?: string;
    mimeType?: string;
    resource?: {
      type: string;
      text?: string;
      uri?: string;
      blob?: string;
      mimeType?: string;
    };
  }>;
  _meta?: Record<string, unknown>;
  isError?: boolean;
}

// API response interfaces
export interface Network {
  id: number;
  name: string;
  networkLoaded: boolean;
  tripplannerLoaded: boolean;
  lat: number;
  lon: number;
  modes: string[];
}

export interface Line {
  operatorId: string;
  id: string;
  sName: string;
  lName: string;
  mode: string;
  subNetwork: {
    id: string;
    name: string;
  };
  color: string;
  textColor: string;
}

export interface StopArea {
  id: string;
  name: string;
  lat: number;
  lon: number;
  city: string;
  postalCode: string;
}

export interface Schedule {
  businessDate: string;
  vehicleJourneyId: string;
  destinationDisplay: string;
  departureDateTime: string;
  departureWait: number;
  precision: number;
  realTime: number;
}

export interface Disruption {
  operatorId: string;
  id: string;
  title: string;
  messages: Array<{
    text: string;
  }>;
  level: string;
  issueDate: string;
  startValidity: string;
  endValidity: string;
}

export interface Config {
  instantSystem: { 
    baseUrl: string;
    networkId: number;
  };
  server: { name: string; version: string };
}

export interface VehicleJourneyDirection {
  id: string;
  sName: string;
  lName: string;
  direction: string;
  line: Line;
  stopAreas: StopArea[];
}

export interface Proximity {
  distance: number;
  stopArea?: {
    id: string;
    name: string;
    lat: number;
    lon: number;
    city: string;
    modes: string[];
    lines: Line[];
    commercialModes: any[];
    actions: Array<{
      elementType: string;
      actionType: string;
      enabled: boolean;
      labelKey: string;
    }>;
  };
  bikePark?: {
    id: string;
    type: string;
    operatorId: string;
    name: string;
    names: {
      en: string;
      fr: string;
      nl: string;
    };
    lat: number;
    lon: number;
    covered: boolean;
    capacity: number;
    city: string;
    actions: Array<{
      elementType: string;
      actionType: string;
      enabled: boolean;
      labelKey: string;
    }>;
  };
  parkAndRide?: {
    id: string;
    type: string;
    operatorId: string;
    name: string;
    lat: number;
    lon: number;
    city: string;
    picto: string;
    capacity: number;
    capacityPRM: number;
    availability: number;
    availableParks: number;
    availableParksPRM: number;
    actions: Array<{
      elementType: string;
      actionType: string;
      enabled: boolean;
      labelKey: string;
    }>;
  };
  carSharingStation?: {
    id: string;
    operatorId: string;
    gisTypeId: string;
    type: string;
    name: string;
    address: string;
    city: string;
    lat: number;
    lon: number;
    availableVehicles: number;
    availableSpots: number;
    signUpLink: {
      url: string;
    };
    vehicles: Array<{
      id: string;
      name: string;
      info: string;
      category: string;
      engineType: string;
      brand: string;
      model: string;
      photo: string;
      seats: number;
      actions: any[];
    }>;
    actions: Array<{
      elementType: string;
      actionType: string;
      enabled: boolean;
      labelKey: string;
      uri?: string;
    }>;
  };
}