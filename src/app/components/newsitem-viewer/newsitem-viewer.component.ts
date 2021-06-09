import { Component, OnInit } from '@angular/core';
import {ItemData, KnoraService, LinkPropertyData, StillImagePropertyData} from '../../services/knora.service';
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "@dasch-swiss/dsp-js";
import {AppInitService} from "../../app-init.service";

@Component({
  selector: 'app-newsitem-viewer',
  template: `
    <div class="maindiv" layout-fill>
      <mat-card layout-fill >
        <mat-card-title>
          {{newsData.title}}
        </mat-card-title>
        <img mat-card-image [src]="newsData.iiifImageUrl | safe: 'url'" />
        <mat-card-content >
          <div flex [innerHTML]="newsData.text | safe: 'html'"></div>
          <div *ngIf="newsData.lemmaId">Lemma: <button mat-button (click)="gotoLemma(newsData.lemmaId)">{{newsData.lemmaName}}</button></div>
          <div *ngIf="newsData.weblink">Weblink: <a [href]="newsData.weblink">{{newsData.weblink}}</a></div>
        </mat-card-content>
      </mat-card>
    </div>

  `,
  styles: [
    '.maindiv {display: flex; justify-content: center; align-items: center;}',
    'mat-card {max-width: 800px}'
  ]
})
export class NewsitemViewerComponent implements OnInit {
  newsIri: string;
  newsData: ItemData;
  mlsOntology: string;
  label: string;

  constructor(private appInitService: AppInitService,
              public knoraService: KnoraService,
              private router: Router,
              public route: ActivatedRoute) {
    this.mlsOntology = appInitService.getSettings().ontologyPrefix + '/ontology/0807/mls/v2#';
    this.newsData = {id: '', title: '', text: '', lemmaId: '', lemmaName: '', weblink: '', iiifImageUrl: '', date: ''}
  }

  ngOnInit(): void {
    this.route.params.subscribe(rdata => {
      this.newsIri = rdata.iri;
      this.knoraService.getResource(this.newsIri).subscribe((data) => {
        console.log(data);
        this.label = data.label;
        this.newsData = {id: data.id};
        for (const p of data.properties) {
          switch (p.propname) {
            case this.mlsOntology + 'hasNewsTitle': {
              this.newsData.title = p.values[0];
              break;
            }
            case this.mlsOntology + 'hasNewsText': {
              const regex = /<oembed.+?url="https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})"><\/oembed>/g;
              this.newsData.text = p.values[0].replace(/\\n/g, '<br />');
              this.newsData.text = this.newsData.text.replace(regex, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
              break;
            }
            case this.mlsOntology + 'hasNewsitemWeblink': {
              this.newsData.weblink = p.values[0];
              break;
            }
            case this.mlsOntology + 'hasNewsitemLinkToLemmaValue': {
              const pp = p as LinkPropertyData;
              this.newsData.lemmaId = pp.resourceIris[0];
              this.newsData.lemmaName = pp.values[0];
              break;
            }
            case Constants.HasStillImageFileValue: {
              const pp = p as StillImagePropertyData;
              this.newsData.iiifImageUrl = pp.iiifBase + '/' + pp.filename + '/full/^!1024,1024/0/default.jpg';
              break;
            }
            case this.mlsOntology + 'hasNewitemActiveDate': {
              this.newsData.date = p.values[0];
              break;
            }
          }
        }
        console.log(this.newsData);
      });
    });
  }

  gotoLemma(id) {
    this.router.navigate(['/lemma', id]);
  }

}
