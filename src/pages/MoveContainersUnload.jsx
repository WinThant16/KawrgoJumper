import React, { useEffect, useState } from 'react';
import requestLib from '../lib/requestLib'; // Assuming requestLib is the helper for backend requests

function MoveContainersUnload() {
	const [unloadSteps, setUnloadSteps] = useState([]);
	const [error, setError] = useState(null);

	const selectedContainers = localStorage.getItem("selected_containers");

  useEffect(() => {
    // Fetch unloading steps from the backend
    async function fetchUnloadSteps() {
      try {
        // Replace 'get' with the correct call to computeUnload
        const response = await requestLib.computeUnload(selectedContainers); // Example: Pass correct container positions
        setUnloadSteps(response || []);
      } catch (err) {
        console.error("Error fetching unload steps:", err);
        setError('Failed to fetch unload steps. Please try again.');
      }
    }
    fetchUnloadSteps();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Unloading Steps</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {unloadSteps.length > 0 ? (
          unloadSteps.map((step, index) => <li key={index}>{JSON.stringify(step)}</li>)
        ) : (
          <p>No steps available. Ensure containers are selected and unloading steps have been computed.</p>
        )}
      </ul>
    </div>
  );
}

export default MoveContainersUnload;
