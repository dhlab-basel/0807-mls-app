import {Component, OnInit, Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {KnoraService} from '../../services/knora.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditartComponent} from '../editart/editart.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({ name: 'sanitizeHtml' })
export class SanitizeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string): SafeHtml {
    console.log('Anti-Sanitizer!!!!!!!!!!!!!!!!!!!!!!');
    console.log(this.sanitizer.bypassSecurityTrustHtml(value));
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}


@Component({
  selector: 'app-article',
  template: `
    <mat-card class="maxw">
        <mat-card-title>
            Artikel
        </mat-card-title>
      <mat-card-content>
        <div [innerHTML]="article.arttext | sanitizeHtml"></div>
        (Seite: {{ article.npages }})
      </mat-card-content>

    </mat-card>
    <mat-card>
        <mat-card-title>
            Links
        </mat-card-title>
        <table>
            <tr *ngIf="article.fonotecacode"><td>Fonoteca</td><td>:</td><td>{{ article.fonotecacode }}</td></tr>
            <tr *ngIf="article.hlscode"><td>HLS</td><td>:</td><td>{{ article.hlscode }}</td></tr>
            <tr *ngIf="article.oemlcode"><td>OEML</td><td>:</td><td>{{ article.oemlcode }}</td></tr>
            <tr *ngIf="article.theaterlexcode"><td>Theaterlexikon</td><td>:</td><td><a href="{{ 'http://tls.theaterwissenschaft.ch/wiki/' + article.theaterlexcode }}">{{ article.theaterlexcode }}</a></td></tr>
            <tr *ngIf="article.ticinolexcode"><td>Ticino Lexikon</td><td>:</td><td>{{ article.ticinolexcode }}</td></tr>
            <tr *ngIf="article.weblink"><td>Weblink</td><td>:</td><td><a href="{{article.weblink}}" target="_blank">{{ article.weblink }}</a></td></tr>
        </table>

    </mat-card>
    <mat-card-actions *ngIf="knoraService.loggedin">
      <button mat-raised-button (click)="editArticle()">edit</button>
    </mat-card-actions>
  `,
  styles: [
    '.maxw { min-width: 700px; }',
    '.clickable {cursor: pointer;}'
  ]
})

export class ArticleComponent implements OnInit {
  articleIri: string;
  article: {[index: string]: string} = {};
  arttext: SafeHtml;

  constructor(private route: ActivatedRoute,
              public dialog: MatDialog,
              public knoraService: KnoraService,
              private router: Router,
              private sanitizer: DomSanitizer) {

  }

  getArticle() {
    this.route.params.subscribe(params => {
      this.articleIri = params.iri;
      this.knoraService.getResource(this.articleIri).subscribe((data) => {
        const articledata: {[index: string]: string} = {};
        for (const ele of data.properties) {
          switch (ele.propname) {
            case this.knoraService.mlsOntology + 'hasArticleText': {
              const regex = /<oembed.+?url="https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})"><\/oembed>/g;
              articledata.arttext = ele.values[0].replace(/\\n/g, '<br />');
              articledata.arttext = articledata.arttext.replace(regex, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
              console.log(articledata.arttext);
              break;
            }
            case this.knoraService.mlsOntology + 'hasPages': {
              articledata.npages = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasFonotecacode': {
              articledata.fonotecacode = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasHlsCcode': {
              articledata.hlscode = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasOemlCode': {
              articledata.oemlexcode = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasTheaterLexCode': {
              articledata.theaterlexcode = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasTicinoLexCode': {
              articledata.ticinolexcode = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasWebLink': {
              articledata.weblink = ele.values[0];
              break;
            }
          }
        }
        this.article = articledata;
      });
    });
  }

  openEditDialog() {
    this.route.params.subscribe(params => {
      const editConfig = new MatDialogConfig();
      editConfig.autoFocus = true;
      editConfig.width = '800px';
      editConfig.data = {
        articleIri: this.articleIri,
      };
      const dialogRef = this.dialog.open(EditartComponent, editConfig);

      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.getArticle();
        }
      });
    });

  }

  editArticle(): void {
    let url: string;
    url = 'editart/' + encodeURIComponent(this.articleIri);
    this.router.navigateByUrl(url).then(e => {
      if (e) {
        console.log('Navigation is successful!');
      } else {
        console.log('Navigation has failed!');
      }
    });
  }


  ngOnInit(): void {
    this.getArticle();
  }

}
