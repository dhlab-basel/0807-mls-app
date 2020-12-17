import {JsonObject, JsonProperty, JsonConverter, JsonCustomConvert} from 'json2typescript';

@JsonConverter
class DescriptionConverter implements JsonCustomConvert<{ [index: string]: string }> {
  serialize(description: { [index: string]: string }): any {
    const res: Array<{ value: string, language: string }> = [];
    for (const key in description) {
      if (description.hasOwnProperty(key)) {
        res.push({language: key, value: description[key]});
      }
    }
    return res;
  }

  deserialize(description: any): { [index: string]: string } {
    const tmp: { [index: string]: string } = {};
    const desc = description as Array<{ value: string, language: string }>;
    for (const d of desc) {
      tmp[d.language] = d.value;
    }
    return tmp;
  }
}

@JsonObject('project')
export class ProjectInfo {
  @JsonProperty('shortname', String)
  shortname: string;
  //
  @JsonProperty('longname', String)
  longname: string;
  //
  @JsonProperty('description', DescriptionConverter)
  description?: { [index: string]: string };
  //
  @JsonProperty('shortcode', String)
  shortcode: string = '';
  //
  @JsonProperty('id', String)
  iri: string;
  //
  @JsonProperty('keywords', [String])
  keywords?: Array<string> = [];

  constructor() {
    this.shortname = '-';
    this.longname = '-';
    this.description = {en: '-'};
  }
}
