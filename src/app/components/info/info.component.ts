import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  template: `
    <mat-card>
        <h2>Das Musiklexikon der Schweiz (MLS): Musikgeschichte der Schweiz auf einen Klick</h2>
        <p>Das <em>Musiklexikon der Schweiz</em> will fundierte und zeitgemässe Information über die Musikgeschichte in der Schweiz
            online unentgeltlich zur Verfügung stellen. Personen, Institutionen und musikbezogene Objekte zu allen Sparten des
            Musiklebens werden berücksichtigt: Volks- und Popularmusik, Klassik, Musikerziehung oder Festivals. Gleichzeitig
            ermöglicht das MLS den Zugang zur älteren Lexikographie und vernetzt die Information national und international
            mit wissenschaftlichen Informationsquellen. Damit kann der Leser die zeitliche Entwicklung musikhistorischen Wissen
            und den Vorgang der Informationsgewinnung und Verdichtung einfach und intuitiv erleben.</p>

        <h2>Warum ein neues Musiklexikon?</h2>
        <p>Weil die Schweiz noch keines hat! Wir brauchen – wie andere Länder auch – ein zeitgemässes online-Informationssystem
            zur Schweizer Musikgeschichte. Die bestehende Information ist veraltet, die Lexika vernachlässigen wichtige Aspekte
            der Musikgeschichte wie etwa Institutionen, Popularmusik, Orte und musikrelevante Objekte.</p>

        <h2>Ein neues Musiklexikon, für wen?</h2>
        <p>Für alle, die sich für Musik in und aus der Schweiz interessieren: Musizierende und Publikum, Forschende und
            Institutionen, Lehrende und Lernende.</p>

        <h2>Was findet man im MLS?</h2>
        <p>Biographien, Sachartikel, Ortsartikel</p>

        <h2>Wie wird das MLS aussehen?</h2>
        <p>Multimediales und digitales Lexikon mit Text, Ton und Bild. Im Internet frei zugänglich. Sprachen: deutsch, französisch,
            italienisch, englisch</p>

        <h2>Wer macht was?</h2>
        <p>Trägerschaft: Schweizer Musikrat (SMR)<br/>
            Auftragnehmerin: Schweizerische Musikforschende Gesellschaft (SMG), Steuerungsgruppe unter dem Vorsitz von
            Prof. Dr. Cristina Urchueguía (Universität Bern; Zentralpräsidentin SMG)</p>

        <h2>Was bisher geschah</h2>
        <ul>
            <li>konzeptionelle Grundlagen und Probeartikel ausgearbeitet</li>
            <li>Stichwortliste mit 3500 Einträgen erstellt</li>
            <li>12‘000 Artikel aus älteren Lexika zu 6‘800 Personen digital erfasst, vereinheitlicht und indexiert</li>
            <li>MLS-Prototyp mit weiteren musikwissenschaftlichen Angeboten über Metagrid vernetzt</li>
            <li>Kooperation mit verwandten Unternehmen (so mit dem Historischen Lexikon der Schweiz, HistHub, usw.) eingeleitet</li>
            <li>Wie soll es weitergehen? 2019–2021</li>
            <li>Aufschaltung des MLS-Prototyps: Herbst 2019</li>
            <li>Aufbau der Lexikonredaktion, Erarbeitung der Redaktionsrichtlinien: 2019</li>
            <li>Rekrutierung der Autorinnen und Autoren: ab 2019</li>
            <li>Redaktion der eingegangenen Biographien und Integration in das MLS: ab 2020</li>
        </ul>

        <h2>Wir brauchen Sie!</h2>
        <p>
            Das MLS ist für Produktion, Trägerschaft und Finanzierung auf zahlreiche Mitarbeiterinnen und Mitarbeiter angewiesen.
            Haben Sie Lust, mitzu¬machen oder mitzufinanzieren?<br>
            Kontaktadresse: <a href="mailto:info@smg-ssm.ch?subject=MLS">info@smg-ssm.ch (Betreff: MLS)</a>
        </p>

        <h2>Spenden</h2>
        <p>
            Schweiz. Musikforschende Gesellschaft (SMG)<br/>
            Zentralkasse<br/>
            Basel<br/>
            PC 40-8129-6<br/>
            IBAN CH65 0900 0000 4000 8129 6<br/>
            BIC POFICHBEXXX<br/>
            Referenz: Spende MLS<br/>
        </p>
    </mat-card>
  `,
  styles: []
})
export class InfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
