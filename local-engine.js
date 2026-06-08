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
    const budgetTip = info.budgetAmount <= 1000 ? "puro bootstrap (budget ~0€)" : `un budget iniziale di ${info.budgetAmount}€`;

    const agentMeta = (window.AGENT_METADATA && window.AGENT_METADATA[agentKey]) || { name: agentKey, role: "Advisor", icon: "👤" };
    const agentName = agentMeta.name;
    const agentRole = agentMeta.role;

    let content = "";
    
    // 1. CASO SPECIALE: DISTRIBUTORE DI PIZZE AUTOMATICO ALLE CANARIE
    if (info.isVending && info.sector === "food_beverage") {
      switch (agentKey) {
        case "cmo":
          switch (phase) {
            case 1:
              content = `### Analisi del Problema & Competitor (CMO)
- **Dolore Rilevato sul Mercato**: Assenza totale di opzioni di ristorazione calda, espressa e di qualità nelle ore notturne o nei punti strategici di passaggio ${targetLoc} (lungomare, aree pub, fermate bus). Le pizzerie tradizionali chiudono presto e i distributori automatici tradizionali offrono solo snack confezionati freddi.
- **Mappa dei Competitor**: Supermercati H24 (cibo freddo industriale), pizzerie locali (orari limitati, attese lunghe) e macchine snack classiche. Nessuno serve pizza calda cotta a pietra pronta in 3 minuti.
- **Protocollo di Validazione**: Condurremo un sondaggio sul campo intervistando 50 potenziali acquirenti (turisti notturni, lavoratori Horeca, tassisti) per testare la propensione di spesa su prezzi di 6.50€ - 7.50€.`;
              break;
            case 2:
              content = `### Analisi Target & Profilo Utente (CMO)
- **Profilazione del Cliente Target**: Giovani frequentatori di locali notturni, turisti low-budget che preferiscono cenare fuori dagli orari standard, tassisti e addetti alla sicurezza.
- **Posizionamento Differenziante**: La combinazione unica di velocità (180 secondi), cottura su pietra, ingredienti italiani e operatività h24.
- **Analisi Geografica**: Identificate tre zone chiave ad altissimo traffico pedonale per posizionare il distributore (es. vicino alla spiaggia di Las Canteras a Las Palmas, o Playa del Inglés).`;
              break;
            case 3:
              content = `### Strategia Go-To-Market (CMO)
- **Canali Fisici (Primari)**: Wrapping visivo completo del distributore con grafiche accattivanti a tema 'Pizzeria Italiana' e luci a LED retroilluminate h24 per rendersi visibili a distanza di notte.
- **Geolocalizzazione Digitale**: Registrazione su Google Maps e TripAdvisor come 'Pizzeria 24 ore' per catturare tutte le ricerche organiche notturne dei turisti.
- **Social Ads Georeferenziate**: Campagne Instagram e Facebook attive esclusivamente dalle 22:00 alle 05:00 rivolte agli utenti nel raggio di 2 km dal distributore.`;
              break;
            case 4:
              content = `### Growth Hack & Outreach (CMO)
- **QR Code Referral**: Codice QR stampato sulla scatola della pizza. Offre un codice sconto del 15% sulla pizza successiva se l'utente lascia una recensione a 5 stelle su Google Maps.
- **Outreach Airbnb**: Accordo informale con i gestori di case vacanza per inserire una slide sulla nostra pizza h24 nella loro guida turistica digitale in cambio di codici promo personalizzati.
- **B2B Outreach**: Offrire la prima pizza gratuita ai tassisti locali per trasformarli in ambasciatori organici del nostro punto vendita.`;
              break;
            case 5:
              content = `### Analisi dei Rischi di Mercato (CMO)
- **Rischio di Reputazione**: Lo scetticismo iniziale dei consumatori verso il cibo preparato da una macchina. Mitigato promuovendo l'uso di basi artigianali e ingredienti freschi.
- **Rischio Stagionale**: Fluttuazioni del flusso turistico nei mesi non di picco. Mitigato posizionando il punto in una zona mista (turisti e residenti come Las Palmas).`;
              break;
            case 6:
              content = `### Strumenti di Marketing (CMO)
- **Analytics & Tracking**: Utilizzo della telemetria Nayax per raccogliere i dati storici delle vendite e incrociarli con gli orari di picco per ottimizzare le promozioni dello schermo.
- **Visual Asset**: Servizio fotografico professionale delle pizze cotte dalla macchina per le campagne social.`;
              break;
            case 7:
              content = `### Budget Marketing & CAC (CMO)
- **CAC (Costo di Acquisizione)**: Stimato a meno di 0.50€ per cliente grazie alla visibilità organica della macchina fisica (il wrapping funge da cartellone pubblicitario gratuito).
- **Allocazione Budget**: 5% del fatturato destinato a promozioni notturne e sconti QR.`;
              break;
            default:
              content = `### Sintesi Marketing (CMO)
- **Strategia Consolidata**: Validazione rapida sul campo, wrapping visivo notturno ad alta visibilità, SEO su Google Maps e promozioni QR per la fidelizzazione dei turisti.`;
              break;
          }
          break;

        case "cfo":
          switch (phase) {
            case 1:
              content = `### Modello di Pricing & Margini (CFO)
- **Struttura di Pricing**: Pizza Margherita posizionata a 6.50€, pizze farcite (Diavola, Prosciutto) a 7.50€ per massimizzare lo scontrino medio mantenendo la competitività.
- **Costo del Venduto (COGS)**: Ingredienti freschi e scatola speciale MOCA certificata per forno = 1.80€ a pizza.
- **Margine Lordo**: Margine medio del 74% per pizza venduta (~4.90€ di profitto lordo per transazione).`;
              break;
            case 2:
              content = `### Analisi di Sensibilità (CFO)
- **Scenario Conservativo (10 pizze/giorno)**: Fatturato 1.950€/mese, EBITDA margin 45%. Rientro CAPEX in 15 mesi.
- **Scenario Realistico (18 pizze/giorno)**: Fatturato 3.510€/mese, EBITDA margin 68%. Rientro CAPEX in 8.2 mesi.
- **Scenario Ottimistico (30 pizze/giorno)**: Fatturato 5.850€/mese, EBITDA margin 76%. Rientro CAPEX in 4.5 mesi.
- **Soglia di Pareggio Operativo (Break-Even)**: Con sole 4 pizze vendute al giorno (122 pizze/mese) si coprono i costi fissi mensili di affitto suolo ed energia.`;
              break;
            case 3:
              content = `### Fabbisogno di Capitale Iniziale (CFO)
- **CAPEX Stimato**: 16.500€ totali così distribuiti: 14.500€ per la macchina vending professionale CE, 1.500€ per spedizione container, sdoganamento IGIC e installazione fisica, 500€ allacciamento elettrico e SCIA.
- **Leverage**: Finanziamento interamente in Bootstrap (capitale proprio) per azzerare i costi degli interessi e mantenere la massima agilità.`;
              break;
            case 4:
              content = `### ROI dell'Acquisizione (CFO)
- **Analisi dell'Ad Spend**: A fronte di 1.50€ di spesa marketing per conversione (nel raggio di 2 km tramite Instagram), l'utile lordo generato è di 4.90€, con un ROAS immediato superiore a 3x.`;
              break;
            case 5:
              content = `### Mitigazione dei Rischi Finanziari (CFO)
- **Fondo di Riserva**: Accantonamento del 10% degli utili mensili in un fondo di liquidità per far fronte a manutenzioni straordinarie del distributore.
- **Copertura Assicurativa**: Polizza RC Prodotti e Danni al macchinario per coprire vandalismo o incidenti alimentari, stimata in 35€/mese.`;
              break;
            case 6:
              content = `### Spese Operative Mensili (CFO)
- **Dettaglio OPEX Fissi**: Affitto suolo privato: 350€/mese; Energia elettrica forno+frigo h24: 120€/mese; Connettività 4G Nayax: 35€/mese; Assicurazione e commercialista locale: 45€/mese.
- **Tasse**: Gestione contabile semplificata tramite ditta individuale spagnola (*Autónomo*) con quota agevolata flat per il primo anno (80€/mese).`;
              break;
            case 7:
              content = `### Spreadsheet Finanziario a 12 Mesi (CFO)
- **Riepilogo Finanziario Proiettato**: CAPEX iniziale di 16.500€, OPEX fisso mensile di 550€, Margine variabile 74%.
- **Utile Netto Anno 1**: Stima a 18.250€ nello scenario realistico, con un ROI dell'investimento iniziale superiore al 110%.
- **Soglia BEP**: 122 pizze/mese (tabelle finanziarie popolate nel tab dedicato).`;
              break;
            default:
              content = `### Sintesi Finanziaria (CFO)
- **Sostenibilità**: Il business plan dimostra un'elevata marginalità e un tempo di rientro rapidissimo (sotto i 9 mesi), ideale per un reinvestimento degli utili in una seconda macchina al mese 10.`;
              break;
          }
          break;

        case "cto":
          switch (phase) {
            case 1:
            case 2:
              content = `### Stack Hardware del Distributore (CTO)
- **Macchina Vending**: Distributore professionale con forno a pietra autopulente integrato (cottura a 300°C in 3 minuti) e cella refrigerata interna (mantenimento basi pizza a 4°C per garantire la catena del freddo).
- **Sistema POS**: Nayax Onyx cashless terminal, abilitato per pagamenti contactless NFC, chip, carte internazionali e mobile wallet (Apple Pay, Google Pay).
- **Allacciamento**: Corrente monofase 230V con assorbimento picco di 3.5 kW (durante la cottura).`;
              break;
            case 3:
            case 4:
              content = `### Integrazioni & Telemetria (CTO)
- **Telemetria Nayax Cloud**: Connessione tramite SIM 4G industriale integrata per monitorare lo stato delle scorte, la temperatura interna del frigo e le vendite dal vivo sul telefono.
- **Automazione Alert**: Integrazione webhook via Make.com per inviare un alert istantaneo su Telegram se la temperatura sale sopra i 5°C o se si verifica un'interruzione di corrente.`;
              break;
            case 5:
              content = `### Piani di Disaster Recovery (CTO)
- **Power Failure**: UPS di backup per mantenere attiva la telemetria e il blocco automatico della porta del distributore per proteggere la merce in caso di blackout.
- **Vandalismo**: Vetro temperato antisfondamento IK10 e scocca in acciaio rinforzato per esterni.`;
              break;
            case 6:
              content = `### Configurazione di Stack Software (CTO)
- **Piattaforme Utilizzate**: Nayax Core per le vendite, Make.com per le automazioni di magazzino, Supabase per l'archiviazione locale delle transazioni storiche per il commercialista, e Carrd.co per la landing page informativa del brand.`;
              break;
            case 7:
              content = `### Costi Tecnologici (CTO)
- **Abbonamento Software**: Nayax SaaS 12€/mese, SIM 4G 15€/mese, hosting landing page Carrd 1.50€/mese. Totale opex tech stimato in 28.50€/mese.`;
              break;
            default:
              content = `### Sintesi Tecnologica (CTO)
- **Affidabilità**: System basato su hardware testato e telemetria cloud robusta che azzera gli interventi fisici a vuoto.`;
              break;
          }
          break;

        case "coo":
          switch (phase) {
            case 1:
            case 2:
              content = `### Operations & Catena del Freddo (COO)
- **Processo di Rifornimento**: Il distributore ha una capienza di 60-80 pizze. Rifornimento quotidiano programmato ogni mattina alle 09:00 per garantire la freschezza assoluta.
- **Rispetto Catena del Freddo**: Trasporto delle basi pizza dal laboratorio alla macchina utilizzando borse termiche refrigerate rigide professionali (SOP 1).
- **Sanificazione**: Ciclo giornaliero di svuotamento briciole del forno, pulizia del touchscreen e igienizzazione del vano erogazione.`;
              break;
            case 3:
            case 4:
              content = `### Gestione Logistica (COO)
- **Supplier Delivery**: Accordo con il laboratorio locale per la preparazione di lotti di basi pizza precotte su ordinazione a giorni alterni.
- **Stock Control**: Impostazione di un allarme di magazzino quando le scorte scendono sotto le 15 unità per pianificare l'uscita straordinaria.`;
              break;
            case 5:
            case 6:
              content = `### Piano delle Risorse Umane & Manutenzione (COO)
- **Staffing**: 1 operatore locale part-time a Gran Canaria (può essere il fondatore stesso) con impegno di circa 1 ora al giorno per le attività di rifornimento e pulizia.
- **Checklist Tecnica**: Definizione di checklist chiare per la manutenzione ordinaria mensile (ispezione resistenze forno, pulizia filtri frigo).`;
              break;
            case 7:
              content = `### Ottimizzazioni di Magazzino (COO)
- **Gestione FIFO**: I lotti inseriti per primi devono essere posizionati sui ripiani anteriori della camera frigo del distributore.
- **Rotazione Prodotto**: Monitoraggio continuo delle scorte per ridurre gli sprechi energetici della macchina.`;
              break;
            default:
              content = `### Sintesi Operativa (COO)
- **Efficienza**: Flusso operativo ridotto al minimo grazie alla telemetria. Un singolo operatore può gestire fino a 4 macchine sulla stessa isola.`;
              break;
          }
          break;

        case "clo":
          switch (phase) {
            case 1:
            case 2:
              content = `### Struttura Societaria & IP (CLO)
- **Forma Giuridica**: Costituzione come *Autónomo* in Spagna. Questo consente un avvio rapido in 24 ore, costi di commercialista minimi ed accesso alla previdenza agevolata (*tarifa plana* a 80€/mese per il primo anno).
- **Proprietà Intellettuale**: Deposito del marchio e logo presso l'OEPM per proteggere l'identità del brand a livello nazionale.`;
              break;
            case 3:
            case 4:
              content = `### GDPR & Telemetria (CLO)
- **GDPR**: Rispetto del regolamento europeo per il tracciamento dei pagamenti. I dati sensibili delle carte sono criptati alla fonte dal terminale Nayax, che è conforme allo standard PCI-DSS.
- **Privacy Policy**: Redazione della privacy policy da visualizzare sul display e sul sito web.`;
              break;
            case 5:
            case 6:
              content = `### Compliance Alimentare & Autorizzazioni (CLO)
- **Registro Sanitario**: Registrazione obbligatoria del distributore presso il *Registro General Sanitario de Alimentos* spagnolo.
- **Certificazione HACCP**: Redazione del piano di autocontrollo HACCP per la conservazione e somministrazione di alimenti.
- **Autorizzazione Comunale**: Pratica di SCIA (*Comunicación Previa*) per l'attività di commercio al dettaglio via distributori automatici, con autorizzazione per occupazione suolo commerciale aperto al pubblico.
- **Certificazioni Macchinario**: Verifica che la macchina sia provvista di certificato CE e certificazione MOCA per i materiali a contatto con gli alimenti (forno e piastre).`;
              break;
            case 7:
              content = `### Tassazione Canarie & Incentivi (CLO)
- **IGIC Canario**: Vantaggio fiscale unico. Alle Canarie non si applica l'IVA al 10%, ma l'**IGIC (Impuesto General Indirecto Canario) al 7%** sulle vendite tramite distributori automatici.
- **ZEC (Zona Especial Canaria)**: Opportunità futura di convertire l'attività in una SL (Società a Responsabilità Limitata) per accedere all'aliquota IRES ridotta al **4%** se si creano almeno 3 posti di lavoro.`;
              break;
            default:
              content = `### Sintesi Legale & Rischi (CLO)
- **Compliance Totale**: Adempimento HACCP strutturato, SCIA comunale in regola e ditta individuale spagnola ottimizzata per i costi fiscali locali.`;
              break;
          }
          break;

        case "cco":
          switch (phase) {
            case 1:
            case 2:
              content = `### Branding, Naming & Logo (CCO)
- **Naming**: Scelta del nome 'Isla Pizza 24h' o 'Canary Pizza Box' per unire l'identità geografica alla tipologia di servizio.
- **Visual Identity**: Palette colori focalizzata sul pomodoro rosso brillante, verde basilico e dettagli di grigio antracite per comunicare modernità e igiene. Logo stilizzato di una fetta di pizza calda con vapore.`;
              break;
            case 3:
            case 4:
              content = `### Visual Design della Macchina (CCO)
- **Esterno (Wrapping)**: Progettazione di un wrapping in vinile premium resistente alle intemperie. Grafica che riproduce un tipico forno a mattoni italiano con fiamme a LED animate sullo schermo per aumentare l'appetito.
- **Copy Esterno**: 'La vera pizza italiana cotta su pietra pronta in 3 minuti.'`;
              break;
            case 5:
            case 6:
              content = `### Interfaccia Utente (UI/UX) (CCO)
- **UI dello Schermo**: UX intuitiva basata su grandi pulsanti fotografici delle pizze. Processo di acquisto ridotto a soli 3 tap: Scelta Gusto -> Selezione Pagamento -> Avvio Cottura.
- **Audio & Video**: Durante la cottura, lo schermo trasmetterà un video esplicativo sulla preparazione artigianale delle basi con sottofondo di musica acustica rilassante.`;
              break;
            case 7:
            case 8:
              content = `### Packaging & Elementi Collaterali (CCO)
- **Design Scatola**: Cartone termico microonda con scanalature per impedire la condensa e mantenere la fragranza. Grafica minimale con il payoff: 'Artigianale, Calda, Ora.' e QR Code in evidenza.`;
              break;
          }
          break;

        case "cso":
          switch (phase) {
            case 1:
            case 2:
              content = `### Customer Experience Iniziale (CSO)
- **Validazione Prodotto**: Esecuzione di un panel di assaggio cieco (blind tasting) con 20 tester locali per verificare la percezione di qualità della base pizza precotta e calibrare la quantità di mozzarella.
- **Metriche**: Il target minimo di gradimento è di 8/10 per procedere all'acquisto dei lotti.`;
              break;
            case 3:
            case 4:
              content = `### Assistenza Clienti e Canali (CSO)
- **Supporto WhatsApp**: Attivazione di un canale di messaggistica istantanea WhatsApp Business con numero chiaramente visibile sulla macchina per gestire anomalie, rimborsi o domande.
- **FAQ Schermo**: Integrazione di una sezione 'Aiuto' sullo schermo LCD che spiega le modalità di pagamento e allergie.`;
              break;
            case 5:
            case 6:
              content = `### Politica di Rimborso e Soddisfazione (CSO)
- **Politica di Soddisfazione**: In caso di mancata erogazione o pizza bruciata, l'utente può inviare la foto del codice transazione via WhatsApp e ricevere un rimborso immediato via PayPal o Bizum in 5 minuti.
- **Automazione**: Rilascio di codici promozionali omaggio automatici in caso di segnalazione per preservare la reputazione locale.`;
              break;
            case 7:
            case 8:
              content = `### Programma Fedeltà (Retention) (CSO)
- **Fidelizzazione Digitale**: Registrazione facoltativa tramite QR code per accedere alla tessera fedeltà virtuale: 'Ogni 9 pizze acquistate, la decima è in omaggio'. Invio di promozioni dedicate il venerdì sera tramite newsletter WhatsApp.`;
              break;
          }
          break;

        case "cpo":
          switch (phase) {
            case 1:
            case 2:
              content = `### Definizione dell'MVP (CPO)
- **Menu Core**: Limiteremo l'offerta iniziale a soli 3 gusti classici ad altissima rotazione per minimizzare gli sprechi e ottimizzare la conservazione: Margherita (6.50€), Diavola (7.50€), Prosciutto e Funghi (7.50€).
- **Dimensioni**: Diametro pizza standardizzato a 26 cm, ideale per la camera di cottura a pietra della macchina.`;
              break;
            case 3:
            case 4:
              content = `### Specifiche di Cottura & Forno (CPO)
- **Parametri Termici**: Temperatura forno calibrata a 300°C stabili. Tempo di cottura impostato a 140 secondi, seguito da 40 secondi per la movimentazione automatica della piastra e l'inserimento nel cartone.
- **Test di Umidità**: Ottimizzazione della percentuale di acqua nell'impasto della base (idratazione al 65%) per prevenire la secchezza durante la cottura ad alta velocità.`;
              break;
            case 5:
            case 6:
              content = `### Controllo Qualità & Catena di Scarto (CPO)
- **Scarto Automatico**: Configurazione della cella frigo per bloccare automaticamente l'erogazione di quel determinato lotto se la temperatura interna supera i 5°C per più di 15 minuti.
- **Scadenza**: Discard rule di 48 ore per le pizze caricate e non vendute per garantire l'assenza di acidità del pomodoro.`;
              break;
            case 7:
            case 8:
              content = `### Roadmap Evolutiva di Prodotto (CPO)
- **Fase 2 Prodotto**: Sulla base dei feedback delle prime 500 vendite, valutare l'inserimento di un gusto vegetariano ed un'opzione con impasto senza glutine (in scatola sigillata per evitare contaminazioni incrociate nel forno).`;
              break;
          }
          break;

        case "sourcing":
          switch (phase) {
            case 1:
            case 2:
              content = `### Sourcing degli Ingredienti & MOQ (Sourcing)
- **Sourcing Base Pizza**: Contratto con un panificio artigianale locale di Las Palmas per la fornitura a giorni alterni di basi pizza precotte e stese a mano con farina di forza italiana.
- **Ingredienti Farcitura**: Mozzarella in panetto a basso rilascio di acqua (per non bagnare il forno) e salsa di pomodoro italiano condita con origano.`;
              break;
            case 3:
            case 4:
              content = `### Sourcing Macchina & Dogana (Sourcing)
- **Macchina Vending**: Trattativa diretta con il produttore europeo di distributori automatici. Acquisto con pacchetto ricambi base incluso (resistenze, sensori temperatura, cinghie).
- **Logistica Mare**: Spedizione via container marittimo dal porto di Cadice a Las Palmas. Sdoganamento tramite agente doganale locale per applicare l'esenzione IVA e liquidare l'IGIC.`;
              break;
            case 5:
            case 6:
              content = `### Fornitura Packaging Certificato (Sourcing)
- **Cartoni Speciali**: Acquisto di lotti di scatole per pizza certificate MOCA da scatolificio spagnolo. Il cartone deve resistere a 350°C senza rilasciare odori o sostanze chimiche nocive. MOQ iniziale di 1.500 unità per ridurre il costo unitario a 0.22€.`;
              break;
            case 7:
            case 8:
              content = `### Contratti di Fornitura a Lungo Termine (Sourcing)
- **Accordi di Volume**: Al raggiungimento di 500 pizze vendute al mese, scatterà lo sconto del 15% sulle basi pizza artigianali dal panificio partner, riducendo il COGS complessivo a 1.55€ a pizza.`;
              break;
          }
          break;

        case "sales":
          switch (phase) {
            case 1:
            case 2:
              content = `### Strategia di Conversione Fisica (Sales)
- **Punto Vendita Fiscale**: Posizionamento del prezzo con cifre tonde (6.50€ - 7.50€) per facilitare i pagamenti rapidi.
- **Copy d'Impatto**: Messaggi promozionali visualizzati sullo schermo in standby: 'Hai fame? Pizza calda in 3 minuti. Paga qui con carta.'`;
              break;
            case 3:
            case 4:
              content = `### Integrazione Flussi Cashless (Sales)
- **Frictionless Payment**: L'uso del POS contactless integrato riduce la barriera all'acquisto di oltre il 40% rispetto alle vecchie macchine a gettoni o banconote.
- **Cross-Selling Temporizzato**: Messaggio sullo schermo al termine del pagamento: 'Vuoi aggiungere una seconda pizza Margherita a soli 5.00€?' (valido per acquisti multipli notturni).`;
              break;
            case 5:
            case 6:
              content = `### Negoziazione Spazi B2B (Sales)
- **Pitch Proprietari Spazi**: Offrire una percentuale flat del 10% del fatturato lordo mensile (o un affitto fisso di 350€) ai proprietari di locali commerciali, pub o stazioni di servizio per posizionare la macchina sul loro suolo privato, azzerando le tempistiche di concessione del suolo pubblico comunale.`;
              break;
            case 7:
            case 8:
              content = `### Pitch per Punti Aggiuntivi (Sales)
- **Espansione B2B**: Presentazione delle statistiche di vendita del primo punto ai gestori di villaggi turistici e catene di hotel h24 per installare macchine in concessione esclusiva nei loro cortili o aree d'attesa.`;
              break;
          }
          break;

        case "capital":
          switch (phase) {
            case 1:
            case 2:
              content = `### Strategia di Finanziamento Iniziale (Capital)
- **Bootstrap Strategico**: Finanziamento dell'MVP di 16.500€ tramite fondi propri dei soci per evitare carichi finanziari e interessi bancari in fase di validazione.
- **Target di Validazione**: Dimostrare il funzionamento del modello economico con una media di almeno 15 pizze vendute al giorno per 90 giorni di fila.`;
              break;
            case 3:
            case 4:
              content = `### Scouting Bandi Pubblici Canarie (Capital)
- **Subvenciones del Gobierno de Canarias**: Richiesta di contributo a fondo perduto per la creazione di imprese da parte di lavoratori autonomi (fino a 5.500€ per l'avvio della ditta).
- **Finanziamenti Enisa**: Monitoraggio della linea ENISA Jóvenes Emprendedores per finanziamenti agevolati senza garanzie reali una volta pronti a scalare.`;
              break;
            case 5:
            case 6:
              content = `### Monitoraggio Flussi per Reinvestimento (Capital)
- **Autofinanziamento**: Con un utile netto stimato di 1.500€/mese, accantonamento del 100% della cassa generata per finanziare l'acquisto del secondo distributore automatico al decimo mese di attività senza diluire le quote.`;
              break;
            case 7:
            case 8:
              content = `### Pitch Deck Investor-Ready (Capital)
- **Preparazione Pitch**: Strutturazione del pitch deck focalizzato sulle metriche reali: fatturato per macchina, margine lordo (74%), break-even point immediato e scalabilità operativa. Presentazione del piano a gruppi di business angel locali operanti nell'arcipelago canario.`;
              break;
          }
          break;

        default:
          content = `### Analisi Operativa Generica (${agentName})
- **Focus Fase ${phase}**: Ottimizzazione dei processi per il distributore di pizze alle Canarie.
- **Sviluppo**: Approccio lean per garantire il break-even immediato.`;
          break;
      }
      return content;
    }

    // 2. CASO GENERAL / ALTRI SETTORI
    content = `### Analisi Dipartimento: ${agentName} (${agentRole})
*Fase ${phase}: ${window.PHASE_TITLES && window.PHASE_TITLES[phase] ? window.PHASE_TITLES[phase] : 'Analisi'} per Progetto ${info.sector.toUpperCase()}*

`;

    const sectorKeywords = {
      saas: {
        product: "il software SaaS / piattaforma cloud",
        client: "abbonati mensili",
        tech: "hosting Vercel, Supabase database ed automazioni cloud",
        marketing: "Google Ads, SEO tecnica e content marketing",
        revenue: "modello di abbonamento ricorrente (MRR)",
        unit: "utenti attivi paganti"
      },
      ecommerce: {
        product: "l'E-commerce / catalogo prodotti",
        client: "acquirenti online",
        tech: "Shopify / WooCommerce e gateway di pagamento Stripe",
        marketing: "Meta Ads, TikTok Ads e email marketing di fidelizzazione",
        revenue: "vendita diretta di prodotti fisici con margine",
        unit: "ordini spediti con successo"
      },
      food_beverage: {
        product: "l'attività di somministrazione Food & Beverage",
        client: "clienti locali e turisti",
        tech: "POS elettronico, menu digitale QR e software di cassa",
        marketing: "social media marketing (Instagram), Local SEO e promozioni fisiche",
        revenue: "somministrazione diretta e ordini da asporto",
        unit: "coperti / pasti erogati"
      },
      retail: {
        product: "il punto vendita retail / negozio fisico",
        client: "visitatori in negozio",
        tech: "POS integrato, lettori barcode e software di inventario",
        marketing: "Google Business Profile, insegne ad alta visibilità e marketing locale",
        revenue: "vendita di prodotti in negozio",
        unit: "scontrini battuti"
      },
      mobile_app: {
        product: "l'applicazione mobile (iOS/Android)",
        client: "utenti dell'app",
        tech: "SDK App Store, Firebase database e notifiche push",
        marketing: "App Store Optimization (ASO) e campagne di installazione",
        revenue: "acquisti in-app (IAP) o abbonamento",
        unit: "download / abbonati in-app"
      },
      services: {
        product: "il servizio professionale / consulenza agenzia",
        client: "aziende clienti (B2B) o privati",
        tech: "CRM di vendita (HubSpot), Calendly per appuntamenti e Zoom",
        marketing: "LinkedIn Outreach, passaparola strutturato e networking di settore",
        revenue: "tariffe orarie, consulenze o pacchetti mensili flat",
        unit: "progetti chiusi / ore erogate"
      },
      general: {
        product: "la soluzione di business",
        client: "clienti target",
        tech: "landing page web e strumenti di produttività cloud",
        marketing: "passaparola, canali digitali e attività SEO locali",
        revenue: "transazioni dirette e vendite commerciali",
        unit: "clienti paganti acquisiti"
      }
    };

    const sect = sectorKeywords[info.sector] || sectorKeywords.general;

    switch (agentKey) {
      case "cmo":
        switch (phase) {
          case 1:
          case 2:
            content += `- **Dolore Rilevato sul Mercato**: I clienti target riscontrano inefficienze e costi elevati nel reperire soluzioni per ${sect.product} ${targetLoc}.\n`;
            content += `- **Analisi dei Competitor**: Presenza di operatori tradizionali lenti, costosi o non digitalizzati.\n`;
            content += `- **Strategia di Validazione**: Creazione di una Landing Page (Carrd/Framer) abbinata a 50€ di inserzioni pubblicitarie mirate per raccogliere lead di utenti interessati prima di effettuare investimenti di sviluppo.`;
            break;
          case 3:
          case 4:
            content += `- **Canali di Acquisizione (GTM)**: Campagne mirate basate su ${sect.marketing} per attrarre traffico profilato a basso costo.\n`;
            content += `- **Growth Hacking**: Loop di referral incentivati ('porta un amico e ricevi uno sconto') per accelerare la crescita virale senza aumentare la spesa pubblicitaria.`;
            break;
          case 5:
          case 6:
            content += `- **Analisi dei Rischi di Mercato**: Rischio di scetticismo iniziale o basso tasso di conversione. Mitigato con continui test A/B sul copy della Landing Page.\n`;
            content += `- **Tracking**: Utilizzo di strumenti analitici come Hotjar e Google Analytics 4 per studiare il comportamento degli utenti.`;
            break;
          case 7:
          case 8:
            content += `- **CAC (Costo di Acquisizione)**: Target di CAC ottimizzato per rimanere inferiore a 10€, garantendo l'efficienza economica.\n`;
            content += `- **Sintesi Strategica**: Focus sui canali di acquisizione organici ed email marketing per massimizzare il ROI fin dalle prime settimane.`;
            break;
        }
        break;

      case "cfo":
        switch (phase) {
          case 1:
          case 2:
            content += `- **Modello di Pricing**: Tariffazione basata su ${sect.revenue} formulata per massimizzare la cassa fin da subito.\n`;
            content += `- **Margine di Contribuzione**: Mantenuto superiore al 65% per garantire la sostenibilità del bootstrap.\n`;
            content += `- **Soglia di Pareggio (Break-Even)**: Raggiungibile coprendo le spese minime di gestione con pochissimi clienti attivi paganti.`;
            break;
          case 3:
          case 4:
            content += `- **CAPEX Iniziale**: Allocato principalmente per il setup burocratico iniziale, dominio web, grafiche e template professionali.\n`;
            content += `- **Gestione Flussi di Cassa**: Utilizzo di gateway come Stripe per incassare istantaneamente ed evitare crediti in sospeso.`;
            break;
          case 5:
          case 6:
            content += `- **OPEX Fissi Mensili**: Hosting e database cloud, commercialista locale e abbonamenti a strumenti no-code per un totale stimato inferiore a 80€/mese.\n`;
            content += `- **Fondo di Liquidità**: Accantonamento del 15% degli utili mensili per imprevisti o spese legali.`;
            break;
          case 7:
          case 8:
            content += `- **Proiezioni 12 Mesi**: Con un budget di ${budgetTip}, il rientro del capitale iniziale (Payback Period) è proiettato entro i primi 6 mesi di attività.\n`;
            content += `- **BEP Mensile**: Calcolato per coprire i costi infrastrutturali minimi (tabelle finanziarie compilate nel tab dedicato).`;
            break;
        }
        break;

      case "cto":
        switch (phase) {
          case 1:
          case 2:
            content += `- **Stack Hardware/Infrastruttura**: Architettura snella serverless basata su ${sect.tech} per azzerare i costi fissi strutturali.\n`;
            content += `- **Sviluppo MVP**: Utilizzo di tool no-code per validare velocemente l'MVP senza scrivere codice custom.`;
            break;
          case 3:
          case 4:
            content += `- **Integrazioni API**: Collegamento di Stripe per i pagamenti e Make.com per automatizzare i flussi di registrazione utente ed email di benvenuto.\n`;
            content += `- **Database**: Configurazione di un database relazionale leggero (Supabase) con backup giornalieri automatici.`;
            break;
          case 5:
          case 6:
            content += `- **Disaster Recovery**: Piani di ripristino rapidi basati su hosting distribuito su scala globale con uptime garantito al 99.9%.\n`;
            content += `- **Sicurezza**: Crittografia SSL, protocolli HTTPS obbligatori e blocco degli attacchi DDoS alla fonte.`;
            break;
          default:
            content += `- **Costi di Gestione Tech**: Abbonamenti mensili ottimizzati per rimanere nel piano gratuito o starter delle principali piattaforme SaaS.`;
            break;
        }
        break;

      case "clo":
        switch (phase) {
          case 1:
          case 2:
            content += `- **Forma Societaria**: Inizio dell'attività come ditta individuale a regime agevolato (es. forfettario al 5% in Italia o Autónomo in Spagna) per azzerare i costi fissi contabili.\n`;
            content += `- **Proprietà Intellettuale**: Verifica di disponibilità del marchio sui registri nazionali ed europei per tutelare il brand.`;
            break;
          case 3:
          case 4:
            content += `- **GDPR & Privacy**: Adozione di informative privacy conformi tramite servizi automatici (es. Iubenda) e moduli di consenso esplicito per la raccolta dei dati.`;
            break;
          case 5:
          case 6:
            content += `- **Compliance Fiscale**: Registrazione della ditta ed allineamento con un consulente fiscale locale. Predisposizione dei registri contabili minimi.\n`;
            content += `- **Contratti Clienti**: Redazione dei Termini e Condizioni di utilizzo del servizio con clausole di limitazione della responsabilità.`;
            break;
          default:
            content += `- **Compliance Checklist**: Verifica finale di tutti i moduli di consenso, cookie policy e iscrizioni contabili prima dell'avvio ufficiale.`;
            break;
        }
        break;

      case "cco":
        switch (phase) {
          case 1:
          case 2:
            content += `- **Naming & Branding**: Naming incentrato sulla semplicità e sulla velocità di risoluzione (es. '${appName}' o '${appName.split(" ")[0]}Go').\n`;
            content += `- **Payoff Consigliato**: 'La soluzione più semplice ed economica per gestire le tue necessità.'`;
            break;
          case 3:
          case 4:
            content += `- **Visual Identity**: Selezione di colori dominanti moderni ed eleganti. Definizione delle linee guida grafiche per i social e la landing page.`;
            break;
          default:
            content += `- **Copywriting della Landing Page**: Copy chiaro, diretto ai benefici del cliente ed in linea con il posizionamento di mercato unico.`;
            break;
        }
        break;

      case "sourcing":
        switch (phase) {
          case 1:
          case 2:
            content += `- **Fornitori Iniziali**: Selezione di servizi o terzisti nazionali con contratti snelli e senza vincoli pluriennali.\n`;
            content += `- **Logistica e MOQ**: Minimi d'ordine (MOQ) azzerati o ridotti al minimo per non immobilizzare capitale prezioso in scorte di magazzino.`;
            break;
          default:
            content += `- **Catena di Approvvigionamento**: Definizione delle tempistiche di consegna e dei fornitori di backup per mitigare i ritardi di fornitura.`;
            break;
        }
        break;

      case "sales":
        switch (phase) {
          case 1:
          case 2:
            content += `- **USP (Unique Selling Proposition)**: Focus sulla convenienza, sulla trasparenza dei prezzi e sulla velocità d'uso rispetto ai competitor.\n`;
            content += `- **Sales Pitch**: Titoli diretti incentrati sui vantaggi reali (es. 'Risparmia il 30% del tuo tempo fin da oggi').`;
            break;
          default:
            content += `- **Funnel di Conversione**: Ottimizzazione del flusso di acquisto per ridurre i passaggi e incrementare il tasso di conversione degli iscritti.`;
            break;
        }
        break;

      case "capital":
        switch (phase) {
          case 1:
          case 2:
            content += `- **Strategia di Finanziamento**: Sviluppo in Bootstrap puro con focus sulle vendite organiche fin dai primi giorni.\n`;
            content += `- **Bandi Pubblici**: Monitoraggio dei bandi regionali per l'innovazione digitale per ottenere contributi a fondo perduto per le spese di setup.`;
            break;
          default:
            content += `- **Scalabilità Finanziaria**: Definizione delle milestone metriche necessarie per presentare il progetto a business angel locali in caso di espansione.`;
            break;
        }
        break;

      case "cso":
        switch (phase) {
          case 1:
          case 2:
            content += `- **Customer Support**: Supporto clienti leggero basato su chat WhatsApp Business o email per risolvere istantaneamente i dubbi dei clienti.\n`;
            content += `- **Retention**: Raccolta feedback periodica tramite NPS per intercettare i clienti scontenti prima che abbandonino il servizio.`;
            break;
          default:
            content += `- **Fidelizzazione**: Programmi di sconti e invio di aggiornamenti di valore per mantenere elevato il tasso di riacquisto (LTV).`;
            break;
        }
        break;

      case "cpo":
        switch (phase) {
          case 1:
          case 2:
            content += `- **MVP Scope**: Limitare l'MVP alle sole funzionalità core (la feature indispensabile senza la quale il cliente non può risolvere il problema).\n`;
            content += `- **Roadmap**: Rilascio di aggiornamenti incrementali basati sulle richieste reali raccolte dai primi utenti attivi.`;
            break;
          default:
            content += `- **Qualità Prodotto**: Test interni continui e bug-tracking prima del rilascio pubblico per assicurare un'esperienza utente priva di frizioni.`;
            break;
        }
        break;

      default:
        content += `- **Pianificazione Lean**: Focalizzare gli sforzi del team per ridurre i costi, automatizzare i compiti ripetitivi ed ottenere i primi clienti paganti entro 30 giorni.`;
        break;
    }

    return content;
  },

  // Genera la sintesi dell'Orchestratore per una fase
  generateOrchestratorReport(info, phase, agentBriefs, previousAnswers = {}) {
    const targetLoc = info.location ? `a ${info.location}` : "sul mercato target";
    
    // 1. CASO VENDING / FOOD_BEVERAGE
    if (info.isVending && info.sector === "food_beverage") {
      const vendingOrch = {
        1: {
          text: `**FASE 1: VALIDAZIONE & LEAN CANVAS (Distributore Pizze H24 ${info.location || ''}) completata.**
Abbiamo analizzato il progetto di **ristorazione automatica tramite distributore di pizze precotte h24**. Il bisogno di cibo caldo ed economico in aree ad alta densità è reale. Procederemo con la ricerca della location e test di propensione.
> [!WARNING]
> **RED FLAG dal CMO**: Il successo dipende al 90% dal posizionamento fisico. Focus assoluto sulla ricerca dello spazio ideale.`,
          questions: ["Hai individuato punti specifici a Gran Canaria (es. locali o fermate bus)?", "Preferisci pizze intere o tranci?"]
        },
        2: {
          text: `**FASE 2: ANALISI TARGET & COMPETITOR completata.**
Il profilo cliente è confermato: turisti e lavoratori notturni. Nessun competitor locale offre cibo caldo H24 alle Canarie.
> [!IMPORTANT]
> **Nota del CFO**: Il posizionamento alle Canarie ci offre il vantaggio di tasse ridotte (IGIC al 7%), migliorando i margini netti.`,
          questions: ["Confermi i prezzi di 6.50€ e 7.50€?", "Vuoi sondaggi online o interviste sul campo?"]
        },
        3: {
          text: `**FASE 3: STRATEGIA IBRIDA & GTM completata.**
La GTM si concentra sull'impatto visivo della macchina e sulla geolocalizzazione digitale per il traffico notturno.
> [!NOTE]
> **Consiglio del CCO**: Wrapping iper-riconoscibile a tema 'Pizzeria Italiana' per massimizzare la visibilità.`,
          questions: ["Capitale proprio o leasing?", "Collaborazione con panificio artigianale locale?"]
        },
        4: {
          text: `**FASE 4: GROWTH HACK & OUTREACH completata.**
Sfrutteremo il passaparola tramite Google Maps e QR code.
> [!WARNING]
> **RED FLAG dal CLO**: Attenzione alle recensioni negative; la cottura deve essere perfetta fin dal primo giorno.`,
          questions: ["QR code per recensioni?", "Pizza omaggio ai tassisti locali?"]
        },
        5: {
          text: `**FASE 5: COMPLIANCE & RISCHI completata.**
Definiti gli adempimenti: *Autónomo* in Spagna, Registro Sanitario e SCIA comunale.
> [!IMPORTANT]
> **Adempimento**: Laboratorio fornitore deve essere certificato HACCP.`,
          questions: ["Hai già un commercialista locale?", "Vuoi polizza RC prodotti?"]
        },
        6: {
          text: `**FASE 6: PIANO OPERATIVO & TECH STACK completata.**
Impegno di 1 ora/giorno. Telemetria 4G avvisa in automatico per il rifornimento.
> [!TIP]
> **Consiglio del CTO**: Nayax POS gestisce pagamenti internazionali (UK/DE/EU) senza frizioni.`,
          questions: ["Gestirai tu i rifornimenti?", "Confermi uso telemetria remota?"]
        },
        7: {
          text: `**FASE 7: PIANO FINANZIARIO completata.**
Break-even a 122 pizze/mese. Rientro investimento in circa 8 mesi con 25 vendite/giorno.
> [!IMPORTANT]
> **Riepilogo**: CAPEX ${this.generateFinancials(info).capex}, OPEX ${this.generateFinancials(info).opex}. BEP: ${this.generateFinancials(info).bep}.`,
          questions: ["Accetti le stime?", "Reinvestire in una seconda macchina al mese 8?"]
        },
        8: {
          text: `**FASE 8: EXECUTIVE SUMMARY & PITCH completata.**
Business plan pronto. Vantaggi fiscali, logistica snella e rientro rapido. Il report è pronto per l'esportazione.
> [!TIP]
> **Consiglio dell'Orchestratore**: Presenta questo report al proprietario dello spazio per dimostrare la professionalità del progetto.`,
          questions: ["Vuoi scaricare il report Markdown?", "Simuliamo un pitch con un investitore?"]
        }
      };
      if (vendingOrch[phase]) return vendingOrch[phase];
    }

    // 2. CASO GENERALE (Tutte le fasi)
    const phaseSummaries = {
      1: {
        text: `**FASE 1: VALIDAZIONE & LEAN CANVAS completata.**
Il progetto **${info.name}** risponde a un bisogno reale. Validiamo con approccio lean: Landing Page e test di interesse prima di scrivere codice.
> [!WARNING]
> **RED FLAG dal CMO**: Focalizzati sulla nicchia ${targetLoc}, non sfidare i giganti sulla quantità.`,
        questions: ["Modello abbonamento o pagamento singolo?", "Puoi contattare 5 potenziali clienti?"]
      },
      2: {
        text: `**FASE 2: ANALISI TARGET & COMPETITOR completata.**
Profilo utente definito. Il focus resta sulla risoluzione del problema con attrito zero.
> [!IMPORTANT]
> **Nota del CCO**: La Value Proposition deve essere cristallina sulla landing page: risparmio tempo/costi.`,
        questions: ["Offriamo una prova gratuita?", "Interviste di persona o form online?"]
      },
      3: {
        text: `**FASE 3: STRATEGIA IBRIDA & GTM completata.**
GTM definita: focus sui canali digitali ad alto ROI.
> [!NOTE]
> **Suggerimento del CMO**: Micro-advertising mirato per validare frequenza e conversione.`,
        questions: ["Gestione Ads in house o delegata?", "Budget marketing mensile?"]
      },
      4: {
        text: `**FASE 4: GROWTH HACK & OUTREACH completata.**
Loop di crescita e outreach strutturati per acquisizione costo zero.
> [!TIP]
> **Consiglio del Sales**: Email e LinkedIn devono puntare al valore, non all'hard selling.`,
        questions: ["Inseriamo un sistema di referral?", "Hai già 20 lead chiave da contattare?"]
      },
      5: {
        text: `**FASE 5: COMPLIANCE & RISCHI completata.**
GDPR, inquadramento societario e rischi minimizzati.
> [!WARNING]
> **Nota del CLO**: Ditta individuale forfettaria per contenere spese iniziali.`,
        questions: ["Hai già un fiscalista?", "Uso di policy automatizzate (Iubenda)?"]
      },
      6: {
        text: `**FASE 6: PIANO OPERATIVO & TECH STACK completata.**
Stack no-code definito. Lancio MVP rapido senza codice proprietario.
> [!IMPORTANT]
> **Nota del CTO**: Utilizzo di piani gratuiti/starter per azzerare costi tecnici.`,
        questions: ["Confermi tool no-code?", "Quante ore dedicherai a settimana?"]
      },
      7: {
        text: `**FASE 7: PIANO FINANZIARIO completata.**
Modello 12 mesi solido. Sostenibile in bootstrap con marginalità >70%.
> [!IMPORTANT]
> **Riepilogo CFO**: CAPEX ${this.generateFinancials(info).capex}, OPEX ${this.generateFinancials(info).opex}. BEP: ${this.generateFinancials(info).bep}.`,
        questions: ["Accetti le stime?", "Reinvestire utili o prelevare stipendio?"]
      },
      8: {
        text: `**FASE 8: EXECUTIVE SUMMARY & PITCH completata.**
Progetto completo e investor-ready. Report pronto per l'esportazione.
> [!TIP]
> **Consiglio del Master**: Usa il report per presentare il progetto a partner o investitori.`,
        questions: ["Vuoi scaricare il report in .md?", "Simuliamo un pitch di fronte a un investitore?"]
      }
    };

    if (phaseSummaries[phase]) return phaseSummaries[phase];

    const phaseTitle = (window.PHASE_TITLES && window.PHASE_TITLES[phase]) || `Fase ${phase}`;
    return {
      text: `**FASE ${phase}: ${phaseTitle} completata.**\n\nI sotto-agenti hanno espresso il loro parere. Il report di fase è registrato.`,
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
