/**
 * Fetch dynamic TURN credentials from the server
 * @returns {Promise<RTCIceServer | null>} A promise that resolves to the TURN server config object or null if failed/unavailable.
 */
async function fetchTurnCredentials() {
    try {
        const response = await fetch('/api/turn-credentials');
        if (!response.ok) {
            // Handle non-2xx responses (like 500, 503 errors from the backend)
            console.error(`Failed to fetch TURN credentials: ${response.status} ${response.statusText}`);
            try {
                // Try to parse error message from backend if available
                const errorBody = await response.json();
                console.error('Server error details:', errorBody);
            } catch(e) { /* Ignore if response wasn't JSON */ }
            return null;
        }

        const turnConfig = await response.json();

        // Check if the response contains valid data (backend might return {} if TURN isn't configured)
        if (turnConfig && turnConfig.urls && turnConfig.username && turnConfig.credential) {
            console.log('Successfully fetched dynamic TURN credentials.');
            // Return the single server object matching RTCIceServer structure
            return {
                urls: turnConfig.urls,
                username: turnConfig.username,
                credential: turnConfig.credential,
            };
        } else {
            console.warn('TURN credentials endpoint returned success, but data is missing or invalid. Proceeding without dynamic TURN.');
            return null;
        }
    } catch (error) {
        // Handle network errors or other issues during fetch
        console.error('Network or other error fetching TURN credentials:', error);
        return null;
    }
}
