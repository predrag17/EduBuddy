import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axiosInstance from "./config/axiosInstance";

interface EduBuddyData {
  name: string;
  surname: string;
}

function App() {
  const [data, setData] = useState<EduBuddyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // just for testing purposes to see if the API is working
  useEffect(() => {
    axiosInstance
      .get("")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("An error occurred while fetching data.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        {loading && <p>Loading...</p>}

        {error && <p>{error}</p>}

        {data && (
          <div>
            <h3>API Response:</h3>
            <p>
              {data.name} {data.surname}
            </p>
          </div>
        )}

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
