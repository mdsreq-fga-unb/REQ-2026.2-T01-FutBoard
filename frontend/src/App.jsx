import React, { useState } from "react";
import MacrociclosPage from "./pages/MacrociclosPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CriarContaPage from "./pages/CriarContaPage.jsx";
import MicrociclosPage from "./pages/MicrociclosPage.jsx";
import SessoesPage from "./pages/SessoesPage.jsx";
import { estaAutenticado } from "./services/autenticacao.js";

// US28: exige login para acessar as telas internas.
// Fica desligado até a API de usuários existir (VITE_AUTENTICACAO_OBRIGATORIA=true liga).
const AUTENTICACAO_OBRIGATORIA =
  import.meta.env.VITE_AUTENTICACAO_OBRIGATORIA === "true";

const PAGINAS_PUBLICAS = ["login", "criar-conta"];

export default function App() {
  const [currentPage, setCurrentPage] = useState("sessoes");
  const [autenticado, setAutenticado] = useState(estaAutenticado);

  const concluirAutenticacao = () => {
    setAutenticado(true);
    setCurrentPage("macrociclos");
  };

  // Sem sessão ativa, qualquer rota interna leva ao login
  const paginaAtual =
    AUTENTICACAO_OBRIGATORIA &&
    !autenticado &&
    !PAGINAS_PUBLICAS.includes(currentPage)
      ? "login"
      : currentPage;

  // US27 e US28: telas de acesso
  if (paginaAtual === "login") {
    return (
      <LoginPage
        onSelectNav={setCurrentPage}
        onAutenticado={concluirAutenticacao}
      />
    );
  }

  if (paginaAtual === "criar-conta") {
    return (
      <CriarContaPage
        onSelectNav={setCurrentPage}
        onAutenticado={concluirAutenticacao}
      />
    );
  }

  if (paginaAtual === "microciclos") {
    return <MicrociclosPage onSelectNav={setCurrentPage} />;
  }

  if (paginaAtual === "sessoes") {
    return <SessoesPage onSelectNav={setCurrentPage} />;
  }

  return <MacrociclosPage onSelectNav={setCurrentPage} />;
}
