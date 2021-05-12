import {Component} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from './components/login/login.component';
import { KnoraService } from './services/knora.service';

@Component({
  selector: 'app-root',
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Musikalisches Lexikon der Schweiz (MLS)';
  logininfo = '';
  loggedin = false;

  constructor(public dialog: MatDialog,
              public knoraService: KnoraService) {}

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
            this.openLoginDialog();
          } else {
            this.logininfo = data.user;
            this.loggedin = true;
          }
        });
      });
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
}


