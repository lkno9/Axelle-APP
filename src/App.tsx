import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Planifier from "./pages/Planifier";
import Motivation from "./pages/Motivation";
import Study from "./pages/Study";
import Hobbies from "./pages/Hobbies";
import Profil from "./pages/Profil";
import Parametres from "./pages/Parametres";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/planifier" element={<Planifier />} />
        <Route path="/motivation" element={<Motivation />} />
        <Route path="/study" element={<Study />} />
        <Route path="/hobbies" element={<Hobbies />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/parametres" element={<Parametres />} />
      </Route>
    </Routes>
  );
}
