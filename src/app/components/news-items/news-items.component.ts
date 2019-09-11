import { Component, OnInit } from '@angular/core';
import { KnoraApiService } from '../../services/knora-api.service';
import { KnoraResource } from 'knora-jsonld-simplify/dist';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-news-items',
  template: `
    <p>
      news-items works!
    </p>
  `,
  styles: []
})
export class NewsItemsComponent implements OnInit {
  today: string;

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
        console.log(data);
      });
  }

  ngOnInit() {
    this.getNewsItems();
  }

}
