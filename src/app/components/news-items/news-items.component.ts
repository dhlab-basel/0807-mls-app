import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {KnoraService} from '../../services/knora.service';
import {Constants} from '@dasch-swiss/dsp-js';


@Component({
  selector: 'app-news-items',
  template: `
    <mat-grid-list cols="6" rowHeight="1:1.5">
        <mat-grid-tile *ngFor="let x of items">
            <mat-card>
                <mat-card-title>
                {{x[1]}}
                </mat-card-title>
                <img class="newimg" mat-card-image src="{{x[3]}}"/>
                <mat-card-content>
                    <p>{{x[2]}}</p>
                </mat-card-content>
            </mat-card>
        </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: [
    '.mat-grid-list {margin-left: 50px; margin-right: 50px;}',
    '.mat-card-title {font-size: 12pt;}',
    '.newimg {max-width: 150px; max-height: 150px;}'
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
        console.log(data);
        this.items = data;
      }
    );
  }

  ngOnInit() {
    this.getNewsItems();
  }

}
