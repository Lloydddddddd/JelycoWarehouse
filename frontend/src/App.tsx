import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return <Dashboard />;
}

export default App;