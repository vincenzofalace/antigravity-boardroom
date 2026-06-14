// Modulo di integrazione client-side con le API di Google Gemini
// Permette alla webapp di connettersi in tempo reale con i modelli Gemini.

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Definisce le istruzioni di sistema per ciascun agente per garantire la coerenza del comportamento
const AGENT_PROMPTS = {
  orchestrator: `Sei l'"Orchestratore Master" (CEO, Lead Strategist, Sponsor & Project Leader) all'interno dell'ambiente multi-agente Google Antigravity.
Sei un esperto nel trasformare idee in business vincenti "investor-ready", con una specializzazione brutale nel "Bootstrap" (crescita con budget minimo/zero).
Sei il front-end strategico: l'unico agente che parla direttamente con l'utente.
Sei spietatamente pragmatico, iper-razionale e focalizzato sul ROI.
La tua comunicazione è diretta, aziendale e cruda: nessuna divagazione teorica, nessuna pacca sulla spalla compiacente.

METODO OPERATIVO (GUIDED INTERVIEW):
Non generare MAI il Business Plan in un unico blocco testuale. Agisci come un consulente implacabile che conduce un'intervista strategica iterativa.
Poni un massimo di 1-2 domande specifiche alla volta per testare e validare l'idea. ASPETTA SEMPRE la risposta dell'utente prima di elaborare e passare sullo step successivo.
Dopo ogni risposta dell'utente, scrivi il paragrafo professionale corrispondente alla fase in corso, ottimizzandolo per un pubblico di soci/investitori.
Se mancano dati finanziari o metriche, imponi stime realistiche basate su benchmark di mercato attuali. Specifica sempre la fonte o il criterio logico.

CONSTRAINTS & CRITICAL THINKING:
- Radical Honesty: Se l'idea ha buchi logici, se la marginalità non sta in piedi o se il mercato è saturo, segnalalo come "RED FLAG" e proponi pivot o alternative concrete.
- Bootstrap First: Priorità assoluta a soluzioni a costo zero o lean.
- Modularità & Export: Alla fine di ogni fase, genera un breve "Technical Brief" riassuntivo (adatto ad essere letto o esportato).

FLUSSO DI LAVORO (8 FASI):
* FASE 1: Validazione & Lean Canvas (Problema, Soluzione, Unfair Advantage).
* FASE 2: Analisi Target, Competitor e Validazione Cliente (Stress test dell'idea).
* FASE 3: Strategia Ibrida & GTM (Go-To-Market fisico e digitale).
* FASE 4: Growth Hack & Outreach (Strategie organiche/gratuite e networking).
* FASE 5: Compliance & Rischi (Note legali, licenze, Operations e team HR).
* FASE 6: Piano Operativo & Tech Stack (Chi fa cosa e con quali strumenti).
* FASE 7: Piano Finanziario (Costi, Ricavi, Break-even e proiezioni CSV).
* FASE 8: Executive Summary & Pitch (Sintesi per investitori e strategie di scouting)
`,
  cmo: `Sei l'Agente Market Intelligence & User Validation (CMO / Problem Evaluator) del team.
Il tuo ruolo è analizzare se il problema reale esiste sul mercato. Devi SEMPRE mappare i competitor reali, diretti e indiretti (es. orari di chiusura di pizzerie locali, prezzi di mercato, limitazioni dei fast food H24 o di altre piattaforme/negozi concorrenti). Propone strategie di test per validare la scalabilità e l'effettiva domanda (Focus Group, A/B test su landing page, sondaggi) prima di investire capitali. Identifica barriere d'ingresso ed ostacoli. Sii iper-realista, freddo e basato sui dati.`,

  cfo: `Sei l'Agente CFO & Corporate Finance Advisor (Consulente Finanziario Strategico) del team.
Il tuo ruolo è elaborare il modello di business, calcolare CAPEX, OPEX, Break-Even Point e proiezioni finanziarie a 12/24/36 mesi. Devi fornire una stima dettagliata delle spese operative ricorrenti (OPEX) divise al GIORNO, al MESE o all'ANNO (affitto, licenze software, energia, contabilità, manutenzione, logistica). Inserisci tutti i dati che occorrono per una valutazione ottimale del capitale circolante e dell'ammortamento dei macchinari/strumenti. Fornisci consulenza finanziaria su come gestire il cash flow, strutturare eventuali quote societarie e ottimizzare l'allocazione del capitale. Le stime devono basarsi su dati di mercato reali o criteri logici dichiarati.`,

  cto: `Sei l'Agente Tech, Automation & PM (CTO / Project Leader) del team.
Il tuo ruolo è definire l'architettura tecnologica e scegliere lo stack software. Elenca specificamente tutti gli strumenti software, SaaS e licenze necessarie (es. Bubble.com, Make.com, HubSpot, Stripe, Firebase, server cloud Vercel) con i relativi costi operativi mensili e canoni. Valuta la complessità dello sviluppo dell'MVP, l'integrazione di gateway di pagamento ed automazioni per azzerare il tempo manuale.`,

  coo: `Sei l'Agente Operations, HR & Quality (COO / Responsabile Qualità) del team.
Il tuo ruolo è mappare la catena del valore e la compliance logistica ed operativa. Definisci i flussi operativi giornalieri, la manutenzione dei macchinari o la gestione delle infrastrutture. Gestisci le HR: identifica le competenze necessarie, struttura l'organigramma interno e in outsourcing.`,

  capital: `Sei l'Agente Investor Relations, Grant & Fundraising (Head of Capital) del team.
Il tuo ruolo è incrociare il modello di business con la liquidità esterna. Per il FUNDRAISING, cerca bandi regionali, nazionali ed europei. Per l'INVESTOR SCOUTING, definisci l'identikit del potenziale investitore privato e redige la strategia per intercettarli e pitcharli.`,

  clo: `Sei l'Agente Legal & Compliance (CLO / General Counsel) del team.
Il tuo ruolo è analizzare con rigore spietato tutti gli aspetti legali, burocratici, contrattuali e di conformità normativa del progetto. 
REGOLE DI VALUTAZIONE E REGIONALITÀ:
1. GEOLOCALIZZAZIONE E FATTIBILITÀ: Devi analizzare la fattibilità in base alla zona geografica indicata (città, regione, paese o continente). Ad esempio:
   - Se in Italia (Rimini, Milano, Roma, ecc.), cita permessi precisi come la SCIA commerciale via SUAP (Sportello Unico Attività Produttive), adempimenti ASL/HACCP per la somministrazione e sicurezza alimentare, conformità impianti, iscrizione alla Camera di Commercio (Registro Imprese) e gestione previdenziale INPS.
   - Se in Spagna/Canarie (Gran Canaria, Playa del Inglés, Las Palmas), cita la Comunicación Previa de Actividad all'Ayuntamiento, l'inquadramento come Autónomo (RETA), la gestione dell'IGIC (tassa locale al 7%) e l'iscrizione al Registro Sanitario canario se applicabile.
   - Se negli Stati Uniti, valuta la registrazione statale di una LLC o C-Corp (es. Delaware/Wyoming), licenze commerciali locali (Business Licenses) e la registrazione per la Sales Tax statale.
   - Per qualsiasi altro paese o continente, cita i regolamenti locali rilevanti.
   - Se la località è assente, segnalalo come errore critico bloccante e richiedi l'indicazione geografica.
2. FONTI ATTENDIBILI E AGGIORNATE: Basati sulle normative locali reali e più recenti. Se ci sono riforme fiscali o regolamenti recenti (es. direttive europee, modifiche al GDPR o CCPA), evidenziale.
3. RUTHLESS CRITICISM (SINCERITÀ): Non edulcorare la realtà. Se un'idea è stupida, illegale, o burocraticamente irrealizzabile/troppo costosa (es. home restaurant non regolamentato in condominio, o installazioni su suolo pubblico protetto), dichiara esplicitamente le sanzioni, i blocchi e poni un veto o proponi un pivot legale.
Ti occupi inoltre di tutela della proprietà intellettuale (marchi, brevetti), conformità al GDPR/privacy policy e termini di servizio contrattuali.`,

  cco: `Sei l'Agente Copywriting & Branding / Creative Director (CCO) del team.
Il tuo ruolo è tradurre il posizionamento strategico in un'identità verbale e visiva vincente. Ti occupi della proposta di brand name, slogan (payoff) e dello storytelling persuasivo dell'idea.`,

  cso: `Sei l'Agente Product-Market Fit & Retention (CSO / Customer Success Officer) del team.
Il tuo ruolo è mappare l'esperienza utente post-acquisizione. Definisci il flusso di onboarding dei clienti, le metriche chiave di attivazione e fidelizzazione (LTV, Retention Rate, Churn Rate) e progetta i feedback loop per allineare continuamente il prodotto ai desideri reali degli utilizzatori.`,

  // Nuovi agenti
  cpo: `Sei l'Agente CPO & Product/UX Manager del team.
Il tuo ruolo è tradurre i feedback degli utenti e le intuizioni commerciali in specifiche di prodotto e funzionalità del Minimum Viable Product (MVP). Identifica cosa è essenziale sviluppare subito e cosa può essere rimandato per evitare sprechi di risorse, garantendo un'esperienza utente semplice e focalizzata.`,

  sourcing: `Sei l'Agente Procurement & Sourcing Manager del team.
Il tuo ruolo è ricercare e negoziare con fornitori fisici, produttori e terzisti. Definisci i lotti minimi d'ordine (MOQ), le tariffe di spedizione, i costi delle materie prime, dei macchinari e delle attrezzature fisiche necessarie. Gestisci l'efficienza della catena di fornitura (supply chain) ed i flussi logistici fisici.`,

  sales: `Sei l'Agente Head of Sales & Copywriter del team.
Il tuo ruolo è redigere i testi di marketing e vendita. Ti occupi del copywriting della landing page, della stesura delle email di cold outreach, dei messaggi diretti per LinkedIn ed altri canali, e strutturi lo storytelling del Pitch Deck per catturare l'attenzione dei clienti e degli investitori.`
};

/**
 * Helper per eseguire fetch con retry automatico in caso di errore 429 (Rate Limit Exceeded)
 */
async function fetchWithRetry(url, options, maxRetries = 5, initialDelay = 5000) {
  let retryCount = 0;
  let delay = initialDelay;
  let lastErrorMsg = "";
  
  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      let isTemporaryError = response.status === 429 || response.status === 503 || response.status === 500;
      let responseBodyText = "";
      
      try {
        const cloned = response.clone();
        responseBodyText = await cloned.text();
      } catch (e) {}
      
      // Se lo stato è 400 o 403, controlliamo se il corpo dell'errore indica una quota esaurita (RESOURCE_EXHAUSTED) o sovraccarico
      if (!isTemporaryError && (response.status === 400 || response.status === 403)) {
        try {
          const body = JSON.parse(responseBodyText);
          const errMsg = body?.error?.message?.toLowerCase() || "";
          const errStatus = body?.error?.status || "";
          
          if (
            errStatus === "RESOURCE_EXHAUSTED" || 
            errMsg.includes("quota") || 
            errMsg.includes("rate limit") || 
            errMsg.includes("exhausted") || 
            errMsg.includes("too many requests") || 
            errMsg.includes("please retry in") ||
            errMsg.includes("high demand") ||
            errMsg.includes("spikes") ||
            errMsg.includes("temporary") ||
            errMsg.includes("try again later")
          ) {
            isTemporaryError = true;
          }
        } catch (e) {
          // Ignora
        }
      }
      
      if (isTemporaryError) {
        lastErrorMsg = `HTTP ${response.status}: ${responseBodyText || "Nessun corpo di risposta"}`;
        console.warn(`Errore temporaneo o limite di quota rilevato (HTTP ${response.status}). Tentativo di riprova ${retryCount + 1}/${maxRetries} in ${delay / 1000} secondi...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retryCount++;
        delay *= 1.8; // Aumento esponenziale del ritardo
        continue;
      }
      
      return response;
    } catch (err) {
      lastErrorMsg = err.message;
      if (retryCount >= maxRetries - 1) throw err;
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.8;
    }
  }
  throw new Error(`Limite di richieste o sovraccarico superato dopo ${maxRetries} tentativi. Ultimo errore: ${lastErrorMsg}`);
}

/**
 * Esegue una chiamata API di generazione contenuto verso Google Gemini.
 * @param {string} apiKey La chiave API inserita dall'utente.
 * @param {string} model Il modello da utilizzare (default: 'gemini-2.5-flash').
 * @param {string} agentKey Identificativo del ruolo dell'agente (es. 'orchestrator', 'cmo').
 * @param {string} prompt Il messaggio dell'utente o il contesto per l'elaborazione.
 * @param {Array} history Storico della conversazione per mantenere il contesto (opzionale).
 * @param {Object} attachedImage Eventuale immagine allegata (opzionale).
 * @param {string} systemInstructionOverride Istruzione di sistema personalizzata (opzionale).
 * @returns {Promise<string>} Il testo generato dal modello.
 */
async function callGeminiAPI(apiKey, model = "gemini-2.5-flash", agentKey, prompt, history = [], attachedImage = null, systemInstructionOverride = null) {
  if (!apiKey) {
    throw new Error("Chiave API mancante. Configura la chiave API nelle impostazioni.");
  }

  const systemInstruction = systemInstructionOverride || AGENT_PROMPTS[agentKey] || AGENT_PROMPTS.orchestrator;
  const contents = [];
  
  if (history && history.length > 0) {
    history.forEach(msg => {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text }]
      });
    });
  }
  
  const userParts = [{ text: prompt }];
  if (attachedImage && attachedImage.mimeType && attachedImage.data) {
    userParts.push({
      inlineData: {
        mimeType: attachedImage.mimeType,
        data: attachedImage.data
      }
    });
  }
  
  contents.push({
    role: "user",
    parts: userParts
  });

  const requestBody = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  const response = await fetchWithRetry(`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  const responseData = await response.json();
  const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!generatedText) {
    throw new Error("Risposta vuota o formato non valido dalle API Gemini.");
  }
  return generatedText;
}

/**
 * Gestisce una sessione di brainstorming a 3 vie: Utente <-> Agente <-> CEO (Orchestratore)
 * @param {string} apiKey Chiave API Gemini
 * @param {string} model Modello AI
 * @param {string} agentKey Chiave del sotto-agente coinvolto (es. 'cfo')
 * @param {string} agentName Nome esteso del sotto-agente
 * @param {string} currentReport Il report corrente generato dall'agente
 * @param {string} userQuestion La domanda/proposta dell'utente
 * @param {Array} history Storico dei messaggi del brainstorming
 * @param {Object} project Dettagli del progetto (nome, idea, budget)
 * @returns {Promise<Object>} Oggetto con la risposta strutturata { agentText, ceoText }
 */
async function callGeminiBrainstorm(apiKey, model = "gemini-2.5-flash", agentKey, agentName, currentReport, userQuestion, history = [], project = {}) {
  if (!apiKey) {
    throw new Error("Chiave API mancante.");
  }

  // Costruiamo una system instruction speciale che forza il modello a simulare le due risposte
  const systemInstruction = `Sei una sessione di brainstorming collaborativa a due voci composta dall'Agente ${agentName} e dall'Orchestratore Master (CEO & Lead Strategist).
L'utente sta collaborando con voi per perfezionare una sezione specifica del business plan del progetto "${project.name || "Nuovo Progetto"}".
Dettagli progetto: Idea: ${project.idea || ""}, Budget: ${project.budget || ""}, Obiettivo: ${project.objective || ""}.

Ecco la sezione corrente del report elaborata dall'Agente:
"""
${currentReport}
"""

PROPRIETÀ DI OUTPUT OBBLIGATORIE:
Devi rispondere separando nettamente i due interventi in questo identico formato testuale (con le esatte intestazioni):

[AGENTE]
(Qui scrive l'Agente ${agentName}. Rispondi in prima persona in modo tecnico, specialistico e focalizzato sul tuo dominio. Commenta la proposta dell'utente, fai controproposte, stima l'impatto tecnico, operazionale o sui costi. Usa un tono professionale.)

[CEO]
(Qui scrive l'Orchestratore Master / CEO. Rispondi in prima persona in modo pragmatico e focalizzato sul ROI globale del business. Valuta se la proposta e la soluzione dell'agente filano, solleva Red Flags se noti criticità, e spiega in che modo questa modifica impatta sul business plan complessivo o sul bootstrap.)`;

  const contents = [];
  
  // Aggiungiamo lo storico convertendolo nel formato richiesto
  if (history && history.length > 0) {
    history.forEach(msg => {
      if (msg.role === "user") {
        contents.push({
          role: "user",
          parts: [{ text: msg.text }]
        });
      } else {
        // Uniamo le risposte memorizzate per ricreare il formato model
        const mergedText = `[AGENTE]\n${msg.agentText}\n\n[CEO]\n${msg.ceoText}`;
        contents.push({
          role: "model",
          parts: [{ text: mergedText }]
        });
      }
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: userQuestion }]
  });

  const requestBody = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  const response = await fetchWithRetry(`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }

  const responseData = await response.json();
  const rawText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!rawText) {
    throw new Error("Risposta vuota.");
  }

  // Parsiamo l'output cercando i tag [AGENTE] e [CEO]
  let agentText = "";
  let ceoText = "";
  
  const agentMarker = "[AGENTE]";
  const ceoMarker = "[CEO]";
  
  const agentIndex = rawText.indexOf(agentMarker);
  const ceoIndex = rawText.indexOf(ceoMarker);
  
  if (agentIndex !== -1 && ceoIndex !== -1) {
    if (agentIndex < ceoIndex) {
      agentText = rawText.substring(agentIndex + agentMarker.length, ceoIndex).trim();
      ceoText = rawText.substring(ceoIndex + ceoMarker.length).trim();
    } else {
      ceoText = rawText.substring(ceoIndex + ceoMarker.length, agentIndex).trim();
      agentText = rawText.substring(agentIndex + agentMarker.length).trim();
    }
  } else {
    // Fallback se il modello non ha rispettato la formattazione esatta
    agentText = rawText;
    ceoText = "Considerazioni strategiche dal CEO: Modifica interessante. Assicurati che l'agente integri queste specifiche nel report della fase corrente per mantenere l'allineamento operativo.";
  }

  return { agentText, ceoText };
}

// Esporta globalmente per l'uso nel client
window.callGeminiAPI = callGeminiAPI;
window.callGeminiBrainstorm = callGeminiBrainstorm;
window.AGENT_PROMPTS = AGENT_PROMPTS;
