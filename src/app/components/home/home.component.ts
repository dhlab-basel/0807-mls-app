import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ProjectInfo } from '../../classes/project-info';
import { GetProjectInfoService} from '../../services/get-project-info.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  providers:  [ GetProjectInfoService ],
  template: `
    <mat-card class="bgimg gaga">
      <mat-card-actions style="text-align: center;" class="gugus">
          <form (submit)="searchEvent($event)" (keyup.enter)="searchEvent($event)">
              <mat-form-field>
                  <input #searchField
                         name="searchterm"
                         [value]="searchterm"
                         matInput
                         type="search"
                         placeholder="Suchbegriff für Lemma" />
                  <mat-icon matSuffix class="clickable" (click)="searchEvent($event)">search</mat-icon>
                  <mat-icon matSuffix class="clickable" (click)="searchCancel($event)">cancel</mat-icon>
                  <mat-hint>Suche in Lemma, Pseudonyms etc.</mat-hint>
              </mat-form-field>
          </form>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    '.bgimg {background: url("../assets/mls-title-bg-img.jpg"); background-repeat: no-repeat; background-size: cover; background-position: center;}',
    '.gaga {min-height: max-content;}',
    '.gugus {min-height: 400px;}'
  ]
})

export class HomeComponent implements OnInit {
  @ViewChild('searchField', {static: false})
  private searchField: ElementRef;

  searchterm: string = '';

  constructor(private router: Router) {
  }

  searchEvent(event): boolean {
    this.searchterm = this.searchField.nativeElement.value;
    this.router.navigate(['/lemmata'], {
      queryParams: {
        searchterm: this.searchField.nativeElement.value
      }
    });
    //this.page = 0;
    //this.searchLemmata();
    return false;
  }

  searchCancel(event): void {
    this.searchterm = '';
    //this.showAindex = true;
    //this.getLemmata();
  }



  ngOnInit() {
  }

}
