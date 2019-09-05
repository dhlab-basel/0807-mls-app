import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KnoraResource, KnoraValue } from 'knora-jsonld-simplify';
import {KnoraApiService} from '../../services/knora-api.service';
import {Observable} from 'rxjs';
//import { GetLemmaService } from '../../services/get-lemma.service';

@Component({
  selector: 'app-lemma',
  template: `
    <p>
      lemma works! **{{ lemmaIri }}**
    </p>
     <table mat-table [dataSource]="lemma" class="mat-elevation-z8">
        <ng-container matColumnDef="KEY">
            <th mat-header-cell *matHeaderCellDef> KEY </th>
            <td mat-cell *matCellDef="let element"> {{element.propname}}: </td>
        </ng-container>
        <ng-container matColumnDef="VALUE">
            <th mat-header-cell *matHeaderCellDef> VALUE </th>
            <td mat-cell *matCellDef="let element"> {{element.propvalue}} </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
        <tr mat-row *matRowDef="let row; columns: columnsToDisplay;"></tr>
    </table>
  `,
  styles: []
})

export class LemmaComponent implements OnInit, OnChanges {
  private lemmaIri;
  private lemma: Array<{[index: string]: string}> = [{propname: 'GAGA', propvalue: 'GUGUS'}];
  private columnsToDisplay: Array<string> = ['KEY', 'VALUE'];

  constructor(private route: ActivatedRoute, private knoraApiService: KnoraApiService) {}



  getLemma() {
    this.route.params.subscribe(params => {
      this.lemmaIri = params.iri;
      this.knoraApiService.getKnoraResource(params.iri)
        .subscribe((data) => {
          console.log('RESULT: ', data);
          const tmp: Array<{[index: string]: string}> = [];
          for (const name in data.strvals) {
            tmp.push({propname: name, propvalue: data.strvals[name]});
          }
          for (const name in data.listvals) {
            tmp.push({propname: name, propvalue: data.listvals[name].strval});
          }
          this.lemma = tmp;
          console.log(this.lemma);
        });
    });
  }

  ngOnInit() {
    console.log('ONINIT');
    this.getLemma();
    console.log(this.lemma);
    console.log('===========');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ONCHANGES');
    this.getLemma();
    console.log(this.lemma);
    console.log('===========');
  }

}
