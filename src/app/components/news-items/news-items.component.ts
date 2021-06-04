import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';
import {KnoraService} from '../../services/knora.service';
import {Constants} from '@dasch-swiss/dsp-js';


@Component({
  selector: 'app-news-items',
  template: `
    <mat-grid-list cols="3" rowHeight="1:1">
        <mat-grid-tile *ngFor="let x of items">
          <mat-grid-tile-header>
            {{x[1]}}
          </mat-grid-tile-header>
          <mat-card role="main">
                <img mat-card-image layout-fill [src]="x[3] | safe: 'url'"/>
                <mat-card-content>
                    <div [innerHTML]="x[2] | safe: 'html'"></div>
                </mat-card-content>
            </mat-card>
        </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: [
    '.mat-grid-list {margin-left: 50px; margin-right: 50px;}',
    '.mat-card-title {font-size: 12pt;}',
    '.newimg {max-width: 512px; max-height: 512px;}'
  ]
})

export class NewsItemsComponent implements OnInit {
  today: string;
  items: Array<Array<string>> = [];

  constructor(private knoraService: KnoraService,
              private datePipe: DatePipe) {
    const myDate = new Date();
    this.today = 'GREGORIAN:' + this.datePipe.transform(myDate, 'yyyy-MM-dd');
  }

  getNewsItems() {
    const params =  {
      today: this.today
    };
    const fields: Array<string> = [
      'id',
      this.knoraService.mlsOntology + 'hasNewsTitle',
      this.knoraService.mlsOntology + 'hasNewsText',
      Constants.KnoraApiV2 + Constants.HashDelimiter + 'hasStillImageFileValue'
    ];

    this.knoraService.gravsearchQuery('newsitem_search', params, fields).subscribe(
      (data) => {
        console.log('NEWSITEMS=', data);
        this.items = data;
      }
    );
  }

  ngOnInit() {
    this.getNewsItems();
  }

}
