import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {KnoraService} from '../../services/knora.service';

@Component({
  selector: 'app-home',
  providers:  [],
  template: `
    <mat-card [ngStyle]="{background: 'url(' + imgname + ') center'}" class="bgimg gaga">
      <mat-card-actions style="text-align: center;" class="gugus">
        <form (submit)="searchEvent($event)" (keyup.enter)="searchEvent($event)">
          <mat-form-field fxHide fxShow.lt-md class="iswhite200">
            <input #searchField
                   name="searchterm"
                   [(ngModel)]="searchterm"
                   matInput
                   type="search"
                   placeholder="Suche nach..."/>

            <mat-icon matSuffix class="clickable" (click)="searchEvent($event)">search</mat-icon>
            <mat-icon matSuffix class="clickable" (click)="searchCancel($event)">cancel</mat-icon>
            <!-- <mat-hint>Stichwort, nach dem gesucht werden soll, eingeben</mat-hint> -->
          </mat-form-field>
          <mat-form-field fxShow fxHide.lt-md class="iswhite400">
            <input #searchField
                   name="searchterm"
                   [(ngModel)]="searchterm"
                   matInput
                   type="search"
                   placeholder="Suche nach..."/>

            <mat-icon matSuffix class="clickable" (click)="searchEvent($event)">search</mat-icon>
            <mat-icon matSuffix class="clickable" (click)="searchCancel($event)">cancel</mat-icon>
            <!-- <mat-hint>Stichwort, nach dem gesucht werden soll, eingeben</mat-hint> -->
          </mat-form-field>

        </form>
      </mat-card-actions>
    </mat-card>

    <mat-tab-group>
      <mat-tab label="DE">
        <mat-card>
          <mat-card-content class="info">
            Das Musiklexikon der Schweiz (MLS) ist das spartenübergreifende Online-Fachlexikon zur Schweizerischen
            Musikgeschichte. Es versteht sich als zentrale Informationsplattform zum Musikleben in der Schweiz und
            richtet sich sowohl an Wissenschaftler*innen und Studierende als auch an Interessierte aus der breiten
            Öffentlichkeit. Das MLS stellt nicht nur Artikel zu Persönlichkeiten der Schweizer Musikgeschichte zur
            Verfügung, sondern
            beschäftigt sich auch mit Orten, Institutionen und Objekten aus allen Sparten des Musiklebens.
            <br/>Die endgültige Fassung des MLS wird durchgehend mehrsprachig sein.
          </mat-card-content>
        </mat-card>
      </mat-tab>
      <mat-tab label="FR">
        <mat-card>
          <mat-card-content class="info">
            Le Dictionnaire de la musique en Suisse (DMS) est un dictionnaire numérique spécialisé sur l’histoire de la
            musique en Suisse. Recouvrant tous les genres et tous les styles musicaux, il se conçoit comme une
            plate-forme d’information centrale sur la musique en Suisse. Il s’adresse aussi bien aux chercheuses et aux
            chercheurs
            qu’aux étudiant.e.s et aux mélomanes. Le DMS contient des articles sur les personnalités qui ont forgé
            l’histoire
            de la musique de la Suisse, mais aussi des articles sur les lieux, les institutions et les objets qui ont
            trait à la vie
            musicale du pays.
            <br/> La version finale du dictionnaire sera entièrement plurilingue.
          </mat-card-content>
        </mat-card>
      </mat-tab>
      <mat-tab label="IT">
        <mat-card>
          <mat-card-content class="info">
            L'Enciclopedia Musicale Svizzera (MLS) è l'enciclopedia interdisciplinare online della storia della musica
            svizzera. storia della musica. Si considera una piattaforma centrale d'informazione sulla vita musicale in
            Svizzera e
            indirizzi studiosi e studenti, così come i membri interessati del pubblico in generale.
            pubblico generale. La MLS non fornisce solo articoli su personalità della storia della musica svizzera, ma
            si occupa anche di
            luoghi, istituzioni e oggetti di tutti i settori della storia della musica.
            ma si occupa anche di luoghi, istituzioni e oggetti di tutti i settori della vita musicale.
            <br/> Il finale versione della MLS sarà multilingue in tutto.
          </mat-card-content>
        </mat-card>
      </mat-tab>
      <mat-tab label="EN">
        <mat-card>
          <mat-card-content class="info">
            The Swiss Music Encyclopedia (MLS) is the interdisciplinary online encyclopedia on Swiss music history.
            music history. It sees itself as a central information platform on the musical life in Switzerland and
            addresses
            scholars and students as well as interested members of the general public.
            general public.
            The MLS not only provides articles on personalities in Swiss music history, but also deals with places,
            institutions and objects from all areas of music history.
            but also deals with places, institutions and objects from all areas of musical life.
            <br/> The
            final
            version of the MLS will be multilingual throughout.
          </mat-card-content>
        </mat-card>
      </mat-tab>
    </mat-tab-group>
    <app-news-items></app-news-items>
  `,
  styles: [
    // '.bgimg {background: url("/assets/mls-title-bg-img.jpg"); background-repeat: no-repeat; background-size: cover; background-position: center; margin-left: 50px; margin-right: 50px;}',
    '.mat-tab-group {margin: auto; max-width: 800px;}',
    '.info {font-size: 16px;}',
    '.bgimg {background-repeat: no-repeat; background-size: cover; background-position: center; margin-left: 0px; margin-right: 0px;}',
    '.gaga {min-height: max-content;}',
    '.gugus {min-height: 400px;}',
    '.iswhite200 {background-color: white; min-width: 200px;}',
    '.iswhite400 {background-color: white; min-width: 400px;}',
  ]
})

export class HomeComponent implements OnInit {
  @ViewChild('searchField')
  private searchField: ElementRef;

  searchterm: string = '';
  imgname: string;

  constructor(private router: Router,
              public knoraService: KnoraService) {
    this.imgname = '/assets/mls-title-bg-img-0.jpg';
  }

  searchEvent(event): boolean {
    console.log('searchterm=', this.searchterm);
    this.searchterm = this.searchField.nativeElement.value;
    this.router.navigate(['/lemmata'], {
      queryParams: {
        searchterm: this.searchField.nativeElement.value
      }
    });
    return false;
  }

  searchCancel(event): void {
    this.searchterm = '';
  }

  ngOnInit() {
    const max = 7;
    const rn = Math.floor(Math.random() * max);
    this.imgname = '/assets/mls-title-bg-img-' + rn.toString() + '.jpg';
    console.log(this.imgname);
  }

}
