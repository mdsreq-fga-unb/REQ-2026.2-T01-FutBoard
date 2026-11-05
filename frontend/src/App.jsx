import React, { useState } from "react";
import MacrociclosPage from "./pages/MacrociclosPage.jsx";
import MicrociclosPage from "./pages/MicrociclosPage.jsx";

export default function App() {
  const [currentPage, setCurrentPage] = useState("microciclos");

  if (currentPage === "microciclos") {
    return <MicrociclosPage onSelectNav={setCurrentPage} />;
  }

  return <MacrociclosPage onSelectNav={setCurrentPage} />;
}
