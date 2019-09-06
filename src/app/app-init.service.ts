import { Injectable } from '@angular/core';

export interface IAppConfig {
  server: string;
  ontologyPrefix: string;
}

@Injectable()
export class AppInitService {

  static settings: IAppConfig;

  constructor() {
  }

  Init() {

    return new Promise<void>((resolve, reject) => {
      // console.log('AppInitService.init() called');
      // do your initialisation stuff here

      const data = <IAppConfig>window['tempConfigStorage'];
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
