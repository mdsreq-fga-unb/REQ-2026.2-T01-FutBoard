import React, { useState } from "react";
import MacrociclosPage from "./pages/MacrociclosPage.jsx";
import ComportamentosPage from "./pages/ComportamentosPage.jsx";
import MicrociclosPage from "./pages/MicrociclosPage.jsx";
import SessoesPage from "./pages/SessoesPage.jsx";

export default function App() {
  const [currentPage, setCurrentPage] = useState("sessoes");

  if (currentPage === "comportamentos") {
    return <ComportamentosPage onSelectNav={setCurrentPage} />;
  }

  if (currentPage === "microciclos") {
    return <MicrociclosPage onSelectNav={setCurrentPage} />;
  }

  if (currentPage === "sessoes") {
    return <SessoesPage onSelectNav={setCurrentPage} />;
  }

  return <MacrociclosPage onSelectNav={setCurrentPage} />;
}
