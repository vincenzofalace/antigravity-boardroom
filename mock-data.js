// Mock Data per la Modalità Simulazione/Demo
// Fornisce esempi realistici e risposte dei sotto-agenti per le varie fasi del business plan.

const mockProjects = {
  gardatech: {
    name: "GardaTech Rentals",
    desc: "SaaS & IoT per automazione accessi e gestione energetica di affitti brevi sul Lago di Garda.",
    idea: "Una piattaforma software integrata con serrature smart che automatizza il check-in e spegne il riscaldamento/aria condizionata quando gli ospiti sono fuori, riducendo i consumi dei property manager sul Lago di Garda.",
    budget: "5000€ (Bootstrap lean)",
    objective: "Validare la domanda tra i proprietari locali e assicurarsi un primo partner industriale.",
    
    phases: {
      1: {
        orchestrator: {
          text: "FASE 1: VALIDAZIONE & LEAN CANVAS completata.\n\nEcco il quadro strategico iniziale. L'idea risponde a un dolore reale: l'inefficienza energetica e la gestione logistica degli ospiti. Procederemo con un approccio iper-lean per validare l'interesse dei proprietari prima di acquistare hardware costoso.",
          questions: [
            "Qual è il modello di pricing che preferisci testare inizialmente? Abbonamento mensile fisso per appartamento o una percentuale sul risparmio energetico effettivo?",
            "Hai già contatti diretti con almeno 3-5 property manager nella zona del Lago di Garda a cui poter proporre una demo a costo zero?"
          ]
        },
        agents: {
          cmo: {
            title: "CMO / Problem Evaluator",
            status: "Completato",
            content: "### Validazione Problema & Competitor\n- **Problema**: I property manager perdono ore nei check-in fisici e affrontano bollette spaventose a causa di aria condizionata/riscaldamento lasciati accesi a vuoto dagli ospiti.\n- **Competitor**: Kross Booking (PMS generico), Vikey (soluzione accessi fisica ma costosa, non focalizzata sul risparmio energetico).\n- **Strategia di Test**: Creare una Landing Page semplice (con Mailchimp/Carrd) che pubblicizza la soluzione. Budget di 100€ in ADS geolocalizzate sul Lago di Garda per raccogliere email di proprietari interessati prima di scrivere codice."
          },
          cfo: {
            title: "CFO / Consulente Finanziario",
            status: "Completato",
            content: "### Analisi di Sostenibilità Iniziale\n- **Modello di Business**: SaaS + Hardware setup fee.\n- **Target Pricing**: 19€/mese ad appartamento per la licenza software + 150€ una tantum per il kit domotico (serratura + sensore finestra).\n- **Margine**: Hardware acquistato a 80€ (margine lordo 70€/kit). SaaS con margine dell'85%. Il Break-Even Point iniziale si stima a 35 appartamenti attivi."
          },
          cto: {
            title: "CTO / Project Leader",
            status: "Completato",
            content: "### Stack Tecnologico & Logistica\n- **Stack Hardware**: Serrature Nuki Smart Lock + Sensori di apertura porte/finestre Xiaomi Zigbee integrati via Hub Home Assistant.\n- **Stack Software**: Web app responsive in HTML/JS (PWA) con backend Firebase per minimizzare i costi di hosting iniziali (Tier gratuito Firebase).\n- **Piano di Lavoro**: Settimana 1-2 per prototipo software base. Settimana 3 per test sul campo in un appartamento pilota."
          },
          coo: {
            title: "COO / Responsabile Qualità",
            status: "Completato",
            content: "### Operations & Risorse\n- **HR**: Richiesta figura tecnica (sviluppatore) e figura commerciale locale (per installazione fisica).\n- **Logistica**: Spedizioni dirette del kit domotico ai proprietari con istruzioni di auto-installazione o supporto locale. Questo riduce i costi di trasferta."
          },
          capital: {
            title: "Head of Capital",
            status: "Completato",
            content: "### Strategia Fundraising\n- **Bandi**: Ricerca di bandi regionali Veneto/Lombardia per l'innovazione turistica e transizione ecologica (es. POR FESR).\n- **Investitori**: Target Business Angels locali del settore alberghiero/immobiliare. Richiesta validazione iniziale di almeno 10 appartamenti per presentare un pitch solido."
          },
          clo: {
            title: "CLO / General Counsel",
            status: "Completato",
            content: "### Compliance & Privacy\n- **GDPR**: Fondamentale gestire i dati degli ospiti (nomi, codici di accesso, orari di ingresso/uscita). I dati devono essere crittografati.\n- **Responsabilità**: Il contratto deve chiarire che i danni causati da malfunzionamento serrature non coprono furti se non installate da tecnici certificati. Opzione consigliata: polizza assicurativa RC prodotti."
          },
          cco: {
            title: "CCO / Creative Director",
            status: "Completato",
            content: "### Brand & Messaggio\n- **Naming**: GardaTech Rentals (molto specifico, dà credibilità geografica).\n- **Slogan**: 'Zero chiavi, zero sprechi. Il controllo del tuo affitto breve sul Lago di Garda.'\n- **Landing Page Hook**: 'Riduci del 35% i costi delle bollette e gestisci i check-in a distanza. Senza canoni per i primi 3 mesi.'"
          },
          cso: {
            title: "CSO / Retention Analyst",
            status: "Completato",
            content: "### Retention & NPS\n- **Onboarding**: Video-tutorial di 2 minuti per spiegare all'ospite come sbloccare la porta tramite l'app.\n- **Metriche**: Tasso di successo dell'apertura al primo tentativo (obiettivo >99.5%). NPS dei proprietari basato sulla riduzione della bolletta al primo mese."
          },
          cpo: {
            title: "CPO / Product Manager",
            status: "Completato",
            content: "### Definizione MVP\n- **Perimetro Prodotto**: Il Minimum Viable Product (MVP) si concentrerà esclusivamente su due funzionalità fondamentali: l'apertura remota automatizzata della porta principale tramite webhook e lo spegnimento termico (tramite integrazione IFTTT/Broadlink) quando i sensori magnetici registrano finestre aperte per più di 5 minuti.\n- **Esclusioni per il bootstrap**: Nessuna applicazione mobile nativa (iOS/Android) per gli ospiti. L'ospite riceverà un semplice link web temporaneo per l'apertura, risparmiando 3 mesi di sviluppo e costi di pubblicazione sugli store."
          },
          sourcing: {
            title: "Procurement & Sourcing",
            status: "Completato",
            content: "### Approvvigionamento Hardware\n- **Fornitori Sourcing**: Serrature smart Nuki acquistate tramite account distributore B2B (sconto del 20% sul prezzo di listino retail, costo unitario 80€ invece di 100€, lotto minimo 10 unità).\n- **Sensori Finestre**: Sensori magnetici Xiaomi Zigbee acquistati direttamente da distributori cinesi all'ingrosso (costo unitario 12€, MOQ 25 pezzi).\n- **Hub Domotico**: Gateway Zigbee generico compatibile con Home Assistant (sorgente AliExpress, 18€/unità)."
          },
          sales: {
            title: "Head of Sales & Copy",
            status: "Completato",
            content: "### Test Cold Outreach & Copywriting\n- **Copy Landing Page**: 'Trasforma le tue bollette in profitto. La domotica smart pensata solo per gli host del Lago di Garda.'\n- **B2B Cold Email Pitch**: 'Oggetto: Come tagliare il 30% delle bollette energetiche di [Nome Struttura]. Ciao [Nome PM], abbiamo installato a Bardolino una tecnologia a costo zero che automatizza il check-in e spegne il clima se la finestra resta aperta...'"
          }
        }
      },
      2: {
        orchestrator: {
          text: "FASE 2: ANALISI TARGET, COMPETITOR E VALIDAZIONE CLIENTE completata.\n\nAbbiamo identificato il profilo del cliente ideale: Property Manager medio-piccoli (gestiscono da 5 a 20 appartamenti) che sentono l'ansia del controllo dei costi energetici. Kross Booking e Vikey non coprono l'automazione dei consumi energetici, che è il nostro principale fattore differenziante.",
          questions: [
            "Qual è il prezzo massimo dell'energia elettrica al kWh che i tuoi clienti target ti hanno segnalato come insostenibile?",
            "Confermi di voler avviare la validazione con interviste dirette di persona o tramite questionario inviato via email?"
          ]
        },
        agents: {
          cmo: {
            title: "CMO / Problem Evaluator",
            status: "Completato",
            content: "### Interviste di Validazione\n- **Target**: Intervistati 12 proprietari a Bardolino e Desenzano.\n- **Risultato**: 9 su 12 dichiarano che la bolletta estiva (aria condizionata a 18 gradi con finestre aperte) erode fino al 20% del loro margine di profitto.\n- **Competitor Matrix**: Vikey è focalizzato su self check-in ed adempimenti (questura). Noi ci posizioniamo come 'Energy & Logistics Automator'."
          },
          cfo: {
            title: "CFO / Consulente Finanziario",
            status: "Completato",
            content: "### Analisi di Sensibilità\n- **Costo dell'energia**: A 0.40€/kWh, un condizionatore da 1.5kW acceso 10 ore a vuoto costa 6€ al giorno per camera. Risparmio mensile stimato: 90€ per camera.\n- **ROI per il cliente**: A fronte di 19€/mese, il cliente risparmia mediamente 90€, ottenendo un ROI del 370%."
          },
          cto: {
            title: "CTO / Project Leader",
            status: "Completato",
            content: "### Requisiti Hardware di Validazione\n- Utilizzeremo sensori a contatto magnetico sulle finestre per spegnere il condizionatore se la finestra rimane aperta per più di 3 minuti.\n- Integrazione software via API con i condizionatori smart (Daikin, Mitsubishi, o tramite telecomandi IR universali Broadlink da 20€)."
          },
          coo: {
            title: "COO / Responsabile Qualità",
            status: "Completato",
            content: "### Standard Qualitativi\n- Il tempo di risposta del sensore deve essere immediato per evitare falsi positivi.\n- Creare un foglio Excel di tracking dei test per registrare ogni anomalia delle serrature."
          },
          capital: {
            title: "Head of Capital",
            status: "Completato",
            content: "### Investitori Locali\n- Mappati 3 imprenditori turistici locali disposti a fare da 'beta tester' e potenzialmente investire 20k€ di pre-seed se risparmiano il 25% sulle bollette della loro struttura pilota."
          },
          clo: {
            title: "CLO / General Counsel",
            status: "Completato",
            content: "### Regolamenti Locali\n- Verifica delle normative regionali del Veneto per le strutture ricettive extra-alberghiere. L'automazione degli accessi deve comunque garantire un metodo fisico d'emergenza (es. tastierino numerico o chiave fisica in cassetta di sicurezza)."
          },
          cco: {
            title: "CCO / Creative Director",
            status: "Completato",
            content: "### Angoli di Vendita\n- Angolo 1 (Finanziario): 'Smetti di regalare il 20% del tuo fatturato alle compagnie elettriche.'\n- Angolo 2 (Logistica): 'Gestisci 10 appartamenti dal tuo divano, senza correre per consegnare le chiavi.'"
          },
          cso: {
            title: "CSO / Retention Analyst",
            status: "Completato",
            content: "### Prevenzione Churn\n- Offrire un'assistenza telefonica 24/7 per i primi 3 mesi. Se un ospite rimane bloccato fuori alle 2 di notte, il property manager ci abbandonerà immediatamente se non interveniamo tempestivamente."
          },
          cpo: {
            title: "CPO / Product Manager",
            status: "Completato",
            content: "### Feedback Utente Raccolto\n- Dai primi sondaggi emerge che il 40% dei clienti teme che gli ospiti possano disconnettere volontariamente l'Hub domotico per evitare lo spegnimento dell'aria condizionata.\n- **Pivot di Prodotto**: Inserimento nel firmware dell'Hub di un alert automatico in cloud se il dispositivo va offline per più di 15 minuti, inviando una notifica immediata al Property Manager."
          },
          sourcing: {
            title: "Procurement & Sourcing",
            status: "Completato",
            content: "### Alternativa Telecomandi IR\n- Sourcing di trasmettitori ad infrarossi Broadlink RM4 Mini su AliExpress (16.50€/unità in quantità >20). Questo componente serve come ponte hardware per i condizionatori di vecchia generazione che non hanno WiFi integrato."
          },
          sales: {
            title: "Head of Sales & Copy",
            status: "Completato",
            content: "### Pitch Script per Chiamate\n- 'Salve [Nome PM], sono [Nome], ti chiamo dal Garda. Aiutiamo i property manager di Lazise a tagliare le bollette dei condizionatori spenti a vuoto. Posso mostrarti una scatola demo che si monta in 5 minuti sul tuo alloggio pilota?'"
          }
        }
      },
      3: {
        orchestrator: {
          text: "FASE 3: STRATEGIA IBRIDA & GTM (Go-To-Market).\n\nPer un mercato geolocalizzato come il Lago di Garda, uniremo una strategia digitale iper-targettizzata a una presenza fisica strategica durante le fiere locali del turismo e il passaparola guidato.",
          questions: [
            "Che percentuale del budget iniziale di 5000€ vuoi allocare per la fiera del turismo del Garda o eventi di networking locale?",
            "Vuoi attivare una partnership provvigionale con gli installatori di condizionatori locali per farti segnalare nuovi clienti?"
          ]
        },
        agents: {
          cmo: {
            title: "CMO / Problem Evaluator",
            status: "Completato",
            content: "### Go-To-Market (GTM) Plan\n- **B2B Outreach**: Contatto diretto di 50 agenzie di property management del Garda tramite LinkedIn e visite fisiche negli uffici.\n- **Inbound**: Creazione di mini-guide SEO sul risparmio energetico negli hotel e affittacamere. Pubblicità mirata su Facebook nei gruppi di gestori immobiliari del Veneto/Trentino."
          },
          cfo: {
            title: "CFO / Consulente Finanziario",
            status: "Completato",
            content: "### Allocazione Budget GTM\n- **Spesa proposta**: 1500€ per materiali marketing fisici (brochure, demo kit portatile per mostrare la serratura in azione) e 500€ per sponsorizzazioni mirate online. 3000€ tenuti a riserva per acquisto hardware dei primi clienti paganti."
          },
          cto: {
            title: "CTO / Project Leader",
            status: "Completato",
            content: "### Demo Kit Hardware\n- Costruzione di una valigetta demo contenente una serratura montata su un blocco di legno, un sensore finestra e un tablet che mostra la dashboard in tempo reale. Questo kit permette di far testare l'esperienza d'uso durante gli incontri fisici."
          },
          coo: {
            title: "COO / Responsabile Qualità",
            status: "Completato",
            content: "### Partnership Elettricisti\n- Accordo con 3 elettricisti locali. Paghiamo 50€ a installazione. Loro diventano promotori della nostra soluzione in cambio di una commissione sull'hardware."
          },
          capital: {
            title: "Head of Capital",
            status: "Completato",
            content: "### Pitch Material\n- Preparazione di una presentazione GTM di 5 slide focalizzata sulla scalabilità del modello su altre località turistiche lagunari ed alpine (Lago di Como, Trentino)."
          },
          clo: {
            title: "CLO / General Counsel",
            status: "Completato",
            content: "### Contratto di Partnership\n- Redazione del contratto di installazione con gli elettricisti partner, definendo chiaramente i limiti di responsabilità per danni da errata installazione."
          },
          cco: {
            title: "CCO / Creative Director",
            status: "Completato",
            content: "### Demo Pitch Book\n- Realizzazione di una brochure intitolata 'La Guida al Risparmio Energetico per gli Host del Garda' da distribuire di persona durante le visite commerciali."
          },
          cso: {
            title: "CSO / Retention Analyst",
            status: "Completato",
            content: "### Referral Program\n- Crea un programma 'Porta un Host': per ogni proprietario presentato che firma, 1 mese di SaaS gratuito sia per chi presenta sia per il nuovo cliente."
          },
          cpo: {
            title: "CPO / Product Manager",
            status: "Completato",
            content: "### UX della Demo\n- La dashboard demo per i clienti deve mostrare chiaramente due sezioni: 'Risparmio Energetico cumulativo (in € e kWh)' in grande e 'Stato dei Dispositivi' in piccolo. L'impatto economico immediato è lo strumento di conversione più forte del venditore."
          },
          sourcing: {
            title: "Procurement & Sourcing",
            status: "Completato",
            content: "### Logistica Spedizioni\n- Scelta di Poste Italiane Crono come partner logistico iniziale per la spedizione dei kit agli host del Garda (tariffa speciale B2B di 6.80€ a pacco tracciato, consegna in 24/48 ore)."
          },
          sales: {
            title: "Head of Sales & Copy",
            status: "Completato",
            content: "### Script Video Demo\n- Script per un mini-video di 45 secondi da caricare su WhatsApp: 'Ecco come disattiviamo l'aria condizionata a distanza se l'ospite esce lasciando la finestra spalancata, risparmiando fino a 8€ al giorno...'"
          }
        }
      },
      4: {
        orchestrator: {
          text: "FASE 4: GROWTH HACK & OUTREACH.\n\nSfrutteremo canali a costo zero. Faremo scrape di Booking ed Airbnb sul Lago di Garda per trovare gli host con recensioni negative sulla gestione delle chiavi o sui costi, proponendo la nostra soluzione come rimedio immediato.",
          questions: [
            "Sei d'accordo nell'eseguire uno scraping mirato per trovare host con valutazioni inferiori a 4 stelle sul check-in nella tua zona?",
            "Preferisci gestire l'outreach iniziale via email, Instagram/Airbnb o di persona?"
          ]
        },
        agents: {
          cmo: {
            title: "CMO / Problem Evaluator",
            status: "Completato",
            content: "### Strategia Cold Outreach\n- **Scrape**: Identificati 200 annunci Airbnb sul Garda con parole chiave come 'chiavi scomode', 'attesa host', 'riscaldamento spento'.\n- **Template Messaggio**: 'Ciao [Nome], notiamo che gestisci questo splendido alloggio. Abbiamo sviluppato una tecnologia locale che elimina la consegna chiavi e riduce i consumi del 30%...'"
          },
          cfo: {
            title: "CFO / Consulente Finanziario",
            status: "Completato",
            content: "### Costo di Acquisizione (CAC)\n- Utilizzando outreach organico (LinkedIn + messaggi diretti), il CAC iniziale stimato è pari a 0€ in advertising, richiedendo solo tempo operativo (stimato a 10 ore a settimana)."
          },
          cto: {
            title: "CTO / Project Leader",
            status: "Completato",
            content: "### Automazione Outreach\n- Creazione di uno script Python semplice per cercare parole chiave nelle recensioni degli annunci pubblici di una specifica area geografica."
          },
          coo: {
            title: "COO / Responsabile Qualità",
            status: "Completato",
            content: "### Tempistiche Risposte\n- Organizzare l'agenda per rispondere entro 2 ore a tutti i lead caldi generati dall'outreach per fissare una videochiamata demo."
          },
          capital: {
            title: "Head of Capital",
            status: "Completato",
            content: "### Track record per investitori\n- Ciascun lead convertito tramite outreach organico dimostra la trazione e la validità del messaggio di vendita, aumentando la valutazione pre-seed."
          },
          clo: {
            title: "CLO / General Counsel",
            status: "Completato",
            content: "### Termini d'Uso delle Piattaforme\n- Attenzione: l'invio massivo di messaggi commerciali su Airbnb può violare i Termini di Servizio. Si consiglia di risalire al nome dell'host/agenzia e contattarli tramite canali esterni (LinkedIn, sito web proprietario)."
          },
          cco: {
            title: "CCO / Creative Director",
            status: "Completato",
            content: "### Pitch Email Copy\n- Email ad alto tasso di risposta: 'Un trucco per risparmiare 80€ a prenotazione sul Garda'. Il focus è interamente sul risparmio monetario immediato."
          },
          cso: {
            title: "CSO / Retention Analyst",
            status: "Completato",
            content: "### Customer Experience\n- Garantire che l'installazione avvenga in meno di 45 minuti per minimizzare l'interruzione delle prenotazioni dell'host."
          },
          cpo: {
            title: "CPO / Product Manager",
            status: "Completato",
            content: "### Onboarding dei Lead\n- Pagina di atterraggio iper-semplice per gli host reclutati: un form con soli 3 campi (Nome, N. appartamenti, Risparmio energetico desiderato) per minimizzare l'attrito."
          },
          sourcing: {
            title: "Procurement & Sourcing",
            status: "Completato",
            content: "### Packaging Kit Auto-installazione\n- Sourcing di scatole di cartone riciclato rigide per contenere il kit domotico (costo unitario 1.20€ da fornitore Rajapack per lotti di 50 pezzi)."
          },
          sales: {
            title: "Head of Sales & Copy",
            status: "Completato",
            content: "### Script Messaggio LinkedIn\n- 'Ciao [Nome], vedo che gestisci diverse proprietà sul Garda. Molti tuoi colleghi in zona stanno riscontrando bollette estive fuori controllo a causa dei condizionatori lasciati accesi 24/7 dagli ospiti. Abbiamo sviluppato un sistema domotico che riduce la bolletta del 35%. Ti andrebbe di dare un'occhiata veloce senza impegno?'"
          }
        }
      },
      5: {
        orchestrator: {
          text: "FASE 5: COMPLIANCE & RISCHI.\n\nIn Italia la gestione di serrature connesse richiede il rispetto rigoroso della privacy (GDPR) e l'assicurazione contro guasti tecnici che potrebbero lasciare fuori gli ospiti.",
          questions: [
            "Hai già una polizza RC professionale o societaria che potremmo estendere per coprire i dispositivi installati?",
            "Accetti di inserire una clausola di sblocco d'emergenza fisico obbligatorio in ogni installazione?"
          ]
        },
        agents: {
          cmo: {
            title: "CMO / Problem Evaluator",
            status: "Completato",
            content: "### Sicurezza e Percezione del Cliente\n- Il fattore sicurezza è una barriera all'acquisto. Dobbiamo comunicare chiaramente che la serratura smart non invia dati sulla presenza in tempo reale a terzi e che i server sono europei."
          },
          cfo: {
            title: "CFO / Consulente Finanziario",
            status: "Completato",
            content: "### Costo della Compliance\n- Preventivo per polizza RC prodotti: 450€/anno (Allianz/Generali). Costo consulente privacy per predisposizione GDPR e registro trattamenti: 600€ una tantum."
          },
          cto: {
            title: "CTO / Project Leader",
            status: "Completato",
            content: "### Misure di Sicurezza\n- Crittografia end-to-end (AES-256) per tutte le comunicazioni tra Hub, serratura e server. Nessun codice di sblocco viene salvato in chiaro nel database."
          },
          coo: {
            title: "COO / Responsabile Qualità",
            status: "Completato",
            content: "### SLA e Interventi\n- Stabilire un tempo massimo di intervento fisico (SLA) di 60 minuti in caso di blocco totale, attivo dalle 08:00 alle 24:00 tramite un tecnico locale reperibile."
          },
          capital: {
            title: "Head of Capital",
            status: "Completato",
            content: "### mitigazione dei rischi per investor\n- Gli investitori temono cause legali per violazioni di domicilio. Presentare un dossier legale solido rende il progetto infinitamente più finanziabile."
          },
          clo: {
            title: "CLO / General Counsel",
            status: "Completato",
            content: "### Normativa Antiterrorismo (Schede Alloggiati)\n- In Italia vi è l'obbligo di identificazione fisica degli ospiti entro 24 ore. La serratura non sostituisce l'obbligo legale dell'host di verificare i documenti. Consigliare l'uso di un software partner per il check-in online con riconoscimento facciale certificato."
          },
          cco: {
            title: "CCO / Creative Director",
            status: "Completato",
            content: "### Copy di rassicurazione\n- Creazione della pagina 'Sicurezza e Privacy' per il sito web: 'La tua casa è al sicuro. Server cifrati, backup fisici e assicurazione fino a 100.000€ inclusa.'"
          },
          cso: {
            title: "CSO / Retention Analyst",
            status: "Completato",
            content: "### Test di Benvenuto\n- Invio di un SMS automatico all'ospite il giorno del check-in con link per testare l'apertura mentre è ancora in viaggio, riducendo l'ansia dell'arrivo."
          },
          cpo: {
            title: "CPO / Product Manager",
            status: "Completato",
            content: "### Fail-Safe Product Design\n- Implementazione nel software di un pulsante virtuale di 'Sblocco Emergenza Bluetooth' che funziona offline anche in caso di blackout del WiFi della casa, collegando direttamente lo smartphone dell'ospite alla serratura locale."
          },
          sourcing: {
            title: "Procurement & Sourcing",
            status: "Completato",
            content: "### Certificazioni dei Fornitori\n- Raccolta dei certificati CE ed RoHS dei sensori domotici Xiaomi per garantire l'importazione e l'uso conforme in territorio UE senza rischi sanzionatori."
          },
          sales: {
            title: "Head of Sales & Copy",
            status: "Completato",
            content: "### Copy Clausola di Manleva\n- Redazione di un testo esplicativo semplice che riassume la manleva legale per rassicurare l'host sul corretto utilizzo del sistema senza incorrere in violazioni privacy."
          }
        }
      },
      6: {
        orchestrator: {
          text: "FASE 6: PIANO OPERATIVO & TECH STACK.\n\nDefiniamo lo stack tecnologico finale ed economico e il piano operativo a 3 mesi per raggiungere la prima milestone (15 appartamenti paganti).",
          questions: [
            "Confermi di utilizzare Trello o Notion per la gestione dei task del team?",
            "Sei d'accordo nell'usare Make.com (integrazione no-code) per connettere la piattaforma con i PMS dei clienti (es. Booking/Airbnb) risparmiando mesi di sviluppo?"
          ]
        },
        agents: {
          cmo: {
            title: "CMO / Problem Evaluator",
            status: "Completato",
            content: "### Lancio Operativo\n- **Mese 1**: Campagna organica e demo fisiche.\n- **Mese 2**: Installazione dei primi 5 appartamenti pilota a prezzo di costo.\n- **Mese 3**: Raccolta recensioni video e lancio commerciale ufficiale."
          },
          cfo: {
            title: "CFO / Consulente Finanziario",
            status: "Completato",
            content: "### Costi del Tech Stack (Mensili)\n- Hosting Firebase: 0€ (sotto soglia).\n- Make.com (Piano Pro): 9€/mese.\n- Twilio (SMS ospiti): ~15€/mese.\n- Notion/Slack: 0€ (piani gratuiti).\n- **Totale Spese Fisse**: ~24€/mese. Estremamente sostenibile in bootstrap."
          },
          cto: {
            title: "CTO / Project Leader",
            status: "Completato",
            content: "### Architettura di Integrazione\n- **Trigger**: Nuova prenotazione registrata sul PMS del cliente (via webhook Make.com).\n- **Azione**: Make genera un codice pin univoco temporaneo su Nuki API valido solo per il periodo del soggiorno, e invia un SMS all'ospite tramite Twilio."
          },
          coo: {
            title: "COO / Responsabile Qualità",
            status: "Completato",
            content: "### Organigramma Lean\n- **Founder (Tu)**: Sales, Marketing, Finanze.\n- **Socio Tecnico**: Sviluppo software, integrazioni Make.\n- **Partner Elettricista (Esterno)**: Installazioni fisiche a chiamata."
          },
          capital: {
            title: "Head of Capital",
            status: "Completato",
            content: "### Timeline di esecuzione\n- Una timeline operativa che dimostra come arrivare a break-even con soli 5000€ è la miglior prova di efficienza operativa per un investitore seed."
          },
          clo: {
            title: "CLO / General Counsel",
            status: "Completato",
            content: "### Trattamento Dati Terzi\n- Make.com agisce come sub-responsabile del trattamento dati. Assicurarsi di firmare il DPA (Data Processing Agreement) con Make e Twilio."
          },
          cco: {
            title: "CCO / Creative Director",
            status: "Completato",
            content: "### Materiale di Onboarding per Host\n- Creazione di un template PDF personalizzabile per gli host, da stampare ed esporre negli appartamenti con le istruzioni domotiche."
          },
          cso: {
            title: "CSO / Retention Analyst",
            status: "Completato",
            content: "### Feedback Loop\n- Sondaggio automatico inviato via email all'host 15 giorni dopo l'installazione: 'Quanto tempo hai risparmiato questa settimana?'"
          },
          cpo: {
            title: "CPO / Product Manager",
            status: "Completato",
            content: "### Integrazione PMS\n- Mappatura logica dell'integrazione: supportare inizialmente Othello, Smoobu e Guesty (i 3 PMS più diffusi tra i piccoli property manager del Garda), lasciando lo sviluppo di API dirette per una fase successiva."
          },
          sourcing: {
            title: "Procurement & Sourcing",
            status: "Completato",
            content: "### Accordo Spedizioniere\n- Chiusura accordo con corriere espresso BRT per ritiri a domicilio ed esecuzione installazioni programmate (tariffa agevolata di 8.20€/pacco per spedizioni assicurate)."
          },
          sales: {
            title: "Head of Sales & Copy",
            status: "Completato",
            content: "### Copy email per Demo di Lancio\n- 'Solo 10 kit disponibili per la stagione pilota. Prova il sistema a costo di fabbrica, paghi la quota software solo se le tue bollette scendono del 20%.'"
          }
        }
      },
      7: {
        orchestrator: {
          text: "FASE 7: PIANO FINANZIARIO.\n\nEcco il modello economico proiettato a 12-24 mesi basato sui costi reali definiti dal CFO. Mostra una crescita sana senza bisogno di capitali esterni imminenti.",
          questions: [
            "Confermi queste stime finanziarie? Possiamo procedere all'elaborazione del break-even dettagliato?",
            "Vuoi simulare uno scenario di crescita 'Aggressivo' (investendo in ADS al mese 6) o continuare in puro bootstrap organico?"
          ]
        },
        agents: {
          cmo: {
            title: "CMO / Problem Evaluator",
            status: "Completato",
            content: "### Target Clienti Anno 1\n- Mese 1-3: 5 clienti (pilota).\n- Mese 4-6: 20 clienti (passaparola).\n- Mese 7-12: 60 clienti (marketing geolocalizzato).\n- **Totale Anno 1**: 85 appartamenti attivi."
          },
          cfo: {
            title: "CFO / Consulente Finanziario",
            status: "Completato",
            content: "### Proiezioni Economiche (12 Mesi)\n- **Ricavi SaaS (85 app. * 19€/mese * 6 mesi medi)**: ~9.690€\n- **Margine Hardware (85 app * 70€)**: 5.950€\n- **Ricavi Totali Anno 1**: 15.640€\n- **OPEX Anno 1 (Software, Assicurazione, Hosting, Marketing)**: 2.100€\n- **Utile Netto (lordo tasse)**: 13.540€\n- **Break-Even Point**: Raggiunto al mese 4 con 12 appartamenti attivi."
          },
          cto: {
            title: "CTO / Project Leader",
            status: "Completato",
            content: "### Sostenibilità dei Costi Cloud\n- Con 85 appartamenti, il database Firebase rimarrà ampiamente all'interno dello scaglione gratuito. I costi di Twilio cresceranno proporzionalmente ma sono già inclusi nei conteggi (0.07€ per SMS)."
          },
          coo: {
            title: "COO / Responsabile Qualità",
            status: "Completato",
            content: "### Costo del Lavoro\n- Nelle fasi iniziali i fondatori non percepiscono stipendio fisso, ma si dividono gli utili. Questo permette di mantenere il BEP estremamente basso."
          },
          capital: {
            title: "Head of Capital",
            status: "Completato",
            content: "### Proiezioni per Pitch\n- Un utile netto del 86% sui servizi SaaS rende l'azienda incredibilmente scalabile. Prepariamo la tabella finanziaria per la slide 8 del Pitch Deck."
          },
          clo: {
            title: "CLO / General Counsel",
            status: "Completato",
            content: "### Tassazione Regime Forfettario\n- Per i primi anni, si consiglia l'apertura di una partita IVA in regime forfettario (tassazione sostitutiva al 5% o 15% per nuove attività, codice ATECO 62.01.00 - Produzione software)."
          },
          cco: {
            title: "CCO / Creative Director",
            status: "Completato",
            content: "### Grafica delle Proiezioni\n- Creazione di un grafico a linee semplice da inserire nel pitch per mostrare la crescita dei ricavi ricorrenti mensili (MRR)."
          },
          cso: {
            title: "CSO / Retention Analyst",
            status: "Completato",
            content: "### LTV (Lifetime Value) Calculator\n- Con un abbonamento di 19€/mese e un churn rate ipotizzato del 2% annuo (eccellente per il B2B), il valore medio di un cliente nel tempo (LTV) è pari a circa 950€."
          },
          cpo: {
            title: "CPO / Product Manager",
            status: "Completato",
            content: "### Economie di Scala del Prodotto\n- Al raggiungimento delle 100 installazioni attive, passeremo all'integrazione di sensori di temperatura integrati per modulare automaticamente la temperatura AC e non solo lo spegnimento, portando il SaaS a 29€/mese."
          },
          sourcing: {
            title: "Procurement & Sourcing",
            status: "Completato",
            content: "### Scalabilità Costi Hardware\n- Accordi preliminari con il fornitore Nuki per sconti del 30% al raggiungimento di lotti d'acquisto superiori a 50 pezzi, riducendo il costo unitario da 80€ a 70€ e aumentando il margine lordo hardware."
          },
          sales: {
            title: "Head of Sales & Copy",
            status: "Completato",
            content: "### Copy della Proposta Commerciale\n- Redazione del listino prezzi ufficiale: 'Piano Safe & Saver. 150€ installazione + 19€/mese. Risparmio stimato di 90€ al mese. Copertura assicurativa inclusa.'"
          }
        }
      },
      8: {
        orchestrator: {
          text: "FASE 8: EXECUTIVE SUMMARY & PITCH DECK.\n\nIl progetto GardaTech Rentals è ora solido, strutturato ed investor-ready. Abbiamo unito validazione sul campo, tecnologia low-cost e sostenibilità finanziaria. Di seguito trovi il report finale consolidato pronto per essere esportato.",
          questions: [
            "Vuoi scaricare il report completo in formato Markdown (.md) per importarlo in Notion o NotebookLM?",
            "Vuoi procedere alla simulazione del pitch davanti a un investitore per prepararti alle loro domande scomode?"
          ]
        },
        agents: {
          cmo: {
            title: "CMO / Problem Evaluator",
            status: "Completato",
            content: "### Validazione di Mercato Riassunta\n- Il Lago di Garda conta oltre 15.000 appartamenti adibiti ad uso turistico. Conquistare l'1% del mercato locale equivale a 150 appartamenti, pari a 34.000€ di MRR potenziale."
          },
          cfo: {
            title: "CFO / Consulente Finanziario",
            status: "Completato",
            content: "### Sintesi Finanziaria per Investitori\n- **Richiesta di Capitale**: 25.000€ per accelerare l'acquisizione clienti nel secondo anno.\n- **Uso dei Fondi**: 60% Marketing/Sales localizzato, 30% Sviluppo integrazioni PMS proprietarie, 10% Riserve legali.\n- **Valutazione Pre-Seed Proposta**: 250.000€ (cessione 10% quote)."
          },
          cto: {
            title: "CTO / Project Leader",
            status: "Completato",
            content: "### Maturità Tecnologica (TRL)\n- Prototipo funzionante su base Make/Firebase (TRL 5). Pronto per lo sviluppo di una versione nativa al raggiungimento dei 30 appartamenti paganti."
          },
          coo: {
            title: "COO / Responsabile Qualità",
            status: "Completato",
            content: "### Team di Esecuzione\n- Team complementare composto da 1 Product Manager/Commerciale (Founder) e 1 Fullstack Engineer, con supporto legale e di design esterno."
          },
          capital: {
            title: "Head of Capital",
            status: "Completato",
            content: "### Lista Investitori Target\n- 1. Trentino Sviluppo (Bando Seed).\n- 2. Business Angel Network del Veneto (VEBAN).\n- 3. Partner industriali locali (Property Manager storici del Garda)."
          },
          clo: {
            title: "CLO / General Counsel",
            status: "Completato",
            content: "### Struttura Societaria Consigliata\n- Costituzione di una SRL Innovativa in Italia, che permette di accedere ad agevolazioni fiscali per gli investitori (detrazione del 30% del capitale investito) e flessibilità nella gestione delle quote (work for equity)."
          },
          cco: {
            title: "CCO / Creative Director",
            status: "Completato",
            content: "### Elevator Pitch\n- 'GardaTech Rentals trasforma gli appartamenti turistici sul Garda in alloggi intelligenti. Riduciamo i costi delle bollette del 30% e azzeriamo le perdite di tempo per la gestione delle chiavi, facendo risparmiare mediamente agli host oltre 1.000€ all'anno per appartamento. Tutto gestibile in cloud.'"
          },
          cso: {
            title: "CSO / Retention Analyst",
            status: "Completato",
            content: "### Customer Success Strategy\n- Creare un portale di self-service per gli host dove monitorare in tempo reale i kWh risparmiati, per rendere tangibile il valore del servizio ogni mese."
          },
          cpo: {
            title: "CPO / Product Manager",
            status: "Completato",
            content: "### Tabella Specifiche Funzionali\n- Rilascio delle specifiche tecniche definitive del firmware e dell'architettura database per il passaggio dalla fase di beta test alla produzione industriale."
          },
          sourcing: {
            title: "Procurement & Sourcing",
            status: "Completato",
            content: "### Forniture Stabili\n- Accordi operativi con distributori europei per garantire scorte di backup in caso di blocchi nella supply chain asiatica."
          },
          sales: {
            title: "Head of Sales & Copy",
            status: "Completato",
            content: "### Pitch Deck Script Completo\n- Strutturazione della sequenza delle slide: Problema (bollette e chiavi) -> Soluzione (GardaTech) -> Mercato (Lago di Garda) -> Trazione (Primi test) -> Business Model -> Team -> Richiesta finanziaria."
          }
        }
      }
    }
  },
  ecowrap: {
    name: "EcoWrap Italy",
    desc: "E-commerce B2B di packaging ecologico e personalizzato per piccoli produttori alimentari locali.",
    idea: "Packaging biodegradabile a base di scarti di mela e uva, personalizzato a basso costo per piccole cantine e caseifici italiani, venduto con bassi minimi d'ordine (MOQ) in puro bootstrap finanziario.",
    budget: "0€ (Puro bootstrap tramite pre-ordini)",
    objective: "Raccogliere i primi 10 pre-ordini pagati dai produttori agricoli per finanziare la prima produzione.",
    
    phases: {
      1: {
        orchestrator: {
          text: "FASE 1: VALIDAZIONE & LEAN CANVAS completata.\n\nEcoWrap risolve un problema crescente per i piccoli produttori: l'obbligo normativo europeo di usare imballaggi sostenibili unito ai minimi d'ordine proibitivi dei grandi fornitori. Partiremo a budget zero raccogliendo acconti dai clienti per finanziare i lotti di produzione.",
          questions: [
            "Quali sono i primi 3 tipi di packaging alimentare che intendi testare (es. bottiglie, scatole formaggi, sacchetti farina)?",
            "Hai già una lista di contatti di piccole cantine o caseifici della tua regione a cui inviare una proposta?"
          ]
        },
        agents: {
          cmo: {
            title: "CMO / Problem Evaluator",
            status: "Completato",
            content: "### Analisi del Problema\n- I piccoli produttori locali vogliono packaging green per marketing e conformità UE, ma i fornitori industriali richiedono ordini minimi di 5.000 o 10.000 pezzi.\n- **Soluzione EcoWrap**: Minimi d'ordine di soli 250 pezzi grazie alla stampa digitale flessibile.\n- **Validazione**: Creazione di una presentazione PDF e contatti diretti su Instagram/WhatsApp a 30 piccoli produttori agricoli locali."
          },
          cfo: {
            title: "CFO / Consulente Finanziario",
            status: "Completato",
            content: "### Modello Pre-Order\n- Prezzo di vendita: 1.50€ a scatola (MOQ 250 pezzi = 375€ per ordine).\n- Costo di produzione terzista per piccoli lotti: 0.80€ a scatola.\n- **Margine Lordo**: 0.70€ a scatola (46%).\n- **Flusso finanziario**: Riceviamo il 50% di acconto (187.50€) prima della produzione, coprendo interamente il costo di produzione del terzista (200€ per 250 pezzi)."
          },
          cto: {
            title: "CTO / Project Leader",
            status: "Completato",
            content: "### Tecnologie No-Code & Terzisti\n- **E-commerce**: Landing page su Carrd.co con modulo di pagamento Stripe (Tier gratuito, solo commissioni di transazione)."
          },
          coo: {
            title: "COO / Responsabile Qualità",
            status: "Completato",
            content: "### Valutazione Qualità\n- Invio di campioni di materiale grezzo ai primi 3 produttori per testare la resistenza all'umidità (fondamentale per formaggi e vini)."
          },
          capital: {
            title: "Head of Capital",
            status: "Completato",
            content: "### Bootstrap Strategy\n- Nessuna richiesta di capitale di rischio in questa fase. La validazione del mercato tramite acconti reali autofinanzia l'azienda fin dal primo giorno."
          },
          clo: {
            title: "CLO / General Counsel",
            status: "Completato",
            content: "### Idoneità al Contatto Alimentare (MOCA)\n- Regolamento CE 1935/2004: Qualsiasi imballaggio alimentare deve possedere la dichiarazione di conformità MOCA rilasciata dal produttore del materiale. Il nostro terzista deve fornirci questo documento ufficiale."
          },
          cco: {
            title: "CCO / Creative Director",
            status: "Completato",
            content: "### Brand & Naming\n- **Naming**: EcoWrap Italy.\n- **Slogan**: 'Il packaging ecologico su misura per piccoli produttori. Minimi d'ordine di 250 pezzi.'\n- **Estetica**: Design rustico, colori naturali (kraft, verde salvia, marrone terra) per comunicare artigianalità e sostenibilità."
          },
          cso: {
            title: "CSO / Retention Analyst",
            status: "Completato",
            content: "### Fidelizzazione B2B\n- Trattandosi di consumabili, il tasso di riacquisto (Repeat Purchase Rate) deve essere superiore al 60% annuo. Offrire un abbonamento di fornitura automatica stagionale."
          },
          cpo: {
            title: "CPO / Product Manager",
            status: "Completato",
            content: "### Specifiche dell'MVP\n- **MVP EcoWrap**: Scatole da vino in cartone ondulato riciclato da scarti vegetali (mela/uva). Misure standard per 1, 3 o 6 bottiglie, con template grafico di personalizzazione pre-impostato."
          },
          sourcing: {
            title: "Procurement & Sourcing",
            status: "Completato",
            content: "### Sourcing Fornitore MOCA\n- Sourcing effettuato presso scatolificio autorizzato in Emilia-Romagna che lavora cartone Favini Crush (ottenuto da sottoprodotti agro-industriali). Accordo commerciale per stampa digitale in quadricromia per piccoli lotti."
          },
          sales: {
            title: "Head of Sales & Copy",
            status: "Completato",
            content: "### Messaggio WhatsApp di Vendita B2B\n- 'Ciao [Nome Cantina], siamo EcoWrap. Abbiamo creato un packaging sostenibile personalizzato da scarti di uva locale per valorizzare le vostre bottiglie. Nessun vincolo di 10.000 pezzi, stampiamo lotti a partire da sole 250 scatole. Vi andrebbe di ricevere un campione cartaceo gratuito?'"
          }
        }
      }
    }
  }
};

// Esporta globalmente per l'uso nel client
window.mockProjects = mockProjects;
