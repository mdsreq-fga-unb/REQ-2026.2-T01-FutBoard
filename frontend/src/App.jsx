import React, { useState } from "react";
import MacrociclosPage from "./pages/MacrociclosPage.jsx";
import MesociclosPage from "./pages/MesociclosPage.jsx";
import ComportamentosPage from "./pages/ComportamentosPage.jsx";
import MicrociclosPage from "./pages/MicrociclosPage.jsx";
import SessoesPage from "./pages/SessoesPage.jsx";
import BibliotecaPage from "./pages/BibliotecaPage.jsx";

export default function App() {
  const [currentPage, setCurrentPage] = useState("biblioteca");

  if (currentPage === "comportamentos") {
    return <ComportamentosPage onSelectNav={setCurrentPage} />;
  }

  if (currentPage === "mesociclos") {
    return <MesociclosPage onSelectNav={setCurrentPage} />;
  }

  if (currentPage === "microciclos") {
    return <MicrociclosPage onSelectNav={setCurrentPage} />;
  }

  if (currentPage === "sessoes") {
    return <SessoesPage onSelectNav={setCurrentPage} />;
  }

  if (currentPage === "biblioteca") {
    return <BibliotecaPage onSelectNav={setCurrentPage} />;
  }

  return <MacrociclosPage onSelectNav={setCurrentPage} />;
}
