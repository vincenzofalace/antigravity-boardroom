// Logica applicativa principale per il Multi-Agent Boardroom Workspace

// Stato globale dell'applicazione
let state = {
  apiKey: "",
  model: "gemini-2.5-flash",
  demoMode: true,
  processingEngine: "local", // "local" (in-browser) o "gemini" (API Google)
  currentPhase: 0, // 0 = Avvio, 1-8 = Fasi operative
  activeTab: "boardroom",
  activeAgentDetails: "cmo", // Agente selezionato nella boardroom per i dettagli
  project: {
    id: "",
    name: "Nuovo Progetto",
    idea: "",
    budget: "",
    objective: "",
    type: "custom" // "custom" o "gardatech" o "ecowrap"
  },
  enabledAgents: ["cmo", "cfo", "cto", "coo", "capital", "clo", "cco", "cso", "cpo", "sourcing", "sales"], // Tutti abilitati di default
  chatHistory: [],
  contributions: {}, // Struttura: { phase: { agentKey: text } }
  orchestratorOutputs: {}, // Struttura: { phase: { text: "", questions: [] } }
  answers: {},
  brainstormHistories: {}, // Struttura: { agentKey: [ { role: 'user'|'assistant', text: string, agentText: string, ceoText: string } ] }
  requestDelay: 4500, // Tempo di attesa tra agenti in ms (default: 4.5s)
  isProcessing: false // Lock per evitare esecuzioni concorrenti
};

// Elementi DOM principali
const DOM = {
  chatMessages: document.getElementById("chat-messages"),
  chatInput: document.getElementById("chat-input"),
  btnSend: document.getElementById("btn-send"),
  statusBadge: document.getElementById("status-badge"),
  statusText: document.getElementById("status-text"),
  phaseNumber: document.getElementById("phase-number"),
  phaseTitle: document.getElementById("phase-title"),
  tabs: document.querySelectorAll(".tab-btn"),
  panes: document.querySelectorAll(".tab-pane"),
  quickChips: document.getElementById("quick-chips"),
  agentsGrid: document.getElementById("agents-grid"),
  agentDetailsModal: document.getElementById("agent-details-modal"),
  
  // Campi Configurazione
  selectEngine: document.getElementById("engine-select"),
  geminiConfigGroup: document.getElementById("gemini-config-group"),
  inputApiKey: document.getElementById("api-key-input"),
  selectModel: document.getElementById("model-select"),
  selectDelay: document.getElementById("delay-select"),
  btnSaveConfig: document.getElementById("btn-save-config"),
  
  // Pannelli di visualizzazione workspace
  leanCanvasGrid: document.getElementById("lean-canvas-grid"),
  financialCards: document.getElementById("financial-cards"),
  financialTableBody: document.getElementById("financial-table-body"),
  reportContent: document.getElementById("report-content"),
  
  // Pulsanti header
  btnReset: document.getElementById("btn-reset"),
  btnExport: document.getElementById("btn-export"),
  btnSettings: document.getElementById("btn-settings"),
  
  // Modale Impostazioni
  settingsModal: document.getElementById("settings-modal"),
  btnCloseSettings: document.getElementById("btn-close-settings"),
  checkboxAgents: document.querySelectorAll(".agent-checkbox"),

  // Elementi Gestione Storico Progetti
  btnProjectsMenu: document.getElementById("btn-projects-menu"),
  projectsDropdownMenu: document.getElementById("projects-dropdown-menu"),
  projectsListContainer: document.getElementById("projects-list-container"),
  btnNewProjectDropdown: document.getElementById("btn-new-project-dropdown"),
  btnExportProject: document.getElementById("btn-export-project"),
  btnImportProject: document.getElementById("btn-import-project"),
  importProjectFile: document.getElementById("import-project-file")
};

// Definizioni dei meta-dati degli agenti
const AGENT_METADATA = {
  cmo: { name: "CMO / Problem Evaluator", role: "Market Intelligence & Validation", color: "#6366f1", icon: "📊" },
  cfo: { name: "CFO / Finance Advisor", role: "Corporate Finance & Projections", color: "#10b981", icon: "💵" },
  cto: { name: "CTO / Technical Architect", role: "Tech, Infrastructure & Hosting", color: "#06b6d4", icon: "💻" },
  coo: { name: "COO / Operations & Quality", role: "Operations & HR Structure", color: "#f59e0b", icon: "⚙️" },
  capital: { name: "Head of Capital", role: "Fundraising & Investor Scouting", color: "#8b5cf6", icon: "📈" },
  clo: { name: "CLO / General Counsel", role: "Legal, IP & GDPR Compliance", color: "#ef4444", icon: "⚖️" },
  cco: { name: "CCO / Creative Director", role: "Branding, Storytelling & Payoff", color: "#e11d48", icon: "🎨" },
  cso: { name: "CSO / Customer Success", role: "Product-Market Fit & Retention", color: "#14b8a6", icon: "🤝" },
  cpo: { name: "CPO / Product Manager", role: "Product Specifications & MVP", color: "#f43f5e", icon: "📦" },
  sourcing: { name: "Sourcing & Procurement", role: "Suppliers, Logistics & MOQs", color: "#84cc16", icon: "🚛" },
  sales: { name: "Head of Sales & Copy", role: "Copywriting & Sales Conversion", color: "#3b82f6", icon: "🗣️" }
};

// Titoli delle 8 fasi
const PHASE_TITLES = {
  0: "Inizializzazione Progetto",
  1: "Validazione & Lean Canvas",
  2: "Analisi Target & Competitor",
  3: "Strategia Ibrida & GTM",
  4: "Growth Hack & Outreach",
  5: "Compliance & Rischi",
  6: "Piano Operativo & Tech Stack",
  7: "Piano Finanziario",
  8: "Executive Summary & Pitch"
};

// Esporta globalmente per l'uso in moduli esterni
window.AGENT_METADATA = AGENT_METADATA;
window.PHASE_TITLES = PHASE_TITLES;

// Funzione di avvio
function init() {
  loadConfigFromStorage();
  setupEventListeners();
  setupProjectsMenuListener();
  
  // Carica l'ultimo progetto attivo, altrimenti avvia da zero
  const lastActiveId = localStorage.getItem("antigravity_active_project_id");
  const allProjects = getSavedProjectsList();
  
  if (lastActiveId && allProjects[lastActiveId]) {
    loadProjectFromStorage(lastActiveId);
  } else {
    createNewProject();
  }
}

// Carica configurazione dal localStorage
function loadConfigFromStorage() {
  const savedEngine = localStorage.getItem("antigravity_processing_engine");
  const savedKey = localStorage.getItem("antigravity_api_key");
  const savedModel = localStorage.getItem("antigravity_model");
  const savedAgents = localStorage.getItem("antigravity_enabled_agents");
  const savedDelay = localStorage.getItem("antigravity_request_delay");
  
  if (savedEngine) {
    state.processingEngine = savedEngine;
  } else {
    state.processingEngine = "local"; // Default
  }
  if (DOM.selectEngine) DOM.selectEngine.value = state.processingEngine;
  
  if (DOM.geminiConfigGroup) {
    DOM.geminiConfigGroup.style.display = state.processingEngine === "gemini" ? "flex" : "none";
  }

  if (savedKey) {
    state.apiKey = savedKey;
    if (DOM.inputApiKey) DOM.inputApiKey.value = savedKey;
  }

  // Update status badge
  if (state.processingEngine === "local") {
    state.demoMode = false;
    DOM.statusBadge.classList.add("live");
    DOM.statusText.textContent = "In-Browser (Gratis)";
  } else {
    if (state.apiKey) {
      state.demoMode = false;
      DOM.statusBadge.classList.add("live");
      DOM.statusText.textContent = "Live (Gemini API)";
    } else {
      state.demoMode = true;
      DOM.statusBadge.classList.remove("live");
      DOM.statusText.textContent = "Demo / Simulatore";
    }
  }
  
  if (savedModel) {
    state.model = savedModel;
    if (DOM.selectModel) {
      const options = Array.from(DOM.selectModel.options).map(o => o.value);
      if (options.includes(savedModel)) {
        DOM.selectModel.value = savedModel;
      } else {
        DOM.selectModel.value = "custom";
        const customGroup = document.getElementById("custom-model-group");
        const customInput = document.getElementById("custom-model-input");
        if (customGroup && customInput) {
          customGroup.style.display = "flex";
          customInput.value = savedModel;
        }
      }
    }
  }
  
  if (savedAgents) {
    state.enabledAgents = JSON.parse(savedAgents);
    DOM.checkboxAgents.forEach(cb => {
      cb.checked = state.enabledAgents.includes(cb.dataset.agent);
    });
  }
  
  if (savedDelay) {
    state.requestDelay = parseInt(savedDelay, 10);
    if (DOM.selectDelay) DOM.selectDelay.value = savedDelay;
  } else {
    state.requestDelay = 4500;
    if (DOM.selectDelay) DOM.selectDelay.value = "4500";
  }
}

// Configura i listener degli eventi
function setupEventListeners() {
  // Invio messaggio chat principale
  DOM.btnSend.addEventListener("click", handleUserMessageSubmit);
  DOM.chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserMessageSubmit();
    }
  });

  // Switch Tab
  DOM.tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      DOM.tabs.forEach(t => t.classList.remove("active"));
      DOM.panes.forEach(p => p.classList.remove("active"));
      
      tab.classList.add("active");
      const targetPane = document.getElementById(tab.dataset.tab);
      if (targetPane) targetPane.classList.add("active");
      
      state.activeTab = tab.dataset.tab;
      renderTabSpecificViews();
    });
  });

  // Mostra/Nascondi Modale Impostazioni
  DOM.btnSettings.addEventListener("click", () => {
    DOM.settingsModal.classList.add("open");
  });
  
  DOM.btnCloseSettings.addEventListener("click", () => {
    DOM.settingsModal.classList.remove("open");
  });
  
  DOM.settingsModal.addEventListener("click", (e) => {
    if (e.target === DOM.settingsModal) {
      DOM.settingsModal.classList.remove("open");
    }
  });

  // Selettore del motore cambio visualizzazione
  if (DOM.selectEngine) {
    DOM.selectEngine.addEventListener("change", () => {
      if (DOM.geminiConfigGroup) {
        DOM.geminiConfigGroup.style.display = DOM.selectEngine.value === "gemini" ? "flex" : "none";
      }
    });
  }

  // Modello personalizzato toggle
  if (DOM.selectModel) {
    DOM.selectModel.addEventListener("change", () => {
      const customGroup = document.getElementById("custom-model-group");
      if (customGroup) {
        if (DOM.selectModel.value === "custom") {
          customGroup.style.display = "flex";
        } else {
          customGroup.style.display = "none";
        }
      }
    });
  }

  // Salvataggio Configurazione
  DOM.btnSaveConfig.addEventListener("click", () => {
    const engine = DOM.selectEngine.value;
    const key = DOM.inputApiKey.value.trim();
    let model = DOM.selectModel.value;
    if (model === "custom") {
      const customInput = document.getElementById("custom-model-input");
      if (customInput && customInput.value.trim()) {
        model = customInput.value.trim();
      } else {
        model = "gemini-2.5-flash"; // Fallback
      }
    }
    
    localStorage.setItem("antigravity_processing_engine", engine);
    state.processingEngine = engine;

    if (key) {
      localStorage.setItem("antigravity_api_key", key);
      state.apiKey = key;
    } else {
      localStorage.removeItem("antigravity_api_key");
      state.apiKey = "";
    }
    
    // Update badge state
    if (engine === "local") {
      state.demoMode = false;
      DOM.statusBadge.classList.add("live");
      DOM.statusText.textContent = "In-Browser (Gratis)";
    } else {
      if (state.apiKey) {
        state.demoMode = false;
        DOM.statusBadge.classList.add("live");
        DOM.statusText.textContent = "Live (Gemini API)";
      } else {
        state.demoMode = true;
        DOM.statusBadge.classList.remove("live");
        DOM.statusText.textContent = "Demo / Simulatore";
      }
    }
    
    localStorage.setItem("antigravity_model", model);
    state.model = model;
    
    if (DOM.selectDelay) {
      const delayVal = DOM.selectDelay.value;
      localStorage.setItem("antigravity_request_delay", delayVal);
      state.requestDelay = parseInt(delayVal, 10);
    }
    
    const enabled = [];
    DOM.checkboxAgents.forEach(cb => {
      if (cb.checked) enabled.push(cb.dataset.agent);
    });
    localStorage.setItem("antigravity_enabled_agents", JSON.stringify(enabled));
    state.enabledAgents = enabled;
    
    DOM.settingsModal.classList.remove("open");
    appendSystemMessage("Configurazione salvata con successo.");
    renderBoardroomGrid();
    saveCurrentProjectToStorage();
  });

  DOM.btnReset.addEventListener("click", () => {
    if (confirm("Sei sicuro di voler resettare il progetto attuale? Perderai tutti i progressi di questo specifico progetto.")) {
      resetProject();
    }
  });

  DOM.btnExport.addEventListener("click", exportFullReport);
}

// Configura i listener per la gestione dello storico progetti
function setupProjectsMenuListener() {
  DOM.btnProjectsMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    DOM.projectsDropdownMenu.classList.toggle("open");
    if (DOM.projectsDropdownMenu.classList.contains("open")) {
      renderProjectsDropdownList();
    }
  });

  document.addEventListener("click", (e) => {
    if (!DOM.projectSelectorContainer) {
      DOM.projectSelectorContainer = document.querySelector(".project-selector-container");
    }
    if (DOM.projectSelectorContainer && !DOM.projectSelectorContainer.contains(e.target)) {
      DOM.projectsDropdownMenu.classList.remove("open");
    }
  });

  DOM.btnNewProjectDropdown.addEventListener("click", () => {
    DOM.projectsDropdownMenu.classList.remove("open");
    createNewProject();
  });

  // Esporta progetto attivo in JSON
  DOM.btnExportProject.addEventListener("click", () => {
    DOM.projectsDropdownMenu.classList.remove("open");
    const activeId = state.project.id;
    const allProjects = getSavedProjectsList();
    const projData = allProjects[activeId];
    if (!projData) {
      alert("Nessun progetto attivo da esportare.");
      return;
    }
    
    const jsonString = JSON.stringify(projData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${state.project.name.toLowerCase().replace(/\s+/g, '_')}_backup.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Innesca selezione file per importazione
  DOM.btnImportProject.addEventListener("click", () => {
    DOM.projectsDropdownMenu.classList.remove("open");
    DOM.importProjectFile.click();
  });

  // Legge e importa il file JSON selezionato
  DOM.importProjectFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const importedData = JSON.parse(evt.target.result);
        if (!importedData.project || !importedData.project.id) {
          throw new Error("Formato file non valido. Manca l'oggetto project.");
        }
        
        const importedId = importedData.project.id;
        const allProjects = getSavedProjectsList();
        
        allProjects[importedId] = importedData;
        allProjects[importedId].lastModified = Date.now();
        
        saveProjectsList(allProjects);
        loadProjectFromStorage(importedId);
        appendSystemMessage(`Progetto "${importedData.project.name}" importato con successo.`);
      } catch (err) {
        alert("Errore durante l'importazione del file: " + err.message);
      }
      DOM.importProjectFile.value = "";
    };
    reader.readAsText(file);
  });
}

// ==========================================
// GESTIONE STORICO PROGETTI (MULTI-PROJECT)
// ==========================================

function getSavedProjectsList() {
  const listRaw = localStorage.getItem("antigravity_projects_list");
  return listRaw ? JSON.parse(listRaw) : {};
}

function saveProjectsList(list) {
  localStorage.setItem("antigravity_projects_list", JSON.stringify(list));
}

function createNewProject() {
  const projId = "proj_" + Date.now();
  state.project = {
    id: projId,
    name: "Nuovo Progetto " + new Date().toLocaleDateString('it-IT'),
    idea: "",
    budget: "",
    objective: "",
    type: "custom"
  };
  
  state.currentPhase = 0;
  state.chatHistory = [];
  state.contributions = {};
  state.orchestratorOutputs = {};
  state.answers = {};
  state.brainstormHistories = {};
  
  DOM.chatMessages.innerHTML = "";
  updatePhaseIndicator();
  renderBoardroomGrid();
  
  updateLeanCanvasUI();
  updateFinancialsUI();
  updateReportUI();
  
  saveCurrentProjectToStorage();
  startAppFlow();
}

function saveCurrentProjectToStorage() {
  const id = state.project.id;
  if (!id) return;
  
  // Aggiorna il nome del progetto se è stata inserita l'idea
  if (state.project.idea && state.project.name.startsWith("Nuovo Progetto")) {
    // Estrae le prime 3 parole dell'idea come nome
    const words = state.project.idea.split(/\s+/).slice(0, 3).join(" ");
    state.project.name = "Progetto: " + words + "...";
  }

  const allProjects = getSavedProjectsList();
  allProjects[id] = {
    project: state.project,
    currentPhase: state.currentPhase,
    chatHistory: state.chatHistory,
    contributions: state.contributions,
    orchestratorOutputs: state.orchestratorOutputs,
    answers: state.answers,
    brainstormHistories: state.brainstormHistories,
    enabledAgents: state.enabledAgents,
    lastModified: Date.now()
  };
  
  saveProjectsList(allProjects);
  localStorage.setItem("antigravity_active_project_id", id);
}

function loadProjectFromStorage(id) {
  const allProjects = getSavedProjectsList();
  const projData = allProjects[id];
  if (!projData) return;
  
  state.project = projData.project;
  state.currentPhase = projData.currentPhase;
  state.chatHistory = projData.chatHistory || [];
  state.contributions = projData.contributions || {};
  state.orchestratorOutputs = projData.orchestratorOutputs || {};
  state.answers = projData.answers || {};
  state.brainstormHistories = projData.brainstormHistories || {};
  state.enabledAgents = projData.enabledAgents || state.enabledAgents;
  
  localStorage.setItem("antigravity_active_project_id", id);
  
  // Ricostruisce la chat principale
  DOM.chatMessages.innerHTML = "";
  state.chatHistory.forEach(msg => {
    if (msg.role === "user") {
      const msgDiv = document.createElement("div");
      msgDiv.className = "message user";
      msgDiv.innerHTML = `<div class="avatar">U</div><div class="message-bubble">${formatMarkdown(msg.text)}</div>`;
      DOM.chatMessages.appendChild(msgDiv);
    } else {
      const msgDiv = document.createElement("div");
      msgDiv.className = "message orchestrator";
      
      let text = formatMarkdown(msg.text);
      if (msg.text.includes("RED FLAG")) {
        text = text.replace(/RED FLAG:(.*?)(?=\n\n|\n$|$)/gi, (match, p1) => {
          return `<div class="red-flag"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg><div class="red-flag-content"><h4>PUNTO CRITICO RILEVATO</h4><p>${p1.trim()}</p></div></div>`;
        });
      }
      
      msgDiv.innerHTML = `<div class="avatar">OM</div><div class="message-bubble">${text}</div>`;
      DOM.chatMessages.appendChild(msgDiv);
    }
  });
  
  updatePhaseIndicator();
  renderBoardroomGrid();
  updateWorkspaceViews();
  scrollChatToBottom();
  
  appendSystemMessage(`Caricato con successo il progetto: "${state.project.name}"`);
}

function deleteProjectFromStorage(id, event) {
  if (event) event.stopPropagation(); // Evita l'attivazione del caricamento
  
  if (confirm("Sei sicuro di voler eliminare questo progetto definitivamente?")) {
    const allProjects = getSavedProjectsList();
    delete allProjects[id];
    saveProjectsList(allProjects);
    
    // Se stavamo visualizzando il progetto eliminato, carichiamo/creiamo un altro
    const activeId = localStorage.getItem("antigravity_active_project_id");
    if (activeId === id) {
      const remainingIds = Object.keys(allProjects);
      if (remainingIds.length > 0) {
        loadProjectFromStorage(remainingIds[0]);
      } else {
        createNewProject();
      }
    } else {
      renderProjectsDropdownList();
    }
  }
}

function renderProjectsDropdownList() {
  DOM.projectsListContainer.innerHTML = "";
  const allProjects = getSavedProjectsList();
  const projectIds = Object.keys(allProjects).sort((a,b) => allProjects[b].lastModified - allProjects[a].lastModified);
  
  if (projectIds.length === 0) {
    DOM.projectsListContainer.innerHTML = `<p style="font-size:12px; color:var(--text-muted); text-align:center; padding:8px 0;">Nessun progetto salvato</p>`;
    return;
  }
  
  projectIds.forEach(id => {
    const pData = allProjects[id];
    const item = document.createElement("div");
    item.className = `projects-list-item ${state.project.id === id ? "active" : ""}`;
    
    item.innerHTML = `
      <div style="flex:1;">
        <div class="project-item-name" title="${pData.project.name}">${pData.project.name}</div>
        <div class="project-item-phase">Fase ${pData.currentPhase}</div>
      </div>
      <button class="btn-delete-project" title="Elimina Progetto">✕</button>
    `;
    
    item.addEventListener("click", () => {
      DOM.projectsDropdownMenu.classList.remove("open");
      loadProjectFromStorage(id);
    });
    
    const delBtn = item.querySelector(".btn-delete-project");
    delBtn.addEventListener("click", (e) => {
      deleteProjectFromStorage(id, e);
    });
    
    DOM.projectsListContainer.appendChild(item);
  });
}

// Resetta il progetto corrente a zero mantenendone l'identificativo
function resetProject() {
  state.currentPhase = 0;
  state.chatHistory = [];
  state.contributions = {};
  state.orchestratorOutputs = {};
  state.answers = {};
  state.brainstormHistories = {};
  
  state.project.idea = "";
  state.project.budget = "";
  state.project.objective = "";
  state.project.type = "custom";
  state.project.name = "Nuovo Progetto " + new Date().toLocaleDateString('it-IT');
  
  state.isProcessing = false;
  if (DOM.chatInput) DOM.chatInput.disabled = false;
  if (DOM.btnSend) DOM.btnSend.disabled = false;
  
  DOM.chatMessages.innerHTML = "";
  renderBoardroomGrid();
  startAppFlow();
  
  updateLeanCanvasUI();
  updateFinancialsUI();
  updateReportUI();
  
  saveCurrentProjectToStorage();
}

// Script iniziale obbligatorio
function startAppFlow() {
  state.currentPhase = 0;
  updatePhaseIndicator();
  
  const greetingText = `**Salve.**
Sono il **Senior Business Architect & Orchestratore** del tuo team.

Per iniziare ad elaborare il tuo progetto investor-ready, rispondi in modo diretto a queste tre domande:
1. **Qual è l'intuizione o l'idea di business di partenza?**
2. **Qual è il budget attuale (procediamo in puro 'Bootstrap' a budget zero o c'è un capitale iniziale)?**
3. **Qual è l'obiettivo principale a breve termine (es. validare il mercato, cercare soci operativi, presentare a investitori)?**`;

  appendOrchestratorMessage(greetingText);
  
  renderQuickChips([
    { text: "Demo: GardaTech (SaaS/IoT)", action: () => loadDemoProject("gardatech") },
    { text: "Demo: EcoWrap (Packaging Eco)", action: () => loadDemoProject("ecowrap") },
    { text: "Puro Bootstrap (0€)", action: () => setQuickInput("Budget: 0€ (Puro bootstrap).\nIdea: \nObiettivo: Validare sul mercato ed ottenere pre-ordini.") }
  ]);
}

// Carica un progetto demo pre-configurato
function loadDemoProject(projectKey) {
  const demo = window.mockProjects[projectKey];
  if (!demo) return;
  
  // Cambia il tipo di progetto conservando l'ID
  state.project.type = projectKey;
  state.project.name = demo.name;
  state.project.idea = demo.idea;
  state.project.budget = demo.budget;
  state.project.objective = demo.objective;
  
  DOM.chatMessages.innerHTML = "";
  state.chatHistory = [];
  appendUserMessage(`Voglio testare l'idea demo: "${demo.name}".\n\n1. Idea: ${demo.idea}\n2. Budget: ${demo.budget}\n3. Obiettivo: ${demo.objective}`);
  
  showTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    state.currentPhase = 1;
    updatePhaseIndicator();
    processPhaseTransition();
  }, 1000);
}

// Imposta un testo rapido nell'input
function setQuickInput(text) {
  DOM.chatInput.value = text;
  DOM.chatInput.focus();
}

// Aggiunge un messaggio dell'utente alla chat
function appendUserMessage(text) {
  state.chatHistory.push({ role: "user", text: text });
  
  const msgDiv = document.createElement("div");
  msgDiv.className = "message user";
  msgDiv.innerHTML = `
    <div class="avatar">U</div>
    <div class="message-bubble">
      ${formatMarkdown(text)}
    </div>
  `;
  DOM.chatMessages.appendChild(msgDiv);
  scrollChatToBottom();
  saveCurrentProjectToStorage();
}

// Aggiunge un messaggio dell'Orchestratore alla chat
function appendOrchestratorMessage(text) {
  state.chatHistory.push({ role: "assistant", text: text });
  
  const msgDiv = document.createElement("div");
  msgDiv.className = "message orchestrator";
  
  let formattedText = formatMarkdown(text);
  
  if (text.includes("RED FLAG")) {
    formattedText = formattedText.replace(/RED FLAG:(.*?)(?=\n\n|\n$|$)/gi, (match, p1) => {
      return `
        <div class="red-flag">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <div class="red-flag-content">
            <h4>PUNTO CRITICO RILEVATO</h4>
            <p>${p1.trim()}</p>
          </div>
        </div>
      `;
    });
  }

  msgDiv.innerHTML = `
    <div class="avatar">OM</div>
    <div class="message-bubble">
      ${formattedText}
    </div>
  `;
  DOM.chatMessages.appendChild(msgDiv);
  scrollChatToBottom();
  saveCurrentProjectToStorage();
}

// Aggiunge una notifica di sistema alla chat
function appendSystemMessage(text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message system-notice";
  msgDiv.style.alignSelf = "center";
  msgDiv.style.maxWidth = "100%";
  msgDiv.innerHTML = `
    <div style="font-size: 11px; background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border); color: var(--text-muted); padding: 4px 12px; border-radius: 12px;">
      ${text}
    </div>
  `;
  DOM.chatMessages.appendChild(msgDiv);
  scrollChatToBottom();
}

// Mostra l'indicatore di caricamento/scrittura
let typingIndicatorElem = null;
function showTypingIndicator() {
  if (typingIndicatorElem) return;
  
  typingIndicatorElem = document.createElement("div");
  typingIndicatorElem.className = "message orchestrator";
  typingIndicatorElem.innerHTML = `
    <div class="avatar">OM</div>
    <div class="message-bubble">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  DOM.chatMessages.appendChild(typingIndicatorElem);
  scrollChatToBottom();
}

function removeTypingIndicator() {
  if (typingIndicatorElem) {
    typingIndicatorElem.remove();
    typingIndicatorElem = null;
  }
}

function scrollChatToBottom() {
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

// Gestione invio messaggio dell'utente
function handleUserMessageSubmit() {
  if (state.isProcessing) return;
  const text = DOM.chatInput.value.trim();
  if (!text) return;
  
  state.isProcessing = true;
  if (DOM.chatInput) DOM.chatInput.disabled = true;
  if (DOM.btnSend) DOM.btnSend.disabled = true;
  
  DOM.chatInput.value = "";
  appendUserMessage(text);
  
  if (state.currentPhase === 0) {
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      state.project.idea = text;
      
      state.currentPhase = 1;
      updatePhaseIndicator();
      processPhaseTransition();
    }, 1200);
  } else {
    showTypingIndicator();
    
    if (!state.answers) state.answers = {};
    state.answers[state.currentPhase] = text;
    
    if (state.currentPhase < 8) {
      setTimeout(() => {
        removeTypingIndicator();
        state.currentPhase += 1;
        updatePhaseIndicator();
        processPhaseTransition(text);
      }, 1500);
    } else {
      setTimeout(() => {
        removeTypingIndicator();
        appendOrchestratorMessage(`**Il processo strategico è completo.**
Il report consolidato è ora disponibile nella scheda **Report Completo**. Puoi esportarlo in formato Markdown o stamparlo direttamente in PDF.`);
        state.isProcessing = false;
        if (DOM.chatInput) DOM.chatInput.disabled = false;
        if (DOM.btnSend) DOM.btnSend.disabled = false;
      }, 1000);
    }
  }
}

// Gestione transizione e chiamata agli agenti per la fase corrente
async function processPhaseTransition(userFeedback = "") {
  showTypingIndicator();
  renderBoardroomGrid();
  
  try {
    if (state.project.type !== "custom") {
      // MODALITÀ SIMULAZIONE / DEMO CON PROGETTI PRE-IMPOSTATI
      const demoKey = state.project.type;
      const demoData = window.mockProjects[demoKey];
      
      if (demoData && demoData.phases[state.currentPhase]) {
        const phaseData = demoData.phases[state.currentPhase];
        
        // Simula il lavoro dei sotto-agenti
        for (let agentKey of state.enabledAgents) {
          if (phaseData.agents[agentKey]) {
            setAgentStatus(agentKey, "running");
            await delay(250);
            
            if (!state.contributions[state.currentPhase]) {
              state.contributions[state.currentPhase] = {};
            }
            state.contributions[state.currentPhase][agentKey] = phaseData.agents[agentKey].content;
            setAgentStatus(agentKey, "done");
          }
        }
        
        await delay(400);
        removeTypingIndicator();
        
        state.orchestratorOutputs[state.currentPhase] = {
          text: phaseData.orchestrator.text,
          questions: phaseData.orchestrator.questions
        };
        
        appendOrchestratorMessage(phaseData.orchestrator.text);
        
        if (phaseData.orchestrator.questions && phaseData.orchestrator.questions.length > 0) {
          const chips = phaseData.orchestrator.questions.map((q, idx) => ({
            text: `Opzione ${idx+1}`,
            action: () => setQuickInput(`Riguardo la tua domanda: \n"${q}"\n\nLa mia risposta è: `)
          }));
          renderQuickChips(chips);
        }
      } else {
        removeTypingIndicator();
        appendOrchestratorMessage(`**FASE ${state.currentPhase}: ${PHASE_TITLES[state.currentPhase]}**
(Nessun dato simulato aggiuntivo per questo scenario).`);
      }
    } else if (state.processingEngine === "local") {
      // MODALITÀ LOCALE IN-BROWSER PER PROGETTI PERSONALIZZATI
      appendSystemMessage(`Analisi in-browser dei sotto-agenti per la Fase ${state.currentPhase}...`);
      
      const info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
      state.project.name = info.name; // Sincronizza il nome
      
      if (!state.contributions[state.currentPhase]) {
        state.contributions[state.currentPhase] = {};
      }
      
      for (let agentKey of state.enabledAgents) {
        setAgentStatus(agentKey, "running");
        await delay(200); // Ritardo simulato visivo per feedback ottimale
        
        const report = window.LocalAgentSimulationEngine.generateAgentReport(info, state.currentPhase, agentKey, state.answers);
        state.contributions[state.currentPhase][agentKey] = report;
        setAgentStatus(agentKey, "done");
      }
      
      await delay(300);
      removeTypingIndicator();
      
      const orchReport = window.LocalAgentSimulationEngine.generateOrchestratorReport(info, state.currentPhase, {}, state.answers);
      state.orchestratorOutputs[state.currentPhase] = {
        text: orchReport.text,
        questions: orchReport.questions
      };
      
      appendOrchestratorMessage(orchReport.text);
      
      if (orchReport.questions && orchReport.questions.length > 0) {
        const chips = orchReport.questions.map((q, idx) => ({
          text: `Opzione ${idx+1}`,
          action: () => setQuickInput(`Riguardo la tua domanda: \n"${q}"\n\nLa mia risposta è: `)
        }));
        renderQuickChips(chips);
      }
    } else {
      // MODALITÀ LIVE (CHIAMATA AI REALE CON API KEY)
      appendSystemMessage(`Contatto dei sotto-agenti per la Fase ${state.currentPhase} in corso...`);
      
      if (!state.contributions[state.currentPhase]) {
        state.contributions[state.currentPhase] = {};
      }
      
      for (let agentKey of state.enabledAgents) {
        setAgentStatus(agentKey, "running");
        
        const agentPrompt = `Siamo alla FASE ${state.currentPhase}: ${PHASE_TITLES[state.currentPhase]} del progetto "${state.project.name}".
L'idea di partenza è: ${state.project.idea}
Il budget: ${state.project.budget}
L'obiettivo: ${state.project.objective}

L'utente ha fornito questo feedback nell'ultimo step: "${userFeedback}"

Fornisci il tuo report specifico di competenza per questa fase. Scrivi in modo estremamente schematico, professionale ed investor-ready. Usa titoli e bullet-point. Massimizza l'efficacia pragmatica ed evidenzia i costi.`;
        
        try {
          const response = await window.callGeminiAPI(state.apiKey, state.model, agentKey, agentPrompt);
          state.contributions[state.currentPhase][agentKey] = response;
          setAgentStatus(agentKey, "done");
        } catch (err) {
          console.error(`Errore agente ${agentKey}:`, err);
          let extraTip = "";
          if (state.model && state.model.includes("pro")) {
            extraTip = "\n\n> [!TIP]\n> **Suggerimento di Quota**: Stai utilizzando un modello **Pro** (Gemini 2.5 Pro o 1.5 Pro). Nel piano gratuito di Google, questi modelli hanno una quota molto restrittiva di sole **50 richieste al giorno** (circa 4 analisi della boardroom). Se hai superato il limite, passa a **Gemini 2.5 Flash** nelle Impostazioni per avere una quota giornaliera molto più alta.";
          }
          state.contributions[state.currentPhase][agentKey] = `### Errore di Generazione\nImpossibile ottenere risposta dalle API Gemini: ${err.message}${extraTip}`;
          setAgentStatus(agentKey, "error");
          
          // Autoscalamento del ritardo in caso di errore di quota
          const errMsg = err.message.toLowerCase();
          if (errMsg.includes("quota") || errMsg.includes("limit") || errMsg.includes("exhausted")) {
            console.warn("Rilevato errore di quota. Incremento temporaneo del ritardo di attesa per prevenire ulteriori blocchi.");
            state.requestDelay = Math.max(state.requestDelay || 4500, 12500);
            if (DOM.selectDelay) DOM.selectDelay.value = String(state.requestDelay);
          }
        }
        
        // Pausa temporizzata per rispettare i limiti di quota di Google Gemini (Requests Per Minute)
        await delay(state.requestDelay || 4500);
      }
      
      appendSystemMessage(`Orchestratore Master sta raccogliendo i report dei sotto-agenti...`);
      
      let boardroomBrief = "";
      for (let agentKey of state.enabledAgents) {
        const metadata = AGENT_METADATA[agentKey];
        const text = state.contributions[state.currentPhase][agentKey];
        boardroomBrief += `--- REPORT DI ${metadata.name} ---\n${text}\n\n`;
      }
      
      const orchestratorPrompt = `Siamo alla FASE ${state.currentPhase}: ${PHASE_TITLES[state.currentPhase]} del progetto "${state.project.name}".
Informazioni generali:
- Idea: ${state.project.idea}
- Budget: ${state.project.budget}
- Obiettivo: ${state.project.objective}

Ecco i report appena generati dai tuoi sotto-agenti nella Boardroom:
${boardroomBrief}

Sulla base di questi report, scrivi il paragrafo del Business Plan/Piano Operativo per questa FASE. Sii critico (segnala RED FLAGS se presenti), iper-realista e orientato al ROI.
Concludi ponendo un massimo di 1-2 domande specifiche e focalizzate per consentire all'utente di definire i dettagli per la successiva FASE ${state.currentPhase + 1}.`;

      try {
        const orchestratorResponse = await window.callGeminiAPI(state.apiKey, state.model, "orchestrator", orchestratorPrompt);
        removeTypingIndicator();
        
        state.orchestratorOutputs[state.currentPhase] = {
          text: orchestratorResponse,
          questions: []
        };
        
        appendOrchestratorMessage(orchestratorResponse);
      } catch (err) {
        removeTypingIndicator();
        appendOrchestratorMessage(`**Errore dell'Orchestratore Master:** ${err.message}. Verifica la chiave API o la connessione di rete.`);
      }
    }
  } catch (error) {
    removeTypingIndicator();
    console.error("Errore generale transizione:", error);
    appendSystemMessage(`Errore di esecuzione: ${error.message}`);
  } finally {
    state.isProcessing = false;
    if (DOM.chatInput) DOM.chatInput.disabled = false;
    if (DOM.btnSend) DOM.btnSend.disabled = false;
    updateWorkspaceViews();
    saveCurrentProjectToStorage();
  }
}

// Aggiorna l'indicatore delle fasi in alto
function updatePhaseIndicator() {
  DOM.phaseNumber.textContent = state.currentPhase;
  DOM.phaseTitle.textContent = PHASE_TITLES[state.currentPhase];
}

// Imposta graficamente lo stato di un agente nella griglia
function setAgentStatus(agentKey, status) {
  const card = document.querySelector(`.agent-card[data-agent="${agentKey}"]`);
  if (!card) return;
  
  const badge = card.querySelector(".agent-status");
  if (status === "running") {
    badge.className = "agent-status running";
    badge.innerHTML = `<span class="status-dot"></span> In analisi...`;
  } else if (status === "done") {
    badge.className = "agent-status done";
    badge.innerHTML = `✅ Pronto`;
  } else if (status === "error") {
    badge.className = "agent-status error";
    badge.style.color = "var(--danger)";
    badge.innerHTML = `⚠️ Errore`;
  } else {
    badge.className = "agent-status";
    badge.innerHTML = `Attesa`;
  }
  
  // Aggiorna in tempo reale il pannello dei dettagli se l'agente aggiornato è quello attualmente selezionato
  if (state.activeAgentDetails === agentKey) {
    renderAgentDetails(agentKey);
  }
}

// Ritardo temporizzato
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Disegna la griglia degli agenti nella Boardroom
function renderBoardroomGrid() {
  DOM.agentsGrid.innerHTML = "";
  
  state.enabledAgents.forEach(key => {
    const meta = AGENT_METADATA[key];
    if (!meta) return;
    
    const card = document.createElement("div");
    card.className = `agent-card glass-panel ${state.activeAgentDetails === key ? "active" : ""}`;
    card.dataset.agent = key;
    
    card.innerHTML = `
      <div class="agent-card-header">
        <div class="agent-avatar" style="color: ${meta.color}; border: 1px solid ${meta.color}30">
          ${meta.icon}
        </div>
        <div class="agent-card-info">
          <h4>${meta.name}</h4>
          <p>${meta.role}</p>
        </div>
      </div>
      <div class="agent-status">In attesa</div>
    `;
    
    card.addEventListener("click", () => {
      document.querySelectorAll(".agent-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      state.activeAgentDetails = key;
      renderAgentDetails(key);
    });
    
    DOM.agentsGrid.appendChild(card);
  });
  
  renderAgentDetails(state.activeAgentDetails);
}

// Mostra i dettagli specifici del report di un agente e abilita il mini-brainstorming
function renderAgentDetails(agentKey) {
  const meta = AGENT_METADATA[agentKey];
  if (!meta) {
    DOM.agentDetailsModal.innerHTML = `<p style="color: var(--text-muted)">Seleziona un agente per visualizzare la sua analisi strategica.</p>`;
    return;
  }
  
  let reportContent = "";
  if (state.currentPhase > 0 && state.contributions[state.currentPhase] && state.contributions[state.currentPhase][agentKey]) {
    reportContent = state.contributions[state.currentPhase][agentKey];
  } else {
    reportContent = `*L'agente non ha ancora elaborato un report per la Fase corrente. Avanza nel Guided Interview per attivare l'analisi.*`;
  }
  
  // Costruiamo l'HTML con il report dell'agente E il box della chat di brainstorming
  DOM.agentDetailsModal.innerHTML = `
    <div class="agent-details-header">
      <div class="agent-avatar" style="font-size: 24px;">${meta.icon}</div>
      <div>
        <h3 style="color: ${meta.color}">${meta.name}</h3>
        <p style="font-size: 12px; color: var(--text-muted)">${meta.role} • Fase ${state.currentPhase}</p>
      </div>
    </div>
    <div class="agent-details-content">
      ${formatMarkdown(reportContent)}
    </div>
    
    <!-- Sezione di Brainstorming per Agente -->
    <div class="brainstorm-section">
      <h3>💬 Sessione di Brainstorming (${meta.icon} + CEO)</h3>
      <p class="brainstorm-intro">Fai domande o proponi modifiche specifiche. L'Agente e il CEO risponderanno insieme per affinare questa sezione del progetto.</p>
      
      <div class="brainstorm-chat-box" id="brainstorm-chat-box">
        <!-- I messaggi di brainstorming verranno iniettati qui -->
      </div>
      
      <div class="brainstorm-input-container">
        <input type="text" id="brainstorm-input" placeholder="Chiedi spiegazioni o proponi una modifica all'Agente...">
        <button id="btn-send-brainstorm" class="btn-send-brainstorm">Brainstorming</button>
      </div>
    </div>
  `;

  // Listener per l'invio del brainstorming
  const brainstormInput = document.getElementById("brainstorm-input");
  const btnSendBrainstorm = document.getElementById("btn-send-brainstorm");
  
  btnSendBrainstorm.addEventListener("click", () => {
    handleBrainstormSubmit(agentKey, brainstormInput.value.trim());
    brainstormInput.value = "";
  });
  
  brainstormInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleBrainstormSubmit(agentKey, brainstormInput.value.trim());
      brainstormInput.value = "";
    }
  });

  // Mostra i messaggi passati di brainstorming per questo agente se presenti
  renderBrainstormMessages(agentKey);
}

// Visualizza i messaggi della sessione di brainstorming dell'agente attivo
function renderBrainstormMessages(agentKey) {
  const chatBox = document.getElementById("brainstorm-chat-box");
  if (!chatBox) return;
  
  chatBox.innerHTML = "";
  const history = state.brainstormHistories[agentKey] || [];
  
  if (history.length === 0) {
    chatBox.innerHTML = `<p style="font-size: 11px; color: var(--text-dark); text-align: center; padding: 12px 0; font-style: italic;">Avvia la sessione inviando una domanda qui sopra.</p>`;
    return;
  }
  
  history.forEach(msg => {
    if (msg.role === "user") {
      const msgDiv = document.createElement("div");
      msgDiv.className = "brainstorm-msg user";
      msgDiv.innerHTML = `
        <span class="brainstorm-msg-sender">Tu</span>
        <div class="brainstorm-msg-bubble">${formatMarkdown(msg.text)}</div>
      `;
      chatBox.appendChild(msgDiv);
    } else {
      // Risposta dell'Agente
      const agentDiv = document.createElement("div");
      agentDiv.className = "brainstorm-msg agent";
      agentDiv.innerHTML = `
        <span class="brainstorm-msg-sender">${AGENT_METADATA[agentKey].name}</span>
        <div class="brainstorm-msg-bubble" style="border-color: ${AGENT_METADATA[agentKey].color}">${formatMarkdown(msg.agentText)}</div>
      `;
      chatBox.appendChild(agentDiv);
      
      // Risposta del CEO (Orchestratore)
      const ceoDiv = document.createElement("div");
      ceoDiv.className = "brainstorm-msg ceo";
      ceoDiv.innerHTML = `
        <span class="brainstorm-msg-sender">Orchestratore Master (CEO)</span>
        <div class="brainstorm-msg-bubble">${formatMarkdown(msg.ceoText)}</div>
      `;
      chatBox.appendChild(ceoDiv);
    }
  });
  
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Invia ed elabora il messaggio di brainstorming
async function handleBrainstormSubmit(agentKey, message) {
  if (!message) return;
  
  const chatBox = document.getElementById("brainstorm-chat-box");
  if (!chatBox) return;
  
  if (!state.brainstormHistories[agentKey]) {
    state.brainstormHistories[agentKey] = [];
  }
  
  // Aggiungi e renderizza messaggio utente
  state.brainstormHistories[agentKey].push({ role: "user", text: message });
  renderBrainstormMessages(agentKey);
  
  // Mostra loader temporaneo nel box di brainstorming
  const loader = document.createElement("div");
  loader.className = "brainstorm-msg agent";
  loader.innerHTML = `
    <span class="brainstorm-msg-sender">Consiglio di Amministrazione...</span>
    <div class="brainstorm-msg-bubble">
      <div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
    </div>
  `;
  chatBox.appendChild(loader);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  try {
    let agentResponse = "";
    let ceoResponse = "";
    
    if (state.project.type !== "custom") {
      // MODALITÀ SIMULAZIONE / DEMO CON PROGETTI PRE-IMPOSTATI
      await delay(1000);
      
      const meta = AGENT_METADATA[agentKey];
      
      // Generatore intelligente di risposte demo basato su parole chiave
      const query = message.toLowerCase();
      if (query.includes("costo") || query.includes("prezzo") || query.includes("soldi") || query.includes("budget")) {
        agentResponse = `### Valutazione Economica (${meta.name})\n- Modificare la struttura dei costi per assecondare la tua proposta è fattibile.\n- Ridurremo le stime allocando risorse alternative e sfruttando contratti pay-per-use.\n- Stima aggiornata: risparmio immediato ipotizzabile del 15% sul costo della voce.`;
        ceoResponse = `### Analisi CEO (Orchestratore Master)\n- Ottimo. La riduzione del costo allinea maggiormente il progetto alle logiche di bootstrap a budget zero.\n- **Azione**: Autorizzo la revisione del budget. Procediamo senza esitazioni.`;
      } else if (query.includes("tecnologia") || query.includes("software") || query.includes("codice") || query.includes("app")) {
        agentResponse = `### Valutazione Tecnica (${meta.name})\n- La tua proposta di integrazione/stack semplifica lo sviluppo.\n- Utilizzando API standard open-source o librerie low-code eviteremo refactoring complessi.\n- Tempo di rilascio stimato ridotto di circa 5 giorni lavorativi.`;
        ceoResponse = `### Analisi CEO (Orchestratore Master)\n- **RED FLAG**: Ricorda che ogni integrazione aggiuntiva aumenta il debito tecnico iniziale. Mantieni il focus sull'MVP essenziale.\n- Comunque, se riduce il time-to-market del 10%, procediamo con questa modifica nello stack.`;
      } else {
        // Fallback generico
        agentResponse = `### Analisi Dettagliata (${meta.name})\n- Ho esaminato la tua proposta di ottimizzazione per questa sezione.\n- La modifica suggerita è coerente con la nostra pianificazione per la Fase ${state.currentPhase} e verrà integrata nelle specifiche operative.`;
        ceoResponse = `### Analisi CEO (Orchestratore Master)\n- Concordo con le considerazioni dell'agente. Questa iterazione incrementa il valore della nostra Value Proposition riducendo i rischi operativi.`;
      }
    } else if (state.processingEngine === "local") {
      // MODALITÀ LOCALE IN-BROWSER
      await delay(700);
      
      const info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
      const currentReport = state.contributions[state.currentPhase]?.[agentKey] || "";
      const response = window.LocalAgentSimulationEngine.handleBrainstorm(info, agentKey, currentReport, message, state.brainstormHistories[agentKey].slice(0, -1));
      
      agentResponse = response.agentText;
      ceoResponse = response.ceoText;
    } else {
      // MODALITÀ LIVE (CHIAMATA AI REALE CON API KEY)
      const currentReport = state.contributions[state.currentPhase]?.[agentKey] || "Nessun report generato.";
      const response = await window.callGeminiBrainstorm(
        state.apiKey,
        state.model,
        agentKey,
        AGENT_METADATA[agentKey].name,
        currentReport,
        message,
        state.brainstormHistories[agentKey].slice(0, -1), // Esclude l'ultimo messaggio appena inserito
        state.project
      );
      
      agentResponse = response.agentText;
      ceoResponse = response.ceoText;
    }
    
    // Rimuove il loader
    loader.remove();
    
    // Salva le risposte generate nello storico
    state.brainstormHistories[agentKey].push({
      role: "assistant",
      agentText: agentResponse,
      ceoText: ceoResponse
    });
    
    // Re-renderizza
    renderBrainstormMessages(agentKey);
    
    // Aggiorna il report consolidato in base alla decisione presa nel brainstorming (opzionale/visivo)
    // Per semplicità visiva, mostriamo la conversazione nel log del brainstorming.
    
    saveCurrentProjectToStorage();
    
  } catch (err) {
    loader.remove();
    console.error("Errore brainstorming:", err);
    const errDiv = document.createElement("div");
    errDiv.className = "brainstorm-msg agent";
    errDiv.innerHTML = `
      <span class="brainstorm-msg-sender">Errore</span>
      <div class="brainstorm-msg-bubble" style="color:var(--danger); border-color:var(--danger)">Impossibile connettersi alle API: ${err.message}</div>
    `;
    chatBox.appendChild(errDiv);
  }
}

// Disegna chips per risposte rapide sotto la chat
function renderQuickChips(chips) {
  DOM.quickChips.innerHTML = "";
  chips.forEach(chip => {
    const chipBtn = document.createElement("button");
    chipBtn.className = "chip";
    chipBtn.textContent = chip.text;
    chipBtn.addEventListener("click", chip.action);
    DOM.quickChips.appendChild(chipBtn);
  });
}

// Aggiorna le viste in base al tab selezionato
function renderTabSpecificViews() {
  if (state.activeTab === "boardroom") {
    renderBoardroomGrid();
  } else if (state.activeTab === "canvas") {
    updateLeanCanvasUI();
  } else if (state.activeTab === "financials") {
    updateFinancialsUI();
  } else if (state.activeTab === "report") {
    updateReportUI();
  }
}

// Aggiorna tutte le viste del workspace
function updateWorkspaceViews() {
  updateLeanCanvasUI();
  updateFinancialsUI();
  updateReportUI();
  renderAgentDetails(state.activeAgentDetails);
}

// Riempie il tab Lean Canvas con le informazioni dei report degli agenti
function updateLeanCanvasUI() {
  const getBoxContent = (phase, agentKey, defaultValue = "In attesa di elaborazione...") => {
    if (state.contributions[phase] && state.contributions[phase][agentKey]) {
      return formatMarkdown(state.contributions[phase][agentKey]);
    }
    return `<span style="color: var(--text-dark)">${defaultValue}</span>`;
  };

  DOM.leanCanvasGrid.querySelector(".canvas-problem .canvas-box-content").innerHTML = getBoxContent(1, "cmo", "Definisci il problema principale...");
  DOM.leanCanvasGrid.querySelector(".canvas-solution .canvas-box-content").innerHTML = getBoxContent(1, "cpo", "Descrivi il Minimum Viable Product (CPO)...");
  DOM.leanCanvasGrid.querySelector(".canvas-key-metrics .canvas-box-content").innerHTML = getBoxContent(2, "cso", "Metriche chiave e retention (CSO)...");
  DOM.leanCanvasGrid.querySelector(".canvas-uvp .canvas-box-content").innerHTML = getBoxContent(1, "cco", "Definisci la Value Proposition (CCO)...");
  DOM.leanCanvasGrid.querySelector(".canvas-unfair-advantage .canvas-box-content").innerHTML = getBoxContent(1, "cmo", "Vantaggio competitivo (CMO)...");
  DOM.leanCanvasGrid.querySelector(".canvas-channels .canvas-box-content").innerHTML = getBoxContent(3, "sales", "Strategia e script di vendita (Sales)...");
  DOM.leanCanvasGrid.querySelector(".canvas-customer-segments .canvas-box-content").innerHTML = getBoxContent(2, "cmo", "Segmento target e interviste (CMO)...");
  
  document.getElementById("box-costs").innerHTML = getBoxContent(6, "sourcing", "Struttura costi e forniture (Sourcing)...");
  document.getElementById("box-revenue").innerHTML = getBoxContent(1, "cfo", "Modello finanziario e tariffe (CFO)...");
}

// Riempie il tab finanziario (Spreadsheet CFO)
function updateFinancialsUI() {
  DOM.financialTableBody.innerHTML = "";
  
  if (state.currentPhase >= 1 || state.project.type !== "custom") {
    const demoKey = state.project.type === "custom" ? "gardatech" : state.project.type;
    
    if (state.project.type === "custom") {
      const info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
      const fin = window.LocalAgentSimulationEngine.generateFinancials(info);
      
      document.getElementById("fin-capex").textContent = fin.capex;
      document.getElementById("fin-opex").textContent = fin.opex;
      document.getElementById("fin-break-even").textContent = fin.bep;
      
      fin.rows.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${r.item}</strong></td>
          <td><span class="chip" style="background: ${r.type === "CAPEX" ? "rgba(99,102,241,0.1); color:#6366f1" : "rgba(16,185,129,0.1); color:#10b981"}">${r.type}</span></td>
          <td><span style="font-family: monospace; font-weight: bold">${r.cost}</span></td>
          <td style="color: var(--text-muted)">${r.source}</td>
        `;
        DOM.financialTableBody.appendChild(tr);
      });
    } else if (demoKey === "gardatech") {
      document.getElementById("fin-capex").textContent = "1.950 €";
      document.getElementById("fin-opex").textContent = "175 € / mese";
      document.getElementById("fin-break-even").textContent = "12 Appartamenti";
      
      const rows = [
        { item: "Kit Serratura Nuki Smart Lock", type: "CAPEX", cost: "80.00 € / unità", source: "Sourcing B2B (20% sconto distributore)" },
        { item: "Sensori Finestre Xiaomi Zigbee", type: "CAPEX", cost: "12.00 € / unità", source: "Sourcing all'ingrosso (Cina)" },
        { item: "Trasmettitore IR Broadlink RM4 Mini", type: "CAPEX", cost: "16.50 € / alloggio", source: "AliExpress (Sourcing quantitativo)" },
        { item: "Integrazione Automazioni Make.com", type: "OPEX", cost: "9.00 € / mese", source: "Costi operativi (Make Pro)" },
        { item: "Notifiche SMS ed Alert Twilio", type: "OPEX", cost: "15.00 € / mese", source: "Costi operativi (Twilio API)" },
        { item: "Assicurazione RC Prodotti & Danni", type: "OPEX", cost: "37.50 € / mese", source: "Consulenza Allianz (Stima)" },
        { item: "Consulenza Legale Privacy GDPR & Marchi", type: "CAPEX", cost: "600.00 € (Una tantum)", source: "Studio CLO partner" }
      ];
      
      rows.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${r.item}</strong></td>
          <td><span class="chip" style="background: ${r.type === "CAPEX" ? "rgba(99,102,241,0.1); color:#6366f1" : "rgba(16,185,129,0.1); color:#10b981"}">${r.type}</span></td>
          <td><span style="font-family: monospace; font-weight: bold">${r.cost}</span></td>
          <td style="color: var(--text-muted)">${r.source}</td>
        `;
        DOM.financialTableBody.appendChild(tr);
      });
    } else if (demoKey === "ecowrap") {
      document.getElementById("fin-capex").textContent = "600 €";
      document.getElementById("fin-opex").textContent = "29 € / mese";
      document.getElementById("fin-break-even").textContent = "3 Lotti (750 scatole)";
      
      const rows = [
        { item: "Fornitura Minima Scatole (Terzista)", type: "CAPEX", cost: "200.00 € / lotto", source: "Sourcing scatolificio Emilia (Favini Crush)" },
        { item: "Abbonamento Landing Page Carrd.co", type: "OPEX", cost: "1.50 € / mese", source: "Sito Carrd.co (Piano Pro 19$/anno)" },
        { item: "Commissioni Gateway Stripe", type: "OPEX", cost: "1.4% + 0.25€ / trans.", source: "Stripe pricing" },
        { item: "Certificazione conformità MOCA per alimenti", type: "CAPEX", cost: "400.00 € (Una tantum)", source: "Ente Certificatore partner CLO" }
      ];
      
      rows.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${r.item}</strong></td>
          <td><span class="chip" style="background: ${r.type === "CAPEX" ? "rgba(99,102,241,0.1); color:#6366f1" : "rgba(16,185,129,0.1); color:#10b981"}">${r.type}</span></td>
          <td><span style="font-family: monospace; font-weight: bold">${r.cost}</span></td>
          <td style="color: var(--text-muted)">${r.source}</td>
        `;
        DOM.financialTableBody.appendChild(tr);
      });
    }
  } else {
    document.getElementById("fin-capex").textContent = "-";
    document.getElementById("fin-opex").textContent = "-";
    document.getElementById("fin-break-even").textContent = "-";
    DOM.financialTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted)">Il piano finanziario dettagliato sarà visibile a partire dalla FASE 1.</td></tr>`;
  }
}

// Genera e compila il report markdown consolidato
function updateReportUI() {
  if (state.currentPhase === 0) {
    DOM.reportContent.innerHTML = `<p style="color: var(--text-muted); text-align: center;">Inizia l'intervista guidata con l'Orchestratore per generare il report strategico.</p>`;
    return;
  }
  
  let markdown = `# Report Strategico Investor-Ready: ${state.project.name}\n\n`;
  markdown += `*Generato da Google Antigravity - Multi-Agent Boardroom Suite*\n`;
  markdown += `*Data di Elaborazione: ${new Date().toLocaleDateString('it-IT')}*\n\n`;
  markdown += `## INTUIZIONE & OBIETTIVI DI PARTENZA\n`;
  markdown += `- **Idea di Business**: ${state.project.idea || "Non specificata"}\n`;
  markdown += `- **Capitale Disponibile**: ${state.project.budget || "Bootstrap"}\n`;
  markdown += `- **Milestone a Breve Termine**: ${state.project.objective || "Validazione"}\n\n`;
  
  for (let phaseNum = 1; phaseNum <= state.currentPhase; phaseNum++) {
    markdown += `\n# FASE ${phaseNum}: ${PHASE_TITLES[phaseNum].toUpperCase()}\n\n`;
    
    if (state.orchestratorOutputs[phaseNum]) {
      markdown += `## Sintesi dell'Orchestratore Master\n`;
      markdown += `${state.orchestratorOutputs[phaseNum].text}\n\n`;
    }
    
    markdown += `## Rapporti Analitici della Boardroom\n`;
    state.enabledAgents.forEach(agentKey => {
      if (state.contributions[phaseNum] && state.contributions[phaseNum][agentKey]) {
        const meta = AGENT_METADATA[agentKey];
        markdown += `### ${meta.name} (${meta.role})\n`;
        markdown += `${state.contributions[phaseNum][agentKey]}\n\n`;
      }
    });
    
    markdown += `***\n`;
  }
  
  DOM.reportContent.innerHTML = formatMarkdown(markdown);
  DOM.reportContent.dataset.rawMarkdown = markdown;
}

// Esportazione del report in Markdown
function exportFullReport() {
  const markdownText = DOM.reportContent.dataset.rawMarkdown;
  if (!markdownText) {
    alert("Nessun report generato da esportare al momento.");
    return;
  }
  
  const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${state.project.name.toLowerCase().replace(/\s+/g, '_')}_business_plan.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Parser Markdown semplice e sicuro
function formatMarkdown(text) {
  if (!text) return "";
  
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");
  html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
  html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  
  html = html.replace(/^[-\*]\s+(.*?)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*?<\/li>)+/g, "<ul>$&</ul>");
  
  html = html.replace(/^---$/gm, "<hr>");
  html = html.replace(/\n/g, "<br>");
  
  html = html.replace(/<\/ul><br>/g, "</ul>");
  html = html.replace(/<br><ul>/g, "<ul>");
  
  return html;
}

// Avvia l'inizializzazione al caricamento del DOM
document.addEventListener("DOMContentLoaded", init);
