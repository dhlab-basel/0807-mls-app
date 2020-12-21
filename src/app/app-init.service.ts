import { Injectable } from '@angular/core';

export interface IAppConfig {
  protocol: 'http' | 'https';
  server: string;
  ontologyPrefix: string;
  servername: string;
  port: number;
}

@Injectable()
export class AppInitService {

  static settings: IAppConfig;

  constructor() {
  }

  Init(): Promise<any> {

    return new Promise<void>((resolve, reject) => {
      // console.log('AppInitService.init() called');
      // do your initialisation stuff here

      const data = window['tempConfigStorage'] as IAppConfig;
      // console.log('AppInitService: json', data);
      AppInitService.settings = data;

      // console.log('AppInitService: finished');
      resolve();
    });
  }

  public getSettings(): IAppConfig {
    return AppInitService.settings;
  }
}
