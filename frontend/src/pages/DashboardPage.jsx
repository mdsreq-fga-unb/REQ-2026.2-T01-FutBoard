import React, { useState } from "react";
import MacrociclosPage from "./MacrociclosPage.jsx";
import SessoesPage from "./SessoesPage.jsx";

export default function DashboardPage() {
  const [abaAtiva, setAbaAtiva] = useState("sessoes");

  if (abaAtiva === "macrociclos") {
    return <MacrociclosPage onSelectNav={setAbaAtiva} />;
  }

  return <SessoesPage onSelectNav={setAbaAtiva} />;
}
