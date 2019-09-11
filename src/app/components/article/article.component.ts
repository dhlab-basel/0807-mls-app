import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {KnoraApiService} from '../../services/knora-api.service';

@Component({
  selector: 'app-article',
  template: `
    <mat-card>
        <mat-card-title>
            Artikel
        </mat-card-title>
        {{ article.arttext }}<br/>(Seite: {{ article.npages }})
    </mat-card>
    <mat-card>
        <mat-card-title>
            Links
        </mat-card-title>
        <table>
            <tr *ngIf="article.fonotecacode"><td>Fonoteca</td><td>:</td><td>{{ article.fonotecacode }}</td></tr>
            <tr *ngIf="article.hlscode"><td>HLS</td><td>:</td><td>{{ article.hlscode }}</td></tr>
            <tr *ngIf="article.oemlcode"><td>OEML</td><td>:</td><td>{{ article.oemlcode }}</td></tr>
            <tr *ngIf="article.theaterlexcode"><td>Theaterlexikon</td><td>:</td><td>{{ article.theaterlexcode }}</td></tr>
            <tr *ngIf="article.ticinolexcode"><td>Ticino Lexikon</td><td>:</td><td>{{ article.ticinolexcode }}</td></tr>
            <tr *ngIf="article.weblink"><td>Weblink</td><td>:</td><td><a href="article.weblink" target="_blank">{{ article.weblink }}</a></td></tr>
        </table>

    </mat-card>
   `,
  styles: []
})
export class ArticleComponent implements OnInit {
  articleIri: string;
  article: {[index: string]: string} = {};
  articleTitle: string = '';
  columnsToDisplay: Array<string> = ['KEY', 'VALUE'];

  constructor(private route: ActivatedRoute,
              private knoraApiService: KnoraApiService) {

  }

  getArticle() {
    this.route.params.subscribe(params => {
      this.articleIri = params.iri;
      this.knoraApiService.getResource(params.iri, {}).subscribe((data) => {
        console.log(data);
        const articledata: {[index: string]: string} = {};
        for (const propname in data) {
          if (data.hasOwnProperty(propname)) {
            switch (propname) {
              case 'mls:hasArticleText': {
                articledata.arttext = data[propname].propvalues[0].replace(/\\n/g, '<br />');
                break;
              }
              case 'mls:hasPages': {
                articledata.npages = data[propname].propvalues[0];
                break;
              }
              case 'mls:hasFonotecacode': {
                articledata.fonotecacode = data[propname].propvalues[0];
                break;
              }
              case 'mls:hasHlsCcode': {
                articledata.hlscode = data[propname].propvalues[0];
                break;
              }
              case 'mls:hasTheaterLexCode': {
                articledata.theaterlexcode = data[propname].propvalues[0];
                break;
              }
              case 'mls:hasWebLink': {
                articledata.weblink = data[propname].propvalues[0];
                break;
              }
            }
          }
        }
        this.article = articledata;
      });
    });
  }

  ngOnInit() {
    this.getArticle();
  }

}
