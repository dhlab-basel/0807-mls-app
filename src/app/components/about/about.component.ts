import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
      <mat-card>
              <p>
                  Schweizerische Musikforschende Gesellschaft<br/>
                  Prof. Dr. Cristina Urchueguía (Vorsitz)<br/>
                  Institut für Musikwissenschaft<br/>
                  Mittelstrasse 43<br/>
                  3012 Bern<br/>
                  Tel.: 031 631 50 30<br/>
                  E-Mail: <a href="mailto:urchueguia@musik.unibe.ch">urchueguia@musik.unibe.ch</a><br/>
                  Webseite: <a href="https://www.smg-ssm.ch">www.smg-ssm.ch</a><br/>
              </p>
              <p>
                  Informationen zum Projekt erhalten Sie unter:<br/>
                  <a href="https://www.smg-ssm.ch/smg-ssm/forschungs-publikationen/musiklexikon-der-schweiz/">https://www.smg-ssm.ch/smg-ssm/forschungs-publikationen/musiklexikon-der-schweiz/</a>
              </p>
              <p>Informationen zur Gesellschaft und zum aktuellen Programm aller Sektionen finden Sie unter:<br/>
                  <a href="https://www.smg-ssm.ch">www.smg-ssm.ch</a>
              </p>

              <h2>Im Auftrag von</h2>
              <p>Schweizer Musikrat SMR</p>

              <h2>Kooperationspartner</h2>
              <p>
                  <mat-grid-list cols="6" rowHeight>
                      <mat-grid-tile>
                        <img mat-card-image src="../assets/logo-sagw.svg" class="fit"/>
                      </mat-grid-tile>
                      <mat-grid-tile>
                          <img mat-card-image src="../assets/DaSCH_Logo_RGB.png" class="fit"/>
                      </mat-grid-tile>
                      <mat-grid-tile>
                          <img mat-card-image src="../assets/Unibe_Logo_16pt_RGB_201807_o_R_l.png" class="fit"/>
                      </mat-grid-tile>
                      <mat-grid-tile>
                          <img mat-card-image src="../assets/metagrid_logo-250@2x.png" class="fit"/>
                      </mat-grid-tile>
                      <mat-grid-tile>
                          <img mat-card-image src="../assets/histhub.svg" class="fit"/>
                      </mat-grid-tile>
                      <mat-grid-tile>
                          <img mat-card-image src="../assets/Suisa_Logo.svg.png" class="fit"/>
                      </mat-grid-tile>
                  </mat-grid-list>
              </p>

              <p>Logo Design: Margrit Hänni</p>

      </mat-card>
  `,
  styles: [
    'img.fit {max-width: 100%; height: auto;}'
  ]
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
