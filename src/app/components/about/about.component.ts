import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
     <mat-card>
        <mat-card-title>Trägerschaft</mat-card-title>
        <mat-card-content>Schweizer Musikrat (SMR)</mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-title>Auftragnehmerin</mat-card-title>
        <mat-card-content>
          Schweizerische Musikforschende Gesellschaft (SMG), Steuerungsgruppe unter dem Vorsitz von
          Prof. Dr. Cristina Urchueguía (Universität Bern; Zentralpräsidentin SMG)<br/>
          Schweizerische Musikforschende Gesellschaft<br/>
          Prof. Dr. Cristina Urchueguía (Vorsitz)<br/>
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
            <li>Prof. Dr. Cristina Urchueguía (Universität Bern, Vorsitz)</li>
            <li>Dr. Caiti Hauck-Silva</li>
            <li>Dr. Marco Jorio</li>
            <li>Dr. Moritz Kelber</li>
            <li>Stefano Kunz</li>
            <li>Dr. Irène Minder-Jeanneret</li>
            <li>Pio Pellizzari</li>
            <li>Prof. Dr. Stefanie Stadler</li>
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
  `,
  styles: [

  ]
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
