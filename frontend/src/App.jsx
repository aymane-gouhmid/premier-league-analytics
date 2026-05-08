import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Compare from "./pages/Compare";
import Seasons from "./pages/Seasons";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/seasons" element={<Seasons />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}