# K9Crypt Status

K9Crypt Status is a real-time status monitoring application built with Svelte, designed to provide an immediate overview of the operational status of various services and websites. It continuously checks the availability and performance of configured endpoints and displays their current state, including any ongoing outages.

## Features

*   **Real-time Status Monitoring**: Continuously probes configured URLs to determine their availability and latency.
*   **Dynamic Status Display**: The main dashboard visually represents the status of each monitored service, grouped for clarity. It shows an overall system status (all active, some inactive, or loading).
*   **Outage Tracking**: Identifies and tracks the duration of service outages, providing clear information on how long a service has been unavailable.
*   **Configurable Sites**: Easily add or remove services to monitor by updating a simple configuration file.
*   **Responsive Navigation**: A clean and functional navigation bar with a link to the project's GitHub repository.
*   **Performance Metrics**: Records and stores historical data for each service, including uptime, downtime, and latency (within a defined limit).
*   **Svelte-Powered Frontend**: Leverages the reactivity and component-based architecture of Svelte for a lightweight and efficient user interface.

## Installation

To set up and run the K9Crypt Status application locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/k9crypt/status.git
    cd status
    ```

2.  **Install dependencies**:
    ```bash
    bun install
    # or npm install
    # or yarn install
    ```

3.  **Configure monitored sites**:
    Open [`src/lib/config/sites.ts`](src/lib/config/sites.ts) and modify the `sites` array to include the services you wish to monitor.

    ```typescript
    // src/lib/config/sites.ts
    export const sites = [
      {
        name: "My Website",
        description: "Main company website",
        url: "https://example.com",
        group: "Websites",
      },
      {
        name: "API Service",
        description: "Backend API endpoint",
        url: "https://api.example.com",
        group: "Services",
      },
      // Add more sites as needed
    ];
    ```

4.  **Run the application**:
    ```bash
    bun dev
    # or npm run dev
    # or yarn dev
    ```
    The application will typically be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Usage

Once the application is running, it will automatically start monitoring the configured sites. The dashboard will display the status of each service, indicating whether it is "Active," "Not Active," or "Loading." Outage durations will be shown for services that are currently down. The status updates every 10 seconds.

## License

This project is open-source and available under the [MIT License](LICENSE).