# Synchro Bus MCP Server

A Model Context Protocol server for accessing the Synchro Bus (Instant-System) API. This server provides access to various endpoints of the Instant-System API v3, specifically for the Synchro Bus network (ID: 3).

## Features

The server exposes the following API endpoints:

- `networkGet`: Get network information
- `linesGet`: Get all lines for a network
- `lineGet`: Get information about a specific line
- `lineStopAreasGet`: Get stop areas for a line
- `lineStopAreaSchedulesGet`: Get schedules for a stop area on a line
- `disruptionsGet`: Get disruptions for a network
- `vehicleJourneysDirectionsGet`: Get vehicle journey directions for a line

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file and update it with your settings:
   ```bash
   cp .env.example .env
   ```
4. Build the project:
   ```bash
   npm run build
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
INSTANT_SYSTEM_BASE_URL=https://prod.instant-system.com/InstantCore
```

## Usage

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Reference

### networkGet
Get information about the Synchro Bus network.

### linesGet
Get all lines available in the network.

### lineGet
Get detailed information about a specific line.

### lineStopAreasGet
Get all stop areas for a specific line.

### lineStopAreaSchedulesGet
Get schedules for a specific stop area on a line.

### disruptionsGet
Get current disruptions in the network.

### vehicleJourneysDirectionsGet
Get available directions for vehicle journeys on a line.

## Development

- `npm run build` - Build the project
- `npm run dev` - Start the server in development mode with auto-reload
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

MIT