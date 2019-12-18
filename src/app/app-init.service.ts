import { Injectable } from '@angular/core';
import {ApiResponseError, KnoraApiConfig, KnoraApiConnection} from "@knora/api";
import {map,tap} from "rxjs/operators";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { PropertyMatchingRule } from "json2typescript/src/json2typescript/json-convert-enums";

export interface IAppConfig {
  protocol: "http" | "https";
  server: string;
  ontologyPrefix: string;
  servername: string;
  port: number;
}

@Injectable()
export class AppInitService {

  static settings: IAppConfig;


  constructor(private http: HttpClient) {
  }

  Init(): Promise<any> {

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
