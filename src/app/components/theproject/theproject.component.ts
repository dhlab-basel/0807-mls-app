import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theproject',
  template: `
    <mat-card>
      <mat-card-title>Wir brauchen Sie!</mat-card-title>
      <mat-card-content>
        Das MLS ist für Produktion, Trägerschaft und Finanzierung auf zahlreiche Mitarbeiterinnen und Mitarbeiter angewiesen.
        Haben Sie Lust, mitzumachen oder mitzufinanzieren?<br>
        Kontaktadresse: <a href="mailto:info@smg-ssm.ch?subject=MLS">info@smg-ssm.ch (Betreff: MLS)</a>
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
       </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-title>
        Kooperationspartner
      </mat-card-title>
      <mat-card-content>
        <mat-grid-list cols="6" rowHeight>
          <mat-grid-tile>
            <img mat-card-image src="../assets/logo-sagw.svg" class="fit" style="padding: 100px;"/>
          </mat-grid-tile>
          <mat-grid-tile>
            <img mat-card-image src="../assets/DaSCH_Logo_RGB.png" class="fit" style="padding: 100px;"/>
          </mat-grid-tile>
          <mat-grid-tile>
            <img mat-card-image src="../assets/Unibe_Logo_16pt_RGB_201807_o_R_l.png" class="fit" style="padding: 100px;"/>
          </mat-grid-tile>
          <mat-grid-tile>
            <img mat-card-image src="../assets/metagrid_logo-250@2x.png" class="fit" style="padding: 100px;"/>
          </mat-grid-tile>
          <mat-grid-tile>
            <img mat-card-image src="../assets/histhub.svg" class="fit" style="padding: 100px;"/>
          </mat-grid-tile>
          <mat-grid-tile>
            <img mat-card-image src="../assets/Suisa_Logo.svg.png" class="fit" style="padding: 100px;"/>
          </mat-grid-tile>
        </mat-grid-list>
        <p>Logo Design: Margrit Hänni</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    'img.fit {max-width: 100%; height: auto;}'
  ]
})
export class TheprojectComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
