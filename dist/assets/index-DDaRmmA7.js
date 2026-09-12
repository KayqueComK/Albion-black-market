(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const O=[{id:"americas",name:"Americas (West)",baseUrl:"https://west.albion-online-data.com"},{id:"europe",name:"Europe",baseUrl:"https://europe.albion-online-data.com"},{id:"asia",name:"Asia (East)",baseUrl:"https://east.albion-online-data.com"}],oe=[{id:"Lymhurst",name:"Lymhurst (Sua Cidade)",isDefault:!0,color:"#10b981"},{id:"Fort Sterling",name:"Fort Sterling",isDefault:!1,color:"#f8fafc"},{id:"Thetford",name:"Thetford",isDefault:!1,color:"#a855f7"},{id:"Martlock",name:"Martlock",isDefault:!1,color:"#3b82f6"},{id:"Bridgewatch",name:"Bridgewatch",isDefault:!1,color:"#f97316"},{id:"Caerleon",name:"Caerleon",isDefault:!1,color:"#ef4444"}],j=new Map,se=60*1e3;function Z(t,e=1){return`https://render.albiononline.com/v1/item/${t}.png?size=64&quality=${e}`}async function ie(t,e="Lymhurst",a="americas"){if(!t||t.length===0)return[];const o=O.find(l=>l.id===a)||O[0],s=`${e},Black Market`,r=45,d=[];for(let l=0;l<t.length;l+=r)d.push(t.slice(l,l+r));const p=[];for(const l of d){const u=`${o.id}_${e}_${l.join(",")}`,c=j.get(u);if(c&&Date.now()-c.timestamp<se){p.push(...c.data);continue}const h=`${o.baseUrl}/api/v2/stats/prices/${l.join(",")}.json?locations=${encodeURIComponent(s)}`;try{const f=await fetch(h,{headers:{Accept:"application/json"}});if(!f.ok){console.warn(`[Albion API] Falha na requisição: status ${f.status}`);continue}const E=await f.json();j.set(u,{timestamp:Date.now(),data:E}),p.push(...E)}catch(f){console.error("[Albion API Error]",f)}}return p}function P(t){if(t==null||isNaN(t))return"0";const e=Math.round(t);return Math.abs(e)>=1e6?(e/1e6).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:2})+" M":Math.abs(e)>=1e3?(e/1e3).toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:1})+" k":e.toLocaleString("pt-BR")}function re(t){if(!t||t.startsWith("0001"))return"Sem dados";const e=new Date(t+"Z"),a=Date.now()-e.getTime(),o=Math.floor(a/(60*1e3));if(o<1)return"Agora mesmo";if(o<60)return`há ${o} min`;const s=Math.floor(o/60);return s<24?`há ${s} h`:`há ${Math.floor(s/24)} d`}const Q="albion_bandit_last_event_v1",w={durationMinutes:50,minCooldownMinutes:240,expectedCooldownMinutes:285,maxCooldownMinutes:330},I={ACTIVE:{id:"ACTIVE",label:"ASSALTO ATIVO - JANELA DE OURO!",badgeClass:"status-active",riskLevel:"Mínimo com a Zerg",riskColor:"#10b981",recommendation:"Junte-se à Zerg da Facção de Lymhurst! As forças de Lymhurst estão avançando em massa pelas zonas vermelhas até Caerleon. Qualquer ganker solitário ou grupo hostil é esmagado pelo blob aliado. Melhor momento do jogo para transportar!",icon:"shield-check"},POST_ASSAULT:{id:"POST_ASSAULT",label:"JANELA PÓS-ASSALTO (DESMOBILIZAÇÃO)",badgeClass:"status-post",riskLevel:"Moderado",riskColor:"#38bdf8",recommendation:"O evento acabou há poucos minutos. Os postos avançados foram capturados e a maioria dos jogadores de PvP está retornando. É viável transportar com montarias velozes (Cavalo Blindado ou Javali), mas fique atento a emboscadas isoladas.",icon:"wind"},HIGH_DANGER:{id:"HIGH_DANGER",label:"ZONA DE ALTO RISCO (ENTRESSAFRA)",badgeClass:"status-danger",riskLevel:"Crítico / Muito Alto",riskColor:"#ef4444",recommendation:"PERIGO MÁXIMO! Zonas vermelhas (Creag Garr, Willow Wood, Runnel Sink) altamente visadas por gankers com garras e cajados duplos caçando transportadores. NÃO transporte solo com carga pesada. Fique em Lymhurst preparando seus itens.",icon:"skull"},PREPARING:{id:"PREPARING",label:"JANELA DE PREPARAÇÃO (EM BREVE)",badgeClass:"status-prep",riskLevel:"Atenção / Pré-Evento",riskColor:"#f59e0b",recommendation:"A janela de recarga atingiu o tempo mínimo. O aviso de 15 minutos pode surgir no jogo a qualquer instante! Compre seus itens no mercado de Lymhurst, guarde no inventário e equipe sua montaria para sair assim que o aviso soar.",icon:"clock"},WARNING_15MIN:{id:"WARNING_15MIN",label:"AVISO DE 15 MINUTOS NO JOGO!",badgeClass:"status-warning",riskLevel:"Baixo se sincronizado",riskColor:"#eab308",recommendation:"O aviso oficial de 15 minutos foi emitido pelo jogo! Dirija-se imediatamente à saída do portal de Lymhurst com sua montaria e aguarde os comandantes da facção darem a chamada de marcha.",icon:"bell"}};function V(){try{const e=localStorage.getItem(Q);if(e){const a=JSON.parse(e);return{timestamp:Number(a.timestamp),type:a.type||"start",server:a.server||"americas"}}}catch(e){console.error("Erro ao ler último assalto do storage",e)}return{timestamp:Date.now()-10800*1e3,type:"start",server:"americas"}}function D(t="start",e="americas",a=null){const s={timestamp:a||Date.now(),type:t,server:e};return localStorage.setItem(Q,JSON.stringify(s)),s}function U(t,e=Date.now()){const o=(e-t)/(60*1e3);if(o>=0&&o<w.durationMinutes){const r=Math.max(0,Math.round(w.durationMinutes-o));return{status:I.ACTIVE,timeRemainingMinutes:r,isLive:!0,phase:"live"}}if(o>=w.durationMinutes&&o<w.durationMinutes+30){const r=Math.max(0,Math.round(w.durationMinutes+30-o));return{status:I.POST_ASSAULT,timeRemainingMinutes:r,isLive:!1,phase:"post"}}if(o>=w.minCooldownMinutes&&o<w.maxCooldownMinutes){const r=Math.max(0,Math.round(w.expectedCooldownMinutes-o));return{status:I.PREPARING,timeRemainingMinutes:r,isLive:!1,phase:"prep"}}if(o>=w.maxCooldownMinutes)return{status:I.WARNING_15MIN,timeRemainingMinutes:0,isLive:!1,phase:"imminent"};const s=Math.max(0,Math.round(w.minCooldownMinutes-o));return{status:I.HIGH_DANGER,timeRemainingMinutes:s,isLive:!1,phase:"cooldown"}}function W(){try{const t=window.AudioContext||window.webkitAudioContext;if(!t)return;const e=new t,a=e.createOscillator(),o=e.createGain();a.type="sine",a.frequency.setValueAtTime(587.33,e.currentTime),o.gain.setValueAtTime(.15,e.currentTime),o.gain.exponentialRampToValueAtTime(.001,e.currentTime+.4),a.connect(o),o.connect(e.destination),a.start(),a.stop(e.currentTime+.4);const s=e.createOscillator(),r=e.createGain();s.type="sine",s.frequency.setValueAtTime(880,e.currentTime+.15),r.gain.setValueAtTime(.2,e.currentTime+.15),r.gain.exponentialRampToValueAtTime(.001,e.currentTime+.7),s.connect(r),r.connect(e.destination),s.start(e.currentTime+.15),s.stop(e.currentTime+.7)}catch(t){console.warn("Audio não suportado ou bloqueado pelo navegador",t)}}function ce(t,e){let a=null;function o(){const d=V(),p=U(d.timestamp),l=p.status,u=new Date(d.timestamp),c=u.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),h=u.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"}),f=new Date(d.timestamp+w.minCooldownMinutes*60*1e3),E=new Date(d.timestamp+w.expectedCooldownMinutes*60*1e3),b=new Date(d.timestamp+w.maxCooldownMinutes*60*1e3),g=f.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),y=E.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),i=b.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});t.innerHTML=`
      <div class="bandit-dashboard">
        <!-- Banner Principal de Status de Transporte -->
        <div class="status-hero-card ${l.badgeClass}">
          <div class="status-hero-top">
            <div class="status-indicator">
              <span class="pulse-dot"></span>
              <span class="status-title-text">${l.label}</span>
            </div>
            <div class="risk-badge" style="background: ${l.riskColor}22; border-color: ${l.riskColor}; color: ${l.riskColor}">
              Risco de Transporte: <strong>${l.riskLevel}</strong>
            </div>
          </div>

          <div class="status-advice-box">
            <div class="advice-header">
              <svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span>Diretriz Tática para Lymhurst:</span>
            </div>
            <p class="advice-content">${l.recommendation}</p>
          </div>

          <!-- Cronômetro e Janela Estimada -->
          <div class="timer-countdown-section">
            <div class="countdown-card">
              <span class="countdown-label">
                ${p.isLive?"TEMPO RESTANTE DE ASSALTO":"TEMPO ATÉ A PRÓXIMA JANELA ESTIMADA"}
              </span>
              <div class="countdown-display" id="bandit-live-timer">
                --:--:--
              </div>
              <span class="countdown-subtext">
                ${p.isLive?"Aproveite a escolta dos aliados!":`Janela provável: entre <strong>${g}</strong> e <strong>${i}</strong>`}
              </span>
            </div>

            <div class="event-meta-card">
              <div class="meta-row">
                <span class="meta-title">Último Assalto Registrado:</span>
                <span class="meta-val">${h} às ${c}</span>
              </div>
              <div class="meta-row">
                <span class="meta-title">Estimativa Principal:</span>
                <span class="meta-val highlight-gold">${y} (~${Math.round(w.expectedCooldownMinutes/60)}h intervalo)</span>
              </div>
              <div class="meta-row">
                <span class="meta-title">Servidor Selecionado:</span>
                <span class="meta-val text-capitalize">${e.selectedServer.name}</span>
              </div>
            </div>
          </div>

          <!-- Botões de Ação Rápida -->
          <div class="bandit-actions-bar">
            <button class="btn btn-primary" id="btn-report-bandit-now">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Assalto Começou Agora!
            </button>
            <button class="btn btn-outline" id="btn-report-bandit-ended">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
              Terminou Agora
            </button>
            <button class="btn btn-secondary" id="btn-custom-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              Ajustar Horário
            </button>
            <button class="btn btn-secondary" id="btn-test-sound">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              Testar Alerta Sonoro
            </button>
          </div>
        </div>

        <!-- Guia de Rota Lymhurst -> Caerleon -->
        <div class="route-guide-section">
          <div class="section-header-box">
            <h2 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              Guia de Rota Estratégica: Lymhurst até Caerleon
            </h2>
            <p class="section-subtitle">Mapas cruzados, estrangulamentos de risco e pontos de emboscada</p>
          </div>

          <div class="route-steps-grid">
            <div class="route-step-card safe-zone">
              <div class="step-badge">1. Ponto de Partida</div>
              <h3 class="step-name">Lymhurst & Birchwood</h3>
              <span class="zone-tag safe">Zona Azul / Amarela</span>
              <p class="step-desc">Saia de Lymhurst com inventário pronto. Se estiver durante o Assalto dos Bandidos, posicione-se próximo à bandeira da Facção para sair com o grupo principal.</p>
            </div>

            <div class="route-step-card danger-zone">
              <div class="step-badge">2. Entrada Zona Vermelha</div>
              <h3 class="step-name">Flynsdell & Willow Wood</h3>
              <span class="zone-tag red">Zona Vermelha</span>
              <p class="step-desc">Primeiro mapa de perigo real. Monitore o número de PKs (bandeiras vermelhas) no canto inferior direito do mini-mapa. Se houver mais de 3 PKs, fique colado na zerg aliada.</p>
            </div>

            <div class="route-step-card critical-zone">
              <div class="step-badge">3. Gargalo Crítico</div>
              <h3 class="step-name">Creag Garr & Runnel Sink</h3>
              <span class="zone-tag deadly">Extremamente Perigoso</span>
              <p class="step-desc">O ponto mais visado por gankers de Caerleon. As pontes e passagens estreitas costumam ter scouts invisíveis. NUNCA ande pela estrada principal — corte pelas bordas e florestas.</p>
            </div>

            <div class="route-step-card goal-zone">
              <div class="step-badge">4. Destino Final</div>
              <h3 class="step-name">Caerleon & Mercado Negro</h3>
              <span class="zone-tag city">Cidade / Sem PvP</span>
              <p class="step-desc">Entre pelo portal leste de Caerleon sob o buff de imunidade de bolha. Desmonte direto no Black Market para vender suas cargas com segurança total!</p>
            </div>
          </div>

          <!-- Dicas de Equipamentos e Montarias -->
          <div class="gear-mounts-grid">
            <div class="tactical-card">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Build Recomendada de Fuga (Sobrevivência)
              </h3>
              <ul class="tactical-list">
                <li><strong>Arma Principal:</strong> Cajado Duplo (Double Bladed Staff) ou Sanguinária (Bloodletter) com Corrida Extra.</li>
                <li><strong>Peitoral:</strong> Jaqueta do Assassino (Habilidade de Invisibilidade para resetar aggro e desorientar gankers).</li>
                <li><strong>Elmo:</strong> Capuz do Mercenário (Limpeza de CC e lentidão) ou Elmo do Guardião.</li>
                <li><strong>Bota:</strong> Botas de Minerador (Fuga extrema em caso de desmontagem de emergência).</li>
                <li><strong>Capa:</strong> Capa de Fort Sterling (Remove automaticamente o primeiro atordoamento/stun).</li>
                <li><strong>Consumível:</strong> Poção de Invisibilidade T4/T6 + Ensopado de Carne T7 (Vida e resistência).</li>
              </ul>
            </div>

            <div class="tactical-card">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                Montarias Recomendadas para Caerleon
              </h3>
              <ul class="tactical-list">
                <li>
                  <span class="mount-name">Cavalo Blindado T5/T7:</span>
                  <span class="mount-desc">Velocidade alta, resistente a dano e difícil de desmontar. Ótimo para cargas leves e médias de alto valor (armas e equipamentos caros).</span>
                </li>
                <li>
                  <span class="mount-name">Javali Espectral T7 (Spectral Direboar):</span>
                  <span class="mount-desc">Possui invisibilidade ativa e capacidade de carga passiva (mesmo desmontado o peso não trava). A escolha de elite dos transportadores.</span>
                </li>
                <li>
                  <span class="mount-name">Urso Cinzento T7 (Grizzly Bear):</span>
                  <span class="mount-desc">Defesa absurda e passiva anti-slow que impede os gankers de te pararem. Ideal para viagens em comboio no Assalto dos Bandidos.</span>
                </li>
                <li>
                  <span class="mount-name text-danger">Boi de Transporte (Evitar se solo):</span>
                  <span class="mount-desc">Muito lento. Se desmontado, você fica com 300% de sobrecarga e morre instantaneamente. Use APENAS se estiver 100% escoltado pela guilda.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `,r(),s()}function s(){a&&clearInterval(a);const d=()=>{const p=document.getElementById("bandit-live-timer");if(!p)return;const l=V(),u=U(l.timestamp);let c;u.isLive?c=l.timestamp+w.durationMinutes*60*1e3:c=l.timestamp+w.expectedCooldownMinutes*60*1e3;const h=c-Date.now();if(h<=0&&!u.isLive){p.textContent="JANELA ABERTA (A QUALQUER SEGUNDO)",p.classList.add("imminent-pulse");return}p.classList.remove("imminent-pulse");const f=Math.max(0,Math.floor(Math.abs(h)/1e3)),E=Math.floor(f/3600),b=Math.floor(f%3600/60),g=f%60,y=i=>String(i).padStart(2,"0");p.textContent=`${y(E)}:${y(b)}:${y(g)}`};d(),a=setInterval(d,1e3)}function r(){const d=document.getElementById("btn-report-bandit-now"),p=document.getElementById("btn-report-bandit-ended"),l=document.getElementById("btn-custom-time"),u=document.getElementById("btn-test-sound");d&&d.addEventListener("click",()=>{D("start",e.selectedServer.id,Date.now()),W(),o()}),p&&p.addEventListener("click",()=>{const c=Date.now()-w.durationMinutes*60*1e3;D("end",e.selectedServer.id,c),o()}),l&&l.addEventListener("click",()=>{const c=prompt(`Há quantos minutos atrás o último Assalto dos Bandidos começou?
(Exemplo: digite 30 se começou há meia hora, ou 120 se faz 2 horas)`,"60");if(c!==null&&!isNaN(c)){const h=Math.max(0,Number(c)),f=Date.now()-h*60*1e3;D("custom",e.selectedServer.id,f),o()}}),u&&u.addEventListener("click",()=>{W()})}return o(),{destroy:()=>{a&&clearInterval(a)}}}const le=[{id:"all",name:"Todas as Categorias",icon:"layers"},{id:"weapons",name:"Armas",icon:"swords"},{id:"armor_cloth",name:"Armadura (Tecido)",icon:"shield"},{id:"armor_leather",name:"Armadura (Couro)",icon:"shield"},{id:"armor_plate",name:"Armadura (Placa)",icon:"shield"},{id:"accessories",name:"Bolsas e Capas",icon:"briefcase"},{id:"offhands",name:"Mão Secundária",icon:"shield"}],de=[{id:"BAG",namePt:"Bolsa",nameEn:"Bag",category:"accessories",weight:1.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"CAPE",namePt:"Capa Comum",nameEn:"Cape",category:"accessories",weight:1.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"MAIN_1H_SWORD",namePt:"Espada Larga",nameEn:"Broadsword",category:"weapons",weight:4.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_CLAYMORE",namePt:"Montante (Claymore)",nameEn:"Claymore",category:"weapons",weight:6,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_DUALSWORD",namePt:"Espadas Duplas",nameEn:"Dual Swords",category:"weapons",weight:5.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"MAIN_SCIMITAR_MORGANA",namePt:"Espada Entalhada (Carving)",nameEn:"Carving Sword",category:"weapons",weight:5.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"MAIN_AXE",namePt:"Machado de Batalha",nameEn:"Battleaxe",category:"weapons",weight:4.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_AXE",namePt:"Machadão",nameEn:"Greataxe",category:"weapons",weight:6.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_HALBERD",namePt:"Alabarda",nameEn:"Halberd",category:"weapons",weight:6.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_BOW",namePt:"Arco Comum",nameEn:"Bow",category:"weapons",weight:4,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_WARBOW",namePt:"Arco de Guerra",nameEn:"Warbow",category:"weapons",weight:4.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_LONGBOW",namePt:"Arco Longo",nameEn:"Longbow",category:"weapons",weight:4.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_CROSSBOW",namePt:"Besta",nameEn:"Crossbow",category:"weapons",weight:5.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"MAIN_1HCROSSBOW",namePt:"Besta Leve",nameEn:"Light Crossbow",category:"weapons",weight:4,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_REPEATINGCROSSBOW",namePt:"Lançadora de Dardos (Boltcasters)",nameEn:"Boltcasters",category:"weapons",weight:6,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"MAIN_DAGGER",namePt:"Adaga",nameEn:"Dagger",category:"weapons",weight:3.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_DAGGERPAIR",namePt:"Par de Adagas",nameEn:"Dagger Pair",category:"weapons",weight:4,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_CLAWPAIR",namePt:"Garras",nameEn:"Claws",category:"weapons",weight:4,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"MAIN_RAPIER_MORGANA",namePt:"Sanguinária (Bloodletter)",nameEn:"Bloodletter",category:"weapons",weight:4,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"MAIN_NATURESTAFF",namePt:"Cajado da Natureza",nameEn:"Nature Staff",category:"weapons",weight:4,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"MAIN_HOLYSTAFF",namePt:"Cajado Sagrado",nameEn:"Holy Staff",category:"weapons",weight:4,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"MAIN_FIRESTAFF",namePt:"Cajado Ígneo",nameEn:"Fire Staff",category:"weapons",weight:4,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"MAIN_FROSTSTAFF",namePt:"Cajado de Gelo",nameEn:"Frost Staff",category:"weapons",weight:4,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"MAIN_CURSEDSTAFF",namePt:"Cajado Amaldiçoado",nameEn:"Cursed Staff",category:"weapons",weight:4,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"MAIN_MACE",namePt:"Maça",nameEn:"Mace",category:"weapons",weight:4.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_MACE",namePt:"Maça Pesada",nameEn:"Heavy Mace",category:"weapons",weight:6.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"2H_HAMMER",namePt:"Martelo",nameEn:"Hammer",category:"weapons",weight:6.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"ARMOR_CLOTH_SET1",namePt:"Robe do Erudito",nameEn:"Scholar Robe",category:"armor_cloth",weight:5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"ARMOR_CLOTH_SET2",namePt:"Robe do Clérigo",nameEn:"Cleric Robe",category:"armor_cloth",weight:5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"ARMOR_CLOTH_SET3",namePt:"Robe do Mago",nameEn:"Mage Robe",category:"armor_cloth",weight:5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"HEAD_CLOTH_SET1",namePt:"Capuz do Erudito",nameEn:"Scholar Cowl",category:"armor_cloth",weight:2,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"HEAD_CLOTH_SET2",namePt:"Capuz do Clérigo",nameEn:"Cleric Cowl",category:"armor_cloth",weight:2,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"HEAD_CLOTH_SET3",namePt:"Capuz do Mago",nameEn:"Mage Cowl",category:"armor_cloth",weight:2,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"SHOES_CLOTH_SET1",namePt:"Sandálias do Erudito",nameEn:"Scholar Sandals",category:"armor_cloth",weight:2,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"SHOES_CLOTH_SET2",namePt:"Sandálias do Clérigo",nameEn:"Cleric Sandals",category:"armor_cloth",weight:2,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"ARMOR_LEATHER_SET1",namePt:"Jaqueta do Mercenário",nameEn:"Mercenary Jacket",category:"armor_leather",weight:6.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"ARMOR_LEATHER_SET2",namePt:"Jaqueta do Caçador",nameEn:"Hunter Jacket",category:"armor_leather",weight:6.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"ARMOR_LEATHER_SET3",namePt:"Jaqueta do Assassino",nameEn:"Assassin Jacket",category:"armor_leather",weight:6.5,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"HEAD_LEATHER_SET1",namePt:"Capuz do Mercenário",nameEn:"Mercenary Hood",category:"armor_leather",weight:2.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"HEAD_LEATHER_SET2",namePt:"Capuz do Caçador",nameEn:"Hunter Hood",category:"armor_leather",weight:2.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"HEAD_LEATHER_SET3",namePt:"Capuz do Assassino",nameEn:"Assassin Hood",category:"armor_leather",weight:2.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"SHOES_LEATHER_SET1",namePt:"Sapatos do Mercenário",nameEn:"Mercenary Shoes",category:"armor_leather",weight:2.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"SHOES_LEATHER_SET3",namePt:"Sapatos do Assassino",nameEn:"Assassin Shoes",category:"armor_leather",weight:2.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"ARMOR_PLATE_SET1",namePt:"Armadura do Soldado",nameEn:"Soldier Armor",category:"armor_plate",weight:9,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"ARMOR_PLATE_SET2",namePt:"Armadura do Cavaleiro",nameEn:"Knight Armor",category:"armor_plate",weight:9,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"ARMOR_PLATE_SET3",namePt:"Armadura do Guardião",nameEn:"Guardian Armor",category:"armor_plate",weight:9,tiers:[4,5,6,7,8],enchantments:[0,1,2,3]},{id:"HEAD_PLATE_SET1",namePt:"Elmo do Soldado",nameEn:"Soldier Helmet",category:"armor_plate",weight:3.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"HEAD_PLATE_SET2",namePt:"Elmo do Cavaleiro",nameEn:"Knight Helmet",category:"armor_plate",weight:3.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"HEAD_PLATE_SET3",namePt:"Elmo do Guardião",nameEn:"Guardian Helmet",category:"armor_plate",weight:3.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"SHOES_PLATE_SET1",namePt:"Botas do Soldado",nameEn:"Soldier Boots",category:"armor_plate",weight:3.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"SHOES_PLATE_SET2",namePt:"Botas do Cavaleiro",nameEn:"Knight Boots",category:"armor_plate",weight:3.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"OFF_SHIELD",namePt:"Escudo",nameEn:"Shield",category:"offhands",weight:3.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"OFF_TORCH",namePt:"Tocha",nameEn:"Torch",category:"offhands",weight:2,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"OFF_BOOK",namePt:"Tomo de Feitiços",nameEn:"Tome of Spells",category:"offhands",weight:2.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]},{id:"OFF_HORN_KEEPER",namePt:"Chamador da Névoa (Mistcaller)",nameEn:"Mistcaller",category:"offhands",weight:2.5,tiers:[4,5,6,7,8],enchantments:[0,1,2]}],N=[{id:1,name:"Normal",color:"#94a3b8"},{id:2,name:"Bom (Good)",color:"#38bdf8"},{id:3,name:"Excepcional (Outstanding)",color:"#4ade80"},{id:4,name:"Excelente (Excellent)",color:"#c084fc"},{id:5,name:"Obra-Prima (Masterpiece)",color:"#f59e0b"}],H=[{id:"armored_horse_t5",name:"Cavalo Blindado T5",maxLoadKg:450,speed:"Alta",safety:"Alta (Resistência a dano)",recommended:!0},{id:"ox_t5",name:"Boi de Transporte T5",maxLoadKg:1600,speed:"Lenta",safety:"Média (Perigoso se descer do boi)",recommended:!1},{id:"ox_t6",name:"Boi de Transporte T6",maxLoadKg:2400,speed:"Lenta",safety:"Média",recommended:!1},{id:"grizzly_bear",name:"Urso Cinzento T7 (Grizzly Bear)",maxLoadKg:2100,speed:"Média-Rápida",safety:"Extrema (Habilidade Anti-Slow)",recommended:!0},{id:"spectral_direboar",name:"Javali Espectral T7",maxLoadKg:1100,speed:"Muito Alta",safety:"Extrema (Invisibilidade ativa)",recommended:!0}];function J(t={}){const e=[],a=t.minTier||4,o=t.maxTier||8,s=t.category||"all";for(const r of de)if(!(s!=="all"&&r.category!==s)){for(const d of r.tiers)if(!(d<a||d>o))for(const p of r.enchantments){if(t.enchantment!==void 0&&t.enchantment!==null&&t.enchantment!=="all"&&p!==Number(t.enchantment))continue;const l=`T${d}_${r.id}`,u=p>0?`${l}@${p}`:l;e.push({fullId:u,baseId:l,tier:d,enchantment:p,namePt:p>0?`${r.namePt} T${d}.${p}`:`${r.namePt} T${d}`,nameEn:p>0?`${r.nameEn} T${d}.${p}`:`${r.nameEn} T${d}`,category:r.category,weight:r.weight*(1+d*.1)})}}return e}function X(t=!0,e="instant"){return(t?.04:.08)+(e==="order"?.025:0)}function me(t,e,a={}){const{budget:o=1e6,hasPremium:s=!0,sellMode:r="instant",originCity:d="Lymhurst",minRoi:p=0,minProfit:l=0,maxDataAgeHours:u=48,category:c="all",minTier:h=4,maxTier:f=8}=a,E=X(s,r),b=new Map,g=new Map;for(const i of t){const m=`${i.item_id}_${i.quality}`;i.city.toLowerCase()===d.toLowerCase()?b.set(m,i):i.city.toLowerCase()==="black market"&&g.set(m,i)}const y=[];for(const i of e)if(!(c!=="all"&&i.category!==c)&&!(i.tier<h||i.tier>f))for(let m=1;m<=5;m++){const n=`${i.fullId}_${m}`,A=b.get(n),M=g.get(n);if(!A||!M)continue;const T=A.sell_price_min;if(!T||T<=0)continue;const S=r==="instant"?M.buy_price_max:M.sell_price_min;if(!S||S<=0)continue;const k=r==="instant"?M.buy_price_max_date:M.sell_price_min_date,B=A.sell_price_min_date,$=K(k),v=K(B);if($>u||v>u)continue;const C=S*(1-E),L=C-T,G=L/T*100;if(L<l||G<p)continue;const z=o>=T,R=z?Math.floor(o/T):0,Y=R*T,ee=R*S,te=R*C,ae=R*L,ne=R*(i.weight||2);y.push({id:i.fullId,baseId:i.baseId,tier:i.tier,enchantment:i.enchantment,quality:m,namePt:i.namePt,nameEn:i.nameEn,category:i.category,unitWeight:i.weight,buyPrice:T,sellPrice:S,sellMode:r,taxRate:E,taxAmount:S*E,netSellPrice:C,unitProfit:L,roiPercent:G,canAfford:z,maxUnits:R,totalInvestment:Y,totalGrossReturn:ee,totalNetReturn:te,totalNetProfit:ae,totalWeightKg:ne,originDate:B,bmDate:k,originAgeHours:v,bmAgeHours:$,freshestAgeHours:Math.max(v,$)})}return y.sort((i,m)=>i.canAfford&&!m.canAfford?-1:!i.canAfford&&m.canAfford?1:i.totalNetProfit!==m.totalNetProfit?m.totalNetProfit-i.totalNetProfit:m.roiPercent-i.roiPercent),y}function K(t){if(!t||t.startsWith("0001"))return 999;const e=new Date(t+"Z");return(Date.now()-e.getTime())/(1e3*60*60)}function ue(t,e,a){let o=[],s=!1,r=[],d="",p="all",l="all",u="all",c="totalProfit";async function h(i=!1){s=!0,b();try{const m=J(),n=[...new Set(m.map(A=>A.fullId))];r=await ie(n,e.selectedCity,e.selectedServer.id),f()}catch(m){console.error("Erro ao buscar cotações do mercado:",m)}finally{s=!1,b()}}function f(){const i=J();o=me(r,i,{budget:e.budget,hasPremium:e.hasPremium,sellMode:e.sellMode,originCity:e.selectedCity,category:p,minRoi:0,minProfit:0,maxDataAgeHours:72}),E()}function E(){o.sort((i,m)=>c==="totalProfit"?i.canAfford&&!m.canAfford?-1:!i.canAfford&&m.canAfford?1:m.totalNetProfit-i.totalNetProfit:c==="unitProfit"?m.unitProfit-i.unitProfit:c==="roi"?m.roiPercent-i.roiPercent:c==="buyPrice"?i.buyPrice-m.buyPrice:c==="freshness"?i.freshestAgeHours-m.freshestAgeHours:0)}function b(){const i=(X(e.hasPremium,e.sellMode)*100).toFixed(1),m=o.filter(n=>{if(l!=="all"&&n.tier!==Number(l)||u!=="all"&&n.enchantment!==Number(u))return!1;if(!d)return!0;const A=d.toLowerCase();return n.namePt.toLowerCase().includes(A)||n.nameEn.toLowerCase().includes(A)||n.id.toLowerCase().includes(A)});t.innerHTML=`
      <div class="market-dashboard">
        <!-- Barra de Parâmetros de Investimento -->
        <div class="investment-control-panel">
          <div class="panel-header">
            <div class="header-titles">
              <h2 class="panel-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                Parâmetros de Investimento & Margem
              </h2>
              <p class="panel-sub">Defina seu capital disponível para ver o retorno exato e quantas unidades comprar</p>
            </div>
            
            <button class="btn btn-primary" id="btn-refresh-prices" ${s?"disabled":""}>
              <svg class="${s?"spin":""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              ${s?"Buscando Preços na API...":"Atualizar Cotações"}
            </button>
          </div>

          <div class="controls-grid">
            <!-- Saldo para Investir -->
            <div class="control-group budget-group">
              <label class="control-label" for="input-budget">
                Saldo Disponível para Investir (Silver):
              </label>
              <div class="input-with-symbol">
                <span class="currency-symbol">⚔️</span>
                <input 
                  type="number" 
                  id="input-budget" 
                  class="input-field" 
                  value="${e.budget}" 
                  step="50000"
                  min="1000"
                />
              </div>
              <div class="budget-presets">
                <button class="preset-pill ${e.budget===5e5?"active":""}" data-budget="500000">500k</button>
                <button class="preset-pill ${e.budget===1e6?"active":""}" data-budget="1000000">1M</button>
                <button class="preset-pill ${e.budget===25e5?"active":""}" data-budget="2500000">2.5M</button>
                <button class="preset-pill ${e.budget===5e6?"active":""}" data-budget="5000000">5M</button>
                <button class="preset-pill ${e.budget===1e7?"active":""}" data-budget="10000000">10M</button>
                <button class="preset-pill ${e.budget===25e6?"active":""}" data-budget="25000000">25M</button>
              </div>
            </div>

            <!-- Cidade de Origem & Modo de Venda -->
            <div class="control-group">
              <label class="control-label" for="select-origin-city">Comprar na Cidade:</label>
              <select id="select-origin-city" class="select-field">
                ${oe.map(n=>`
                  <option value="${n.id}" ${n.id===e.selectedCity?"selected":""}>
                    ${n.name}
                  </option>
                `).join("")}
              </select>

              <label class="control-label mt-2" for="select-sell-mode">Modo de Venda no Black Market:</label>
              <select id="select-sell-mode" class="select-field">
                <option value="instant" ${e.sellMode==="instant"?"selected":""}>
                  Venda Imediata (Buy Order) - Sem espera
                </option>
                <option value="order" ${e.sellMode==="order"?"selected":""}>
                  Ordem de Venda (Sell Order) - Maior lucro
                </option>
              </select>
            </div>

            <!-- Status Premium & Resumo de Taxa -->
            <div class="control-group tax-info-card">
              <div class="toggle-premium-box">
                <label class="checkbox-container">
                  <input type="checkbox" id="check-premium" ${e.hasPremium?"checked":""} />
                  <span class="checkmark"></span>
                  <span class="checkbox-label">Status Premium Ativo no Personagem</span>
                </label>
              </div>

              <div class="tax-summary-box">
                <div class="tax-row">
                  <span>Taxa Aplicada no BM:</span>
                  <strong class="highlight-gold">${i}%</strong>
                </div>
                <div class="tax-details">
                  ${e.sellMode==="instant"?"(4% imposto com premium / 8% sem premium. Sem taxa de montagem)":"(4% imposto + 2.5% montagem de ordem com premium)"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros Rápidos & Busca -->
        <div class="market-filters-bar">
          <div class="search-input-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              id="filter-search" 
              class="input-search" 
              placeholder="Buscar item (ex: Bolsa, Espada, Jaqueta, T4, T5...)" 
              value="${d}"
            />
          </div>

          <!-- Filtro de Categoria -->
          <div class="category-pills-row">
            ${le.map(n=>`
              <button class="filter-pill ${p===n.id?"active":""}" data-cat="${n.id}">
                ${n.name}
              </button>
            `).join("")}
          </div>

          <!-- Filtros de Tier e Ordenação -->
          <div class="filters-aux-row">
            <div class="select-inline">
              <label>Tier:</label>
              <select id="select-tier" class="select-small">
                <option value="all" ${l==="all"?"selected":""}>Todos os Tiers</option>
                <option value="4" ${l==="4"?"selected":""}>Tier 4</option>
                <option value="5" ${l==="5"?"selected":""}>Tier 5</option>
                <option value="6" ${l==="6"?"selected":""}>Tier 6</option>
                <option value="7" ${l==="7"?"selected":""}>Tier 7</option>
                <option value="8" ${l==="8"?"selected":""}>Tier 8</option>
              </select>
            </div>

            <div class="select-inline">
              <label>Encantamento:</label>
              <select id="select-ench" class="select-small">
                <option value="all" ${u==="all"?"selected":""}>Todos</option>
                <option value="0" ${u==="0"?"selected":""}>.0 Comum</option>
                <option value="1" ${u==="1"?"selected":""}>.1 Incomum</option>
                <option value="2" ${u==="2"?"selected":""}>.2 Raro</option>
                <option value="3" ${u==="3"?"selected":""}>.3 Excepcional</option>
              </select>
            </div>

            <div class="select-inline">
              <label>Ordenar Por:</label>
              <select id="select-sort" class="select-small">
                <option value="totalProfit" ${c==="totalProfit"?"selected":""}>Maior Lucro com Orçamento</option>
                <option value="unitProfit" ${c==="unitProfit"?"selected":""}>Maior Lucro por Unidade</option>
                <option value="roi" ${c==="roi"?"selected":""}>Maior Retorno (% ROI)</option>
                <option value="buyPrice" ${c==="buyPrice"?"selected":""}>Menor Preço de Compra</option>
                <option value="freshness" ${c==="freshness"?"selected":""}>Preço Mais Recente</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tabela de Oportunidades de Arbitragem -->
        <div class="table-container">
          ${s?`
            <div class="loading-state">
              <div class="spinner-large"></div>
              <h3>Consultando APIs do Albion Data Project em tempo real...</h3>
              <p>Analisando centenas de ordens em ${e.selectedCity} e no Black Market de Caerleon...</p>
            </div>
          `:m.length===0?`
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <h3>Nenhuma oportunidade lucrativa encontrada com os filtros atuais</h3>
              <p>Tente aumentar o orçamento, selecionar 'Todas as Categorias', alternar o modo de venda ou clicar em "Atualizar Cotações".</p>
            </div>
          `:`
            <table class="arbitrage-table">
              <thead>
                <tr>
                  <th>Item / Qualidade</th>
                  <th>Compra (${e.selectedCity})</th>
                  <th>Venda (${e.sellMode==="instant"?"Ordem Compra BM":"Ordem Venda BM"})</th>
                  <th>Lucro Líquido Unit.</th>
                  <th>Retorno (% ROI)</th>
                  <th class="col-budget">Com Seu Orçamento (${P(e.budget)})</th>
                  <th>Idade do Preço</th>
                  <th class="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                ${m.map((n,A)=>{const M=N.find(S=>S.id===n.quality)||N[0],T=Z(n.id,n.quality);return`
                    <tr class="item-row ${n.unitProfit>0?"profitable":"unprofitable"}">
                      <td class="cell-item">
                        <img class="item-thumb" src="${T}" alt="${n.namePt}" loading="lazy" />
                        <div class="item-info">
                          <span class="item-name">${n.namePt}</span>
                          <div class="item-badges">
                            <span class="tier-badge">T${n.tier}${n.enchantment>0?"."+n.enchantment:""}</span>
                            <span class="quality-badge" style="color: ${M.color}; border-color: ${M.color}44">
                              ${M.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td class="cell-price buy-price">
                        <span class="price-val">${P(n.buyPrice)}</span>
                        <span class="price-sub">unitário</span>
                      </td>

                      <td class="cell-price sell-price">
                        <span class="price-val">${P(n.sellPrice)}</span>
                        <span class="price-sub">Líq: ${P(n.netSellPrice)}</span>
                      </td>

                      <td class="cell-profit">
                        <span class="profit-val ${n.unitProfit>0?"positive":"negative"}">
                          ${n.unitProfit>0?"+":""}${P(n.unitProfit)}
                        </span>
                      </td>

                      <td class="cell-roi">
                        <span class="roi-val ${n.roiPercent>=30?"high-roi":n.roiPercent>0?"positive-roi":"negative-roi"}">
                          ${n.roiPercent.toFixed(1)}%
                        </span>
                      </td>

                      <td class="cell-budget-calc">
                        ${n.canAfford?`
                          <div class="budget-units">
                            <span class="units-count">Compre <strong>${n.maxUnits}x</strong></span>
                            <span class="units-cost">Custo: ${P(n.totalInvestment)}</span>
                          </div>
                          <div class="budget-profit">
                            <span class="total-profit-highlight">
                              +${P(n.totalNetProfit)}
                            </span>
                            <span class="total-weight">Peso: ${n.totalWeightKg.toFixed(1)} kg</span>
                          </div>
                        `:`
                          <span class="badge-insufficient">Custa mais que o seu saldo</span>
                        `}
                      </td>

                      <td class="cell-age">
                        <span class="age-badge ${n.freshestAgeHours<=2?"fresh":n.freshestAgeHours<=12?"medium":"old"}">
                          ${re(n.bmDate)}
                        </span>
                      </td>

                      <td class="cell-actions text-right">
                        <button class="btn-icon btn-copy-name" data-copy="${n.namePt}" title="Copiar Nome do Item para colar no jogo">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </button>
                        <button class="btn-add-cart" data-idx="${A}" title="Adicionar ao Carrinho de Transporte">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                          + Carga
                        </button>
                      </td>
                    </tr>
                  `}).join("")}
              </tbody>
            </table>
          `}
        </div>
      </div>
    `,g(m)}function g(i){const m=document.getElementById("btn-refresh-prices");m&&m.addEventListener("click",()=>h(!0));const n=document.getElementById("input-budget");n&&n.addEventListener("change",v=>{const C=Number(v.target.value);!isNaN(C)&&C>=0&&(e.budget=C,f(),b())}),document.querySelectorAll(".preset-pill").forEach(v=>{v.addEventListener("click",()=>{const C=Number(v.getAttribute("data-budget"));e.budget=C,f(),b()})});const A=document.getElementById("select-origin-city");A&&A.addEventListener("change",v=>{e.selectedCity=v.target.value,h(!0)});const M=document.getElementById("select-sell-mode");M&&M.addEventListener("change",v=>{e.sellMode=v.target.value,f(),b()});const T=document.getElementById("check-premium");T&&T.addEventListener("change",v=>{e.hasPremium=v.target.checked,f(),b()});const S=document.getElementById("filter-search");S&&S.addEventListener("input",v=>{d=v.target.value,b()}),document.querySelectorAll(".filter-pill").forEach(v=>{v.addEventListener("click",()=>{p=v.getAttribute("data-cat"),f(),b()})});const k=document.getElementById("select-tier");k&&k.addEventListener("change",v=>{l=v.target.value,b()});const B=document.getElementById("select-ench");B&&B.addEventListener("change",v=>{u=v.target.value,b()});const $=document.getElementById("select-sort");$&&$.addEventListener("change",v=>{c=v.target.value,E(),b()}),document.querySelectorAll(".btn-copy-name").forEach(v=>{v.addEventListener("click",()=>{const C=v.getAttribute("data-copy");navigator.clipboard.writeText(C).then(()=>{y(`Copiado para a área de transferência: "${C}"`)})})}),document.querySelectorAll(".btn-add-cart").forEach(v=>{v.addEventListener("click",()=>{const C=Number(v.getAttribute("data-idx")),L=i[C];L&&a&&(a(L),y(`Adicionado ao Carrinho: ${L.namePt}`))})})}function y(i){let m=document.getElementById("toast-notification");m||(m=document.createElement("div"),m.id="toast-notification",m.className="toast-notification",document.body.appendChild(m)),m.textContent=i,m.classList.add("visible"),setTimeout(()=>{m.classList.remove("visible")},3e3)}return h(),{reload:()=>h(!0)}}function pe(t,e,a){let o=e.selectedMountId||"armored_horse_t5";function s(){const d=e.cart||[],p=H.find(g=>g.id===o)||H[0];let l=0,u=0,c=0,h=0;for(const g of d){const y=g.qty||1,i=g.buyPrice||0;g.sellPrice;const m=g.netSellPrice||0,n=g.unitProfit||0,A=g.unitWeight||2;l+=y*i,u+=y*m,c+=y*n,h+=y*A}const f=l>0?c/l*100:0,E=p.maxLoadKg>0?h/p.maxLoadKg*100:0,b=E>100;t.innerHTML=`
      <div class="cart-dashboard">
        <!-- Resumo Consolidado do Transporte -->
        <div class="cart-summary-grid">
          <div class="summary-metric-card">
            <span class="metric-label">Investimento Total (Lymhurst)</span>
            <div class="metric-value text-silver">
              ${P(l)}
            </div>
            <span class="metric-sub">Prata necessária para comprar</span>
          </div>

          <div class="summary-metric-card">
            <span class="metric-label">Retorno Líquido no Black Market</span>
            <div class="metric-value text-gold">
              ${P(u)}
            </div>
            <span class="metric-sub">Já descontada taxa de ${e.hasPremium?"4%":"8%"}</span>
          </div>

          <div class="summary-metric-card highlight-profit">
            <span class="metric-label">Lucro Líquido Projetado</span>
            <div class="metric-value text-emerald">
              +${P(c)}
            </div>
            <span class="metric-sub">Retorno de +${f.toFixed(1)}% sobre o capital</span>
          </div>

          <div class="summary-metric-card ${b?"metric-danger":""}">
            <span class="metric-label">Peso Total da Carga</span>
            <div class="metric-value ${b?"text-danger":"text-cyan"}">
              ${h.toFixed(1)} kg
            </div>
            <span class="metric-sub">${E.toFixed(1)}% da montaria selecionada</span>
          </div>
        </div>

        <!-- Seletor de Montaria & Barra de Carga -->
        <div class="mount-capacity-panel">
          <div class="mount-capacity-header">
            <div class="mount-choice-box">
              <label for="select-mount" class="control-label">Sua Montaria de Transporte:</label>
              <select id="select-mount" class="select-field">
                ${H.map(g=>`
                  <option value="${g.id}" ${g.id===o?"selected":""}>
                    ${g.name} (Capacidade: ${g.maxLoadKg} kg - Segurança: ${g.safety})
                  </option>
                `).join("")}
              </select>
            </div>

            <div class="mount-spec-badges">
              <span class="badge-spec">Velocidade: <strong>${p.speed}</strong></span>
              <span class="badge-spec">Segurança: <strong>${p.safety}</strong></span>
            </div>
          </div>

          <!-- Barra de Peso -->
          <div class="weight-bar-container">
            <div class="weight-bar-track">
              <div 
                class="weight-bar-fill ${b?"bar-overburden":E>80?"bar-warning":"bar-safe"}"
                style="width: ${Math.min(100,E)}%"
              ></div>
            </div>
            <div class="weight-bar-labels">
              <span>0 kg</span>
              <span><strong>${h.toFixed(1)} kg</strong> de ${p.maxLoadKg} kg</span>
              <span>${p.maxLoadKg} kg</span>
            </div>
          </div>

          ${b?`
            <div class="overburden-alert-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <strong>SOBRECARGA DETECTADA!</strong> O peso da carga ultrapassa a capacidade máxima do ${p.name}. Se você for desmontado nas zonas vermelhas, não conseguirá correr e será morto pelos gankers! Diminua a quantidade de itens.
              </div>
            </div>
          `:""}
        </div>

        <!-- Lista de Itens no Carrinho -->
        <div class="cart-items-section">
          <div class="cart-header-row">
            <h3 class="cart-title">
              Itens no Carrinho de Carga (${d.length} tipo${d.length!==1?"s":""})
            </h3>
            <div class="cart-actions-row">
              <button class="btn btn-secondary btn-sm" id="btn-copy-checklist" ${d.length===0?"disabled":""}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Copiar Lista de Compras
              </button>
              <button class="btn btn-outline-danger btn-sm" id="btn-clear-cart" ${d.length===0?"disabled":""}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Limpar Carrinho
              </button>
            </div>
          </div>

          ${d.length===0?`
            <div class="cart-empty-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <h4>Seu carrinho de transporte está vazio</h4>
              <p>Vá até a aba <strong>"Calculadora Black Market"</strong> e clique em <strong>"+ Carga"</strong> nos itens lucrativos que deseja transportar!</p>
            </div>
          `:`
            <div class="cart-table-wrapper">
              <table class="arbitrage-table cart-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantidade</th>
                    <th>Custo Unit. (Lym)</th>
                    <th>Venda Unit. (BM)</th>
                    <th>Investimento Total</th>
                    <th>Lucro Líquido</th>
                    <th>Peso Total</th>
                    <th class="text-right">Remover</th>
                  </tr>
                </thead>
                <tbody>
                  ${d.map((g,y)=>{const i=N.find(S=>S.id===g.quality)||N[0],m=Z(g.id,g.quality),n=g.qty||1,A=n*g.buyPrice,M=n*g.unitProfit,T=n*(g.unitWeight||2);return`
                      <tr>
                        <td class="cell-item">
                          <img class="item-thumb" src="${m}" alt="${g.namePt}" />
                          <div class="item-info">
                            <span class="item-name">${g.namePt}</span>
                            <div class="item-badges">
                              <span class="tier-badge">T${g.tier}${g.enchantment>0?"."+g.enchantment:""}</span>
                              <span class="quality-badge" style="color: ${i.color}; border-color: ${i.color}44">
                                ${i.name}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td class="cell-qty">
                          <div class="qty-stepper">
                            <button class="btn-qty-minus" data-idx="${y}">-</button>
                            <input 
                              type="number" 
                              class="input-qty" 
                              data-idx="${y}" 
                              value="${n}" 
                              min="1" 
                              max="999" 
                            />
                            <button class="btn-qty-plus" data-idx="${y}">+</button>
                          </div>
                        </td>

                        <td class="cell-price">${P(g.buyPrice)}</td>
                        <td class="cell-price">${P(g.sellPrice)}</td>
                        <td class="cell-price text-silver"><strong>${P(A)}</strong></td>
                        <td class="cell-profit">
                          <span class="profit-val positive">+${P(M)}</span>
                          <span class="price-sub">(${g.roiPercent.toFixed(1)}% ROI)</span>
                        </td>
                        <td class="cell-weight">${T.toFixed(1)} kg</td>

                        <td class="text-right">
                          <button class="btn-remove-item" data-idx="${y}" title="Remover item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </td>
                      </tr>
                    `}).join("")}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `,r()}function r(){const d=document.getElementById("select-mount");d&&d.addEventListener("change",u=>{o=u.target.value,e.selectedMountId=o,s()}),document.querySelectorAll(".btn-qty-plus").forEach(u=>{u.addEventListener("click",()=>{const c=Number(u.getAttribute("data-idx"));e.cart[c]&&(e.cart[c].qty=(e.cart[c].qty||1)+1,a&&a(),s())})}),document.querySelectorAll(".btn-qty-minus").forEach(u=>{u.addEventListener("click",()=>{const c=Number(u.getAttribute("data-idx"));if(e.cart[c]){const h=e.cart[c].qty||1;h>1?e.cart[c].qty=h-1:e.cart.splice(c,1),a&&a(),s()}})}),document.querySelectorAll(".input-qty").forEach(u=>{u.addEventListener("change",c=>{const h=Number(u.getAttribute("data-idx")),f=Math.max(1,Number(c.target.value)||1);e.cart[h]&&(e.cart[h].qty=f,a&&a(),s())})}),document.querySelectorAll(".btn-remove-item").forEach(u=>{u.addEventListener("click",()=>{const c=Number(u.getAttribute("data-idx"));e.cart.splice(c,1),a&&a(),s()})});const p=document.getElementById("btn-clear-cart");p&&p.addEventListener("click",()=>{confirm("Deseja realmente limpar todos os itens do carrinho de carga?")&&(e.cart=[],a&&a(),s())});const l=document.getElementById("btn-copy-checklist");l&&l.addEventListener("click",()=>{const c=`📦 LISTA DE COMPRAS PARA CAERLEON (Origem: Lymhurst)
----------------------------------------
${e.cart.map(h=>`• ${h.qty}x ${h.namePt} (Qualidade: ${h.quality}) - Preço Lymhurst: ~${P(h.buyPrice)}`).join(`
`)}
----------------------------------------
Investimento Total: ${P(e.cart.reduce((h,f)=>h+f.qty*f.buyPrice,0))} Silver`;navigator.clipboard.writeText(c).then(()=>{alert("Lista de compras copiada para a área de transferência!")})})}return s(),{render:s}}function ge(t){t.innerHTML=`
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
  `}const x={selectedServer:O[0],selectedCity:"Lymhurst",budget:1e6,hasPremium:!0,sellMode:"instant",selectedMountId:"armored_horse_t5",cart:[],currentTab:"bandit"};let _=null;document.addEventListener("DOMContentLoaded",()=>{he(),ve(),fe(),F(),q(x.currentTab)});function he(){const t=document.getElementById("clock-utc"),e=document.getElementById("clock-local");function a(){const o=new Date;t&&(t.textContent=o.toUTCString().slice(17,25)),e&&(e.textContent=o.toLocaleTimeString("pt-BR"))}a(),setInterval(a,1e3)}function ve(){const t=document.getElementById("header-server-select");t&&t.addEventListener("change",e=>{const a=O.find(o=>o.id===e.target.value);a&&(x.selectedServer=a,q(x.currentTab))})}function fe(){document.querySelectorAll(".tab-btn").forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-tab");a&&a!==x.currentTab&&q(a)})})}function q(t){x.currentTab=t,document.querySelectorAll(".tab-btn").forEach(a=>{a.getAttribute("data-tab")===t?a.classList.add("active"):a.classList.remove("active")});const e=document.getElementById("app-view-container");e&&(_&&typeof _.destroy=="function"&&_.destroy(),e.innerHTML="",t==="bandit"?_=ce(e,x):t==="calculator"?_=ue(e,x,a=>{be(a)}):t==="cart"?_=pe(e,x,()=>{F()}):t==="guide"&&(_=ge(e)))}function be(t){const e=x.cart.find(a=>a.id===t.id&&a.quality===t.quality);e?e.qty=(e.qty||1)+1:x.cart.push({...t,qty:1}),F()}function F(){const t=document.getElementById("cart-badge-count");if(t){const e=x.cart.reduce((a,o)=>a+(o.qty||1),0);t.textContent=String(e)}}
