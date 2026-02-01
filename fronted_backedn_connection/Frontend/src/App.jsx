import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global layout components */}
        <Navbar />

        {/* Route definitions */}
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
