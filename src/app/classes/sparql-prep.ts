import {Injectable} from '@angular/core';

enum Status { COPY, INWATCH, OUTWATCH, INSIDE }

@Injectable()
export class SparqlPrep {

  constructor() {
  }

  compile(template: string, params: { [index: string]: string }) {
    let output = '';
    let status: Status = Status.COPY;
    let token = '';
    let skip = false;
    for (const c of template) {
      if (status === Status.COPY) {
        if (c === '{') {
          status = Status.INWATCH;
        } else {
          if (!skip) { output += c; }
        }
      } else if (status === Status.INWATCH) {
        if (c === '{') {
          status = Status.INSIDE;
        } else {
          status = Status.COPY;
          if (!skip) { output += '{' + c; }
        }
      } else if (status === Status.INSIDE) {
        if (c === '}') {
          status = Status.OUTWATCH;
        } else {
          token += c;
        }
      } else if (status === Status.OUTWATCH) {
        if (c === '}') {
          status = Status.COPY;
          token = token.trim();
          // Process token here!!!!
          if (token.charAt(0) === '#') {
            const parts = token.split(/\s+/);
            if (parts[0] === '#if') {
              skip = !params.hasOwnProperty(parts[1]);
            } else if (parts[0] === '#else') {
              skip = !skip;
            } else if (parts[0] === '#endif') {
              skip = false;
            } else {
              // issue error
            }
          } else {
            if (params.hasOwnProperty(token)) {
              output += params[token];
            }
          }
          token = '';
        } else {
          token += '}' + c;
        }
      }
    }
    return output;
  }
}
