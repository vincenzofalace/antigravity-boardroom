# Antigravity Multi-Agent Boardroom Suite

Benvenuto nella **Antigravity Multi-Agent Boardroom Suite**, un'interfaccia web premium, intuitiva ed offline-first progettata per interagire con un team di agenti AI coordinati dall'**Orchestratore Master** (CEO & Lead Strategist). 

Questo spazio di lavoro simula o esegue live una riunione del consiglio di amministrazione (Boardroom) per mappare, validare e preparare la tua idea di business per la presentazione a potenziali soci e investitori (investor-ready), applicando la metodologia del **Bootstrap** a budget ridotto o zero.

---

## 🚀 Come Avviare l'Applicazione

Trattandosi di una **Single Page Application (SPA)** client-side senza dipendenze backend, l'avvio è semplicissimo:

1. **Apertura Diretta (Offline-First)**:
   - Fai doppio clic sul file `index.html` per aprirlo direttamente in qualsiasi browser web (Chrome, Safari, Edge, Firefox).
   
2. **Server Locale (Consigliato per evitare blocchi CORS locali su alcune chiamate API)**:
   - Se desideri avviare un server locale leggero, apri il terminale nella directory del progetto e digita:
     ```bash
     python3 -m http.server 8000
     ```
   - Apri il browser all'indirizzo [http://localhost:8000](http://localhost:8000).

---

## 👥 Il Team di Agenti in Background

La suite coordina il lavoro di **8 figure specializzate** (i 5 sotto-agenti originali + i 3 agenti di copertura proposti):

1. **Orchestratore Master (CEO / Sponsor)**: L'unico front-end diretto con l'utente. Gestisce l'intervista guidata in 8 fasi, evidenzia "Red Flags" ed impone stime realistiche.
2. **CMO (Market Intelligence & Validation)**: Valuta se il problema esiste, mappa i competitor e propone protocolli di test (A/B test, landing page) a costo zero.
3. **CFO (Corporate Finance Advisor)**: Elabora il modello di business, calcola CAPEX/OPEX, il Break-Even Point e proiezioni a 12/24/36 mesi.
4. **CTO (Tech, Automation & PM)**: Definisce l'infrastruttura tecnologica lean/no-code, lo stack software ed hardware con costi effettivi e la roadmap.
5. **COO (Operations, HR & Quality)**: Mappa la catena del valore, le HR (organigramma interno/outsourcing) e la logistica.
6. **Head of Capital (Fundraising & Grants)**: Trova bandi pubblici (regionali/europei) e definisce l'identikit dell'investitore privato (Business Angel/VC) per il pitch.
7. **⚖️ CLO (Legal & Compliance - *Nuovo Agente*)**: Gestisce la tutela IP, brevetti/marchi, conformità GDPR, cookie policy e la forma societaria ottimale.
8. **🎨 CCO (Branding & Pitch Copywriter - *Nuovo Agente*)**: Propone brand name, payoff/slogan, testi per la landing page, email di outreach e cura lo storytelling del Pitch Deck.
9. **🤝 CSO (Product-Market Fit & Retention - *Nuovo Agente*)**: Mappa il flusso di onboarding dei clienti, definisce le metriche di attivazione e previene il churn (abbandono).

---

## 🛠️ Modalità di Funzionamento

L'applicazione supporta due modalità di esecuzione intercambiabili tramite la modale **Impostazioni (⚙️)** in alto a destra:

### 1. Modalità Demo / Simulazione (Default)
Permette di testare l'intera interfaccia interattiva e le 8 fasi del workflow utilizzando progetti di esempio pre-configurati.
- **GardaTech Rentals**: SaaS & IoT per la gestione energetica e degli accessi per affitti brevi sul Lago di Garda.
- **EcoWrap Italy**: E-commerce B2B di imballaggi bio con bassi minimi d'ordine autofinanziato da pre-ordini.
*Ottima per testare l'esperienza utente e comprendere la struttura dei report strategici generabili senza consumare crediti API.*

### 2. Modalità Live (Integrazione Google Gemini)
Inserendo la tua chiave API di Google Gemini nella modale **Impostazioni**, il flusso diventerà reale.
- L'Orchestratore e tutti i sotto-agenti abilitati risponderanno in tempo reale analizzando la *tua* idea di business specifica, calcolando costi reali e generando un report unico.
- I dati e la chiave API rimangono memorizzati nel browser dell'utente in `localStorage` in totale sicurezza. Nessun server esterno intermedio memorizzerà i tuoi dati.

---

## 🌍 Come Accedere da Qualsiasi Parte del Mondo (Hosting Online)

Puoi caricare questa interfaccia online gratuitamente in pochi secondi per accedervi dal tuo smartphone o tablet ovunque nel mondo:

### Opzione A: GitHub Pages (Consigliato per chi usa Git)
1. Crea un repository pubblico o privato su GitHub.
2. Carica i file (`index.html`, `style.css`, `app.js`, `gemini-api.js`, `mock-data.js`).
3. Vai su **Settings** (Impostazioni del repository) > **Pages**.
4. Sotto **Build and deployment**, seleziona il branch `main` (o `master`) e la cartella `/ (root)`. Salva.
5. In pochi istanti, GitHub ti fornirà un URL pubblico (es. `https://tuo-username.github.io/nome-repo`).

### Opzione B: Vercel (Metodo Drag & Drop più rapido)
1. Vai su [vercel.com](https://vercel.com) e accedi con un account gratuito.
2. Vai alla sezione **Deployments** o clicca su **Add New** > **Project**.
3. Puoi trascinare direttamente la cartella del progetto nell'area di upload dedicata.
4. Clicca su **Deploy**. La tua suite sarà attiva in meno di 10 secondi con un URL pubblico crittografato HTTPS.

---

## 📄 Struttura del Report Strategico & Esportazione

L'applicazione organizza il lavoro nelle **8 Fasi strategiche** descritte. 
Per ogni fase completata:
- La griglia mostra lo stato di avanzamento e i report specifici scritti da ogni sotto-agente.
- Il **Lean Canvas** si popola con gli elementi essenziali in tempo reale.
- Il **Piano Finanziario** mostra le tabelle di CAPEX/OPEX e stime elaborate dal CFO.
- Cliccando su **Esporta Report**, viene generato un file Markdown completo con tutta la documentazione, pronto per essere convertito in PDF, caricato in Notion o utilizzato come base per il Pitch Deck finale.
