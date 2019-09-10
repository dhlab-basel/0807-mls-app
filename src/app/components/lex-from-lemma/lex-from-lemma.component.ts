import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {KnoraApiService} from '../../services/knora-api.service';
import {KnoraResource} from 'knora-jsonld-simplify/dist';

@Component({
  selector: 'app-lex-from-lemma',
  template: `
    <p>
      lex-from-lemma works! {{ lemmaIri }}
    </p>
    <mat-expansion-panel>
        <mat-expansion-panel-header>
            Lexica
        </mat-expansion-panel-header>
    </mat-expansion-panel>
  `,
  styles: []
})
export class LexFromLemmaComponent implements OnInit {

  @Input()
  lexiconIri: string;

  @Input()
  lemmaIri: string;

  private lexica: Array<{[index: string]: string}> = [];

  constructor(private route: ActivatedRoute,
              private knoraApiService: KnoraApiService) {

  }

  getLexsFromLemma() {
    const param = {
      lemma_iri: this.lemmaIri
    };
    this.knoraApiService.gravsearchQuery('lexica_from_lemma_query', param)
      .subscribe((data: Array<KnoraResource>) => {
        console.log(data);
    });
  }

  ngOnInit() {
    this.getLexsFromLemma();
  }

}
