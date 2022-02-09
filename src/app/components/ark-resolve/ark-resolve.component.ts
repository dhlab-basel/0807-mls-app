import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {KnoraService} from "../../services/knora.service";

@Component({
  selector: 'app-ark-resolve',
  template: `
    <p>
      What is the requested thing with url {{objurl}}
    </p>
  `,
  styles: [
  ]
})
export class ArkResolveComponent implements OnInit {
  objurl: string;

  constructor(public route: ActivatedRoute,
              public knoraService: KnoraService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.objurl = params.iri;
      this.knoraService.getResource(params.iri).subscribe((data) => {
        for (const ele of data.properties) {
          if (ele.propname === 'http://api.dasch.swiss/ontology/0807/mls/v2#hasLemmaText') {
            this.router.navigate(['/lemma', this.objurl]);
          } else {
            this.router.navigate(['/article', this.objurl]);
          }
        }
        console.log('==> Resource:', data);
      });
    });
  }

}
