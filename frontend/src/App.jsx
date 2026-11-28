import React, { useEffect, useState } from "react";
import AutenticacaoLayout from "./components/AutenticacaoLayout.jsx";
import BibliotecaPage from "./pages/BibliotecaPage.jsx";
import ComportamentosPage from "./pages/ComportamentosPage.jsx";
import CriarContaPage from "./pages/CriarContaPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MacrociclosPage from "./pages/MacrociclosPage.jsx";
import MesociclosPage from "./pages/MesociclosPage.jsx";
import MicrociclosPage from "./pages/MicrociclosPage.jsx";
import SessoesPage from "./pages/SessoesPage.jsx";
import {
  observarFimDaAutenticacao,
  obterMensagemErro,
  sair,
  verificarAutenticacao,
} from "./services/autenticacao.js";

const paginasInternas = {
  dashboard: DashboardPage,
  comportamentos: ComportamentosPage,
  macrociclos: MacrociclosPage,
  mesociclos: MesociclosPage,
  microciclos: MicrociclosPage,
  sessoes: SessoesPage,
  biblioteca: BibliotecaPage,
};

export default function App() {
  const [pagina, setPagina] = useState("dashboard");
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(true);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    let ativo = true;
    const cancelarObservacao = observarFimDaAutenticacao((mensagem) => {
      setUsuario(null);
      setPagina("login");
      setAviso(mensagem ? { mensagem, erro: true } : null);
    });

    verificarAutenticacao()
      .then((usuarioAtual) => {
        if (ativo) setUsuario(usuarioAtual);
      })
      .catch((erro) => {
        if (ativo && ![400, 401, 403].includes(erro.response?.status)) {
          setAviso({
            mensagem: obterMensagemErro(erro, "Não foi possível verificar seu acesso."),
            erro: true,
          });
        }
      })
      .finally(() => {
        if (ativo) setVerificando(false);
      });

    return () => {
      ativo = false;
      cancelarObservacao();
    };
  }, []);

  async function selecionarPagina(destino) {
    if (destino !== "sair") {
      setPagina(destino);
      return;
    }
    try {
      await sair();
    } catch {
      setAviso({
        mensagem: "Você saiu deste navegador. Não foi possível confirmar o logout no servidor.",
        erro: true,
      });
    }
  }

  if (verificando) {
    return <AutenticacaoLayout titulo="Verificando acesso" />;
  }

  if (!usuario) {
    if (pagina === "criar-conta") {
      return (
        <CriarContaPage
          onSelectNav={setPagina}
          onCadastroConcluido={(mensagem) => {
            setAviso({ mensagem, erro: false });
            setPagina("login");
          }}
        />
      );
    }
    return (
      <LoginPage
        aviso={aviso}
        onSelectNav={setPagina}
        onAutenticado={(usuarioAtual) => {
          setUsuario(usuarioAtual);
          setAviso(null);
          setPagina("macrociclos");
        }}
      />
    );
  }

  const PaginaInterna = paginasInternas[pagina] ?? DashboardPage;
  return <PaginaInterna onSelectNav={selecionarPagina} />;
}
