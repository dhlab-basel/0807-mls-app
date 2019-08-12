import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KnoraResource, KnoraValue } from 'knora-jsonld-simplify';
import {KnoraApiService} from '../../services/knora-api.service';
//import { GetLemmaService } from '../../services/get-lemma.service';

@Component({
  selector: 'app-lemma',
  template: `
    <p>
      lemma works! **{{ lemmaIri }}**
    </p>
  `,
  styles: []
})

export class LemmaComponent implements OnInit {
  private lemmaIri;
  private lemma: {[index: string]: string} = {lemma_text: '-'};

  constructor(private route: ActivatedRoute, private knoraApiService: KnoraApiService) { }

  getLemma() {
    this.route.params.subscribe(params => {
      this.lemmaIri = params.iri;
      this.knoraApiService.getKnoraResource(params.iri)
        .subscribe((data) => {
          console.log('RESULT: ', data);
         });
    });

  }

  ngOnInit() {
    this.getLemma();
  }

}
