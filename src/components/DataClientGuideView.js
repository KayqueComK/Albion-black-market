// Componente da Aba: Guia do Albion Data Client

export function createDataClientGuideView(container) {
  container.innerHTML = `
    <div class="guide-dashboard">
      <div class="guide-hero">
        <div class="guide-hero-content">
          <span class="badge-tag">SINCRONIZAÇÃO EM TEMPO REAL</span>
          <h2 class="guide-hero-title">Como Atualizar os Preços do Mercado do Jogo</h2>
          <p class="guide-hero-lead">
            O Albion Online não fornece uma API oficial direta do jogo. Todo o banco de dados público da comunidade é mantido pelo <strong>Albion Online Data Project</strong> através de leituras de pacotes enviadas pelos próprios jogadores.
          </p>
        </div>
      </div>

      <!-- Alerta de Segurança e TOS -->
      <div class="safety-banner">
        <div class="safety-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div class="safety-text">
          <h4>O Albion Data Client é 100% Seguro e Permitido?</h4>
          <p>
            <strong>SIM!</strong> Os desenvolvedores da Sandbox Interactive confirmaram oficialmente no fórum do jogo que o Albion Data Client é permitido, pois ele apenas escuta os pacotes de dados de mercado da rede (via Npcap) de forma passiva. Ele <strong>NÃO</strong> modifica arquivos do jogo, <strong>NÃO</strong> injeta código na memória e <strong>NÃO</strong> automatiza ações (não é bot nem macro).
          </p>
        </div>
      </div>

      <!-- Links Oficiais de Download -->
      <div class="downloads-grid">
        <div class="download-card">
          <div class="download-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </div>
          <div class="download-card-info">
            <h3>Baixar Albion Data Client</h3>
            <p>Versão oficial instalável para Windows (GitHub Releases)</p>
          </div>
          <a href="https://github.com/ao-data/albiondata-client/releases" target="_blank" rel="noopener" class="btn btn-primary">
            Baixar Última Versão (Releases)
          </a>
        </div>

        <div class="download-card">
          <div class="download-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="download-card-info">
            <h3>Repositório Oficial do Projeto</h3>
            <p>Código-fonte aberto e documentação detalhada</p>
          </div>
          <a href="https://github.com/ao-data/albiondata-client" target="_blank" rel="noopener" class="btn btn-secondary">
            Ver GitHub do Projeto
          </a>
        </div>
      </div>

      <!-- Passo a Passo Ilustrado -->
      <div class="tutorial-steps-container">
        <h3 class="steps-title">Passo a Passo para Ter Cotações Atualizadas em Segundos:</h3>

        <div class="step-guide-item">
          <div class="step-number">1</div>
          <div class="step-body">
            <h4>Inicie o Albion Data Client</h4>
            <p>Baixe e execute o cliente antes ou depois de abrir o jogo. Uma janela preta do prompt de comando se abrirá mostrando a mensagem de escuta dos pacotes do Albion.</p>
          </div>
        </div>

        <div class="step-guide-item">
          <div class="step-number">2</div>
          <div class="step-body">
            <h4>Abra o Mercado de Lymhurst</h4>
            <p>Com seu personagem em Lymhurst, vá até o Mercado e abra a aba de compra. Ao navegar pelos itens ou pesquisar pelas categorias desejadas (ex: Armas T4 a T8), o cliente detecta os preços na tela e os envia instantaneamente para o servidor público da API.</p>
          </div>
        </div>

        <div class="step-guide-item">
          <div class="step-number">3</div>
          <div class="step-body">
            <h4>Atualize o Mercado Negro (Black Market) em Caerleon</h4>
            <p>
              <strong>Dica de Mestre:</strong> Crie um personagem secundário (alt) e deixe-o permanentemente deslogado dentro do Black Market de Caerleon! Sempre que for fazer uma análise de transporte, mude para ele por 30 segundos, abra o Black Market e passe pelas ordens de compra. Em seguida volte para seu personagem de Lymhurst.
            </p>
          </div>
        </div>

        <div class="step-guide-item">
          <div class="step-number">4</div>
          <div class="step-body">
            <h4>Clique em "Atualizar Cotações" nesta Aplicação</h4>
            <p>Pronto! Como as APIs são públicas, ao clicar no botão de atualizar na calculadora, nossa ferramenta puxará os dados que acabaram de ser transmitidos, exibindo o status <strong>"Agora mesmo"</strong> ou <strong>"há 2 min"</strong> com precisão de 100%.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
