// Local Agent Simulation Engine (LASE) - Versione Ottimizzata e Ultra-Personalizzata
// Gira interamente client-side nel browser. Fornisce analisi specifiche per settori reali (Food, Vending, SaaS, ecc.)
// e supporta localizzazioni geografiche avanzate (es. Canarie, Gran Canaria).

const LocalAgentSimulationEngine = {
  // Database di obiezioni e giudizi specifici per settore per gli agenti (esclusi CFO gestiti dinamicamente)
  sectorSpecifications: {
    saas: {
      cmo: {
        objections: [
          "**Costo di Acquisizione (CAC) Elevato**: Il mercato SaaS è saturo. Acquisire utenti tramite Google/Meta Ads rischia di costare più del loro Lifetime Value (LTV).",
          "**Fattore di Differenziazione Debole**: Ci sono molti software simili. Senza una feature unica, convincere gli utenti a migrare da un concorrente è difficile.",
          "**Frizione all'Attivazione**: Convincere gli utenti a registrarsi ed inserire dati richiede un onboarding guidato per dimostrare subito il valore (Time to Value)."
        ],
        verdictReason: "Il successo del SaaS dipende dalla capacità di acquisire lead a basso costo e dimostrare il valore del software nei primi 3 minuti."
      },
      cto: {
        objections: [
          "**Complessità di Integrazione**: Sviluppare e mantenere integrazioni API stabili con piattaforme esterne richiede manutenzione costante.",
          "**Debito Tecnico Iniziale**: L'uso eccessivo di strumenti no-code per l'MVP può limitare le performance e la sicurezza all'aumentare degli utenti.",
          "**Affidabilità dell'Infrastruttura**: Un downtime del server o del database può causare perdite di dati e recensioni negative degli utenti."
        ],
        verdictReason: "Raccomandiamo un'architettura serverless o cloud leggera (es. Vercel, Supabase) per ridurre al minimo i costi fissi iniziali e scalare rapidamente."
      },
      coo: {
        objections: [
          "**Frizione nell'Onboarding**: Se il software richiede configurazioni complesse, il tasso di abbandono prima dell'attivazione reale sarà altissimo.",
          "**Saturazione del Supporto**: Gestire bug e richieste di assistenza tecnica da parte degli utenti può saturare il tempo del fondatore."
        ],
        verdictReason: "È fondamentale documentare i processi di onboarding e configurare un sistema di help desk per gestire i ticket di supporto in modo efficiente."
      },
      clo: {
        objections: [
          "**GDPR e Trattamento Dati**: La gestione dei dati degli utenti su cloud richiede server conformi e policy di privacy molto severe in UE.",
          "**Termini di Servizio (ToS)**: La responsabilità civile in caso di perdita di dati o disservizi deve essere limitata tramite contratti chiari."
        ],
        verdictReason: "Richiede la stesura di termini d'uso robusti e una cookie policy conforme GDPR, preferendo hosting con server locati in Unione Europea."
      },
      cco: {
        objections: [
          "**Dashboard Confusa**: Se l'interfaccia utente (UI) non è pulita e moderna, l'utente percepirà il software come antiquato o difficile da usare.",
          "**Messaggio Troppo Tecnico**: Un copywriting incentrato sulle feature tecniche anziché sui benefici reali ridurrà il tasso di conversione."
        ],
        verdictReason: "Focus su design minimale, percorsi d'uso semplificati (UX) e una landing page incentrata sulla risoluzione del problema principale."
      },
      cso: {
        objections: [
          "**Tasso di Abbandono (Churn)**: I clienti SaaS disdicono l'abbonamento con un click se non usano il software regolarmente.",
          "**Mancanza di Feedback**: Senza interviste agli utenti che abbandonano, non capiremo mai perché il prodotto non trattiene i clienti."
        ],
        verdictReason: "Configurare email automatiche di engagement e monitorare l'attività degli utenti nei primi 7 giorni per prevenire l'abbandono."
      },
      cpo: {
        objections: [
          "**Feature Creep (Sovraccarico)**: Voler sviluppare troppe funzionalità per il lancio ritarda l'MVP e disperde il budget.",
          "**Roadmap Rigida**: Sviluppare basandosi su supposizioni anziché sui feedback e sul comportamento degli utenti reali."
        ],
        verdictReason: "Definire un perimetro MVP ristretto all'unica funzionalità principale indispensabile per risolvere il problema dell'utente."
      },
      sourcing: {
        objections: [
          "**Dipendenza da API Esterne**: Se i servizi terzi aumentano i prezzi, la marginalità del SaaS si riduce drasticamente.",
          "**Costi Cloud Scalabili**: I costi di database e computazione possono crescere in modo imprevisto se il codice non è ottimizzato."
        ],
        verdictReason: "Selezionare partner tecnologici stabili e monitorare i consumi API mensili per evitare sorprese in fattura."
      },
      sales: {
        objections: [
          "**Ciclo di Vendita B2B Lungo**: Se vendiamo ad aziende, la negoziazione e l'approvazione del budget possono richiedere mesi.",
          "**Assenza di Funnel di Vendita**: Avere traffico ma nessun incentivo (es. prova gratuita) per spingere l'utente a registrarsi."
        ],
        verdictReason: "Offrire un modello Freemium o una Free Trial di 14 giorni per abbattere la barriera d'ingresso e raccogliere contatti qualificati."
      },
      capital: {
        objections: [
          "**Rischio di Cassa in Bootstrap**: Sviluppare e promuovere un SaaS senza capitali richiede molto tempo per raggiungere il break-even.",
          "**Costi di Marketing Iniziali**: Se non si dispone di canali di traffico organico, il budget per le Ads si esaurisce rapidamente."
        ],
        verdictReason: "Massimizzare il marketing organico (SEO, community, content marketing) e puntare ad abbonamenti annuali per incassare subito cassa."
      }
    },
    ecommerce: {
      cmo: {
        objections: [
          "**Pressione Competitiva**: Concorrenza diretta di giganti come Amazon o store specializzati consolidati.",
          "**Costo del Traffico in Aumento**: Le inserzioni su Meta/Google/TikTok sono sempre più costose e riducono i margini netti per vendita.",
          "**Fidelizzazione Difficile**: Gli acquirenti online sono volatili e acquistano dove il prezzo è più basso."
        ],
        verdictReason: "Il marketing deve concentrarsi su una nicchia specifica di prodotti e su campagne di email marketing per stimolare acquisti ricorrenti."
      },
      cto: {
        objections: [
          "**Velocità di Caricamento dello Store**: Pagine lente da mobile portano all'abbandono immediato dell'utente prima dell'acquisto.",
          "**Integrazione Inventory**: Rischio di vendere prodotti non realmente disponibili a magazzino a causa di mancata sincronizzazione."
        ],
        verdictReason: "Consigliamo l'uso di Shopify o WooCommerce con temi ottimizzati per le performance mobili e gateway Stripe/PayPal integrati."
      },
      coo: {
        objections: [
          "**Gestione dei Resi**: Un tasso di reso elevato (specie nell'abbigliamento) può azzerare i profitti operativi.",
          "**Logistica di Spedizione**: Accordi con corrieri inaffidabili generano ritardi nelle consegne e reclami dei clienti."
        ],
        verdictReason: "Definire regole chiare per i resi e appoggiarsi a corrieri rapidi con tracciamento automatico della spedizione."
      },
      clo: {
        objections: [
          "**Diritto di Recesso UE**: La legge impone il diritto di reso entro 14 giorni per qualsiasi acquisto online, a tutela dell'acquirente.",
          "**Termini di Vendita e Garanzie**: Obbligo di fornire garanzie sui prodotti venduti e gestire la conformità legale dello store."
        ],
        verdictReason: "Richiede la pubblicazione di termini di vendita conformi al Codice del Consumo e policy chiare sul rimborso."
      },
      cco: {
        objections: [
          "**Schede Prodotto Povere**: Foto di bassa qualità o descrizioni copiate dai fornitori riducono drasticamente le conversioni.",
          "**Branding Debole**: Uno store che sembra una vetrina generica non trasmette la fiducia necessaria per inserire la carta di credito."
        ],
        verdictReason: "Investire in foto prodotto professionali, recensioni in evidenza e un design pulito che trasmetta affidabilità."
      },
      cso: {
        objections: [
          "**Frizione nel Supporto**: Se l'utente non trova risposte rapide sullo stato della spedizione, aprirà contestazioni PayPal/Stripe.",
          "**NPS Basso per Spedizioni**: La soddisfazione del cliente è legata alla rapidità e all'integrità del pacco consegnato."
        ],
        verdictReason: "Integrare una chat WhatsApp Business e inviare notifiche automatiche via email ad ogni cambio di stato della spedizione."
      },
      cpo: {
        objections: [
          "**Catalogo Sovraccarico**: Lanciare con troppi prodotti frammenta le risorse e complica la gestione delle scorte.",
          "**Frizione al Checkout**: Un modulo di pagamento con troppi campi obbligatori riduce il tasso di acquisto."
        ],
        verdictReason: "Limitare il lancio a pochi prodotti bestseller e implementare il checkout rapido in un click (es. Shop Pay)."
      },
      sourcing: {
        objections: [
          "**Rotture di Stock dei Fornitori**: Dipendere da fornitori esterni in dropshipping espone a vendite di merce esaurita.",
          "**Margini di Profitto Variabili**: Costi di spedizione e tariffe doganali impreviste possono erodere il margine lordo unitario."
        ],
        verdictReason: "Contrattualizzare fornitori affidabili con aggiornamento automatico dell'inventario e negoziare tariffe di spedizione flat."
      },
      sales: {
        objections: [
          "**Tasso di Conversione Basso**: La media degli e-commerce converte meno del 2% dei visitatori in acquirenti.",
          "**Mancanza di Upsell**: Mancata offerta di prodotti correlati o bundle al momento del carrello per alzare lo scontrino medio."
        ],
        verdictReason: "Implementare popup di recupero carrello e strategie di cross-selling (es. 'aggiungi questo con il 10% di sconto')."
      },
      capital: {
        objections: [
          "**Liquidità Bloccata nello Stock**: Acquistare stock iniziale richiede capitali che non possono essere usati per il marketing.",
          "**Margine di Cassa Ridotto**: Tempi di sdoganamento e logistica allungano il ciclo di conversione del contante."
        ],
        verdictReason: "Iniziare con modelli pre-ordine o dropshipping controllato per validare la domanda prima di investire in grandi lotti."
      }
    },
    food_beverage: {
      cmo: {
        objections: [
          "**Stagionalità e Volatilità**: Forte dipendenza dai flussi di clienti locali nel weekend e da fluttuazioni turistiche.",
          "**Pressione Concorrenziale Locale**: Ristoranti e locali tradizionali competono per la stessa clientela nello stesso raggio geografico.",
          "**Barriere al Passaparola**: Un inizio con recensioni medie può stroncare l'acquisizione organica prima di raggiungere stabilità."
        ],
        verdictReason: "Focalizzarsi su una Value Proposition culinaria unica e promuovere il brand sui social locali e schede Maps."
      },
      cto: {
        objections: [
          "**Integrazione Gestionali/POS**: Difficoltà a coordinare gli ordini fisici con menu QR e stampanti per comande in cucina.",
          "**Frizione Piattaforme Delivery**: Commissioni elevate (fino al 30%) e ritardi nei pagamenti delle piattaforme esterne."
        ],
        verdictReason: "Selezionare un sistema di cassa POS moderno con menu QR integrato e sviluppare un canale di ordinazione proprietario diretto."
      },
      coo: {
        objections: [
          "**Gestione delle Scorte Alimentari**: Rischio di elevati scarti di materie prime fresche se le vendite giornaliere fluttuano.",
          "**Gestione e Turni del Personale**: La ristorazione richiede orari estesi e staff affidabile, difficile da reperire e fidelizzare.",
          "**Standard di Servizio Variabili**: Mantenere costante la qualità dei piatti e i tempi di attesa con picchi di lavoro improvvisi."
        ],
        verdictReason: "Standardizzare le ricette (linea di cucina) e definire procedure operative rigide (SOP) per la preparazione e pulizia."
      },
      clo: {
        objections: [
          "**Burocrazia Sanitaria Stringente**: Controlli frequenti delle autorità, autorizzazioni SCIA e certificazioni HACCP obbligatorie.",
          "**Licenze e Permessi Locali**: Lunghi tempi burocratici per ottenere licenze per alcolici o concessioni di spazi all'aperto."
        ],
        verdictReason: "Affidarsi ad un biologo alimentare qualificato per il piano HACCP e presentare le SCIA con anticipo per evitare blocchi."
      },
      cco: {
        objections: [
          "**Presentazione dei Piatti Scadente**: Un menu visivamente povero o foto poco professionali sui social allontanano i clienti.",
          "**Brand Identity Confusa**: Se il locale non comunica chiaramente la sua specialità culinaria, viene percepito come generico."
        ],
        verdictReason: "Curare l'estetica del menu, l'impiattamento e creare un'atmosfera coerente con il posizionamento di prezzo."
      },
      cso: {
        objections: [
          "**Impatto Critico delle Recensioni**: Recensioni negative su TripAdvisor/Google per servizio lento o cibo freddo possono deviare il flusso clienti.",
          "**Gestione delle Intolleranze**: Rischio di contestazioni in caso di mancata trasparenza sulla presenza di allergeni nei piatti."
        ],
        verdictReason: "Specificare chiaramente gli allergeni nel menu ed istruire lo staff a gestire le lamentele in tempo reale offrendo rimborsi o omaggi."
      },
      cpo: {
        objections: [
          "**Menu Troppo Ampio**: Un numero eccessivo di piatti complica gli approvvigionamenti, rallenta la cucina e disperde la qualità.",
          "**Mancanza di Piatti Iconici**: Nessun piatto forte memorizzabile che spinga il cliente a tornare o a condividere foto online."
        ],
        verdictReason: "Limitare il menu a poche proposte eccellenti e definire 1-2 piatti firma unici per differenziarsi dalla concorrenza."
      },
      sourcing: {
        objections: [
          "**Volatilità dei Costi Alimentari**: Fluttuazioni dei prezzi dei fornitori di materie prime fresche erodono i margini calcolati.",
          "**Rapporti con Distributori Locali**: Tempi di consegna rigidi o quantitativi minimi d'ordine (MOQ) che pesano sulla cassa."
        ],
        verdictReason: "Negoziare listini prezzi bloccati con i distributori principali e valorizzare fornitori locali a km zero per flessibilità."
      },
      sales: {
        objections: [
          "**Scontrino Medio Basso**: Difficoltà ad incrementare la spesa del cliente oltre il piatto principale.",
          "**Mancanza di Cross-Selling**: Lo staff di sala non è formato per vendere dessert, antipasti o bevande premium."
        ],
        verdictReason: "Formare il personale sulle tecniche di vendita suggestiva e proporre menu degustazione per guidare la scelta."
      },
      capital: {
        objections: [
          "**Investimento Iniziale Elevato (CAPEX)**: Allestire una cucina professionale e arredare il locale richiede capitali importanti.",
          "**Rischio di Liquidità nei Primi Mesi**: Tempi lunghi per raggiungere la stabilità delle visite, con costi fissi mensili alti."
        ],
        verdictReason: "Prediligere una formula di locazione d'azienda con attrezzature incluse, o partire con un Home Restaurant / Ghost Kitchen lean."
      }
    },
    retail: {
      cmo: {
        objections: [
          "**Posizione e Pedonabilità**: Se il negozio è fuori dalle vie dello shopping, i costi pubblicitari per attirare passanti saranno insostenibili.",
          "**Concorrenza dell'Online**: Il cliente può confrontare i prezzi in tempo reale sul telefono e preferire l'acquisto online."
        ],
        verdictReason: "Scegliere una location con traffico pedonale certificato e puntare su un'esperienza d'acquisto fisica esclusiva."
      },
      cto: {
        objections: [
          "**Sincronizzazione Cassa-Inventario**: Rischio di discrepanze tra stock fisico in negozio e registri contabili.",
          "**Hardware POS e Connettività**: Un guasto alla linea internet o al terminale POS blocca le vendite e crea code alla cassa."
        ],
        verdictReason: "Adottare registratori di cassa smart (es. Shopify POS, Satispay) per unire inventario fisico e pagamenti cashless."
      },
      coo: {
        objections: [
          "**Presenza e Orari di Apertura**: Costo elevato del personale per coprire i turni di apertura del negozio (weekend inclusi).",
          "**Sicurezza e Differenze Inventariali**: Rischio di furti o danneggiamenti dei prodotti esposti nel punto vendita."
        ],
        verdictReason: "Organizzare turni efficienti ed installare sistemi di videosorveglianza e taccheggio per proteggere la merce."
      },
      clo: {
        objections: [
          "**Contratto di Locazione Commerciale**: Contratti vincolanti pluriennali con obbligo di fideiussione a garanzia dei canoni.",
          "**Permessi Comunali (SCIA)**: Pratiche burocratiche per insegne, agibilità dei locali e conformità degli impianti commerciali."
        ],
        verdictReason: "Richiedere una perizia degli impianti prima di firmare il contratto di affitto e negoziare clausole di recesso anticipato."
      },
      cco: {
        objections: [
          "**Allestimento Vetrina**: Se la vetrina non viene rinnovata frequentemente, i clienti abituali smetteranno di entrare.",
          "**Atmosfera e Layout**: Luci inadeguate o musica troppo alta possono ridurre il tempo di permanenza nel negozio."
        ],
        verdictReason: "Pianificare una rotazione bisettimanale delle vetrine e creare un percorso espositivo (layout) che guidi all'acquisto."
      },
      cso: {
        objections: [
          "**Qualità del Personale di Vendita**: Addetti scortesi o insistenti allontanano la clientela e danneggiano il brand.",
          "**Politiche di Reso in Negozio**: Gestire i rimborsi o i cambi merce in modo rigido indispone il cliente locale."
        ],
        verdictReason: "Formare lo staff sulla consulenza al cliente e offrire opzioni di cambio merce flessibili (es. buoni acquisto)."
      },
      cpo: {
        objections: [
          "**Obsolescenza dello Stock**: Merce invenduta che occupa spazio e costringe a svendite a margine zero durante i saldi.",
          "**Assortimento Limitato**: Mancanza di taglie o varianti che porta il cliente a uscire a mani vuote."
        ],
        verdictReason: "Monitorare l'indice di rotazione dello stock e ordinare riassortimenti rapidi solo per i prodotti ad alta vendita."
      },
      sourcing: {
        objections: [
          "**MOQ dei Brand**: Minimi d'ordine elevati imposti dai fornitori che costringono a bloccare liquidità in merce rischiosa.",
          "**Tempi di Consegna Stagionali**: Ritardi nella ricezione delle nuove collezioni riducono il periodo di vendita a prezzo pieno."
        ],
        verdictReason: "Diversificare i fornitori e negoziare l'acquisto di stock in conto vendita o con pagamenti dilazionati a 60-90 giorni."
      },
      sales: {
        objections: [
          "**Scontrino Medio Basso**: Clienti che acquistano solo il prodotto in promozione senza aggiungere articoli complementari.",
          "**Mancanza di Tecniche di Vendita**: Staff passivo che non propone abbinamenti o prodotti aggiuntivi (cross-selling)."
        ],
        verdictReason: "Disporre i prodotti d'impulso vicino alla cassa e incentivare lo staff con bonus sulle vendite multiple."
      },
      capital: {
        objections: [
          "**CAPEX Iniziale Elevato**: Spese di ristrutturazione, caparra affitto e primo assortimento richiedono cassa importante.",
          "**Costi Fissi (OPEX) Rigidi**: L'affitto del locale e le bollette energetiche pesano anche nei mesi di bassa affluenza."
        ],
        verdictReason: "Avviare un temporary shop (pop-up) di 1-2 mesi per validare la location ed il prodotto prima di contratti a lungo termine."
      }
    },
    services: {
      cmo: {
        objections: [
          "**Vendita dell'Immateriale**: Difficoltà a dimostrare il valore del servizio prima dell'erogazione effettiva.",
          "**Dipendenza da Passaparola**: Crescita lenta e instabile se non si strutturano canali di acquisizione clienti attivi."
        ],
        verdictReason: "Costruire un portfolio di casi studio reali ed investire in content marketing per posizionarsi come autorità del settore."
      },
      cto: {
        objections: [
          "**Strumenti di Delivery Dispersi**: Mancanza di una piattaforma unificata per condividere documenti e aggiornamenti con il cliente.",
          "**Automazione dei Preventivi**: Perdita di tempo nella stesura manuale di proposte e contratti commerciali standard."
        ],
        verdictReason: "Configurare un CRM (es. HubSpot, Notion) e integrare Calendly per automatizzare la prenotazione delle consulenze."
      },
      coo: {
        objections: [
          "**Colli di Bottiglia del Personale**: Il fatturato è limitato dalle ore del fondatore o dei dipendenti; scalare richiede assunzioni.",
          "**Scope Creep nei Progetti**: Clienti che richiedono continui extra fuori preventivo, allungando i tempi ed erodendo i margini."
        ],
        verdictReason: "Definire in modo millimetrico l'accordo di servizio (SLA) e stabilire tariffe orarie extra per richieste fuori perimetro."
      },
      clo: {
        objections: [
          "**Contratti di Consulenza Deboli**: Rischio di insoluti o ritardi nei pagamenti in assenza di un contratto firmato prima dell'avvio.",
          "**Responsabilità Professionale**: Richieste di risarcimento se il cliente non raggiunge i risultati aziendali sperati."
        ],
        verdictReason: "Utilizzare contratti commerciali con clausole di limitazione di responsabilità e richiedere acconti del 30-50% all'ordine."
      },
      cco: {
        objections: [
          "**Posizionamento Generalista**: Proporsi come agenzia/professionista 'tuttofare' costringe a competere solo sul prezzo orario.",
          "**Sito Web Poco Professionale**: Un sito datato o privo di recensioni distrugge la credibilità del servizio."
        ],
        verdictReason: "Identificare una micro-nicchia di specializzazione e creare un brand focalizzato sulla risoluzione di un unico problema."
      },
      cso: {
        objections: [
          "**Gestione delle Aspettative**: Clienti insoddisfatti perché si aspettavano risultati diversi da quelli reali.",
          "**Difficoltà di Retention**: Servizi spot che non generano entrate ricorrenti mensili (retrainer fee)."
        ],
        verdictReason: "Allineare i report sui risultati mensili e strutturare contratti a canone ricorrente per assistenza continuativa."
      },
      cpo: {
        objections: [
          "**Servizio su Misura Continuo**: Sviluppare progetti sempre diversi impedisce la standardizzazione e l'efficienza interna.",
          "**Mancanza di Pacchetti**: Offrire preventivi personalizzati per ogni cliente allunga le trattative commerciali."
        ],
        verdictReason: "Trasformare il servizio in pacchetti standardizzati (Productized Services) con prezzi, deliverable e tempi fissi."
      },
      sourcing: {
        objections: [
          "**Selezione Collaboratori Esterni**: Difficoltà a trovare freelance qualificati a tariffe sostenibili per delegare il lavoro.",
          "**Costi Software Professionali**: Licenze software costose che pesano sul bilancio prima di avere clienti attivi."
        ],
        verdictReason: "Creare un network di collaboratori di fiducia e utilizzare software open-source o tier gratuiti all'inizio."
      },
      sales: {
        objections: [
          "**Pipeline di Vendita Instabile**: Alternanza continua tra mesi ad alto fatturato (consegna) e mesi a fatturato zero.",
          "**Difficoltà nel B2B Outreach**: Messaggi di vendita generici su LinkedIn ignorati dai decisori aziendali."
        ],
        verdictReason: "Pianificare 30 minuti al giorno per attività di outreach e proporre un audit iniziale a costo ridotto per avviare il rapporto."
      },
      capital: {
        objections: [
          "**Bootstrap Facile ma Limiti di Scalabilità**: Il business non richiede CAPEX, ma non crea un asset aziendale vendibile in futuro.",
          "**Mancanza di Flusso di Cassa Mensile**: Esposizione finanziaria se i clienti pagano a 60 o 90 giorni fine mese."
        ],
        verdictReason: "Fatturare su base mensile anticipata (es. abbonamento di servizio) per garantire la cassa necessaria all'operatività."
      }
    },
    mobile_app: {
      cmo: {
        objections: [
          "**Costo di Installazione (CPI) Alto**: Acquisire utenti che scaricano l'app tramite Ads richiede budget pubblicitari significativi.",
          "**Visibilità negli Store**: Concorrenza spietata di milioni di app; il traffico organico dagli Store (ASO) è minimo."
        ],
        verdictReason: "Focalizzarsi sul marketing di nicchia e incentivare la condivisione virale organica all'interno dell'app stessa."
      },
      cto: {
        objections: [
          "**Manutenzione OS Multipli**: Sviluppare e testare l'app su versioni diverse di iOS e Android comporta sforzi costosi.",
          "**Bugs al Rilascio**: Un bug bloccante nelle prime ore dal lancio può portare a recensioni da 1 stella irrecuperabili."
        ],
        verdictReason: "Consigliamo framework ibridi (React Native, Flutter) per codice unico e cicli di test approfonditi prima dell'invio agli store."
      },
      coo: {
        objections: [
          "**Tempi di Approvazione Store**: Apple App Store e Google Play Store possono impiegare giorni per approvare aggiornamenti critici.",
          "**Review Guidelines Rigide**: Rischio di rifiuto dell'app per violazione di policy sui pagamenti o tracciamento dati."
        ],
        verdictReason: "Pianificare i rilasci con margini di tempo adeguati e seguire scrupolosamente le linee guida ufficiali degli Store."
      },
      clo: {
        objections: [
          "**Commissioni In-App Store**: Apple e Google trattengono il 15-30% su ogni transazione effettuata tramite i loro sistemi di pagamento.",
          "**Tracciamento e Privacy (ATT)**: Le restrizioni di tracciamento su iOS rendono difficile l'ottimizzazione delle campagne marketing."
        ],
        verdictReason: "Adottare il programma per piccoli sviluppatori (15% di commissione) e implementare form di consenso privacy trasparenti."
      },
      cco: {
        objections: [
          "**UI Mobile Sovraccarica**: Schermi ridotti richiedono un'interfaccia estremamente pulita e flussi d'uso privi di ostacoli.",
          "**Mancanza di Micro-Interazioni**: Un design statico o privo di feedback visivi rende l'esperienza d'uso noiosa."
        ],
        verdictReason: "Investire in un UI/UX designer specializzato su mobile e implementare animazioni fluide per premiare le azioni dell'utente."
      },
      cso: {
        objections: [
          "**Tasso di Disinstallazione**: Molti utenti scaricano l'app, la aprono una volta e la disinstallano entro le prime 24 ore.",
          "**Notifiche Fastidiose**: Notifiche push inviate negli orari sbagliati spingono l'utente a disattivare i permessi o rimuovere l'app."
        ],
        verdictReason: "Configurare notifiche push personalizzate basate sul comportamento dell'utente e offrire un canale di feedback in-app."
      },
      cpo: {
        objections: [
          "**Perimetro MVP Troppo Vasto**: Voler inserire social network, chat, profili e notifiche sin dalla versione 1.0 rallenta lo sviluppo.",
          "**Time to Value Lungo**: L'utente deve registrarsi e completare troppi passaggi prima di vedere il valore reale dell'app."
        ],
        verdictReason: "Permettere l'accesso in modalità ospite (guest mode) e focalizzare l'MVP sulla risoluzione del problema principale in 2 click."
      },
      sourcing: {
        objections: [
          "**Costi Server e Database Scalabili**: Servizi cloud (AWS, Firebase) con fatturazione basata sui consumi che possono esplodere in caso di picchi.",
          "**Licenze SDK Terze Parti**: Costi ricorrenti per strumenti di analisi, notifiche o mappe integrate."
        ],
        verdictReason: "Configurare limiti di spesa sui servizi cloud e utilizzare SDK open-source o con piani gratuiti per la fase di validazione."
      },
      sales: {
        objections: [
          "**Basso Tasso di Conversione Premium**: Solo l'1-3% degli utenti free converte ad abbonamento premium in-app.",
          "**Frizione dei Pagamenti In-App**: L'utente deve associare la carta all'account dello store per completare l'acquisto."
        ],
        verdictReason: "Implementare paywall chiari che mostrino i vantaggi premium e sperimentare modelli di pricing flessibili (es. settimanale)."
      },
      capital: {
        objections: [
          "**Sviluppo Costoso in Bootstrap**: Creare un'app di qualità senza capitali richiede mesi di lavoro personale del fondatore.",
          "**Flusso di Cassa Negativo Iniziale**: Tempi di pagamento degli store (spesso 30-45 giorni) rallentano la disponibilità di cassa."
        ],
        verdictReason: "Sviluppare inizialmente una Progressive Web App (PWA) per validare l'idea nel browser con costi minimi prima di compilare per gli store."
      }
    },
    marketplace: {
      cmo: {
        objections: [
          "**Problema dell'Uovo e della Gallina**: Difficoltà a far crescere contemporaneamente la domanda (acquirenti) e l'offerta (venditori).",
          "**Fiducia e Sicurezza**: Superare la diffidenza iniziale degli utenti nell'effettuare transazioni con venditori sconosciuti."
        ],
        verdictReason: "Il successo del marketplace dipende dalla capacità di risolvere il problema di liquidità bilaterale fin dai primi mesi."
      },
      cto: {
        objections: [
          "**Complessità di Gestione dei Pagamenti**: Necessità di gestire flussi di pagamento split e pagamenti condizionati (escrow).",
          "**Sincronizzazione della Disponibilità**: Rischio di vendite doppie o non sincronizzate tra venditori diversi."
        ],
        verdictReason: "Suggeriamo l'uso di Stripe Connect o simili per gestire le transazioni split in conformità con le direttive bancarie."
      },
      coo: {
        objections: [
          "**Risoluzione delle Dispute**: Richiede un impegno operativo elevato per arbitrare i conflitti tra acquirenti e venditori.",
          "**Verifica e Onboarding dei Venditori**: Processo laborioso per verificare la qualità e la legalità dei venditori registrati."
        ],
        verdictReason: "Standardizzare il processo di onboarding dei venditori ed impostare regole di risoluzione controversie automatiche."
      },
      clo: {
        objections: [
          "**Responsabilità dell'Intermediario**: Proteggere la piattaforma da responsabilità per vizi o illegalità dei prodotti venduti da terzi.",
          "**Normative sui Pagamenti (PSD2)**: Rischio di essere considerati intermediari finanziari se non ci si appoggia a gateway conformi."
        ],
        verdictReason: "I termini contrattuali devono specificare la natura di pura intermediazione per isolare la piattaforma da controversie sul prodotto."
      },
      cco: {
        objections: [
          "**UX del Flusso di Ricerca**: Frizione nel trovare prodotti o servizi specifici a causa di filtri di ricerca deboli o lenti.",
          "**Branding a Due Canali**: Difficoltà a comunicare con due target differenti (merchant e consumer) sulla stessa home page."
        ],
        verdictReason: "Design incentrato su barra di ricerca intelligente, filtri flessibili e due landing page separate per l'onboarding."
      },
      cso: {
        objections: [
          "**Tasso di Recensioni False**: Rischio che recensioni fasulle manipolino la reputazione all'interno del portale.",
          "**Abbandono dei Venditori**: Perdita di merchant se il marketplace non porta un volume di vendite sufficiente nei primi 30 giorni."
        ],
        verdictReason: "Verificare gli acquisti prima di consentire recensioni e offrire visibilità gratuita ai nuovi venditori iniziali."
      },
      cpo: {
        objections: [
          "**Fattore Reputazione**: Sviluppare un sistema di feedback bilaterale robusto per autogestire la qualità dei partecipanti.",
          "**UX del Checkout Multiproduttore**: Gestione complessa del carrello in caso di acquisto contemporaneo da più venditori."
        ],
        verdictReason: "Implementare una valutazione utenti standardizzata e dividere le spedizioni per venditore in fase di checkout."
      },
      sourcing: {
        objections: [
          "**Costi del KYC/Compliance**: Le tariffe per la verifica dell'identità dei venditori (KYC/Stripe) erodono la marginalità.",
          "**Acquisizione Partner Chiave**: Difficoltà a convincere i primi grandi venditori ad inserire il proprio catalogo."
        ],
        verdictReason: "Selezionare provider di KYC integrati nei gateway di pagamento e proporre zero commissioni iniziali per i merchant fondatori."
      },
      sales: {
        objections: [
          "**Disintermediazione**: Venditori e acquirenti che scavalcano il portale per concludere le transazioni privatamente per evitare commissioni.",
          "**Struttura delle Commissioni**: Trovare la percentuale ideale (take rate) che sia sostenibile ma non incentivi l'abbandono."
        ],
        verdictReason: "Fornire servizi aggiuntivi (assicurazione, spedizioni agevolate) per rendere rischiosa o sconveniente la transazione esterna."
      },
      capital: {
        objections: [
          "**Lungo Periodo di Rientro**: I marketplace richiedono anni ed ingenti capitali di marketing per raggiungere la massa critica di rete.",
          "**Margine Iniziale Basso**: I ricavi da commissione sono minimi finché il volume totale delle transazioni (GMV) non è elevato."
        ],
        verdictReason: "Cercare finanziamenti esterni (Venture Capital) o procedere su base locale/nicchia ristretta per autofinanziarsi inizialmente."
      }
    },
    hardware_iot: {
      cmo: {
        objections: [
          "**Frizione all'Acquisto di Dispositivi Sconosciuti**: Gli utenti sono restii ad acquistare hardware non supportato da brand noti.",
          "**Difficoltà di Dimostrazione**: Comunicare il valore del dispositivo senza una demo fisica o video professionali."
        ],
        verdictReason: "Creare campagne video che mostrino il dispositivo in azione ed offrire una garanzia di rimborso a 30 giorni."
      },
      cto: {
        objections: [
          "**Ciclo di Rilascio Firmware Rigido**: Correggere un bug hardware o firmware dopo la spedizione è estremamente complesso.",
          "**Certificazioni di Sicurezza**: Lunghi tempi per ottenere la conformità CE, FCC o marchi antincendio/elettrici."
        ],
        verdictReason: "Prevedere aggiornamenti firmware OTA (Over-The-Air) automatici e programmare test in laboratorio prima del rilascio."
      },
      coo: {
        objections: [
          "**Gestione della Catena di Montaggio**: Sfide logistiche nel controllo qualità dei singoli componenti ed assemblaggio.",
          "**Gestione Garanzia e Resi**: Costo elevato per la sostituzione fisica dei dispositivi difettosi spediti ai clienti."
        ],
        verdictReason: "Strutturare una catena di approvvigionamento con controlli qualità su ogni lotto e definire un protocollo di riparazione rapida."
      },
      clo: {
        objections: [
          "**Responsabilità per Danni Fisici**: Rischio di cause legali in caso di malfunzionamenti dell'hardware che causano danni a cose o persone.",
          "**Brevetti e Proprietà Intellettuale**: Rischio di contraffazione o violazione involontaria di brevetti registrati da competitor."
        ],
        verdictReason: "Richiedere certificazioni di sicurezza standard e tutelare l'azienda con contratti di limitazione di responsabilità e polizza RC prodotti."
      },
      cco: {
        objections: [
          "**Design Industriale ed Ergonomia**: L'aspetto visivo e l'ergonomia determinano l'appeal del prodotto più delle feature interne.",
          "**Packaging Povero**: Un imballaggio poco curato riduce il valore percepito del dispositivo al momento dell'unboxing."
        ],
        verdictReason: "Collaborare con designer industriali per creare una scocca ergonomica e curare il packaging per un'ottima prima impressione."
      },
      cso: {
        objections: [
          "**Frizione nella Configurazione**: Utenti che faticano a connettere il dispositivo al Wi-Fi o all'app mobile iniziale.",
          "**Supporto Tecnico Complesso**: Gestire segnalazioni di malfunzionamento che spesso dipendono dalla rete internet del cliente."
        ],
        verdictReason: "Scrivere guide di configurazione visive passo-passo e preparare video tutorial di onboarding facili da seguire."
      },
      cpo: {
        objections: [
          "**Sincronizzazione Cloud-Device**: Garantire che il software cloud e il firmware dell'hardware siano sempre compatibili.",
          "**Complessità della Distinta Base (BOM)**: Rischio di aumentare i costi di produzione aggiungendo sensori o funzioni non indispensabili."
        ],
        verdictReason: "Definire un MVP hardware minimale e bloccare le specifiche della Distinta Base prima di avviare la produzione."
      },
      sourcing: {
        objections: [
          "**Scarsità di Componenti**: Dipendenza da fornitori di microchip o sensori con tempi di consegna instabili.",
          "**Minimi d'Ordine Elevati (MOQ)**: Stampi e materie prime richiedono acquisti in grandi volumi per abbattere i costi."
        ],
        verdictReason: "Selezionare distributori di componenti standard di facile reperibilità ed individuare fornitori alternativi di backup."
      },
      sales: {
        objections: [
          "**Prezzo di Vendita (MSRP) Insostenibile**: Difficoltà ad applicare un moltiplicatore sufficiente (3x-4x) per coprire i margini di canale.",
          "**Ciclo di Vendita Hardware B2B**: Tempi lunghi per far approvare e testare i dispositivi da parte di clienti aziendali."
        ],
        verdictReason: "Strutturare un modello di ricavi ricorrenti abbinato (Hardware + Abbonamento Software SaaS) per aumentare il valore del cliente."
      },
      capital: {
        objections: [
          "**Impegno Finanziario Pre-Lancio**: Elevati investimenti di cassa richiesti per la produzione e stampi prima delle vendite reali.",
          "**Fatturato Non Ricorrente**: Vendere solo hardware non garantisce entrate stabili nei mesi successivi senza un modulo software."
        ],
        verdictReason: "Avviare campagne di crowdfunding (Kickstarter) o pre-ordini per finanziare il primo lotto di produzione con i soldi dei clienti."
      }
    },
    non_profit: {
      cmo: {
        objections: [
          "**Storytelling Emozionale vs Efficacia**: Rischio di focalizzarsi troppo sul senso di colpa anziché sull'impatto positivo reale.",
          "**Acquisizione Donatori Costosa**: I canali tradizionali (eventi, ads) possono divorare gran parte delle donazioni raccolte."
        ],
        verdictReason: "Puntare su campagne di impact storytelling trasparenti e newsletter periodiche per mostrare i risultati tangibili."
      },
      coo: {
        objections: [
          "**Gestione e Retention dei Volontari**: Alta volatilità dello staff non retribuito e difficoltà a coordinare i turni.",
          "**Tracciamento dell'Impatto**: Mancanza di KPI chiari per misurare e dimostrare l'efficacia sociale del progetto."
        ],
        verdictReason: "Implementare un portale volontari semplificato e definire metriche di impatto chiare (es. pasti erogati, ore di assistenza)."
      },
      clo: {
        objections: [
          "**Inquadramento Fiscale No-Profit**: Complessità burocratica nell'iscrizione al RUNTS (Registro Terzo Settore) e conformità fiscale.",
          "**Responsabilità sulle Donazioni**: Rischio di sanzioni in caso di tracciamento non trasparente dei fondi e delle detrazioni."
        ],
        verdictReason: "Farsi assistere da un consulente esperto di Terzo Settore per la stesura dello statuto e la conformità ONLUS/ETS."
      },
      capital: {
        objections: [
          "**Dipendenza da Singole Fonti**: Rischio di crisi finanziaria se l'associazione si basa solo su un bando o su un grande donatore.",
          "**Burocrazia dei Bandi Pubblici**: Tempi di erogazione dei fondi pubblici lunghissimi, che creano tensioni di cassa nel breve termine."
        ],
        verdictReason: "Diversificare le entrate raccogliendo quote associative, donazioni ricorrenti da privati e sponsorizzazioni da aziende locali (CSR)."
      }
    },
    industrial_agri: {
      cmo: {
        objections: [
          "**Commodity Trap (Prezzo Basso)**: Rischio di vendere prodotti industriali o agricoli generici, dovendo competere solo sul prezzo all'ingrosso.",
          "**Canali di Vendita Intermediati**: Forte dipendenza da distributori e GDO che riducono i margini del produttore."
        ],
        verdictReason: "Creare un brand forte incentrato sull'artigianalità, la sostenibilità (es. biologico, filiera corta) ed avviare canali di vendita diretta."
      },
      coo: {
        objections: [
          "**Efficienza della Catena di Produzione**: Rischio di colli di bottiglia o scarti elevati nella lavorazione delle materie prime.",
          "**Manutenzione dei Macchinari**: Un guasto agli impianti di produzione o alle serre idroponiche può bloccare l'intera attività."
        ],
        verdictReason: "Standardizzare i processi operativi (SOP), pianificare la manutenzione preventiva e ottimizzare il layout degli spazi di lavoro."
      },
      sourcing: {
        objections: [
          "**Volatilità del Costo delle Materie Prime**: Fluttuazioni di prezzo di sementi, metalli o energia che erodono i margini stimati.",
          "**Dipendenza da Fornitori di Macchinari**: Tempi di consegna lunghi per pezzi di ricambio o impianti critici."
        ],
        verdictReason: "Negoziare contratti di fornitura a lungo termine a prezzo bloccato e diversificare i partner di approvvigionamento."
      },
      capital: {
        objections: [
          "**CAPEX Iniziale Altissimo**: L'acquisto di macchinari industriali, trattori o impianti idroponici richiede ingenti capitali iniziali.",
          "**Ritorno sull'Investimento Lento**: I tempi di ammortamento degli impianti industriali o di crescita dei raccolti sono molto lunghi."
        ],
        verdictReason: "Sfruttare il noleggio operativo o leasing per i macchinari e accedere a bandi di finanziamento agricoli (PSR) o industriali (Transizione 5.0)."
      }
    },
    real_estate: {
      cmo: {
        objections: [
          "**Acquisizione Immobili Competitiva**: Difficoltà a reperire appartamenti o spazi a buon prezzo in mercati saturi.",
          "**Ciclo di Vendita Lungo**: Trovare acquirenti o conduttori qualificati richiede mesi, durante i quali l'immobile genera costi."
        ],
        verdictReason: "Implementare campagne di lead generation mirate per proprietari e valorizzare gli immobili con servizi di Home Staging professionale."
      },
      coo: {
        objections: [
          "**Gestione delle Ristrutturazioni**: Rischio di ritardi dei lavori ed aumento imprevisto dei costi delle imprese edili.",
          "**Burocrazia e Permessi Comunali**: Tempi lunghi per ottenere autorizzazioni edilizie (CILA, SCIA) o cambi di destinazione d'uso."
        ],
        verdictReason: "Definire contratti d'appalto a prezzo chiuso con penali sui ritardi e affidarsi a tecnici locali qualificati per le pratiche."
      },
      clo: {
        objections: [
          "**Conformità Urbanistica e Catastale**: Rischio di abusi edilizi non sanati che bloccano la compravendita o il noleggio.",
          "**Contratti di Locazione Rigidi**: Rischi legati a inquilini morosi e tempi lunghi di sfratto secondo la normativa locale."
        ],
        verdictReason: "Effettuare una due diligence catastale approfondita prima dell'acquisto e redigere contratti con garanzie fideiussorie solide."
      },
      capital: {
        objections: [
          "**Esposizione Finanziaria Elevata**: L'acquisto di immobili o le ristrutturazioni richiedono capitali enormi e forte leva finanziaria (mutui).",
          "**Sensibilità ai Tassi d'Interesse**: Un aumento dei tassi dei mutui può ridurre drasticamente la redditività dell'operazione."
        ],
        verdictReason: "Utilizzare accordi di opzione d'acquisto, subaffitto (Rent-to-Rent) o joint venture con investitori per ridurre la cassa iniziale."
      }
    },
    media_content: {
      cmo: {
        objections: [
          "**Saturazione dell'Attenzione**: Competere per il tempo degli utenti su piattaforme come YouTube, Spotify o social è estremamente difficile.",
          "**Algoritmo Volatile**: Forte dipendenza dalle variazioni improvvise degli algoritmi di raccomandazione delle piattaforme esterne."
        ],
        verdictReason: "Costruire una community proprietaria (es. newsletter, canale Discord) per non dipendere esclusivamente dagli algoritmi social."
      },
      cto: {
        objections: [
          "**Infrastruttura di Produzione Dispersa**: Mancanza di standard tecnici e backup fisici per file video/audio pesanti.",
          "**Piattaforme di Distribuzione**: Gestione complessa di feed RSS, hosting video o piattaforme di gaming proprietarie."
        ],
        verdictReason: "Adottare soluzioni cloud centralizzate per l'editing collaborativo e sfruttare CDN affidabili per la distribuzione dei contenuti."
      },
      cco: {
        objections: [
          "**Identità di Canale Confusa**: Trattare troppi argomenti diversi allontana gli iscritti e confonde gli sponsor.",
          "**Qualità Visiva/Audio Bassa**: Contenuti poco curati riducono drasticamente la retention dell'utente nei primi 10 secondi."
        ],
        verdictReason: "Focalizzarsi su una nicchia tematica chiara e investire nell'acustica e nella qualità dell'immagine per un look premium."
      },
      sales: {
        objections: [
          "**Dipendenza da AdSense (Bassi Margini)**: Guadagni instabili basati esclusivamente sulle visualizzazioni pubblicitarie delle piattaforme.",
          "**Trattative con Sponsor Complesse**: Difficoltà a proporre pacchetti di sponsorizzazione a brand aziendali senza un media kit professionale."
        ],
        verdictReason: "Strutturare un media kit con dati demografici del pubblico e vendere pacchetti di sponsorizzazione diretta o modelli di abbonamento (Patreon/Substack)."
      }
    },
    general: {
      cmo: {
        objections: [
          "**Targeting Troppo Ampio**: Voler parlare a tutti diluisce il messaggio di marketing, rendendo le campagne inefficaci.",
          "**Mancanza di Canali di Acquisizione**: Nessuna strategia definita per generare lead in modo ripetibile e tracciabile."
        ],
        verdictReason: "Identificare un unico segmento di clienti target e testare un solo canale di acquisizione principale."
      },
      cto: {
        objections: [
          "**Sovra-ingegnerizzazione**: Scelta di tecnologie complesse che richiedono troppo tempo per essere modificate o validate.",
          "**Mancanza di Standard di Sicurezza**: Rischio di vulnerabilità nel database o nella gestione dei pagamenti degli utenti."
        ],
        verdictReason: "Adottare soluzioni collaudate e standard (es. piattaforme No-Code o SaaS esistenti) per accelerare la validazione."
      },
      coo: {
        objections: [
          "**Assenza di Procedure Operative**: Processi manuali caotici che assorbono tutto il tempo del fondatore.",
          "**Scarsa Pianificazione delle Risorse**: Rischio di blocco operativo in caso di crescita improvvisa delle richieste."
        ],
        verdictReason: "Creare checklist e manuali operativi base sin dal primo giorno per consentire future deleghe."
      },
      clo: {
        objections: [
          "**Inquadramento Fiscale Inadeguato**: Mancanza di pianificazione societaria e fiscale che può generare costi imprevisti.",
          "**Policy Legali Mancanti**: Assenza di tutele contrattuali adeguate nei confronti di clienti e fornitori."
        ],
        verdictReason: "Consultare un professionista per l'inquadramento fiscale corretto e dotarsi di contratti standard protettivi."
      },
      cco: {
        objections: [
          "**Brand Anonimo**: Un'identità visiva generica che non si differenzia dai concorrenti presenti sul mercato.",
          "**Payoff Poco Chiaro**: Se il cliente non capisce cosa facciamo in 5 secondi, abbandonerà il sito."
        ],
        verdictReason: "Sviluppare una proposta di valore (Value Proposition) chiara e un design coerente con le aspettative del target."
      },
      cso: {
        objections: [
          "**Mancanza di Canali di Feedback**: Ignorare i suggerimenti o le critiche dei primi clienti impedisce il miglioramento del prodotto.",
          "**Tempi di Risposta Lunghi**: Un servizio clienti lento crea frustrazione ed elimina le possibilità di passaparola."
        ],
        verdictReason: "Configurare un canale di supporto diretto (es. WhatsApp o email dedicata) e rispondere entro le 4 ore lavorative."
      },
      cpo: {
        objections: [
          "**Perimetro MVP Indefinito**: Continuare ad aggiungere funzionalità ritardando il lancio sul mercato reale.",
          "**Mancanza di Validazione sul Campo**: Sviluppare basandosi unicamente su intuizioni personali senza confrontarsi con i clienti."
        ],
        verdictReason: "Rilasciare la versione minima del prodotto per raccogliere feedback reali prima di scrivere altro codice o investire capitali."
      },
      sourcing: {
        objections: [
          "**Dipendenza da un Singolo Fornitore**: Rischio di blocco dell'attività in caso di problemi del partner chiave.",
          "**Contratti di Fornitura Rigidi**: Accordi a lungo termine che limitano la flessibilità dell'attività in fase di avvio."
        ],
        verdictReason: "Prediligere contratti mensili flessibili e identificare partner di backup per i servizi critici."
      },
      sales: {
        objections: [
          "**Mancanza di un Funnel di Conversione**: Avere visite ma nessun percorso strutturato per trasformarle in vendite o lead.",
          "**Pricing Non Validato**: Prezzi fissati a caso senza verificare la reale disponibilità di spesa del cliente target."
        ],
        verdictReason: "Strutturare una landing page ottimizzata per la conversione e testare diverse fasce di prezzo per trovare il punto di massimo utile."
      },
      capital: {
        objections: [
          "**Pianificazione Finanziaria Assente**: Rischio di esaurire la cassa prima di aver raggiunto il punto di pareggio (BEP).",
          "**Mancanza di Reinvestimento**: Destinare i primi utili a spese personali anziché consolidare la crescita aziendale."
        ],
        verdictReason: "Creare un prospetto mensile delle entrate ed uscite ed accantonare una riserva di cassa per le emergenze operative."
      }
    }
  },

  sectorKeywords: {
    saas: {
      product: "il software SaaS / piattaforma cloud",
      client: "abbonati mensili",
      tech: "hosting Vercel, Supabase database ed automazioni cloud",
      marketing: "Google Ads, SEO tecnica e content marketing",
      revenue: "modello di abbonamento ricorrente (MRR)",
      unit: "utenti attivi paganti",
      tam: 120000000,
      sam: 15000000,
      som: 1800000,
      buyerPersona: {
        avatar: "💻",
        name: "Marco Rossi",
        demographics: "35 anni, CTO / Lead Developer",
        pains: "Perde ore a sincronizzare i dati dei clienti manuale e teme falle di sicurezza.",
        gains: "Vuole un'infrastruttura automatizzata a basso costo per scalare senza pensieri.",
        channel: "LinkedIn e ricerche tecniche su Google"
      },
      marketingChannels: [
        { name: "Google Search Ads (Target B2B)", share: 40, cac: 35 },
        { name: "LinkedIn Cold Outreach / Social Selling", share: 30, cac: 15 },
        { name: "Content Marketing & SEO Tecnica", share: 20, cac: 8 },
        { name: "Referral & Co-Marketing", share: 10, cac: 5 }
      ],
      launchTimeline: [
        "Settimana 1-2: Landing page di pre-iscrizione e sondaggi diretti a 15-20 CTO.",
        "Settimana 3-4: Rilascio della versione alpha privata agli iscritti qualificati.",
        "Settimana 5-6: Setup campagne Search Ads e prime automazioni di cold email.",
        "Settimana 7-8: Lancio pubblico dell'MVP su ProductHunt e canali B2B.",
        "Settimana 9-10: Ottimizzazione del funnel di checkout e integrazione Stripe.",
        "Settimana 11-12: Attivazione del programma di affiliazione/referral ricorrente."
      ]
    },
    ecommerce: {
      product: "l'E-commerce / catalogo prodotti",
      client: "acquirenti online",
      tech: "Shopify / WooCommerce e gateway di pagamento Stripe",
      marketing: "Meta Ads, TikTok Ads e email marketing di fidelizzazione",
      revenue: "vendita diretta di prodotti fisici con margine",
      unit: "ordini spediti con successo",
      tam: 250000000,
      sam: 30000000,
      som: 2500000,
      buyerPersona: {
        avatar: "🛍️",
        name: "Laura Bianchi",
        demographics: "28 anni, Impiegata appassionata di shopping conscio",
        pains: "Difficile trovare packaging ecologico e prodotti di qualità certificata.",
        gains: "Cerca un'esperienza d'acquisto rapida, resi facili e trasparenza ecologica.",
        channel: "Instagram, TikTok ed email marketing"
      },
      marketingChannels: [
        { name: "Meta Ads (Instagram & Facebook)", share: 50, cac: 18 },
        { name: "TikTok Ads & Influencer Seeding", share: 25, cac: 12 },
        { name: "Email Marketing (Klaviyo automation)", share: 15, cac: 2 },
        { name: "Google Shopping (PMax)", share: 10, cac: 22 }
      ],
      launchTimeline: [
        "Settimana 1-2: Creazione visual asset e setup store Shopify in modalità pre-ordine.",
        "Settimana 3-4: Campagne teaser social con piccoli omaggi e iscrizione newsletter.",
        "Settimana 5-6: Invio dei primi prototipi a 10 micro-influencer per recensioni.",
        "Settimana 7-8: Apertura ufficiale vendite e attivazione delle automazioni carrello abbandonato.",
        "Settimana 9-10: Lancio di campagne di retargeting e sconti quantità.",
        "Settimana 11-12: Analisi del tasso di riacquisto e introduzione del referral program."
      ]
    },
    food_beverage: {
      product: "l'attività di somministrazione Food & Beverage",
      client: "clienti locali e turisti",
      tech: "POS elettronico, menu digitale QR e software di cassa",
      marketing: "social media marketing (Instagram), Local SEO e promozioni fisiche",
      revenue: "somministrazione diretta e ordini da asporto",
      unit: "coperti / pasti erogati",
      tam: 45000000,
      sam: 8000000,
      som: 600000,
      buyerPersona: {
        avatar: "🍕",
        name: "Giovanni Esposito",
        demographics: "42 anni, Lavoratore d'ufficio locale e appassionato di buon cibo",
        pains: "Poco tempo per la pausa pranzo, offerte ripetitive e scarsa igiene.",
        gains: "Cerca celerità d'erogazione, qualità artigianale e facilità di prenotazione.",
        channel: "Instagram, Google Maps e passaparola fisico"
      },
      marketingChannels: [
        { name: "Instagram Reels & Local Influencers", share: 40, cac: 6 },
        { name: "Google Maps & Local SEO (Ricerca Pizzerie/Locali)", share: 30, cac: 3 },
        { name: "Volantinaggio Mirato & Insegne su Strada", share: 20, cac: 2 },
        { name: "Partnership con Uffici & Negozi vicini", share: 10, cac: 1 }
      ],
      launchTimeline: [
        "Settimana 1-2: Setup di Google Business Profile e registrazione permessi ASL/SUAP.",
        "Settimana 3-4: Ristrutturazione grafica del menu e wrapping del punto vendita/macchina.",
        "Settimana 5-6: Pre-lancio ad inviti per uffici locali e recensori enogastronomici.",
        "Settimana 7-8: Inaugurazione ufficiale con offerta speciale di prova gratuita o sconto 50%.",
        "Settimana 9-10: Campagna di raccolta recensioni su Google Maps con QR code sconto.",
        "Settimana 11-12: Lancio del servizio asporto/consegna locale convenzionato."
      ]
    },
    retail: {
      product: "il punto vendita retail / negozio fisico",
      client: "visitatori in negozio",
      tech: "POS integrato, lettori barcode e software di inventario",
      marketing: "Google Business Profile, insegne ad alta visibilità e marketing locale",
      revenue: "vendita di prodotti in negozio",
      unit: "scontrini battuti",
      tam: 60000000,
      sam: 10000000,
      som: 800000,
      buyerPersona: {
        avatar: "🏬",
        name: "Elena Neri",
        demographics: "50 anni, Casalinga e residente locale",
        pains: "Negozi di catena senz'anima, mancanza di assistenza all'acquisto personalizzata.",
        gains: "Apprezza il contatto umano, la qualità del servizio e i prodotti unici selezionati.",
        channel: "Passaparola di quartiere e promozioni in vetrina"
      },
      marketingChannels: [
        { name: "Vetrina e Insegne Luminose ad Alto Impatto", share: 45, cac: 4 },
        { name: "Google Business Profile & Maps (SEO locale)", share: 25, cac: 5 },
        { name: "Volantini di quartiere a buchetta", share: 20, cac: 3 },
        { name: "Convenzioni con Associazioni Locali", share: 10, cac: 2 }
      ],
      launchTimeline: [
        "Settimana 1-2: Scelta allestimento vetrine, permessi comunali e setup registratore di cassa.",
        "Settimana 3-4: Allestimento degli scaffali e accordi di fornitura in conto vendita.",
        "Settimana 5-6: Apertura di prova (soft launch) per parenti e residenti vicini.",
        "Settimana 7-8: Grand Opening con palloncini, rinfresco e sconti esclusivi sui primi 100 scontrini.",
        "Settimana 9-10: Inserimento su volantini di quartiere e gruppi Facebook locali.",
        "Settimana 11-12: Implementazione della tessera fedeltà cartacea e digitale."
      ]
    },
    mobile_app: {
      product: "l'applicazione mobile (iOS/Android)",
      client: "utenti dell'app",
      tech: "SDK App Store, Firebase database e notifiche push",
      marketing: "App Store Optimization (ASO) e campagne di installazione",
      revenue: "acquisti in-app (IAP) o abbonamento",
      unit: "download / abbonati in-app",
      tam: 500000000,
      sam: 40000000,
      som: 3000000,
      buyerPersona: {
        avatar: "📱",
        name: "Filippo Verdi",
        demographics: "22 anni, Studente universitario tech-savvy",
        pains: "App lente, piene di pubblicità invasiva, o con abbonamenti troppo costosi.",
        gains: "Cerca un'interfaccia fluida, utility reale e gamification gratificante.",
        channel: "App Store, TikTok, Reddit e consigli di amici"
      },
      marketingChannels: [
        { name: "App Store Optimization (ASO) organica", share: 40, cac: 0.8 },
        { name: "Apple Search Ads & Google UAC", share: 30, cac: 2.2 },
        { name: "Tiktok & Instagram Reels (Creator marketing)", share: 20, cac: 1.5 },
        { name: "Reddit & Community Online Outreach", share: 10, cac: 0.5 }
      ],
      launchTimeline: [
        "Settimana 1-2: Preparazione grafiche e asset store (App Store & Google Play).",
        "Settimana 3-4: Campagna di pre-registrazione sugli store con incentivo in-game/in-app.",
        "Settimana 5-6: Rilascio in beta test ristretto tramite TestFlight ed Android Beta.",
        "Settimana 7-8: Lancio globale ufficiale e attivazione delle campagne ASA.",
        "Settimana 9-10: Monitoraggio crash rate e invio di notifiche push di onboarding personalizzate.",
        "Settimana 11-12: Attivazione del referral 'invita un amico' per sbloccare funzioni premium."
      ]
    },
    services: {
      product: "il servizio professionale / consulenza agenzia",
      client: "aziende clienti (B2B) o privati",
      tech: "CRM di vendita (HubSpot), Calendly per appuntamenti e Zoom",
      marketing: "LinkedIn Outreach, passaparola strutturato e networking di settore",
      revenue: "tariffe orarie, consulenze o pacchetti mensili flat",
      unit: "progetti chiusi / ore erogate",
      tam: 80000000,
      sam: 12000000,
      som: 1500000,
      buyerPersona: {
        avatar: "👔",
        name: "Andrea Viola",
        demographics: "45 anni, Direttore Marketing o Proprietario di PMI",
        pains: "Troppi consulenti teorici senza visione pratica, spreco di tempo e budget.",
        gains: "Cerca un partner affidabile orientato ai risultati concreti (ROI) e report trasparenti.",
        channel: "LinkedIn, eventi di networking ed inviti B2B"
      },
      marketingChannels: [
        { name: "LinkedIn Cold Outreach (Messaggistica diretta)", share: 40, cac: 20 },
        { name: "Passaparola strutturato (BNI / Associazioni)", share: 30, cac: 5 },
        { name: "Content Marketing (Case Studies su LinkedIn)", share: 20, cac: 12 },
        { name: "Partecipazione come Speaker a Fiere/Webinar", share: 10, cac: 25 }
      ],
      launchTimeline: [
        "Settimana 1-2: Profilazione di 200 aziende target ideali e ottimizzazione del profilo LinkedIn.",
        "Settimana 3-4: Creazione di una presentazione in PDF (Case Study o Lead Magnet) di valore.",
        "Settimana 5-6: Lancio delle prime 50 connessioni settimanali con follow-up a valore su LinkedIn.",
        "Settimana 7-8: Setup di Calendly integrato al CRM per la prenotazione delle prime chiamate.",
        "Settimana 9-10: Invio delle prime proposte formali personalizzate h24.",
        "Settimana 11-12: Strutturazione di un accordo provvigionale per segnalatori esterni di lead."
      ]
    },
    non_profit: {
      product: "l'Associazione No-Profit / progetto ad impatto sociale",
      client: "sostenitori, donatori e beneficiari",
      tech: "piattaforma di crowdfunding, CRM donatori (es. Keela) ed email marketing",
      marketing: "storytelling emozionale, newsletter di impatto, eventi locali e social organici",
      revenue: "donazioni, quote associative, bandi pubblici e sponsorizzazioni etiche (CSR)",
      unit: "donatori attivi / fondi raccolti",
      tam: 15000000,
      sam: 3000000,
      som: 250000,
      buyerPersona: {
        avatar: "🤝",
        name: "Chiara Giovannini",
        demographics: "45 anni, Filantropa locale e attivista nel tempo libero",
        pains: "Teme la mancanza di trasparenza sull'uso reale delle donazioni ed è stanca di spam promozionale.",
        gains: "Cerca impatto sociale concreto tracciabile, storie umane autentiche e riconoscimento etico.",
        channel: "Newsletter dedicate, Facebook ed eventi fisici di beneficenza"
      },
      marketingChannels: [
        { name: "Direct Email & Impact Reports", share: 40, cac: 3 },
        { name: "Eventi e Raccolte Fondi Locali", share: 30, cac: 8 },
        { name: "Social Media & Storytelling Organico", share: 20, cac: 4 },
        { name: "Partnership CSR con Aziende", share: 10, cac: 15 }
      ],
      launchTimeline: [
        "Settimana 1-2: Redazione statuto dell'associazione, definizione dello scopo sociale e registrazione.",
        "Settimana 3-4: Landing page pilota con modulo iscrizione newsletter e manifestazioni di interesse.",
        "Settimana 5-6: Lancio di un evento locale di presentazione ad inviti con piccolo rinfresco.",
        "Settimana 7-8: Apertura ufficiale tesseramento ed attivazione portale donazioni online (Stripe/PayPal).",
        "Settimana 9-10: Prima campagna di crowdfunding per un micro-progetto specifico e tangibile.",
        "Settimana 11-12: Invio del primo report d'impatto cartaceo ed email a tutti i sostenitori iscritti."
      ]
    },
    industrial_agri: {
      product: "l'impianto produttivo / azienda agricola innovativa",
      client: "distributori, grossisti e partner commerciali",
      tech: "macchinari di precisione, automazione di processo e sensori IoT di monitoraggio",
      marketing: "fiere di settore, networking commerciale B2B e cataloghi tecnici digitali",
      revenue: "vendita all'ingrosso di lotti fisici o contratti di fornitura annuali",
      unit: "tonnellate / lotti / pezzi spediti",
      tam: 500000000,
      sam: 60000000,
      som: 4500000,
      buyerPersona: {
        avatar: "🚜",
        name: "Giuseppe Neri",
        demographics: "55 anni, Responsabile Acquisti GDO o Grande Distributore",
        pains: "Soffre per l'incoerenza della qualità della materia prima e i ritardi logistici stagionali.",
        gains: "Vuole contratti stabili a prezzo bloccato, forniture puntuali garantite e certificazioni di qualità.",
        channel: "Fiere agricole/industriali nazionali e portali B2B di settore"
      },
      marketingChannels: [
        { name: "Fiere di Settore & Networking B2B", share: 50, cac: 120 },
        { name: "Agenti di Commercio / Reti di Vendita", share: 25, cac: 80 },
        { name: "Direct Outreach Commerciale (Email & Telefono)", share: 15, cac: 30 },
        { name: "SEO & Presenza Web Industriale B2B", share: 10, cac: 15 }
      ],
      launchTimeline: [
        "Settimana 1-2: Redazione del piano di coltivazione/produzione e richiesta autorizzazioni sanitarie/ASL.",
        "Settimana 3-4: Setup del sito produttivo, acquisto o leasing dei macchinari e allacciamenti.",
        "Settimana 5-6: Test di produzione pilota (lotti campione) e analisi chimico-qualitative di laboratorio.",
        "Settimana 7-8: Invio di campioni gratuiti a 15-20 distributori o acquirenti target selezionati.",
        "Settimana 9-10: Firma dei primi contratti quadro di fornitura annuali a prezzo concordato.",
        "Settimana 11-12: Avvio della produzione a pieno regime e spedizione del primo lotto commerciale."
      ]
    },
    real_estate: {
      product: "il progetto immobiliare / valorizzazione residenziale",
      client: "acquirenti di case, conduttori o investitori di capitali",
      tech: "portali immobiliari (Idealista/Immobiliare), render 3D fotorealistici e software CRM",
      marketing: "annunci premium geolocalizzati, open house fisici e lead generation locale",
      revenue: "compravendita (capital gain), canone di locazione o subaffitto",
      unit: "immobili venduti / contratti di affitto firmati",
      tam: 800000000,
      sam: 120000000,
      som: 8000000,
      buyerPersona: {
        avatar: "🏠",
        name: "Filippo Rossi",
        demographics: "38 anni, Professionista sposato in cerca della prima casa stabile",
        pains: "Teme truffe, vizi occulti nell'immobile, ritardi infiniti nelle ristrutturazioni e costi occulti.",
        gains: "Cerca una casa pronta da vivere, efficiente dal punto di vista energetico e con pratiche edilizie in regola.",
        channel: "Portali immobiliari leader, cartelli in strada ed agenzie locali"
      },
      marketingChannels: [
        { name: "Portali Immobiliari Leader (Idealista/Immobiliare)", share: 50, cac: 150 },
        { name: "Social Ads Geolocalizzati & Video Tour", share: 20, cac: 60 },
        { name: "Insegne, Cartelli & Volantinaggio locale", share: 20, cac: 10 },
        { name: "Networking con Agenti Immobiliari Locali", share: 10, cac: 100 }
      ],
      launchTimeline: [
        "Settimana 1-2: Analisi di mercato locale, due diligence urbanistica e catastale sull'immobile target.",
        "Settimana 3-4: Acquisizione dell'immobile (proposta/compromesso) o firma dell'accordo di subaffitto.",
        "Settimana 5-6: Setup del progetto architettonico, computo metrico e avvio dei lavori di ristrutturazione/home staging.",
        "Settimana 7-8: Realizzazione di render 3D fotorealistici e pubblicazione degli annunci in anteprima.",
        "Settimana 9-10: Organizzazione del primo 'Open House' fisico per raccogliere proposte d'acquisto o affitto.",
        "Settimana 11-12: Selezione del conduttore referenziato o rogito notarile di vendita con incasso della plusvalenza."
      ]
    },
    media_content: {
      product: "il canale media / brand editoriale / podcast di settore",
      client: "ascoltatori, lettori, sponsor aziendali e abbonati",
      tech: "software di montaggio (Premiere/DaVinci), hosting podcast (Spotify) e newsletter proprietaria",
      marketing: "TikTok/YouTube Shorts organici, cross-promotion con altri creator e SEO editoriale",
      revenue: "sponsorizzazioni dirette, sponsorizzazione di newsletter, abbonamenti premium e AdSense",
      unit: "visualizzazioni / ascolti / iscritti",
      tam: 1000000000,
      sam: 100000000,
      som: 5000000,
      buyerPersona: {
        avatar: "🎙️",
        name: "Giulia Verdi",
        demographics: "25 anni, Professionista o Studente in cerca di intrattenimento/formazione rapida",
        pains: "Contenuti noiosi, ripetitivi, clickbait e realizzati con bassa qualità audio o video.",
        gains: "Cerca approfondimenti stimolanti, spiegazioni chiare di concetti complessi ed intrattenimento di qualità.",
        channel: "YouTube, Spotify, TikTok e consigli in community social"
      },
      marketingChannels: [
        { name: "YouTube Shorts / TikTok / Instagram Reels (Organico)", share: 50, cac: 0.5 },
        { name: "SEO di nicchia & Newsletter Outreach", share: 20, cac: 2 },
        { name: "Cross-Promotion & Ospitate in altri Show", share: 20, cac: 0 },
        { name: "Paid Ads di acquisizione iscritti (Lead magnet)", share: 10, cac: 5 }
      ],
      launchTimeline: [
        "Settimana 1-2: Definizione del posizionamento editoriale, tone of voice ed identità grafica del canale.",
        "Settimana 3-4: Scrittura, registrazione e montaggio dei primi 3 episodi pilota (video o audio).",
        "Settimana 5-6: Creazione del canale YouTube, pagina Spotify ed account social dedicati.",
        "Settimana 7-8: Pubblicazione simultanea dei primi 3 episodi e setup della newsletter proprietaria.",
        "Settimana 9-10: Lancio di una serie quotidiana di 15-20 clip brevi (Shorts/Reels) per attirare traffico organico.",
        "Settimana 11-12: Analisi delle metriche di retention e invio delle prime proposte di sponsorizzazione a brand partner."
      ]
    },
    general: {
      product: "la soluzione di business",
      client: "clienti target",
      tech: "landing page web e strumenti di produttività cloud",
      marketing: "passaparola, canali digitali e attività SEO locali",
      revenue: "transazioni dirette e vendite commerciali",
      unit: "clienti paganti acquisiti",
      tam: 100000000,
      sam: 15000000,
      som: 1200000,
      buyerPersona: {
        avatar: "👥",
        name: "Cliente Target Ideale",
        demographics: "30-50 anni, Residente locale o Utente web",
        pains: "Servizi complessi, mancanza di supporto immediato o prezzi opachi.",
        gains: "Desidera chiarezza d'uso, risparmio di tempo e una transazione sicura.",
        channel: "Ricerche su motori di ricerca, social media e passaparola"
      },
      marketingChannels: [
        { name: "Social Media Organic & Ads", share: 40, cac: 15 },
        { name: "SEO & Content Marketing", share: 30, cac: 10 },
        { name: "Referral & Passaparola", share: 20, cac: 2 },
        { name: "Outreach Diretto", share: 10, cac: 18 }
      ],
      launchTimeline: [
        "Settimana 1-2: Lancio del sito web pilota e raccolta contatti iniziale.",
        "Settimana 3-4: Test di usabilità con 5 utenti target e correzione dei flussi.",
        "Settimana 5-6: Funnel di acquisizione attivo e prime campagne pubblicitarie.",
        "Settimana 7-8: Lancio commerciale ufficiale e invio offerta di benvenuto.",
        "Settimana 9-10: Ottimizzazione del tasso di conversione delle pagine di checkout.",
        "Settimana 11-12: Raccolta delle prime video-testimonianze di clienti soddisfatti."
      ]
    }
  },


  // Classifica l'idea e i parametri immessi
  classifyProject(idea = "", budget = "", objective = "", previousAnswers = null) {
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
      text.includes("restaurant") || 
      text.includes("catering") || 
      text.includes("chef") || 
      text.includes("cucina") || 
      text.includes("pizz") || 
      (/\bbar\b/i.test(text) || text.includes("barista") || text.includes("baristi") || text.includes("bevande")) || 
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
    } else if (text.includes("no-profit") || text.includes("no profit") || text.includes("noprofit") || text.includes("associazione") || text.includes("associazioni") || text.includes("odv") || text.includes("aps") || text.includes("onlus") || text.includes("terzo settore") || text.includes("beneficenza") || text.includes("volontariato") || text.includes("donazione") || text.includes("donazioni") || text.includes("sociale")) {
      sector = "non_profit";
    } else if (text.includes("industria") || text.includes("industriale") || text.includes("fabbrica") || text.includes("agricolo") || text.includes("agricoltura") || text.includes("serra") || text.includes("idroponica") || text.includes("coltivazione") || text.includes("allevamento") || text.includes("trattore") || text.includes("trattori")) {
      sector = "industrial_agri";
    } else if (text.includes("immobiliare") || text.includes("immobili") || text.includes("casa") || text.includes("case") || text.includes("appartamento") || text.includes("appartamenti") || text.includes("ristrutturazione") || text.includes("ristrutturazioni") || text.includes("edilizia") || text.includes("edile") || text.includes("costruzione") || text.includes("subaffitto") || text.includes("rent-to-rent") || text.includes("compravendita")) {
      sector = "real_estate";
    } else if (text.includes("media") || text.includes("entertainment") || text.includes("contenuti") || text.includes("creatore") || text.includes("creator") || text.includes("youtube") || text.includes("podcast") || text.includes("spotify") || text.includes("video") || text.includes("audio") || text.includes("streaming") || text.includes("gaming") || text.includes("influencer") || text.includes("blog") || text.includes("newsletter")) {
      sector = "media_content";
    } else if (
      text.includes("consulenza") || text.includes("agenzia") || text.includes("servizi") || text.includes("freelance") || 
      text.includes("corso") || text.includes("corsi") || text.includes("formazione") ||
      // Noleggio, affitto, sharing (Rentals)
      text.includes("noleggio") || text.includes("noleggiare") || text.includes("nolo") || text.includes("affitto") || text.includes("affittare") || text.includes("sharing") ||
      // Logistica, trasporti e spedizioni (Logistics/Transport)
      text.includes("trasporto") || text.includes("trasporti") || text.includes("trasloco") || text.includes("traslochi") || text.includes("logistica") || text.includes("spedizion") ||
      // Manutenzione, riparazioni e servizi domestici (Maintenance/Support)
      text.includes("manutenzione") || text.includes("riparazione") || text.includes("riparare") || text.includes("pulizia") || text.includes("pulizie") || text.includes("assistenza") || text.includes("installazione") ||
      // Turismo, viaggi e ospitalità (Tourism/Hospitality)
      text.includes("turismo") || text.includes("turistico") || text.includes("guida") || text.includes("viaggio") || text.includes("viaggi") || text.includes("escursione") || text.includes("escursioni") || text.includes("hotel") || text.includes("b&b") ||
      // Eventi, intrattenimento e benessere (Events/Wellness)
      text.includes("evento") || text.includes("eventi") || text.includes("matrimonio") || text.includes("festa") || text.includes("feste") || text.includes("benessere") || text.includes("massaggio") || text.includes("massaggi") || text.includes("trattamento") || text.includes("trattamenti")
    ) {
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
    
    // Se non corrisponde ai preset ma l'utente ha specificato la località nel testo dell'idea (dal form)
    if (!location) {
      const locMatch = safeIdea.match(/località specificata:\s*([^\n\r]+)/i);
      if (locMatch && locMatch[1].trim()) {
        location = locMatch[1].trim();
      }
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
                        safeBudget.toLowerCase().includes("0€") || 
                        safeBudget.trim() === "0" || 
                        budgetAmount === 0;

    // Rileva opzione leasing/noleggio operativo
    let hasLeasingOption = false;
    const combinedText = (safeIdea + " " + safeBudget + " " + safeObjective).toLowerCase();
    if (combinedText.includes("leasing") || combinedText.includes("nolegg") || combinedText.includes("rent")) {
      hasLeasingOption = true;
    } else {
      const answers = previousAnswers || (window.state && window.state.answers) || {};
      for (let k in answers) {
        const val = String(answers[k] || "").toLowerCase();
        if (val.includes("leasing") || val.includes("nolegg") || val.includes("rent")) {
          hasLeasingOption = true;
          break;
        }
      }
    }

    // Estrae un nome temporaneo del progetto
    let name = "Nuovo Progetto";
    if (isVending && text.includes("pizz")) {
      name = "PizzaVending" + (location ? " " + location.split(" ")[0] : "");
    } else if (safeIdea.trim().length > 0) {
      let cleanIdea = safeIdea.replace(/vorrei creare|voglio creare|un'idea per|un servizio di|una piattaforma di|creare un|creare una/gi, "").trim();
      // Clean leading common Italian articles / prepositions / filler phrases
      cleanIdea = cleanIdea.replace(/^(a casa mia|a|da|in|su|per|un|uno|una|il|lo|la|i|gli|le|di|del|della|dello|dei|degli|delle)\s+/i, "").trim();
      const cleanWords = cleanIdea.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/).filter(w => w.length > 0);
      
      let wordsToUse = [];
      for (let i = 0; i < cleanWords.length && wordsToUse.length < 3; i++) {
        const w = cleanWords[i];
        if (i > 0 && (w.length <= 2 || ["con", "per", "del", "dal", "col", "sul", "tra", "fra"].includes(w.toLowerCase()))) {
          continue;
        }
        wordsToUse.push(w);
      }
      
      if (wordsToUse.length > 0) {
        const wordsFormatted = wordsToUse.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        name = wordsFormatted.join(" ") + (location ? " " + location.split(" ")[0] : "");
      } else {
        name = "Nuovo Progetto" + (location ? " " + location.split(" ")[0] : "");
      }
    }

    return { name, sector, target, location, budgetAmount, isVending, locationMissing: location === "", isBootstrap, hasLeasingOption };
  },

  // Genera dati finanziari per la fase 7 / tab finanziario
  generateFinancials(info, activeOption, overrides = {}) {
    let capexVal = 0;
    let opexVal = 0;
    let bepUnit = "Unità";
    let bepVal = 0;
    let rows = [];

    let priceVal = 100;
    let cogsVal = 20;
    
    // Rileva l'opzione da utilizzare
    let selectedOption = activeOption || (window.state && window.state.financialOption) || "acquisto";
    if (!activeOption && info.hasLeasingOption) {
      selectedOption = "leasing";
    }

    if (info.isVending && info.sector === "food_beverage") {
      // CASO DISTRIBUTORE AUTOMATICO DI PIZZA
      priceVal = overrides.price !== undefined ? overrides.price : 8.0;
      cogsVal = overrides.cogs !== undefined ? overrides.cogs : 2.4;
      const isCanarias = info.location && info.location.includes("Canarie");
      const shippingCost = isCanarias ? 3500 : 1800;
      const installCost = 1800;
      const practiceCost = 1200;
      
      const rentCost = overrides.rent !== undefined ? overrides.rent : 450;
      const electricityCost = overrides.electricity !== undefined ? overrides.electricity : 210;
      const otherOpex = 35 + 55 + 80 + 120; // Nayax, Assicurazione, Autónomo, Manutenzione = 290
      
      if (selectedOption === "leasing") {
        const leaseFee = overrides.leaseFee !== undefined ? overrides.leaseFee : 850;
        capexVal = 1500 + shippingCost + installCost + practiceCost;
        opexVal = rentCost + electricityCost + otherOpex + leaseFee;
        bepUnit = "Pizze Vendute / Mese";
        bepVal = Math.round(opexVal / (priceVal - cogsVal));
        
        rows = [
          { item: "Deposito Cauzionale & Startup fee Noleggio Operativo (Adial / Let's Pizza)", type: "CAPEX", cost: "1,500.00 €", source: "Contratto noleggio con riscatto 36 mesi" },
          { item: "Canone Mensile Noleggio Operativo Macchinario", type: "OPEX", cost: `${leaseFee.toFixed(2)} € / mese`, source: "Quota leasing finanziario / noleggio operativo europeo" },
          { item: "Trasporto, Dogana e Sdoganamento a " + (info.location || "destinazione"), type: "CAPEX", cost: `${shippingCost.toFixed(2)} €`, source: "Logistica mare/container + Sdoganamento IGIC Canarie e DUA" },
          { item: "Allacciamento elettrico trifase, aumento potenza (6kW picco) e SCIA", type: "CAPEX", cost: `${installCost.toFixed(2)} €`, source: "Lavori tecnici di attivazione e tasse locali" },
          { item: "Adempimenti sanitari HACCP, Certificati MOCA e Registro Sanitario", type: "CAPEX", cost: `${practiceCost.toFixed(2)} €`, source: "Consulenza biologo alimentare + Pratiche Asesoria" },
          { item: "Affitto spazio commerciale privato (suolo esterno o cortile)", type: "OPEX", cost: `${rentCost.toFixed(2)} € / mese`, source: "Benchmark contratti commerciali area turistica" },
          { item: "Consumo energia elettrica (forno pietra e cella frigo h24)", type: "OPEX", cost: `${electricityCost.toFixed(2)} € / mese`, source: "Consumi stimati tariffe industriali Spagna" },
          { item: "Altri OPEX fissi (Nayax SIM, Allianz RC, Autónomo Canarie, Manutenzione)", type: "OPEX", cost: `${otherOpex.toFixed(2)} € / mese`, source: "Costi amministrativi, di telemetria e assicurazione" }
        ];
      } else if (selectedOption === "jv") {
        const partnerShare = overrides.partnerShare !== undefined ? overrides.partnerShare : (priceVal * 0.3);
        capexVal = shippingCost + installCost + practiceCost + 3500;
        opexVal = rentCost + electricityCost + otherOpex;
        const finalCogs = cogsVal + partnerShare;
        bepUnit = "Pizze Vendute / Mese";
        bepVal = Math.round(opexVal / (priceVal - finalCogs));
        
        rows = [
          { item: "Quota CAPEX Logistica e Setup (Condivisa partner JV)", type: "CAPEX", cost: `${capexVal.toFixed(2)} €`, source: "Accordo JV: 50% costi allacciamento, trasporto Canarie e pratiche sanitarie" },
          { item: "Fornitura Macchinario (A carico del Partner JV)", type: "CAPEX", cost: "0.00 €", source: "Asset apportato interamente dal partner locale" },
          { item: `Revenue Share Partner (${((partnerShare/priceVal)*100).toFixed(0)}% su scontrino medio)`, type: "OPEX", cost: `${partnerShare.toFixed(2)} € / pizza`, source: "Accordo di ripartizione utili / royalties sul fatturato" },
          { item: "Affitto spazio commerciale privato (suolo esterno o locale)", type: "OPEX", cost: `${rentCost.toFixed(2)} € / mese`, source: "Spazio condiviso o co-locato con attività partner" },
          { item: "Consumo energia elettrica (forno pietra e cella frigo h24)", type: "OPEX", cost: `${electricityCost.toFixed(2)} € / mese`, source: "Tariffa industriale trifase Gran Canaria" },
          { item: "Altri OPEX fissi (Nayax SIM, Allianz RC, Autónomo Canarie, Manutenzione)", type: "OPEX", cost: `${otherOpex.toFixed(2)} € / mese`, source: "Costi amministrativi, di telemetria e assicurazione" }
        ];
        cogsVal = finalCogs;
      } else {
        // acquisto
        const machineCost = overrides.machineCost !== undefined ? overrides.machineCost : 48000;
        capexVal = machineCost + shippingCost + installCost + practiceCost;
        opexVal = rentCost + electricityCost + otherOpex;
        bepUnit = "Pizze Vendute / Mese";
        bepVal = Math.round(opexVal / (priceVal - cogsVal));
        
        rows = [
          { item: "Distributore Automatico Pizza Professionale (Nuovo forno pietra)", type: "CAPEX", cost: `${machineCost.toFixed(2)} €`, source: "Benchmark di mercato produttori UE 2026" },
          { item: "Trasporto, Dogana e Sdoganamento a " + (info.location || "destinazione"), type: "CAPEX", cost: `${shippingCost.toFixed(2)} €`, source: "Logistica mare/container + Sdoganamento IGIC Canarie e DUA" },
          { item: "Allacciamento elettrico trifase, aumento potenza (6kW picco) e SCIA", type: "CAPEX", cost: `${installCost.toFixed(2)} €`, source: "Lavori tecnici di attivazione, certificazione impianto e tasse" },
          { item: "Adempimenti sanitari HACCP, Certificati MOCA e Registro Sanitario", type: "CAPEX", cost: `${practiceCost.toFixed(2)} €`, source: "Consulenza biologo alimentare + Pratiche Asesoria" },
          { item: "Affitto spazio commerciale privato (suolo esterno o cortile)", type: "OPEX", cost: `${rentCost.toFixed(2)} € / mese`, source: "Benchmark contratti commerciali area turistica" },
          { item: "Consumo energia elettrica (forno pietra e cella frigo h24)", type: "OPEX", cost: `${electricityCost.toFixed(2)} € / mese`, source: "Consumi stimati tariffe industriali Spagna" },
          { item: "Altri OPEX fissi (Nayax SIM, Allianz RC, Autónomo Canarie, Manutenzione)", type: "OPEX", cost: `${otherOpex.toFixed(2)} € / mese`, source: "Costi amministrativi, di telemetria e assicurazione" }
        ];
      }
    } else if (info.sector === "saas" || info.sector === "mobile_app" || info.sector === "marketplace") {
      // CASO SAAS / MOBILE APP / MARKETPLACE
      priceVal = overrides.price !== undefined ? overrides.price : 29.0;
      cogsVal = overrides.cogs !== undefined ? overrides.cogs : 0.0;
      
      const hostingCost = overrides.rent !== undefined ? overrides.rent : 45;
      const toolsCost = overrides.electricity !== undefined ? overrides.electricity : 35;
      const legalCost = 600;
      
      if (selectedOption === "leasing") {
        capexVal = 800;
        opexVal = hostingCost + toolsCost + 170;
        bepUnit = "Abbonati SaaS / Mese";
        bepVal = Math.round(opexVal / (priceVal - cogsVal));
        rows = [
          { item: "Setup Template No-Code & Dominio (Carrd/Bubble)", type: "CAPEX", cost: "800.00 €", source: "Template e configurazione iniziale" },
          { item: "Consulenza Legale Privacy GDPR Base (Iubenda)", type: "CAPEX", cost: "400.00 €", source: "Compliance automatica" },
          { item: "Abbonamento Piattaforma No-Code (Bubble/Webflow Enterprise)", type: "OPEX", cost: `${(hostingCost + 105).toFixed(2)} € / mese`, source: "Hosting, CMS e Database server cloud" },
          { item: "Abbonamento Automazioni Make/Zapier e Tool di Marketing", type: "OPEX", cost: `${(toolsCost + 65).toFixed(2)} € / mese`, source: "Sincronizzazione dati e notifiche automatiche" }
        ];
      } else if (selectedOption === "jv") {
        const partnerShare = overrides.partnerShare !== undefined ? overrides.partnerShare : (priceVal * 0.35);
        capexVal = legalCost;
        opexVal = hostingCost + toolsCost;
        const finalCogs = cogsVal + partnerShare;
        bepUnit = "Abbonati SaaS / Mese";
        bepVal = Math.round(opexVal / (priceVal - finalCogs));
        rows = [
          { item: "Setup Legale Societario & Patti Parasociali (Assegnazione Equity)", type: "CAPEX", cost: `${legalCost.toFixed(2)} €`, source: "Studio CLO partner e spese notarili" },
          { item: "Sviluppo Tecnologico ed Evolution (CTO Co-Founder)", type: "CAPEX", cost: "0.00 €", source: "Apporto d'opera del socio tecnologico in cambio di equity" },
          { item: `Revenue Share Partner Tecnologico (${((partnerShare/priceVal)*100).toFixed(0)}% su scontrino)`, type: "OPEX", cost: `${partnerShare.toFixed(2)} € / abbonamento`, source: "Ripartizione o royalties concordate da patto parasociale" },
          { item: "Database & Hosting Cloud (Firebase/Supabase)", type: "OPEX", cost: `${hostingCost.toFixed(2)} € / mese`, source: "Infrastruttura tecnica" },
          { item: "Piattaforma di Automazione (Make.com/Zapier)", type: "OPEX", cost: `${toolsCost.toFixed(2)} € / mese`, source: "Sincronizzazione API e Webhook" }
        ];
        cogsVal = finalCogs;
      } else {
        capexVal = 4400 + legalCost;
        opexVal = hostingCost + toolsCost;
        bepUnit = "Abbonati SaaS / Mese";
        bepVal = Math.round(opexVal / (priceVal - cogsVal));
        rows = [
          { item: "Sviluppo Iniziale MVP (In-House / Sviluppatori)", type: "CAPEX", cost: "4,400.00 €", source: "Sviluppo frontend/backend ed integrazione database" },
          { item: "Consulenza Legale Privacy GDPR e Termini d'Uso", type: "CAPEX", cost: `${legalCost.toFixed(2)} €`, source: "Compliance CLO ed informativa contratti" },
          { item: "Database & Hosting Cloud (Firebase/Supabase)", type: "OPEX", cost: `${hostingCost.toFixed(2)} € / mese`, source: "Infrastruttura tecnica" },
          { item: "Piattaforma di Automazione (Make.com/Zapier)", type: "OPEX", cost: `${toolsCost.toFixed(2)} € / mese`, source: "Sincronizzazione API e Webhook" }
        ];
      }
    } else if (info.sector === "ecommerce" || info.sector === "retail") {
      // CASO E-COMMERCE / RETAIL
      priceVal = overrides.price !== undefined ? overrides.price : 30.0;
      cogsVal = overrides.cogs !== undefined ? overrides.cogs : 10.0;
      
      const storageCost = overrides.rent !== undefined ? overrides.rent : 150;
      const shippingCost = overrides.electricity !== undefined ? overrides.electricity : 6.8;
      
      if (selectedOption === "leasing") {
        cogsVal = overrides.cogs !== undefined ? overrides.cogs : 18.0;
        capexVal = 1500;
        opexVal = storageCost + 450;
        bepUnit = "Ordini E-commerce / Mese";
        bepVal = Math.round(opexVal / (priceVal - cogsVal));
        rows = [
          { item: "Budget Advertising Iniziale (Meta/TikTok Ads)", type: "CAPEX", cost: "1,100.00 €", source: "Validazione e acquisizione traffico profilato" },
          { item: "Sito Web Shopify & GDPR (Setup e integrazione)", type: "CAPEX", cost: "400.00 €", source: "Temi e compliance legale" },
          { item: "Advertising Continuo (Meta / TikTok Ads)", type: "OPEX", cost: "450.00 € / mese", source: "Budget quotidiano per mantenimento vendite" },
          { item: "Sito Web E-commerce (Shopify SaaS + App Sourcing)", type: "OPEX", cost: `${storageCost.toFixed(2)} € / mese`, source: "Canone Shopify e automazioni importazione" },
          { item: "Costo Logistica e Spedizione (Fulfillment)", type: "OPEX", cost: `${shippingCost.toFixed(2)} € / ordine`, source: "Tariffa logistica dropshipping" }
        ];
      } else if (selectedOption === "jv") {
        const partnerShare = overrides.partnerShare !== undefined ? overrides.partnerShare : (priceVal * 0.4);
        capexVal = 2000;
        opexVal = storageCost + 100;
        const finalCogs = cogsVal + partnerShare;
        bepUnit = "Ordini E-commerce / Mese";
        bepVal = Math.round(opexVal / (priceVal - finalCogs));
        rows = [
          { item: "Setup Contrattualistica, Logistica e Spedizione (Condivisa)", type: "CAPEX", cost: "1,600.00 €", source: "Allineamento logistico e contratti legali" },
          { item: "Consulenza Legale GDPR e Marchi", type: "CAPEX", cost: "400.00 €", source: "Compliance CLO" },
          { item: `Revenue Share Partner Brand (${((partnerShare/priceVal)*100).toFixed(0)}% su scontrino)`, type: "OPEX", cost: `${partnerShare.toFixed(2)} € / ordine`, source: "Accordo di conto vendita e fornitura condivisa" },
          { item: "Sito Web E-commerce (Shopify SaaS)", type: "OPEX", cost: `${storageCost.toFixed(2)} € / mese`, source: "Canone Shopify" },
          { item: "Costo Logistica e Spedizione (Fulfillment)", type: "OPEX", cost: `${shippingCost.toFixed(2)} € / ordine`, source: "Tariffa di spedizione locale" }
        ];
        cogsVal = finalCogs;
      } else {
        capexVal = 10000;
        opexVal = storageCost + 200;
        bepUnit = "Ordini E-commerce / Mese";
        bepVal = Math.round(opexVal / (priceVal - cogsVal));
        rows = [
          { item: "Primo Lotto Minimo di Merce (MOQ)", type: "CAPEX", cost: "8,000.00 €", source: "Acquisto stock all'ingrosso da fornitore" },
          { item: "Sito Web Shopify & GDPR (Setup e integrazione)", type: "CAPEX", cost: "2,000.00 €", source: "Configurazione e lancio" },
          { item: "Sito Web E-commerce (Shopify SaaS + App)", type: "OPEX", cost: `${storageCost.toFixed(2)} € / mese`, source: "Canone Shopify" },
          { item: "Costo Logistica e Spedizione (Fulfillment)", type: "OPEX", cost: `${shippingCost.toFixed(2)} € / ordine`, source: "Tariffa logistica e packaging di spedizione" }
        ];
      }
    } else if (info.sector === "food_beverage") {
      // CASO FOOD & BEVERAGE NON-VENDING (Home Restaurant, Catering, ecc.)
      priceVal = overrides.price !== undefined ? overrides.price : 75.0; // Stima ricavo medio per ospite/evento
      cogsVal = overrides.cogs !== undefined ? overrides.cogs : 22.0; // Stima costo ingredienti/coperto per ospite
      
      const rentOrVenueCost = overrides.rent !== undefined ? overrides.rent : 450.0; // Spese fisse casa/location/mutuo
      const marketingCost = overrides.electricity !== undefined ? overrides.electricity : 150.0; // Marketing e promo
      const utilitiesAndAdmin = 100.0; // Utenze addizionali e pratiche igieniche
      
      capexVal = 2000; // Setup iniziale
      opexVal = rentOrVenueCost + marketingCost + utilitiesAndAdmin;
      bepUnit = "Ospiti / Coperti al Mese";
      bepVal = Math.round(opexVal / (priceVal - cogsVal));
      
      // Personalizzazione etichetta della location se impostato un costo fisso alto o legato a spese mutuo/casa
      const venueLabel = rentOrVenueCost >= 1000 
        ? "Spese Fisse Location/Casa (Mutuo, Condominio e Utenze dichiarate)" 
        : "Spese Fisse di Esercizio Location / Affitto / Spazio eventi";
      
      rows = [
        { item: "Attrezzature cucina, stoviglie e setup HACCP/SCIA", type: "CAPEX", cost: "2,000.00 €", source: "Adeguamento utensili e conformità igienica preliminare" },
        { item: venueLabel, type: "OPEX", cost: `${rentOrVenueCost.toFixed(2)} € / mese`, source: "Quota di costi fissi della location da coprire mensilmente" },
        { item: "Lead Generation, Instagram Ads & Promozione Eventi", type: "OPEX", cost: `${marketingCost.toFixed(2)} € / mese`, source: "Campagne geo-localizzate su social per riempire le serate" },
        { item: "Utenze incrementali, assicurazione RC terzi e software prenotazioni", type: "OPEX", cost: `${utilitiesAndAdmin.toFixed(2)} € / mese`, source: "Consumi stimati e strumenti digitali di segreteria" }
      ];
    } else {
      // CASO SERVIZI / GENERAL
      priceVal = overrides.price !== undefined ? overrides.price : 100.0;
      cogsVal = overrides.cogs !== undefined ? overrides.cogs : 20.0;
      
      const softwareCost = overrides.rent !== undefined ? overrides.rent : 30;
      const marketingCost = overrides.electricity !== undefined ? overrides.electricity : 200;
      
      if (selectedOption === "leasing") {
        capexVal = 500;
        opexVal = softwareCost + marketingCost;
        bepUnit = "Clienti Attivi / Mese";
        bepVal = Math.round(opexVal / (priceVal - cogsVal));
        rows = [
          { item: "Setup Landing Page & Portfolio", type: "CAPEX", cost: "500.00 €", source: "Configurazione sito e template" },
          { item: "Lead Generation & Campagne Marketing (LinkedIn/Google)", type: "OPEX", cost: `${marketingCost.toFixed(2)} € / mese`, source: "Acquisizione clienti attivi" },
          { item: "CRM, Software di Gestione ed Email", type: "OPEX", cost: `${softwareCost.toFixed(2)} € / mese`, source: "Strumenti operativi" }
        ];
      } else if (selectedOption === "jv") {
        const partnerShare = overrides.partnerShare !== undefined ? overrides.partnerShare : (priceVal * 0.3);
        capexVal = 1000;
        opexVal = softwareCost + 100;
        const finalCogs = cogsVal + partnerShare;
        bepUnit = "Clienti Attivi / Mese";
        bepVal = Math.round(opexVal / (priceVal - finalCogs));
        rows = [
          { item: "Setup Patti Parasociali & Contratti Partnership", type: "CAPEX", cost: "1,000.00 €", source: "Notaio e consulenza legale" },
          { item: `Revenue Share Partner (${((partnerShare/priceVal)*100).toFixed(0)}% su scontrino)`, type: "OPEX", cost: `${partnerShare.toFixed(2)} € / cliente`, source: "Accordo di canalizzazione ed intermediazione" },
          { item: "CRM, Software di Gestione ed Email", type: "OPEX", cost: `${softwareCost.toFixed(2)} € / mese`, source: "Strumenti operativi" }
        ];
        cogsVal = finalCogs;
      } else {
        capexVal = 2500;
        opexVal = softwareCost + marketingCost;
        bepUnit = "Clienti Attivi / Mese";
        bepVal = Math.round(opexVal / (priceVal - cogsVal));
        rows = [
          { item: "Setup Agenzia, Branding e Web Presenza", type: "CAPEX", cost: "2,500.00 €", source: "Sviluppo identità societaria" },
          { item: "Lead Generation & Campagne Marketing (LinkedIn/Google)", type: "OPEX", cost: `${marketingCost.toFixed(2)} € / mese`, source: "Acquisizione clienti" },
          { item: "CRM, Software di Gestione ed Email", type: "OPEX", cost: `${softwareCost.toFixed(2)} € / mese`, source: "Strumenti operativi" }
        ];
      }
    }

    // Calcolo target volume operativo mensile per stima guadagni steady state
    let targetVolumeNum = 100;
    let targetVolumeUnit = "Unità";
    
    if (info.isVending && info.sector === "food_beverage") {
      targetVolumeNum = 600;
      targetVolumeUnit = "Pizze";
    } else if (info.sector === "saas" || info.sector === "mobile_app" || info.sector === "marketplace") {
      targetVolumeNum = 150;
      targetVolumeUnit = "Abbonati";
    } else if (info.sector === "ecommerce" || info.sector === "retail") {
      targetVolumeNum = 300;
      targetVolumeUnit = "Ordini";
    } else if (info.sector === "food_beverage") {
      targetVolumeNum = 80;
      targetVolumeUnit = "Ospiti/Coperti";
    } else if (info.sector === "services") {
      targetVolumeNum = 10;
      targetVolumeUnit = "Clienti";
    } else {
      targetVolumeNum = 50;
      targetVolumeUnit = "Unità";
    }

    const marginVal = priceVal - cogsVal;
    
    const revenueMonthVal = targetVolumeNum * priceVal;
    const revenueWeekVal = revenueMonthVal / 4.28;
    const revenueDayVal = revenueMonthVal / 30;
    
    const profitMonthVal = (targetVolumeNum * marginVal) - opexVal;
    const profitWeekVal = profitMonthVal / 4.28;
    const profitDayVal = profitMonthVal / 30;

    const formatCurrency = (val) => {
      return val.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
    };

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
      rows: rows,
      
      targetVolumeNum: targetVolumeNum,
      targetVolumeUnit: targetVolumeUnit,
      marginNum: marginVal,
      priceFormatted: formatCurrency(priceVal),
      cogsFormatted: formatCurrency(cogsVal),
      marginFormatted: formatCurrency(marginVal),
      
      revenueDay: formatCurrency(revenueDayVal),
      revenueWeek: formatCurrency(revenueWeekVal),
      revenueMonth: formatCurrency(revenueMonthVal),
      
      profitDay: formatCurrency(profitDayVal),
      profitWeek: formatCurrency(profitWeekVal),
      profitMonth: formatCurrency(profitMonthVal)
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

    const overrides = (window.state && window.state.financialOverrides) || {};
    const selectedOption = info.financialOption || (info.hasLeasingOption ? "leasing" : "acquisto");
    const fin = this.generateFinancials(info, selectedOption, overrides);
    
    // Default fallback values for general texts
    const priceVal = overrides.price !== undefined ? overrides.price : (info.sector === "services" ? 100.0 : 30.0);
    const cogsVal = overrides.cogs !== undefined ? overrides.cogs : (info.sector === "services" ? 20.0 : 8.0);
    const hostingCost = overrides.rent !== undefined ? overrides.rent : (info.sector === "food_beverage" ? 450.0 : 45.0);
    const toolsCost = overrides.electricity !== undefined ? overrides.electricity : (info.sector === "food_beverage" ? 300.0 : 35.0);

    const sect = LocalAgentSimulationEngine.sectorKeywords[info.sector] || LocalAgentSimulationEngine.sectorKeywords.general;

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
        1: `- **Validazione e Posizionamento**: La strategia migliore per validare ${sect.product} ${targetLoc} consiste nel focalizzarsi su una nicchia di mercato specifica e testare la risposta reale tramite una landing page pilota strutturata per raccogliere i primi contatti (lead/iscritti) prima di spendere budget di sviluppo.`,
        2: `- **Studio Target e Competitor**: Analisi del comportamento d'acquisto. Consigliamo di mappare le soluzioni manuali dei competitor e differenziarsi posizionandosi con un'offerta focalizzata su ${sect.revenue}, evidenziando il vantaggio competitivo (risparmio o qualità).`,
        3: `- **Strategia di Lancio (GTM)**: Per lanciare con successo il brand sul mercato, la strategia ottimale prevede l'uso combinato di **${sect.marketing}** e Local Marketing se fisico. Raccomandiamo di concentrare il budget di lancio su campagne geolocalizzate con una 'promozione lancio' esclusiva per superare l'inerzia d'acquisto.`,
        4: `- **Strategia di Crescita & Acquisizione**: Strutturazione di un loop di passaparola incentivato (Referral Program o sconti sul secondo acquisto) abbinato a campagne di outreach organico per abbattere il Costo di Acquisizione Cliente (CAC) e favorire la viralità.`,
        5: `- **Fiducia & Posizionamento**: Costruzione della credibilità tramite recensioni pubbliche dei primi utenti, certificazioni di qualità e policy di rimborso trasparente. La trasparenza è l'arma strategica chiave contro competitor più grandi.`,
        6: `- **Ottimizzazione Conversione**: Monitoraggio continuo del tasso di conversione (CR) sul sito/punto vendita. Consigliamo di implementare A/B test sulle headline di vendita per massimizzare la conversione di ogni singolo lead acquisito.`,
        7: `- **Pianificazione Budget Marketing**: Allocazione strategica della spesa focalizzata al 75% sui canali a conversione immediata (Ads dirette/Local SEO) e 25% su branding/retargeting per mantenere il CAC inferiore al 30% del valore del cliente.`,
        8: `- **Piano Marketing Integrato**: Focus strategico sull'acquisizione clienti tramite **${sect.marketing}**, referral organico ed ottimizzazione costante del conversion rate per garantire redditività ed una crescita scalabile.`
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
        1: `- **MOQ e Fornitori SaaS**: Selezione di fornitori tecnologici e cloud. MOQ (Lotto Minimo) fissato a zero sfruttando abbonamenti SaaS flessibili mensili.
- **Strumenti e Software**: Canoni mensili di abbonamento per i tool operativi:
  - Hosting e Database: **${hostingCost.toFixed(2)} € / mese** (Bubble/Supabase).
  - Automazione e CRM: **${toolsCost.toFixed(2)} € / mese** (Make/HubSpot).
  - Strumenti di produttività: **15.00 € / mese** (Email professionali, dominio).`,
        2: `- **Logistica e Consegne**: Ottimizzazione della catena di fornitura. Per prodotti digitali: canali cloud CDN veloci. Per prodotti fisici: contratti B2B flat con spedizionieri nazionali (stima **6.50 € per consegna**).`,
        3: `- **Fornitori di Backup**: Identificazione di partner cloud alternativi (es. trasloco database da Supabase a PostgreSQL Firebase in caso di disservizio).`,
        4: `- **Negoziazione Tariffe**: Trattativa per sconti volume sui servizi cloud o sconti del 15% sul costo delle materie prime al superamento di 500 ordini/mese.`,
        5: `- **Approvvigionamento e Cassa**: Setup degli account di fatturazione e pagamenti per i software terzi per tracciare i consumi al centesimo.`,
        6: `- **Ottimizzazione delle Forniture**: Riduzione dei costi operativi unitari delle licenze SaaS o dei materiali di consumo all'aumentare dei volumi.`,
        7: `- **Gestione Scorte e Logistica**: Definizione del magazzino minimo (safety stock) pari a 15 giorni di vendite medie per evitare stock-out (se fisico).`,
        8: `- **Supply Chain Pronto**: Contratti e accordi con tutti i fornitori tecnologici e logistici, listino prezzi bloccato e canali logistici pronti.`
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

    if (isPizzaVending) {
      // Obiezioni specifiche per agente (Pizza Vending)
      if (agentKey === "cmo") {
        objections = [
          "**Scetticismo del Consumatore**: C'è una barriera culturale forte nell'acquistare cibo caldo (specialmente pizza) da un distributore automatico, spesso percepito come di bassa qualità.",
          "**Dipendenza Totale dalla Location**: Se il posizionamento fisico non ha un passaggio pedonale continuo h24 (specialmente notturno), la macchina rimarrà inutilizzata.",
          "**Vandalismo e Visibilità**: I punti ad alto traffico notturno sono esposti ad atti vandalici o sporcizia che allontanano la clientela."
        ];
        verdictReason = "Il posizionamento richiede una validazione preventiva e un wrapping visivo di altissimo livello per superare la diffidenza iniziale.";
      } else if (agentKey === "cfo") {
        const selectedOption = info.financialOption || (info.hasLeasingOption ? "leasing" : "acquisto");
        if (info.isBootstrap && selectedOption === "acquisto") {
          objections = [
            "**Fabbisogno Capitale in Bootstrap**: L'acquisto o investimento diretto entra in conflitto con il budget indicato di 0€. Dobbiamo identificare una soluzione alternativa per coprire o azzerare questa spesa iniziale.",
            "**Stima del Capitale Circolante**: Sono comunque necessari dei fondi minimi mensili per coprire i costi operativi ricorrenti (OPEX) prima di generare cassa.",
            "**Tempo di Rientro**: Senza dilazioni o finanziamenti, il rischio finanziario è bloccante nei primi 3 mesi in regime di cassa zero."
          ];
          verdict = "IN VALUTAZIONE (Alternative Richieste)";
          verdictReason = "Il budget a zero non consente l'acquisto o setup diretto proprietario. Proponiamo di valutare insieme le opzioni di leasing/noleggio operativo, Joint Venture con partner locali, o finanziamenti esterni per trovare la soluzione ottimale.";
        } else if (selectedOption === "leasing") {
          objections = [
            "**Pianificazione del Canone Mensile**: L'adozione del noleggio operativo o canone software/leasing converte il CAPEX in un costo operativo mensile (OPEX). Questo aumenta il BEP mensile in quanto il canone si somma agli altri OPEX fissi.",
            "**Deposito Cauzionale / Setup**: Sebbene il CAPEX sia abbattuto, sarà necessario un deposito cauzionale iniziale o costo di setup per l'attivazione del contratto.",
            "**Rischio Penali e Durata**: I contratti operativi/leasing solitamente hanno vincoli di durata (12-36 mesi) con penali per recesso anticipato."
          ];
          verdict = "APPROVATO (Con noleggio/leasing)";
          verdictReason = "L'opzione del leasing o abbonamento operativo riduce drasticamente il CAPEX iniziale, rendendo il progetto avviabile con un budget minimo, purché si garantisca la copertura degli OPEX fin dal primo mese.";
        } else if (selectedOption === "jv") {
          objections = [
            "**Frazionamento delle Decisioni**: Una Joint Venture richiede patti parasociali precisi per evitare stalli decisionali con il partner.",
            "**Margine Ridotto (Revenue Share)**: Cedere una percentuale sulle vendite (es. 30%-40%) aumenta i costi variabili unitari (COGS), riducendo il margine unitario di contribuzione.",
            "**Allineamento degli Obiettivi**: Bisogna allineare gli obiettivi a lungo termine del partner (es. socio finanziario o brand partner) con i nostri."
          ];
          verdict = "APPROVATO (In Joint Venture)";
          verdictReason = "La formula della Joint Venture abbatte l'investimento iniziale e il rischio operativo tramite condivisione delle risorse, dividendo i profitti ma tutelando il flusso di cassa in regime di bootstrap.";
        } else {
          objections = [
            "**Aumento Costo Setup**: I costi correnti per avviare il setup proprietario completo richiedono capitale interamente coperto al giorno zero.",
            "**Costi Fissi e Gestione**: I costi fissi mensili devono essere monitorati attentamente per non erodere i margini nei primi mesi.",
            "**Margine su Ingredienti/Forniture**: Il margine si contrae se non si ottiene un prezzo all'ingrosso competitivo sulle forniture e sul packaging."
          ];
          verdict = "APPROVATO";
          verdictReason = "I margini unitari supportano l'investimento se il volume minimo stimato di break-even viene mantenuto e il capitale iniziale è coperto.";
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
          "**Assicurazione RC obbligatoria**: I rischio di intossicazione alimentare o danni fisici da erogatore caldo richiede coperture assicurative elevate."
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
    } else {
      // Obiezioni specifiche per settore per gli altri progetti
      if (agentKey === "cfo") {
        const selectedOption = info.financialOption || (info.hasLeasingOption ? "leasing" : "acquisto");
        if (info.isBootstrap && selectedOption === "acquisto") {
          objections = [
            "**Fabbisogno Capitale in Bootstrap**: L'acquisto o investimento diretto entra in conflitto con il budget indicato di 0€. Dobbiamo identificare una soluzione alternativa per coprire o azzerare questa spesa iniziale.",
            "**Stima del Capitale Circolante**: Sono comunque necessari dei fondi minimi mensili per coprire i costi operativi ricorrenti (OPEX) prima di generare cassa.",
            "**Tempo di Rientro**: Senza dilazioni o finanziamenti, il rischio finanziario è bloccante nei primi 3 mesi in regime di cassa zero."
          ];
          verdict = "IN VALUTAZIONE (Alternative Richieste)";
          verdictReason = "Il budget a zero non consente l'acquisto o setup diretto proprietario. Proponiamo di valutare insieme le opzioni di leasing/noleggio operativo, Joint Venture con partner locali, o finanziamenti esterni per trovare la soluzione ottimale.";
        } else if (selectedOption === "leasing") {
          objections = [
            "**Pianificazione del Canone Mensile**: L'adozione del noleggio operativo o canone software/leasing converte il CAPEX in un costo operativo mensile (OPEX). Questo aumenta le spese fisse mensili in quanto il canone si somma agli altri OPEX.",
            "**Deposito Cauzionale / Setup**: Sebbene il CAPEX sia abbattuto, sarà necessario un deposito cauzionale iniziale o costo di setup per l'attivazione del contratto.",
            "**Rischio Penali e Durata**: I contratti operativi/leasing solitamente hanno vincoli di durata (12-36 mesi) con penali per recesso anticipato."
          ];
          verdict = "APPROVATO (Con noleggio/leasing)";
          verdictReason = "L'opzione del leasing o abbonamento operativo riduce drasticamente il CAPEX iniziale, rendendo il progetto avviabile con un budget minimo, purché si garantisca la copertura degli OPEX fin dal primo mese.";
        } else if (selectedOption === "jv") {
          objections = [
            "**Frazionamento delle Decisioni**: Una Joint Venture richiede patti parasociali precisi per evitare stalli decisionali con il partner.",
            "**Margine Ridotto (Revenue Share)**: Cedere una percentuale sulle vendite (es. 30%-40%) aumenta i costi variabili unitari (COGS), riducendo il margine unitario di contribuzione.",
            "**Allineamento degli Obiettivi**: Bisogna allineare gli obiettivi a lungo termine del partner (es. socio finanziario o brand partner) con i nostri."
          ];
          verdict = "APPROVATO (In Joint Venture)";
          verdictReason = "La formula della Joint Venture abbatte l'investimento iniziale e il rischio operativo tramite condivisione delle risorse, dividendo i profitti ma tutelando il flusso di cassa in regime di bootstrap.";
        } else {
          objections = [
            "**Aumento Costo Setup**: I costi correnti per avviare il setup proprietario completo richiedono capitale interamente coperto al giorno zero.",
            "**Costi Fissi e Gestione**: I costi fissi mensili devono essere monitorati attentamente per non erodere i margini nei primi mesi.",
            "**Margine di Vendita**: Il margine si contrae se non si ottengono condizioni d'acquisto o di licenza competitive con i fornitori chiave."
          ];
          verdict = "APPROVATO";
          verdictReason = "I margini unitari supportano l'investimento se il volume minimo stimato di break-even viene mantenuto e il capitale iniziale è coperto.";
        }
      } else if (agentKey === "clo") {
        const loc = (info.location || "").toLowerCase();
        if (loc.includes("canari") || loc.includes("gran canaria") || loc.includes("tenerife") || loc.includes("spagna")) {
          objections = [
            "**Burocrazia Spagnola (SCIA/Comunicación Previa)**: Presentare la Comunicación Previa de Actividad presso il Municipio (Ayuntamiento) richiede progetti firmati da tecnici abilitati e tempi di elaborazione variabili.",
            "**Inquadramento Autónomo/Fiscale**: Obbligo di iscrizione al RETA (Régimen Especial de Trabajadores Autónomos) con pagamento mensile fisso e gestione trimestrale dell'IGIC (7% locale) e IRPF.",
            "**Registro Sanitario (per alimentari)**: Se il progetto tratta alimentari, l'iscrizione al Registro Sanitario canario richiede controlli in loco e autorizzazioni sanitarie preventive."
          ];
          verdictReason = "È fondamentale nominare un Asesor fiscale/legale in loco a Gran Canaria/Tenerife e richiedere la licenza d'apertura su locali ad uso commerciale conforme.";
        } else if (loc.includes("rimini") || loc.includes("milano") || loc.includes("roma") || loc.includes("bologna") || loc.includes("garda") || loc.includes("ital")) {
          objections = [
            "**SCIA Comunale ed Edilizia (SUAP)**: Presentazione obbligatoria del modello SCIA commerciale via portale impresainungiorno.it, con allegato il progetto di destinazione d'uso e conformità degli impianti.",
            "**Inquadramento Previdenziale e Camerale**: Costi fissi elevati fin dal giorno zero: iscrizione alla Camera di Commercio, gestione INPS Commercianti/Artigiani (~4.200€/anno fissi a prescindere dal fatturato).",
            "**Normative Sanitarie Locali (HACCP/ASL)**: Se c'è manipolazione o somministrazione di cibo, i locali (anche domestici come home restaurant) devono rispettare i requisiti igienici e dotarsi di manuale HACCP."
          ];
          verdictReason = "Consigliamo di verificare la destinazione d'uso catastale del locale ed interpellare un commercialista per valutare il regime forfettario o l'avvio come SRL Innovativa.";
        } else if (loc.includes("usa") || loc.includes("america") || loc.includes("stati uniti")) {
          objections = [
            "**Registrazione Statale LLC/C-Corp**: Scelta dello Stato (es. Delaware o Wyoming per tasse, o Stato di residenza) e conformità con il Registered Agent locale.",
            "**Licenze Commerciali Locali (Business Licenses)**: Molte città e contee richiedono permessi locali d'esercizio e la registrazione per la Sales Tax statale.",
            "**GDPR / CCPA Compliance**: Le normative sulla privacy dei dati (como la CCPA in California) impongono obblighi rigidi sui dati dei residenti statunitensi."
          ];
          verdictReason = "Raccomandiamo la costituzione di una LLC a Wyoming o Delaware tramite servizi online (es. Stripe Atlas) e l'acquisizione di una polizza assicurativa di responsabilità civile (General Liability).";
        } else {
          objections = [
            "**Mancanza di Localizzazione Giuridica**: Senza una zona geografica definita, non è possibile mappare le licenze commerciali, la tassazione locale ed i requisiti amministrativi obbligatori.",
            "**Rischi di Compliance Normativa**: Qualsiasi attività commerciale richiede adempimenti minimi (dichiarazione dei redditi, registrazione d'impresa, tutele contrattuali).",
            "**Trattamento Dati e Privacy**: Obbligo di conformarsi alle leggi internazionali sulla protezione dei dati in base alla residenza degli utenti."
          ];
          verdictReason = "Devi specificare una località precisa nel form (città, regione o nazione) per consentire al CLO di analizzare le normative locali e la fattibilità burocratica.";
        }
      } else {
        const spec = (LocalAgentSimulationEngine.sectorSpecifications[info.sector] && LocalAgentSimulationEngine.sectorSpecifications[info.sector][agentKey]) || 
                     (LocalAgentSimulationEngine.sectorSpecifications.general[agentKey]);
        if (spec) {
          objections = spec.objections;
          verdictReason = spec.verdictReason;
        } else {
          objections = [
            `**Sfida Operativa (${agentKey.toUpperCase()})**: La validazione richiede il monitoraggio attento delle scorte e dei flussi di lavoro.`,
            `**Competitività di Settore**: Necessità di differenziare la proposta di valore per attirare e fidelizzare il target.`
          ];
          verdictReason = "Consigliamo di avviare il test pilota per analizzare i comportamenti iniziali degli utenti sul campo.";
        }
      }
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

    // Mostriamo la strada migliore / alternativa
    reportText += `#### 🧭 Alternativa Strategica & Strada Migliore (Pivot)\n`;
    reportText += `> [!TIP]\n`;
    reportText += `> **Consiglio del Team**: Per superare le obiezioni sollevate, la strada migliore da percorrere è:\n`;
    reportText += `> ${verdictReason}\n\n`;

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
      if (info.hasLeasingOption) {
        reportText += `> **Opzione Leasing/Noleggio Attivata**: Abbiamo recepito la tua proposta di noleggio operativo o leasing per superare il vincolo del capitale iniziale in bootstrap. Il piano è stato rimodulato di conseguenza.\n\n`;
      } else {
        reportText += `> **Conflitto Budget/CAPEX**: Il budget 'Bootstrap/0€' non consente l'acquisto diretto del macchinario (€55.000).\n\n`;
      }
      reportText += `Ecco come puoi procedere senza disporre dei capitali iniziali:\n`;
      reportText += `- **Noleggio Operativo / Leasing**: Molti produttori o distributori offrono formule di noleggio a lungo termine con riscatto, riducendo il CAPEX iniziale a un deposito cauzionale di circa 1.000€ e una quota mensile (OPEX).\n`;
      reportText += `- **Macchinario Usato Rigenerato**: Ricerca di modelli precedenti sul mercato dell'usato spagnolo (MilAnuncios / Wallapop) con prezzi inferiori del 50% (€15.000 - €18.000).\n`;
      reportText += `- **Joint Venture con Locali Esistenti**: Trova un bar o un minimarket in una zona strategica. Proponi di installare la macchina all'interno o all'esterno del loro locale: loro mettono lo spazio e la corrente elettrica, tu gestisci l'operatività e dividete gli utili al 50%. Questo azzera i costi fissi e di acquisto iniziale se trovi un partner finanziatore.\n`;
      reportText += `- **Pivot Digitale Temporaneo**: Anziché acquistare una macchina fisica, crea una landing page che aggrega le pizzerie da asporto locali attive di notte a Gran Canaria, prendendo una commissione sulle vendite. Validi il mercato notturno con 0€ di CAPEX.\n\n`;
    }

    // Verdetto finale dell'agente
    let verdictColor = "orange";
    if (verdict.includes("BOCCIATO")) verdictColor = "red";
    if (verdict.includes("APPROVATO")) verdictColor = "var(--success)";

    return `### 📄 Report di: ${AGENT_METADATA[agentKey].name} (${AGENT_METADATA[agentKey].role})\n\n` +
      `**Stato della Valutazione:** <span style="color: ${verdictColor}; font-weight: bold;">${verdict}</span>\n\n` +
      reportText;
  },

  // Genera la sintesi dell'Orchestratore per una fase
  generateOrchestratorReport(info, phase, agentBriefs, previousAnswers = {}, attachedFile = null, attachedImage = null) {
    const isPizzaVending = info.isVending && info.sector === "food_beverage";
    const targetLoc = info.location ? `a ${info.location}` : "sul mercato target";
    const sect = LocalAgentSimulationEngine.sectorKeywords[info.sector] || LocalAgentSimulationEngine.sectorKeywords.general;
    
    let text = "";
    if (attachedFile) {
      text += `> [!NOTE]\n> **Analisi Allegato**: I dati del file **${attachedFile.name}** sono stati presi in carico dai sotto-agenti e sintetizzati in questa valutazione.\n\n`;
    }
    if (attachedImage) {
      text += `> [!NOTE]\n> **Analisi Visiva**: L'immagine allegata è stata analizzata e considerata nella sintesi dell'Orchestratore.\n\n`;
    }
    
    // Iniezione feedback interattivo basato sull'ultimo messaggio inserito in chat
    const lastUserMsg = previousAnswers[phase - 1] ? String(previousAnswers[phase - 1]) : "";
    if (lastUserMsg) {
      const msgLower = lastUserMsg.toLowerCase();
      text += `#### 💬 Risposta dell'Orchestratore Master al tuo feedback:\n`;
      
      if (msgLower.includes("leasing") || msgLower.includes("nolegg") || msgLower.includes("rent")) {
        text += `> **Su Leasing / Noleggio**: Hai perfettamente ragione. Ho recepito la tua indicazione sulla possibilità di utilizzare il **leasing o noleggio operativo** da parte di un'azienda distributrice spagnola/europea. Ho allineato il Consiglio di Amministrazione: il CFO ha revocato il veto finanziario e abbiamo convertito il CAPEX in OPEX mensili nel piano finanziario. Questo rende l'avvio fattibile anche in bootstrap!\n\n`;
      } else if (msgLower.includes("canari") || msgLower.includes("palmas") || msgLower.includes("canteras") || msgLower.includes("ingl") || msgLower.includes("maspalomas")) {
        text += `> **Sulla Localizzazione (Canarie)**: Ricevuto. La scelta geografica delle Canarie (Gran Canaria) è eccellente per via dell'IGIC agevolata al 7% e del turismo continuo tutto l'anno. Gli agenti adatteranno la pianificazione specificamente per Playa del Inglés o Las Palmas nelle prossime fasi.\n\n`;
      } else if (msgLower.includes("competitor") || msgLower.includes("concorren") || msgLower.includes("pizzeri") || msgLower.includes("adial") || msgLower.includes("let's pizza")) {
        text += `> **Sulla Concorrenza**: Ho registrato i dettagli sui competitor e sui distributori automatici (Adial/Let's Pizza). La nostra strategia punta a catturare la domanda notturna non soddisfatta dalle pizzerie tradizionali, puntando sulla velocità della cottura a pietra in 3 minuti H24.\n\n`;
      } else if (msgLower.includes("grafic") || msgLower.includes("tabell") || msgLower.includes("break-even") || msgLower.includes("bep")) {
        text += `> **Su Grafici & Tabelle**: Certamente. Ho dato indicazioni al CFO di inserire tabelle dettagliate sui costi CAPEX/OPEX e di tracciare chiaramente il Break-Even Point. Puoi visualizzare i dati calcolati nel tab 'Finanziario'.\n\n`;
      } else if (msgLower.includes("alleg") || msgLower.includes("document") || msgLower.includes("caric")) {
        text += `> **Sugli Allegati**: Ho notato l'allegato inserito. Ho chiesto al reparto Sourcing ed Operations di estrarne tutte le informazioni utili per integrarle nella nostra pianificazione di business.\n\n`;
      } else {
        let excerpt = lastUserMsg.length > 80 ? lastUserMsg.substring(0, 80) + "..." : lastUserMsg;
        text += `> Abbiamo ricevuto e analizzato la tua indicazione: *"${excerpt}"*.\n> Ho coordinato la boardroom per integrare queste note strategiche e preferenze direttamente nella pianificazione operativa di questa Fase ${phase}.\n\n`;
      }
    }

    let questions = [];

    // Costruiamo la sintesi dell'Orchestratore Master
    text += `### 👑 Orchestratore Master - Sintesi Strategica della Fase ${phase}\n\n`;
    
    // Rilevamento vaghezza in locale
    const isVagueLocal = info.idea.length < 35 || info.idea.split(" ").length < 6;
    if (isVagueLocal) {
      text += `> [!CAUTION]\n`;
      text += `> **BLOCCO STRATEGICO - IDEA VAGA**: L'idea iniziale descritta ("${info.idea.replace(/\n/g, ' ').substring(0, 60)}") è estremamente sintetica. Per fornirti un piano operativo reale "chiavi in mano", la Boardroom ha ipotizzato uno scenario di mercato concreto di riferimento. Ti raccomandiamo caldamente di utilizzare la chat o il pannello sottostante per rispondere alle domande di chiarimento e personalizzare il progetto.\n\n`;
    }

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

    // Se bootstrap ma CAPEX/investimento alto
    if (info.isBootstrap && (info.isVending || info.sector === "food_beverage" || info.sector === "retail")) {
      const selectedOption = info.financialOption || (info.hasLeasingOption ? "leasing" : "acquisto");
      if (selectedOption === "leasing") {
        text += `\n\n> [!NOTE]\n`;
        text += `> **SOLUZIONE FINANZIARIA ATTIVATA (LEASING/NOLEGGIO)**: L'opzione di **leasing/noleggio operativo** proposta consente di superare il veto finanziario sul CAPEX iniziale. Il progetto procede considerando la macchina in noleggio con riscatto, convertendo l'investimento iniziale in un costo mensile operativo (OPEX).\n\n`;
      } else if (selectedOption === "jv") {
        text += `\n\n> [!NOTE]\n`;
        text += `> **SOLUZIONE FINANZIARIA ATTIVATA (JOINT VENTURE)**: L'opzione di **Joint Venture** consente di condividere i costi e l'asset del distributore automatico con un partner locale. Riduciamo il CAPEX a €10.000 (setup, logistica e marketing di lancio) e dividiamo il rischio concedendo il 30% di revenue share sul venduto.\n\n`;
      } else {
        text += `\n\n> [!WARNING]\n`;
        text += `> **CONFLITTO DI BUDGET RILEVATO (CAPEX)**: Il CFO rileva un conflitto tra il regime di Bootstrap (0€) e il costo stimato del macchinario (€55.000). Suggerisce di non bloccare il progetto, ma di valutare insieme l'alternativa migliore (acquisto con capitale di soci/investitori, noleggio operativo con quota mensile, o Joint Venture con partner locali) per trovare la soluzione ottimale.\n\n`;
      }
    }

    // Dettaglio fasi
    if (isPizzaVending) {
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
            if (info.hasLeasingOption) {
              questions = [
                "Procedere con la validazione sul campo a Gran Canaria per stimare le vendite giornaliere.",
                "Focalizzarsi esclusivamente sulla clientela dei turisti notturni."
              ];
            } else {
              questions = [
                "Valutare l'opzione del Noleggio Operativo / Leasing (OPEX mensili ed anticipo ridotto).",
                "Valutare l'opzione della Joint Venture con locali esistenti a Gran Canaria.",
                "Modificare il budget apportando capitali propri (minimo €55.000)."
              ];
            }
          } else {
            questions = [
              "Procedere con 50 interviste sul campo a Gran Canaria per validare il prezzo di 7.00€.",
              "Sviluppare un sondaggio online da promuovere sui gruppi turisti Canarie."
            ];
          }
          break;

        case 2:
          text += `**FASE 2: ANALISI TARGET & COMPETITOR completata.**\n`;
          text += `Abbiamo profilato i clienti e mappato i concorrenti. La notte è la nostra finestra di mercato exclusiva.\n`;
          text += `- **Mercato**: Le pizzerie tradizionali chiudono presto, lasciando un vuoto d'offerta che possiamo colmare.\n`;
          text += `- **Rischio**: Competitori indiretti (snack bar freddi o fast food aperti H24) hanno prezzi bassi ma qualità inferiori.\n`;
          
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
          if (info.hasLeasingOption) {
            text += `- **CAPEX**: €8.000 (deposito, trasporto, allacciamento, SCIA).\n`;
            text += `- **OPEX**: €1.800/mese (canone leasing €850 + affitto/corrente/telemetria/Autónomo/manutenzione).\n`;
            text += `- **BEP**: 321 pizze al mese (circa 10.7 pizze al giorno a 8.00€ medio).\n`;
          } else {
            text += `- **CAPEX**: €55.000 (macchina, spedizione, allacciamento, SCIA).\n`;
            text += `- **OPEX**: €950/mese (affitto suolo, corrente h24, Autónomo flat, SIM, manutenzione).\n`;
            text += `- **BEP**: 170 pizze al mese (circa 5.6 pizze al giorno a 8.00€ medio).\n`;
          }
          
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
    } else {
      const sectorNames = {
        saas: "SaaS / Piattaforma Cloud",
        ecommerce: "E-commerce / Vendita Online",
        food_beverage: "Food & Beverage / Ristorazione",
        retail: "Retail / Negozio Fisico",
        mobile_app: "Applicazione Mobile",
        services: "Servizi Professionali / Consulenza",
        marketplace: "Marketplace / Portale",
        hardware_iot: "Hardware / IoT",
        general: "Business Strategico"
      };
      
      const sName = sectorNames[info.sector] || sectorNames.general;
      
      switch (phase) {
        case 1:
          text += `**FASE 1: VALIDAZIONE & LEAN CANVAS completata.**\n`;
          text += `Abbiamo strutturato il canvas strategico per il progetto **${info.name}** nel settore **${sName}** ${targetLoc}.\n`;
          text += `- **Obiezione Principale (CMO)**: Validazione dell'interesse e stima del Costo di Acquisizione (CAC) iniziale.\n`;
          text += `- **Obiezione di Costo (CFO)**: Sostenibilità delle spese di avvio in base al budget di ${info.isBootstrap ? "puro bootstrap (0€)" : info.budgetAmount + "€"}.\n`;
          
          if (info.locationMissing) {
            questions = [
              "Fornire una località specifica (città o area geografica) per calcolare i costi e permessi locali.",
              "Procedere ipotizzando un test di lancio pilota interamente online (SaaS/E-commerce)."
            ];
          } else {
            questions = [
              `Lanciare una Landing Page pilota per raccogliere email di utenti interessati ${info.location ? "a " + info.location : ""}.`,
              "Intervistare direttamente 15 potenziali clienti target per validare il problema."
            ];
          }
          break;
          
        case 2:
          text += `**FASE 2: ANALISI TARGET & COMPETITOR completata.**\n`;
          text += `La Boardroom ha analizzato il mercato di riferimento per ${sect.product}. Abbiamo profilato il cliente ideale e mappato i concorrenti diretti.\n`;
          text += `- **Mercato**: Evidenziato un posizionamento basato su ${sect.revenue} per differenziarci dai competitor.\n`;
          text += `- **Rischio**: Competitori generici o soluzioni manuali alternative usate attualmente dal target.\n`;
          
          questions = [
            `Focalizzarsi su una micro-nicchia di clienti molto specifica per ridurre la concorrenza.`,
            "Puntare ad un target di massa con un prezzo d'ingresso competitivo."
          ];
          break;
          
        case 3:
          text += `**FASE 3: STRATEGIA IBRIDA & GTM completata.**\n`;
          text += `Pianificato il piano di lancio (Go-To-Market) combinando canali online e offline.\n`;
          text += `- **Estetica (CCO)**: Sviluppo di un'identità visiva premium per trasmettere autorevolezza ed incrementare la fiducia.\n`;
          text += `- **Digitale (CMO)**: Campagne mirate tramite ${sect.marketing} per convogliare traffico qualificato.\n`;
          
          questions = [
            "Branding minimal ed elegante, focalizzato su un target alto spendente.",
            "Branding colorato e dinamico, focalizzato su un pubblico giovane e social."
          ];
          break;
          
        case 4:
          text += `**FASE 4: GROWTH HACK & OUTREACH completata.**\n`;
          text += `Definiti i flussi di fidelizzazione e accordi di marketing organico.\n`;
          text += `- **Growth Hack**: Incentivi al passaparola (referral program o sconti) al primo acquisto/registrazione.\n`;
          text += `- **Outreach**: Partnership strategiche con influencer locali o community online per acquisire traffico a costo zero.\n`;
          
          questions = [
            "Offrire uno sconto del 15% o un mese gratis in cambio del passaparola (Referral).",
            "Avviare collaborazioni con micro-influencer di settore offrendo l'uso gratuito del servizio."
          ];
          break;
          
        case 5:
          text += `**FASE 5: COMPLIANCE & RISCHI completata.**\n`;
          text += `Valutati gli adempimenti legali e la privacy per ${sect.product}.\n`;
          text += `- **Red Flag (CLO)**: Necessità di conformità GDPR per il trattamento dei dati e termini d'uso protettivi.\n`;
          text += `- **Fisco**: Scelta del regime fiscale (es. forfettario o ditta individuale) in base alle tasse e volume d'affari.\n`;
          
          questions = [
            "Operare inizialmente come ditta individuale/regime forfettario per minimizzare i costi fissi.",
            "Costituire una società a responsabilità limitata (Srl) per tutelare i patrimoni personali."
          ];
          break;
          
        case 6:
          text += `**FASE 6: PIANO OPERATIVO & TECH STACK completata.**\n`;
          text += `Definita l'architettura tecnica e le routine quotidiane.\n`;
          text += `- **Tech**: Setup basato su ${sect.tech} per garantire stabilità e automazione dei flussi.\n`;
          text += `- **Operations**: SOP per la gestione ordini/servizi ed assistenza clienti integrata.\n`;
          
          questions = [
            "Gestione operativa manuale diretta (svolta da te come fondatore).",
            "Automatizzare il 90% dei flussi integrando Make.com o Zapier con strumenti di intelligenza artificiale."
          ];
          break;
          
        case 7:
          text += `**FASE 7: PIANO FINANZIARIO completata.**\n`;
          text += `Analisi dei costi, prezzi e break-even point elaborata.\n`;
          
          const selectedOption = info.financialOption || (info.hasLeasingOption ? "leasing" : "acquisto");
          const fin = this.generateFinancials(info, selectedOption, (window.state && window.state.financialOverrides) || {});
          
          text += `- **CAPEX (Avvio)**: ${fin.capex} (setup e marketing iniziale).\n`;
          text += `- **OPEX (Mensili)**: ${fin.opex} (hosting, licenze software, pubblicità).\n`;
          text += `- **BEP (Soglia di pareggio)**: ${fin.bep} per coprire i costi fissi operativi.\n`;
          
          questions = [
            "Accettare il piano finanziario calcolato ed esportare il report executive.",
            "Rivedere la struttura dei prezzi o negoziare per ridurre gli OPEX mensili."
          ];
          break;
          
        case 8:
          text += `**FASE 8: EXECUTIVE SUMMARY & PITCH completata.**\n`;
          text += `Il progetto è investor-ready. Tutti i dettagli strategici e finanziari sono stati strutturati.\n`;
          text += `- **Stato**: Pronto per l'esportazione in formato Markdown (.md).\n`;
          text += `- **Consiglio**: Utilizza questo report strategico per validare l'idea sul mercato o presentarlo a potenziali partner.\n`;
          
          questions = [
            "Scarica il report finale in formato Markdown (.md).",
            "Ricomincia la simulazione con un altro progetto o budget."
          ];
          break;
      }
    }

    return { text, questions };
  },

  // Gestisce la sessione di brainstorming locale
  handleBrainstorm(info, agentKey, currentReport, userQuestion, history = []) {
    const meta = (window.AGENT_METADATA && window.AGENT_METADATA[agentKey]) || { name: agentKey, icon: "👤" };
    const q = userQuestion.toLowerCase();
    
    let agentResponse = "";
    let ceoResponse = "";

    if (q.includes("leasing") || q.includes("nolegg") || q.includes("rent")) {
      if (agentKey === "cfo") {
        agentResponse = `### Analisi del Noleggio Operativo / Leasing (${meta.name})
- **Soluzione di Finanziamento**: L'acquisizione del distributore automatico tramite noleggio operativo o leasing con riscatto è la strada ideale.
- **Rimodulazione Costi**: Abbattiamo il CAPEX da €55.000 a circa €8.000 (comprendente deposito cauzionale, trasporto, installazione e allacciamenti). 
- **Canone Operativo**: Il canone mensile sarà di circa €850/mese. Questo aumenta gli OPEX totali a €1.800/mese, innalzando il punto di pareggio (BEP) a circa 10.7 pizze al giorno.
- **Verdetto**: Il progetto passa da BOCCIATO a **APPROVATO (Con noleggio/leasing)**, in quanto la marginalità lorda (>70%) supporta ampiamente il canone se la macchina è posizionata in una zona ad alto traffico.`;
        ceoResponse = `### Decisione dell'Orchestratore Master (CEO)
- **Modifica Approvata**: L'opzione del leasing operativo risolve il vincolo di capitale proprio. 
- **Azione**: Ordino l'aggiornamento istantaneo del Business Plan e del prospetto finanziario per riflettere lo schema di noleggio. Procediamo con questa impostazione.`;
      } else {
        agentResponse = `### Impatto Operativo del Leasing / Noleggio (${meta.name})
- **Esecuzione Lean**: Il ricorso al leasing riduce i rischi di avvio a costo zero di CAPEX. Dal punto di vista delle operazioni, non cambia il flusso di rifornimento giornaliero.
- **Fornitori**: Dobbiamo selezionare distributori europei che offrano l'assistenza tecnica inclusa nel canone di noleggio (noleggio full-service), fondamentale per operare alle Canarie.`;
        ceoResponse = `### Decisione dell'Orchestratore Master (CEO)
- **Approvato**. La boardroom concorda che il noleggio operativo mitiga il rischio operativo complessivo del progetto.`;
      }
    } else if (q.includes("bocciat") || q.includes("perché") || q.includes("non approv") || q.includes("veto") || q.includes("fallito") || q.includes("impossibile")) {
      if (agentKey === "cfo") {
        agentResponse = `### Chiarimento sul Veto Finanziario (${meta.name})
- **Motivazione del Veto**: Ho dovuto bocciare il piano iniziale perché hai impostato un regime di **Bootstrap (0€ budget)** pur richiedendo l'acquisto di un distributore automatico di pizza che costa €48.000 + trasporto e installazione (€55.000 totali).
- **Come Risolverlo**: Per sbloccare l'approvazione, devi semplicemente inserire "leasing" o "noleggio" nelle note o nella chat. Questo convertirà l'acquisto in un canone mensile, permettendo l'avvio a budget zero.`;
        ceoResponse = `### Nota dell'Orchestratore Master (CEO)
- **Punto Critico**: Il CFO svolge il suo dovere di tutela finanziaria. L'incompatibilità tra budget zero e CAPEX elevato era bloccante.
- **Azione**: Adotta la formula del noleggio operativo per sbloccare immediatamente il progetto.`;
      } else {
        agentResponse = `### Valutazione di Sostenibilità (${meta.name})
- Il veto o le riserve sollevate in questa fase derivano dal bilanciamento tra il budget limitato e la necessità di garantire standard di sicurezza e operatività elevati.
- Possiamo superare queste riserve adottando soluzioni più scalabili (es. spazi privati in affitto invece di suolo pubblico, o accordi di revenue sharing).`;
        ceoResponse = `### Nota dell'Orchestratore Master (CEO)
- Le obiezioni degli agenti sono necessarie per evitare perdite di capitale. Affiniamo il modello operando in modo lean.`;
      }
    } else if (q.includes("canar") || q.includes("las palmas") || q.includes("spiaggia") || q.includes("posto") || q.includes("location") || q.includes("zona")) {
      agentResponse = `### Analisi Geografica Dettagliata (${meta.name})
- **Las Palmas (Nord)**: Offre stabilità durante tutto l'anno grazie a residenti, studenti e turisti urbani. Consigliamo la zona di *Las Canteras* (vicino ai locali serali) per intercettare il rientro notturno.
- **Playa del Inglés (Sud)**: Flusso turistico di massa e vita notturna incontrollata. Potenziali volumi altissimi nel weekend, ma affitti degli spazi privati più cari.
- **Consiglio**: Consigliamo di avviare il primo punto su suolo privato (es. di fronte ad un bar h24 o minimarket) per ridurre a zero i tempi di attesa burocratici della SCIA.`;
      ceoResponse = `### Decisione dell'Orchestratore Master (CEO)
- **Scelta Strategica**: Las Palmas garantisce minor rischio stagionale. Diamo priorità a contratti di affitto suolo con proprietari privati.`;
    } else if (q.includes("competitor") || q.includes("concorren") || q.includes("pizzeria") || q.includes("adial") || q.includes("let's pizza")) {
      agentResponse = `### Analisi Competitiva (${meta.name})
- **Pizzerie Locali**: Chiudono entro le 23:00 o le 24:00. La nostra finestra notturna (01:00 - 05:00) è priva di concorrenza diretta per la pizza calda.
- **Fast Food H24**: Offrono panini e hamburger di bassa qualità. La nostra pizza cotta su pietra a 300°C in 3 minuti offre una Value Proposition nettamente superiore.
- **Vending Tradizionale**: Vende solo snack freddi o merendine. Non rappresentano un pericolo.`;
      ceoResponse = `### Decisione dell'Orchestratore Master (CEO)
- **Posizionamento**: Il fattore tempo (pizza calda in 3 minuti a notte fonda) è il nostro vantaggio competitivo. Dobbiamo comunicarlo chiaramente sul wrapping grafico della macchina.`;
    } else if (q.includes("prezzo") || q.includes("costo") || q.includes("margine") || q.includes("guadagn") || q.includes("ricav") || q.includes("bep") || q.includes("break-even")) {
      agentResponse = `### Economia del Prodotto (${meta.name})
- **Scontrino Medio**: Impostato a €8.00 (con un costo degli ingredienti e scatola di €2.40).
- **Margine Unitario**: Generiamo €5.60 di margine lordo per ogni singola pizza venduta cashless.
- **Punto di Pareggio (BEP)**:
  - In acquisto diretto: 170 pizze al mese (5.6 pizze al giorno).
  - In noleggio operativo: 321 pizze al mese (10.7 pizze al giorno).
  - Tutto ciò che vendiamo oltre questa soglia rappresenta puro utile netto.`;
      ceoResponse = `### Decisione dell'Orchestratore Master (CEO)
- **Validazione Numerica**: Il target di 6 o 11 pizze al giorno è ampiamente realistico per le zone turistiche ad alta densità. I numeri sono validati e sostenibili.`;
    } else if (q.includes("qualità") || q.includes("fresch") || q.includes("ingredien")) {
      agentResponse = `### Standard di Qualità del Prodotto (${meta.name})
- **Base Pizza**: Impasto a lunga lievitazione (24-48h) precotto in forno a legna dal fornitore artigianale locale.
- **Ingredienti**: Mozzarella a basso rilascio di acqua (taglio julienne) e pomodoro condito con olio e origano, inseriti freschi prima del confezionamento.
- **Mantenimento**: La cella frigo interna a 4°C garantisce la massima igiene e blocca la proliferazione batterica fino a 48 ore.`;
      ceoResponse = `### Decisione dell'Orchestratore Master (CEO)
- **Pilastro Strategico**: La qualità è la chiave per fidelizzare il cliente. Rifiutiamo categoricamente prodotti surgelati di stampo industriale.`;
    } else {
      const capitalizedWord = q.split(/\s+/).filter(w => w.length > 4)[0] || "business";
      const topic = capitalizedWord.charAt(0).toUpperCase() + capitalizedWord.slice(1);
      
      agentResponse = `### Focus Strategico: ${topic} (${meta.name})
- Ho esaminato la tua richiesta riguardante **"${userQuestion}"**.
- In merito a questa tematica, gli agenti del Consiglio ritengono che integrare questo elemento rafforzi la nostra pianificazione strategica per la Fase ${state.currentPhase}.
- Perfezioneremo i flussi operativi per assicurarci che questa indicazione sia pienamente operativa nel report consolidato.`;
      ceoResponse = `### Decisione dell'Orchestratore Master (CEO)
- **Recepito**. Ho allineato il team sul tema da te sollevato (*${topic}*). Ottimo spunto per minimizzare i rischi commerciali. Procediamo.`;
    }

    return { agentText: agentResponse, ceoText: ceoResponse };
  },

  // Gestisce la sessione di brainstorming specifica sui numeri e grafici
  handleFinancialsBrainstorm(info, userQuestion, history = []) {
    const q = userQuestion.toLowerCase();
    let agentResponse = "";
    let ceoResponse = "";
    
    // Rileva l'opzione da utilizzare
    const selectedOption = info.financialOption || (info.hasLeasingOption ? "leasing" : "acquisto");
    const sector = info.sector;
    const isVending = info.isVending;
    
    // Ricalcoliamo localmente per dare risposte precise sui numeri attuali
    const fin = this.generateFinancials(info, selectedOption, (window.state && window.state.financialOverrides) || {});

    // Seleziona risposte specifiche in base a parole chiave
    if (q.includes("grafic") || q.includes("curv") || q.includes("line")) {
      agentResponse = `### Analisi del Grafico di Break-Even (${selectedOption.toUpperCase()}) (CFO)
- **Costi Cumulati (Linea Viola)**: Parte dal valore di CAPEX iniziale di **${fin.capex}** ed ha una pendenza basata sui costi operativi fissi di **${fin.opex}** e i costi variabili unitari (COGS) di **${fin.cogsNum.toFixed(2)} €**.
- **Ricavi Cumulati (Linea Verde)**: Parte da zero ed ha una pendenza determinata dal prezzo medio di vendita di **${fin.priceNum.toFixed(2)} €**.
- **Punto di Pareggio (BEP)**: Il punto di intersezione corrisponde a **${fin.bep}**. A parità di volumi, questa soglia determina l'inizio della redditività netta.`;
      ceoResponse = `### Nota dell'Orchestratore Master (CEO)
- **Strategia Finanziaria**: Il grafico evidenzia la differenza tra le opzioni. Con l'acquisto diretto, l'esposizione iniziale è alta ma i profitti futuri sono più ripidi (costi fissi minimi). Con leasing/noleggio o Joint Venture, riduciamo l'esposizione iniziale ma il Break-Even si sposta o richiede volumi diversi per via del canone o delle royalties.`;
    } else if (q.includes("capex") || q.includes("investimento") || q.includes("inizial") || q.includes("costi inizial")) {
      agentResponse = `### Dettaglio Spese Iniziali (CAPEX): ${fin.capex} (CFO)
- **Dettaglio Attivo**: In questa opzione (**${selectedOption}**), le spese di setup iniziali sono stimate a **${fin.capex}**.
- Le voci principali includono i costi di setup, sdoganamento/logistica ed eventuali depositi o registrazioni legali/sanitarie. Puoi consultare il dettaglio riga per riga nella tabella sovrastante.`;
      ceoResponse = `### Nota dell'Orchestratore Master (CEO)
- **Fabbisogno Capitale**: L'obiettivo del Consiglio è minimizzare la CAPEX per validare l'MVP. Se disponiamo del capitale, l'acquisto riduce gli OPEX mensili; altrimenti, l'alternativa del leasing o della Joint Venture protegge il flusso di cassa iniziale.`;
    } else if (q.includes("opex") || q.includes("ricorrent") || q.includes("mensil") || q.includes("affitt") || q.includes("corrente") || q.includes("elettric")) {
      agentResponse = `### Dettaglio Costi Ricorrenti (OPEX): ${fin.opex} (CFO)
- **Spese Mensili Fisse**: Stimate a **${fin.opex}**.
- Include abbonamenti software, hosting, affitti di suolo/ufficio, elettricità ed accantonamenti per manutenzione ordinaria.
- Un aumento dei costi fissi aumenta la pendenza della retta dei costi nel grafico e allontana il BEP.`;
      ceoResponse = `### Nota dell'Orchestratore Master (CEO)
- **Ottimizzazione OPEX**: Se stiamo operando in leasing, il canone incide notevolmente sui costi fissi. Dobbiamo puntare all'efficienza operativa negoziando contratti flessibili.`;
    } else if (q.includes("prezzo") || q.includes("margine") || q.includes("cogs") || q.includes("ingredien") || q.includes("costo unitario")) {
      const margin = fin.priceNum - fin.cogsNum;
      const marginPct = ((margin / fin.priceNum) * 100).toFixed(0);
      agentResponse = `### Struttura del Margine Prodotto (CFO)
- **Prezzo di Vendita Medio (Prezzo)**: **${fin.priceNum.toFixed(2)} €**.
- **Costo del Venduto (COGS)**: **${fin.cogsNum.toFixed(2)} €** per unità.
- **Margine Lordo Unitario**: **${margin.toFixed(2)} €** per vendita (pari al **${marginPct}%** dello scontrino).`;
      ceoResponse = `### Nota dell'Orchestratore Master (CEO)
- **Redditività**: Un margine del **${marginPct}%** è un ottimo indicatore. Possiamo incrementarlo aumentando lo scontrino medio o riducendo i costi delle materie prime tramite acquisti centralizzati una volta validato il business.`;
    } else if (q.includes("bep") || q.includes("break-even") || q.includes("pareggio") || q.includes("vendite") || q.includes("rientro")) {
      agentResponse = `### Calcolo del Punto di Pareggio (BEP) (CFO)
- **Soglia di Pareggio**: **${fin.bep}**.
- **Calcolo Lineare**: Costi OPEX Mensili (${fin.opexNum} €) divisi per il Margine Unitario (${(fin.priceNum - fin.cogsNum).toFixed(2)} €) = **${fin.bepVolumeNum}** unità/mese.`;
      ceoResponse = `### Nota dell'Orchestratore Master (CEO)
- **Rientro Investimento**: Questa soglia è il nostro traguardo primario. Nel settore ${sector.toUpperCase()}, raggiungere questo volume è pienamente fattibile con un buon posizionamento commerciale o campagne di lead generation mirate.`;
    } else if (q.includes("joint venture") || q.includes("jv") || q.includes("soci") || q.includes("partnership") || q.includes("co-investimento")) {
      agentResponse = `### Analisi del modello Joint Venture / Soci (CFO)
- **Caratteristiche**: La Joint Venture abbatte il CAPEX iniziale dividendo le spese di logistica e setup ed azzera il costo dell'asset principale, fornito dal partner.
- **Revenue Share**: In cambio, cediamo una quota percentuale sul fatturato (es. 30%-40%), che incrementa il COGS unitario e riduce il margine a pizza o abbonamento.
- **Soglia BEP**: Si attesta a circa **${fin.bepVolumeNum} unità/mese** per via del margine più basso, ma è l'opzione a minor rischio finanziario complessivo.`;
      ceoResponse = `### Nota dell'Orchestratore Master (CEO)
- **Valutazione Partner**: Questa opzione è ottimale se il partner porta valore strategico (es. posizionamento unico per il distributore, o portfolio clienti per un'agenzia) riducendo la nostra necessità di cassa.`;
    } else if (q.includes("leasing") || q.includes("nolegg") || q.includes("rent")) {
      agentResponse = `### Analisi del modello Leasing / Noleggio Operativo (CFO)
- **Caratteristiche**: Il leasing/noleggio operativo riduce l'esborso iniziale di oltre l'80% (CAPEX a circa ${fin.capex}), permettendoci di installare e validare l'MVP con un budget ridotto.
- **OPEX Mensile**: Incorpora il canone mensile, innalzando i costi operativi fissi a circa ${fin.opex} complessivi.
- **Soglia BEP**: Si attesta a **${fin.bep}** per coprire il canone fisso.`;
      ceoResponse = `### Nota dell'Orchestratore Master (CEO)
- **Considerazione**: Soluzione ideale per validare l'idea in bootstrap. Dobbiamo prestare attenzione alla durata del contratto e alle clausole di riscatto/recesso anticipato.`;
    } else if (q.includes("in-house") || q.includes("proprio") || q.includes("sviluppo") || q.includes("acquisto")) {
      agentResponse = `### Analisi del modello Acquisto Proprietario / In-House (CFO)
- **Caratteristiche**: Richiede l'intero investimento iniziale coperto al Giorno Zero (pari a ${fin.capex}).
- **Vantaggi**: Massimizza il margine e riduce i costi operativi fissi mensili, consentendo un Break-Even molto più basso in termini di vendite mensili.`;
      ceoResponse = `### Nota dell'Orchestratore Master (CEO)
- **Asset Ownership**: L'acquisto rende l'infrastruttura o il macchinario un bene ammortizzabile di proprietà aziendale. Adatto se disponiamo dei fondi e vogliamo massimizzare i profitti nel lungo periodo.`;
    } else {
      agentResponse = `### Supporto Decisionale Finanziario (CFO)
- Sto analizzando il modello di business del progetto **${info.name}** in modalità **${selectedOption.toUpperCase()}**.
- I dati attuali indicano: CAPEX di **${fin.capex}**, OPEX di **${fin.opex}** e Break-Even di **${fin.bep}**.
- Chiedimi pure spiegazioni sui calcoli, su voci di costo specifiche, o chiedimi di simulare variazioni scrivendo ad esempio *"imposta prezzo a X"* o *"riduci l'affitto a Y"*.`;
      ceoResponse = `### Nota dell'Orchestratore Master (CEO)
- **Allineamento**: Utilizza questa chat per testare diversi scenari di prezzo e contratti. Una volta trovata la combinazione ottimale, l'intera strategia della boardroom si allineerà automaticamente.`;
    }
    
    return { agentText: agentResponse, ceoText: ceoResponse };
  },

  startupReadinessData: {
    saas: {
      scelta_problema: "Verifica che il problema esista per almeno 15-20 aziende target. Non costruire nulla finché non hai confermato che il processo manuale costa loro tempo o denaro reale.",
      pain_cliente: "Il pain del cliente SaaS è la perdita di tempo in compiti ripetitivi o la perdita di dati. Assicurati che la tua proposta di valore parli direttamente alla riduzione di questo stress.",
      psicologia_vendita: "Nel B2B SaaS si vende per accrescere i ricavi o tagliare i costi. Posiziona il tuo software come un dipendente virtuale infaticabile e calcolane il ROI.",
      posizionamento: "Evita di posizionarti come 'un software per tutto'. Scegli una nicchia stretta (es. CRM per agenzie immobiliari locali) per battere i giganti generalisti.",
      distribuzione: "Sfrutta la SEO tecnica su ricerche di nicchia ed outreach mirato su LinkedIn. Nel SaaS la distribuzione organica è il motore di crescita a lungo termine.",
      hiring: "La tua prima assunzione dovrebbe essere un technical co-founder o un senior engineer per garantire l'indipendenza di sviluppo, seguita da un growth marketer.",
      processo_decisionale: "Il processo d'acquisto B2B ha più stakeholder (CTO, CFO, User). Crea materiali ad hoc (es. foglio di sicurezza dati per il CTO e ROI per il CFO).",
      cash_flow: "Traccia minuziosamente il Churn Rate (abbandono) ed il LTV (Lifetime Value). Il cash flow del SaaS dipende dalla ricorrenza: ottimizza la retention dei clienti.",
      storytelling: "Racconta come il fondatore ha vissuto in prima persona il problema che il SaaS risolve. La storia di 'frustrazione e soluzione' crea immediata empatia B2B.",
      mindset: "Accetta che l'MVP sarà imperfetto. Rilascia presto, raccogli feedback ed itera ogni settimana. La resilienza sta nel non innamorarsi del codice, ma del problema."
    },
    ecommerce: {
      scelta_problema: "Verifica la reperibilità e l'unicità del prodotto. Risolvi problemi di accessibilità di prodotti di nicchia o convenienza di acquisto ricorrente.",
      pain_cliente: "La frustrazione per tempi di spedizione lunghi, resi complessi o packaging inquinante. Ottimizza la logistica fin dal giorno zero.",
      psicologia_vendita: "Usa la leva della riprova sociale (social proof) e del passaparola visuale. Le recensioni fotografiche e i video UGC convertono più delle descrizioni scritte.",
      posizionamento: "Non competere sul prezzo con Amazon. Posizionati come brand di nicchia con valori chiari (es. ecologico, artigianale, Made in Italy).",
      distribuzione: "Le campagne Meta/TikTok Ads sono il motore iniziale, abbinate ad un'ottima strategia di email marketing automatizzata per fidelizzare i clienti ed evitare il costo dei click ripetuti.",
      hiring: "Assumi un esperto di logistica/operations part-time ed un copywriter/social media manager creativo per dare una voce unica e professionale al brand.",
      processo_decisionale: "Acquisto impulsivo ed emozionale. Riduci i passaggi al checkout, accetta pagamenti rapidi (ApplePay, PayPal) e offri una garanzia di reso chiara.",
      cash_flow: "L'e-commerce divora cassa per l'inventario. Ottimizza il lead time dei fornitori e mantieni basso il magazzino iniziale per evitare di bloccare la cassa in prodotti invenduti.",
      storytelling: "Mostra il dietro le cuinte: la nascita del brand, la scelta etica dei fornitori o il confezionamento dei pacchi. Vendi l'esperienza dietro l'oggetto fisico.",
      mindset: "Sii pronto a testare decine di inserzioni pubblicitarie (ad creatives) diverse prima di trovarne una redditizia. Analizza i dati con freddezza scientifica."
    },
    food_beverage: {
      scelta_problema: "Analizza la concorrenza locale nel raggio di 2 km. Trova un buco nell'offerta culinaria locale o un formato d'acquisto innovativo (es. asporto rapido intelligente).",
      pain_cliente: "I dolori principali sono l'attesa eccessiva per il tavolo, le materie prime scarse o menu poco trasparenti. Risolvili offrendo menu QR chiari e asporto coordinato.",
      psicologia_vendita: "Il cibo è emozione e convivialità. Vendi l'esperienza del locale e l'autenticità dei sapori. Regala esperienze gustative fin dal primo istante.",
      posizionamento: "Crea un piatto firma (signature dish) unico e memorabile che i clienti possano ordinare solo da te e che funga da calamita per il passaparola.",
      distribuzione: "La Local SEO (Google Maps) ed Instagram Reels geolocalizzati sono i canali di distribuzione più potenti ed economici per attirare clienti fisici locali.",
      hiring: "La priorità assoluta è uno chef o responsabile di cucina affidabile ed un caposala orientato all'ospitalità che fidelizzi i clienti abituali.",
      processo_decisionale: "Decisione rapida, guidata dall'appetito o dalla ricerca locale dell'ultimo minuto. Sii visibile su Maps e rispondi rapidamente alle prenotazioni.",
      cash_flow: "Gestisci gli sprechi alimentari (food waste) al grammo. Il cash flow della ristorazione si salva ottimizzando l'acquisto quotidiano delle materie prime fresche.",
      storytelling: "Narra la tradizione delle ricette, la ricerca degli ingredienti biologici dal produttore locale. La provenienza del cibo affascina il consumatore moderno.",
      mindset: "La ristorazione è operativa e faticosa. Mantieni alto il morale dello staff e accetta che il servizio perfetto si costruisce rodando il team nei primi mesi."
    },
    retail: {
      scelta_problema: "Il commercio locale soffre la concorrenza online. Scegli un problema locale: es. la mancanza di un negozio di abbigliamento bimbi di qualità nel quartiere.",
      pain_cliente: "La noia dell'acquisto standardizzato nei grandi magazzini. I clienti cercano calore umano, consigli di stile su misura e la prova immediata del prodotto.",
      psicologia_vendita: "Psicologia del tatto e dell'accoglienza. Un ambiente profumato, musica adatta ed un sorriso aumentano il tempo di permanenza e il valore dello scontrino.",
      posizionamento: "Posizionati come curatore di prodotti unici (concept store) piuttosto che come negozio generico. Cura la vetrina come un'opera d'arte dinamica.",
      distribuzione: "Eventi in-store per i residenti del quartiere, collaborazioni con altre botteghe locali, e promozioni mirate sui gruppi social del quartiere.",
      hiring: "Assumi assistenti alla vendita con eccellenti doti comunicative e capacità di fare visual merchandising per mantenere il negozio sempre attraente.",
      processo_decisionale: "Il cliente valuta la comodità del negozio e l'esperienza fisica. Rendi l'acquisto immediato, offri confezioni regalo eccellenti e pagamenti digitali rapidi.",
      cash_flow: "Rotazione delle scorte (inventory turnover) è la parola chiave. Non accumulare stock invenduto: usa i saldi in modo strategico per liberare cassa per le nuove collezioni.",
      storytelling: "Racconta perché hai aperto in quel quartiere specifico e la passione per la selezione artigianale dei prodotti. Fai sentire i clienti parte di una comunità.",
      mindset: "Vivi il negozio come un punto d'incontro sociale. Devi amare il contatto quotidiano con le persone e saper ascoltare i feedback dei passanti."
    },
    mobile_app: {
      scelta_problema: "Verifica se l'app risolve una necessità quotidiana o offre intrattenimento reale. Un'app che non viene aperta almeno 3 volte a settimana rischia la cancellazione.",
      pain_cliente: "Frizione d'uso, lentezza e consumi di batteria elevati. Risolvi fornendo un'interfaccia fluida e un onboarding senza registrazione obbligatoria immediata.",
      psicologia_vendita: "Fai leva sulla gamification (badge, strisce di utilizzo quotidiano) per creare abitudini positive e incentivare l'acquisto di funzioni premium.",
      posizionamento: "Concentrati su un'unica funzionalità core eccezionale (es. 'il timer per la produttività più pulito') anziché riempire l'app di funzioni inutili.",
      distribuzione: "Ottimizza l'ASO (App Store Optimization) per comparire nelle ricerche organiche dello store. Usa campagne di micro-influencer per dimostrare l'uso pratico.",
      hiring: "La priorità è un mobile developer (iOS/Android) esperto di UI/UX, o un designer che sappia progettare interazioni fluide ed onboardings intuitivi.",
      processo_decisionale: "Il download è gratuito ma la conversione in-app richiede fiducia. Mostra il valore dell'abbonamento solo dopo che l'utente ha provato i benefici reali.",
      cash_flow: "Tieni conto delle commissioni degli store (15-30% a Apple/Google). Calcola il costo di acquisizione (CPI) ed assicurati che il canone in-app copra il marketing ads.",
      storytelling: "Mostra lo sviluppo del codice, le sfide di design e come l'app ha semplificato la vita dei beta tester. Coinvolgi la community nella roadmap delle funzioni.",
      mindset: "Sii pronto a rilasciare aggiornamenti continui basati sulle recensioni degli store. Rispondi a ogni singola recensione negativa con empatia e soluzioni rapide."
    },
    services: {
      scelta_problema: "Identifica le inefficienze operative delle PMI locali. Se offri consulenza, assicurati di risolvere un problema fiscale, di vendite, o di marketing misurabile.",
      pain_cliente: "La frustrazione per l'assenza di risultati promessi da agenzie teoriche. I clienti cercano trasparenza, reportistica chiara e un unico referente affidabile.",
      psicologia_vendita: "Costruisci autorità e fiducia. Scrivi post a valore su LinkedIn, organizza webinar formativi e posizionati come esperto indiscusso del settore.",
      posizionamento: "Specializzati su un target preciso (es. 'Marketing per studi dentistici') piuttosto che presentarti come un'agenzia di comunicazione generalista.",
      distribuzione: "LinkedIn outreach strategico (non spam), partecipazione attiva a fiere di settore e referenze incentivate da clienti attuali soddisfatti.",
      hiring: "Assumi professionisti junior da formare per l'operatività ordinaria, mantenendo la direzione strategica in capo a te nei primi tempi di crescita.",
      processo_decisionale: "Il B2B richiede tempo (2-6 settimane). Rassicura il cliente con un audit iniziale gratuito e una proposta commerciale a milestone chiare.",
      cash_flow: "Evita la trappola dei pagamenti posticipati a 90 giorni. Imponi un acconto del 30-50% all'inizio del progetto o un canone mensile flat ricorrente anticipato.",
      storytelling: "Condividi i casi studio di successo dei tuoi clienti: mostra il 'prima' e il 'dopo' dell'intervento. La storia del successo altrui è il tuo miglior marketing.",
      mindset: "Il tuo servizio dipende dalla reputazione. Mantieni promesse e scadenze anche a costo di lavorare ore extra all'inizio. La qualità delle relazioni è tutto."
    },
    non_profit: {
      scelta_problema: "Definisci con precisione l'impatto sociale o la causa che l'associazione vuole risolvere. Un obiettivo fumoso rende impossibile attirare sostenitori caldi.",
      pain_cliente: "Il dolore dei donatori è l'impotenza di fronte a un problema sociale e la paura che le donazioni vengano sprecate. La tua trasparenza deve essere la cura di questa frustrazione.",
      psicologia_vendita: "Nel no-profit non vendi prodotti, ma sentimenti di utilità sociale, appartenenza e pace interiore. Connetti emotivamente il donatore alla causa specifica.",
      posizionamento: "Evita di posizionarti come 'un'associazione che aiuta tutti'. Focalizzati su un singolo problema locale o di nicchia (es. assistenza animali anziani a Rimini) per massimizzare l'empatia.",
      distribuzione: "Lo storytelling d'impatto basato su casi reali e volti specifici è la tua miglior distribuzione. Usa le newsletter come un diario di bordo trasparente dei successi.",
      hiring: "La priorità è reclutare un nucleo di 3-5 volontari chiave dedicati ed entusiasti, coordinati da un responsabile delle relazioni e della comunicazione sociale.",
      processo_decisionale: "L'atto di donare è guidato da impulso ed empatia, ma bloccato dal sospetto. Riduci i passaggi tecnici di donazione ed esibisci subito statuto e bilanci trasparenti.",
      cash_flow: "Diversifica le fonti: non dipendere solo da un bando pubblico tardivo. Crea quote associative ricorrenti (donazioni mensili stabili) per coprire i costi vivi.",
      storytelling: "Mostra i volti di chi riceve l'aiuto o del volontario sul campo. Il racconto sincero e documentato del cambiamento reale commuove e fidelizza i donatori.",
      mindset: "Focalizzati sull'etica e sulla costanza operativa. Gestire un'associazione no-profit richiede abnegazione, intelligenza emotiva e profondo rispetto per la fiducia altrui."
    },
    industrial_agri: {
      scelta_problema: "Valuta attentamente la fattibilità agronomica o industriale prima dello start. Assicurati che esista una reale richiesta per la varietà coltivata o il pezzo prodotto.",
      pain_cliente: "I clienti B2B temono le rotture di stock e le variazioni qualitative. Il tuo impianto deve garantire costanza e affidabilità di fornitura per essere attrattivo.",
      psicologia_vendita: "Nel settore primario e secondario si vende basandosi su certificazioni di qualità, volumi garantiti e precisione millimetrica delle consegne logistiche.",
      posizionamento: "Cerca di non vendere una commodity anonima. Posizionati con certificazioni biologiche, filiera cortissima tracciata in blockchain o lavorazioni esclusive.",
      distribuzione: "Crea una rete di contatti diretti con grossisti e distributori. Affidati ad agenti plurimandatari qualificati che hanno già le porte aperte nei mercati target.",
      hiring: "La figura chiave iniziale è un agronomo esperto o un capotecnico di produzione che conosca perfettamente i cicli produttivi e prevenga i guasti alle serre/macchine.",
      processo_decisionale: "Processo formale e lento. Coinvolge responsabili qualità e uffici acquisti. Fornisci schede tecniche complete e campioni fisici eccellenti per superare i test.",
      cash_flow: "Il ciclo monetario è lungo. Investi molto per avviare il raccolto o la produzione e incassi dopo mesi. Fondamentale avere riserve di cassa e linee di credito bancarie.",
      storytelling: "Valorizza la storia della terra, il rispetto dei cicli naturali o l'avanguardia tecnologica dell'impianto. Anche il B2B ama l'autenticità del produttore.",
      mindset: "Armati di pazienza e resilienza climatica/operativa. I fattori esterni (meteo, parassiti, guasti meccanici) sono costanti: la pianificazione del rischio è vitale."
    },
    real_estate: {
      scelta_problema: "Verifica la liquidità della zona. Non acquistare o affittare immobili in aree dove il tempo medio di vendita supera i 6 mesi. La cassa morirebbe nel tempo.",
      pain_cliente: "Il dolore degli acquirenti è la paura di brutte sorprese strutturali o burocratiche. Offrire immobili con due diligence tecnica pre-compilata azzera questa paura.",
      psicologia_vendita: "La casa è il bene più prezioso per una famiglia o un investitore. Vendi sicurezza, status, comfort moderno e risparmio energetico (classi alte).",
      posizionamento: "Focalizzati su una nicchia specifica (es. monolocali ristrutturati per studenti a Bologna o ville di lusso con piscina sul Garda) per dominare le ricerche.",
      distribuzione: "Presidia in modo ossessivo i portali immobiliari con annunci a pagamento posizionati al top, e coltiva relazioni personali con agenti locali chiave.",
      hiring: "La priorità è avere un geometra/architetto di fiducia per i controlli urbanistici e un'impresa edile partner affidabile per tempi e costi di cantiere.",
      processo_decisionale: "Processo lungo e complesso, spesso legato all'ottenimento di un mutuo bancario. Supporta il cliente offrendo consulenza di mediatori creditizi.",
      cash_flow: "Usa la leva finanziaria in modo intelligente ma prudente. Proteggi il cash flow calcolando con margine i costi delle ristrutturazioni (+15% imprevisti).",
      storytelling: "Mostra il prima e il dopo della ristrutturazione. Racconta come hai trasformato un immobile decadente in un gioiello accogliente pronto da vivere.",
      mindset: "Mantieni nervi saldi e rigore burocratico. Nel settore immobiliare i dettagli legali ed edilizi fanno la differenza tra un grande affare e una perdita."
    },
    media_content: {
      scelta_problema: "Verifica la domanda di attenzione su quel tema specifico. Trova un angolo non coperto: non fare l'ennesimo podcast di interviste generico.",
      pain_cliente: "Il pubblico odia perdere tempo con contenuti superficiali e lenti. Ottimizza la scrittura dei primi 30 secondi (hook) per trattenere l'attenzione.",
      psicologia_vendita: "Nel media vendi fiducia, vicinanza e appartenenza. Il pubblico si deve immedesimare nel creator o nel brand editoriale prima di seguirlo.",
      posizionamento: "Focalizzati su una super-nicchia tematica molto specifica (es. intelligenza artificiale per commercialisti) prima di allargarti ad argomenti generalisti.",
      distribuzione: "Usa i contenuti verticali brevi (Tiktok, Reels, Shorts) esclusivamente come imbuto (funnel) per convogliare traffico sul tuo show principale o sulla newsletter.",
      hiring: "La priorità iniziale è un video-editor / montatore professionista freelance che ti consenta di concentrarti solo sulla scrittura e sulla registrazione dei contenuti.",
      processo_decisionale: "L'iscrizione è un click gratuito ma l'attenzione è preziosa. Rendi facilissimo l'onboarding e stimola l'interazione per fidelizzare l'utente.",
      cash_flow: "Non basarti solo su AdSense, che paga centesimi. Struttura fin dal primo giorno una newsletter sponsorizzabile o un canale di abbonamento premium per finanziare la produzione.",
      storytelling: "Sii vulnerabile e sincero. Racconta i tuoi fallimenti e le tue scoperte reali. Il pubblico segue le persone reali, non le macchine da contenuti perfetti.",
      mindset: "Il successo nei media è un gioco di costanza geometrica a lungo termine. Non guardare le visualizzazioni dei primi 3 mesi: focalizzati sul migliorare dell'1% ogni episodio."
    },
    general: {
      scelta_problema: "Assicurati di identificare un problema reale e doloroso per il mercato. Un business solido si basa su bisogni esistenti, non su desideri teorici.",
      pain_cliente: "Traccia cosa fa perdere tempo, soldi o sonno al tuo target. Se la tua soluzione non riduce uno di questi elementi, non c'è mercato sufficiente.",
      psicologia_vendita: "Riduci l'ostacolo mentale all'acquisto offrendo garanzie solide, demo o prove senza rischi. Fai sentire il cliente al sicuro e coccolato.",
      posizionamento: "Definisci in cosa sei radicalmente differente dai competitor. Se non sei differente, sarai costretto a competere esclusivamente sul prezzo.",
      distribuzione: "Trova il canale in cui si concentra il tuo pubblico target (social, fisici, motori di ricerca) ed impara a dominarlo prima di differenziare.",
      hiring: "Definisci i ruoli chiave partendo dai tuoi punti di debolezza. Assumi persone migliori di te nei compiti in cui non eccelli.",
      processo_decisionale: "Comprendi ogni passaggio che fa il cliente dall'incontrare il tuo brand all'acquistare. Rendi il cammino privo di ostacoli tecnici.",
      cash_flow: "La cassa è il sangue del business. Mantieni i costi fissi al minimo, incassa velocemente e non fare affidamento su proiezioni ottimistiche.",
      storytelling: "Comunica il perché del tuo business prima di spiegare il cosa fa. Le persone comprano il motivo per cui fai le cose, la tua missione.",
      mindset: "Accetta il fallimento come feedback costruttivo. L'imprenditoria è una maratona di adattamenti continui, non uno sprint di fortuna."
    }
  },

  salesPsychologyData: {
    saas: {
      hook: "Invece di vendere funzionalità, mostra come risparmiare il 70% del tempo perso in processi manuali ripetitivi. Vendi il 'tempo libero' e l'assenza di errori, non il codice.",
      objections: "Il software costa troppo / Possiamo farlo in-house / Sarà sicuro per i nostri dati? Rispondi offrendo un ROI calculator chiaro, un trial guidato di 14 giorni e certificazioni di conformità hosting.",
      conversion: "Offri uno sconto del 20% sul piano annuale o sessioni di setup/onboarding gratuito 1-to-1 se firmano entro la settimana. La chiave è azzerare la frizione tecnica iniziale.",
      angle: "B2B Efficiency & Automation Focus",
      urgency: "Setup Gratuito & Assistenza Dedicata per i primi 10 clienti",
      friction: "Sforzo di migrazione dati e adozione del team"
    },
    ecommerce: {
      hook: "Vendi un'identità o una soluzione di comodità/ecosostenibilità. Mostra il prodotto in azione (unboxing, benefici visivi rapidi) focalizzandoti sulle emozioni dell'acquirente.",
      objections: "Il prezzo di spedizione è alto / E se non mi va bene? Rispondi con politiche di reso gratuito entro 30 giorni e spedizione inclusa sopra una certa soglia ben visibile.",
      conversion: "Usa countdown di urgenza (es. spedizione in giornata se acquisti entro 2 ore) ed Email automatiche di abbandono carrello con codice sconto 10% ad attivazione rapida.",
      angle: "Emotional Styling & Risk-Free Shopping",
      urgency: "Spedizione gratuita e sconto benvenuto per le prossime 24 ore",
      friction: "Fiducia nel brand sconosciuto e tempi di spedizione"
    },
    food_beverage: {
      hook: "L'occhio vuole la sua parte: valorizza la qualità degli ingredienti locali e l'artigianalità attraverso video Reels ravvicinati che stimolano l'appetito e la voglia di socialità.",
      objections: "C'è fila / Sarà pulito? / La qualità giustifica il prezzo? Rispondi mostrando il menu digitale trasparente, le recensioni a 5 stelle dei clienti e il servizio asporto rapido.",
      conversion: "Fornisci un drink di benvenuto gratuito, un dessert in omaggio per chi prenota via web, o un loyalty program (tessera 10+1) per aumentare la frequenza di riacquisto locale.",
      angle: "Local Experience & Food Quality Passion",
      urgency: "Offerta di lancio limitata sui coperti della settimana",
      friction: "Tempi d'attesa e difficoltà di parcheggio/prenotazione"
    },
    retail: {
      hook: "Rivaluta il commercio di quartiere puntando sull'esperienza fisica, il tocco dei materiali e il consiglio personalizzato di un esperto che le grandi catene online non possono offrire.",
      objections: "Su Amazon costa meno / C'è poca scelta. Rispondi garantendo la qualità esclusiva dei brand selezionati, l'assistenza post-vendita e la possibilità di provare il prodotto subito.",
      conversion: "Regala un buono sconto cartaceo sul secondo acquisto ed implementa eventi in-store esclusivi per i residenti del quartiere, incentivando il passaparola locale.",
      angle: "Human Interaction & Instant Ownership",
      urgency: "Sconto in-store valido solo per questo weekend di lancio",
      friction: "Mancanza di parcheggio e assortimento limitato rispetto al web"
    },
    mobile_app: {
      hook: "Crea curiosità sul beneficio immediato (es. 'Impara X in 5 minuti' o 'Traccia Y senza sforzo'). Usa micro-interazioni grafiche e gamification per renderla memorabile all'istante.",
      objections: "È l'ennesima app che non userò / Sarà piena di pubblicità? Rispondi offrendo un modello freemium pulito, con 7 giorni di prova gratuita di tutte le funzioni pro senza vincoli.",
      conversion: "Notifiche push intelligenti di congratulazioni e promozioni flash (es. 50% di sconto a tempo limitato) basate sul comportamento di utilizzo effettivo dell'utente nell'app.",
      angle: "Daily Habit & Seamless Mobile Utility",
      urgency: "Prezzo di lancio annuale scontato del 50%",
      friction: "Apatia dell'utente (scarica e dimentica) e setup iniziale"
    },
    services: {
      hook: "Smetti di vendere ore di lavoro. Vendi pacchetti a risultato chiaro (es. 'Posizioniamo il tuo sito in prima pagina' o 'Riduciamo il carico fiscale'). Diventa un partner di fiducia.",
      objections: "Ho già avuto brutte esperienze / Come misuro i risultati? Rispondi mostrando Case Studies reali, testimonianze video e impostando contratti con reportistica mensile chiara.",
      conversion: "Offri una prima consulenza strategica (audit) gratuita del valore di 250€ per individuare le falle attuali e dimostrare la tua competenza prima di chiedere vendite.",
      angle: "ROI-Driven Partnership & Authority Positioning",
      urgency: "Capacità limitata (accettiamo solo 2 nuovi clienti questo mese)",
      friction: "Scetticismo sui risultati promessi e timore di contratti a lungo termine"
    },
    non_profit: {
      hook: "Invece di chiedere elemosina, invita il donatore a far parte di un cambiamento tangibile. Mostra come anche una piccola quota mensile si traduce in pasti erogati o cure concrete.",
      objections: "Le donazioni vengono sprecate / C'è mancanza di trasparenza / Non posso permettermelo. Rispondi fornendo un report d'impatto periodico trasparente al centesimo e offrendo micro-donazioni ricorrenti flessibili.",
      conversion: "Offri la detrazione fiscale certificata immediata, un badge digitale di sostenitore o una spilla fisica dell'associazione da indossare. La riprova sociale consolida la donazione.",
      angle: "Social Impact & Radical Transparency",
      urgency: "Raccolta fondi con scadenza fissa per un obiettivo umanitario specifico del mese",
      friction: "Diffidenza sull'effettivo utilizzo dei fondi e burocrazia della donazione"
    },
    industrial_agri: {
      hook: "Garantiamo qualità costante, volumi stabili certificati e consegne rapide grazie al nostro impianto automatizzato a filiera tracciata.",
      objections: "Il prezzo all'ingrosso è alto / Siete capaci di garantire i volumi stagionali? / Qualità instabile. Rispondi fornendo certificazioni ISO/Bio, campionatura gratuita immediata e penali contrattuali a favore del cliente sui ritardi.",
      conversion: "Sconto sul primo lotto di prova del 15% o spedizione inclusa se si sottoscrive un contratto di fornitura annuale per un volume minimo garantito.",
      angle: "Reliable Supply Chain & Quality Certification Focus",
      urgency: "Capacità produttiva residua limitata per il prossimo trimestre di raccolto/lavorazione",
      friction: "Tempi lunghi di validazione aziendale e rigidità dei contratti di fornitura esistenti"
    },
    real_estate: {
      hook: "Splendido appartamento completamente ristrutturato a nuovo, in classe energetica elevata, pronto da vivere e privo di qualsiasi vizio catastale.",
      objections: "Il prezzo è alto / Ci saranno vizi occulti? / Tempi lunghi per il mutuo. Rispondi mostrando la due diligence firmata da un geometra, offrendo rendering interattivi 3D e assistenza pre-delibera mutuo.",
      conversion: "Prenota una visita esclusiva durante l'Open House di questo sabato. Le visite individuali sono limitate a sole 10 famiglie selezionate.",
      angle: "Modern Premium Comfort & Certified Property",
      urgency: "Prezzo di lancio valido solo per proposte d'acquisto ricevute entro 15 giorni",
      friction: "Richiesta del mutuo bancario e timore di truffe immobiliari"
    },
    media_content: {
      hook: "Il primo show di approfondimento che spiega in modo chiaro e pratico le dinamiche di X, con dati reali e senza fuffa clickbait.",
      objections: "È noioso / È il solito contenuto copia-incolla / Ho poco tempo. Rispondi producendo episodi brevi montati a ritmo serrato, mostrando grafiche chiare e offrendo una versione scritta riassunta via email.",
      conversion: "Iscriviti subito alla newsletter settimanale per ricevere in regalo la guida PDF esclusiva compilata con le nostre ricerche riservate.",
      angle: "Engaging Depth & High Production Quality",
      urgency: "Accesso gratuito alla community privata riservato solo ai primi 500 iscritti al canale",
      friction: "Saturazione del tempo libero dell'utente e pigrizia all'iscrizione"
    },
    general: {
      hook: "Focalizzati sulla semplicità ed efficienza della soluzione. Spiega il tuo valore aggiunto in meno di 10 secondi e posizionati come l'alternativa più affidabile e vicina.",
      objections: "Posso farne a meno / Non conosco il brand. Rispondi con recensioni certificate, una garanzia 'soddisfatti o rimborsati' e trasparenza totale su prezzi e condizioni.",
      conversion: "Incentivi di benvenuto e canali di assistenza immediati (WhatsApp Business o chat diretta) per risolvere i dubbi dell'utente in tempo reale durante l'acquisto.",
      angle: "Convenience & High Trust Alternative",
      urgency: "Prezzo promozionale di lancio per i primi 50 clienti",
      friction: "Inerzia all'acquisto e mancanza di fiducia iniziale"
    }
  }
};

// Esporta globalmente
window.LocalAgentSimulationEngine = LocalAgentSimulationEngine;
