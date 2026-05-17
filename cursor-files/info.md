# Contenuti del sitoScuderia DIIEM 

## Presentazione della scuderia DIIEM
Siamo la scuderia Diiem del dipartimento di Ingegneria Industriale Elettronica e Meccanica dell’Università Roma Tre. La nostra squadra sta costruendo un Rov (veicolo subacqueo guidato da remoto), un float (boa che fa delle misurazioni del fondale), l’Arm (il braccio che si attacca al rov per interagire con oggetti) e la Ground station (una valigetta a cui si attacca il cavo Ethernet che arriva dal rov per comunicare, ha schermo e tastiera per interagire con l’interfaccia grafica).

## Obiettivi
Il nostro obiettivo è quello di partecipare alla MateRov competition (https://materovcompetition.org/), una competizione che quest’anno si terrà in Canada in cui diverse squadre competono in sfide subacquee. Parte della competizione è simulare il nostro progetto come company e produrre report e documentazione, ci sono CEO cto e capi progetti.

## Competizione MATE ROV
La **MATE ROV Competition** utilizza la robotica subacquea (ovvero i veicoli a comando remoto, *remotely operated vehicles* o **ROV**) per ispirare e stimolare gli studenti ad apprendere e applicare in modo creativo competenze scientifiche, ingegneristiche e tecniche nella risoluzione di problemi reali.

Questa competizione sfida studenti delle scuole **K-12**, dei **college comunitari** e delle **università** di tutto il mondo ad affrontare missioni basate su scenari del mondo del lavoro, incoraggiandoli a collaborare, fare networking e imparare sia da professionisti tecnici sia gli uni dagli altri.

## Il ROV
Il nostro Rov è composto da un core centrale che contiene tutta l’elettronica e il telaio progettato da noi è completamente stampato in 3D. Usiamo sei thruster per manovrare il rov su tutti gli assi ed è controllato attraverso la ground station con un controller dell’Xbox. Sull’anteriore sono presenti due luci led che illuminano la vista della camera posta nel dome del core. Sui lati, integrati tra i thruster ed il core ci sono i volumi di galleggiamento. Dietro il tappo del core in cui sono presenti i cavi che entrato nei motori ed il cordone con energia ed informazione che arriva alla ground station.

### Architettura del ROV
- Due convertitore 48v-12v
- Sei esc per i thruster 
- Sensori di temperatura, umidità, pressione, infiltrazione d’acqua e imu 
- Camera
- Raspberry Pi 5
- Dissipatore 
- Pompa per il dissipatore

## Float
l float è una boa che viene trasportata dal rov in un punto della piscina, una volta messa in posizione parte una routine che la fa immergere fino al fondale. Il sensore di pressione ricava la profondità e una volta riemersa manda le informazioni prese alla ground station tramite antenne

## Ground station

### Architettura della ground station
- Nella ground station ci sta un Raspberry Pi 5

## Link social
- Instagram: https://www.instagram.com/scuderia_diiem/
- LinkedIn: https://www.linkedin.com/company/scuderia-diiem-roma-tre
- GitHub: https://github.com/Scuderia-DIIEM
