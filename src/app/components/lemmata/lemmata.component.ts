import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GetLemmataService } from '../../services/get-lemmata.service';
import { KnoraResource, KnoraValue } from 'knora-jsonld-simplify';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lemmata',
  template: `
    <mat-card>
      <mat-card-title>
        Lemmata
      </mat-card-title>
      <mat-card-content>
        <form (submit)="searchEvent($event)">
          <mat-form-field>
            <input name="searchterm" [value]="searchterm" matInput type="search" placeholder="Suchbegriff für Lemma" />
            <mat-icon matSuffix>search</mat-icon>
            <mat-icon matSuffix (click)="searchCancel($event)">cancel</mat-icon>
            <mat-hint>Suche in Lemma, Pseudonyms etc.</mat-hint>
          </mat-form-field>
        </form>
        <app-aindex *ngIf="show_aindex" [activeChar]="startchar" (charChange)='charChanged($event)'></app-aindex>
        <mat-progress-bar mode="indeterminate" *ngIf="show_progbar"></mat-progress-bar>
        <table mat-table [dataSource]="lemmata">
          <ng-container matColumnDef="lemma_text">
            <th mat-header-cell *matHeaderCellDef> Lemma </th>
            <td mat-cell *matCellDef="let element"> {{element.lemma_text}} </td>
          </ng-container>
          <ng-container matColumnDef="lemma_start">
            <th mat-header-cell *matHeaderCellDef> Start </th>
            <td mat-cell *matCellDef="let element"> {{element.lemma_start}} </td>
          </ng-container>
          <ng-container matColumnDef="lemma_end">
            <th mat-header-cell *matHeaderCellDef> End </th>
            <td mat-cell *matCellDef="let element"> {{element.lemma_end}} </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
          <tr mat-row *matRowDef="let row; columns: columnsToDisplay;" (click)="lemmaSelected(row)"></tr>
        </table>

        <mat-paginator [length]="nLemmata"
                       [pageIndex]="page"
                       [pageSize]="25"
                       [pageSizeOptions]="[25]"
                       (page)="pageChanged($event)">
        </mat-paginator>

      </mat-card-content>
    </mat-card>
  `,
  styles: ['td.mat-cell {padding-left: 10px; padding-right:20px}']
})
export class LemmataComponent implements OnInit {
  private lemmata: Array<{[index: string]: string}> = [];
  private startchar: string;
  private page: number;
  private nLemmata: number;
  private columnsToDisplay = ['lemma_text', 'lemma_start', 'lemma_end'];
  private show_progbar = false;
  private show_aindex = true;
  private searchterm;

  constructor(private getLemmataService: GetLemmataService, private activatedRoute: ActivatedRoute) {
    this.startchar = 'A';
    this.page = 0;
    this.searchterm = '';
    this.activatedRoute.queryParams.subscribe(params => {
      this.startchar = params.hasOwnProperty('startchar') ? params.startchar : 'A';
      console.log(this.startchar); // Print the parameter to the console.
    });
  }

  charChanged(c: string): void {
    this.startchar = c;
    this.page = 0;
    console.log(c);
    this.getLemmata();
  }

  pageChanged(event): void {
    this.page = event.pageIndex;
    this.getLemmata();
    console.log('PAGE: ', this.page);
  }

  lemmaSelected(event): void {
    console.log(event);
  }

  getLemmata(): void {
    this.show_progbar = true;
    this.lemmata = [];
    this.getLemmataService.get_lemmata_count(this.startchar)
      .subscribe(n => (this.nLemmata = Number(n)));
    this.getLemmataService.get_lemmata(this.page, this.startchar)
      .subscribe((data: Array<KnoraResource>) => {
        this.lemmata = data.map((x) => {
          const lemmaText = x ? x.getValue('mls:hasLemmaText') : undefined;
          const lemmaStart = x ? x.getValue('mls:hasStartDate') : undefined;
          const lemmaEnd = x ? x.getValue('mls:hasEndDate') : undefined;
          const lemmaIri = x ? x.iri : undefined;
          this.show_progbar = false;
          return {
            lemma_text: lemmaText ? lemmaText.strval : '-',
            lemma_start: lemmaStart ? lemmaStart.strval : '?',
            lemma_end: lemmaEnd ? lemmaEnd.strval : '?',
            lemma_iri: lemmaIri ? lemmaIri : 'http://NULL'
          };
        });
      });
  }

  searchEvent(event): boolean {
    this.searchterm = event.target.searchterm.value;
    this.searchLemmata();
    return false;
  }

  searchLemmata(): void {
    this.show_progbar = true;
    this.show_aindex = false;
    this.lemmata = [];
    this.getLemmataService.search_lemmata_count(this.searchterm)
      .subscribe(n => (this.nLemmata = Number(n)));
    this.getLemmataService.search_lemmata(this.page, this.searchterm)
      .subscribe((data: Array<KnoraResource>) => {
        this.lemmata = data.map((x) => {
          const lemmaText = x ? x.getValue('mls:hasLemmaText') : undefined;
          const lemmaStart = x ? x.getValue('mls:hasStartDate') : undefined;
          const lemmaEnd = x ? x.getValue('mls:hasEndDate') : undefined;
          const lemmaIri = x ? x.iri : undefined;
          this.show_progbar = false;
          return {
            lemma_text: lemmaText ? lemmaText.strval : '-',
            lemma_start: lemmaStart ? lemmaStart.strval : '?',
            lemma_end: lemmaEnd ? lemmaEnd.strval : '?',
            lemma_iri: lemmaIri ? lemmaIri : 'http://NULL'
          };
        });
      });
  }

  searchCancel(event): void {
    this.searchterm = '';
    this.show_aindex = true;
    this.getLemmata();
  }

  ngOnInit() {
    this.getLemmata();
  }

}
