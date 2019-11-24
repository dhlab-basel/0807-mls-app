import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {KnoraService, ResourceData} from "../../services/knora.service";

@Component({
  selector: 'app-lexicon',
  template: `
      <h2>
          {{ lexiconTitle }}
      </h2>
      <table mat-table [dataSource]="lexicon.properties" class="mat-elevation-z8">
          <ng-container matColumnDef="KEY">
              <th mat-header-cell *matHeaderCellDef> Feld </th>
              <td mat-cell *matCellDef="let element"> {{element.label}}: </td>
          </ng-container>
          <ng-container matColumnDef="VALUE">
              <th mat-header-cell *matHeaderCellDef> Wert </th>
              <td mat-cell *matCellDef="let element">
                  <div *ngFor="let val of element.values">{{ val }}</div>
              </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
          <tr mat-row *matRowDef="let row; columns: columnsToDisplay;" ></tr>
      </table>
  `,
  styles: [
    'td.mat-cell {padding-left: 10px; padding-right:20px;}',
    'tr.mat-row {height: 24px;}',
    '.clickable {cursor: pointer;}'
  ]
})
export class LexiconComponent implements OnInit {
  @Input()
  lexiconIri: string;

  //lexicon: Array<{[index: string]: string}> = [];
  lexicon: ResourceData = {id: '', label: '', properties: [{propname: '', label: '', values: ['']}]};
  columnsToDisplay: Array<string> = ['KEY', 'VALUE'];
  lexiconTitle: string = '';
  //
  // array of fields to be displayed
  //
  fields: Array<string> = [
    this.knoraService.mlsOntology + 'hasShortname',
    this.knoraService.mlsOntology + 'hasCitationForm',
    this.knoraService.mlsOntology + 'hasLexiconWeblink',
    this.knoraService.mlsOntology + 'hasLibrary',
    this.knoraService.mlsOntology + 'hasYear',
    this.knoraService.mlsOntology + 'hasMedia1',
    this.knoraService.mlsOntology + 'hasMedia2',
    this.knoraService.mlsOntology + 'hasMedia3',
    this.knoraService.mlsOntology + 'hasMedia4'
  ];


  constructor(private route: ActivatedRoute,
              private knoraService: KnoraService) {}

  getLexicon() {
    this.route.params.subscribe(params => {
      if  (params.hasOwnProperty('iri')) {
        console.log(params.iri);
        this.lexiconIri = params.iri;
      }
      this.knoraService.getResource(this.lexiconIri).subscribe(data => {
        const properties = data.properties;
        const filtered_properties = properties.filter((ele) => this.fields.indexOf(ele.propname) !== -1);
        data.properties = filtered_properties;
        let i = 0;
        let idx: number = -1;
        for (const ele of data.properties) {
          if (ele.label === 'Kürzel') {
            this.lexiconTitle = ele.values[0];
            idx = i;
          }
          i++;
        }
        if ((idx >= 0) && (idx < data.properties.length)) {
          data.properties.splice(idx, 1);
        }
        this.lexicon = data;
      });
    });
  }

  ngOnInit() {
    this.getLexicon();
  }

}
