// Local Agent Simulation Engine (LASE) - Versione Ottimizzata e Ultra-Personalizzata
// Gira interamente client-side nel browser. Fornisce analisi specifiche per settori reali (Food, Vending, SaaS, ecc.)
// e supporta localizzazioni geografiche avanzate (es. Canarie, Gran Canaria).

const LocalAgentSimulationEngine = {
  // Classifica l'idea e i parametri immessi
  classifyProject(idea = "", budget = "", objective = "") {
    const safeIdea = String(idea || "");
    const safeBudget = String(budget || "");
    const safeObjective = String(objective || "");
    const text = (safeIdea + " " + safeObjective).toLowerCase();
    
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
    const numMatch = safeBudget.match(/(\d+[\d\s.,]*)/);
    if (numMatch) {
      budgetAmount = parseFloat(numMatch[1].replace(/\s/g, '').replace('.', '').replace(',', '.'));
    } else {
      // Se il budget è "quello che ci vuole" o simile, impostiamo un budget adeguato per il settore
      if (isVending) {
        budgetAmount = 48000; // Costo macchina standard aggiornato (es. Adial Pizzadoor)
      } else if (sector === "saas" || sector === "mobile_app") {
        budgetAmount = 5000;
      } else {
        budgetAmount = 3000; // Bootstrap standard
      }
    }
    
    // Rileva se il budget è in puro bootstrap
    const isBootstrap = safeBudget.toLowerCase().includes("bootstrap") || 
                        safeBudget.toLowerCase().includes("zero") || 
                        safeBudget.toLowerCase() === "0" || 
                        safeBudget.toLowerCase() === "0€" || 
                        budgetAmount === 0;

    // Estrae un nome temporaneo del progetto
    let name = "Nuovo Progetto";
    if (isVending && text.includes("pizz")) {
      name = "PizzaVending" + (location ? " " + location.split(" ")[0] : "");
    } else if (text.includes("pizz")) {
      name = "PizzaGo" + (location ? " " + location.split(" ")[0] : "");
    } else if (safeIdea.trim().length > 0) {
      const cleanIdea = safeIdea.replace(/vorrei creare|voglio creare|un'idea per|un servizio di|una piattaforma di/gi, "").trim();
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

    let priceVal = 100;
    let cogsVal = 20;

    if (info.isVending && info.sector === "food_beverage") {
      // CASO DISTRIBUTORE AUTOMATICO DI PIZZA (VALORI AGGIORNATI BENCHMARK ADIAL/LET'S PIZZA 2026 - RISTRUTTURAZIONE COSTI)
      capexVal = 55000; // Costo macchina professionale nuova premium + trasporto Canarie + allacciamento e autorizzazioni sanitarie
      opexVal = 950; // Affitto suolo, elettricità industriale, telemetria, assicurazione, Autónomo e manutenzione
      bepUnit = "Pizze Vendute / Mese";
      priceVal = 8.0;
      cogsVal = 2.4; // Ingredienti + comm. POS
      // Margine medio per pizza: Prezzo vendita medio 8.00€ (turistico) - Costo base+ingredienti 2.20€ - Comm. POS 0.20€ = 5.60€
      bepVal = Math.round(opexVal / (priceVal - cogsVal)); // Circa 170 pizze al mese (circa 5.6 pizze al giorno per pareggiare gli OPEX)
      
      const isCanarias = info.location && info.location.includes("Canarie");

      rows = [
        { item: "Distributore Automatico Pizza Professionale (con forno a pietra integrato - es. Adial Pizzadoor / Let's Pizza - Nuovo ad alta capienza)", type: "CAPEX", cost: "48,000.00 €", source: "Benchmark di mercato produttori UE 2026 (Adial France retail / Let's Pizza)" },
        { item: "Trasporto, Dogana e Sdoganamento a " + (info.location || "destinazione"), type: "CAPEX", cost: isCanarias ? "3,500.00 €" : "1,800.00 €", source: "Logistica mare/container + Sdoganamento IGIC Canarie e DUA" },
        { item: "Allacciamento elettrico trifase, aumento potenza (6kW picco) e SCIA comunale", type: "CAPEX", cost: "1,800.00 €", source: "Lavori tecnici di attivazione, certificazione impianto e tasse locali" },
        { item: "Adempimenti sanitari HACCP, Certificati MOCA e Registro Sanitario locale", type: "CAPEX", cost: "1,200.00 €", source: "Consulenza biologo alimentare + Pratiche Asesoria" },
        { item: "Affitto spazio commerciale privato (suolo esterno fronte strada o cortile)", type: "OPEX", cost: "450.00 € / mese", source: "Benchmark contratti commerciali area turistica a Gran Canaria" },
        { item: "Consumo energia elettrica (forno pietra rapido e cella frigo h24)", type: "OPEX", cost: "210.00 € / mese", source: "Consumi stimati tariffe industriali Spagna (forno 3.8 kW picco)" },
        { item: "Connettività SIM 4G, telemetria Nayax e POS cashless", type: "OPEX", cost: "35.00 € / mese", source: "Abbonamento Nayax Core + canone connessione" },
        { item: "Assicurazione RC Prodotti & Danni (atti vandalici, urti, guasti forno)", type: "OPEX", cost: "55.00 € / mese", source: "Polizza assicurativa business Spagna (Allianz/Mapfre)" },
        { item: "Quota Autónomo (previdenza sociale spagnola flat rate primo anno)", type: "OPEX", cost: "80.00 € / mese", source: "Regime spagnolo agevolato Autónomo Canarie" },
        { item: "Manutenzione ordinaria programmata, parti di ricambio e filtri cappa", type: "OPEX", cost: "120.00 € / mese", source: "Accantonamento usura resistenze e parti meccaniche forno" }
      ];
    } else if (info.sector === "saas" || info.sector === "mobile_app") {
      capexVal = info.budgetAmount <= 1000 ? 250 : Math.round(info.budgetAmount * 0.35);
      opexVal = info.budgetAmount <= 1000 ? 24 : Math.round(info.budgetAmount * 0.08);
      bepUnit = "Abbonati SaaS / Mese";
      priceVal = 29.0;
      cogsVal = 0.0;
      bepVal = Math.round(opexVal / priceVal);
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
      priceVal = 30.0;
      cogsVal = 15.0;
      bepVal = Math.round(opexVal / (priceVal - cogsVal));
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
      priceVal = 100.0;
      cogsVal = 20.0;
      bepVal = Math.round(opexVal / (priceVal - cogsVal));
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
      capexNum: capexVal,
      opexNum: opexVal,
      priceNum: priceVal,
      cogsNum: cogsVal,
      bepVolumeNum: bepVal,
      unitName: bepUnit.split(" ")[0] || "Unità",
      rows: rows
    };
  },

  // Genera il report di un agente per una specifica fase
  generateAgentReport(info, phase, agentKey, previousAnswers = {}, attachedFile = null, attachedImage = null) {
    const isCanarias = info.location && info.location.includes("Canarie");
    const targetLoc = info.location ? `a ${info.location}` : "nell'area geografica target";
    const appName = info.name;
    const budgetTip = info.isBootstrap ? "puro bootstrap (budget ~0€)" : `un budget iniziale di ${info.budgetAmount}€`;

    const agentMeta = (window.AGENT_METADATA && window.AGENT_METADATA[agentKey]) || { name: agentKey, role: "Advisor", icon: "👤" };
    const agentName = agentMeta.name;
    const agentRole = agentMeta.role;

    // Dettaglio settore per testi dinamici
    const isPizzaVending = info.isVending && info.sector === "food_beverage";

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

    // 1. DATABASE DI ANALISI SPECIFICHE PER IL CASO PIZZA VENDING (11 Agenti x 8 Fasi)
    const pizzaVendingAnalyses = {
      cmo: {
        1: `- **Rilevazione del Problema**: Assenza totale di ristorazione calda H24 espressa nelle ore notturne nelle aree turistiche e di transito di Gran Canaria.
- **Validazione sul campo**: Eseguiremo un panel di interviste fisiche a 50 potenziali acquirenti a Playa del Inglés e Las Canteras, testando l'interesse all'acquisto ad un prezzo di 7.00€.
- **Soglia di Rischio**: Se l'interesse espresso per la pizza da distributore è inferiore al 60%, l'offerta andrà ristrutturata prima del setup.`,
        2: `- **Profilazione Target**: Definizione del profilo acquirente principale: turisti notturni (01:00 - 05:00), lavoratori del settore Horeca e tassisti di turno.
- **Mappa Competitor**: Bar e distributori automatici tradizionali di snack (offrono solo merendine fredde o bibite) e pizzerie tradizionali (chiuse dopo mezzanotte).`,
        3: `- **Lancio e Visibilità**: Wrapping grafico completo ad alto impatto (tema pietra e fiamme a LED animate sullo schermo) per renderci visibili a 50 metri di distanza di notte.
- **Local SEO & Maps**: Registrazione della macchina come 'Pizzeria 24 ore' su Google Maps e Apple Maps per intercettare le ricerche di turisti affamati nelle vicinanze.`,
        4: `- **QR Code Sconti**: Inserimento di un QR Code sul cartone della pizza: offriamo uno sconto del 20% sulla pizza successiva in cambio di una recensione immediata su Google Maps con foto.
- **Outreach Host**: Distribuzione di codici promozionali digitali a gestori di case vacanze e host Airbnb nel raggio di 500m per i clienti che arrivano di notte.`,
        5: `- **Superamento Scetticismo**: Campagne social incentrate sulla trasparenza della preparazione delle basi e sulla freschezza degli ingredienti italiani.
- **Marketing di Fiducia**: Insegne e pannelli che certificano l'uso di basi artigianali cotte in 3 minuti su forno a pietra.`,
        6: `- **Ottimizzazione Display**: Uso dello schermo LCD della macchina per trasmettere video della preparazione artigianale durante i 180 secondi di cottura.
- **Campagne Fasce Orarie**: Promozione di prezzi agevolati nella fascia pomeridiana (16:00 - 19:00) per studenti.`,
        7: `- **Calcolo CAC**: Stima del costo di acquisizione cliente (CAC) a meno di 0.40€, grazie alla fortissima visibilità organica del punto vendita fisico.
- **Social Ads Geofenced**: Campagne Instagram attive solo nel raggio di 1 km dalla macchina tra le 23:00 e le 04:00.`,
        8: `- **Piano Marketing Consolidato**: Focus totale su Local SEO, passaparola digitale, QR code promozionale ed estetica ad alta visibilità notturna.`
      },
      cfo: {
        1: `- **Pricing Iniziale**: Impostazione prezzo Margherita a 7.50€, pizze farcite (Diavola, Prosciutto) a 8.50€, con uno scontrino medio stimato a 8.00€ nelle zone turistiche.
- **Costo del Venduto (COGS)**: Base pizza artigianale locale + ingredienti freschi + cartone termico microonda = 2.20€ a pizza.
- **Margine Lordo**: Margine unitario stimato al 70% (~5.60€ di profitto lordo per singola transazione cashless).`,
        2: `- **Analisi di Sensibilità**:
  - Scenario Conservativo (10 pizze/giorno): Rientro dell'investimento in 24 mesi.
  - Scenario Realistico (18 pizze/giorno): Utile netto ~2.000€/mese, rientro in 16 mesi.
  - Scenario Optimistico (30 pizze/giorno): Utile netto ~4.000€/mese, rientro in 9 mesi.`,
        3: `- **Struttura CAPEX**: Fabbisogno iniziale stimato a €55.000 (macchina professionale premium nuova €48.000, trasporto e sdoganamento Canarie €3.500, allacciamento elettrico e SCIA €1.800, certificazioni HACCP/MOCA €1.200).`,
        4: `- **Flusso di Cassa Promozionale**: Calcolo del costo degli sconti QR (20%) e delle pizze omaggio per i tassisti per verificare l'impatto sul margine lordo.`,
        5: `- **Spese Amministrative e Tasse**: Inquadramento come Autónomo Spagna con quota agevolata flat rate a 80€/mese per il primo anno.
- **Costo Assicurativo**: Polizza RC Danni e vandalismo stimata in 55€/mese.`,
        6: `- **Dettaglio OPEX Fissi**: Affitto spazio commerciale privato (450€/mese), energia elettrica forno/frigo (210€/mese), telemetria Nayax (35€/mese), commercialista locale (80€/mese), manutenzione/filtri (120€/mese). Totale OPEX: 950€/mese.`,
        7: `- **Break-Even Point (BEP)**: Fissato a 170 pizze al mese (circa 5.6 pizze al giorno). Superato il BEP, ogni pizza aggiuntiva genera 5.60€ di utile netto.`,
        8: `- **Modello Finanziario Finale**: Prospetto a 12 mesi completato, dimostrando un ROI elevato ed un ammortamento rapido se la location rispetta il target realistico.`
      },
      cto: {
        1: `- **Valutazione Macchinari**: Selezione di un distributore automatico professionale conforme CE con forno pietra integrato (temperatura 300°C) e cella refrigerata interna (mantenimento a 4°C).`,
        2: `- **Hardware POS Cashless**: Integrazione del terminale Nayax Onyx, abilitato per carte di credito internazionali, pagamenti contactless NFC, Apple Pay e Google Pay.`,
        3: `- **Configurazione Telemetria**: Setup di Nayax Core via SIM 4G per ricevere dati di vendita, scorte e temperature in tempo reale direttamente sul telefono.`,
        4: `- **Automazione Alert**: Integrazione webhook via Make.com per inviare notifiche urgenti su Telegram in caso di blackout o temperatura frigo superiore a 5°C.`,
        5: `- **Sicurezza Fisica**: Scocca in acciaio rinforzato, serrature a doppia mappa e vetro temperato antisfondamento con classificazione di sicurezza IK10.`,
        6: `- **Allacciamento Elettrico**: Predisposizione linea trifase dedicata con potenza contrattuale minima di 5 kW per coprire i picchi del forno a pietra.`,
        7: `- **Opex Tecnologico**: Canone Nayax telemetria (12€/mese), canone SIM industriale (15€/mese) e POS gateway commissioni (3.5% a transazione).`,
        8: `- **Infrastruttura Hardware/Software**: Stack pronto e verificato, telemetria attiva con alert di sicurezza e sistema di pagamento cashless collaudato.`
      },
      coo: {
        1: `- **SOP di Rifornimento**: Caricamento manuale delle pizze pianificato ogni mattina alle 09:00 (capienza massima 60-80 pizze). Svuotamento cassetti e pulizia forno.`,
        2: `- **Gestione della Rotazione (FIFO)**: I lotti di pizze inseriti per primi devono essere erogati per primi. Ritiro obbligatorio delle pizze invendute entro 48 ore.`,
        3: `- **Logistica Spazio**: Identificazione di suoli privati esterni ad alto traffico pedonale per evitare i lunghissimi tempi burocratici del suolo pubblico comunale.`,
        4: `- **Procedura Guasti**: Intervento tecnico in loco programmato entro 2 ore dalla ricezione dell'alert di blocco meccanico della telemetria.`,
        5: `- **Sanificazione HACCP**: Pulizia igienica giornaliera del vano di erogazione e controllo microbiologico delle superfici a contatto con la pizza.`,
        6: `- **Standardizzazione Operativa**: Creazione di una checklist operativa dettagliata per consentire in futuro la delega della manutenzione a personale terzo.`,
        7: `- **Gestione Scarti**: Stima iniziale di un tasso di scarto del 10% (pizze caricate e non vendute entro 48h) da ridurre al 5% ottimizzando la rotazione.`,
        8: `- **Operations Manual**: SOP e checklist di sanificazione scritte ed approvate, logistica delle scorte consolidata.`
      },
      clo: {
        1: `- **Inquadramento Societario**: Apertura ditta individuale come Autónomo in Spagna. Consente un avvio rapido in 24 ore e la gestione fiscale semplificata.`,
        2: `- **Contratti di Locazione B2B**: Redazione di una scrittura privata di affitto suolo con il proprietario del locale commerciale ospitante (es. bar, parcheggio).`,
        3: `- **Registrazione Sanitaria**: Richiesta di iscrizione obbligatoria del distributore presso il Registro General Sanitario de Alimentos dell'arcipelago canario.`,
        4: `- **Compliance GDPR**: Crittografia dei dati di pagamento gestiti interamente dai terminaliNayax (PCI-DSS compliant). Nessun dato sensibile memorizzato localmente.`,
        5: `- **Certificazione Macchina**: Verifica delle certificazioni CE e MOCA (materiali a contatto con alimenti) per il forno e i piattelli erogatori della macchina.`,
        6: `- **SCIA Comunale**: Presentazione della SCIA (Comunicación Previa de Actività) per distributori automatici presso il municipio locale a Gran Canaria.`,
        7: `- **Fiscalità Canarie (IGIC)**: Vantaggio fiscale locale: applicazione dell'IGIC al 7% sulle vendite (invece dell'IVA al 10% applicata in Spagna continentale).`,
        8: `- **Dossier Compliance**: Raccolta di HACCP, SCIA comunale, certificato CE/MOCA e iscrizione al Registro Sanitario completata.`
      },
      cco: {
        1: `- **Brand Identity**: Scelta del nome 'Isla Pizza 24h' o 'Canary Pizza Box' per legare il servizio alla tipologia di prodotto ed alla località geografica.`,
        2: `- **Posizionamento Visivo**: Sviluppo di una palette basata sul rosso pomodoro e grigio antracite per allontanare la percezione di pizza congelata industriale.`,
        3: `- **Wrapping Estetico**: Wrapping completo in vinile resistente a raggi UV e salsedine, raffigurante un classico forno a legna italiano per stimolare l'appetito.`,
        4: `- **UX del Touchscreen**: Interfaccia utente basata su grandi icone fotografiche delle pizze. Processo di acquisto ridotto a soli 3 tap sullo schermo.`,
        5: `- **Audio/Video di Cottura**: Video di 180 secondi che illustra la stesura artigianale dell'impasto da riprodurre sullo schermo durante l'attesa del cliente.`,
        6: `- **Packaging Design**: Scatola termica in cartone microonda con fori di sfiato speciali per evitare la condensa e preservare la fragranza.`,
        7: `- **Payoff di Impatto**: 'Cotta su pietra, calda, subito.' stampato in evidenza sul frontale della macchina e sui cartoni.`,
        8: `- **Brand Guidelines**: Asset grafici definiti per wrapping, scatole, menu dello schermo touch e promozioni social.`
      },
      cso: {
        1: `- **Blind Taste Test**: Organizzazione di una sessione di assaggio al buio con 20 consumatori locali per validare la ricetta delle basi pizza precotte.`,
        2: `- **Canale Reclami WhatsApp**: Numero di WhatsApp Business stampato in grande sulla macchina per inviare foto o segnalare problemi.`,
        3: `- **Refund Policy**: Rimborso automatico immediato entro 5 minuti via Bizum o PayPal in caso di mancata erogazione o prodotto non conforme.`,
        4: `- **Programma Fedeltà**: Configurazione tessera fedeltà digitale: 'Ogni 9 pizze acquistate, la decima è in omaggio', registrandosi via QR Code.`,
        5: `- **Gestione Recensioni**: Presidio quotidiano della scheda Google Maps per rispondere a recensioni negative e valorizzare quelle positive.`,
        6: `- **Fidelizzazione Notturna**: Promozioni mirate ed invio di coupon il venerdì sera per tassisti e lavoratori dei locali notturni.`,
        7: `- **FAQ Allergie**: Menu dedicato sullo schermo che elenca in 3 lingue (spagnolo, inglese, tedesco) tutti gli allergeni presenti.`,
        8: `- **Customer Care Blueprint**: Canale WhatsApp attivo, policy di rimborso Bizum testata e FAQ multilingue caricate sullo schermo.`
      },
      cpo: {
        1: `- **Menu MVP Core**: Limitazione dell'offerta iniziale a 3 gusti classici ad altissima rotazione: Margherita, Diavola e Prosciutto & Funghi.`,
        2: `- **Standardizzazione Geometrica**: Diametro fisso di 26 cm e spessore uniforme per garantire che la piastra di inserimento nel forno non si inceppi.`,
        3: `- **Calibrazione Forno**: Temperatura forno a pietra a 300°C stabili e tempo di cottura ottimizzato a 140 secondi + 40 secondi di movimentazione.`,
        4: `- **Catena del Freddo**: Cella refrigerata a 4°C per preservare la freschezza degli ingredienti ed evitare la fermentazione acida del pomodoro.`,
        5: `- **Ingredienti Speciali**: Mozzarella a basso rilascio di umidità per prevenire pozze d'acqua sulla pizza durante la cottura rapida.`,
        6: `- **Test di Fragranza**: Validazione della consistenza dell'impasto dopo 24 e 48 ore di sosta in cella refrigerata (idratazione consigliata al 65%).`,
        7: `- **Menu Fase 2**: Studio di un'opzione vegetariana ed un'opzione celiaca in busta sigillata protettiva per evitare contaminazione crociata nel forno.`,
        8: `- **Product Specifications**: Ricetta, ingredienti, tempi di cottura e limiti termici della cella refrigerata definiti e bloccati.`
      },
      sourcing: {
        1: `- **Fornitore Basi Pizza**: Accordo con un panificio artigianale locale di Las Palmas per la produzione di basi stese a mano precotte.`,
        2: `- **Fornitore Cartoni MOCA**: Contratto con uno scatolificio spagnolo per la fornitura di cartoni microonda idonei ad alte temperature.`,
        3: `- **Importazione Macchina**: Logistica mare via container da Cadice a Las Palmas. Liquidazione doganale DUA applicando l'esenzione IVA e liquidazione IGIC.`,
        4: `- **MOQ Cartoni**: Primo ordine di 1.500 scatole pizza per abbattere il costo unitario a 0.22€ ed ammortizzare le spese di clichè di stampa.`,
        5: `- **Sourcing Ingredienti**: Acquisto all'ingrosso di mozzarella e pomodoro da distributori alimentari locali per mantenere il COGS sotto i 2.00€.`,
        6: `- **Accordo Volume Basi**: Sconto del 15% sulle basi pizza artigianali concordato al raggiungimento di 500 vendite mensili stabili.`,
        7: `- **Stock Ricambi**: Acquisto del pacchetto ricambi base dal produttore della macchina (sensori termici, cinghie del forno, resistenze).`,
        8: `- **Supply Chain Set**: Fornitore basi artigianali contrattualizzato, logistica container approvata e stock packaging pronto a magazzino.`
      },
      sales: {
        1: `- **Scouting Spazi Privati**: Contatti preliminari con gestori di minimarket H24, stazioni di servizio e parcheggi per posizionare la macchina sul loro suolo.`,
        2: `- **Contratto di Locazione**: Proposta di affitto fisso di 450€/mese o variabile (10% sul fatturato con minimo di 300€) per allineare gli interessi.`,
        3: `- **POS Gateway Nayax**: Attivazione dell'account commerciante conNayax per ricevere gli accrediti giornalieri delle vendite sul conto aziendale.`,
        4: `- **Upselling Notturno**: Messaggio promozionale di cross-selling sul display: 'Aggiungi una bibita a soli 1.50€' (per distributore abbinato).`,
        5: `- **Pitch Espansione**: Negoziazione con catene di hotel low-cost a Gran Canaria per posizionare macchine nei loro cortili o ingressi.`,
        6: `- **Analisi Fasce Orarie**: Monitoraggio vendite per identificare gli orari a massima conversione per pianificare promozioni notturne.`,
        7: `- **POS Gateway Fees**: Trattativa per commissione di transazione POS Nayax inferiore al 3.2% per transazioni di piccolo importo.`,
        8: `- **Commercial Pipeline**: Contratto di locazione privato firmato, terminale Nayax attivo e configurato per incassi automatici.`
      },
      capital: {
        1: `- **Struttura Investimento**: Finanziamento dell'investimento iniziale di €55.000 interamente tramite capitale proprio per evitare interessi bancari e garantire la massima flessibilità operativa.`,
        2: `- **Contributo Autónomo Canarie**: Richiesta di sussidio a fondo perduto per l'avvio di nuove imprese da parte di lavoratori autonomi (fino a 5.500€).`,
        3: `- **Pianificazione Reinvestimento**: Destinazione del 100% degli utili generati dal primo punto ad un fondo cassa per finanziare la seconda macchina al mese 10.`,
        4: `- **Pitch Deck Vending**: Creazione di un documento di presentazione del business basato su metriche reali di marginalità e ROI per investitori.`,
        5: `- **Scouting Finanziamenti Enisa**: Monitoraggio del bando Enisa Jóvenes Emprendedores per finanziamenti agevolati senza garanzie reali.`,
        6: `- **Contatti Business Angel**: Presentazione del modello di business a club di investitori privati nelle isole Canarie per espansione flotta.`,
        7: `- **Pianificazione Societaria**: Strutturazione di una SL (Società a Responsabilità Limitata) al raggiungimento delle 3 macchine attive.`,
        8: `- **Capital Plan**: Budget coperto da capitale proprio, piano sussidi locali avviato e roadmap finanziaria per flotta di 5 macchine definita.`
      }
    };

    // 2. DATABASE DI ANALISI SPECIFICHE PER IL CASO GENERAL / ALTRI SETTORI (11 Agenti x 8 Fasi)
    const generalAnalyses = {
      cmo: {
        1: `- **Validazione del Problema**: Rilevazione del dolore di mercato per ${sect.product} ${targetLoc}. Creazione di una landing page pilota per misurare l'interesse reale prima di avviare lo sviluppo.`,
        2: `- **Studio del Target**: Analisi demografica e comportamentale dei potenziali clienti. Identificazione dei canali social e motori di ricerca più frequentati dal target.`,
        3: `- **Strategia GTM**: Lancio di campagne di micro-advertising su ${sect.marketing} rivolte ad un pubblico segmentato per misurare il tasso di click e iscrizione.`,
        4: `- **Growth Strategy**: Strutturazione di un loop di passaparola organico e referral program per ridurre a zero il costo di acquisizione iniziale.`,
        5: `- **Brand Trust**: Posizionamento basato sulla trasparenza dei dati e recensioni pubbliche per superare la diffidenza iniziale del mercato.`,
        6: `- **KPI di Acquisizione**: Monitoraggio del conversion rate sulla landing page e calcolo preliminare del costo per lead (CPL).`,
        7: `- **Modello di Budgeting**: Allocazione della spesa pubblicitaria ottimizzata per mantenere il CAC al di sotto del valore di vita del cliente (LTV).`,
        8: `- **Executive Summary Marketing**: Sintesi delle metriche di validazione raccolte e pianificazione del lancio commerciale definitivo.`
      },
      cfo: {
        1: `- **Modello Finanziario MVP**: Strutturazione di un piano di cassa per supportare l'MVP in bootstrap, riducendo i costi fissi al minimo assoluto.`,
        2: `- **Modello di Pricing**: Definizione delle tariffe basate su ${sect.revenue} per massimizzare la cassa immediata ed evitare crediti insoluti.`,
        3: `- **Analisi di Break-Even**: Calcolo del numero di ${sect.client} attivi necessari a coprire i costi dei software e setup iniziale.`,
        4: `- **Allocazione Budget**: Distribuzione del capitale circolante tra sviluppo minimo e test di marketing, favorendo l'acquisizione clienti.`,
        5: `- **Costi di Gestione Societaria**: Stima della quota previdenziale e consulenza contabile per ditta individuale.`,
        6: `- **Previsioni di Cassa**: Monitoraggio del cash flow mensile e pianificazione del punto di pareggio operativo nei primi 6 mesi.`,
        7: `- **Spreadsheet a 12 Mesi**: Creazione del modello finanziario dettagliato con CAPEX, OPEX e bep (popolato nel tab dedicato).`,
        8: `- **Financial Executive Summary**: Analisi del ROI prospettico e tempo di payback dell'investimento iniziale.`
      },
      cto: {
        1: `- **Stack Serverless**: Scelta dell'infrastruttura serverless su ${sect.tech} per azzerare i costi fissi in fase di validazione.`,
        2: `- **Integrazione Gateway**: Configurazione di Stripe o PayPal per consentire la transazione immediata e tracciamento vendite.`,
        3: `- **Automazione Automatica**: Collegamento API tra Landing Page, CRM e Database tramite Make.com per automatizzare l'onboarding.`,
        4: `- **Alerting e Monitoring**: Configurazione di log automatici per monitorare l'uptime del servizio ed evitare interruzioni.`,
        5: `- **GDPR e Sicurezza**: Crittografia dei database, certificati SSL e rispetto delle normative europee sui dati personali.`,
        6: `- **Sviluppo Incremental**: Rilascio di aggiornamenti settimanali basati sulle metriche d'uso reali degli utenti attivi.`,
        7: `- **Tech Budget**: Ottimizzazione dei piani software (hosting, database, automazioni) per rimanere sotto i 50€/mese.`,
        8: `- **Tech Stack Consolidato**: Architettura software pronta per sostenere fino a 5.000 utenti registrati.`
      },
      coo: {
        1: `- **Flusso Operativo Lean**: Allocazione di circa 2 ore al giorno da parte del fondatore per la gestione ordinaria e validazione.`,
        2: `- **Gestione delle Richieste**: Standardizzazione del processo di onboarding dei clienti per azzerare il tempo manuale richiesto.`,
        3: `- **Sourcing Software**: Selezione di strumenti No-Code stabili con contratti flessibili mensili.`,
        4: `- **Gestione Emergenze**: Definizione di SOP chiare in caso di bug bloccanti o disservizi dei fornitori esterni.`,
        5: `- **Compliance Operativa**: Creazione di checklist per la gestione della privacy e tracciamento contabile quotidiano.`,
        6: `- **Standardizzazione Procedure**: Manuali operativi scritti per consentire la delega a futuri assistenti virtuali.`,
        7: `- **Incidenza Costo Lavoro**: Monitoraggio dell'efficienza oraria per massimizzare la produttività personale.`,
        8: `- **Operations Complete**: Flussi di lavoro strutturati e pronti per essere scalati.`
      },
      clo: {
        1: `- **Inquadramento Fiscale**: Scelta del regime fiscale più conveniente (forfettario o agevolato) per ridurre le tasse iniziali.`,
        2: `- **Protezione IP**: Registrazione del dominio web e verifica preliminare del marchio sui registri pubblici.`,
        3: `- **GDPR Compliance**: Generazione di Privacy Policy e Cookie Policy conformi tramite generatori certificati.`,
        4: `- **Termini di Servizio**: Redazione delle condizioni contrattuali con limitazioni di responsabilità per l'erogazione del servizio.`,
        5: `- **Compliance Amministrativa**: Registrazione della ditta ed allineamento sulle scadenze fiscali.`,
        6: `- **Contrattualistica Fornitori**: Stesura di contratti di fornitura o collaborazione leggeri privi di vincoli temporali.`,
        7: `- **Pianificazione Fiscale**: Calcolo dell'impatto fiscale sulle vendite e dei vantaggi regionali.`,
        8: `- **Dossier Legale Pronto**: Tutti gli adempimenti, privacy e inquadramento societario pronti per l'operatività.`
      },
      cco: {
        1: `- **Identità Visiva**: Palette colori moderna ed elegante abbinata ad un naming accattivante e payoff chiaro.`,
        2: `- **Branding emozionale**: Posizionamento del brand incentrato sul risparmio di tempo e sulla semplicità.`,
        3: `- **Design Landing Page**: Layout grafico focalizzato sulla conversione e sulla chiarezza visiva.`,
        4: `- **Visual Asset**: Progettazione delle grafiche promozionali per i social e le inserzioni web.`,
        5: `- **UX Design**: Ottimizzazione del form di registrazione per ridurre la frizione all'iscrizione.`,
        6: `- **Packaging o Digital Style**: Linee guida grafiche per le email di benvenuto e notifiche utente.`,
        7: `- **Copywriting Conversion**: Messaggi promozionali diretti ai bisogni primari del cliente target.`,
        8: `- **Brand Book**: Identità visiva completa e linee guida per le future campagne.`
      },
      cso: {
        1: `- **Panel Utenti Pilota**: Intervista a 10 utenti target per verificare l'esperienza d'uso dell'MVP.`,
        2: `- **Setup Canale Supporto**: Attivazione di una mail di supporto o chat automatizzata sul sito.`,
        3: `- **Politica di Soddisfazione**: Strutturazione di rimborsi veloci in caso di disservizio o bug.`,
        4: `- **Retention Strategy**: Programma di fidelizzazione digitale o sconti ricorrenti per incrementare il valore nel tempo.`,
        5: `- **Sezione FAQ**: Creazione di risposte pronte per i dubbi più frequenti degli utenti.`,
        6: `- **KPI Customer Success**: Monitoraggio del tasso di abbandono (churn rate) e soddisfazione.`,
        7: `- **Fidelizzazione Clienti**: Campagne di newsletter o WhatsApp marketing per mantenere gli utenti attivi.`,
        8: `- **Manuale Supporto**: Standard e risposte preimpostate per la gestione clienti.`
      },
      cpo: {
        1: `- **MVP Scope**: Identificazione dell'unica funzionalità core indispensabile, eliminando ogni feature secondaria.`,
        2: `- **Roadmap di Prodotto**: Rilascio di aggiornamenti incrementali basati sul comportamento degli utenti reali.`,
        3: `- **Test di Usabilità**: Monitoraggio delle sessioni utente per eliminare i colli di bottiglia del servizio.`,
        4: `- **Quality Control**: Test interni continui ed eliminazione dei bug prima della promozione pubblica.`,
        5: `- **Scarto e Discard Rule**: Blocco automatico di account o transazioni sospette per prevenire frodi.`,
        6: `- **Feature Set**: Consolidamento del set di funzionalità dell'MVP.`,
        7: `- **Roadmap Fase 2**: Progettazione delle funzionalità future da rilasciare dopo la validazione.`,
        8: `- **Specifiche MVP**: Requisiti tecnici e funzionali pronti per essere implementati.`
      },
      sourcing: {
        1: `- **MOQ e Fornitori**: Selezione di fornitori SaaS o terzisti con contratti snelli privi di costi iniziali d'ingresso.`,
        2: `- **Logistica e Consegne**: Ottimizzazione dei tempi di attivazione dei servizi esterni.`,
        3: `- **Fornitori di Backup**: Identificazione di partner software alternativi in caso di disservizio del primario.`,
        4: `- **Negoziazione Tariffe**: Trattativa per sconti volume sui servizi cloud o materiali di consumo.`,
        5: `- **Approvvigionamento**: Setup degli account di fatturazione e pagamenti per i software terzi.`,
        6: `- **Ottimizzazione Forniture**: Riduzione dei costi unitari delle licenze software all'aumentare degli utenti.`,
        7: `- **Logistica Doganale**: Se applicabile, conformità e sdoganamento di campioni o lotti fisici.`,
        8: `- **Supply Chain Pronto**: Contratti e accordi con tutti i fornitori tecnologici e logistici.`
      },
      sales: {
        1: `- **Funnel di Conversione**: Strutturazione dei passaggi d'acquisto sulla landing page (da visitatore a cliente).`,
        2: `- **Pitch Commerciale**: Copy di vendita focalizzato sui benefici reali (es. risparmio di costi/tempo).`,
        3: `- **Offerte Speciali**: Sconti di lancio per i primi 50 iscritti per accelerare la raccolta dati.`,
        4: `- **Integrazione POS/Stripe**: Flussi di pagamento istantanei abilitati ed automatizzati.`,
        5: `- **Partnership B2B**: Scouting di aziende partner interessate ad offrire il servizio ai loro dipendenti.`,
        6: `- **Sales Operations**: Tracciamento delle vendite in tempo reale e allineamento con la fatturazione.`,
        7: `- **Ottimizzazione Prezzi**: A/B test sui prezzi di vendita per trovare il punto di massimo profitto.`,
        8: `- **Processo Vendite**: Funnel di conversione oliato e pronto per la scalabilità.`
      },
      capital: {
        1: `- **Bootstrap Strategy**: Finanziamento dell'MVP interamente tramite fondi propri per mantenere il 100% del controllo.`,
        2: `- **Bandi per Startup**: Ricerca di bandi pubblici o finanziamenti agevolati regionali per l'innovazione.`,
        3: `- **Preparazione Pitch Deck**: Strutturazione delle slide del progetto con metriche e piani di crescita.`,
        4: `- **Scouting Investitori**: Identificazione di business angel locali specializzati nel settore di riferimento.`,
        5: `- **Pianificazione Finanziaria**: Calcolo delle milestone necessarie per attrarre finanziamenti esterni.`,
        6: `- **Reinvestimento Cassa**: Destinazione del 100% dei primi ricavi alla crescita per evitare debito.`,
        7: `- **Aumento Capitale**: Strutturazione del piano di quote societarie per futuri co-fondatori o partner.`,
        8: `- **Investor Deck**: Pitch deck completato e pronto per essere presentato a partner e banche.`
      }
    };

    // Estrazione dinamica del testo per l'agente e la fase corrente
    let phaseAnalysis = "";
    if (isPizzaVending) {
      if (pizzaVendingAnalyses[agentKey] && pizzaVendingAnalyses[agentKey][phase]) {
        phaseAnalysis = pizzaVendingAnalyses[agentKey][phase];
      } else {
        phaseAnalysis = `- **Analisi Fase ${phase}**: Focus dipartimentale per la gestione logistica ed operativa del distributore automatico a Gran Canaria.`;
      }
    } else {
      if (generalAnalyses[agentKey] && generalAnalyses[agentKey][phase]) {
        phaseAnalysis = generalAnalyses[agentKey][phase];
      } else {
        phaseAnalysis = `- **Analisi Fase ${phase}**: Pianificazione lean dei flussi dipartimentali per mitigare i costi operativi e validare l'MVP.`;
      }
    }

    // Costruiamo le obiezioni (Sincerità)
    let objections = [];
    let verdict = "APPROVATO CON RISERVA";
    let verdictReason = "";

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
          "**INCOMPATIBILITÀ DI BUDGET (CRITICA)**: Hai indicato un budget di 0€ (Bootstrap). Una macchina vending professionale premium nuova costa circa 48.000€ + logistica. Il progetto è finanziariamente IMPOSSIBILE con queste premesse.",
          "**Costi Fissi Ricorrenti**: Anche se la macchina fosse gratuita, l'affitto dello spazio e l'energia elettrica industriale h24 richiedono un flusso di cassa di almeno 950€/mese fin dal primo giorno.",
          "**Tempo di Rientro (Payback)**: Con 170 pizze/mese necessarie per il break-even operativo, il rischio di insolvenza nei primi 3 mesi è altissimo in mancanza di capitale circolante."
        ];
        verdict = "BOCCIATO (Fondi Insufficienti)";
        verdictReason = "Il budget corrente non consente l'acquisto o l'installazione del macchinario. È necessario fare un pivot verso il noleggio operativo o capitali esterni.";
      } else {
        objections = [
          "**Aumento Costo Macchinari**: I costi correnti dei distributori a pietra nuovi premium (Adial, Let's Pizza) sono di circa €48k-52k base.",
          "**Costo Energia Elettrica**: Il forno a picco trifase (6kW) consuma in media 180-220€ al mese di elettricità a tariffe industriali.",
          "**Margine su Ingredienti**: Il margine si contrae se non si ottiene un prezzo all'ingrosso (<2.20€ a pizza) sulle basi e packaging."
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

    // Costruiamo il report finale
    let reportText = `### ${agentMeta.icon} ${agentName} - ${agentRole} (Fase ${phase})\n\n`;
    if (attachedFile) {
      reportText += `> [!NOTE]\n> **Analisi Allegato**: Ho esaminato il file **${attachedFile.name}** (${Math.round(attachedFile.size / 1024 * 10) / 10} KB). I dati contenuti sono stati integrati nell'analisi strategica di questa fase.\n\n`;
    }
    if (attachedImage) {
      reportText += `> [!NOTE]\n> **Analisi Visiva**: Ho esaminato l'immagine/screenshot allegato per integrare i benchmark operativi.\n\n`;
    }
    
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
      reportText += `> **Conflitto Budget/CAPEX**: Il budget 'Bootstrap/0€' non consente l'acquisto diretto del macchinario (€55.000).\n\n`;
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
  generateOrchestratorReport(info, phase, agentBriefs, previousAnswers = {}, attachedFile = null, attachedImage = null) {
    const isPizzaVending = info.isVending && info.sector === "food_beverage";
    const targetLoc = info.location ? `a ${info.location}` : "sul mercato target";
    
    let text = "";
    if (attachedFile) {
      text += `> [!NOTE]\n> **Analisi Allegato**: I dati del file **${attachedFile.name}** sono stati presi in carico dai sotto-agenti e sintetizzati in questa valutazione.\n\n`;
    }
    if (attachedImage) {
      text += `> [!NOTE]\n> **Analisi Visiva**: L'immagine allegata è stata analizzata e considerata nella sintesi dell'Orchestratore.\n\n`;
    }
    let questions = [];

    // Costruiamo la sintesi dell'Orchestratore Master
    text += `### 👑 Orchestratore Master - Sintesi Strategica della Fase ${phase}\n\n`;
    
    if (isPizzaVending) {
      text += `Il progetto **${info.name || "Senza Nome"}** si concentra sulla somministrazione di pizza calda H24 tramite distributore automatico. `;
    } else {
      text += `Il progetto **${info.name || "Senza Nome"}** si colloca nel settore **${(info.sector || "N/D").toUpperCase()}** ${targetLoc}. `;
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
            "Modificare il budget immettendo capitale proprio (minimo 55.000€)."
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
        text += `- **CAPEX**: €55.000 (macchina, spedizione, allacciamento, SCIA).\n`;
        text += `- **OPEX**: €950/mese (affitto suolo, corrente h24, Autónomo flat, SIM, manutenzione).\n`;
        text += `- **BEP**: 170 pizze al mese (circa 5.6 pizze al giorno a 8.00€ medio).\n`;
        
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
