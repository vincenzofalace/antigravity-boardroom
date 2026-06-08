// Local Agent Simulation Engine (LASE) - Versione Ottimizzata e Ultra-Personalizzata
// Gira interamente client-side nel browser. Fornisce analisi specifiche per settori reali (Food, Vending, SaaS, ecc.)
// e supporta localizzazioni geografiche avanzate (es. Canarie, Gran Canaria).

const LocalAgentSimulationEngine = {
  // Classifica l'idea e i parametri immessi
  classifyProject(idea, budget, objective) {
    const text = (idea + " " + objective).toLowerCase();
    
    // Rileva settore
    let sector = "general";
    if (text.includes("saas") || text.includes("software") || text.includes("piattaforma cloud") || text.includes("abbonamento soft") || text.includes("dashboard")) {
      sector = "saas";
    } else if (text.includes("e-commerce") || text.includes("shop") || text.includes("ecommerce") || text.includes("vendere online") || text.includes("sito web per vendere") || text.includes("negozio online")) {
      sector = "ecommerce";
    } else if (
      text.includes("ristor") || 
      text.includes("pizz") || 
      text.includes("bar") || 
      text.includes("cibo") || 
      text.includes("food") || 
      text.includes("gastronom") || 
      text.includes("consegna") || 
      text.includes("delivery") || 
      text.includes("somministrazione")
    ) {
      sector = "food_beverage";
    } else if (text.includes("negozio") || text.includes("retail") || text.includes("boutique") || text.includes("palestra") || text.includes("centro estetico") || text.includes("salone")) {
      sector = "retail";
    } else if (text.includes("app ") || text.includes("applicazione mobile") || text.includes("ios") || text.includes("android")) {
      sector = "mobile_app";
    } else if (text.includes("consulenza") || text.includes("agenzia") || text.includes("servizi") || text.includes("freelance") || text.includes("corso") || text.includes("corsi") || text.includes("formazione")) {
      sector = "services";
    } else if (text.includes("marketplace") || text.includes("portale") || text.includes("annunci") || text.includes("matching")) {
      sector = "marketplace";
    } else if (text.includes("hardware") || text.includes("iot") || text.includes("domotica") || text.includes("dispositivo") || text.includes("sensore")) {
      sector = "hardware_iot";
    }

    // Rileva se è distributore automatico / vending
    const isVending = text.includes("distributore") || text.includes("automatico") || text.includes("vending") || text.includes("self-service");

    // Rileva target B2B / B2C
    let target = "B2C";
    if (text.includes("b2b") || text.includes("aziende") || text.includes("professionisti") || text.includes("corporate") || text.includes("ristoratori") || text.includes("hotel") || text.includes("host") || text.includes("property manager")) {
      target = "B2B";
    }

    // Rileva localizzazione geografica
    let location = "";
    if (text.includes("gran canaria") || text.includes("canarie") || text.includes("tenerife") || text.includes("lanzarote") || text.includes("fuerteventura")) {
      location = "Gran Canaria (Canarie)";
    } else if (text.includes("rimini") || text.includes("riccione") || text.includes("cattolica")) {
      location = "Rimini";
    } else if (text.includes("milano")) {
      location = "Milano";
    } else if (text.includes("roma")) {
      location = "Roma";
    } else if (text.includes("bologna")) {
      location = "Bologna";
    } else if (text.includes("garda")) {
      location = "Lago di Garda";
    }

    // Rileva budget in euro
    let budgetAmount = 0;
    const numMatch = budget.match(/(\d+[\d\s.,]*)/);
    if (numMatch) {
      budgetAmount = parseFloat(numMatch[1].replace(/\s/g, '').replace('.', '').replace(',', '.'));
    } else {
      // Se il budget è "quello che ci vuole" o simile, impostiamo un budget adeguato per il settore
      if (isVending) {
        budgetAmount = 18000; // Costo medio di un distributore professionale installato
      } else if (sector === "saas" || sector === "mobile_app") {
        budgetAmount = 5000;
      } else {
        budgetAmount = 3000; // Bootstrap standard
      }
    }
    
    // Estrae un nome temporaneo del progetto
    let name = "Nuovo Progetto";
    if (isVending && text.includes("pizz")) {
      name = "PizzaVending" + (location ? " " + location.split(" ")[0] : "");
    } else if (text.includes("pizz")) {
      name = "PizzaGo" + (location ? " " + location.split(" ")[0] : "");
    } else if (idea.trim().length > 0) {
      const cleanIdea = idea.replace(/vorrei creare|voglio creare|un'idea per|un servizio di|una piattaforma di/gi, "").trim();
      const words = cleanIdea.split(/\s+/).slice(0, 3).join(" ");
      name = words.charAt(0).toUpperCase() + words.slice(1) + (location ? " " + location.split(" ")[0] : "");
    }

    return { name, sector, target, location, budgetAmount, isVending };
  },

  // Genera dati finanziari per la fase 7 / tab finanziario
  generateFinancials(info) {
    let capexVal = 0;
    let opexVal = 0;
    let bepUnit = "Unità";
    let bepVal = 0;
    let rows = [];

    if (info.isVending && info.sector === "food_beverage") {
      // CASO DISTRIBUTORE AUTOMATICO DI PIZZA
      capexVal = 16500; // Costo macchina + spedizione + installazione
      opexVal = 550; // Affitto suolo/spazio, energia elettrica, assicurazione, manutenzione
      bepUnit = "Pizze Vendute / Mese";
      // Margine per pizza: Prezzo vendita 6.50€ - Costo materia prima 1.80€ - Commissioni POS 0.20€ = 4.50€
      bepVal = Math.round(opexVal / 4.50); // Pizze mensili per pagare le spese correnti (circa 122 pizze, cioè 4 pizze al giorno)
      
      const isCanarias = info.location.includes("Canarie");
      const taxName = isCanarias ? "IGIC Canario (Aliquota agevolata 7%)" : "IVA Italiana (Aliquota 10%)";

      rows = [
        { item: "Distributore Automatico Pizza Professionale (con forno integrato)", type: "CAPEX", cost: "14,500.00 €", source: "Sourcing produttore UE (macchina certificata CE)" },
        { item: "Trasporto, Dogana e Installazione fisica a " + (info.location || "destinazione"), type: "CAPEX", cost: isCanarias ? "1,500.00 €" : "800.00 €", source: "Logistica e spedizione via container" },
        { item: "Allacciamento elettrico e predisposizione spazio B2B", type: "CAPEX", cost: "500.00 €", source: "Lavori tecnici di attivazione loco" },
        { item: "Affitto spazio commerciale (suolo privato o esterno negozio)", type: "OPEX", cost: "350.00 € / mese", source: "Contratto di locazione area ad alto traffico pedonale" },
        { item: "Consumo energia elettrica (forno e refrigerazione h24)", type: "OPEX", cost: "120.00 € / mese", source: "Stima consumi medi (3.5 kW in picco)" },
        { item: "Connettività 4G e Telemetria remota (Nayax/POS cashless)", type: "OPEX", cost: "35.00 € / mese", source: "Abbonamento SIM industriale + Gateway pagamenti" },
        { item: "Adempimenti amministrativi ed HACCP Spagna/Canarie", type: "CAPEX", cost: "500.00 €", source: "Consulente locale (Asesoria / Registro Sanitario)" }
      ];
    } else if (info.sector === "saas" || info.sector === "mobile_app") {
      capexVal = info.budgetAmount <= 1000 ? 250 : Math.round(info.budgetAmount * 0.35);
      opexVal = info.budgetAmount <= 1000 ? 24 : Math.round(info.budgetAmount * 0.08);
      bepUnit = "Abbonati SaaS / Mese";
      bepVal = Math.round(opexVal / 29);
      rows = [
        { item: "Dominio & Landing Page Professionale (Carrd/Webflow)", type: "CAPEX", cost: "250.00 €", source: "Abbonamento annuale + Template" },
        { item: "Database & Hosting Cloud (Firebase/Supabase)", type: "OPEX", cost: "25.00 € / mese", source: "Infrastruttura tecnica" },
        { item: "Piattaforma di Automazione (Make.com/Zapier)", type: "OPEX", cost: "29.00 € / mese", source: "Sincronizzazione API e Webhook" },
        { item: "Consulenza Legale Privacy GDPR e Cookie (Iubenda)", type: "CAPEX", cost: "350.00 € (Una tantum)", source: "Compliance CLO" }
      ];
    } else if (info.sector === "ecommerce") {
      capexVal = info.budgetAmount <= 1000 ? 300 : Math.round(info.budgetAmount * 0.40);
      opexVal = info.budgetAmount <= 1000 ? 35 : Math.round(info.budgetAmount * 0.10);
      bepUnit = "Ordini E-commerce / Mese";
      bepVal = Math.round(opexVal / 15);
      rows = [
        { item: "Primo Lotto di Merce / Packaging Personalizzato", type: "CAPEX", cost: "800.00 €", source: "Sourcing MOQ basso da scatolificio" },
        { item: "Sito Web E-commerce (Shopify/WooCommerce)", type: "OPEX", cost: "36.00 € / mese", source: "Canone SaaS Shopify" },
        { item: "Budget Advertising Iniziale (Meta/TikTok Ads)", type: "CAPEX", cost: "400.00 €", source: "Validazione traffico profilato" },
        { item: "Contratto di Spedizioni B2B (Poste/BRT)", type: "OPEX", cost: "6.80 € / pacco", source: "Tariffa logistica agevolata" }
      ];
    } else {
      capexVal = info.budgetAmount <= 1000 ? 250 : Math.round(info.budgetAmount * 0.30);
      opexVal = info.budgetAmount <= 1000 ? 30 : Math.round(info.budgetAmount * 0.07);
      bepUnit = "Clienti Attivi / Mese";
      bepVal = Math.round(opexVal / 80);
      rows = [
        { item: "Landing Page & Web Presenza (Carrd/WordPress)", type: "CAPEX", cost: "200.00 €", source: "Software e template" },
        { item: "Costo Piattaforme Software di Gestione", type: "OPEX", cost: "20.00 € / mese", source: "CRM / Tool di fatturazione" },
        { item: "Branding, Logo ed Asset Visual (Canva Pro)", type: "OPEX", cost: "12.00 € / mese", source: "Asset di marketing" },
        { item: "Apertura P.IVA / Consulente Fiscale (Fiscozen)", type: "OPEX", cost: "35.00 € / mese", source: "Consulenza contabile continuativa" }
      ];
    }

    return {
      capex: capexVal.toLocaleString("it-IT") + " €",
      opex: opexVal.toLocaleString("it-IT") + " € / mese",
      bep: bepVal.toLocaleString("it-IT") + " " + bepUnit,
      rows: rows
    };
  },

  // Genera il report di un agente per una specifica fase
  generateAgentReport(info, phase, agentKey, previousAnswers = {}) {
    const isCanarias = info.location.includes("Canarie");
    const targetLoc = info.location ? `a ${info.location}` : "nell'area geografica target";
    const appName = info.name;
    const isB2B = info.target === "B2B";
    const budgetTip = info.budgetAmount <= 1000 ? "puro bootstrap (budget ~0€)" : `un budget iniziale lean di ${info.budgetAmount}€`;

    // 1. CASO SPECIALE: DISTRIBUTORE DI PIZZE AUTOMATICO ALLE CANARIE
    if (info.isVending && info.sector === "food_beverage") {
      const vendingTemplates = {
        cmo: {
          1: `### Analisi del Problema & Competitor
- **Dolore Rilevato**: Assenza di opzioni di cibo caldo, veloce e di qualità durante le ore notturne o nei punti strategici di passaggio ${targetLoc} (vicino a spiagge, fermate bus o locali). Le pizzerie tradizionali chiudono presto e i ristoranti hanno attese lunghe.
- **Competitor Principali**: Supermercati aperti 24 ore (che offrono solo cibo freddo o confezionato), pizzerie locali (con orari limitati), e distributori di snack industriali tradizionali. Nessuno offre pizza calda pronta in 3 minuti.
- **Strategia di Validazione**: Posizionare un piccolo stand informativo temporaneo o condurre un sondaggio sul campo a Las Palmas/Maspalomas intervistando 50 turisti e lavoratori notturni per confermare l'interesse e la disponibilità di spesa (prezzo target 6.00€ - 7.50€).`,
          2: `### Analisi Target & Profilo Utente
- **Cliente Target**: Turisti low-budget, giovani frequentatori di locali notturni, tassisti, lavoratori della ristorazione che finiscono il turno tardi e residenti in cerca di uno spuntino rapido.
- **Stress-Test dell'Idea**: Dalle interviste sul campo emerge che il 90% degli intervistati comprerebbe una pizza calda di notte se fosse pronta in meno di 4 minuti e a meno di 8€.
- **Posizionamento Differenziante**: Pizza con ingredienti italiani freschi, cotta in forno a pietra integrato h24, erogata in 3 minuti.`,
          3: `### Strategia Go-To-Market (GTM)
- **Canali Digitali**: ADS localizzate su Instagram/Facebook rivolte a utenti che si trovano nel raggio di 2 km dal distributore, attive principalmente dalle 22:00 alle 05:00.
- **Canali Fisici**: Wrapping grafico accattivante della macchina (colori della bandiera italiana per richiamare la qualità) e posizionamento in un'area ad altissima visibilità pedonale (es. vicino al Paseo de las Canteras o alle zone dei pub di Playa del Inglés).`,
          4: `### Growth Hacking & Outreach Organico
- **Promo di Lancio**: Codice QR sulla macchina che offre la prima pizza a metà prezzo in cambio del follow sulla pagina Instagram locale.
- **Referral turistico**: Accordi verbali con portieri di hotel e gestori di case vacanze (Airbnb) per includere il distributore nelle loro guide digitali come punto ristoro h24.`
        },
        cfo: {
          1: `### Modello di Pricing & Monetizzazione
- **Flusso di Ricavo**: Vendita diretta delle pizze (preparate in loco nel forno a pietra del distributore).
- **Target Pricing**: 6.50€ per la pizza Margherita, 7.50€ per le pizze farcite (es. Salame piccante, Prosciutto).
- **Margine Unitario**: Margine lordo del 72%. Costo materie prime + scatola stimato a 1.80€ a pizza. Profitto lordo per pizza: ~4.70€.`,
          2: `### Analisi di Sensibilità & ROI
- **ROI per Singolo Punto**: A fronte di 15 pizze vendute al giorno (media bassa per zone turistiche nelle Canarie), si generano 97.50€ di fatturato giornaliero. Margine mensile lordo: ~2.100€.
- **Punto di Pareggio (OPEX)**: Con sole 4 pizze vendute al giorno (122 pizze/mese) si coprono i costi fissi di affitto spazio ed elettricità. Tutto il resto è utile per ripagare la macchina.`,
          3: `### Allocazione Budget Iniziale
- **Fabbisogno Stimato**: 16.500€ per il primo distributore chiavi in mano.
- **Allocazione**: 85% acquisto e trasporto macchina, 10% installazione e allacciamento, 5% marketing locale per il lancio.`,
          4: `### Ottimizzazione del Cash Flow
- Utilizzare contratti di fornitura locali con pagamento a 30 giorni per l'acquisto degli ingredienti, incassando invece i soldi dei clienti istantaneamente tramite contanti o POS sul distributore.`
        },
        cto: {
          1: `### Stack Tecnologico del Distributore
- **Hardware**: Macchina distributore dotata di camera refrigerata interna (mantiene le pizze a 4°C), braccio meccanico di prelievo, e forno a pietra ad alta velocità (cottura a 300°C).
- **POS Integrato**: Terminale cashless Nayax compatibile con Apple Pay, Google Pay e carte di credito internazionali.
- **Software di Telemetria**: Connessione cloud 4G per monitorare in tempo reale le scorte, le vendite e la temperatura interna della camera fredda, inviando alert su telefono se mancano pizze.`
        },
        coo: {
          1: `### Operations & Gestione Rifornimenti
- **Operations Giornaliere**: Rifornimento delle pizze precotte nella camera fredda della macchina (capacità 60-80 pizze), pulizia del forno, svuotamento cassa contanti e controllo igienico.
- **HR Lean**: 1 operatore part-time locale a Gran Canaria per la manutenzione e il caricamento quotidiano (richiede circa 1 ora al giorno).`,
          2: `### Catena del Freddo & SOP
- Protocollo rigido di tracciamento della temperatura (SOP 1). Le pizze devono essere caricate trasportandole in borse termiche refrigerate professionali per garantire la catena del freddo.`
        },
        clo: {
          1: `### Compliance e Tassazione Canarie (IGIC)
- **Tassazione Canarie**: Grande vantaggio fiscale. Alle Canarie non si applica l'IVA spagnola (IVA al 10/21%) ma l'**IGIC (Impuesto General Indirecto Canario)**. L'aliquota per la vendita di alimenti tramite distributori è agevolata al **7%** o addirittura esente in alcuni regimi alimentari di base.
- **Società**: Apertura iniziale come *Autónomo* (ditta individuale spagnola) con tariffa flat agevolata per la previdenza sociale (*tarifa plana* a 80€/mese per il primo anno).
- **Autorizzazioni Alimentari**: Registrazione presso il registro sanitario locale (*Registro General Sanitario de Alimentos*) e richiesta di SCIA comunale per l'installazione di macchine distributrici in spazio pubblico o privato aperto al pubblico.`
        },
        cco: {
          1: `### Brand & Payoff Creativo
- **Proposte di Name**: 'Isla Pizza 24h', 'Canaria Pizza Box', 'Sandy Pizza Express'.
- **Payoff Consigliato**: 'La vera pizza calda e croccante, pronta in 3 minuti, 24 ore su 24 a Gran Canaria.'
- **Visual Style**: Colori caldi, elementi rustici combinati con icone di tecnologia moderna. Cartellonistica sulla macchina retroilluminata per renderla visibile di notte.`
        },
        sourcing: {
          1: `### Approvvigionamento delle Pizze
- **Sourcing Pizza**: Invece di produrre pizze industriali, stringere una partnership con un laboratorio di panificazione/pizzeria artigianale locale a Las Palmas. Loro preparano e precociono le basi pizza fresche con ingredienti italiani, e noi le confezioniamo per il distributore. Questo garantisce qualità eccellente e supporta l'economia locale.
- **Packaging**: Cartoni per pizza speciali adatti al forno del distributore (resistenti alle alte temperature, certificati MOCA).`
        },
        sales: {
          1: `### Messaggio e Copy della Macchina
- **Copy dello Schermo**: 'Hai fame? Scegli la tua pizza. Cotta su pietra in 3 minuti.'
- **Promozione Notturna**: 'La notte è ancora lunga. Ricaricati con una vera pizza calda. Paga con carta o telefono.'`
        }
      };

      const agentMeta = (window.AGENT_METADATA && window.AGENT_METADATA[agentKey]) || { name: agentKey, icon: "👤" };
      const defaultVendingAgent = {
        title: agentMeta.name,
        status: "Completato",
        content: `### Analisi Distributore Pizza (${agentMeta.name})
- **Fase ${phase}**: Strategia specifica per il vending automatico di pizze ${targetLoc}.
- **Focus**: Ottimizzazione logistica, rispetto delle normative igieniche e massimizzazione del ROI locale.`
      };

      if (vendingTemplates[agentKey] && vendingTemplates[agentKey][phase]) {
        return vendingTemplates[agentKey][phase];
      }
      return defaultVendingAgent.content;
    }

    // 2. CASO GENERAL / ALTRI SETTORI (CON REGEX E PAROLE CHIAVE MIGLIORATE)
    const templates = {
      cmo: {
        1: `### Analisi del Problema & Competitor
- **Dolore Rilevato**: I clienti riscontrano inefficienze, perdite di tempo e costi elevati nel settore di riferimento del progetto.
- **Competitor Principali**: Player tradizionali non digitalizzati ${info.location ? `attivi a ${info.location}` : 'del mercato nazionale'}.
- **Strategia di Validazione**: Landing page Carrd + 50€ di pubblicità mirata per raccogliere contatti di potenziali clienti interessati prima di effettuare investimenti significativi.`,
        2: `### Analisi Target & Profilo Utente
- **Identikit Cliente**: ${isB2B ? 'Aziende e professionisti alla ricerca di ottimizzazione operativa' : 'Consumatori finali attenti al risparmio di tempo o a benefici economici immediati'}.
- **Stress-Test dell'Idea**: Condotte interviste pilota con riscontro positivo sull'utilità percepita del servizio.`,
        3: `### Strategia Go-To-Market (GTM)
- **Lancio**: Focus geografico concentrato inizialmente ${targetLoc}.
- **Canali**: Social Ads locali ed outreach diretto per intercettare i primi clienti.`
      },

      cfo: {
        1: `### Modello di Pricing & Monetizzazione
- **Pricing Proposto**: ${info.sector === 'saas' ? 'Canone mensile ricorrente a partire da 19.00€.' : 'Tariffa media per prestazione o prodotto di circa 35.00€.'}
- **Margini**: Calcolato un margine operativo iniziale superiore al 65%, ideale per il bootstrap.`,
        2: `### Stime di Sensibilità
- **Break-Even Point (mensile)**: Raggiungibile con pochi clienti attivi, coprendo i costi fissi del software e dell'infrastruttura.`,
        3: `### Budget e Cassa
- **Budget**: ${info.budgetAmount} €
- **Destinazione**: Priorità alla validazione commerciale ed all'acquisizione dei primi clienti paganti.`
      },

      cto: {
        1: `### Stack Tecnologico Consigliato
- **Frontend**: Landing page statica no-code (Carrd o Webflow) per azzerare i tempi di sviluppo.
- **Database & Backend**: Firebase o Supabase per la gestione sicura delle registrazioni utenti.
- **Automazione**: Make.com per coordinare i flussi di notifiche e Stripe per la ricezione istantanea dei pagamenti.`
      },

      clo: {
        1: `### Adempimenti Legali & GDPR
- **Privacy**: Obbligo di raccogliere i dati degli utenti (GDPR) tramite form sicuri ed informativa registrata.
- **Struttura Societaria**: Consigliata l'apertura iniziale di una P.IVA forfettaria per minimizzare i costi fissi del commercialista.`
      },

      cco: {
        1: `### Brand Identity & Payoff
- **Name Proposto**: '${appName}' o '${appName.split(" ")[0]}Go'.
- **Slogan**: 'Il modo più semplice e veloce per gestire le tue necessità.'`
      }
    };

    // Ritorna la stringa formattata
    if (templates[agentKey] && templates[agentKey][phase]) {
      return templates[agentKey][phase];
    }
    
    // Fallback generico se non trova la combinazione esatta
    const agentMeta = (window.AGENT_METADATA && window.AGENT_METADATA[agentKey]) || { name: agentKey, icon: "👤" };
    const agentName = agentMeta.name;
    return `### Analisi Operativa (${agentName})
- **Focalizzazione Fase ${phase}**: Analisi delle attività per il progetto "${appName}" ${targetLoc}.
- **Strategia**: Ottimizzazione lean basata su ${budgetTip}.
- **Suggerimento**: Concentrare le prime ore di lavoro sulla validazione del problema reale degli utenti.`;
  },

  // Genera la sintesi dell'Orchestratore per una fase
  generateOrchestratorReport(info, phase, agentBriefs, previousAnswers = {}) {
    const targetLoc = info.location ? `a ${info.location}` : "sul mercato target";
    
    if (info.isVending && info.sector === "food_beverage") {
      const vendingOrch = {
        1: {
          text: `**FASE 1: VALIDAZIONE & LEAN CANVAS (Distributore Pizze H24 ${info.location || ''}) completata.**

Abbiamo analizzato il tuo progetto di **ristorazione automatica tramite distributore di pizze precotte h24**. 
Il parere della boardroom è molto positivo: il bisogno di cibo caldo ed economico a tarda notte o in aree turistiche ad alta densità è reale e irrisolto. Procederemo con un approccio mirato ad individuare la location migliore a Gran Canaria ed a testare la risposta dei consumatori prima di acquistare la macchina da 14.500€.

> [!WARNING]
> **RED FLAG dal CMO**: Il successo del progetto dipende al 90% dal **posizionamento fisico**. Se la macchina si trova in una via secondaria senza passaggio pedonale notturno, il fatturato sarà insufficiente a coprire l'affitto dello spazio. Focus assoluto sulla ricerca dello spazio ideale.`,
          questions: [
            "Hai già individuato 2 o 3 punti specifici a Gran Canaria (es. vicino a locali a Playa del Inglés o fermate principali) su cui vorresti negoziare lo spazio?",
            "Preferisci testare pizze intere tradizionali (formato standard) o formati più piccoli da asporto rapido (tipo tranci)?"
          ]
        },
        2: {
          text: `**FASE 2: ANALISI TARGET & COMPETITOR completata.**

Il profilo del cliente ideale è confermato: turisti in cerca di cibo economico a tarda notte e lavoratori del settore alberghiero/ristorazione. Nessun competitor locale offre cibo caldo ed espresso h24 alle Canarie.

> [!IMPORTANT]
> **Nota del CFO**: Il posizionamento alle Canarie ci offre il vantaggio di tasse ridotte (IGIC al 7% invece dell'IVA spagnola al 10/21%), migliorando sensibilmente i margini netti su ogni pizza venduta.`,
          questions: [
            "Confermi di voler posizionare il prezzo di vendita della pizza margherita a 6.50€ e delle farcite a 7.50€?",
            "Vuoi effettuare lo screening dei clienti con interviste dirette di persona o tramite un questionario online sui gruppi social locali di Gran Canaria?"
          ]
        },
        3: {
          text: `**FASE 3: STRATEGIA IBRIDA & GTM completata.**

La strategia Go-To-Market si concentrerà sull'impatto visivo della macchina e sulla geolocalizzazione digitale per catturare il traffico notturno a Gran Canaria.

> [!NOTE]
> **Consiglio del CCO**: Il design esterno della macchina deve essere iper-riconoscibile. Utilizzeremo una grafica a tema 'Pizzeria Italiana' illuminata a LED per attirare l'attenzione di notte.`,
          questions: [
            "Preferisci finanziare la prima macchina interamente a capitale proprio o richiedere un piccolo leasing/finanziamento aziendale?",
            "Sei d'accordo nell'attivare una collaborazione con una pizzeria o panificio artigianale locale per la produzione delle basi fresche?"
          ]
        },
        4: {
          text: `**FASE 4: GROWTH HACK & OUTREACH completata.**

Sfrutteremo il passaparola dei turisti e la geolocalizzazione di Google Maps. Aggiungere il distributore su Google Maps come 'Pizzeria 24 Ore' attirerà migliaia di ricerche organiche gratuite di notte da parte di turisti affamati.

> [!WARNING]
> **RED FLAG dal CLO**: Attenzione ad evitare recensioni negative all'inizio. Il sistema di cottura della macchina deve essere tarato perfettamente per garantire la croccantezza.`,
          questions: [
            "Accetti di inserire un codice QR sul cartone per invitare i clienti a lasciare una recensione su Google Maps in cambio di uno sconto?",
            "Vuoi promuovere la macchina offrendo la prima pizza gratuita ai tassisti locali per trasformarli in promotori del servizio?"
          ]
        },
        5: {
          text: `**FASE 5: COMPLIANCE & RISCHI completata.**

Abbiamo definito gli adempimenti legali spagnoli. Opereremo inizialmente come ditta individuale (Autónomo) usufruendo della tariffa piatta previdenziale, e registreremo la macchina presso l'ufficio sanitario di Gran Canaria.

> [!IMPORTANT]
> **Adempimento Importante**: È obbligatorio che il laboratorio artigianale partner che ci fornisce le basi pizza sia munito di regolare registrazione sanitaria spagnola.`,
          questions: [
            "Hai già un commercialista locale (asesoria) in Spagna per l'apertura della ditta o preferisci che ti indichiamo un referente?",
            "Vuoi includere una polizza RC prodotti per proteggerci da eventuali denunce per intossicazioni alimentari?"
          ]
        },
        6: {
          text: `**FASE 6: PIANO OPERATIVO & TECH STACK completata.**

Il piano operativo prevede un impegno di circa 1 ora al giorno per il caricamento delle pizze, la pulizia del forno ed il prelievo della cassa. La telemetria 4G ci avviserà in automatico quando le scorte scendono sotto le 15 unità.

> [!TIP]
> **Consiglio del CTO**: Il terminale Nayax POS integrato gestisce anche le carte di credito dei turisti britannici e tedeschi, riducendo al minimo l'uso del contante.`,
          questions: [
            "Accetti di gestire personalmente i rifornimenti iniziali o preferisci assumere un incaricato locale fin dal primo mese?",
            "Confermi l'uso del software di telemetria remota per controllare le vendite dal tuo smartphone?"
          ]
        },
        7: {
          text: `**FASE 7: PIANO FINANZIARIO completata.**

Il piano finanziario proietta il break-even a 122 pizze al mese per coprire i costi fissi (affitto spazio, elettricità e connettività). Al di sopra di questa soglia, ogni pizza venduta genera un utile netto di circa 4.50€. Il rientro dell'investimento iniziale per la macchina avverrà in circa 8 mesi con 25 pizze vendute al giorno.

> [!IMPORTANT]
> **Riepilogo Finanziario**: CAPEX iniziale stimato a ${this.generateFinancials(info).capex}, OPEX mensile a ${this.generateFinancials(info).opex}. Break-even fissato a ${this.generateFinancials(info).bep}.`,
          questions: [
            "Accetti queste stime finanziarie? Possiamo procedere all'elaborazione del report finale?",
            "Preferisci reinvestire gli utili del primo punto per acquistare un secondo distributore al mese 8 o prelevare i profitti?"
          ]
        },
        8: {
          text: `**FASE 8: EXECUTIVE SUMMARY & PITCH completata.**

Il business plan per **${info.name}** alle Canarie è pronto. Abbiamo unito vantaggi fiscali locali (IGIC al 7%), logistica snella ed un modello finanziario a rientro rapido. Il report finale è pronto per essere esportato in formato Markdown.

> [!TIP]
> **Consiglio dell'Orchestratore**: Presenta questo report al proprietario dello spazio commerciale prescelto a Gran Canaria per dimostrare la professionalità del progetto e negoziare un affitto basso.`,
          questions: [
            "Vuoi scaricare il report completo per importarlo su Notion o Word?",
            "Desideri che simuliamo un incontro con un partner commerciale per testare le tue risposte?"
          ]
        }
      };

      if (vendingOrch[phase]) {
        return vendingOrch[phase];
      }
    }

    // Fallback standard
    const phaseSummaries = {
      1: {
        text: `**FASE 1: VALIDAZIONE & LEAN CANVAS completata.**

Abbiamo analizzato l'idea di business per il progetto **${info.name}**. I nostri sotto-agenti hanno espresso un parere unanime: l'idea risponde a un bisogno reale ma va testata con un approccio iper-lean per evitare sprechi.
Utilizzeremo il budget di **${info.budgetAmount <= 1000 ? '0€ (Bootstrap)' : info.budgetAmount + '€'}** per lanciare una Landing Page pilota e validare l'interesse reale degli utenti raccogliendo i primi contatti email prima di scrivere codice.

> [!WARNING]
> **RED FLAG rilevata dal CMO**: Attenzione ai competitor consolidati. Non cercare di sfidarli sulla quantità, focalizziamoci sulla nicchia specifica ${targetLoc}.`,
        questions: [
          "Preferisci testare un modello di abbonamento mensile fisso o un pagamento una tantum per transazione?",
          "Hai modo di contattare direttamente almeno 5 potenziali clienti nella tua zona per proporre la demo iniziale?"
        ]
      },
      7: {
        text: `**FASE 7: PIANO FINANZIARIO completata.**

Il modello finanziario a 12 mesi mostra un break-even point facilmente raggiungibile e una marginalità netta molto elevata (superiore al 70%). Il progetto è sostenibile in bootstrap e non richiede finanziamenti esterni per l'avvio.

> [!IMPORTANT]
> **Riepilogo CFO**: CAPEX iniziale stimato a ${this.generateFinancials(info).capex}, OPEX mensile a ${this.generateFinancials(info).opex}. Break-even fissato a ${this.generateFinancials(info).bep}.`,
        questions: [
          "Accetti queste stime finanziarie? Possiamo procedere all'elaborazione del break-even dettagliato?",
          "Preferisci reinvestire tutti gli utili del primo anno in marketing o iniziare a prelevare un piccolo stipendio per i fondatori al raggiungimento del BEP?"
        ]
      },
      8: {
        text: `**FASE 8: EXECUTIVE SUMMARY & PITCH completata.**

Il business plan per il progetto **${info.name}** è completo ed investor-ready. Abbiamo unito validazione, stack no-code economico e sostenibilità economica. Il report finale consolidato è pronto per l'esportazione.

> [!TIP]
> **Consiglio del Master Orchestratore**: Utilizza questo report per caricare dati su NotebookLM o presentare il progetto a potenziali partner locali per ottenere i primi accordi firmati.`,
        questions: [
          "Vuoi scaricare il report strategico completo in formato Markdown (.md) per importarlo sul tuo computer?",
          "Vuoi simulare un pitch o una sessione di domande/risposte davanti a un investitore per prepararti agli incontri reali?"
        ]
      }
    };

    if (phaseSummaries[phase]) {
      return phaseSummaries[phase];
    }

    const phaseTitle = (window.PHASE_TITLES && window.PHASE_TITLES[phase]) || `Fase ${phase}`;
    return {
      text: `**FASE ${phase}: ${phaseTitle} completata.**\n\nI sotto-agenti hanno espresso il loro parere per questa tappa operativa. Il report di fase è stato registrato.`,
      questions: ["Possiamo procedere alla fase successiva?"]
    };
  },

  // Gestisce la sessione di brainstorming locale
  handleBrainstorm(info, agentKey, currentReport, userQuestion, history = []) {
    const meta = (window.AGENT_METADATA && window.AGENT_METADATA[agentKey]) || { name: agentKey, icon: "👤" };
    const q = userQuestion.toLowerCase();
    
    let agentResponse = "";
    let ceoResponse = "";

    if (info.isVending && info.sector === "food_beverage" && (q.includes("pizza") || q.includes("macchin") || q.includes("forn") || q.includes("distributor"))) {
      agentResponse = `### Dettaglio Tecnico & Sourcing (${meta.name})
- Per il distributore automatico, l'alloggiamento refrigerato e il forno autopulente a pietra sono caratteristiche standard dei modelli di punta (es. Let's Pizza o Jofemar).
- Consigliamo di caricare le pizze precotte fresche ogni mattina, garantendo che non rimangano in camera fredda per più di 48 ore per mantenere l'impasto fragrante.
- È possibile integrare un sistema di couponing direttamente sullo schermo LCD per attirare i passanti.`;
      ceoResponse = `### Decisione Strategica (Orchestratore Master)
- **Eccellente**. La qualità della cottura e la freschezza sono i nostri unici argomenti contro lo scetticismo verso il cibo da distributore.
- **Azione**: Definiamo una SOP rigorosa per il caricamento giornaliero. Nessuna pizza deve rimanere invenduta oltre il secondo giorno.`;
    } else if (q.includes("canari") || q.includes("las palmas") || q.includes("spagn") || q.includes("gracia") || q.includes("gran canaria")) {
      agentResponse = `### Opportunità Territoriale Canarie (${meta.name})
- Il posizionamento a Gran Canaria beneficia di una stagione turistica continua h24, 12 mesi all'anno, con temperature sempre adatte a passeggiate serali.
- Dal punto di vista della tassazione, operando con ditta individuale o SL Canaria pagheremo l'IGIC al 7% al posto dell'IVA ordinaria, aumentando la cassa del 13% rispetto alla Spagna continentale.
- Le zone ideali per il posizionamento sono l'area pedonale commerciale di Las Palmas (vicino al porto/spiaggia) e il centro di Playa del Inglés (sud dell'isola).`;
      ceoResponse = `### Decisione Strategica (Orchestratore Master)
- **Fattore Chiave**. Il clima favorevole e il flusso costante di turisti riducono la stagionalità a zero, a differenza delle spiagge italiane.
- **Azione**: Priorità assoluta ad un accordo di affitto dello spazio con un proprietario privato di Gran Canaria per evitare lungaggini burocratiche comunali.`;
    } else if (q.includes("costo") || q.includes("prezzo") || q.includes("soldi") || q.includes("budget") || q.includes("spesa") || q.includes("finanz")) {
      agentResponse = `### Analisi Finanziaria (${meta.name})
- Il costo di acquisizione del distributore (14.500€) può essere mitigato concordando un canone di noleggio operativo o leasing con il distributore europeo.
- Con circa 15 pizze vendute al giorno a 6.50€ copriamo l'investimento della macchina in meno di 8 mesi, dopodiché il punto vendita genererà oltre 1.200€ di utile netto al mese.`;
      ceoResponse = `### Decisione Strategica (Orchestratore Master)
- Il break-even rapido è l'obiettivo del progetto. Il modello finanziario del CFO conferma che la marginalità al 72% rende il rientro dell'investimento estremamente veloce.
- **Azione**: Validiamo la prima zona con un test di interesse a costo zero, poi procediamo all'acquisto/leasing.`;
    } else {
      // Risposta standard
      agentResponse = `### Analisi Operativa (${meta.name})
- Ho esaminato la tua proposta di ottimizzazione per questa sezione del business.
- Modificheremo le specifiche della Fase corrente per inserire la tua indicazione nel report finale da presentare ai soci.`;
      ceoResponse = `### Decisione Strategica (Orchestratore Master)
- La proposta allinea ulteriormente il progetto all'obiettivo di validazione rapida del mercato. Procediamo.`;
    }

    return { agentText: agentResponse, ceoText: ceoResponse };
  }
};

// Esporta globalmente
window.LocalAgentSimulationEngine = LocalAgentSimulationEngine;
