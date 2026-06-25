// Logica applicativa principale per il Multi-Agent Boardroom Workspace

// Wrapper per un utilizzo sicuro e resiliente del localStorage (previene crash in navigazione privata o in caso di spazio esaurito)
const SafeStorage = {
  memoryStorage: {},
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Errore lettura per chiave "${key}", uso fallback in memoria:`, e);
      return this.memoryStorage[key] || null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error(`[SafeStorage] Errore scrittura per chiave "${key}", uso fallback in memoria:`, e);
      this.memoryStorage[key] = String(value);
      
      // Se è un errore di quota, avvisa l'utente in modo visibile e non distruttivo
      if (e.name === 'QuotaExceededError' || e.code === 22 || e.number === 0x8007000E) {
        setTimeout(() => {
          if (typeof appendSystemMessage === 'function') {
            appendSystemMessage("⚠️ **Spazio Browser Esaurito!** Il progetto attuale è conservato in memoria temporanea. Consigliamo di eliminare vecchi progetti per liberare spazio.");
          }
        }, 1000);
      }
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`[SafeStorage] Errore rimozione per chiave "${key}":`, e);
      delete this.memoryStorage[key];
    }
  }
};

// Stato globale dell'applicazione
let state = {
  apiKey: "",
  model: "gemini-3.5-flash",
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
    type: "custom", // "custom" o "gardatech" o "ecowrap"
    attachedFile: null,  // { name, type, size, content }
    attachedImage: null  // { mimeType, data }
  },
  enabledAgents: ["cmo", "cfo", "cto", "coo", "capital", "clo", "cco", "cso", "cpo", "sourcing", "sales"], // Tutti abilitati di default
  chatHistory: [],
  contributions: {}, // Struttura: { phase: { agentKey: text } }
  orchestratorOutputs: {}, // Struttura: { phase: { text: "", questions: [] } }
  answers: {},
  brainstormHistories: {}, // Struttura: { agentKey: [ { role: 'user'|'assistant', text: string, agentText: string, ceoText: string } ] }
  financialOption: "acquisto", // opzione finanziaria attiva: acquisto, leasing, jv
  financialOverrides: {}, // overrides di prezzo, affitto, ecc.
  financialsChatHistory: [], // cronologia chat finanziaria
  globalChatHistory: [], // cronologia chat globale Consiglio di Amministrazione
  isApproved: false, // flag di approvazione finale del progetto
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
  importProjectFile: document.getElementById("import-project-file"),
  
  // Elementi Form & Allegati Nuovi
  starterForm: document.getElementById("starter-form"),
  btnAttach: document.getElementById("btn-attach"),
  attachmentFileInput: document.getElementById("attachment-file-input"),
  attachmentBadgeContainer: document.getElementById("attachment-badge-container")
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
  const lastActiveId = SafeStorage.getItem("antigravity_active_project_id");
  const allProjects = getSavedProjectsList();
  
  if (lastActiveId && allProjects[lastActiveId]) {
    loadProjectFromStorage(lastActiveId);
  } else {
    createNewProject();
  }
}

// Carica configurazione dal localStorage
function loadConfigFromStorage() {
  const savedEngine = SafeStorage.getItem("antigravity_processing_engine");
  const savedKey = SafeStorage.getItem("antigravity_api_key");
  const savedModel = SafeStorage.getItem("antigravity_model");
  const savedAgents = SafeStorage.getItem("antigravity_enabled_agents");
  const savedDelay = SafeStorage.getItem("antigravity_request_delay");
  
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
    const loadedAgents = JSON.parse(savedAgents);
    state.enabledAgents = loadedAgents;
    // Auto-enable any new agents defined in AGENT_METADATA that might be missing from outdated local storage
    Object.keys(AGENT_METADATA).forEach(key => {
      if (!state.enabledAgents.includes(key)) {
        state.enabledAgents.push(key);
      }
    });
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
        model = "gemini-3.5-flash"; // Fallback
      }
    }
    
    SafeStorage.setItem("antigravity_processing_engine", engine);
    state.processingEngine = engine;

    if (key) {
      SafeStorage.setItem("antigravity_api_key", key);
      state.apiKey = key;
    } else {
      SafeStorage.removeItem("antigravity_api_key");
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
    
    SafeStorage.setItem("antigravity_model", model);
    state.model = model;
    
    if (DOM.selectDelay) {
      const delayVal = DOM.selectDelay.value;
      SafeStorage.setItem("antigravity_request_delay", delayVal);
      state.requestDelay = parseInt(delayVal, 10);
    }
    
    const enabled = [];
    DOM.checkboxAgents.forEach(cb => {
      if (cb.checked) enabled.push(cb.dataset.agent);
    });
    SafeStorage.setItem("antigravity_enabled_agents", JSON.stringify(enabled));
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

  // Nuovi listener per form di avvio ed allegati
  if (DOM.btnAttach && DOM.attachmentFileInput) {
    DOM.btnAttach.addEventListener("click", () => {
      DOM.attachmentFileInput.click();
    });
    DOM.attachmentFileInput.addEventListener("change", handleFileAttachment);
  }
  
  if (DOM.starterForm) {
    DOM.starterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const projName = document.getElementById("form-project-name").value.trim();
      const projIdea = document.getElementById("form-project-idea").value.trim();
      const projBudget = document.getElementById("form-project-budget").value.trim();
      const projLocation = document.getElementById("form-project-location").value.trim();
      const projObjective = document.getElementById("form-project-objective").value.trim();
      const projNotes = document.getElementById("form-project-notes").value.trim();
      
      state.project.name = projName;
      state.project.budget = projBudget;
      state.project.objective = projObjective;
      state.project.type = "custom";
      
      let fullIdeaText = projIdea;
      if (projLocation) {
        fullIdeaText += `\n\nLocalità specificata: ${projLocation}`;
      }
      if (projNotes) {
        fullIdeaText += `\n\nNote aggiuntive ed informazioni di competitor:\n${projNotes}`;
      }
      state.project.idea = fullIdeaText;
      
      state.project.attachedFile = null;
      state.project.attachedImage = null;
      updateAttachmentBadgeUI();
      
      appendUserMessage(`🚀 Progetto avviato tramite form: **${projName}**\n- **Idea**: ${projIdea}\n- **Budget**: ${projBudget}\n- **Località**: ${projLocation || "Non specificata (consigliata Gran Canaria)"}\n- **Obiettivo**: ${projObjective}\n${projNotes ? `- **Note aggiuntive**: ${projNotes}` : ""}`);
      
      state.currentPhase = 1;
      togglePhase0View();
      updatePhaseIndicator();
      processPhaseTransition();
    });
  }

  DOM.btnExport.addEventListener("click", exportFullReport);

  // Cambia opzione finanziaria al click dei chip
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".fin-option-btn");
    if (btn) {
      const option = btn.dataset.option;
      if (option && option !== state.financialOption) {
        state.financialOption = option;
        if (state.project) {
          state.project.financialOption = option;
          state.project.hasLeasingOption = (option === "leasing");
        }
        updateFinancialsUI();
        saveCurrentProjectToStorage();
        addFinancialsSystemMessage(option);
      }
    }
  });

  // Listener per l'invio della chat finanziaria
  const btnSendFinancials = document.getElementById("btn-send-financials");
  const financialsInput = document.getElementById("financials-input");
  if (btnSendFinancials && financialsInput) {
    btnSendFinancials.addEventListener("click", () => {
      handleFinancialsChatSubmit(financialsInput.value.trim());
      financialsInput.value = "";
    });
    financialsInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleFinancialsChatSubmit(financialsInput.value.trim());
        financialsInput.value = "";
      }
    });
  }

  // Listener per l'invio della chat globale del Consiglio (Report pane)
  const btnSendGlobalChat = document.getElementById("btn-send-global-chat");
  const globalChatInput = document.getElementById("global-chat-input");
  if (btnSendGlobalChat && globalChatInput) {
    btnSendGlobalChat.addEventListener("click", () => {
      handleGlobalChatSubmit(globalChatInput.value.trim());
    });
    globalChatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleGlobalChatSubmit(globalChatInput.value.trim());
      }
    });
  }

  // Listener per i bottoni di approvazione finale
  const btnApproveHeader = document.getElementById("btn-final-approval");
  const btnApproveReport = document.getElementById("btn-final-approval-report");
  if (btnApproveHeader) {
    btnApproveHeader.addEventListener("click", approveAndExportProject);
  }
  if (btnApproveReport) {
    btnApproveReport.addEventListener("click", approveAndExportProject);
  }

  // Listener per aggiungere soci nel Cap Table
  const btnAddShareholder = document.getElementById("btn-add-shareholder");
  if (btnAddShareholder) {
    btnAddShareholder.addEventListener("click", () => {
      const nameInput = document.getElementById("cap-name-input");
      const sharesInput = document.getElementById("cap-shares-input");
      if (!nameInput || !sharesInput) return;
      
      const name = nameInput.value.trim();
      const shares = parseInt(sharesInput.value, 10);
      
      if (!name || isNaN(shares) || shares <= 0) {
        alert("Inserisci un nome valido e un numero positivo di azioni.");
        return;
      }
      
      if (!state.shareholders) state.shareholders = [];
      state.shareholders.push({ name, shares });
      nameInput.value = "";
      sharesInput.value = "";
      
      saveCurrentProjectToStorage();
      updateEquityUI();
    });
  }

  // Listener per il simulatore SAFE
  const safeInvestmentInput = document.getElementById("safe-investment");
  const safeCapInput = document.getElementById("safe-cap");
  if (safeInvestmentInput && safeCapInput) {
    safeInvestmentInput.addEventListener("input", () => {
      updateSafeSimulation();
      if (state.activeTab === "equity") {
        updatePitchDeckUI();
      }
    });
    safeCapInput.addEventListener("input", () => {
      updateSafeSimulation();
      updateEquityUI(); // ricalcola i valori stimati dei soci
    });
  }

  // Listener per la stima TAM-SAM-SOM
  const inputTam = document.getElementById("input-tam");
  const inputSam = document.getElementById("input-sam");
  const inputSom = document.getElementById("input-som");
  if (inputTam && inputSam && inputSom) {
    const handleSizingInput = () => {
      state.tamSamSom = {
        tam: parseFloat(inputTam.value) || 0,
        sam: parseFloat(inputSam.value) || 0,
        som: parseFloat(inputSom.value) || 0
      };
      saveCurrentProjectToStorage();
      updateMarketSizingUI();
      if (state.activeTab === "equity") {
        updatePitchDeckUI();
      }
    };
    inputTam.addEventListener("input", handleSizingInput);
    inputSam.addEventListener("input", handleSizingInput);
    inputSom.addEventListener("input", handleSizingInput);
  }

  // Listener per aggiungere ruoli di assunzione
  const btnAddHire = document.getElementById("btn-add-hire");
  if (btnAddHire) {
    btnAddHire.addEventListener("click", () => {
      const roleInput = document.getElementById("hire-role-input");
      const salaryInput = document.getElementById("hire-salary-input");
      const equityInput = document.getElementById("hire-equity-input");
      const timelineSelect = document.getElementById("hire-timeline-select");
      if (!roleInput || !salaryInput || !equityInput || !timelineSelect) return;
      
      const role = roleInput.value.trim();
      const salary = parseFloat(salaryInput.value) || 0;
      const equity = parseFloat(equityInput.value) || 0;
      const timeline = timelineSelect.value;
      
      if (!role || salary <= 0 || equity < 0) {
        alert("Inserisci un ruolo valido, una RAL positiva e una quota % valida.");
        return;
      }
      
      if (!state.project.hires) state.project.hires = [];
      state.project.hires.push({ role, salary, equity, timeline });
      
      roleInput.value = "";
      salaryInput.value = "";
      equityInput.value = "";
      
      saveCurrentProjectToStorage();
      updateEquityUI();
    });
  }
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
  const listRaw = SafeStorage.getItem("antigravity_projects_list");
  return listRaw ? JSON.parse(listRaw) : {};
}

function saveProjectsList(list) {
  SafeStorage.setItem("antigravity_projects_list", JSON.stringify(list));
}

function createNewProject() {
  const projId = "proj_" + Date.now();
  state.project = {
    id: projId,
    name: "Nuovo Progetto " + new Date().toLocaleDateString('it-IT'),
    idea: "",
    budget: "",
    objective: "",
    type: "custom",
    attachedFile: null,
    attachedImage: null,
    hires: [],
    readiness: {}
  };
  
  state.currentPhase = 0;
  state.chatHistory = [];
  state.contributions = {};
  state.orchestratorOutputs = {};
  state.answers = {};
  state.brainstormHistories = {};
  state.financialOption = "acquisto";
  state.financialOverrides = {};
  state.financialsChatHistory = [];
  state.globalChatHistory = [];
  state.isApproved = false;
  state.shareholders = [
    { name: "Fondatore", shares: 60000 },
    { name: "Co-Fondatore", shares: 30000 },
    { name: "Option Pool", shares: 10000 }
  ];
  state.dueDiligence = [];
  state.tamSamSom = null;

  const globalChatBox = document.getElementById("global-chat-box");
  if (globalChatBox) {
    globalChatBox.innerHTML = "";
  }
  
  const starterForm = document.getElementById("starter-form");
  if (starterForm) starterForm.reset();
  
  DOM.chatMessages.innerHTML = "";
  togglePhase0View();
  updatePhaseIndicator();
  renderBoardroomGrid();
  
  updateLeanCanvasUI();
  updateFinancialsUI();
  updateReportUI();
  updateAttachmentBadgeUI();
  
  saveCurrentProjectToStorage();
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
    financialOption: state.financialOption || "acquisto",
    financialOverrides: state.financialOverrides || {},
    financialsChatHistory: state.financialsChatHistory || [],
    globalChatHistory: state.globalChatHistory || [],
    isApproved: state.isApproved || false,
    shareholders: state.shareholders || [],
    dueDiligence: state.dueDiligence || [],
    tamSamSom: state.tamSamSom || null,
    lastModified: Date.now()
  };
  
  saveProjectsList(allProjects);
  SafeStorage.setItem("antigravity_active_project_id", id);
}

function loadProjectFromStorage(id) {
  const allProjects = getSavedProjectsList();
  const projData = allProjects[id];
  if (!projData) return;
  
  state.project = projData.project;
  // Assicura che i campi degli allegati e delle nuove funzionalità esistano nello stato caricato
  if (!state.project.attachedFile) state.project.attachedFile = null;
  if (!state.project.attachedImage) state.project.attachedImage = null;
  if (!state.project.hires) state.project.hires = [];
  if (!state.project.readiness) state.project.readiness = {};
  
  state.currentPhase = projData.currentPhase;
  state.chatHistory = projData.chatHistory || [];
  state.contributions = projData.contributions || {};
  state.orchestratorOutputs = projData.orchestratorOutputs || {};
  state.answers = projData.answers || {};
  state.brainstormHistories = projData.brainstormHistories || {};
  state.enabledAgents = projData.enabledAgents || state.enabledAgents;
  state.financialOption = projData.financialOption || "acquisto";
  state.financialOverrides = projData.financialOverrides || {};
  state.financialsChatHistory = projData.financialsChatHistory || [];
  state.globalChatHistory = projData.globalChatHistory || [];
  state.isApproved = projData.isApproved || false;
  state.shareholders = projData.shareholders || [
    { name: "Fondatore", shares: 60000 },
    { name: "Co-Fondatore", shares: 30000 },
    { name: "Option Pool", shares: 10000 }
  ];
  state.dueDiligence = projData.dueDiligence || [];
  state.tamSamSom = projData.tamSamSom || null;
  
  // Renderizza la chat del Consiglio ripristinata
  renderGlobalChatMessages();
  
  SafeStorage.setItem("antigravity_active_project_id", id);
  
  togglePhase0View();
  updateAttachmentBadgeUI();
  
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
    const activeId = SafeStorage.getItem("antigravity_active_project_id");
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
  state.project.attachedFile = null;
  state.project.attachedImage = null;
  
  const starterForm = document.getElementById("starter-form");
  if (starterForm) starterForm.reset();
  
  state.isProcessing = false;
  if (DOM.chatInput) DOM.chatInput.disabled = false;
  if (DOM.btnSend) DOM.btnSend.disabled = false;
  
  DOM.chatMessages.innerHTML = "";
  renderBoardroomGrid();
  startAppFlow();
  
  updateLeanCanvasUI();
  updateFinancialsUI();
  updateReportUI();
  updateAttachmentBadgeUI();
  
  saveCurrentProjectToStorage();
}

// Ripristina l'applicazione pulendo completamente lo storage locale e ricaricando la pagina
function forceHardReset() {
  if (confirm("ATTENZIONE: Questa operazione eliminerà tutti i progetti salvati e ripristinerà l'applicazione allo stato iniziale. Vuoi procedere?")) {
    try {
      localStorage.clear();
      SafeStorage.memoryStorage = {};
      alert("Applicazione resettata con successo. La pagina verrà ricaricata.");
      window.location.reload();
    } catch (e) {
      alert("Errore durante il reset dello storage: " + e.message);
    }
  }
}
window.forceHardReset = forceHardReset;

// Script iniziale obbligatorio
function startAppFlow() {
  state.currentPhase = 0;
  togglePhase0View();
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
        
        const report = window.LocalAgentSimulationEngine.generateAgentReport(info, state.currentPhase, agentKey, state.answers, state.project.attachedFile, state.project.attachedImage);
        state.contributions[state.currentPhase][agentKey] = report;
        setAgentStatus(agentKey, "done");
      }
      
      await delay(300);
      removeTypingIndicator();
      
      const orchReport = window.LocalAgentSimulationEngine.generateOrchestratorReport(info, state.currentPhase, {}, state.answers, state.project.attachedFile, state.project.attachedImage);
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
        
        let agentPrompt = `Siamo alla FASE ${state.currentPhase}: ${PHASE_TITLES[state.currentPhase]} del progetto "${state.project.name}".
L'idea di partenza è: ${state.project.idea}
Il budget: ${state.project.budget}
L'obiettivo: ${state.project.objective}

L'utente ha fornito questo feedback nell'ultimo step: "${userFeedback}"`;

        if (state.project.attachedFile) {
          agentPrompt += `\n\n[CONTESTO ALLEGATO DALL'UTENTE (File: ${state.project.attachedFile.name})]:\n\`\`\`\n${state.project.attachedFile.content}\n\`\`\``;
        }

        agentPrompt += `\n\nFornisci il tuo report specifico di competenza per questa fase. Scrivi in modo estremamente schematico, professionale ed investor-ready. Usa titoli e bullet-point. Massimizza l'efficacia pragmatica ed evidenzia i costi.

REGOLE FONDAMENTALI DI CONDUZIONE (BOARDROOM RULES):
1. SINCERITÀ E OBIEZIONI: Sii critico, onesto e trova tutte le obiezioni pratiche al progetto (se il mercato non è favorevole, se ci sono rischi operativi, ostacoli legali, o se non è fattibile). Inserisci sempre una sezione 'Critiche & Obiezioni' nel tuo report.
2. ZONA GEOGRAFICA MANCANTE: Se l'utente non ha specificato una località geografica precisa nel progetto, evidenzialo chiaramente come un errore critico e proponi le migliori zone geografiche alternative adatte a questo business (se rilevante, proponi zone chiave di Gran Canaria come Playa del Inglés o Las Palmas, altrimenti zone generiche ideali).
3. VETO FINANZIARIO / PIVOT BOOTSTRAP: Se il budget indicato è zero/minimo (bootstrap) e l'idea richiede investimenti significativi (es. macchinari vending, hardware, spazi fisici), poni un VETO dicendo chiaramente che il progetto è irrealizzabile con quelle risorse e proponi soluzioni alternative concrete (es. noleggio operativo/leasing, usati rigenerati, joint venture, o pivot verso idee digitali a costo zero).`;
        try {
          const response = await window.callGeminiAPI(state.apiKey, state.model, agentKey, agentPrompt, [], state.project.attachedImage);
          state.contributions[state.currentPhase][agentKey] = response;
          setAgentStatus(agentKey, "done");
        } catch (err) {
          console.error(`Errore agente ${agentKey}:`, err);
          let extraTip = "";
          if (state.model && state.model.includes("pro")) {
            extraTip = "\n\n> [!TIP]\n> **Suggerimento di Quota**: Stai utilizzando un modello **Pro** (Gemini 2.5 Pro o 1.5 Pro). Nel piano gratuito di Google, questi modelli hanno una quota molto restrittiva di sole **50 richieste al giorno** (circa 4 analisi della boardroom). Se hai superato il limite, passa a **Gemini 3.5 Flash** nelle Impostazioni per avere una quota giornaliera molto più alta.";
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
      
      let orchestratorPrompt = `Siamo alla FASE ${state.currentPhase}: ${PHASE_TITLES[state.currentPhase]} del progetto "${state.project.name}".
Informazioni generali:
- Idea: ${state.project.idea}
- Budget: ${state.project.budget}
- Obiettivo: ${state.project.objective}`;

      if (state.project.attachedFile) {
        orchestratorPrompt += `\n\n[CONTESTO ALLEGATO DALL'UTENTE (File: ${state.project.attachedFile.name})]:\n\`\`\`\n${state.project.attachedFile.content}\n\`\`\``;
      }

      orchestratorPrompt += `\n\nEcco i report appena generati dai tuoi sotto-agenti nella Boardroom:\n${boardroomBrief}\n\nSulla base di questi report, scrivi il paragrafo del Business Plan/Piano Operativo per questa FASE. Sii estremamente sincero, critico ed iper-realista (evidenzia tutte le obiezioni dei sotto-agenti, segnala RED FLAGS, colli di bottiglia o l'eventuale VETO di fattibilità finanziaria se il budget è nullo per attività ad alto CAPEX).
Se l'utente non ha indicato la zona geografica e gli agenti hanno evidenziato la mancanza, riassumi le opzioni delle zone geografiche consigliate e sollecita l'utente a sceglierne una.
Concludi ponendo un massimo di 1-2 domande specifiche e focalizzate (es. per scegliere tra i pivot proposti o le zone consigliate) per consentire all'utente di definire i dettagli per la successiva FASE ${state.currentPhase + 1}.`;

      try {
        const orchestratorResponse = await window.callGeminiAPI(state.apiKey, state.model, "orchestrator", orchestratorPrompt, [], state.project.attachedImage);
        removeTypingIndicator();
        
        const parsedQuestions = extractQuestionsFromText(orchestratorResponse);
        state.orchestratorOutputs[state.currentPhase] = {
          text: orchestratorResponse,
          questions: parsedQuestions.length > 0 ? parsedQuestions : [
            "Come intendi procedere con i punti discussi in questa fase?",
            "Ci sono variazioni di costo o di target che desideri applicare?"
          ]
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
    // Pulisce gli allegati dopo aver avviato la transizione
    state.project.attachedFile = null;
    state.project.attachedImage = null;
    updateAttachmentBadgeUI();
    
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
    
    // Re-renderizza la chat
    renderBrainstormMessages(agentKey);
    
    // 1. Estrazione ed applicazione degli overrides finanziari
    const userFinancials = extractFinancialParameters(message);
    const agentFinancials = extractFinancialParameters(agentResponse);
    const ceoFinancials = extractFinancialParameters(ceoResponse);
    const combinedOverrides = { ...userFinancials, ...agentFinancials, ...ceoFinancials };
    
    if (Object.keys(combinedOverrides).length > 0) {
      state.financialOverrides = { ...state.financialOverrides, ...combinedOverrides };
      appendSystemMessage(`📊 Rilevato aggiornamento finanziario: ${Object.entries(combinedOverrides).map(([k, v]) => `${k} = ${v}€`).join(", ")}`);
    }

    // 2. Registrazione della decisione concordata direttamente nel report dell'agente attivo
    if (state.contributions[state.currentPhase] && state.contributions[state.currentPhase][agentKey]) {
      // Evitiamo duplicati controllando se l'aggiornamento è già presente
      const marker = "#### 💬 Accordi e Pivot di Consiglio (Brainstorming)";
      if (!state.contributions[state.currentPhase][agentKey].includes(marker)) {
        state.contributions[state.currentPhase][agentKey] += `\n\n${marker}\n` +
          `> [!NOTE]\n` +
          `> **Aggiornamento concordato in chat**:\n` +
          `> - *Proposta*: ${message}\n` +
          `> - *Agente*: ${agentResponse.trim().split("\n").join("\n>   ")}\n` +
          `> - *CEO (Orchestratore)*: ${ceoResponse.trim().split("\n").join("\n>   ")}`;
      }
    }

    // 3. Riallineamento della boardroom
    if (state.processingEngine === "local" || state.project.type !== "custom") {
      // In modalità locale rigeneriamo tutti i report per propagare la modifica (es. se cambiano i costi)
      regenerateAllAgentReports();
    } else {
      // In modalità gemini aggiorniamo solo le viste (il report dell'agente è già stato aggiornato qualitativamente sopra)
      updateWorkspaceViews();
    }
    
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
    updateMarketSizingUI();
  } else if (state.activeTab === "marketing") {
    updateMarketingUI();
  } else if (state.activeTab === "equity") {
    updateEquityUI();
  } else if (state.activeTab === "report") {
    updateReportUI();
    updateDueDiligenceUI();
  }
}

// Aggiorna tutte le viste del workspace
function updateWorkspaceViews() {
  updateLeanCanvasUI();
  updateFinancialsUI();
  updateMarketSizingUI();
  updateMarketingUI();
  updateEquityUI();
  updateReportUI();
  updateDueDiligenceUI();
  renderAgentDetails(state.activeAgentDetails);
}

// Riempie il tab Lean Canvas con le informazioni dei report degli agenti
function updateLeanCanvasUI() {
  const getLatestBoxContent = (agentKey, defaultValue = "In attesa di elaborazione...") => {
    // Trova la fase più recente (fino a state.currentPhase) che ha un report per questo agente
    for (let phaseNum = state.currentPhase; phaseNum >= 1; phaseNum--) {
      if (state.contributions[phaseNum] && state.contributions[phaseNum][agentKey]) {
        return formatMarkdown(state.contributions[phaseNum][agentKey]);
      }
    }
    return `<span style="color: var(--text-dark)">${defaultValue}</span>`;
  };

  DOM.leanCanvasGrid.querySelector(".canvas-problem .canvas-box-content").innerHTML = getLatestBoxContent("cmo", "Definisci il problema principale...");
  DOM.leanCanvasGrid.querySelector(".canvas-solution .canvas-box-content").innerHTML = getLatestBoxContent("cpo", "Descrivi il Minimum Viable Product (CPO)...");
  DOM.leanCanvasGrid.querySelector(".canvas-key-metrics .canvas-box-content").innerHTML = getLatestBoxContent("cso", "Metriche chiave e retention (CSO)...");
  DOM.leanCanvasGrid.querySelector(".canvas-uvp .canvas-box-content").innerHTML = getLatestBoxContent("cco", "Definisci la Value Proposition (CCO)...");
  DOM.leanCanvasGrid.querySelector(".canvas-unfair-advantage .canvas-box-content").innerHTML = getLatestBoxContent("cmo", "Vantaggio competitivo (CMO)...");
  DOM.leanCanvasGrid.querySelector(".canvas-channels .canvas-box-content").innerHTML = getLatestBoxContent("sales", "Strategia e script di vendita (Sales)...");
  DOM.leanCanvasGrid.querySelector(".canvas-customer-segments .canvas-box-content").innerHTML = getLatestBoxContent("cmo", "Segmento target e interviste (CMO)...");
  
  const boxCosts = document.getElementById("box-costs");
  const boxRevenue = document.getElementById("box-revenue");
  if (boxCosts) boxCosts.innerHTML = getLatestBoxContent("sourcing", "Struttura costi e forniture (Sourcing)...");
  if (boxRevenue) boxRevenue.innerHTML = getLatestBoxContent("cfo", "Modello finanziario e tariffe (CFO)...");

  // Configura l'interattività dei box del canvas
  setupLeanCanvasInteractivity();
}

// ==========================================
// NEW MODULES: MARKETING, EQUITY, MARKET SIZING, DUE DILIGENCE
// ==========================================

function updateMarketingUI() {
  const personaName = document.getElementById("buyer-persona-name");
  if (!personaName) return;

  let info = { sector: "general" };
  if (state.project && state.project.idea) {
    info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
  }
  const sect = window.LocalAgentSimulationEngine.sectorKeywords[info.sector] || window.LocalAgentSimulationEngine.sectorKeywords.general;

  // Buyer Persona
  const persona = sect.buyerPersona;
  const avatarBox = document.getElementById("buyer-persona-avatar-box");
  if (avatarBox) avatarBox.textContent = persona.avatar || "👤";
  personaName.textContent = persona.name || "-";
  
  const demographics = document.getElementById("buyer-persona-demographics");
  if (demographics) demographics.textContent = persona.demographics || "-";
  
  const pains = document.getElementById("buyer-persona-pains");
  if (pains) pains.textContent = persona.pains || "-";
  
  const gains = document.getElementById("buyer-persona-gains");
  if (gains) gains.textContent = persona.gains || "-";
  
  const channel = document.getElementById("buyer-persona-channel");
  if (channel) channel.textContent = persona.channel || "-";

  // Marketing Channels
  const channelsList = document.getElementById("gtm-channels-list");
  if (channelsList) {
    channelsList.innerHTML = (sect.marketingChannels || []).map(c => `
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
          <span><strong>${c.name}</strong></span>
          <span class="chip" style="background: rgba(99,102,241,0.08); color: var(--primary); font-weight: bold; font-size: 10px; padding: 2px 6px; border-radius: 4px;">CAC: ${c.cac} €</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="flex: 1; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; border: 1px solid var(--glass-border);">
            <div style="width: ${c.share}%; height: 100%; background: var(--primary-grad); border-radius: 4px;"></div>
          </div>
          <span style="font-size: 11px; font-family: monospace; width: 30px; text-align: right; color: var(--text-main);">${c.share}%</span>
        </div>
      </div>
    `).join("");
  }

  // Launch Timeline Checklist
  const timelineList = document.getElementById("launch-timeline-list");
  if (timelineList) {
    if (!state.project.completedWeeks) {
      state.project.completedWeeks = [];
    }
    timelineList.innerHTML = (sect.launchTimeline || []).map((step, idx) => {
      const isChecked = state.project.completedWeeks.includes(idx);
      return `
        <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 12px; line-height: 1.5; cursor: pointer; padding: 8px; border-radius: 6px; background: rgba(255,255,255,0.01); transition: background 0.2s;" class="hover-bg-glass">
          <input type="checkbox" class="timeline-checkbox" data-index="${idx}" ${isChecked ? "checked" : ""} style="margin-top: 3px; cursor: pointer;">
          <span style="color: ${isChecked ? "var(--text-muted)" : "var(--text-main)"}; text-decoration: ${isChecked ? "line-through" : "none"};">${step}</span>
        </label>
      `;
    }).join("");

    // Bind change events
    timelineList.querySelectorAll(".timeline-checkbox").forEach(cb => {
      cb.addEventListener("change", (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        if (!state.project.completedWeeks) state.project.completedWeeks = [];
        if (e.target.checked) {
          if (!state.project.completedWeeks.includes(idx)) {
            state.project.completedWeeks.push(idx);
          }
        } else {
          state.project.completedWeeks = state.project.completedWeeks.filter(i => i !== idx);
        }
        saveCurrentProjectToStorage();
        updateMarketingUI();
      });
    });
  }
  updateSalesPsychologyUI();
}

function updateEquityUI() {
  if (!state.shareholders || state.shareholders.length === 0) {
    state.shareholders = [
      { name: "Fondatore", shares: 60000 },
      { name: "Co-Fondatore", shares: 30000 },
      { name: "Option Pool", shares: 10000 }
    ];
  }

  const capTableBody = document.getElementById("cap-table-body");
  if (!capTableBody) return;

  const baseTotalShares = state.shareholders.reduce((sum, s) => sum + s.shares, 0);
  const safeCap = parseFloat(document.getElementById("safe-cap").value) || 1500000;

  // Trova l'Option Pool
  const poolIdx = state.shareholders.findIndex(s => s.name.toLowerCase().includes("option") || s.name.toLowerCase().includes("pool"));
  
  // Calcola quote assunzioni
  const hiresList = state.project.hires || [];
  const totalHireShares = hiresList.reduce((sum, h) => sum + Math.round((h.equity / 100) * baseTotalShares), 0);

  capTableBody.innerHTML = "";

  state.shareholders.forEach((s, idx) => {
    let shares = s.shares;
    if (idx === poolIdx) {
      shares = Math.max(0, s.shares - totalHireShares);
    }
    
    const pct = baseTotalShares > 0 ? ((shares / baseTotalShares) * 100).toFixed(2) : "0.00";
    const estVal = baseTotalShares > 0 ? ((shares / baseTotalShares) * safeCap).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }) : "0 €";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <input type="text" value="${s.name}" class="cap-name-edit" data-index="${idx}" style="width: 100%; border: none; background: transparent; color: var(--text-main); font-size: 12px; outline: none; padding: 2px;">
      </td>
      <td>
        <input type="number" value="${s.shares}" class="cap-shares-edit" data-index="${idx}" style="width: 100%; border: none; background: transparent; color: var(--text-main); font-size: 12px; font-family: monospace; outline: none; padding: 2px;">
        ${idx === poolIdx && totalHireShares > 0 ? `<br><small style="color: var(--text-muted)">Rimanente di ${s.shares.toLocaleString()}</small>` : ""}
      </td>
      <td style="font-weight: bold; font-family: monospace; color: var(--text-main);">${pct}%</td>
      <td style="color: var(--text-muted); font-family: monospace;">${estVal}</td>
      <td>
        <button class="btn-delete-shareholder" data-index="${idx}" style="background: transparent; border: none; color: #f87171; cursor: pointer; font-size: 14px; padding: 2px 6px;">🗑️</button>
      </td>
    `;
    capTableBody.appendChild(tr);
  });

  // Aggiungi le righe dei dipendenti assunti
  hiresList.forEach((h, idx) => {
    const shares = Math.round((h.equity / 100) * baseTotalShares);
    const pct = h.equity.toFixed(2);
    const estVal = baseTotalShares > 0 ? ((shares / baseTotalShares) * safeCap).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }) : "0 €";

    const tr = document.createElement("tr");
    tr.style.background = "rgba(139,92,246,0.02)";
    tr.style.borderLeft = "2px solid var(--primary)";
    tr.innerHTML = `
      <td>
        <span style="color: var(--primary); font-weight: bold;">👤 Assunzione:</span> ${h.role}
      </td>
      <td style="font-family: monospace; color: var(--text-muted);">${shares.toLocaleString()}</td>
      <td style="font-weight: bold; font-family: monospace; color: var(--primary);">${pct}%</td>
      <td style="color: var(--text-muted); font-family: monospace;">${estVal}</td>
      <td>
        <span class="chip" style="background: rgba(139,92,246,0.08); color: var(--primary); font-size: 9px; padding: 2px 6px;">Hired</span>
      </td>
    `;
    capTableBody.appendChild(tr);
  });

  // Inline edit listeners
  document.querySelectorAll(".cap-name-edit").forEach(input => {
    input.addEventListener("change", (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      state.shareholders[index].name = e.target.value.trim() || `Socio ${index + 1}`;
      saveCurrentProjectToStorage();
      updateEquityUI();
    });
  });

  document.querySelectorAll(".cap-shares-edit").forEach(input => {
    input.addEventListener("change", (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      const val = parseInt(e.target.value, 10) || 0;
      state.shareholders[index].shares = val >= 0 ? val : 0;
      saveCurrentProjectToStorage();
      updateEquityUI();
    });
  });

  // Delete listener
  document.querySelectorAll(".btn-delete-shareholder").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      state.shareholders.splice(index, 1);
      saveCurrentProjectToStorage();
      updateEquityUI();
    });
  });

  // Update SAFE and Pitch Deck inside
  updateSafeSimulation();
  updatePitchDeckUI();
  updateHiringUI();
}

function updateHiringUI() {
  const tbody = document.getElementById("hiring-table-body");
  if (!tbody) return;

  const hires = state.project.hires || [];
  if (hires.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted)">Nessun dipendente o collaboratore chiave pianificato. Aggiungine uno sotto.</td></tr>`;
    return;
  }

  tbody.innerHTML = "";
  hires.forEach((h, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${h.role}</strong></td>
      <td style="font-family: monospace; font-weight: bold;">${h.salary.toLocaleString('it-IT')} €</td>
      <td style="font-family: monospace; color: var(--primary); font-weight: bold;">${h.equity}%</td>
      <td><span class="chip" style="background: rgba(99,102,241,0.08); color: var(--primary); font-size: 10px; padding: 2px 6px; border-radius: 4px;">${h.timeline}</span></td>
      <td>
        <button class="btn-delete-hire" data-index="${idx}" style="background: transparent; border: none; color: #f87171; cursor: pointer; font-size: 14px; padding: 2px 6px;">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Bind delete listener for hires
  tbody.querySelectorAll(".btn-delete-hire").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      state.project.hires.splice(index, 1);
      saveCurrentProjectToStorage();
      updateEquityUI();
    });
  });
}

function updateSalesPsychologyUI() {
  let info = { sector: "general" };
  if (state.project && state.project.idea) {
    info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
  }
  
  const psych = window.LocalAgentSimulationEngine.salesPsychologyData[info.sector] || window.LocalAgentSimulationEngine.salesPsychologyData.general;

  const hookText = document.getElementById("funnel-hook-text");
  const objectionsText = document.getElementById("funnel-objections-text");
  const conversionText = document.getElementById("funnel-conversion-text");

  const psychAngle = document.getElementById("sales-psych-angle");
  const psychUrgency = document.getElementById("sales-psych-urgency");
  const psychFriction = document.getElementById("sales-psych-friction");

  if (hookText) hookText.textContent = psych.hook;
  if (objectionsText) objectionsText.textContent = psych.objections;
  if (conversionText) conversionText.textContent = psych.conversion;

  if (psychAngle) psychAngle.textContent = psych.angle;
  if (psychUrgency) psychUrgency.textContent = psych.urgency;
  if (psychFriction) psychFriction.textContent = psych.friction;
}

function updateReadinessUI() {
  const container = document.getElementById("startup-readiness-container");
  const listContainer = document.getElementById("readiness-checklist-list");
  if (!container || !listContainer) return;

  if (state.currentPhase === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";

  let info = { sector: "general" };
  if (state.project && state.project.idea) {
    info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
  }
  const tips = window.LocalAgentSimulationEngine.startupReadinessData[info.sector] || window.LocalAgentSimulationEngine.startupReadinessData.general;

  const topics = [
    { key: "scelta_problema", label: "🎯 Scelta del problema" },
    { key: "pain_cliente", label: "🔴 Pain del cliente" },
    { key: "psicologia_vendita", label: "🧠 Psicologia della vendita" },
    { key: "posizionamento", label: "⚡ Posizionamento di mercato" },
    { key: "distribuzione", label: "📢 Canali di Distribuzione" },
    { key: "hiring", label: "👥 Strategia di Hiring (Team)" },
    { key: "processo_decisionale", label: "⚖️ Processo decisionale d'acquisto" },
    { key: "cash_flow", label: "💰 Gestione del Cash flow" },
    { key: "storytelling", label: "📖 Storytelling & Elevator Pitch" },
    { key: "mindset", label: "👑 Mindset imprenditoriale" }
  ];

  if (!state.project.readiness) {
    state.project.readiness = {};
  }

  listContainer.innerHTML = topics.map((t, idx) => {
    const currentStatus = state.project.readiness[t.key] || "Da Studiare";
    let badgeColor = "var(--text-muted)";
    let badgeBg = "rgba(255,255,255,0.05)";

    if (currentStatus === "In Corso") {
      badgeColor = "var(--warning)";
      badgeBg = "rgba(245,158,11,0.1)";
    } else if (currentStatus === "Validato") {
      badgeColor = "var(--success)";
      badgeBg = "rgba(16,185,129,0.1)";
    }

    const tipText = tips[t.key] || "Analizza le metriche e definisci la strategia.";

    return `
      <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--glass-border); border-radius: 8px; padding: 12px; transition: all 0.2s;">
        <div class="readiness-topic-header" data-key="${t.key}" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
          <span style="font-weight: 600; font-size: 12.5px; color: var(--text-main); display: flex; align-items: center; gap: 6px;">
            ${t.label} <span style="font-size: 9px; color: var(--text-muted);">(Clicca per info)</span>
          </span>
          <button class="readiness-status-badge" data-key="${t.key}" style="background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeColor}; padding: 3px 6px; border-radius: 10px; cursor: pointer; font-size: 9.5px; font-weight: bold; width: 90px; text-align: center; outline: none; border-style: solid;">
            ${currentStatus}
          </button>
        </div>
        <div id="readiness-tip-${t.key}" style="display: none; margin-top: 10px; padding: 10px; background: rgba(99,102,241,0.02); border-left: 2px solid var(--primary); font-size: 11.5px; line-height: 1.45; color: var(--text-muted);">
          <strong>Pillola Strategica (${info.sector.toUpperCase()}):</strong> ${tipText}
        </div>
      </div>
    `;
  }).join("");

  // Bind click on topic headers
  listContainer.querySelectorAll(".readiness-topic-header").forEach(header => {
    header.addEventListener("click", (e) => {
      if (e.target.classList.contains("readiness-status-badge")) return;
      const key = header.dataset.key;
      const tipBox = document.getElementById(`readiness-tip-${key}`);
      if (tipBox) {
        tipBox.style.display = tipBox.style.display === "none" ? "block" : "none";
      }
    });
  });

  // Bind badge click listener to cycle state
  listContainer.querySelectorAll(".readiness-status-badge").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const key = e.target.dataset.key;
      const current = state.project.readiness[key] || "Da Studiare";
      let next = "Da Studiare";
      if (current === "Da Studiare") next = "In Corso";
      else if (current === "In Corso") next = "Validato";

      state.project.readiness[key] = next;
      saveCurrentProjectToStorage();
      updateReadinessUI();
    });
  });
}

function updateSafeSimulation() {
  const safeInvestment = parseFloat(document.getElementById("safe-investment").value) || 100000;
  const safeCap = parseFloat(document.getElementById("safe-cap").value) || 1500000;
  
  const pct = safeCap > 0 ? ((safeInvestment / safeCap) * 100).toFixed(2) : "0.00";
  const resultOwnershipSpan = document.getElementById("safe-result-ownership");
  if (resultOwnershipSpan) {
    resultOwnershipSpan.textContent = pct;
  }
}

function updatePitchDeckUI() {
  const container = document.getElementById("pitch-deck-carousel");
  if (!container) return;

  let info = { sector: "general" };
  if (state.project && state.project.idea) {
    info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
  }
  const sect = window.LocalAgentSimulationEngine.sectorKeywords[info.sector] || window.LocalAgentSimulationEngine.sectorKeywords.general;
  
  let fin = { bep: "-", priceFormatted: "-", priceNum: 0, cogsNum: 0, targetVolumeNum: 0, targetVolumeUnit: "", revenueMonth: "-", profitMonth: "-" };
  if (state.currentPhase >= 1 || state.project.type !== "custom") {
    fin = window.LocalAgentSimulationEngine.generateFinancials(info, state.financialOption, state.financialOverrides || {});
  }

  const safeInvestment = parseFloat(document.getElementById("safe-investment").value) || 100000;
  const safeCap = parseFloat(document.getElementById("safe-cap").value) || 1500000;
  const safePct = safeCap > 0 ? ((safeInvestment / safeCap) * 100).toFixed(2) : "0.00";

  const getLatestAgentReport = (agentKey, defaultValue = "") => {
    for (let phaseNum = state.currentPhase; phaseNum >= 1; phaseNum--) {
      if (state.contributions[phaseNum] && state.contributions[phaseNum][agentKey]) {
        return state.contributions[phaseNum][agentKey];
      }
    }
    return defaultValue;
  };

  const cpoReport = getLatestAgentReport("cpo", `Un MVP focalizzato su: ${sect.product}`);
  const cmoReport = getLatestAgentReport("cmo", `Target segment: ${sect.buyerPersona.name}`);
  const cfoReport = getLatestAgentReport("cfo", `Modello ricavi basato su: ${sect.revenue}`);

  const totalShares = (state.shareholders || []).reduce((sum, s) => sum + s.shares, 0);
  const capTableSummary = (state.shareholders || []).map(s => {
    const p = totalShares > 0 ? ((s.shares / totalShares) * 100).toFixed(1) : "0.0";
    return `${s.name} (${p}%)`;
  }).join(", ");

  const slides = [
    {
      num: 1,
      title: "1. Visione Aziendale (Elevator Pitch)",
      desc: `Creare la piattaforma leader nel settore per digitalizzare ${sect.product} con efficienza massima.`,
      source: "Consiglio di Amministrazione"
    },
    {
      num: 2,
      title: "2. Il Problema",
      desc: `Il cliente ideale (${sect.buyerPersona.name}) riscontra grosse difficoltà: "${sect.buyerPersona.pains}"`,
      source: `CMO - Analisi del Target (${sect.buyerPersona.name})`
    },
    {
      num: 3,
      title: "3. La Soluzione",
      desc: `Offriamo un servizio impeccabile basato su: ${cpoReport.substring(0, 160)}${cpoReport.length > 160 ? '...' : ''}`,
      source: "CPO - MVP Specification"
    },
    {
      num: 4,
      title: "4. Dimensione del Mercato (TAM-SAM-SOM)",
      desc: `Mercato Globale (TAM): €${(state.tamSamSom?.tam || sect.tam).toLocaleString('it-IT')}. Mercato Raggiungibile (SAM): €${(state.tamSamSom?.sam || sect.sam).toLocaleString('it-IT')}. Nostro Target (SOM): €${(state.tamSamSom?.som || sect.som).toLocaleString('it-IT')}.`,
      source: "CFO & CMO - Market Sizing"
    },
    {
      num: 5,
      title: "5. Modello di Business",
      desc: `${cfoReport.substring(0, 150)}${cfoReport.length > 150 ? '...' : ''} Ricavi unitari di ${fin.priceFormatted} con margini del ${fin.priceNum > 0 ? (((fin.priceNum - fin.cogsNum) / fin.priceNum) * 100).toFixed(0) : "0"}%.`,
      source: "CFO - Pricing & Margins"
    },
    {
      num: 6,
      title: "6. Strategia di Acquisizione (GTM)",
      desc: `I canali principali per acquisire clienti saranno: ${(sect.marketingChannels || []).map(c => `${c.name} (${c.share}%)`).join(", ")}.`,
      source: "CMO - Piano Canali"
    },
    {
      num: 7,
      title: "7. Concorrenza & Vantaggio Competitivo",
      desc: `Ci distinguiamo per l'automazione ed il focus sulla riduzione dei costi operativi tramite ${sect.tech}.`,
      source: "CSO - Analisi dei Competitor"
    },
    {
      num: 8,
      title: "8. Il Team & Cap Table",
      desc: `Boardroom Suite guidato da Orchestratore Master, CMO, CPO, CFO, CSO. Assetto proprietario iniziale: ${capTableSummary || "Non impostato"}.`,
      source: "Organizzazione Societaria"
    },
    {
      num: 9,
      title: "9. Financials & Proiezioni",
      desc: `Soglia break-even fissata a ${fin.bep}. A regime prevediamo un profitto steady-state mensile di ${fin.profitMonth} con fatturato mensile di ${fin.revenueMonth}.`,
      source: "CFO - Break-Even Analysis"
    },
    {
      num: 10,
      title: "10. La Richiesta (Ask & Safe)",
      desc: `Chiediamo €${safeInvestment.toLocaleString('it-IT')} a fronte di un contratto SAFE con Valuation Cap di €${safeCap.toLocaleString('it-IT')}, corrispondente ad una cessione azionaria stimata del ${safePct}% post-money.`,
      source: "Fundraising Strategy"
    }
  ];

  container.innerHTML = slides.map(s => `
    <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: 8px; padding: 12px; margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(255,255,255,0.05); padding-bottom: 6px; margin-bottom: 8px;">
        <span style="font-weight: bold; color: var(--primary); font-size: 13px;">${s.title}</span>
        <span style="font-size: 10px; color: var(--text-muted); font-style: italic;">Fonte: ${s.source}</span>
      </div>
      <p style="margin: 0; font-size: 12px; color: var(--text-main); line-height: 1.5;">${s.desc}</p>
    </div>
  `).join("");
}

function updateMarketSizingUI() {
  const inputTam = document.getElementById("input-tam");
  const inputSam = document.getElementById("input-sam");
  const inputSom = document.getElementById("input-som");
  
  if (!inputTam || !inputSam || !inputSom) return;

  let info = { sector: "general" };
  if (state.project && state.project.idea) {
    info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
  }
  const sect = window.LocalAgentSimulationEngine.sectorKeywords[info.sector] || window.LocalAgentSimulationEngine.sectorKeywords.general;
  
  if (!state.tamSamSom) {
    state.tamSamSom = {
      tam: sect.tam,
      sam: sect.sam,
      som: sect.som
    };
    inputTam.value = state.tamSamSom.tam;
    inputSam.value = state.tamSamSom.sam;
    inputSom.value = state.tamSamSom.som;
  } else {
    if (inputTam.value === "100000000" && state.tamSamSom.tam !== 100000000) {
      inputTam.value = state.tamSamSom.tam;
    }
    if (inputSam.value === "15000000" && state.tamSamSom.sam !== 15000000) {
      inputSam.value = state.tamSamSom.sam;
    }
    if (inputSom.value === "1200000" && state.tamSamSom.som !== 1200000) {
      inputSom.value = state.tamSamSom.som;
    }
  }

  const tamVal = parseFloat(inputTam.value) || 0;
  const samVal = parseFloat(inputSam.value) || 0;
  const somVal = parseFloat(inputSom.value) || 0;

  const pctSam = tamVal > 0 ? ((samVal / tamVal) * 100).toFixed(1) : "0.0";
  const pctSom = samVal > 0 ? ((somVal / samVal) * 100).toFixed(1) : "0.0";

  const labelTam = document.getElementById("label-tam");
  if (labelTam) labelTam.textContent = tamVal.toLocaleString('it-IT') + " €";
  const labelSam = document.getElementById("label-sam");
  if (labelSam) labelSam.textContent = samVal.toLocaleString('it-IT') + " €";
  const labelSom = document.getElementById("label-som");
  if (labelSom) labelSom.textContent = somVal.toLocaleString('it-IT') + " €";

  const pctSamSpan = document.getElementById("pct-sam");
  if (pctSamSpan) pctSamSpan.textContent = pctSam;
  const pctSomSpan = document.getElementById("pct-som");
  if (pctSomSpan) pctSomSpan.textContent = pctSom;

  const svgWrapper = document.getElementById("tam-sam-som-svg-wrapper");
  if (svgWrapper) {
    svgWrapper.innerHTML = `
      <svg viewBox="0 0 250 120" style="width: 100%; height: 100%;">
        <!-- TAM Circle -->
        <circle cx="60" cy="60" r="50" fill="rgba(99, 102, 241, 0.03)" stroke="var(--primary)" stroke-width="1.5" />
        <text x="60" y="28" font-size="9" fill="var(--primary)" font-weight="bold" text-anchor="middle">TAM</text>
        
        <!-- SAM Circle -->
        <circle cx="60" cy="70" r="35" fill="rgba(139, 92, 246, 0.06)" stroke="var(--accent)" stroke-width="1.5" />
        <text x="60" y="52" font-size="9" fill="var(--accent)" font-weight="bold" text-anchor="middle">SAM</text>
        
        <!-- SOM Circle -->
        <circle cx="60" cy="80" r="20" fill="rgba(16, 185, 129, 0.1)" stroke="var(--success)" stroke-width="1.5" />
        <text x="60" y="82" font-size="9" fill="var(--success)" font-weight="bold" text-anchor="middle">SOM</text>
        
        <!-- Connector Lines -->
        <path d="M 110 60 L 140 60" stroke="var(--primary)" stroke-dasharray="2,2" />
        <path d="M 95 70 L 140 70" stroke="var(--accent)" stroke-dasharray="2,2" />
        <path d="M 80 80 L 140 80" stroke="var(--success)" stroke-dasharray="2,2" />
        
        <!-- Labels inside SVG -->
        <text x="145" y="63" font-size="8" fill="var(--text-main)" font-weight="500">100.0%</text>
        <text x="145" y="73" font-size="8" fill="var(--text-main)" font-weight="500">${pctSam}% TAM</text>
        <text x="145" y="83" font-size="8" fill="var(--text-main)" font-weight="500">${pctSom}% SAM</text>
      </svg>
    `;
  }
}

function updateDueDiligenceUI() {
  const container = document.getElementById("due-diligence-container");
  const tbody = document.getElementById("due-diligence-table-body");
  if (!container || !tbody) return;

  if (state.currentPhase === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";

  // Rileva localizzazione
  let info = { location: "" };
  if (state.project && state.project.idea) {
    info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
  }
  const loc = info.location ? info.location.toLowerCase() : "";
  const isSpain = loc.includes("canari") || loc.includes("tenerife") || loc.includes("spagna") || loc.includes("gran canaria") || loc.includes("lanzarote");

  // Definizione dei documenti in base all'area geografica
  let docTemplates = [];
  if (isSpain) {
    docTemplates = [
      { id: "sp_legal", name: "Constitución S.L. / Autónomo", area: "Legale", desc: "Costituzione societaria o registrazione come lavoratore autonomo." },
      { id: "sp_tax", name: "Alta Modelo 036/037", area: "Fiscale", desc: "Dichiarazione di inizio attività presso l'Agencia Tributaria." },
      { id: "sp_seg", name: "Seguridad Social (RETA)", area: "Previdenziale", desc: "Iscrizione alla previdenza sociale spagnola." },
      { id: "sp_license", name: "Licencia de Apertura", area: "Amministrativa", desc: "Licenza d'uso e idoneità dei locali rilasciata dall'Ayuntamiento." },
      { id: "sp_canary", name: "Registro de Operadores IGIC", area: "Fiscale Canarie", desc: "Esenzione o tariffa agevolata IGIC (Imposta Canarie)." },
      { id: "sp_gdpr", name: "LOPDGDD & GDPR", area: "Compliance", desc: "Regolamento privacy europeo adattato alla legge spagnola." },
      { id: "sp_trademark", name: "Registro Marca OEPM", area: "Proprietà Intellettuale", desc: "Protezione del brand presso l'Oficina Española de Patentes y Marcas." }
    ];
  } else {
    docTemplates = [
      { id: "it_legal", name: "Atto Costitutivo & S.r.l. / P.IVA", area: "Legale", desc: "Costituzione presso notaio e attribuzione codice Partita IVA." },
      { id: "it_scia", name: "SCIA (SUAP Comunale)", area: "Amministrativa", desc: "Segnalazione Certificata di Inizio Attività al Comune competente." },
      { id: "it_cciaa", name: "Iscrizione Registro Imprese", area: "Amministrativa", desc: "Iscrizione alla Camera di Commercio (CCIAA) locale." },
      { id: "it_haccp", name: "HACCP & ASL (se applicabile)", area: "Igiene/Sanità", desc: "Autocontrollo alimentare o requisiti igienici locali per somministrazione/vendita." },
      { id: "it_dvr", name: "DVR (D.Lgs. 81/08)", area: "Sicurezza", desc: "Documento di Valutazione dei Rischi per la sicurezza sul lavoro." },
      { id: "it_gdpr", name: "Privacy Policy & GDPR", area: "Compliance", desc: "Adeguamento al regolamento privacy UE per sito web ed app." },
      { id: "it_trademark", name: "Registrazione Marchio UIBM", area: "Proprietà Intellettuale", desc: "Registrazione del brand e logo presso l'Ufficio Brevetti e Marchi." }
    ];
  }

  // Se i documenti correnti non sono inizializzati, o appartengono a un'altra nazionalità, resettiamo
  if (!state.project.dueDiligence || state.project.dueDiligence.length === 0 || 
      (state.project.dueDiligence[0].id.startsWith("sp_") !== isSpain)) {
    state.project.dueDiligence = docTemplates.map(t => ({
      ...t,
      status: "Pending"
    }));
  }

  tbody.innerHTML = "";

  state.project.dueDiligence.forEach((d, idx) => {
    let statusLabel = "Pending";
    let statusColor = "var(--text-muted)";
    let statusBg = "rgba(255,255,255,0.05)";

    if (d.status === "In Corso") {
      statusLabel = "In Corso";
      statusColor = "var(--warning)";
      statusBg = "rgba(245,158,11,0.1)";
    } else if (d.status === "Pronto") {
      statusLabel = "Pronto";
      statusColor = "var(--success)";
      statusBg = "rgba(16,185,129,0.1)";
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${d.name}</strong></td>
      <td><span class="chip" style="background: rgba(99,102,241,0.08); color: var(--primary); font-size: 10px; padding: 2px 6px; border-radius: 4px;">${d.area}</span></td>
      <td style="color: var(--text-muted); font-size: 11px;">${d.desc}</td>
      <td>
        <button class="due-diligence-badge" data-index="${idx}" style="background: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusColor}; padding: 4px 8px; border-radius: 12px; cursor: pointer; font-size: 10px; font-weight: bold; width: 85px; text-align: center; transition: all 0.2s; outline: none; border-style: solid;">
          ${statusLabel}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Listener cambio stato
  tbody.querySelectorAll(".due-diligence-badge").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      const current = state.project.dueDiligence[index].status;
      let next = "Pending";
      if (current === "Pending") next = "In Corso";
      else if (current === "In Corso") next = "Pronto";

      state.project.dueDiligence[index].status = next;
      saveCurrentProjectToStorage();
      updateDueDiligenceUI();
    });
  });
  updateReadinessUI();
}

function updateFinancialsUI() {
  DOM.financialTableBody.innerHTML = "";
  const chartContainer = document.getElementById("break-even-chart-container");
  const optionSelector = document.getElementById("financial-option-selector-container");
  
  if (state.currentPhase >= 1 || state.project.type !== "custom") {
    const demoKey = state.project.type === "custom" ? "gardatech" : state.project.type;
    
    if (state.project.type === "custom") {
      if (optionSelector) {
        optionSelector.style.display = "block";
        
        // Determiniamo le etichette dei pulsanti in base al settore
        const info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
        let btn1Text = "💵 Acquisto Diretto";
        let btn2Text = "🔄 Leasing / Noleggio";
        let btn3Text = "🤝 Joint Venture";
        
        if (info.sector === "saas" || info.sector === "mobile_app" || info.sector === "marketplace") {
          btn1Text = "💻 Sviluppo In-House";
          btn2Text = "⚙️ No-Code Stack";
          btn3Text = "🤝 CTO Equity Share";
        } else if (info.sector === "ecommerce" || info.sector === "retail") {
          btn1Text = "📦 Magazzino Proprio";
          btn2Text = "🚚 Dropshipping / Fulfillment";
          btn3Text = "🤝 Conto Vendita / Partner";
        } else if (info.sector === "non_profit") {
          btn1Text = "🌱 Fondi Propri / Donazioni";
          btn2Text = "🏛️ Bandi Pubblici / ETS";
          btn3Text = "🤝 Sponsor CSR / Aziende";
        } else if (info.sector === "media_content") {
          btn1Text = "🎥 Produzione Interna";
          btn2Text = "☁️ Outsourcing / Editor";
          btn3Text = "🤝 Co-Produzione / Sponsor";
        } else if (!info.isVending) {
          btn1Text = "🏢 Agenzia Proprietaria";
          btn2Text = "☁️ Sub-appalto / Outsourcing";
          btn3Text = "🤝 Partnership / Rev-Share";
        }
        
        const b1 = document.getElementById("fin-btn-option1");
        const b2 = document.getElementById("fin-btn-option2");
        const b3 = document.getElementById("fin-btn-option3");
        
        if (b1) b1.innerHTML = btn1Text;
        if (b2) b2.innerHTML = btn2Text;
        if (b3) b3.innerHTML = btn3Text;
        
        // Aggiorna lo stile dei chip attivi
        const optionButtons = document.querySelectorAll(".fin-option-btn");
        optionButtons.forEach(btn => {
          if (btn.dataset.option === state.financialOption) {
            btn.style.background = "var(--primary-grad)";
            btn.style.color = "white";
            btn.style.borderColor = "var(--primary)";
            btn.style.fontWeight = "600";
            btn.style.boxShadow = "0 0 10px var(--primary-glow)";
          } else {
            btn.style.background = "rgba(255, 255, 255, 0.03)";
            btn.style.color = "var(--text-main)";
            btn.style.borderColor = "var(--glass-border)";
            btn.style.fontWeight = "500";
            btn.style.boxShadow = "none";
          }
        });
      }
      
      const info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
      const fin = window.LocalAgentSimulationEngine.generateFinancials(info, state.financialOption, state.financialOverrides || {});
      
      document.getElementById("fin-capex").textContent = fin.capex;
      document.getElementById("fin-opex").textContent = fin.opex;
      document.getElementById("fin-break-even").textContent = fin.bep;
      
      // Nuove proiezioni guadagni steady-state
      document.getElementById("fin-target-volume").textContent = `${fin.targetVolumeNum} ${fin.targetVolumeUnit}`;
      document.getElementById("fin-unit-price").textContent = fin.priceFormatted;
      document.getElementById("fin-unit-cogs").textContent = fin.cogsFormatted;
      document.getElementById("fin-unit-margin").textContent = fin.marginFormatted;
      
      document.getElementById("fin-rev-day").textContent = fin.revenueDay;
      document.getElementById("fin-rev-week").textContent = fin.revenueWeek;
      document.getElementById("fin-rev-month").textContent = fin.revenueMonth;
      
      document.getElementById("fin-prof-day").textContent = fin.profitDay;
      document.getElementById("fin-prof-week").textContent = fin.profitWeek;
      document.getElementById("fin-prof-month").textContent = fin.profitMonth;
      
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
      
      // Renderizza il grafico di Break-Even
      renderBreakEvenChart(fin.capexNum, fin.opexNum, fin.priceNum, fin.cogsNum, fin.unitName);
      
      // Renderizza la tabella delle proiezioni mensili
      renderMonthlyProjectionsTable(fin.capexNum, fin.opexNum, fin.priceNum, fin.cogsNum, fin.unitName, fin.targetVolumeNum);
      
      // Renderizza la chat finanziaria
      renderFinancialsChatMessages();
      
    } else {
      if (optionSelector) optionSelector.style.display = "none";
      
      if (demoKey === "gardatech") {
        document.getElementById("fin-capex").textContent = "1.950 €";
        document.getElementById("fin-opex").textContent = "175 € / mese";
        document.getElementById("fin-break-even").textContent = "12 Appartamenti";
        
        // Nuove proiezioni guadagni steady-state
        document.getElementById("fin-target-volume").textContent = "15 Appartamenti";
        document.getElementById("fin-unit-price").textContent = "150,00 €";
        document.getElementById("fin-unit-cogs").textContent = "30,00 €";
        document.getElementById("fin-unit-margin").textContent = "120,00 €";
        
        document.getElementById("fin-rev-day").textContent = "75,00 €";
        document.getElementById("fin-rev-week").textContent = "525,70 €";
        document.getElementById("fin-rev-month").textContent = "2.250,00 €";
        
        document.getElementById("fin-prof-day").textContent = "54,17 €";
        document.getElementById("fin-prof-week").textContent = "379,67 €";
        document.getElementById("fin-prof-month").textContent = "1.625,00 €";
        
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
        
        renderBreakEvenChart(1950, 175, 150, 30, "Appartamenti");
        renderMonthlyProjectionsTable(1950, 175, 150, 30, "Appartamenti", 15);
        
      } else if (demoKey === "ecowrap") {
        document.getElementById("fin-capex").textContent = "600 €";
        document.getElementById("fin-opex").textContent = "29 € / mese";
        document.getElementById("fin-break-even").textContent = "3 Lotti (750 scatole)";
        
        // Nuove proiezioni guadagni steady-state
        document.getElementById("fin-target-volume").textContent = "5 Lotti (1250 scatole)";
        document.getElementById("fin-unit-price").textContent = "250,00 €";
        document.getElementById("fin-unit-cogs").textContent = "100,00 €";
        document.getElementById("fin-unit-margin").textContent = "150,00 €";
        
        document.getElementById("fin-rev-day").textContent = "41,67 €";
        document.getElementById("fin-rev-week").textContent = "292,06 €";
        document.getElementById("fin-rev-month").textContent = "1.250,00 €";
        
        document.getElementById("fin-prof-day").textContent = "24,03 €";
        document.getElementById("fin-prof-week").textContent = "168,46 €";
        document.getElementById("fin-prof-month").textContent = "721,00 €";
        
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
        
        renderBreakEvenChart(600, 29, 250, 100, "Lotti");
        renderMonthlyProjectionsTable(600, 29, 250, 100, "Lotti", 5);
      }
    }
  } else {
    if (optionSelector) optionSelector.style.display = "none";
    const monthlyContainer = document.getElementById("monthly-projections-container");
    if (monthlyContainer) monthlyContainer.style.display = "none";
    document.getElementById("fin-capex").textContent = "-";
    document.getElementById("fin-opex").textContent = "-";
    document.getElementById("fin-break-even").textContent = "-";
    
    // Nuove proiezioni reset
    document.getElementById("fin-target-volume").textContent = "-";
    document.getElementById("fin-unit-price").textContent = "-";
    document.getElementById("fin-unit-cogs").textContent = "-";
    document.getElementById("fin-unit-margin").textContent = "-";
    
    document.getElementById("fin-rev-day").textContent = "-";
    document.getElementById("fin-rev-week").textContent = "-";
    document.getElementById("fin-rev-month").textContent = "-";
    
    document.getElementById("fin-prof-day").textContent = "-";
    document.getElementById("fin-prof-week").textContent = "-";
    document.getElementById("fin-prof-month").textContent = "-";
    
    if (chartContainer) chartContainer.style.display = "none";
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
    
    if (phaseNum === 7) {
      markdown += `### Tabella dei Costi & Modello Finanziario (Spreadsheet CFO - Opzione: ${state.financialOption.toUpperCase()})\n\n`;
      markdown += `| Elemento / Voce di Spesa | Tipo | Costo Stimato | Fonte / Criterio Logico |\n`;
      markdown += `| --- | --- | --- | --- |\n`;
      
      let rows = [];
      if (state.project.type === "custom") {
        const info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
        const fin = window.LocalAgentSimulationEngine.generateFinancials(info, state.financialOption, state.financialOverrides || {});
        rows = fin.rows;
      } else if (state.project.type === "gardatech") {
        rows = [
          { item: "Kit Serratura Nuki Smart Lock", type: "CAPEX", cost: "80.00 € / unità", source: "Sourcing B2B (20% sconto distributore)" },
          { item: "Sensori Finestre Xiaomi Zigbee", type: "CAPEX", cost: "12.00 € / unità", source: "Sourcing all'ingrosso (Cina)" },
          { item: "Trasmettitore IR Broadlink RM4 Mini", type: "CAPEX", cost: "16.50 € / alloggio", source: "AliExpress (Sourcing quantitativo)" },
          { item: "Integrazione Automazioni Make.com", type: "OPEX", cost: "9.00 € / mese", source: "Costi operativi (Make Pro)" },
          { item: "Notifiche SMS ed Alert Twilio", type: "OPEX", cost: "15.00 € / mese", source: "Costi operativi (Twilio API)" },
          { item: "Assicurazione RC Prodotti & Danni", type: "OPEX", cost: "37.50 € / mese", source: "Consulenza Allianz (Stima)" },
          { item: "Consulenza Legale Privacy GDPR & Marchi", type: "CAPEX", cost: "600.00 € (Una tantum)", source: "Studio CLO partner" }
        ];
      } else if (state.project.type === "ecowrap") {
        rows = [
          { item: "Fornitura Minima Scatole (Terzista)", type: "CAPEX", cost: "200.00 € / lotto", source: "Sourcing scatolificio Emilia (Favini Crush)" },
          { item: "Abbonamento Landing Page Carrd.co", type: "OPEX", cost: "1.50 € / mese", source: "Sito Carrd.co (Piano Pro 19$/anno)" },
          { item: "Commissioni Gateway Stripe", type: "OPEX", cost: "1.4% + 0.25€ / trans.", source: "Stripe pricing" },
          { item: "Certificazione conformità MOCA per alimenti", type: "CAPEX", cost: "400.00 € (Una tantum)", source: "Ente Certificatore partner CLO" }
        ];
      }
      
      rows.forEach(r => {
        markdown += `| ${r.item} | ${r.type} | ${r.cost} | ${r.source} |\n`;
      });
      markdown += `\n`;
    }
    
    markdown += `***\n`;
  }
  
  DOM.reportContent.innerHTML = formatMarkdown(markdown);
  DOM.reportContent.dataset.rawMarkdown = markdown;

  // Gestione visibilità pannello approvazione
  const approvalContainer = document.getElementById("report-approval-container");
  const successBadge = document.getElementById("approval-success-badge");
  const btnApproveReport = document.getElementById("btn-final-approval-report");
  const btnApproveHeader = document.getElementById("btn-final-approval");
  
  if (state.currentPhase >= 1) {
    if (approvalContainer) approvalContainer.style.display = "block";
    if (btnApproveHeader) btnApproveHeader.style.display = "inline-flex";
    
    if (state.isApproved) {
      if (successBadge) successBadge.style.display = "block";
      if (btnApproveReport) {
        btnApproveReport.innerHTML = "🎉 Progetto Approvato e Archiviato";
        btnApproveReport.style.background = "var(--success)";
        btnApproveReport.disabled = true;
      }
      if (btnApproveHeader) {
        btnApproveHeader.innerHTML = "🎉 Approvato!";
        btnApproveHeader.style.background = "var(--success)";
        btnApproveHeader.disabled = true;
      }
    } else {
      if (successBadge) successBadge.style.display = "none";
      if (btnApproveReport) {
        btnApproveReport.innerHTML = "✅ Approva e Archivia Progetto (OneDrive Sync)";
        btnApproveReport.style.background = "var(--success-grad)";
        btnApproveReport.disabled = false;
      }
      if (btnApproveHeader) {
        btnApproveHeader.innerHTML = "✅ Approva Progetto";
        btnApproveHeader.style.background = "var(--success-grad)";
        btnApproveHeader.disabled = false;
      }
    }
  } else {
    if (approvalContainer) approvalContainer.style.display = "none";
    if (btnApproveHeader) btnApproveHeader.style.display = "none";
  }

  // Gestione pannello domande ed affinamento progetto (Q&A)
  const refinementContainer = document.getElementById("refinement-container");
  const refinementList = document.getElementById("refinement-questions-list");
  
  if (refinementContainer && refinementList) {
    const currentOrchOutput = state.orchestratorOutputs[state.currentPhase];
    const questions = currentOrchOutput ? currentOrchOutput.questions : [];
    
    if (questions && questions.length > 0 && !state.isApproved) {
      refinementContainer.style.display = "block";
      refinementList.innerHTML = "";
      
      questions.forEach((q, idx) => {
        const qId = `q-input-${state.currentPhase}-${idx}`;
        const div = document.createElement("div");
        div.className = "refinement-question-item";
        div.style.cssText = "display: flex; flex-direction: column; gap: 8px; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: 8px; margin-top: 10px;";
        div.innerHTML = `
          <div style="font-weight: 600; color: var(--text-main); font-size: 13px;">${idx + 1}. ${q}</div>
          <div style="display: flex; gap: 10px; align-items: center; margin-top: 4px;">
            <input type="text" id="${qId}" placeholder="Scrivi la tua risposta..." style="flex: 1; padding: 8px 12px; font-size: 13px; border-radius: 6px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.03); color: var(--text-main);" onkeydown="if(event.key === 'Enter') window.submitRefinementAnswer('${qId}', ${state.currentPhase}, ${idx})">
            <button class="btn btn-primary" style="padding: 8px 16px; font-size: 12px; cursor: pointer; border-radius: 6px; background: var(--accent-grad);" onclick="window.submitRefinementAnswer('${qId}', ${state.currentPhase}, ${idx})">Invia Risposta</button>
          </div>
        `;
        refinementList.appendChild(div);
      });
    } else {
      refinementContainer.style.display = "none";
    }
  }
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

// Parser Markdown semplice e sicuro con supporto allerta
function formatMarkdown(text) {
  if (!text) return "";
  
  // Escape HTML per sicurezza
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Ripristina tag span sicuri per colorazione scritte e stati
  html = html.replace(/&lt;span\s+(style=&quot;[^&]*&quot;)&gt;/gi, '<span $1>');
  html = html.replace(/&lt;span\s+(style=&amp;quot;[^&]*&amp;quot;)&gt;/gi, '<span $1>');
  html = html.replace(/&lt;span\s+(style="[^"]*")&gt;/gi, '<span $1>');
  html = html.replace(/&lt;\/span&gt;/gi, '</span>');
    
  // Parsea i blockquotes di allerta in box callout colorati
  const lines = html.split("\n");
  let inBlockquote = false;
  let blockquoteLines = [];
  let result = [];
  
  for (let line of lines) {
    let trimmedLine = line.trim();
    if (trimmedLine.startsWith("&gt;")) {
      inBlockquote = true;
      let content = trimmedLine.replace(/^&gt;\s*/, "");
      blockquoteLines.push(content);
    } else {
      if (inBlockquote) {
        result.push(renderBlockquoteHtml(blockquoteLines));
        blockquoteLines = [];
        inBlockquote = false;
      }
      result.push(line);
    }
  }
  if (inBlockquote) {
    result.push(renderBlockquoteHtml(blockquoteLines));
  }
  html = result.join("\n");
  
  // Sostituzioni Markdown standard
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
  
  // Evidenziazione rossa per veti, bocciature ed emoji di allerta
  html = html.replace(/\b(VETO|BOCCIATO|RED FLAG|INCOMPATIBILITÀ|Critiche|Obiezioni)\b/gi, '<span style="color: var(--danger); font-weight: bold;">$1</span>');
  html = html.replace(/(⚠️|🚨)/g, '<span style="color: var(--danger); font-weight: bold;">$1</span>');
  
  return html;
}

// Renderizzazione dei box allerta (callout-danger, callout-warning, callout-info)
function renderBlockquoteHtml(lines) {
  let type = "info";
  let title = "NOTA INFORMATIVA";
  let contentLines = [];
  
  for (let line of lines) {
    if (line.includes("[!CAUTION]") || line.includes("[!WARNING]") || line.includes("[!IMPORTANT]") || line.includes("[!NOTE]") || line.includes("[!INFO]")) {
      if (line.includes("[!CAUTION]")) {
        type = "danger";
        title = "PUNTO CRITICO / VETO 🚨";
      } else if (line.includes("[!WARNING]")) {
        type = "warning";
        title = "ATTENZIONE / RISCHIO ⚠️";
      } else if (line.includes("[!IMPORTANT]")) {
        type = "warning";
        title = "DETTAGLIO IMPORTANTE ⚠️";
      } else {
        type = "info";
        title = "NOTA INFORMATIVA 📄";
      }
    } else {
      contentLines.push(line);
    }
  }
  
  const content = contentLines.join(" ");
  return `<div class="callout-box callout-${type}"><h4>${title}</h4><p>${content}</p></div>`;
}

// Genera il grafico di Break-Even lineare interattivo in SVG
function renderBreakEvenChart(capex, opex, price, cogs, unitName) {
  const wrapper = document.getElementById("break-even-svg-wrapper");
  const container = document.getElementById("break-even-chart-container");
  if (!wrapper || !container) return;
  
  container.style.display = "block";
  
  // Calcola Volume per BEP al mese 7
  const targetBEPMonth = 7;
  const marginPerUnit = price - cogs;
  const safeMargin = marginPerUnit > 0 ? marginPerUnit : 1.0;
  const V = (capex / targetBEPMonth + opex) / safeMargin;
  
  // Array dei dati sui 12 mesi (0 a 12)
  const data = [];
  for (let m = 0; m <= 12; m++) {
    const cost = capex + (opex + cogs * V) * m;
    const rev = price * V * m;
    data.push({ month: m, cost, revenue: rev });
  }
  
  // Coordinate SVG
  const width = wrapper.clientWidth || 500;
  const height = 260;
  const paddingLeft = 65;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 45;
  
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;
  
  // Trova il massimo valore di Y per scalare il grafico
  const maxVal = Math.max(data[12].cost, data[12].revenue) * 1.1;
  
  const getX = (m) => paddingLeft + (m / 12) * plotWidth;
  const getY = (val) => paddingTop + plotHeight - (val / maxVal) * plotHeight;
  
  // Costruisci le linee
  let costPath = `M ${getX(data[0].month)} ${getY(data[0].cost)}`;
  let revPath = `M ${getX(data[0].month)} ${getY(data[0].revenue)}`;
  
  for (let i = 1; i < data.length; i++) {
    costPath += ` L ${getX(data[i].month)} ${getY(data[i].cost)}`;
    revPath += ` L ${getX(data[i].month)} ${getY(data[i].revenue)}`;
  }
  
  // Disegna l'SVG
  let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible;">`;
  
  // Griglia orizzontale
  for (let i = 0; i <= 4; i++) {
    const yVal = (maxVal / 4) * i;
    const y = getY(yVal);
    svg += `<line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" class="chart-grid" />`;
    svg += `<text x="${paddingLeft - 8}" y="${y + 4}" text-anchor="end" class="chart-text" fill="var(--text-muted)">${Math.round(yVal).toLocaleString("it-IT")} €</text>`;
  }
  
  // Griglia verticale
  for (let m = 0; m <= 12; m++) {
    const x = getX(m);
    svg += `<line x1="${x}" y1="${paddingTop}" x2="${x}" y2="${paddingTop + plotHeight}" class="chart-grid" />`;
    if (m % 2 === 0 || m === 12) {
      svg += `<text x="${x}" y="${paddingTop + plotHeight + 16}" text-anchor="middle" class="chart-text" fill="var(--text-muted)">M. ${m}</text>`;
    }
  }
  
  // Assi
  svg += `<line x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${paddingTop + plotHeight}" class="chart-axis" stroke="var(--glass-border)" />`;
  svg += `<line x1="${paddingLeft}" y1="${paddingTop + plotHeight}" x2="${width - paddingRight}" y2="${paddingTop + plotHeight}" class="chart-axis" stroke="var(--glass-border)" />`;
  
  // Tracciati linee
  svg += `<path d="${costPath}" class="chart-line-cost" fill="none" stroke="#8b5cf6" stroke-width="3" />`;
  svg += `<path d="${revPath}" class="chart-line-revenue" fill="none" stroke="#10b981" stroke-width="3" stroke-dasharray="1" />`;
  
  // Punto BEP al mese 7
  const bepx = getX(targetBEPMonth);
  const bepy = getY(data[targetBEPMonth].cost);
  svg += `<circle cx="${bepx}" cy="${bepy}" r="6" class="chart-point-bep" fill="#f59e0b" stroke="#fff" stroke-width="2" />`;
  
  // Testo BEP
  svg += `<text x="${bepx}" y="${bepy - 12}" text-anchor="middle" class="chart-label" fill="#f59e0b" style="font-size: 11px; font-weight: bold; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
    Break-Even (Mese ${targetBEPMonth})
  </text>`;
  
  // Legenda
  const legY = paddingTop - 15;
  svg += `
    <g transform="translate(${paddingLeft}, ${legY})">
      <rect x="0" y="0" width="10" height="10" fill="#8b5cf6" rx="2" />
      <text x="14" y="9" class="chart-text" fill="var(--text-main)" style="font-size: 9px;">Costi Cumulati</text>
      
      <rect x="110" y="0" width="10" height="10" fill="#10b981" rx="2" />
      <text x="124" y="9" class="chart-text" fill="var(--text-main)" style="font-size: 9px;">Ricavi Cumulati</text>
      
      <circle cx="230" cy="5" r="4" fill="#f59e0b" />
      <text x="238" y="9" class="chart-text" fill="var(--text-main)" style="font-size: 9px;">Break-Even</text>
    </g>
  `;
  
  // Dettaglio volume sotto
  svg += `
    <text x="${paddingLeft + plotWidth / 2}" y="${height - 8}" text-anchor="middle" class="chart-text" style="font-weight: 600; fill: var(--primary); font-size: 10px;">
      Volume target per payback a 7 mesi: ~${Math.round(V).toLocaleString("it-IT")} ${unitName}/mese (~${Math.round(V/30)}/giorno)
    </text>
  `;
  
  svg += `</svg>`;
  wrapper.innerHTML = svg;
}

// Renderizza la tabella delle proiezioni finanziarie mensili a 12 mesi
function renderMonthlyProjectionsTable(capex, opex, price, cogs, unitName, targetVolumeNum) {
  const container = document.getElementById("monthly-projections-container");
  const tbody = document.getElementById("monthly-projections-table-body");
  if (!tbody || !container) return;
  
  container.style.display = "block";
  tbody.innerHTML = "";
  
  const rampUp = [0.15, 0.30, 0.50, 0.70, 0.90, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00];
  let cumulativeCash = 0;
  
  for (let m = 1; m <= 12; m++) {
    const rate = rampUp[m - 1];
    const vol = Math.max(1, Math.round(targetVolumeNum * rate));
    const rev = vol * price;
    const fixed = opex;
    const variable = vol * cogs;
    const startup = (m === 1) ? capex : 0;
    const netProfit = rev - fixed - variable - startup;
    cumulativeCash += netProfit;
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>Mese ${m}</strong></td>
      <td><span style="font-weight: 500">${vol} ${unitName}</span> <span style="font-size: 11px; color: var(--text-muted)">(${Math.round(rate * 100)}%)</span></td>
      <td style="font-family: monospace; font-weight: bold; color: var(--text-main)">${rev.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €</td>
      <td style="font-family: monospace; color: var(--text-muted)">${fixed.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €</td>
      <td style="font-family: monospace; color: var(--text-muted)">${variable.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €</td>
      <td style="font-family: monospace; color: ${startup > 0 ? "#f87171" : "var(--text-muted)"}">${startup > 0 ? startup.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €" : "-"}</td>
      <td style="font-family: monospace; font-weight: bold; color: ${netProfit >= 0 ? "var(--success)" : "#f87171"}">${netProfit >= 0 ? "+" : ""}${netProfit.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €</td>
      <td style="font-family: monospace; font-weight: bold; color: ${cumulativeCash >= 0 ? "var(--success)" : "#f87171"}">${cumulativeCash >= 0 ? "+" : ""}${cumulativeCash.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €</td>
    `;
    tbody.appendChild(tr);
  }
}

// Estrae domande da un testo markdown generato da Gemini
function extractQuestionsFromText(text) {
  if (!text) return [];
  const lines = text.split("\n");
  const questions = [];
  
  for (let line of lines) {
    let trimmed = line.trim();
    if (trimmed.startsWith(">")) continue;
    
    if (trimmed.includes("?") && (
      /^[0-9]+[\.\)]/.test(trimmed) || 
      trimmed.startsWith("-") || 
      trimmed.startsWith("*") ||
      trimmed.startsWith("•") ||
      trimmed.length > 15
    )) {
      let cleaned = trimmed
        .replace(/^[0-9]+[\.\)]\s*/, "")
        .replace(/^[\-\*\u2022]\s*/, "")
        .trim();
      if (cleaned.length > 5 && cleaned.endsWith("?")) {
        questions.push(cleaned);
      }
    }
  }
  
  if (questions.length === 0) {
    let foundRefinement = false;
    for (let line of lines) {
      let trimmed = line.trim();
      if (trimmed.toLowerCase().includes("domand") || trimmed.toLowerCase().includes("affin")) {
        foundRefinement = true;
        continue;
      }
      if (foundRefinement && /^[0-9]+[\.\)]/.test(trimmed)) {
        let cleaned = trimmed.replace(/^[0-9]+[\.\)]\s*/, "").trim();
        if (cleaned.length > 5) {
          questions.push(cleaned);
        }
      }
    }
  }
  
  return questions.slice(0, 4);
}

// Mostra o nasconde il form di Fase 0 ed il pannello chat
function togglePhase0View() {
  const formContainer = document.getElementById("starter-form-container");
  const chatMessages = DOM.chatMessages;
  const chatInputArea = document.getElementById("chat-input-area");
  
  if (state.currentPhase === 0) {
    if (formContainer) formContainer.style.display = "block";
    if (chatMessages) chatMessages.style.display = "none";
    if (chatInputArea) chatInputArea.style.display = "none";
  } else {
    if (formContainer) formContainer.style.display = "none";
    if (chatMessages) chatMessages.style.display = "flex";
    if (chatInputArea) chatInputArea.style.display = "flex";
  }
}

// Gestore per il caricamento dei file allegati
function handleFileAttachment(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  const fileName = file.name;
  const fileSize = file.size;
  const fileMime = file.type;
  
  // Resetta i vecchi allegati prima di caricarne uno nuovo
  state.project.attachedFile = null;
  state.project.attachedImage = null;
  
  if (fileMime && fileMime.startsWith("image/")) {
    reader.onload = function(evt) {
      const dataUrl = evt.target.result;
      const base64Data = dataUrl.split(",")[1];
      state.project.attachedImage = {
        mimeType: fileMime,
        data: base64Data,
        name: fileName,
        size: fileSize
      };
      updateAttachmentBadgeUI();
    };
    reader.readAsDataURL(file);
  } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    reader.onload = function(evt) {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csvText = XLSX.utils.sheet_to_csv(worksheet);
        
        state.project.attachedFile = {
          name: fileName,
          size: fileSize,
          content: csvText,
          type: "excel"
        };
        updateAttachmentBadgeUI();
      } catch (err) {
        alert("Errore nella lettura del file Excel: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    // Altri file di testo (.txt, .md, .csv, .json)
    reader.onload = function(evt) {
      state.project.attachedFile = {
        name: fileName,
        size: fileSize,
        content: evt.target.result,
        type: "text"
      };
      updateAttachmentBadgeUI();
    };
    reader.readAsText(file);
  }
  
  // Resetta il file input per consentire il re-upload dello stesso file
  e.target.value = "";
}

// Aggiorna l'interfaccia grafica dei badge degli allegati
function updateAttachmentBadgeUI() {
  const container = DOM.attachmentBadgeContainer || document.getElementById("attachment-badge-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  const file = state.project.attachedFile;
  const image = state.project.attachedImage;
  
  if (!file && !image) {
    container.style.display = "none";
    return;
  }
  
  container.style.display = "flex";
  
  const badge = document.createElement("div");
  badge.className = "attachment-badge";
  
  if (image) {
    badge.innerHTML = `
      <img class="attachment-preview-img" src="data:${image.mimeType};base64,${image.data}">
      <span class="file-name">${image.name}</span>
      <span class="file-size">(${Math.round(image.size / 1024)} KB)</span>
      <button class="btn-remove-file" title="Rimuovi allegato">&times;</button>
    `;
    badge.querySelector(".btn-remove-file").addEventListener("click", () => {
      state.project.attachedImage = null;
      updateAttachmentBadgeUI();
    });
  } else if (file) {
    const isExcel = file.type === "excel";
    badge.innerHTML = `
      <span class="file-icon">${isExcel ? "📊" : "📄"}</span>
      <span class="file-name">${file.name}</span>
      <span class="file-size">(${Math.round(file.size / 1024)} KB)</span>
      <button class="btn-remove-file" title="Rimuovi allegato">&times;</button>
    `;
    badge.querySelector(".btn-remove-file").addEventListener("click", () => {
      state.project.attachedFile = null;
      updateAttachmentBadgeUI();
    });
  }
  
  container.appendChild(badge);
}

// ==========================================
// CHAT FINANZIARIA INTERATTIVA & REALIGNMENT
// ==========================================

// Visualizza i messaggi della discussione finanziaria
function renderFinancialsChatMessages() {
  const chatBox = document.getElementById("financials-chat-box");
  if (!chatBox) return;
  
  chatBox.innerHTML = "";
  const history = state.financialsChatHistory || [];
  
  if (history.length === 0) {
    chatBox.innerHTML = `
      <div class="brainstorm-msg agent">
        <span class="brainstorm-msg-sender">CFO / Finance Advisor</span>
        <div class="brainstorm-msg-bubble" style="border-color: var(--success)">
          Benvenuto nella sessione di analisi finanziaria. Posso spiegarti le proiezioni di costo, i margini o i calcoli del Break-Even Point. Chiedimi pure qualsiasi chiarimento sui numeri riportati.
        </div>
      </div>
    `;
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
    } else if (msg.role === "system") {
      const msgDiv = document.createElement("div");
      msgDiv.className = "brainstorm-msg agent";
      msgDiv.innerHTML = `
        <span class="brainstorm-msg-sender" style="color: var(--primary)">Sistema Antigravity</span>
        <div class="brainstorm-msg-bubble" style="border-color: var(--primary); background: rgba(99,102,241,0.05)">${formatMarkdown(msg.text)}</div>
      `;
      chatBox.appendChild(msgDiv);
    } else {
      // Risposta del CFO
      const agentDiv = document.createElement("div");
      agentDiv.className = "brainstorm-msg agent";
      agentDiv.innerHTML = `
        <span class="brainstorm-msg-sender">CFO / Finance Advisor</span>
        <div class="brainstorm-msg-bubble" style="border-color: var(--success)">${formatMarkdown(msg.agentText)}</div>
      `;
      chatBox.appendChild(agentDiv);
      
      // Risposta del CEO (Orchestratore)
      if (msg.ceoText) {
        const ceoDiv = document.createElement("div");
        ceoDiv.className = "brainstorm-msg ceo";
        ceoDiv.innerHTML = `
          <span class="brainstorm-msg-sender">Orchestratore Master (CEO)</span>
          <div class="brainstorm-msg-bubble">${formatMarkdown(msg.ceoText)}</div>
        `;
        chatBox.appendChild(ceoDiv);
      }
    }
  });
  
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Invia ed elabora il messaggio di discussione finanziaria
async function handleFinancialsChatSubmit(message) {
  if (!message) return;
  
  // Aggiungi il messaggio dell'utente alla cronologia
  state.financialsChatHistory.push({ role: "user", text: message });
  saveCurrentProjectToStorage();
  renderFinancialsChatMessages();
  
  const q = message.toLowerCase();
  let matched = false;
  let overrideMsg = "";
  
  // 1. Rilevamento cambi opzione strategica finanziaria
  let newOption = "";
  if (q.includes("acquisto") || q.includes("in-house") || q.includes("in house") || (q.includes("proprio") && !q.includes("conto")) || q.includes("proprietario") || q.includes("diretto")) {
    newOption = "acquisto";
  } else if (q.includes("leasing") || q.includes("nolegg") || q.includes("no-code") || q.includes("nocode") || q.includes("dropship") || q.includes("fulfillment") || q.includes("sub-appalto") || q.includes("subappalto") || q.includes("outsourcing")) {
    newOption = "leasing";
  } else if (q.includes("joint venture") || q.includes("jv") || q.includes("cto") || q.includes("equity") || q.includes("conto vendita") || q.includes("rev-share") || q.includes("rev share") || q.includes("partnership") || q.includes("partner")) {
    newOption = "jv";
  }

  if (newOption && newOption !== state.financialOption) {
    state.financialOption = newOption;
    if (state.project) {
      state.project.financialOption = newOption;
      state.project.hasLeasingOption = (newOption === "leasing");
    }
    overrideMsg += `Opzione strategica cambiata in **${newOption.toUpperCase()}**. `;
    matched = true;
  }
  
  // 2. Rilevamento cambi parametri con numeri
  const numRegex = /(\d+[\.,]?\d*)/;
  const match = q.match(numRegex);
  if (match) {
    const value = parseFloat(match[1].replace(',', '.'));
    if (!isNaN(value)) {
      if (q.includes("prezzo") || q.includes("tariffa") || q.includes("ricavo")) {
        state.financialOverrides.price = value;
        overrideMsg += `Prezzo impostato a **${value.toFixed(2)} €**. `;
        matched = true;
      }
      if (q.includes("affitto") || q.includes("locazione") || q.includes("rent")) {
        state.financialOverrides.rent = value;
        overrideMsg += `Affitto/Locazione impostato a **${value.toFixed(2)} €**. `;
        matched = true;
      }
      if (q.includes("elettric") || q.includes("corrente") || q.includes("energia")) {
        state.financialOverrides.electricity = value;
        overrideMsg += `Costo Elettricità impostato a **${value.toFixed(2)} €**. `;
        matched = true;
      }
      if (q.includes("cogs") || q.includes("materie") || q.includes("costo unitario") || q.includes("ingredient")) {
        state.financialOverrides.cogs = value;
        overrideMsg += `COGS/Costo unitario impostato a **${value.toFixed(2)} €**. `;
        matched = true;
      }
    }
  }
  
  // 3. Rilevamento reset parametri
  if (q.includes("reset") || q.includes("ripristina") || q.includes("cancella overrides")) {
    state.financialOverrides = {};
    overrideMsg = "Tutti i parametri finanziari sono stati ripristinati ai valori di benchmark standard.";
    matched = true;
  }
  
  if (matched) {
    // Aggiungi un messaggio di sistema e avvia il ricalcolo e riallineamento
    state.financialsChatHistory.push({
      role: "system",
      text: overrideMsg + " Ricalcolo del piano finanziario e riallineamento della boardroom in corso..."
    });
    saveCurrentProjectToStorage();
    renderFinancialsChatMessages();
    
    // Mostriamo un indicatore visuale
    const chatBox = document.getElementById("financials-chat-box");
    const loader = document.createElement("div");
    loader.className = "brainstorm-msg agent";
    loader.innerHTML = `
      <span class="brainstorm-msg-sender">CFO / Finance Advisor</span>
      <div class="brainstorm-msg-bubble">Sto ricalcolando e allineando tutti gli agenti... <span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></div>
    `;
    if (chatBox) {
      chatBox.appendChild(loader);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    regenerateAllAgentReports();
  } else {
    // Mostriamo indicatore prima di rispondere con brainstorm standard
    const chatBox = document.getElementById("financials-chat-box");
    const loader = document.createElement("div");
    loader.className = "brainstorm-msg agent";
    loader.innerHTML = `
      <span class="brainstorm-msg-sender">CFO / Finance Advisor</span>
      <div class="brainstorm-msg-bubble"><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></div>
    `;
    if (chatBox) {
      chatBox.appendChild(loader);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
    info.financialOption = state.financialOption;
    info.hasLeasingOption = (state.financialOption === "leasing");
    
    const response = window.LocalAgentSimulationEngine.handleFinancialsBrainstorm(info, message, state.financialsChatHistory);
    
    // Rimuove il loader se inserito
    if (chatBox && loader.parentNode) {
      chatBox.removeChild(loader);
    }
    
    state.financialsChatHistory.push({
      role: "cfo",
      agentText: response.agentText,
      ceoText: response.ceoText
    });
    
    saveCurrentProjectToStorage();
    renderFinancialsChatMessages();
  }
}

// Aggiunge un messaggio di sistema per cambi opzioni dal chip
function addFinancialsSystemMessage(option) {
  let optionName = "Acquisto Diretto / In-House";
  
  // Determiniamo i testi delle opzioni in base al settore
  const info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
  if (info.sector === "saas" || info.sector === "mobile_app" || info.sector === "marketplace") {
    if (option === "leasing") optionName = "No-Code Stack";
    if (option === "jv") optionName = "CTO Equity Share";
  } else if (info.sector === "ecommerce" || info.sector === "retail") {
    if (option === "acquisto") optionName = "Magazzino Proprio";
    if (option === "leasing") optionName = "Dropshipping / Fulfillment";
    if (option === "jv") optionName = "Conto Vendita / Partner";
  } else if (info.sector === "non_profit") {
    if (option === "acquisto") optionName = "Fondi Propri / Donazioni";
    if (option === "leasing") optionName = "Bandi Pubblici / ETS";
    if (option === "jv") optionName = "Sponsor CSR / Aziende";
  } else if (info.sector === "media_content") {
    if (option === "acquisto") optionName = "Produzione Interna";
    if (option === "leasing") optionName = "Outsourcing / Editor";
    if (option === "jv") optionName = "Co-Produzione / Sponsor";
  } else if (info.isVending) {
    if (option === "acquisto") optionName = "Acquisto Diretto";
    if (option === "leasing") optionName = "Leasing / Noleggio";
    if (option === "jv") optionName = "Joint Venture";
  } else {
    if (option === "acquisto") optionName = "Agenzia Proprietaria";
    if (option === "leasing") optionName = "Sub-appalto / Outsourcing";
    if (option === "jv") optionName = "Partnership / Rev-Share";
  }
  
  const sysMsg = `Opzione strategica modificata manualmente in: **${optionName}**. Ricalcolo del piano finanziario e allineamento in corso...`;
  
  state.financialsChatHistory.push({
    role: "system",
    text: sysMsg
  });
  
  // Eseguiamo anche una richiesta automatica di brainstorming per spiegare l'opzione
  info.financialOption = option;
  info.hasLeasingOption = (option === "leasing");
  
  const response = window.LocalAgentSimulationEngine.handleFinancialsBrainstorm(info, option, state.financialsChatHistory);
  state.financialsChatHistory.push({
    role: "cfo",
    agentText: response.agentText,
    ceoText: response.ceoText
  });
  
  // Rigenera tutti i report per riflettere l'opzione
  regenerateAllAgentReports();
}

// Rigenera tutti i report della boardroom per allinearsi con i nuovi parametri
function regenerateAllAgentReports() {
  if (state.currentPhase === 0) return;
  
  const info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
  info.financialOption = state.financialOption;
  info.hasLeasingOption = (state.financialOption === "leasing");
  info.financialOverrides = state.financialOverrides || {};
  
  // Rigenera ciascuna fase completata
  for (let phaseNum = 1; phaseNum <= state.currentPhase; phaseNum++) {
    if (!state.contributions[phaseNum]) {
      state.contributions[phaseNum] = {};
    }
    
    state.enabledAgents.forEach(agentKey => {
      const report = window.LocalAgentSimulationEngine.generateAgentReport(
        info,
        phaseNum,
        agentKey,
        state.answers,
        state.project.attachedFile,
        state.project.attachedImage
      );
      state.contributions[phaseNum][agentKey] = report;
    });
    
    const orchReport = window.LocalAgentSimulationEngine.generateOrchestratorReport(
      info,
      phaseNum,
      {},
      state.answers,
      state.project.attachedFile,
      state.project.attachedImage
    );
    state.orchestratorOutputs[phaseNum] = {
      text: orchReport.text,
      questions: orchReport.questions
    };
  }
  
  saveCurrentProjectToStorage();
  
  // Aggiorna la UI
  updateLeanCanvasUI();
  updateFinancialsUI();
  updateReportUI();
  renderBoardroomGrid();
}

// ==========================================
// APPROVAZIONE PROGETTO & DOWNLOAD/ONEDRIVE
// ==========================================

// Approva il progetto ed esporta i file in locale e via browser
function approveAndExportProject() {
  if (state.currentPhase === 0) {
    alert("Inizia il progetto prima di approvarlo.");
    return;
  }
  
  state.isApproved = true;
  if (state.project) {
    state.project.isApproved = true;
  }
  
  saveCurrentProjectToStorage();
  
  // Aggiorna l'interfaccia (mostra badge e disabilita bottoni)
  updateReportUI();
  
  // Avvia i download nel browser
  downloadFullReportMD();
  downloadFinancialsCSV();
  
  // Notifica l'utente
  appendSystemMessage("🎉 Progetto Approvato e Archiviato con successo! I file sono stati scaricati.");
}

// Download del report markdown consolidato
function downloadFullReportMD() {
  const markdownText = DOM.reportContent.dataset.rawMarkdown;
  if (!markdownText) {
    alert("Nessun report generato da esportare al momento.");
    return;
  }
  
  const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const cleanName = state.project.name.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');
  link.setAttribute("download", `${cleanName}_Report_Completo.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Download del piano finanziario in CSV (UTF-8 BOM per Excel)
function downloadFinancialsCSV() {
  let rows = [];
  if (state.project.type === "custom") {
    const info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
    const fin = window.LocalAgentSimulationEngine.generateFinancials(info, state.financialOption, state.financialOverrides || {});
    rows = fin.rows;
  } else if (state.project.type === "gardatech") {
    rows = [
      { item: "Kit Serratura Nuki Smart Lock", type: "CAPEX", cost: "80.00 € / unità", source: "Sourcing B2B (20% sconto distributore)" },
      { item: "Sensori Finestre Xiaomi Zigbee", type: "CAPEX", cost: "12.00 € / unità", source: "Sourcing all'ingrosso (Cina)" },
      { item: "Trasmettitore IR Broadlink RM4 Mini", type: "CAPEX", cost: "16.50 € / alloggio", source: "AliExpress (Sourcing quantitativo)" },
      { item: "Integrazione Automazioni Make.com", type: "OPEX", cost: "9.00 € / mese", source: "Costi operativi (Make Pro)" },
      { item: "Notifiche SMS ed Alert Twilio", type: "OPEX", cost: "15.00 € / mese", source: "Costi operativi (Twilio API)" },
      { item: "Assicurazione RC Prodotti & Danni", type: "OPEX", cost: "37.50 € / mese", source: "Consulenza Allianz (Stima)" },
      { item: "Consulenza Legale Privacy GDPR & Marchi", type: "CAPEX", cost: "600.00 € (Una tantum)", source: "Studio CLO partner" }
    ];
  } else if (state.project.type === "ecowrap") {
    rows = [
      { item: "Fornitura Minima Scatole (Terzista)", type: "CAPEX", cost: "200.00 € / lotto", source: "Sourcing scatolificio Emilia (Favini Crush)" },
      { item: "Abbonamento Landing Page Carrd.co", type: "OPEX", cost: "1.50 € / mese", source: "Sito Carrd.co (Piano Pro 19$/anno)" },
      { item: "Commissioni Gateway Stripe", type: "OPEX", cost: "1.4% + 0.25€ / trans.", source: "Stripe pricing" },
      { item: "Certificazione conformità MOCA per alimenti", type: "CAPEX", cost: "400.00 € (Una tantum)", source: "Ente Certificatore partner CLO" }
    ];
  }

  let csvContent = "\uFEFF"; // UTF-8 BOM
  csvContent += "Elemento / Voce di Spesa;Tipo;Costo Stimato;Fonte / Criterio Logico\r\n";
  
  rows.forEach(r => {
    const item = r.item.replace(/"/g, '""');
    const cost = r.cost.replace(/"/g, '""');
    const source = r.source.replace(/"/g, '""');
    csvContent += `"${item}";"${r.type}";"${cost}";"${source}"\r\n`;
  });
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const cleanName = state.project.name.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');
  link.setAttribute("download", `${cleanName}_Piano_Finanziario.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================================================
// FUNZIONI AGGIUNTIVE DI ALLINEAMENTO E INTERATTIVITÀ (BOARDROOM SUITE)
// ============================================================================

// Esegue il parsing di messaggi per estrarre parametri finanziari
function extractFinancialParameters(text) {
  const overrides = {};
  if (!text) return overrides;
  
  // 1. Cerca il tag strutturato: [UPDATE_FINANCIAL: price=X, rent=Y, cogs=Z, electricity=W, machineCost=K, leaseFee=L, partnerShare=S]
  const tagRegex = /\[UPDATE_FINANCIAL:\s*([^\]]+)\]/i;
  const match = text.match(tagRegex);
  if (match) {
    const parts = match[1].split(",");
    parts.forEach(part => {
      const kv = part.split("=");
      if (kv.length === 2) {
        const key = kv[0].trim().toLowerCase();
        const val = parseFloat(kv[1].trim());
        if (!isNaN(val)) {
          if (key === "price" || key === "prezzo") overrides.price = val;
          else if (key === "rent" || key === "affitto") overrides.rent = val;
          else if (key === "cogs" || key === "costo") overrides.cogs = val;
          else if (key === "electricity" || key === "energia" || key === "elettricità") overrides.electricity = val;
          else if (key === "machinecost" || key === "macchinario") overrides.machineCost = val;
          else if (key === "leasefee" || key === "noleggio" || key === "leasing") overrides.leaseFee = val;
          else if (key === "partnershare" || key === "royalties" || key === "equity") overrides.partnerShare = val;
        }
      }
    });
  }
  
  // 2. Fallback Regex in linguaggio naturale
  const lower = text.toLowerCase();
  
  const priceMatches = lower.match(/(?:prezzo medio|prezzo di vendita|scontrino medio|scontrino|price)\s*(?:a|di|da|impostato\s+a|=)?\s*(\d+(?:[\.,]\d+)?)\s*(?:€|euro)/i) ||
                       lower.match(/(?:prezzo|price)\s*=\s*(\d+(?:[\.,]\d+)?)/i);
  if (priceMatches) {
    const p = parseFloat(priceMatches[1].replace(",", "."));
    if (!isNaN(p)) overrides.price = p;
  }
  
  const rentMatches = lower.match(/(?:affitto|canone affitto|canone mensile|rent|mutuo|spese fisse|spese mensili|spese al mese|spese)\s*(?:a|di|da|impostato\s+a|=)?\s*(\d+(?:[\.,]\d+)?)\s*(?:€|euro)/i) ||
                      lower.match(/(?:affitto|rent|mutuo|spese)\s*=\s*(\d+(?:[\.,]\d+)?)/i) ||
                      lower.match(/(\d+(?:[\.,]\d+)?)\s*(?:€|euro)?\s*(?:di|per|a titolo di)?\s*(?:spese al mese|spese mensili|spese|mutuo|affitto|rent)/i);
  if (rentMatches) {
    const r = parseFloat(rentMatches[1].replace(",", "."));
    if (!isNaN(r)) overrides.rent = r;
  }

  const cogsMatches = lower.match(/(?:costo materie|costo ingredienti|costo unitario|cogs)\s*(?:a|di|da|impostato\s+a|=)?\s*(\d+(?:[\.,]\d+)?)\s*(?:€|euro)/i) ||
                      lower.match(/(?:cogs)\s*=\s*(\d+(?:[\.,]\d+)?)/i);
  if (cogsMatches) {
    const c = parseFloat(cogsMatches[1].replace(",", "."));
    if (!isNaN(c)) overrides.cogs = c;
  }
  
  const electricityMatches = lower.match(/(?:elettricità|corrente|energia|electricity)\s*(?:a|di|da|impostato\s+a|=)?\s*(\d+(?:[\.,]\d+)?)\s*(?:€|euro)/i) ||
                             lower.match(/(?:energia|electricity)\s*=\s*(\d+(?:[\.,]\d+)?)/i);
  if (electricityMatches) {
    const el = parseFloat(electricityMatches[1].replace(",", "."));
    if (!isNaN(el)) overrides.electricity = el;
  }

  const machineMatches = lower.match(/(?:costo macchinario|acquisto macchinario|prezzo macchinario|machinecost|machine cost)\s*(?:a|di|da|impostato\s+a|=)?\s*(\d+(?:[\.,]\d+)?)\s*(?:€|euro)/i) ||
                         lower.match(/(?:machinecost)\s*=\s*(\d+(?:[\.,]\d+)?)/i);
  if (machineMatches) {
    const m = parseFloat(machineMatches[1].replace(",", "."));
    if (!isNaN(m)) overrides.machineCost = m;
  }

  const leaseMatches = lower.match(/(?:noleggio operativo|canone noleggio|rata leasing|quota leasing|leasefee|lease fee)\s*(?:a|di|da|impostato\s+a|=)?\s*(\d+(?:[\.,]\d+)?)\s*(?:€|euro)/i) ||
                        lower.match(/(?:leasefee|leasing)\s*=\s*(\d+(?:[\.,]\d+)?)/i);
  if (leaseMatches) {
    const l = parseFloat(leaseMatches[1].replace(",", "."));
    if (!isNaN(l)) overrides.leaseFee = l;
  }

  return overrides;
}

// Converte un esadecimale in RGB per la gestione delle trasparenze in inline styles
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  const num = parseInt(hex, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

// Naviga programmaticamente verso un tab selezionando un agente della boardroom
function switchTabAndSelectAgent(tabName, agentKey) {
  DOM.tabs.forEach(t => t.classList.remove("active"));
  DOM.panes.forEach(p => p.classList.remove("active"));
  
  const tabBtn = Array.from(DOM.tabs).find(t => t.dataset.tab === tabName);
  if (tabBtn) tabBtn.classList.add("active");
  
  const targetPane = document.getElementById(tabName);
  if (targetPane) targetPane.classList.add("active");
  
  state.activeTab = tabName;
  
  if (tabName === "boardroom" && agentKey) {
    state.activeAgentDetails = agentKey;
    renderBoardroomGrid();
    renderAgentDetails(agentKey);
  } else {
    renderTabSpecificViews();
  }
}

// Configura i riquadri del Lean Canvas per essere cliccabili
function setupLeanCanvasInteractivity() {
  const mappings = {
    ".canvas-problem": "cmo",
    ".canvas-solution": "cpo",
    ".canvas-key-metrics": "cso",
    ".canvas-uvp": "cco",
    ".canvas-unfair-advantage": "cmo",
    ".canvas-channels": "sales",
    ".canvas-customer-segments": "cmo",
    ".canvas-cost-structure": "sourcing",
    ".canvas-revenue-streams": "cfo"
  };

  Object.entries(mappings).forEach(([selector, agentKey]) => {
    const box = document.querySelector(selector);
    if (box) {
      box.style.cursor = "pointer";
      
      const meta = AGENT_METADATA[agentKey];
      box.title = `Clicca per parlare con l'Agente ${meta.name} (${meta.role})`;
      
      // Controlla se c'è già il badge, altrimenti lo aggiunge
      let badge = box.querySelector(".canvas-agent-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "canvas-agent-badge";
        badge.style.background = `rgba(${hexToRgb(meta.color)}, 0.15)`;
        badge.style.color = meta.color;
        badge.style.border = `1px solid rgba(${hexToRgb(meta.color)}, 0.3)`;
        badge.innerHTML = `${meta.icon} Parla con ${agentKey.toUpperCase()}`;
        box.appendChild(badge);
      }
      
      // Use onclick directly to overwrite any existing listener cleanly without cloning elements
      box.onclick = () => {
        switchTabAndSelectAgent("boardroom", agentKey);
      };
    }
  });
}

// Invia ed elabora il messaggio di discussione globale nella boardroom (Report tab)
async function handleGlobalChatSubmit(message) {
  if (!message) return;
  
  const chatInput = document.getElementById("global-chat-input");
  const chatBox = document.getElementById("global-chat-box");
  if (!chatBox) return;
  
  if (!state.globalChatHistory) state.globalChatHistory = [];
  
  state.globalChatHistory.push({ role: "user", text: message });
  renderGlobalChatMessages();
  if (chatInput) chatInput.value = "";
  
  const loader = document.createElement("div");
  loader.className = "brainstorm-msg agent";
  loader.innerHTML = `
    <span class="brainstorm-msg-sender">👤 Consiglio di Amministrazione...</span>
    <div class="brainstorm-msg-bubble">
      <div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
    </div>
  `;
  chatBox.appendChild(loader);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  try {
    let responseText = "";
    
    if (state.processingEngine === "local" || state.project.type !== "custom") {
      await delay(1200);
      
      const info = window.LocalAgentSimulationEngine.classifyProject(state.project.idea, state.project.budget, state.project.objective);
      const overrides = extractFinancialParameters(message);
      
      let updatedParamsMsg = "";
      if (Object.keys(overrides).length > 0) {
        state.financialOverrides = { ...state.financialOverrides, ...overrides };
        updatedParamsMsg = `Abbiamo recepito le nuove indicazioni numeriche (${Object.entries(overrides).map(([k, v]) => `${k} = ${v}€`).join(", ")}). I dati del prospetto finanziario e del Break-Even sono stati allineati.\n\n`;
      }
      
      responseText = `### 🤝 Verbale del Consiglio di Amministrazione (Consenso Raggiunto)\n\nL'Orchestratore Master (CEO) ha riunito tutti i dipartimenti per esaminare la tua indicazione: *"${message}"*.\n\n${updatedParamsMsg}`;
      
      const q = message.toLowerCase();
      if (q.includes("noleggi") || q.includes("leasing") || q.includes("finanz") || q.includes("costo") || q.includes("prezzo") || q.includes("affitto")) {
        responseText += `- **CFO (Finanza)**: "Ho applicato le modifiche alle proiezioni. Le nuove assunzioni finanziarie riducono l'esposizione iniziale e modificano il Break-Even. I dettagli sono visibili nel tab Finanziario."\n`;
        responseText += `- **Sourcing (Logistica)**: "Sto ricalibrando le nostre forniture e i tempi di consegna con i nuovi budget concordati."\n`;
      } else if (q.includes("target") || q.includes("competitor") || q.includes("concorren") || q.includes("cliente") || q.includes("marketing") || q.includes("social")) {
        responseText += `- **CMO (Marketing)**: "Ho ridefinito la segmentazione clienti. Ci focalizzeremo sui canali suggeriti per massimizzare il ritorno sull'investimento pubblicitario (ROAS)."\n`;
        responseText += `- **Sales (Vendite)**: "Sto aggiornando lo script di cold outreach e la landing page per adattarli al nuovo posizionamento."\n`;
      } else {
        responseText += `- **CPO (Prodotto)**: "Prendiamo nota per l'evoluzione dell'MVP. Rimarremo concentrati sulle sole feature indispensabili."\n`;
        responseText += `- **CLO (Legale)**: "Verifico che queste modifiche rispettino la conformità locale e i permessi del comune."\n`;
      }
      
      responseText += `\n**CEO (Orchestratore)**: "Modifiche strategiche approvate e registrate. Ho ordinato la rigenerazione di tutti i report degli agenti per questa fase per allinearci."`;
      
      regenerateAllAgentReports();
      
    } else {
      let currentReportsBrief = "";
      for (let phaseNum = 1; phaseNum <= state.currentPhase; phaseNum++) {
        state.enabledAgents.forEach(agentKey => {
          if (state.contributions[phaseNum]?.[agentKey]) {
            currentReportsBrief += `[${AGENT_METADATA[agentKey].name} - FASE ${phaseNum}]:\n${state.contributions[phaseNum][agentKey]}\n\n`;
          }
        });
      }
      
      const systemInstruction = `Sei il Consiglio di Amministrazione (Boardroom) del progetto "${state.project.name || "Nuovo Progetto"}".
L'utente ti sta parlando in una chat multilaterale globale per dare un'indicazione strategica trasversale o proporre modifiche prima della convalida finale del report.
Devi rispondere simulando una breve riunione del Consiglio guidata dal CEO (Orchestratore Master), dove intervengono anche 1 o 2 agenti chiave coinvolti nella richiesta.
Rispondi con un verbale o un riassunto chiaro ed operativo delle decisioni prese.

PROPRIETÀ FONDAMENTALE (PARAMETRI FINANZIARI):
Se l'utente propone di variare prezzi, costi, affitti o canoni di leasing, o se il Consiglio concorda di cambiarli, aggiungi alla fine del messaggio del Consiglio la riga:
\`[UPDATE_FINANCIAL: price=X, rent=Y, cogs=Z, electricity=W, machineCost=K, leaseFee=L, partnerShare=S]\` indicando solo i valori modificati.

Ecco la panoramica dei report generati finora dai vari agenti:
"""
${currentReportsBrief}
"""`;

      const contents = [];
      if (state.globalChatHistory && state.globalChatHistory.length > 0) {
        state.globalChatHistory.slice(0, -1).forEach(msg => {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          });
        });
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });
      
      const response = await window.callGeminiAPI(
        state.apiKey,
        state.model,
        "orchestrator",
        message,
        contents,
        null,
        systemInstruction
      );
      
      responseText = response;
      
      const overrides = extractFinancialParameters(responseText);
      if (Object.keys(overrides).length > 0) {
        state.financialOverrides = { ...state.financialOverrides, ...overrides };
        updateFinancialsUI();
      }
    }
    
    loader.remove();
    state.globalChatHistory.push({ role: "assistant", text: responseText });
    saveCurrentProjectToStorage();
    renderGlobalChatMessages();
    
    // Aggiorna l'intera interfaccia per riflettere le modifiche
    updateReportUI();
    
  } catch (err) {
    loader.remove();
    console.error("Errore nella chat globale della boardroom:", err);
    const errDiv = document.createElement("div");
    errDiv.className = "brainstorm-msg agent";
    errDiv.innerHTML = `
      <span class="brainstorm-msg-sender">Errore</span>
      <div class="brainstorm-msg-bubble" style="color:var(--danger); border-color:var(--danger)">Impossibile connettersi: ${err.message}</div>
    `;
    chatBox.appendChild(errDiv);
  }
}

// Visualizza i messaggi della chat globale del Consiglio
function renderGlobalChatMessages() {
  const chatBox = document.getElementById("global-chat-box");
  if (!chatBox) return;
  
  chatBox.innerHTML = `
    <div class="brainstorm-msg agent">
      <span class="brainstorm-msg-sender">👤 Consiglio di Amministrazione</span>
      <div class="brainstorm-msg-bubble" style="border-color: var(--primary)">
        Siamo tutti riuniti qui nel Consiglio di Amministrazione. Puoi darci indicazioni strategiche globali (es. pivot di target, modifiche al business plan, nuovi competitor o costi) e adegueremo il report complessivo e i parametri finanziari di conseguenza prima della tua convalida finale.
      </div>
    </div>
  `;
  
  const history = state.globalChatHistory || [];
  history.forEach(msg => {
    const msgDiv = document.createElement("div");
    if (msg.role === "user") {
      msgDiv.className = "brainstorm-msg user";
      msgDiv.innerHTML = `
        <span class="brainstorm-msg-sender">Tu</span>
        <div class="brainstorm-msg-bubble">${formatMarkdown(msg.text)}</div>
      `;
    } else {
      msgDiv.className = "brainstorm-msg agent";
      msgDiv.innerHTML = `
        <span class="brainstorm-msg-sender">👤 Consiglio di Amministrazione</span>
        <div class="brainstorm-msg-bubble" style="border-color: var(--primary-glow)">${formatMarkdown(msg.text)}</div>
      `;
    }
    chatBox.appendChild(msgDiv);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Gestore dell'invio risposte per domande di affinamento dal report
window.submitRefinementAnswer = function(qId, phase, idx) {
  if (state.isProcessing) return;
  const inputEl = document.getElementById(qId);
  const text = inputEl ? inputEl.value.trim() : "";
  if (!text) return;
  
  // Naviga programmaticamente al tab della Boardroom
  switchTabAndSelectAgent("boardroom");
  
  // Popola l'input della chat con la risposta dell'utente ed esegui l'invio
  if (DOM.chatInput) {
    DOM.chatInput.value = text;
    handleUserMessageSubmit();
  }
};

// Avvia l'inizializzazione al caricamento del DOM
document.addEventListener("DOMContentLoaded", init);


