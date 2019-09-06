import { Component, OnInit } from '@angular/core';
import { ProjectInfo } from '../../classes/project-info';
import { GetProjectInfoService} from '../../services/get-project-info.service';

@Component({
  selector: 'app-home',
  providers:  [ GetProjectInfoService ],
  template: `
    <mat-card>
      <mat-card-title>
       <!-- {{ projectInfo['longname'] }} -->
      </mat-card-title>
      <mat-card-content>
        <h3>Beschreibung</h3>
        <p><!-- {{ projectInfo['description']['de'] }}--></p>
      </mat-card-content>
      <mat-divider></mat-divider>
      <mat-card-actions style="text-align: center;">
        <a mat-button routerLink="/lemmata">Lemmata</a>
        <a mat-button routerLink="/lexica">Lexika</a>
      </mat-card-actions>
    </mat-card>
  `,
  styles: []
})

export class HomeComponent implements OnInit {
  projectInfo: ProjectInfo;

  constructor(private pinfoService: GetProjectInfoService) {
    this.projectInfo = new ProjectInfo();
  }

  getProjectInfo(shortcode: string): void {
    this.pinfoService.getProjectInfo(shortcode)
      .subscribe((data: ProjectInfo) => {
        if (data === undefined) {
          this.projectInfo = {
            longname: 'unknown',
            shortname: 'unknonm',
            shortcode: '0000',
            iri: 'http://null.org',
            description: {
              de: 'unknown'
            }
          };
        } else {
          this.projectInfo = data;
        }
      });
  }

  ngOnInit() {
    this.getProjectInfo('0807');
  }

}
