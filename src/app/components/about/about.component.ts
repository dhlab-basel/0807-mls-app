import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="maindiv" layout-fill>
      <mat-grid-list cols="1">
        <mat-card>
          <mat-card-title>Trägerschaft</mat-card-title>
          <mat-card-content>Schweizer Musikrat (SMR)</mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-title>Auftragnehmerin</mat-card-title>
          <mat-card-content>
            Schweizerische Musikforschende Gesellschaft<br/>
            Prof. Dr. Cristina Urchueguía (Zentralpräsidentin)<br/>
            Institut für Musikwissenschaft<br/>
            Mittelstrasse 43<br/>
            3012 Bern<br/>
            Tel.: 031 631 50 30<br/>
            E-Mail: <a href="mailto:urchueguia@musik.unibe.ch">urchueguia@musik.unibe.ch</a><br/>
            Webseite: <a href="https://www.smg-ssm.ch">www.smg-ssm.ch</a><br/>

          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>Steuerungsgruppe</mat-card-title>
          <mat-card-content>
            <ul>
              <li>Prof. Dr. Cristina Urchueguía (Vorsitz)</li>
              <li>Dr. Caiti Hauck-Silva</li>
              <li>Dr. Marco Jorio</li>
              <li>Dr. Moritz Kelber</li>
              <li>Dr. Irène Minder-Jeanneret</li>
              <li>Pio Pellizzari</li>
              <li>Prof. Dr. Stefanie Stadler</li>
            </ul>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>Bisherige Miterabeiter_innen</mat-card-title>
          <mat-card-content>
            <ul>
              <li>Henry Hope</li>
              <li>Martin Pensa</li>
              <li>Nemanja Radivojevic</li>
              <li>Eleni Ralli</li>
              <li>Stefano Kunz</li>
              <li>Viviane Sonderegger</li>
              <li>Florence Weber</li>
            </ul>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>Probeartikel</mat-card-title>
          <mat-card-content>
            <ul>
              <li>Irène Minder-Jeanneret</li>
              <li>Marco Jorio</li>
              <li>Cristina Urchueguía </li>
              <li>Beatrice Wolf-Furrer</li>
            </ul>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>Hosting, Software & Data Modelling</mat-card-title>
          <mat-card-subtitle>
            Hosting
          </mat-card-subtitle>
          <mat-card-content>
            Die Daten werden vom
              <a href="https://dasch.swiss">Data and Service Center for the Humanities</a> (DaSCH)
            vorgehalten und basieren auf der DaSCH Service Plattform, welche die langfristige
            Zugänglichkeit zum MLS garantiert.
          </mat-card-content>
          <mat-card-subtitle>
            Software & Data Modeling
          </mat-card-subtitle>
          <mat-card-content>
            <ul>
              <li>Prof. Dr. Lukas Rosenthaler (Digital Humanities Lab, Universität Basel)</li>
            </ul>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-title>Spenden</mat-card-title>
          <mat-card-content>
            Schweiz. Musikforschende Gesellschaft (SMG)<br/>
            Zentralkasse<br/>
            Basel<br/>
            PC 40-8129-6<br/>
            IBAN CH65 0900 0000 4000 8129 6<br/>
            BIC POFICHBEXXX<br/>
            Referenz: Spende MLS<br/>
            <h2>Informationen zum Projekt erhalten Sie unter:</h2>
            <a href="https://www.smg-ssm.ch/smg-ssm/forschungs-publikationen/musiklexikon-der-schweiz/">https://www.smg-ssm.ch/smg-ssm/forschungs-publikationen/musiklexikon-der-schweiz/</a>
            <p>Informationen zur Gesellschaft und zum aktuellen Programm aller Sektionen finden Sie unter:<br/>
              <a href="https://www.smg-ssm.ch">www.smg-ssm.ch</a>
            </p>
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
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
