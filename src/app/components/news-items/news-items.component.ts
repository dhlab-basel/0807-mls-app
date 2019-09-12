import { Component, OnInit } from '@angular/core';
import { KnoraApiService } from '../../services/knora-api.service';
import { KnoraResource, KnoraStillImageFileValue } from 'knora-jsonld-simplify/dist';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-news-items',
  template: `
    <mat-grid-list cols="6" rowHeight="1:2">
        <mat-grid-tile *ngFor="let x of items">
            <mat-card>
                <mat-card-title>
                {{x.itemTitle}}
                </mat-card-title>
                <img mat-card-image src="{{x.itemImage}}"/>
                <mat-card-content>
                    <p>{{x.itemText}}</p>
                </mat-card-content>
            </mat-card>
        </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: []
})
export class NewsItemsComponent implements OnInit {
  today: string;
  items: Array<{[index: string]: string}> = [];

  constructor(private knoraApiService: KnoraApiService,
              private datePipe: DatePipe) {
    const myDate = new Date();
    this.today = 'GREGORIAN:' + this.datePipe.transform(myDate, 'yyyy-MM-dd');
  }

  getNewsItems() {
    const params =  {
      today: this.today
    };
    this.knoraApiService.gravsearchQuery('newsitem_search', params)
      .subscribe((data: Array<KnoraResource>) => {
        this.items = data.map((x) => {
          const itemTitle = x ? x.getValue('mls:hasNewsTitle') : undefined;
          const itemImage = x ? x.getValue('knora-api:hasStillImageFileValue') : undefined;
          const itemText = x ? x.getValue('mls:hasNewsText') : undefined;
          return {
            itemTitle: itemTitle ? itemTitle.strval : '-',
            itemImage: itemImage ? itemImage.strval : 'XXX',
            itemText: itemText ? itemText.strval : '?'
          };
        });
        console.log(data);
      });
  }

  ngOnInit() {
    this.getNewsItems();
  }

}
