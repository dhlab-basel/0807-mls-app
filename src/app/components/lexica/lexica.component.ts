import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GravsearchTemplatesService} from '../../services//gravsearch-templates.service';
import { KnoraJsonldSimplify, KnoraResource, KnoraValue } from 'knora-jsonld-simplify';
import { KnoraApiService} from '../../services/knora-api.service';
import { map } from 'rxjs/operators';
import { GetLexicaService } from '../../services/get-lexica.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lexica',
  template: `
    <mat-card>
        <mat-card-title>
            Lexika
        </mat-card-title>
        <mat-card-content>
        </mat-card-content>
    </mat-card>
  `,
  styles: [
    'td.mat-cell {padding-left: 10px; padding-right:20px;}',
    'tr.mat-row {height: 24px;}',
    '.clickable {cursor: pointer;}'
  ]
})
export class LexicaComponent implements OnInit {
  @ViewChild('searchField', {static: false})
  private searchField: ElementRef;

  private lexica: Array<{[index: string]: string}> = [];
  private startchar: string;
  private page: number;
  private nLexica: number;
  private columnsToDisplay: Array<string> = ['lemma_text', 'lemma_start', 'lemma_end'];
  private showProgbar = false;
  private showAindex = true;
  private searchterm: string;

  constructor(private getLexicaService: GetLexicaService,
              private activatedRoute: ActivatedRoute,
              private elementRef: ElementRef,
              private router: Router) {
    this.startchar = 'A';
    this.page = 0;
    this.searchterm = '';
    this.activatedRoute.queryParams.subscribe(params => {
      this.startchar = params.hasOwnProperty('startchar') ? params.startchar : 'A';
      console.log(this.startchar); // Print the parameter to the console.
    });

  }

  getLexica(): void {
    this.showProgbar = true;
    this.lexica = [];
    this.getLexicaService.get_lexica_count(this.startchar)
      .subscribe(n => (this.nLexica = Number(n)));
    this.getLexicaService.get_lexica(this.page, this.startchar)
      .subscribe((data: Array<KnoraResource>) => {
        console.log(data)
        /*
        this.lexica = data.map((x) => {
          const lemmaText = x ? x.getValue('mls:hasLemmaText') : undefined;
          const lemmaStart = x ? x.getValue('mls:hasStartDate') : undefined;
          const lemmaEnd = x ? x.getValue('mls:hasEndDate') : undefined;
          const lemmaIri = x ? x.iri : undefined;
          this.showProgbar = false;
          return {
            lemma_text: lemmaText ? lemmaText.strval : '-',
            lemma_start: lemmaStart ? lemmaStart.strval : '?',
            lemma_end: lemmaEnd ? lemmaEnd.strval : '?',
            lemma_iri: lemmaIri ? lemmaIri : 'http://NULL'
          };
        });
         */
      });
  }

  ngOnInit() {
    this.getLexica();
  }

}
