import React from "react";
import AppDrawer from "./components/AppDrawer/AppDrawer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes/routes";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <AppDrawer>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </AppDrawer>
      </BrowserRouter>
    </div>
  );
};
export default App;
