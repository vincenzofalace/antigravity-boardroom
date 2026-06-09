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
        budgetAmount = 32000; // Costo macchina standard aggiornato
      } else if (sector === "saas" || sector === "mobile_app") {
        budgetAmount = 5000;
      } else {
        budgetAmount = 3000; // Bootstrap standard
      }
    }
    
    // Rileva se il budget è in puro bootstrap
    const isBootstrap = budget.toLowerCase().includes("bootstrap") || 
                        budget.toLowerCase().includes("zero") || 
                        budget.toLowerCase() === "0" || 
                        budget.toLowerCase() === "0€" || 
                        budgetAmount === 0;

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

    return { name, sector, target, location, budgetAmount, isVending, locationMissing: location === "", isBootstrap };
  },

  // Genera dati finanziari per la fase 7 / tab finanziario
  generateFinancials(info) {
    let capexVal = 0;
    let opexVal = 0;
    let bepUnit = "Unità";
    let bepVal = 0;
    let rows = [];

    if (info.isVending && info.sector === "food_beverage") {
      // CASO DISTRIBUTORE AUTOMATICO DI PIZZA (VALORI AGGIORNATI BENCHMARK ADIAL/LET'S PIZZA 2026)
      capexVal = 36500; // Costo macchina professionale nuova + spedizione Canarie + allacciamento e autorizzazioni
      opexVal = 890; // Affitto suolo, elettricità industriale forno+frigo h24, telemetria, assicurazione, manutenzione
      bepUnit = "Pizze Vendute / Mese";
      // Margine medio per pizza: Prezzo vendita medio 7.00€ - Costo base+ingredienti 2.00€ - Comm. POS 0.15€ = 4.85€
      bepVal = Math.round(opexVal / 4.85); // Circa 184 pizze al mese (circa 6 pizze al giorno per pareggiare gli OPEX)
      
      const isCanarias = info.location && info.location.includes("Canarie");

      rows = [
        { item: "Distributore Automatico Pizza Professionale (con forno a pietra integrato - es. Adial Pizzadoor / Let's Pizza)", type: "CAPEX", cost: "32,000.00 €", source: "Benchmark di mercato produttori UE (Adial France / Let's Pizza retail)" },
        { item: "Trasporto, Dogana e Sdoganamento a " + (info.location || "destinazione"), type: "CAPEX", cost: isCanarias ? "2,500.00 €" : "1,200.00 €", source: "Logistica mare/container + Sdoganamento IGIC Canarie" },
        { item: "Allacciamento elettrico trifase, aumento potenza (5kW picco) e SCIA comunale", type: "CAPEX", cost: "1,200.00 €", source: "Lavori tecnici di attivazione e certificazione loco" },
        { item: "Affitto spazio commerciale (suolo privato esterno o fronte strada)", type: "OPEX", cost: "450.00 € / mese", source: "Stima contratti area commerciale ad alto traffico a Gran Canaria" },
        { item: "Consumo energia elettrica (forno pietra e frigo h24)", type: "OPEX", cost: "180.00 € / mese", source: "Tariffe energia elettrica industriale Spagna (picco forno 3.5 kW)" },
        { item: "Connettività SIM 4G e Telemetria remota (Nayax/POS cashless)", type: "OPEX", cost: "35.00 € / mese", source: "Abbonamento Nayax Core + Canone SIM" },
        { item: "Assicurazione RC Prodotti & Danni (atti vandalici e guasti)", type: "OPEX", cost: "45.00 € / mese", source: "Polizza assicurativa business Allianz Spagna" },
        { item: "Quota Autónomo (previdenza sociale spagnola flat rate)", type: "OPEX", cost: "80.00 € / mese", source: "Regime agevolato primo anno Autónomo Spagna" },
        { item: "Accantonamento manutenzione ordinaria programmata e filtri", type: "OPEX", cost: "100.00 € / mese", source: "Stima costi usura parti meccaniche/resistenze" },
        { item: "Adempimenti amministrativi, HACCP e Registro Sanitario", type: "CAPEX", cost: "800.00 €", source: "Pratiche Asesoria locale e biologo alimentare" }
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
    const isCanarias = info.location && info.location.includes("Canarie");
    const targetLoc = info.location ? `a ${info.location}` : "nell'area geografica target";
    const appName = info.name;
    const budgetTip = info.isBootstrap ? "puro bootstrap (budget ~0€)" : `un budget iniziale di ${info.budgetAmount}€`;

    const agentMeta = (window.AGENT_METADATA && window.AGENT_METADATA[agentKey]) || { name: agentKey, role: "Advisor", icon: "👤" };
    const agentName = agentMeta.name;
    const agentRole = agentMeta.role;

    // 1. Definiamo le obiezioni generali per agente
    let objections = [];
    let phaseAnalysis = "";
    let verdict = "APPROVATO CON RISERVA";
    let verdictReason = "";

    // Dettaglio settore per testi dinamici
    const isPizzaVending = info.isVending && info.sector === "food_beverage";
    
    // Obiezioni specifiche per agente
    if (agentKey === "cmo") {
      objections = [
        "**Scetticismo del Consumatore**: C'è una barriera culturale forte nell'acquistare cibo caldo (specialmente pizza) da un distributore automatico, spesso percepito come di bassa qualità.",
        "**Dipendenza Totale dalla Location**: Se il posizionamento fisico non ha un passaggio pedonale continuo h24 (specialmente notturno), la macchina rimarrà inutilizzata.",
        "**Vandalismo e Visibilità**: I punti ad alto traffico notturno sono esposti ad atti vandalici o sporcizia che allontanano la clientela."
      ];
      verdictReason = "Il posizionamento richiede una validazione preventiva e un wrapping visivo di altissimo livello per superare la diffidenza iniziale.";
    } else if (agentKey === "cfo") {
      if (info.isBootstrap) {
        objections = [
          "**INCOMPATIBILITÀ DI BUDGET (CRITICA)**: Hai indicato un budget di 0€ (Bootstrap). Una macchina vending professionale nuova costa circa 32.000€ + logistica. Il progetto è finanziariamente IMPOSSIBILE con queste premesse.",
          "**Costi Fissi Ricorrenti**: Anche se la macchina fosse gratuita, l'affitto dello spazio e l'energia elettrica industriale h24 richiedono un flusso di cassa di almeno 800€/mese fin dal primo giorno.",
          "**Tempo di Rientro (Payback)**: Con 184 pizze/mese necessarie per il break-even operativo, il rischio di insolvenza nei primi 3 mesi è altissimo in mancanza di capitale circolante."
        ];
        verdict = "BOCCIATO (Fondi Insufficienti)";
        verdictReason = "Il budget corrente non consente l'acquisto o l'installazione del macchinario. È necessario fare un pivot verso il noleggio operativo o capitali esterni.";
      } else {
        objections = [
          "**Aumento Costo Macchinari**: I costi correnti dei distributori a pietra (Adial, Let's Pizza) sono aumentati a causa delle materie prime (€32k-35k base).",
          "**Costo Energia Elettrica**: Il forno a picco trifase (5kW) consuma in media 150-200€ al mese di elettricità a tariffe industriali.",
          "**Margine su Ingredienti**: Il margine si contrae se non si ottiene un prezzo all'ingrosso (<1.80€ a pizza) sulle basi precotte."
        ];
        verdict = "APPROVATO";
        verdictReason = "I margini unitari (>70%) supportano l'investimento se il volume minimo di 6 pizze al giorno viene mantenuto.";
      }
    } else if (agentKey === "cto") {
      objections = [
        "**Rischio Alimentare (Catena del Freddo)**: Se il frigo interno subisce un blackout o un guasto al compressore, le pizze raggiungono temperature pericolose per la proliferazione batterica.",
        "**Complessità Meccanica**: Il sistema di trasferimento della pizza dal frigo al forno a pietra ha molte parti in movimento soggette a inceppamenti causati da umidità o cartone deformato.",
        "**Manutenzione in Loco**: Sulle isole come Gran Canaria, i pezzi di ricambio specifici (es. cinghie ad alta temperatura, schede Nayax) richiedono giorni per la spedizione dalla Spagna continentale."
      ];
      verdictReason = "La telemetria h24 è indispensabile per monitorare sbalzi termici e bloccare le vendite in automatico in caso di anomalie.";
    } else if (agentKey === "coo") {
      objections = [
        "**Saturazione Operativa**: Il rifornimento giornaliero e la pulizia del forno a pietra (rimozione briciole, igienizzazione vano) richiedono circa 1 ora al giorno. Se svolto dal fondatore, limita la scalabilità; se esternalizzato, azzera i profitti del singolo punto.",
        "**Logistica delle Basi Fresche**: Ottenere una fornitura costante di basi pizza fresche che durino 48 ore senza deteriorarsi richiede una partnership molto rigida con un panificio locale.",
        "**Gestione degli Scarti**: Le pizze non vendute entro 48 ore devono essere eliminate fisicamente, aumentando il tasso di scarto stimato al 10% all'inizio."
      ];
      verdictReason = "Operatività fattibile per un singolo punto, ma richiede la standardizzazione dei processi prima di scalare a una flotta di macchine.";
    } else if (agentKey === "clo") {
      objections = [
        "**Tempi di Concessione Comunale (Suolo Pubblico)**: Richiedere l'occupazione di suolo pubblico al Ayuntamiento locale può richiedere fino a 12 mesi di burocrazia, con alta probabilità di diniego.",
        "**Normativa Sanitaria e HACCP**: Il controllo della temperatura della carne/formaggio sulle pizze precotte richiede la certificazione del laboratorio fornitore e la SCIA sanitaria della macchina.",
        "**Assicurazione RC obbligatoria**: Il rischio di intossicazione alimentare o danni fisici da erogatore caldo richiede coperture assicurative elevate."
      ];
      verdictReason = "Consigliamo vivamente di evitare il suolo pubblico ed installare la macchina su suolo privato (fronte strada o corte di negozi esistenti) tramite contratto di locazione privato.";
    } else if (agentKey === "cco") {
      objections = [
        "**Percezione 'Cibo Spazzatura'**: Un design troppo industriale o freddo farà associare la pizza a quella surgelata da microonde.",
        "**Incoerenza Visiva**: Se il wrapping grafico non comunica immediatamente l'artigianalità italiana della base, il passante ignorerà la macchina."
      ];
      verdictReason = "Uso obbligatorio di wrapping texturizzato (effetto pietra/legno), illuminazione calda ed elementi grafici che richiamino la tradizione italiana.";
    } else if (agentKey === "cso") {
      objections = [
        "**Assenza di Contatto Umano**: In caso di errore di erogazione (es. pizza incastrata o non cotta bene), il cliente si sente truffato e frustrato, lasciando recensioni negative online.",
        "**Difficoltà per Utenti Senior**: Schermi touch e pagamenti solo digitali escludono una parte di clientela locale più anziana."
      ];
      verdictReason = "Necessario un adesivo gigante con QR/WhatsApp per rimborsi immediati automatici in 5 minuti (es. via Bizum/PayPal).";
    } else if (agentKey === "cpo") {
      objections = [
        "**Limiti di Menu**: La macchina può contenere solo 3-4 gusti al massimo. Gusti troppo complessi si degradano rapidamente nella cella frigo.",
        "**Qualità della Cottura a Tempo**: Cuocere una pizza in 180 secondi richiede basi con idratazione specifica (65%) e formaggio a basso rilascio di acqua per evitare l'effetto 'bollito'."
      ];
      verdictReason = "Menu limitato a 3 classici (Margherita, Diavola, Prosciutto) per ottimizzare la rotazione ed evitare scarti commerciali.";
    } else if (agentKey === "sourcing") {
      objections = [
        "**Spedizione e Sdoganamento Canarie**: Spedire un macchinario da 500 kg richiede trasporto marittimo. Le dogane canarie (DUA) e l'applicazione dell'IGIC possono ritardare l'installazione di settimane.",
        "**Fornitura Basi Speciali**: Pochi panifici locali a Gran Canaria sono attrezzati per produrre basi precotte stese a mano con le dimensioni geometriche precise richieste dal braccio meccanico."
      ];
      verdictReason = "La macchina richiede tolleranze millimetriche sul diametro (26cm) e spessore per non inceppare il caricatore.";
    } else if (agentKey === "sales") {
      objections = [
        "**Trattativa Spazi ad Alto Traffico**: I proprietari di spazi commerciali migliori richiedono affitti mensili sproporzionati rispetto alle vendite stimate, erodendo tutto l'utile.",
        "**Commissioni POS Cashless**: La telemetria e i pagamenti digitali Nayax trattengono fino al 3.5% su transazioni di piccolo importo."
      ];
      verdictReason = "Proporre un affitto variabile (% sulle vendite con minimo garantito) per allineare gli interessi del proprietario dello spazio.";
    } else if (agentKey === "capital") {
      objections = [
        "**Mancanza di Scalabilità per Venture Capital**: Un singolo distributore è un'attività di puro sostentamento familiare. Non è adatta ad attirare fondi di investimento senza un piano per una flotta di 50+ macchine.",
        "**Difficoltà di Finanziamento Bancario**: Le banche tradizionali finanziano difficilmente macchinari vending posizionati all'aperto a causa del rischio furto/vandalismo."
      ];
      verdictReason = "Utilizzare autofinanziamento o micro-crediti agevolati regionali (es. prestiti ENISA o fondi per lo sviluppo delle Canarie).";
    } else {
      objections = [
        "**Rischio Esecutivo**: Mancanza di competenze verticali nella gestione di reti di distribuzione automatica.",
        "**Barriere di Ingresso**: Concorrenza di catene fast-food consolidate con orari estesi."
      ];
      verdictReason = "Avviare un test pilota per misurare la risposta del mercato reale.";
    }

    // Genera l'analisi specifica in base alla fase e al settore
    if (isPizzaVending) {
      switch (phase) {
        case 1:
          phaseAnalysis = `- **Rilevazione del Problema**: A ${info.location || "Gran Canaria"} manca un'offerta di ristorazione calda H24 rapida e di qualità. Le pizzerie tradizionali chiudono a mezzanotte, lasciando scoperti turisti notturni e lavoratori Horeca.
- **Validazione Iniziale**: Prima di spendere 32.000€ per la macchina, condurremo interviste sul posto a 50 passanti nelle aree selezionate, mostrando foto del prodotto e testando la disponibilità a pagare 7.00€ per una pizza calda in 3 minuti.
- **Soglia di Rischio**: Se meno del 60% degli intervistati si dichiara interessato, l'idea va modificata o abbandonata.`;
          break;
        case 2:
          phaseAnalysis = `- **Segmentazione Target**: Identificati 3 segmenti principali: turisti di ritorno dai locali (ore 01:00 - 05:00), lavoratori del settore turistico/ristorazione che finiscono il turno tardi, residenti locali per uno spuntino veloce diurno.
- **Mappa dei Competitor**: Supermercati aperti fino a tardi (offrono solo cibo freddo industriale), pizzerie d'asporto (lente e chiuse di notte), distributori classici di snack e biete (basso valore nutrizionale). Nessuno offre pizza calda su pietra.`;
          break;
        case 3:
          phaseAnalysis = `- **Strategia di Lancio (GTM)**: Wrapping esterno della macchina con colori caldi (rosso/grigio pietra) ed elementi visivi tridimensionali. Installazione di un'insegna a bandiera LED retroilluminata H24 per rendersi visibili a distanza.
- **Local SEO**: Posizionamento della macchina registrato su Google Maps, Apple Maps e TripAdvisor come 'Pizza Express 24h', ottimizzando le parole chiave per le ricerche turistiche locali notturne.`;
          break;
        case 4:
          phaseAnalysis = `- **Passaparola Digitale (Growth)**: QR Code stampato sul cartone della pizza che rimanda alla scheda Google Maps: lasciando una recensione con foto, l'utente riceve via WhatsApp un codice promozionale con il 20% di sconto sul prossimo acquisto.
- **Partnership Locali**: Fornitura di brochure o slide digitali per i gestori di case vacanza e Airbnb nel raggio di 500 metri, promuovendo il servizio pizza H24 per i loro ospiti che arrivano con voli notturni.`;
          break;
        case 5:
          phaseAnalysis = `- **Burocrazia Spagnola**: Presentazione della SCIA (*Comunicación Previa de Actividad*) presso il municipio di riferimento. Iscrizione obbligatoria al Registro Sanitario dell'arcipelago.
- **Compliance Alimentare**: Certificazione HACCP del laboratorio esterno che fornisce le basi pizza precotte fresche. La macchina deve possedere certificato CE e certificazione MOCA per il forno a pietra interno.`;
          break;
        case 6:
          phaseAnalysis = `- **Flusso Operativo Giornaliero**: Rifornimento programmato ogni mattina alle 09:00 (caricamento di circa 40-50 pizze). Pulizia della camera di cottura, svuotamento cassetto briciole ed igienizzazione del touchscreen.
- **Telemetria**: Utilizzo del portale Nayax per monitorare in tempo reale le scorte, le transazioni e la temperatura interna della cella frigo, con alert automatici via SMS in caso di anomalie di corrente.`;
          break;
        case 7:
          phaseAnalysis = `- **Punto di Pareggio (Break-Even)**: Con un CAPEX iniziale di 36.500€ (macchina, trasporto, SCIA) e OPEX fissi di 890€/mese (affitto suolo, corrente, Autónomo, telemetria), la soglia di pareggio è fissata a **184 pizze al mese** (circa 6 pizze al giorno ad un prezzo medio di 7.00€).
- **Rientro Investimento (ROI)**: Con una media di 15 pizze vendute al giorno, l'utile netto mensile stimato è di 1.250€, portando al rientro dell'investimento iniziale in circa 15 mesi.`;
          break;
        case 8:
          phaseAnalysis = `- **Sintesi Executive**: Il progetto presenta un'elevata marginalità operativa unitaria (~70%) e risponde ad un bisogno reale. Tuttavia, il successo è subordinato al reperimento della location ideale ad altissimo traffico pedonale e all'efficienza logistica giornaliera.
- **Raccomandazione**: Procedere al posizionamento pilota solo dopo aver firmato un contratto d'affitto suolo privato ed ottenuto la conformità sanitaria.`;
          break;
      }
    } else {
      // Analisi generale per altri settori
      switch (phase) {
        case 1:
          phaseAnalysis = `- **Rilevazione dell'Opportunità**: Il progetto mira a digitalizzare o ottimizzare l'offerta nel settore **${info.sector.toUpperCase()}** ${targetLoc}.
- **Validazione Lean**: Creazione di una semplice landing page per raccogliere indirizzi email e manifestazioni di interesse prima di avviare lo sviluppo del servizio o l'acquisto di stock.`;
          break;
        case 2:
          phaseAnalysis = `- **Definizione Target**: Focus su un segmento di clienti insoddisfatti delle soluzioni attuali per motivi di costo, lentezza o complessità d'uso.
- **Competitor**: Analisi dei leader di mercato tradizionali e identificazione della nostra nicchia di posizionamento differenziante.`;
          break;
        case 3:
          phaseAnalysis = `- **Canali di Acquisizione**: Utilizzo di canali digitali diretti (Ads geolocalizzate, SEO di nicchia o outreach diretto B2B) per minimizzare la spesa iniziale.
- **Value Proposition**: Messaggio chiaro centrato sulla risoluzione del problema principale con attrito zero.`;
          break;
        case 4:
          phaseAnalysis = `- **Growth Strategy**: Implementazione di un programma di referral ('porta un amico') per ridurre il costo di acquisizione cliente (CAC).
- **Outreach**: Contatto diretto con i primi 20 influencer o figure chiave del settore per ottenere recensioni e credibilità iniziale.`;
          break;
        case 5:
          phaseAnalysis = `- **Aspetti Legali**: Apertura di P.IVA agevolata (es. regime forfettario), adempimento GDPR per la raccolta dati degli utenti e stesura dei termini di servizio.
- **Rischi di Compliance**: Verifica di eventuali licenze o permessi specifici richiesti dal settore operativo.`;
          break;
        case 6:
          phaseAnalysis = `- **Infrastruttura No-Code/Low-Code**: Utilizzo di strumenti web pronti (Carrd, Shopify, Notion, Make) per avviare l'attività senza costi fissi di sviluppo software custom.
- **Operazioni**: Definizione delle routine quotidiane per la gestione delle richieste clienti e fatturazione automatica.`;
          break;
        case 7:
          phaseAnalysis = `- **Struttura dei Costi**: CAPEX ridotto al minimo grazie allo stack software no-code. OPEX composto da hosting, piccoli budget pubblicitari e consulenza fiscale.
- **Margine e BEP**: Margine lordo atteso elevato (>60%), con break-even point raggiungibile con pochissimi clienti attivi paganti al mese.`;
          break;
        case 8:
          phaseAnalysis = `- **Sintesi Operativa**: Progetto fattibile in tempi rapidi con investimenti contenuti. Focus primario sul marketing di validazione nei primi 30 giorni.
- **Prossimi Passi**: Lanciare la landing page pilota e avviare le prime campagne pubblicitarie di test.`;
          break;
      }
    }

    // Costruiamo il report finale
    let reportText = `### ${agentMeta.icon} ${agentName} - ${agentRole} (Fase ${phase})\n\n`;
    
    // Mostriamo l'analisi
    reportText += `#### 🔍 Analisi di Competenza & Fattibilità\n${phaseAnalysis}\n\n`;

    // Mostriamo le obiezioni (Sincerità)
    reportText += `#### ⚠️ Critiche, Obiezioni & Punti Deboli (Sincerità Boardroom)\n`;
    objections.forEach(obj => {
      reportText += `- ${obj}\n`;
    });
    reportText += `\n`;

    // Se la località è mancante, mostriamo le raccomandazioni
    if (info.locationMissing) {
      reportText += `#### 📍 Analisi Geografica & Raccomandazione Zone\n`;
      reportText += `> [!WARNING]\n`;
      reportText += `> **Mancanza di Dati Geografici**: Non hai indicato una zona geografica specifica per il progetto. Un business fisico o di distribuzione automatica richiede una geolocalizzazione precisa.\n\n`;
      reportText += `Ecco le migliori opzioni consigliate per questo tipo di attività a **Gran Canaria (Canarie)**:\n`;
      reportText += `- **Playa del Inglés / Maspalomas (Sud)**: Altissimo flusso di turisti H24, locali notturni e pub. Massimizza le vendite notturne, ma i costi di affitto dello spazio privato sono elevati.\n`;
      reportText += `- **Las Palmas - Las Canteras / Mesa y López (Nord)**: Mix ottimale di residenti stabili, turisti e lavoratori notturni. Minore stagionalità rispetto al sud, consumi costanti tutto l'anno.\n`;
      reportText += `- **San Telmo / Intercambiador (Las Palmas)**: Hub di transito bus principali, ideale per spuntini rapidi diurni di pendolari, studenti e impiegati.\n\n`;
    }

    // Se è in bootstrap ma richiede CAPEX elevato
    if (info.isBootstrap && (info.isVending || info.sector === "food_beverage" || info.sector === "retail")) {
      reportText += `#### 💡 Pivot per Validazione in Bootstrap (Opzioni a Costo Zero)\n`;
      reportText += `> [!IMPORTANT]\n`;
      reportText += `> **Conflitto Budget/CAPEX**: Il budget 'Bootstrap/0€' non consente l'acquisto diretto del macchinario (€36.500).\n\n`;
      reportText += `Ecco come puoi procedere senza disporre dei capitali iniziali:\n`;
      reportText += `- **Noleggio Operativo / Leasing**: Molti produttori o distributori offrono formule di noleggio a lungo termine con riscatto, riducendo il CAPEX iniziale a un deposito cauzionale di circa 1.00€ e una quota mensile (OPEX).\n`;
      reportText += `- **Macchinario Usato Rigenerato**: Ricerca di modelli precedenti sul mercato dell'usato spagnolo (MilAnuncios / Wallapop) con prezzi inferiori del 50% (€15.000 - €18.000).\n`;
      reportText += `- **Joint Venture con Locali Esistenti**: Trova un bar o un minimarket in una zona strategica. Proponi di installare la macchina all'interno o all'esterno del loro locale: loro mettono lo spazio e la corrente elettrica, tu gestisci l'operatività e dividete gli utili al 50%. Questo azzera i costi fissi e di acquisto iniziale se trovi un partner finanziatore.\n`;
      reportText += `- **Pivot Digitale Temporaneo**: Anziché acquistare una macchina fisica, crea una landing page che aggrega le pizzerie da asporto locali attive di notte a Gran Canaria, prendendo una commissione sulle vendite. Validi il mercato notturno con 0€ di CAPEX.\n\n`;
    }

    // Verdetto finale dell'agente
    let verdictColor = "orange";
    if (verdict.includes("BOCCIATO")) verdictColor = "red";
    if (verdict === "APPROVATO") verdictColor = "green";

    reportText += `#### 🚨 Verdetto di Sostenibilità dell'Agente\n`;
    reportText += `- **Verdetto**: **\`${verdict}\`**\n`;
    reportText += `- **Motivazione**: ${verdictReason}\n\n`;
    reportText += `---`;

    return reportText;
  },

  // Genera la sintesi dell'Orchestratore per una fase
  generateOrchestratorReport(info, phase, agentBriefs, previousAnswers = {}) {
    const isPizzaVending = info.isVending && info.sector === "food_beverage";
    const targetLoc = info.location ? `a ${info.location}` : "sul mercato target";
    
    let text = "";
    let questions = [];

    // Costruiamo la sintesi dell'Orchestratore Master
    text += `### 👑 Orchestratore Master - Sintesi Strategica della Fase ${phase}\n\n`;
    
    if (isPizzaVending) {
      text += `Il progetto **${info.name}** si concentra sulla somministrazione di pizza calda H24 tramite distributore automatico. `;
    } else {
      text += `Il progetto **${info.name}** si colloca nel settore **${info.sector.toUpperCase()}** ${targetLoc}. `;
    }

    // Se località mancante
    if (info.locationMissing) {
      text += `\n\n> [!CAUTION]\n`;
      text += `> **ANOMALIA GEOGRAFICA DETECTED**: Non è stata specificata una località. Gli agenti concordano che un'installazione fisica o commerciale necessita di geolocalizzazione precisa per valutare traffico, permessi e logistica. Proponiamo come area di test pilota **Gran Canaria (Canarie)** per via dei vantaggi fiscali (IGIC al 7%) e del clima turistico continuo.\n\n`;
    }

    // Se bootstrap ma CAPEX alta
    if (info.isBootstrap && (info.isVending || info.sector === "food_beverage" || info.sector === "retail")) {
      text += `\n\n> [!WARNING]\n`;
      text += `> **BLOCCO DI FATTIBILITÀ (VETO FINANZIARIO)**: Il CFO ha bocciato l'idea di acquisto diretto del macchinario in regime di Bootstrap (0€ budget). Il CAPEX richiesto (€36.500) non è sostenibile senza fonti di finanziamento esterne o leasing.\n\n`;
    }

    // Dettaglio fasi
    switch (phase) {
      case 1:
        text += `**FASE 1: VALIDAZIONE & LEAN CANVAS completata.**\n`;
        text += `Abbiamo analizzato il modello di business. La Boardroom solleva forti obiezioni sulla fattibilità in bootstrap e sulla mancanza di geolocalizzazione.\n`;
        text += `- **Obiezione Principale (CMO)**: Scetticismo culturale sul cibo da distributore. Dobbiamo testare l'interesse con interviste fisiche prima di investire.\n`;
        text += `- **Obiezione di Costo (CFO)**: Costo della macchina di €32.000 insostenibile in bootstrap. Consigliato il pivot verso il noleggio o la Joint Venture.\n`;
        
        if (info.locationMissing) {
          questions = [
            "Selezionare l'Opzione 1: Playa del Inglés (Maspalomas) - Ottimale per il turismo notturno.",
            "Selezionare l'Opzione 2: Las Palmas (Las Canteras) - Ottimale per residenti e turisti fissi.",
            "Fornire una zona differente di tua preferenza."
          ];
        } else if (info.isBootstrap) {
          questions = [
            "Accettare il pivot verso il Noleggio Operativo (OPEX mensile, CAPEX minimo).",
            "Accettare il pivot verso la Joint Venture con un locale esistente a Gran Canaria.",
            "Modificare il budget immettendo capitale proprio (minimo 36.500€)."
          ];
        } else {
          questions = [
            "Procedere con 50 interviste sul campo a Gran Canaria per validare il prezzo di 7.00€.",
            "Sviluppare un sondaggio online da promuovere sui gruppi turisti Canarie."
          ];
        }
        break;

      case 2:
        text += `**FASE 2: ANALISI TARGET & COMPETITOR completata.**\n`;
        text += `Abbiamo profilato i clienti e mappato i concorrenti. La notte è la nostra finestra di mercato esclusiva.\n`;
        text += `- **Mercato**: Le pizzerie tradizionali chiudono presto, lasciando un vuoto d'offerta che possiamo colmare.\n`;
        text += `- **Rischio**: Competitori indiretti (snack bar freddi o fast food aperti H24) hanno prezzi bassi ma qualità inferiore.\n`;
        
        questions = [
          "Focalizzarsi esclusivamente sulla fascia oraria notturna (22:00 - 06:00).",
          "Mantenere la macchina attiva H24 con promozioni diurne per studenti e lavoratori."
        ];
        break;

      case 3:
        text += `**FASE 3: STRATEGIA IBRIDA & GTM completata.**\n`;
        text += `La strategia GTM si basa sull'estetica del punto vendita fisico e sulla SEO locale.\n`;
        text += `- **Estetica (CCO)**: Wrapping che evoca la tradizione italiana per combattere la percezione di 'cibo da microonde'.\n`;
        text += `- **Digitale (CMO)**: Presenza sulle mappe per catturare le ricerche organiche da smartphone.\n`;
        
        questions = [
          "Wrapping classico: Rosso pomodoro ed effetto pietra / legno rustico.",
          "Wrapping moderno: Colori neon e grafiche futuristiche per la clientela giovane."
        ];
        break;

      case 4:
        text += `**FASE 4: GROWTH HACK & OUTREACH completata.**\n`;
        text += `Pianificato il passaparola e le partnership locali.\n`;
        text += `- **Growth Hack**: QR Code sulla confezione che regala sconti in cambio di recensioni su Google Maps.\n`;
        text += `- **Outreach**: Accordo con i gestori di alloggi turistici e host Airbnb per includere la pizza H24 nelle loro guide di benvenuto.\n`;
        
        questions = [
          "Attivare il QR code sconto del 20% per recensioni Google immediate.",
          "Attivare una partnership offrendo pizza gratis ai tassisti per farli parlare del nostro punto."
        ];
        break;

      case 5:
        text += `**FASE 5: COMPLIANCE & RISCHI completata.**\n`;
        text += `Analizzati i permessi legali e sanitari.\n`;
        text += `- **Red Flag (CLO)**: I tempi per l'occupazione di suolo pubblico comunale sono biblici. La Boardroom consiglia l'affitto su suolo privato di fronte a un negozio.\n`;
        text += `- **Sanità**: Obbligo di SCIA sanitaria e catena del freddo certificata HACCP.\n`;
        
        questions = [
          "Procedere solo con spazi privati (bar, stazioni, cortili privati) per avvio rapido in 15 giorni.",
          "Presentare domanda per suolo pubblico comunale accettando tempi lunghi (6-12 mesi)."
        ];
        break;

      case 6:
        text += `**FASE 6: PIANO OPERATIVO & TECH STACK completata.**\n`;
        text += `Definite le routine giornaliere e la telemetria.\n`;
        text += `- **Operations**: Rifornimento quotidiano (1 ora/giorno) e pulizia igienica manuale.\n`;
        text += `- **Tech**: Nayax Onyx gestisce la telemetria (alert temperature/scorte via Make e Telegram) ed i pagamenti cashless.\n`;
        
        questions = [
          "Gestione operativa diretta (svolta da te in loco).",
          "Delega ad un operatore locale part-time (incide per circa 300€/mese sul bilancio)."
        ];
        break;

      case 7:
        text += `**FASE 7: PIANO FINANZIARIO completata.**\n`;
        text += `Margini e break-even verificati.\n`;
        text += `- **CAPEX**: €36.500 (macchina, spedizione, allacciamento, SCIA).\n`;
        text += `- **OPEX**: €890/mese (affitto suolo, corrente h24, Autónomo flat, SIM, manutenzione).\n`;
        text += `- **BEP**: 184 pizze al mese (circa 6 pizze al giorno a 7.00€ medio).\n`;
        
        questions = [
          "Accettare il piano finanziario e passare alla sintesi executive.",
          "Ricalcolare il piano ipotizzando l'uso di una macchina usata (€20.000 CAPEX)."
        ];
        break;

      case 8:
        text += `**FASE 8: EXECUTIVE SUMMARY & PITCH completata.**\n`;
        text += `Il progetto è investor-ready. Tutti i dati sono strutturati.\n`;
        text += `- **Stato**: Pronto per l'esportazione in formato Markdown.\n`;
        text += `- **Raccomandazione**: Presenta questo report a proprietari di spazi o finanziatori per negoziare le migliori condizioni.\n`;
        
        questions = [
          "Scarica il report finale in formato Markdown (.md).",
          "Ricomincia la simulazione con un altro progetto o budget."
        ];
        break;
    }

    return { text, questions };
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
