## Introduzione

Benvenuto al Virtual World Human Speed Challenge. Di solito, quando non c'è una pandemia globale in corso, organiziamo annualmente una gara nel deserto del Nevada. Appena fuori ad un paese chiamato Battle Mountain si trova una delle sezioni di strada più rettilinee al mondo. Su questa strada gareggiano bici, unicamente movimentate da forza umana, e regolarmente viene superato il limite di velocità delle statali del Nevada! (80mph circa 128km/h)
[Per maggiori informazioni sull'evento clicca qui.](http://www.ihpva.org/)

Questo simulatore ti consente di provare a gareggiare in questo evento. Semplicemente connetti il tuo smart trainer o un power meter a questa applicazione, vestiti, fai riscaldamento e gareggia!

Potrai provare differenti tattiche biciclette e impostazioni, per vedere qual'è la più veloce.

## WHPSC

Questo evento si tiene su una sezione della strada statale 305, appena fuori da Battle Mountain, Nevada. Durante l'evento la strada è chiusa al traffico. L'evento inizia con un tratto di strada lungo 5 miglia (8 km) in cui prendere la rincorsa. Dopo le 5 miglia, si trova una sezione di 200 metri esatti (0.12 miglia) in cui la tua velocità sarà misurata. Dopo questa sezione avrai circa un miglio (1.6 km) per rallentare e alla fine il tuo team potrà prenderti al volo.

Per scoprire altro sul funzionamento dell'evento [clicca qui](https://www.policumbent.it/home/#section-2958)

## Come connettere il powermeter

### Bluetooth

Questa applicazione può usare una connessione bluetooth per connettersi al tuo power meter o al tuo smart trainer. Questa funzionalità è disponibile solo su Google Chrome 83+ Scarica l'ultima versione disponibile da qui: [https://www.google.com/intl/en_en/chrome/](https://www.google.com/intl/en_en/chrome/)

*In caso di connessione lenta ti consigliamo comunque di scaricare la versione standalone da [qui](https://github.com/policumbent/WHPSC-Sim/releases)*

#### Windows/MacOS/Android

1. Vai su [policumbent.it/whpsc-sim](https://policumbent.it/whpsc-sim)
1. Connetti il tuo misuratore di potenza bluetooth.
1. Avvia una nuova run.

#### Linux

1. Sulla versione Linux di Google Chrome l'API bluetooth è solo parzialmente implementata ([vedi qui](https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md)). Per potere usare l'applicazione devi abilitare: `chrome://flags/#enable-experimental-web-platform-features`.
2. Vai su [policumbent.it/whpsc-sim](https://policumbent.it/whpsc-sim)
3. Connetti il tuo misuratore di potenza bluetooth.
4. Avvia una nuova run.

### ANT+

#### Windows

1. La prima volta
    1. Inserici l'ANT+ dongle
    1. Scarica [Zadig](https://zadig.akeo.ie/)
    1. Apri Zadig
    1. Clicca su `Options` e poi su `List All Devices`
    1. Seleziona `ANT USBStick2`
    1. Seleziona `libusb-win32 (v1.2.6.0)`
    1. Clicca su `Reinstall Driver` o `Downgrade Driver`
1. Scarica l'ultima versione dell'applicazione del simulatore [da qui](https://github.com/policumbent/WHPSC-Sim/releases)
1. Inserisci l'ANT+ dongle
1. Avvia l'app e connetti il tuo misuratore di potenza ANT+.

#### Linux/MacOS

1. Scarica l'ultima versione standalone del simulatore [da qui](https://github.com/policumbent/WHPSC-Sim/releases)
1. Inserisci l'ANT+ dongle
1. Avvia l'app e connetti il tuo misuratore di potenza ANT+.

**Per qualsiasi domanda o problema contatta [whpsc-simulator@policumbent.it](mailto:whpsc-simulator@policumbent.it).**

## Iniziare la prova

Dopo che avrai connesso il tuo power meter o il tuo smart trainer, potrai premere il tasto `start` per avviare la gara. Questo di permetterà di scegliere dei preset che abbiamo fatto per te:

- **Taurus:** questa è la simulazione di uno streamliner molto veloce. Selezionalo per fare alte velocità.
- **Recumbent bike:** questa è la simulazione di una bici reclinata veloce. Sarà sempre più veloce di una bici da strada tradizionale, ma la sua velocità non si avvicinerà minimamente a Taurus!
- **Road bicycle:** questa è una simulazione con una normale bici da strada. Sarà più veloce (probabilmente) di quella che usi normalmente, se usi le impostazioni standard ai 1400m di altitudine di Battle Mountain
- **Custom:** usa le impostazioni che ha impostato nelle impostazioni personalizzate. Puoi giocare con i vari parametri per scoprire cosa ti fa andare più veloce!

Quando avrai selezionato la bici vedrai la vista della statale 305. Preparati a partire dopo il countdown e spingere più che puoi!

Durante la gara vedrai dei cartelli stradali (sulla destra) che ti indicheranno le miglia mancanti all'arrivo. Quando arriverai a 1500 metri prima dei 200 metri finali vedrai anche nel tuo "virtual display" il conto alla rovescia. Usalo per determinare il punto per iniziare il tuo sprint.

Dopo i 200 metri normalmente inizieresti a frenare lentamente, per non surriscaldare i freni. Hai circa un miglio per rallentare e alla fine vedrai il tuo team pronto a fermarti e a prenderti per non farti cadere. Per rallentare abbiamo simulato una forza frenante basata sulla tua velocità che inizia subito dopo i 200 metri finali.

## Concludere una gara

Dopo aver concluso la tua gara ti sarà presentata una finestra per inserire i tuoi dettagli per l'inserimento nella lista dei risultati. Questo non è obbligatorio, ma se vuoi vantarti con i tuoi amici ti conviene mettere qualcosa! Puoi usare qualsiasi nome che vuoi, ma per favore sii corretto!
L'unica cosa obbligatoria, principalmente per evitare abusi, è l'inserimento di un vero indirizzo email. Manderemo un mail a questo indirizzo mail e dovrai premere sul link ricevuto per l'inseriment nella lista dei risultati. Non abuseremo o pubblicheremo il tuo indirizzo mail, [visualizza la nostra politica sulla privacy](https://www.policumbent.it/whpsc-sim/GDPR.html).

Una volta che il risultato sarà pubblicato potrai anche condividerlo su Facebook, Instagram e molti altri social.

Ora prenditi il tuo meritato riposo e ... prova di nuovo!

## Impostazioni

Inoltre puoi personalizzare e modificare il simulatore modificando le seguenti impostazioni.

- **Rider weight:** (Peso ciclista) Influenza l'energia dissipata dalla resistenza al rotolamento ed è usata per calcolare il contributo della pendenza.

- **Rider height:** (Altezza ciclista) Influenza la resistenza dell'aria per le biciclette non carenate.

- **Altitude/Temperature/Humidity:**  (Altitudine/Temperatura/Umidità) Influenzano la densità dell'aria. Decrementare la densità dell'aria farà andare la bici più veloce. Nella realtà puoi ottenere questo andando ad altituini più alte, in posti caldi e poco umidi. Ovviamente non si potrà mai ridurre la densità dell'aria a zero, altrimenti non potresti respirare.

Quando modifichi queste impostazioni per usarle dovrai iniziare la gara con un `custom streamliner`.

- **Bike weight:** *(default : 30 kg)* (Peso della bicicletta) È usata per calcolare l'energia dissipata dalla resistenza al rotolamento ed è usata per calcolare il contributo della pendenza.

- **Wheels inertia:** *(default 0.09)* (Inerzia ruote) Quanto le tue ruote continueranno a girare e quanto è difficile iniziare a farle girare. Impostando un valore piccolo le ruote inizieranno a girare con più facilità, ma perderanno anche velocità più rapidamente.

- **Efficiency:** *(default : 0.95)* (Efficienza) Questa è l'efficienza della trasmissione della bici. Un alto valore permette una maggiore conversione della potenza in ingresso in velocità.

- **Wheels circumference** *(default : 1.45)* (Circonferenza ruote) Questo permette di simulare ruote più piccole e più grandi. Ruote più grandi hanno minore resistenza al rotolamento.

- **Frontal Area:** *(default : 0.3m²)* (Area frontale) Questo valore controlla l'area frontale della tua bici. Più piccola è l'area frontale, più veloce sarà la tua bici. Ovviamente nel mondo reale la dimenione della tua bici sarà controllata da molti più fattori che un semplice slider. La cosa più importante ovviamente … sei tu! Entreresti mai in una bici con un'area frontale di 0.01 m²?

- **Cd @ 120 km/h** *(default : 0.05)* Questo è il coefficiente di drag della tua bici personalizzata. Un drag piccolo significa principalmente bici maggiormente affusolata. Le biciclette che corrono a Battle Mountain sono molto ben disegnate per avere un basso coefficiente di drag. Come esempio un normale ciclista con una bici da strada ha un Cd di 0.67 e una tipica automobile veloce da 0.25 a 0.32! Il coefficiente di drag totale delle biciclette che corrono a Battle Mountain è tipicamente lo stesso coefficiente di drag dello specchietto di una macchina!

Clicca su **Save** per salvare localmente le tue impostazioni. Quando clicchi su `start` queste impostazioni saranno usate per calcolare la velocità.

## Requirements

- **Android:** Requires Android 6.0 Marshmallow or later.
- **Mac:** Requires OS X Yosemite or later. (Some MacBooks may not work: Check "About this Mac" / "System Report" / "Bluetooth" and verify that Low Energy is supported.)
- **Linux:** Requires Kernel 3.19+ and BlueZ 5.41+ installed. Read How to get Chrome Web Bluetooth working on Linux.(Note that Bluetooth daemon needs to run with experimental interfaces if BlueZ version is lower than 5.43: sudo /usr/sbin/bluetoothd -E)
- **Windows:** Requires Windows 10 version 1706 (Creators Update) or later.
- **IOS and ipadOS:** Not supported at this time
