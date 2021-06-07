import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';
import {KnoraService, LinkPropertyData, PropertyData, ResourceData, StillImagePropertyData} from '../../services/knora.service';
import {Constants, ReadDateValue} from '@dasch-swiss/dsp-js';
import {AppInitService} from '../../app-init.service';
import {Router} from '@angular/router';

interface ItemData {
  id: string;
  title?: string;
  iiifImageUrl?: string;
  text?: string;
  lemmaName?: string;
  lemmaId?: string;
  weblink?: string;
  date?: string;
}

@Component({
  selector: 'app-news-items',
  template: `
    <mat-grid-list cols="3" rowHeight="1:1.5">
        <mat-grid-tile *ngFor="let x of newsItems">
          <mat-grid-tile-header>
            {{x.title}}
          </mat-grid-tile-header>
          <mat-card role="main">
            <mat-card-title>
              <img mat-card-image layout-fill [src]="x.iiifImageUrl | safe: 'url'"/>
            </mat-card-title>
            <mat-card-content >
              <div flex [innerHTML]="x.text | safe: 'html'"></div>
              <div>Lemma: <button mat-button (click)="gotoLemma(x.lemmaId)">{{x.lemmaName}}</button></div>
              <div *ngIf="showall">Periode: {{x.date}}</div>
            </mat-card-content>
            <mat-card-actions *ngIf="showall && knoraService.loggedin">
              <button type="submit" class="mat-raised-button mat-primary" (click)="editNewsItem(x.id)">Edit</button>
            </mat-card-actions>
            </mat-card>

        </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: [
    '.mat-grid-list {margin-left: 50px; margin-right: 50px;}',
    '.mat-card-title {font-size: 12pt; max-height: 300px}',
    '.mat-card-content { max-height: 200px; overflow-y: auto; }',
    '.newimg {max-width: 512px; max-height: 512px;}'
  ]
})

export class NewsItemsComponent implements OnInit {
  mlsOntology: string;
  today: string;
  newsItems: Array<ItemData> = [];
  showall: boolean;

  constructor(private appInitService: AppInitService,
              private knoraService: KnoraService,
              private datePipe: DatePipe,
              private router: Router) {
    const myDate = new Date();
    this.today = 'GREGORIAN:' + this.datePipe.transform(myDate, 'yyyy-MM-dd');
    this.mlsOntology = appInitService.getSettings().ontologyPrefix + '/ontology/0807/mls/v2#';
    this.showall = this.router.url === '/allnews';
  }

  getNewsItems() {
    const a = {};
    const b = { today: this.today };
    const params = (this.showall) ? {} : b;

    const fields: Array<string> = [
      'id',
      this.knoraService.mlsOntology + 'hasNewsTitle',
      this.knoraService.mlsOntology + 'hasNewsText',
      Constants.HasStillImageFileValue,
      Constants.StillImageFileValueHasIIIFBaseUrl,
      this.knoraService.mlsOntology + 'hasNewsitemLinkToLemmaValue',
      this.knoraService.mlsOntology + 'hasNewsitemWeblink',
      this.knoraService.mlsOntology + 'hasNewitemActiveDate'
    ];

    this.knoraService.gravsearchQueryObj('newsitem_search', params).subscribe(
      (datas) => {
        for (const data of datas) {
          const gaga: ItemData = {id: data.id};
          for (const p of data.properties) {
            switch (p.propname) {
              case this.mlsOntology + 'hasNewsTitle': {
                gaga.title = p.values[0];
                break;
              }
              case this.mlsOntology + 'hasNewsText': {
                gaga.text = p.values[0];
                break;
              }
              case this.mlsOntology + 'hasNewsitemWeblink': {
                gaga.weblink = p.values[0];
                break;
              }
              case this.mlsOntology + 'hasNewsitemLinkToLemmaValue': {
                const pp = p as LinkPropertyData;
                gaga.lemmaId = pp.resourceIris[0];
                gaga.lemmaName = pp.values[0];
                break;
              }
              case Constants.HasStillImageFileValue: {
                const pp = p as StillImagePropertyData;
                gaga.iiifImageUrl = pp.iiifBase + '/' + pp.filename + '/full/^!1024,1024/0/default.jpg';
              }
              case this.mlsOntology + 'hasNewitemActiveDate': {
                gaga.date = p.values[0];
                break;
              }
            }
          }
          this.newsItems.push(gaga);
        }
      }
    );
  }

  ngOnInit() {
    this.getNewsItems();
  }

  gotoLemma(id) {
    this.router.navigate(['/lemma', id]);
  }

  editNewsItem(id) {
    this.router.navigate(['/editnews', id]);
  }

}
