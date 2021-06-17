import {Component, OnInit, Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {KnoraService} from '../../services/knora.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditartComponent} from '../editart/editart.component';
import {SafePipe} from '../../pipes/safe.pipe';

@Component({
  selector: 'app-article',
  template: `
    <div class="maindiv" layout-fill>
      <mat-card class="maxw">
        <mat-card-title>
          {{article.lemma}}
        </mat-card-title>
        <mat-card-subtitle>
          (Aus "{{article.lexicon}}")
        </mat-card-subtitle>
        <mat-card-content>
          <div *ngIf="article.arkUrl" style="padding-top: 10px; font-size: 12px;">
            ARK-ID: {{article.arkUrl}} &nbsp;
            <button mat-mini-fab [cdkCopyToClipboard]="article.arkUrl" matTooltip="In Zwischenablage kopieren"><mat-icon>content_copy</mat-icon></button>
          </div>

          <div [innerHTML]="article.arttext | safe: 'html'"></div>
          <div *ngIf="article.npages">(Seite: {{ article.npages }})</div>
          <mat-divider></mat-divider>
          <br/>
          <mat-card-subtitle *ngIf="article.fonotecacode || article.hlscode || article.oemlcode || article.theaterlexcode || article.ticinolexcode || article.weblink">
            Links
          </mat-card-subtitle>
          <table>
            <tr *ngIf="article.fonotecacode"><td>Fonoteca</td><td>:</td><td>{{ article.fonotecacode }}</td></tr>
            <tr *ngIf="article.hlscode"><td>HLS</td><td>:</td><td>{{ article.hlscode }}</td></tr>
            <tr *ngIf="article.oemlcode"><td>OEML</td><td>:</td><td>{{ article.oemlcode }}</td></tr>
            <tr *ngIf="article.theaterlexcode"><td>Theaterlexikon</td><td>:</td><td><a href="{{ 'http://tls.theaterwissenschaft.ch/wiki/' + article.theaterlexcode }}">{{ article.theaterlexcode }}</a></td></tr>
            <tr *ngIf="article.ticinolexcode"><td>Ticino Lexikon</td><td>:</td><td>{{ article.ticinolexcode }}</td></tr>
            <tr *ngIf="article.weblink"><td>Weblink</td><td>:</td><td><a href="{{article.weblink}}" target="_blank">{{ article.weblink }}</a></td></tr>
          </table>
          <mat-card-actions *ngIf="knoraService.loggedin">
            <mat-divider></mat-divider>
            <button mat-raised-button (click)="editArticle()">edit</button>
          </mat-card-actions>
        </mat-card-content>
      </mat-card>
     </div>
  `,
  styles: [
    '.maindiv {display: flex; justify-content: center; align-items: center;}',
    '.mat-card {max-width: 800px; margin: 3em;}',
    '.mat-card-subtitle {font-size: 16px; font-weight: bold;}',
    '.clickable {cursor: pointer;}'
  ]
})

export class ArticleComponent implements OnInit {
  articleIri: string;
  article: {[index: string]: string} = {};

  constructor(private route: ActivatedRoute,
              public dialog: MatDialog,
              public knoraService: KnoraService,
              private router: Router) {

  }

  getArticle() {
    this.route.params.subscribe(params => {
      this.articleIri = params.iri;
      this.knoraService.getResource(this.articleIri).subscribe((data) => {
        const articledata: {[index: string]: string} = {};
        articledata.arkUrl = data.arkUrl || '';
        for (const ele of data.properties) {
          switch (ele.propname) {
            case this.knoraService.mlsOntology + 'hasALinkToLemmaValue': {
              articledata.lemma = ele.values[0];
              break;
            }
            case this.knoraService.mlsOntology + 'hasALinkToLexiconValue': {
              articledata.lexicon = ele.values[0];
              break;
            }
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
