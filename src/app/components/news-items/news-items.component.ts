import {AfterContentInit, Component, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  ItemData,
  KnoraService,
  LinkPropertyData,
  PropertyData,
  ResourceData,
  StillImagePropertyData
} from '../../services/knora.service';
import {Constants, ReadDateValue} from '@dasch-swiss/dsp-js';
import {AppInitService} from '../../app-init.service';
import {Router} from '@angular/router';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import {MatGridList} from '@angular/material/grid-list';

/*
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
*/
@Component({
  selector: 'app-news-items',
  template: `
    <div  *ngIf="knoraService.loggedin" class="with-margin">
      <button mat-raised-button (click)="addNewsItem()">Neuer News-Beitrag</button>
    </div>
    <mat-grid-list #grid rowHeight="1:2">
        <mat-grid-tile *ngFor="let x of newsItems">
          <mat-card>
            <mat-card-title>
              {{x.title}}
            </mat-card-title>
            <img mat-card-image [src]="x.iiifImageUrl | safe: 'url'" (click)="gotoNewsItem(x.id)" class="clickable" />
            <mat-card-content >
              <div flex [innerHTML]="x.text | safe: 'html'"></div>
              <div *ngIf="x.lemmaId">Lemma: <button mat-button (click)="gotoLemma(x.lemmaId)">{{x.lemmaName}}</button></div>
              <div *ngIf="x.weblink">Weblink: <a [href]="x.weblink">{{x.weblink}}</a></div>
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
    '.mat-grid-list {margin-top: 10px; justify-content: flex-start !important; align-items: flex-start !important;}',
    '.mat-card {margin: 1.5em; border-width: 1em;}',
    '.mat-card-title {font-size: 14pt;}',
    '.mat-card-content { height: 200px; overflow-y: auto; }',
    '.with-margin {margin-left: 5px; margin-top: 5px; margin-bottom: 5px;}',
    '.clickable {cursor: pointer;}'
  ]
})

export class NewsItemsComponent implements OnInit, AfterContentInit {
  @ViewChild('grid') grid: MatGridList;
  mlsOntology: string;
  today: string;
  newsItems: Array<ItemData> = [];
  showall: boolean;
  gridByBreakpoint = {
    xl: 4,
    lg: 3,
    md: 2,
    sm: 1,
    xs: 1
  };

  constructor(private appInitService: AppInitService,
              public knoraService: KnoraService,
              private datePipe: DatePipe,
              private router: Router,
              private observableMedia: MediaObserver) {
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
                break;
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

  ngAfterContentInit() {
    this.observableMedia.asObservable().subscribe((change: Array<MediaChange>) => {
      this.grid.cols = this.gridByBreakpoint[change[0].mqAlias];
    });
  }
  gotoLemma(id) {
    this.router.navigate(['/lemma', id]);
  }

  gotoNewsItem(id) {
    this.router.navigate(['/newsitem', id]);
  }

  editNewsItem(id) {
    this.router.navigate(['/editnews', id]);
  }

  addNewsItem() {
    this.router.navigate(['/editnews']);
  }

}
