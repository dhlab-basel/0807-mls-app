import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  template: `
    <mat-card>
      <mat-card-title>
        Das Musiklexikon der Schweiz (MLS): Musikgeschichte der Schweiz auf einen Klick
      </mat-card-title>
      <mat-card-content>
        Das <em>Musiklexikon der Schweiz</em> will fundierte und zeitgemässe Information über die Musikgeschichte in der Schweiz
        online unentgeltlich zur Verfügung stellen. Personen, Institutionen und musikbezogene Objekte zu allen Sparten des
        Musiklebens werden berücksichtigt: Volks- und Popularmusik, Klassik, Musikerziehung oder Festivals. Gleichzeitig
        ermöglicht das MLS den Zugang zur älteren Lexikographie und vernetzt die Information national und international
        mit wissenschaftlichen Informationsquellen. Damit kann der Leser die zeitliche Entwicklung musikhistorischen Wissen
        und den Vorgang der Informationsgewinnung und Verdichtung einfach und intuitiv erleben.
      </mat-card-content>
    </mat-card>
    <mat-card>
      <mat-card-title>
        Warum ein neues Musiklexikon?
      </mat-card-title>
      <mat-card-content>
        Weil die Schweiz noch keines hat! Wir brauchen – wie andere Länder auch – ein zeitgemässes online-Informationssystem
        zur Schweizer Musikgeschichte. Die bestehende Information ist veraltet, die Lexika vernachlässigen wichtige Aspekte
        der Musikgeschichte wie etwa Institutionen, Popularmusik, Orte und musikrelevante Objekte.
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-title>
        Ein neues Musiklexikon, für wen?
      </mat-card-title>
      <mat-card-content>
        Für alle, die sich für Musik in und aus der Schweiz interessieren: Musizierende und Publikum, Forschende und
        Institutionen, Lehrende und Lernende.
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-title>
        Was findet man im MLS?
      </mat-card-title>
      <mat-card-content>
        Biographien, Sachartikel, Ortsartikel
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-title>
        Wie wird das MLS aussehen?
      </mat-card-title>
      <mat-card-content>
        Multimediales und digitales Lexikon mit Text, Ton und Bild. Im Internet frei zugänglich. Sprachen: deutsch, französisch,
        italienisch, englisch
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-title>
        Was bisher geschah...
      </mat-card-title>
      <mat-card-content>
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
      </mat-card-content>
    </mat-card>
  `,
  styles: []
})
export class InfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
