import React, { useState } from "react";
import MacrociclosPage from "./MacrociclosPage.jsx";
import MicrociclosPage from "./MicrociclosPage.jsx";
import SessoesPage from "./SessoesPage.jsx";

export default function DashboardPage() {
  const [abaAtiva, setAbaAtiva] = useState("sessoes");

  if (abaAtiva === "macrociclos") {
    return <MacrociclosPage onSelectNav={setAbaAtiva} />;
  }

  if (abaAtiva === "microciclos") {
    return <MicrociclosPage onSelectNav={setAbaAtiva} />;
  }

  return <SessoesPage onSelectNav={setAbaAtiva} />;
}

