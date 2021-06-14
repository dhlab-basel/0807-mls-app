import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  template: `
    <div class="maindiv" layout-fill>
    <mat-grid-list cols="1">
      <mat-card>
        <mat-card-title>
          Das Musiklexikon der Schweiz (MLS): Musikgeschichte der Schweiz auf einen Klick
        </mat-card-title>
        <mat-card-content>
          <p>Das <em>Musiklexikon der Schweiz</em> will fundierte und zeitgemässe Information über die Musikgeschichte in der Schweiz
            online unentgeltlich zur Verfügung stellen. Relevante Personen der Schweizer Musikgeschichte, Institutionen und
            musikbezogene Objekte zu allen Sparten des Musiklebens werden berücksichtigt: Volks- und Popularmusik, Klassik,
            Musikerziehung oder Festivals.</p>
          <p>In einem ersten Schritt ermöglicht das MLS den Zugang zur älteren Lexikographie und vernetzt die Information
            national und international mit wissenschaftlichen Informationsquellen.</p>
          <ul>
            <li>Rechtsfreie Lexika sind im Volltext digitalisiert zugänglich.</li>
            <li>Unentgeltlich zugängliche wissenschaftliche Online-Lexika werden verlinkt.</li>
            <li>Auf den Inhalt urheberrechtlich geschützter Lexika wird verwiesen, ohne den Text zur Verfügung zu stellen. Die
              Inhalte werden bei Verfall des Urheberschutzes laufend ergänzt.</li>
            <li>Wissenschaftliche Stichwortlisten sind als Platzhalter für neue Artikel berücksichtigt worden.</li>
          </ul>

          <p>Die vorhandene Lexikographie beschränkt sich auf Personenartikel, daher erscheinen in dieser Phase nur
            personenbezogene Inhalte.</p>

          <p>Damit kann der Leser die zeitliche Entwicklung musikhistorischen Wissens und den Vorgang der
            Informationsgewinnung und Verdichtung einfach und intuitiv erleben.</p>

          <p>Die nächste Phase soll neue Artikel zu Personen, Objekten und Institutionen hinzufügen.</p>

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
          <ul>
            <li>digital</li>
            <li>multimedial (Text, Ton und Bild)</li>
            <li>frei zugänglich</li>
            <li>mehrsprachig</li>
          </ul>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>
          Was bisher geschah...
        </mat-card-title>
        <mat-card-content>
          <ul>
            <li>konzeptionelle Grundlagen und Probeartikel ausgearbeitet</li>
            <li>Stichwortliste mit 6’800 Einträgen erstellt</li>
            <li>13’500 Artikel aus älteren Lexika zu 6‘800 Personen digital erfasst, vereinheitlicht und indexiert</li>
            <li>MLS-Prototyp mit weiteren musikwissenschaftlichen Angeboten über Metagrid vernetzt</li>
            <li>Kooperation mit verwandten Unternehmen (so mit dem Historischen Lexikon der Schweiz, HistHub, usw.) eingeleitet</li>
            <li>Wie soll es weitergehen? 2019–2021</li>
            <li>Aufschaltung des MLS-Prototyps: Fühjahr 2020</li>
            <li>Aufbau der Lexikonredaktion, Erarbeitung der Redaktionsrichtlinien: 2020-2021</li>
            <li>Rekrutierung der Autorinnen und Autoren: ab 2029</li>
            <li>Redaktion der eingegangenen Biographien und Integration in das MLS: ab 2020</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </mat-grid-list>
    </div>
  `,
  styles: [
    '.maindiv {display: flex; justify-content: center; align-items: center;}',
    '.mat-card {max-width: 800px; margin: 3em;}',
    '.mat-card-subtitle {font-size: 16px; font-weight: bold;}',
  ]
})
export class InfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
