import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from './components/login/login.component';
import { KnoraService } from './services/knora.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-root',
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('drawer')
  myDrawer: ElementRef;
  title = 'Musikalisches Lexikon der Schweiz (MLS)';
  logininfo = '';
  loggedin = false;

  constructor(public dialog: MatDialog,
              public knoraService: KnoraService) {
    console.log('app.component.constructor() !!!!');
    const udata = this.knoraService.restoreToken();
    console.log('udata=', udata);
    if (udata !== undefined) {
      this.logininfo = udata.user;
      this.loggedin = true;
    }
  }

  private openLoginDialog(): void {
    const loginConfig = new MatDialogConfig();
    loginConfig.autoFocus = true;
    loginConfig.disableClose = true;
    loginConfig.data = {
      email: '',
      password: ''
    };

    const dialogRef = this.dialog.open(LoginComponent, loginConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        this.knoraService.login(data.email, data.password).subscribe(data => {
          if (!data.success) {
            console.log('LOGIN-ERROR:', data);
            this.openLoginDialog();
          } else {
            this.logininfo = data.user;
            this.loggedin = true;
          }
        });
      });
  }

  ngOnInit() {
    console.log('app.component.ngOnInit() !!!!');
    const udata = this.knoraService.restoreToken();
    console.log('udata=', udata);
    if (udata !== undefined) {
      this.logininfo = udata.user;
      this.loggedin = true;
    }
  }


  logout(): void {
    this.knoraService.logout().subscribe(data => {
      this.loggedin = false;
    });
  }

  account(): void {
    if (this.loggedin) {
      this.logout();
    } else {
      this.openLoginDialog();
    }
  }

  testit() {
    console.log(this.myDrawer);
    this.myDrawer.nativeElement.toggle();
  }
}


