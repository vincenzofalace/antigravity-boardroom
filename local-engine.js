// Local Agent Simulation Engine (LASE) for Antigravity Multi-Agent Boardroom Suite
// Gira interamente nel browser (client-side) per permettere l'utilizzo senza API Key o abbonamenti.

const LocalAgentSimulationEngine = {
  // Classifica l'idea e i parametri immessi
  classifyProject(idea, budget, objective) {
    const text = (idea + " " + objective).toLowerCase();
    
    // Rileva settore
    let sector = "general";
    if (text.includes("saas") || text.includes("software") || text.includes("piattaforma cloud") || text.includes("abbonamento soft") || text.includes("dashboard")) {
      sector = "saas";
    } else if (text.includes("e-commerce") || text.includes("shop") || text.includes("ecommerce") || text.includes("vendere online") || text.includes("sito web per vendere") || text.includes("negozio online") || text.includes("sito per vendere")) {
      sector = "ecommerce";
    } else if (text.includes("ristorante") || text.includes("pizza") || text.includes("bar") || text.includes("cibo") || text.includes("food") || text.includes("pizzeria") || text.includes("pasticceria") || text.includes("gastronomia") || text.includes("consegna a domicilio") || text.includes("delivery") || text.includes("ordinare")) {
      sector = "food_beverage";
    } else if (text.includes("negozio") || text.includes("negozio fisico") || text.includes("retail") || text.includes("boutique") || text.includes("palestra") || text.includes("centro estetico") || text.includes("locale fisico") || text.includes("salone")) {
      sector = "retail";
    } else if (text.includes("app ") || text.includes("app-") || text.includes("applicazione mobile") || text.includes("ios") || text.includes("android")) {
      sector = "mobile_app";
    } else if (text.includes("consulenza") || text.includes("agenzia") || text.includes("servizi") || text.includes("freelance") || text.includes("academy") || text.includes("corso") || text.includes("corsi") || text.includes("formazione")) {
      sector = "services";
    } else if (text.includes("marketplace") || text.includes("portale") || text.includes("piattaforma di annunci") || text.includes("matching") || text.includes("matching platform")) {
      sector = "marketplace";
    } else if (text.includes("hardware") || text.includes("iot") || text.includes("domotica") || text.includes("dispositivo") || text.includes("sensore") || text.includes("serratura") || text.includes("smart")) {
      sector = "hardware_iot";
    }

    // Rileva target
    let target = "B2C";
    if (text.includes("b2b") || text.includes("aziende") || text.includes("professionisti") || text.includes("corporate") || text.includes("business-to-business") || text.includes("ristoratori") || text.includes("hotel") || text.includes("host") || text.includes("property manager")) {
      target = "B2B";
    }

    // Rileva localizzazione
    const cities = ["rimini", "garda", "milano", "roma", "bologna", "firenze", "torino", "napoli", "venezia", "bari", "palermo", "genova", "verona", "padova", "riccione", "cattolica", "cesena", "forli", "ravenna", "pesaro", "ancona", "lecce", "taranto", "bari"];
    let location = "";
    for (let c of cities) {
      if (text.includes(c)) {
        location = c.charAt(0).toUpperCase() + c.slice(1);
        break;
      }
    }
    
    // Rileva budget in euro
    let budgetAmount = 0;
    const numMatch = budget.match(/(\d+[\d\s.,]*)/);
    if (numMatch) {
      budgetAmount = parseFloat(numMatch[1].replace(/\s/g, '').replace('.', '').replace(',', '.'));
    } else {
      budgetAmount = 0; // Bootstrap
    }
    
    // Estrae un nome temporaneo
    let name = "Progetto Generico";
    if (idea.trim().length > 0) {
      const cleanIdea = idea.replace(/vorrei creare|voglio creare|un'idea per|un servizio di|una piattaforma di/gi, "").trim();
      const words = cleanIdea.split(/\s+/).slice(0, 3).join(" ");
      name = words.charAt(0).toUpperCase() + words.slice(1) + (location ? " " + location : "");
    }

    return { name, sector, target, location, budgetAmount };
  },

  // Genera dati finanziari per la fase 7 / tab finanziario
  generateFinancials(info) {
    const isBootstrap = info.budgetAmount <= 1000;
    let capexVal = 0;
    let opexVal = 0;
    let bepUnit = "Clienti";
    let bepVal = 0;
    let rows = [];

    // Calcolo CAPEX & OPEX in base a budget e settore
    if (isBootstrap) {
      capexVal = 250;
      opexVal = 24;
    } else if (info.budgetAmount <= 5000) {
      capexVal = 1350;
      opexVal = 149;
    } else {
      capexVal = Math.round(info.budgetAmount * 0.35);
      opexVal = Math.round(info.budgetAmount * 0.08);
    }

    // Modulazione voci in base al settore
    if (info.sector === "saas" || info.sector === "mobile_app") {
      bepUnit = "Abbonati SaaS";
      bepVal = Math.round(capexVal / 29); // 29€/mese abbonamento
      rows = [
        { item: "Dominio & Landing Page Professionale (Carrd/Webflow)", type: "CAPEX", cost: isBootstrap ? "19.00 €" : "250.00 €", source: "Abbonamento annuale + Template" },
        { item: "Database & Hosting Cloud (Firebase/Supabase)", type: "OPEX", cost: isBootstrap ? "0.00 € (Free tier)" : "25.00 € / mese", source: "Infrastruttura tecnica" },
        { item: "Piattaforma di Automazione (Make.com/Zapier)", type: "OPEX", cost: isBootstrap ? "9.00 € / mese" : "29.00 € / mese", source: "Sincronizzazione API e Webhook" },
        { item: "Integrazione Transazioni & Gateway (Stripe)", type: "OPEX", cost: "1.4% + 0.25€ / transaz.", source: "Commissioni di pagamento" },
        { item: "Consulenza Legale Privacy GDPR e GDPR Cookie (Iubenda)", type: "CAPEX", cost: isBootstrap ? "59.00 € / anno" : "350.00 € (Una tantum)", source: "Compliance CLO" }
      ];
    } else if (info.sector === "ecommerce") {
      bepUnit = "Ordini E-commerce";
      bepVal = Math.round(capexVal / 15); // 15€ margine medio per ordine
      rows = [
        { item: "Primo Lotto di Merce / Packaging Personalizzato", type: "CAPEX", cost: isBootstrap ? "150.00 €" : "800.00 €", source: "Sourcing MOQ basso da scatolificio" },
        { item: "Sito Web E-commerce (Shopify/WooCommerce)", type: "OPEX", cost: isBootstrap ? "1.00 € / primo mese" : "36.00 € / mese", source: "Canone SaaS Shopify" },
        { item: "Budget Advertising Iniziale (Meta/TikTok Ads)", type: "CAPEX", cost: isBootstrap ? "100.00 €" : "400.00 €", source: "Validazione traffico profilato" },
        { item: "Contratto di Spedizioni B2B (Poste/BRT)", type: "OPEX", cost: "6.80 € / pacco", source: "Tariffa logistica agevolata" }
      ];
    } else if (info.sector === "food_beverage") {
      bepUnit = "Ordini Food/Consegne";
      bepVal = Math.round(capexVal / 12); // 12€ margine medio
      rows = [
        { item: "Certificazioni Sanitarie e Corso HACCP", type: "CAPEX", cost: "120.00 €", source: "Obbligo legale per somministrazione" },
        { item: "Packaging Alimentare MOCA ed Igiene", type: "CAPEX", cost: isBootstrap ? "80.00 €" : "300.00 €", source: "Sourcing cartoni e imballaggi idonei" },
        { item: "Web App per Menu Digitale & Ordini WhatsApp", type: "OPEX", cost: isBootstrap ? "0.00 €" : "19.00 € / mese", source: "Menu.me o similari no-code" },
        { item: "Logistica Consegne / Rider (Assicurazione)", type: "OPEX", cost: "3.50 € / consegna", source: "Costo variabile a chiamata" }
      ];
    } else if (info.sector === "hardware_iot") {
      bepUnit = "Dispositivi Venduti";
      bepVal = Math.round(capexVal / 65); // 65€ margine unitario
      rows = [
        { item: "Kit Componentistica Elettronica Prototipo", type: "CAPEX", cost: isBootstrap ? "90.00 €" : "400.00 €", source: "Sourcing componenti (AliExpress/Mouser)" },
        { item: "Integrazione Automazioni ed Hub (Home Assistant)", type: "OPEX", cost: "0.00 € (Open source)", source: "Piattaforma tecnica" },
        { item: "Assicurazione RC Prodotti per hardware connes.", type: "OPEX", cost: "35.00 € / mese", source: "Preventivo Allianz/Generali" },
        { item: "Certificazione CE/RoHS (Dossier tecnico)", type: "CAPEX", cost: isBootstrap ? "100.00 € (Auto-cert.)" : "800.00 €", source: "Consulente conformità" }
      ];
    } else {
      // General o Servizi
      bepUnit = "Clienti Attivi";
      bepVal = Math.round(capexVal / 80); // 80€ margine unitario
      rows = [
        { item: "Landing Page & Web Presenza (Carrd/WordPress)", type: "CAPEX", cost: isBootstrap ? "19.00 €" : "200.00 €", source: "Software e template" },
        { item: "Costo Piattaforme Software di Gestione", type: "OPEX", cost: isBootstrap ? "0.00 €" : "20.00 € / mese", source: "CRM / Tool di fatturazione" },
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
    const targetLoc = info.location ? `a ${info.location}` : "sul mercato target";
    const appName = info.name;
    const isB2B = info.target === "B2B";
    const budgetTip = info.budgetAmount <= 1000 ? "puro bootstrap (budget ~0€)" : `un budget iniziale lean di ${info.budgetAmount}€`;

    // Database di risposte tematiche
    const templates = {
      cmo: {
        1: `### Analisi del Problema & Competitor
- **Dolore Rilevato**: I clienti lamentano inefficienze, perdite di tempo e costi nascosti nel settore legato a questa attività.
- **Competitor Principali**: Mappati i concorrenti diretti ${info.sector === 'food_beverage' ? 'JustEat, Glovo ed operatori fisici tradizionali' : info.sector === 'saas' ? 'le grandi piattaforme software generiche e fogli di calcolo manuali' : 'i player consolidati del settore'}. Nessuno di essi è focalizzato sull'iper-specializzazione locale o sulla velocità.
- **Strategia di Validazione**: Costruire una Landing Page iper-semplice in Carrd con form di opt-in per raccogliere email di prospect interessati, spendendo massimo 50€ in annunci targettizzati ${targetLoc}.`,
        2: `### Analisi Target & Profilo Utente
- **Cliente Ideale (Persona)**: ${isB2B ? 'Piccoli proprietari ed imprese che cercano di ottimizzare le operations' : 'Utenti finali sensibili al risparmio di tempo o al beneficio economico diretto'}.
- **Stress-Test dell'Idea**: Condotte 10 interviste esplorative. L'80% degli intervistati dichiara che risolverebbe volentieri questo problema se la soluzione costasse meno di quanto spende attualmente in inefficienze.
- **Value Proposition Differenziante**: Offrire la massima semplicità d'uso ed eliminare qualsiasi barriera d'ingresso.`,
        3: `### Strategia Go-To-Market (GTM)
- **Canali Digitali**: Campagna Meta Ads (Instagram/Facebook) geograficamente limitata ${targetLoc}.
- **Canali Fisici**: Distribuzione mirata di materiale informativo e networking diretto con i referenti chiave della zona.
- **Fattore di Conversione**: Offrire un forte incentivo iniziale (es. primo mese gratuito o sconto sul primo utilizzo) per avviare il passaparola.`,
        4: `### Growth Hacking & Outreach Organico
- **Scraper Strategico**: Analisi delle recensioni negative dei competitor su Google Maps/App Store per individuare clienti scontenti a cui proporre la nostra alternativa.
- **Modello di Referral**: Programma 'Porta un amico' che premia con bonus reali sia il segnalatore che il nuovo iscritto.`,
        5: `### Rischio Reputazionale & Percezione
- **Mitigazione Barriere**: La sicurezza e la privacy dei dati sono i dubbi principali. Mantenere server europei e dichiarare trasparenza al 100% per rassicurare gli utenti.`,
        6: `### Roadmap Marketing a 3 Mesi
- **Mese 1**: Rilascio landing page e test ADS a basso budget (50€).
- **Mese 2**: Acquisizione dei primi 5 beta tester locali e interviste video.
- **Mese 3**: Lancio commerciale ufficiale con campagne di email marketing organiche.`,
        7: `### KPI di Acquisizione
- **CAC Obiettivo**: Sotto i 10€ per cliente pagante.
- **LTV Previsto**: Stimato in 150€ su base annua.`,
        8: `### Sintesi Marketing per Executive Summary
- Il mercato potenziale ${targetLoc} conta oltre migliaia di potenziali clienti. Conquistare lo 0.5% del mercato locale garantisce la sostenibilità e la scalabilità finanziaria del progetto.`
      },

      cfo: {
        1: `### Modello di Pricing & Monetizzazione
- **Flussi di Ricavo**: ${info.sector === 'saas' ? 'Modello SaaS ricorrente a 19€/mese o 29€/mese per account.' : info.sector === 'ecommerce' ? 'Vendita diretta con margine sul prodotto del 50%.' : 'Prezzo medio a transazione/servizio di circa 25€.'}
- **Logica Economica**: Minimizzare il break-even point iniziale. Con ${info.budgetAmount <= 1000 ? 'pochissimi abbonati o vendite' : 'circa 20-30 vendite al mese'} copriremo tutte le spese fisse.`,
        2: `### Analisi di Sensibilità & ROI per il Cliente
- **Impatto sul Cliente**: Il cliente spende mediamente 80€ al mese a causa del problema. La nostra soluzione a 19€/mese fa risparmiare 61€ netti, garantendo un ROI del 320%.`,
        3: `### Allocazione Economica del Budget Iniziale
- **Budget Disponibile**: ${info.budgetAmount} €
- **Allocazione Proposta**: 40% su validazione e marketing Ads, 30% su infrastruttura e prototipazione, 30% tenuti a riserva liquida per contingenze esterne.`,
        4: `### Analisi del CAC Organico
- Sfruttando cold outreach ed ottimizzazione SEO locale, stimiamo un Costo di Acquisizione Cliente (CAC) organico vicino a 0€, ad esclusione delle ore dedicate alla vendita diretta.`,
        5: `### Budget di Compliance e Assicurazione
- Stima costi fissi annuali: 200€ per gestione legale/cookie policy e circa 300€/anno per una polizza assicurativa RC professional per mitigare ogni rischio operativo.`,
        6: `### Costi Fissi del Tech Stack
- Costi ricorrenti minimi: circa 15€-30€ al mese per abbonamenti a strumenti no-code (Make.com, hosting, dominio), mantenendo l'infrastruttura estremamente snella.`,
        7: `### Proiezioni Finanziarie a 12 Mesi
- **Ricavi Anno 1**: Stimati a 14.500€ sulla base dell'acquisizione di circa 50-70 clienti attivi.
- **Utile Netto (ante imposte)**: Circa 11.200€ (Margine netto dell'77% grazie ai bassi costi del software).
- **Break-Even**: Raggiunto entro il 3° mese di attività.`,
        8: `### Richiesta Finanziaria per Investitori
- **Fabbisogno Finanziario**: Richiesta di 15.000€ per accelerare il go-to-market.
- **Uso dei Fondi**: 70% in campagne marketing localizzate ed acquisizione lead, 30% per lo sviluppo di integrazioni software proprietarie.`
      },

      cto: {
        1: `### Architettura e Stack Low-Code
- **Hosting & Web**: Landing page ospitata su Netlify (gratis) o Carrd (19$/anno) per eliminare i costi di hosting iniziali.
- **Backend**: Firebase o Supabase su tier gratuito per la gestione del database utenti e delle autenticazioni.
- **Integrazioni**: Make.com per automatizzare l'invio di notifiche via email o SMS senza scrivere codice custom.`,
        2: `### Specifica Requisiti Tecnici
- **Database**: Struttura semplice a 3 tabelle (Utenti, Ordini/Servizi, Feedback).
- **Notifiche**: Invio di SMS transazionali automatici tramite gateway Twilio per informare l'utente sullo stato del servizio.`,
        3: `### Demo Kit Tecnico
- Configurazione di una dashboard demo interattiva basata su template statico per mostrare l'interfaccia client-side ai potenziali clienti durante gli incontri fisici.`,
        4: `### Automazioni di Outreach
- Script Python locale a costo zero per cercare recensioni pubbliche ed estrarre contatti email/social delle attività commerciali dell'area target.`,
        5: `### Sicurezza e Crittografia Dati
- Crittografia end-to-end tramite protocollo HTTPS standard. Password salvate in modo cifrato via hash crittografici. Dati residenti su server europei (compliance GDPR).`,
        6: `### Architettura Integrata Definitiva
- Integrazione di Stripe per i pagamenti e collegamento automatico a Fiscozen via API per l'emissione istantanea della fattura al momento del pagamento.`,
        7: `### Scalabilità Infrastrutturale
- Il tier gratuito di Firebase supporta fino a 10.000 utenti attivi mensili. Fino al raggiungimento di questa soglia, i costi cloud saranno pari a 0€.`,
        8: `### TRL (Technology Readiness Level)
- Livello attuale: TRL 4 (Prototipo validato in laboratorio). Pronto per il passaggio a TRL 5 (Test sul campo in ambiente reale con i primi 5 utenti pilota).`
      },

      coo: {
        1: `### Organizzazione Lean del Team
- **Fondatore**: Gestione commerciale, relazioni esterne, sales ed operations.
- **Socio Tecnico / Freelance**: Gestione dello sviluppo e configurazione degli strumenti.
- **Outsourcing**: Delegare le attività a basso valore aggiunto (logistica fisica o installazione) a partner esterni retribuiti a chiamata.`,
        2: `### Controllo Qualità e SOP (Standard Operating Procedures)
- Stesura di una check-list di 5 punti per ogni ordine/servizio per garantire che l'esperienza del cliente sia identica ed eccellente in ogni transazione.`,
        3: `### Gestione Partnership sul Territorio
- Definizione di accordi operativi con tecnici, corrieri ed installatori locali in provincia di ${info.location || 'residenza'} per coprire il servizio in 24 ore.`,
        4: `### Ottimizzazione dei Tempi Operativi
- Automatizzare l'inserimento dei lead e l'onboarding per ridurre il tempo di gestione manuale ad un massimo di 15 minuti per cliente.`,
        5: `### SLA e Assistenza Clienti
- Tempo di risposta garantito ai clienti in caso di problematiche critiche: sotto i 45 minuti, gestito tramite un canale WhatsApp dedicato.`,
        6: `### Struttura HR e Organigramma a 6 Mesi
- **Mese 1-3**: Struttura a 2 persone (fondatori).
- **Mese 4-6**: Inserimento di 1 figura commerciale a provvigione ed 1 assistente clienti part-time in outsourcing.`,
        7: `### Controllo dei Costi Operativi
- Eliminare gli sprechi fisici: nessun ufficio in affitto (lavoro remoto al 100%) e magazzino gestito con logistica 'just-in-time' per azzerare le giacenze.`,
        8: `### Scalabilità Organizzativa
- Strutturazione del manuale operativo aziendale per permettere la replica del modello di business in un'altra città italiana in meno di 2 settimane.`
      },

      capital: {
        1: `### Strategia di Fundraising Lean
- **Fase Iniziale**: Bootstrap puro. L'autofinanziamento tramite i primi clienti è la migliore validazione per qualsiasi investitore.
- **Bandi Pubblici**: Monitoraggio dei bandi regionali per l'innovazione ed autoimprenditorialità (es. Nuove Imprese a Tasso Zero o Smart&Start).`,
        2: `### Mappatura Investitori Locali
- Creazione di una lista di 5 Business Angels locali attivi nel settore turistico, immobiliare o tecnologico in Emilia-Romagna interessati a finanziare startup seed.`,
        3: `### Investor Pitch Deck Outline
- Slide 1: Il Problema drammatico.
- Slide 2: La Soluzione semplice ed economica.
- Slide 3: Il Mercato locale ed il posizionamento.
- Slide 4: Trazione (Dati reali raccolti).
- Slide 5: Il Team di esecuzione.`,
        4: `### Bandi Nazionali per l'Innovazione
- Valutazione del bando Invitalia per le imprese a gestione femminile o giovanile, con finanziamenti a tasso zero e fondo perduto fino al 20%.`,
        5: `### Riduzione del Rischio per Investitori
- Presentare un dossier legale solido e contratti di partnership firmati per dimostrare che il rischio esecutivo è ridotto al minimo.`,
        6: `### Timeline di Traguardi Finanziari
- Raggiungere 1.500€ di MRR (ricavi ricorrenti mensili) entro il sesto mese per presentarsi al tavolo degli investitori con dati inoppugnabili.`,
        7: `### Valutazione Societaria Pre-Seed
- Valutazione stimata della startup a 150.000€ per un aumento di capitale di 20.000€ contro la cessione del 13.3% delle quote.`,
        8: `### Piano di Contatto Investitori
- Campagna di outreach mirata su LinkedIn indirizzata a investitori angel, proponendo un breve report di 2 pagine con i dati del pilota.`
      },

      clo: {
        1: `### Compliance Legale e GDPR
- **Trattamento Dati**: Necessità di predisporre una Privacy Policy completa per il trattamento dei dati personali degli utenti (nomi, telefoni, email).
- **Cookie Policy**: Implementare un banner di consenso conforme alla normativa europea GDPR (servizio Iubenda, costo minimo).`,
        2: `### Contratto di Servizio (Termini & Condizioni)
- Redazione di una clausola di limitazione della responsabilità per danni derivanti da interruzioni del servizio o cause di forza maggiore.`,
        3: `### Scelta della Forma Giuridica
- Consigliata inizialmente l'apertura di una Ditta Individuale in Regime Forfettario (tassazione al 5% per i primi 5 anni, limite di fatturato 85.000€/anno) per abbattere i costi di gestione contabile.`,
        4: `### Protezione del Marchio (IP)
- Ricerca di anteriorità del brand name sul database dell'UIBM (Ufficio Italiano Brevetti e Marchi) e successiva registrazione del marchio a livello nazionale (costo tasse ~150€).`,
        5: `### Assicurazione RC Professionale
- Stipula di un contratto di assicurazione per responsabilità civile verso terzi con massimale di 250.000€ per proteggere i fondatori da richieste di risarcimento.`,
        6: `### Contratto di Partnership e Collaboratori
- Scrittura del contratto standard per collaboratori esterni ed installatori, definendo chiaramente lo status di prestazione d'opera autonoma per evitare rischi di contenzioso sul lavoro.`,
        7: `### Adempimenti Fiscali Regime Forfettario
- Codice ATECO consigliato: 62.01.00 (Produzione software) o 73.11.02 (Conduzione campagne marketing) con coefficiente di redditività al 67% o 78%.`,
        8: `### Costituzione SRL Innovativa
- Al superamento dei 50.000€ di fatturato annuo, pianificare la trasformazione in SRL Innovativa per usufruire delle agevolazioni fiscali per investitori ed esenzione dalle tasse di bollo.`
      },

      cco: {
        1: `### Brand Name & Posizionamento Creativo
- **Proposte di Name**: '${appName.replace(/[^a-zA-Z0-9 ]/g, "")}', '${appName.split(" ")[0]}Go', 'Easy${appName.split(" ")[0]}'.
- **Payoff Consigliato**: 'La soluzione rapida e conveniente per gestire ${info.sector === 'food_beverage' ? 'i tuoi ordini' : 'il tuo business'} senza pensieri.'
- **Tono di Voce**: Professionale, affidabile, pragmatico ed estremamente amichevole.`,
        2: `### Angoli di Comunicazione Efficaci
- **Angolo Risparmio**: 'Dimezza le spese superflue e paga solo per quello che utilizzi realmente.'
- **Angolo Tempo**: 'Risparmia ore di gestione manuale ogni settimana grazie alle nostre automazioni.'`,
        3: `### Visual Identity & Palette Colori
- Colore Primario: Blu Notte/Indaco per dare fiducia e professionalità.
- Colore Accento: Verde Smeraldo per richiamare la crescita economica e l'efficienza.
- Stile: Layout pulito, caratteri moderni (Inter o Outfit) e ampio uso di spazi bianchi.`,
        4: `### Copy per Landing Page ad Alta Conversione
- **Titolo**: 'Il controllo del tuo business a portata di click.'
- **Sottotitolo**: 'Automatizziamo le tue operazioni e riduciamo le spese fisse. Prova il servizio gratis per 14 giorni.'`,
        5: `### Storytelling per Investitori
- Focalizzare la narrazione sul contrasto tra il vecchio metodo manuale inefficiente (dolore) e la nostra soluzione digitale istantanea (piacere).`,
        6: `### Social Media Brand Kit
- Creazione di 3 template grafici riutilizzabili su Canva per le comunicazioni di lancio su Instagram e LinkedIn.`,
        7: `### Infografiche Finanziarie
- Rappresentare graficamente la riduzione della spesa per il cliente finale, rendendo il ROI visivamente immediato ed innegabile.`,
        8: `### Tagline del Pitch Deck
- '${appName}: Trasformiamo l'inefficienza in profitto netto ricorrente. Il business plan pronto al lancio.'`
      },

      cso: {
        1: `### Flusso di Onboarding del Cliente
- **Step 1**: Registrazione in 3 campi.
- **Step 2**: Ricezione di un messaggio automatico di benvenuto su WhatsApp.
- **Step 3**: Video-tutorial di 90 secondi che illustra l'utilizzo.`,
        2: `### Prevenzione del Churn (Abbandono)
- Monitorare l'utilizzo del servizio: se un utente non effettua azioni per 7 giorni, inviare un alert automatico chiedendo se necessita di supporto.`,
        3: `### NPS (Net Promoter Score) & Raccolta Recensioni
- Invio di un sondaggio di una sola domanda al termine della prima settimana: 'Da 1 a 10, quanto consiglieresti il servizio ad un collega?'`,
        4: `### Programma Referral e Incentivi
- Premiare gli utenti che presentano nuovi clienti con uno sconto del 20% sul canone del mese successivo per ciascun contatto convertito.`,
        5: `### Gestione Reclami e Procedure di Rimborso
- Regola aurea: rimborso immediato in caso di disservizio tecnico grave, trasformando un problema in un'opportunità di fidelizzazione (Customer Recovery).`,
        6: `### Canali di Assistenza Integrati
- Configurazione di una chat di assistenza integrata direttamente nella pagina tramite widget gratuito (Tawk.to o Smartsupp).`,
        7: `### Lifetime Value (LTV) Optimization
- Proporre un abbonamento annuale scontato del 15% per incassare la liquidità in anticipo e bloccare la retention del cliente per 12 mesi.`,
        8: `### Report NPS Finale
- I test pilota mostrano un NPS stimato di +48. Gli utenti apprezzano la velocità e il supporto diretto via WhatsApp.`
      },

      cpo: {
        1: `### Definizione del Minimum Viable Product (MVP)
- **Funzionalità Core**: L'MVP si concentrerà esclusivamente sulla risoluzione del problema principale, eliminando qualsiasi fronzolo grafico o opzione avanzata.
- **Interfaccia**: Una sola pagina con un modulo chiaro e un pulsante d'azione primario.`,
        2: `### Feedback Utenti per Pivot
- Il 70% dei primi utenti tester richiede l'integrazione di una notifica immediata su telefono piuttosto che una mail. Adattiamo l'MVP introducendo l'API di WhatsApp.`,
        3: `### UI/UX della Versione Pilota
- Design minimalista ottimizzato per l'utilizzo da smartphone. Il caricamento della pagina deve avvenire in meno di 1.5 secondi anche in condizioni di scarsa connettività.`,
        4: `### Prioritizzazione delle Feature (Matrice MoSCoW)
- Must Have: Pagamenti Stripe, Notifiche automatiche.
- Should Have: Storico ordini.
- Could Have: Multi-account.
- Won't Have: App nativa iOS/Android per ora.`,
        5: `### Fail-Safe Product Design
- Se la rete internet o il database si disconnette, l'applicazione deve salvare i dati dell'utente in locale (localStorage) e inviarli automaticamente non appena la connessione si ripristina.`,
        6: `### Integrazioni di Terze Parti (No-Code)
- Mappatura delle API: collegamento con Google Sheets per permettere al fondatore di consultare i dati di vendita senza dover accedere al database tecnico.`,
        7: `### Ottimizzazione per Mobile (Responsive)
- Il layout deve adattarsi a schermi piccoli da 5 pollici. Pulsanti grandi almeno 48px per facilitare il click del pollice.`,
        8: `### Specifiche Tecniche per la Produzione
- Rilascio del documento di specifiche per il team di sviluppo che prenderà in carico la scrittura del codice custom nel secondo anno.`
      },

      sourcing: {
        1: `### Ricerca Fornitori e Minimi d'Ordine (MOQ)
- **Sourcing**: Ricerca di partner per la stampa e l'approvvigionamento del materiale packaging a basso MOQ (250 pezzi per lotto).
- **Negoziazione**: Pagamento del 50% all'ordine e 50% alla consegna per ottimizzare il cash flow iniziale.`,
        2: `### Test dei Materiali e Spedizione Campioni
- Richiesta di campioni di prova a 3 scatolifici diversi per verificare la resistenza e la resa cromatica della stampa digitale prima del primo ordine ufficiale.`,
        3: `### Logistica delle Spedizioni Locali
- Accordo con corriere espresso con tariffa flat per spedizioni nazionali tracciate con consegna in 24/48 ore.`,
        4: `### Packaging Sostenibile a Basso Costo
- Utilizzo di scatole in cartone riciclato rigido non patinato. Il look grezzo naturale aumenta la percezione di sostenibilità e riduce i costi di stampa.`,
        5: `### Certificazioni Conformità Materiali
- Ottenimento delle schede tecniche di conformità CE e idoneità al contatto per tutti i materiali utilizzati, indispensabile per evitare sanzioni.`,
        6: `### Contratto Quadro Fornitura
- Firma di un accordo di fornitura a lungo termine che garantisce uno sconto sul prezzo unitario del 15% al superamento dei primi 1.000 pezzi acquistati cumulativamente.`,
        7: `### Ottimizzazione Magazzino (Just-in-Time)
- Consegna dei lotti di merce dal fornitore direttamente al cliente o in un piccolo spazio di stoccaggio temporaneo per azzerare le spese di affitto magazzino.`,
        8: `### Relazione Sourcing Finale
- La supply chain è stabile, i fornitori sono locali ed affidabili. Il rischio di rottura di stock è stimato sotto il 2% annuo.`
      },

      sales: {
        1: `### Copywriting per Landing Page
- **Hook Primario**: 'Basta inefficienze. Automatizza il tuo business e risparmia il 30% dei costi.'
- **Call to Action**: 'Inizia la prova gratuita di 14 giorni' (nessuna carta di credito richiesta).`,
        2: `### Script di Cold Outreach per LinkedIn/Email
- 'Ciao [Nome], noto che gestisci [Azienda]. Molte realtà a ${info.location || 'livello locale'} stanno riscontrando forti aumenti dei costi di gestione. Abbiamo sviluppato una soluzione semplice che automatizza il processo e taglia le spese. Ti andrebbe di dare un'occhiata veloce senza impegno?'`,
        3: `### Struttura del Pitch Deck di Vendita
- Presentazione in 6 passaggi focalizzata sul dimostrare l'impatto economico positivo immediato (il guadagno supera di 4 volte il costo del servizio).`,
        4: `### Messaggio WhatsApp di Vendita Diretta
- 'Ciao [Nome], ti andrebbe di provare la nostra demo per 7 giorni a costo zero? Ci occupiamo di configurare tutto noi in meno di 10 minuti. Fammi sapere se posso attivarti l'account!'`,
        5: `### Gestione delle Obiezioni Comuni
- Obiezione: 'Non ho tempo per configurarlo.'
- Risposta: 'Facciamo tutto noi a costo zero in 10 minuti, tu devi solo attivare l'account.'`,
        6: `### Listino Prezzi e Offerte di Lancio
- Offerta Fondatori: 'Solo per i primi 10 clienti della provincia, canone software bloccato a 19€/mese per sempre ed attivazione gratuita.'`,
        7: `### Email di Follow-up per Lead Freddi
- 'Ciao [Nome], ho visto che hai visitato la demo ma non hai completato l'attivazione. C'è qualcosa che non ti è chiaro o vuoi fare una chiamata veloce di 5 minuti?'`,
        8: `### Script dell'Elevator Pitch per Investitori
- '${appName} è la risposta alle inefficienze operative per ${isB2B ? 'le aziende' : 'i consumatori'} ${targetLoc}. Eliminiamo i costi superflui con la nostra piattaforma, garantendo un risparmio medio di 1.000€ all'anno. Abbiamo già validato la domanda con i primi clienti ed ora cerchiamo un partner per accelerare la diffusione sul territorio.'`
      }
    };

    // Ritorna la stringa formattata
    if (templates[agentKey] && templates[agentKey][phase]) {
      return templates[agentKey][phase];
    }
    
    // Fallback generico se non trova la combinazione esatta
    const agentName = AGENT_METADATA[agentKey] ? AGENT_METADATA[agentKey].name : agentKey;
    return `### Analisi Operativa (${agentName})
- **Focalizzazione Fase ${phase}**: Implementazione delle attività legate al settore ${info.sector} per il target ${info.target} ${targetLoc}.
- **Costi e Ottimizzazione**: Riduzione delle inefficienze in coerenza con la strategia di ${budgetTip}.
- **Azione Consigliata**: Procedere con i test lean e raccogliere i feedback degli utenti.`;
  },

  // Genera la sintesi dell'Orchestratore per una fase
  generateOrchestratorReport(info, phase, agentBriefs, previousAnswers = {}) {
    const targetLoc = info.location ? `a ${info.location}` : "sul mercato target";
    
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
      2: {
        text: `**FASE 2: ANALISI TARGET & COMPETITOR completata.**

Il profilo del cliente ideale è stato definito. L'analisi condotta conferma che il target ha una forte motivazione ad adottare la nostra soluzione per risparmiare tempo e denaro. Il posizionamento strategico si concentrerà sulla semplicità estrema e sul ROI immediato del servizio.

> [!IMPORTANT]
> **RED FLAG dal CLO**: Gestione dei dati sensibili e GDPR. Dobbiamo predisporre una Privacy Policy chiara prima di raccogliere dati degli utenti.`,
        questions: [
          "Qual è il prezzo massimo che ritieni i clienti sarebbero disposti a pagare mensilmente per questo servizio?",
          "Vuoi avviare la validazione con interviste dirette di persona o tramite un sondaggio online inviato via email?"
        ]
      },
      3: {
        text: `**FASE 3: STRATEGIA IBRIDA & GTM completata.**

La strategia Go-To-Market per il lancio ${targetLoc} integrerà canali organici e annunci digitali geolocalizzati. Il kit demo preparato dal CTO servirà ad illustrare il funzionamento del prodotto e facilitare le vendite dirette nella prima fase.

> [!NOTE]
> **Consiglio del CFO**: Allocare non più del 40% del budget iniziale per la promozione dei primi 30 giorni. Tenere la liquidità per l'operatività.`,
        questions: [
          "Vuoi attivare una partnership con professionisti o influencer locali per farti segnalare nuovi clienti in cambio di una provvigione?",
          "Quale canale pubblicitario preferisci prioritarizzare inizialmente: Facebook/Instagram o Google Search?"
        ]
      },
      4: {
        text: `**FASE 4: GROWTH HACK & OUTREACH completata.**

Implementeremo canali organici a costo zero per intercettare i clienti insoddisfatti dei concorrenti, utilizzando scraping mirato e programmi di referral. Questo ci permetterà di abbattere il Costo di Acquisizione Cliente (CAC) iniziale.

> [!WARNING]
> **RED FLAG dal CLO**: L'invio massivo di messaggi commerciali non richiesti (spam) viola il GDPR. Utilizziamo un approccio di outreach personalizzato su LinkedIn o via email diretta.`,
        questions: [
          "Sei d'accordo nell'attivare subito un programma referral che premia gli utenti attuali che portano amici?",
          "Preferisci gestire l'outreach iniziale scrivendo messaggi di persona o automatizzando i primi contatti con strumenti no-code?"
        ]
      },
      5: {
        text: `**FASE 5: COMPLIANCE & RISCHI completata.**

Abbiamo definito il perimetro legale e assicurativo del progetto. Per mitigare i rischi e minimizzare i costi, avvieremo l'attività con una Ditta Individuale in regime forfettario ed una polizza RC base per tutelare i fondatori.

> [!IMPORTANT]
> **Nota del CLO**: Ricordati che l'uso di marchi o nomi simili a concorrenti registrati può portare a diffide legali. Registreremo il marchio nazionale non appena validati i primi clienti.`,
        questions: [
          "Hai già un consulente fiscale di fiducia a cui affidare l'apertura della ditta individuale o preferisci affidarti a un servizio online?",
          "Accetti di inserire una clausola di esclusione di responsabilità nel contratto per tutelare la startup?"
        ]
      },
      6: {
        text: `**FASE 6: PIANO OPERATIVO & TECH STACK completata.**

Lo stack tecnologico no-code/low-code definitivo è configurato. Permetterà l'automazione dei flussi a costi fissi irrisori (~20€/mese), consentendo ai fondatori di concentrarsi interamente sulle vendite e sul supporto clienti.

> [!TIP]
> **Consiglio del CTO**: Usare Make.com per connettere Stripe con il database permette di risparmiare mesi di sviluppo e costi di programmazione.`,
        questions: [
          "Confermi l'utilizzo di strumenti gratuiti (come Trello o Notion) per la gestione dei task operativi?",
          "Sei d'accordo nell'eseguire personalmente le prime spedizioni/installazioni per comprendere al meglio i punti deboli del processo?"
        ]
      },
      7: {
        text: `**FASE 7: PIANO FINANZIARIO completata.**

Il modello finanziario a 12 mesi mostra un break-even point facilmente raggiungibile e una marginalità netta molto elevata (superiore al 70%). Il progetto è sostenibile in bootstrap e non richiede finanziamenti esterni per l'avvio.

> [!IMPORTANT]
> **Riepilogo CFO**: CAPEX iniziale stimato a ${this.generateFinancials(info).capex}, OPEX mensile a ${this.generateFinancials(info).opex}. Break-even fissato a ${this.generateFinancials(info).bep}.`,
        questions: [
          "Accetti queste proiezioni finanziarie? Possiamo procedere all'elaborazione del report finale?",
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

    return {
      text: `**FASE ${phase}: Elaborazione completata.**\n\nI report della boardroom sono stati raccolti ed analizzati. Procediamo con il piano in bootstrap.`,
      questions: ["Procediamo alla fase successiva?"]
    };
  },

  // Gestisce la sessione di brainstorming locale
  handleBrainstorm(info, agentKey, currentReport, userQuestion, history = []) {
    const meta = window.AGENT_METADATA[agentKey] || { name: agentKey, icon: "👤" };
    const q = userQuestion.toLowerCase();
    
    let agentResponse = "";
    let ceoResponse = "";

    if (q.includes("costo") || q.includes("prezzo") || q.includes("soldi") || q.includes("budget") || q.includes("spesa") || q.includes("finanz")) {
      agentResponse = `### Valutazione dei Costi (${meta.name})
- Ho analizzato la tua proposta di ottimizzazione finanziaria.
- Ridurremo le stime di spesa iniziali puntando su strumenti open-source e rimandando le spese non essenziali al secondo anno.
- Questo ci permetterà di abbassare il CAPEX stimato di circa il 15%, migliorando il flusso di cassa iniziale.`;
      ceoResponse = `### Decisione CEO (Orchestratore Master)
- **Ottimo**. Ridurre il costo fisso iniziale è vitale per mantenere l'approccio iper-lean di bootstrap.
- **Azione**: Autorizzo il CFO a modificare le tabelle del budget. Tagliamo le voci non prioritarie ed andiamo avanti.`;
    } else if (q.includes("tecnologia") || q.includes("software") || q.includes("codice") || q.includes("app") || q.includes("sito") || q.includes("database")) {
      agentResponse = `### Valutazione Tecnica (${meta.name})
- La tua proposta di semplificare lo stack software è corretta.
- Utilizzare una PWA (Progressive Web App) invece di un'applicazione nativa iOS/Android ci evita i costi di sviluppo doppio e le lungaggini di approvazione degli store Apple/Google.
- Possiamo lanciare il servizio in metà tempo e con costi di manutenzione pari a zero.`;
      ceoResponse = `### Decisione CEO (Orchestratore Master)
- **RED FLAG**: Ricordati che l'esperienza utente su mobile web deve comunque essere impeccabile, altrimenti perderemo clienti al primo intoppo.
- Però, data la riduzione del time-to-market di almeno 2 mesi, approvo formalmente l'MVP basato su PWA web.`;
    } else if (q.includes("competitor") || q.includes("concorrenza") || q.includes("justeat") || q.includes("glovo") || q.includes("amazon") || q.includes("mercato")) {
      agentResponse = `### Analisi di Posizionamento (${meta.name})
- Confrontandoci con i giganti del settore, il nostro punto di forza deve essere la vicinanza territoriale e l'assistenza personalizzata 1-a-1.
- Invece di competere sui prezzi di listino, offriremo garanzie di rimborso e tempi di esecuzione certi che i competitor nazionali non possono assicurare.`;
      ceoResponse = `### Decisione CEO (Orchestratore Master)
- Corretto. Il posizionamento non deve essere generalista. Dobbiamo essere i leader indiscussi di questa specifica nicchia locale.
- Procediamo con una comunicazione focalizzata interamente sul nostro differenziatore unico.`;
    } else if (q.includes("legge") || q.includes("gdpr") || q.includes("contratt") || q.includes("fiscale") || q.includes("p.iva") || q.includes("societ")) {
      agentResponse = `### Valutazione Legale & Compliance (${meta.name})
- Per quanto riguarda la conformità normativa, l'uso di contratti standard e l'adozione del regime forfettario sono perfetti per questa fase di lancio.
- Ridurremo le spese legali affidandoci a piattaforme online ed eviteremo contratti rigidi con i primi collaboratori.`;
      ceoResponse = `### Decisione CEO (Orchestratore Master)
- La conformità legale è fondamentale per evitare sanzioni che ucciderebbero il progetto sul nascere.
- Approvato il piano di compliance del CLO. Raccogliamo i consensi in modo trasparente sul sito.`;
    } else {
      // Risposta generica
      agentResponse = `### Analisi di Dettaglio (${meta.name})
- Ho preso in esame la tua proposta per questa sezione. 
- La considero del tutto in linea con gli obiettivi strategici definiti per la nostra Fase corrente. Implementerò queste indicazioni all'interno delle specifiche del report del mio dipartimento.`;
      ceoResponse = `### Decisione CEO (Orchestratore Master)
- Concordo con l'agente. Questa iterazione aggiunge valore al progetto e ci permette di affinare le operazioni in vista del lancio ufficiale. Procediamo.`;
    }

    return { agentText: agentResponse, ceoText: ceoResponse };
  }
};

// Esporta globalmente
window.LocalAgentSimulationEngine = LocalAgentSimulationEngine;
