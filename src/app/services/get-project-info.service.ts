import { Injectable } from '@angular/core';
import { KnoraApiService} from './knora-api.service';
import { ProjectInfo } from '../classes/project-info';
import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class GetProjectInfoService {

  constructor(private knoraApi: KnoraApiService) { }

  getProjectInfo(shortcode: string): Observable<ProjectInfo> {
    return this.knoraApi.get('/admin/projects/shortcode/' + shortcode)
      .pipe(map((data: any) => {
        const jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.operationMode = OperationMode.LOGGING;
        jsonConvert.ignorePrimitiveChecks = false;
        jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
        const pinfo = jsonConvert.deserializeObject(data['project'], ProjectInfo);
        return pinfo;
      }));
  }
}
