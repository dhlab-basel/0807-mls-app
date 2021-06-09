import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {KnoraService, ResourceData} from '../../services/knora.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

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
      <mat-card-actions *ngIf="knoraService.loggedin">
        <button mat-raised-button (click)="editLexicon()">edit</button>
      </mat-card-actions>

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

  lexicon: ResourceData = {
    id: '',
    label: '',
    permission: '',
    lastmod: '',
    properties: [{propname: '', label: '', values: [], ids: [], comments: [], permissions: []}]
  };
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
              public dialog: MatDialog,
              public knoraService: KnoraService,
              private router: Router) {}

  getLexicon() {
    this.route.params.subscribe(params => {
      if  (params.hasOwnProperty('iri')) {
        this.lexiconIri = params.iri;
      }
      this.knoraService.getResource(this.lexiconIri).subscribe(data => {
        const properties = data.properties;
        const filteredProperties = properties.filter((ele) => this.fields.indexOf(ele.propname) !== -1);
        data.properties = filteredProperties;
        let i = 0;
        let idx = -1;
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

  editLexicon() {
    this.router.navigate(['/editlex', this.lexicon.id]);
  }

  ngOnInit() {
    this.getLexicon();
  }

}
