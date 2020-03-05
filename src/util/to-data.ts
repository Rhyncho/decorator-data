import { MappingVI } from '../interface/mapping-vi.interface';

function parseToData(value: any) {

  if (value.__MappingData__) {
    return toData(value);
  }

  if (Array.isArray(value)) {
    return value.map((itr) => {
      return parseToData(itr);
    })
  }

  if (typeof value === 'object') {
    return JSON.parse(JSON.stringify(value));
  }

  return value;

}

export function toData(data: any): object {
  const mappingList = data.__MappingData__
  if (mappingList) {
    let keys = Object.keys(mappingList);
    let output = {};
    for (const key of keys) {
      const mappingConfig: MappingVI = mappingList[key];
      output[mappingConfig.mappingKey] = parseToData(data[key]);
    }
    return output;
  } else {
    return JSON.parse(JSON.stringify(data));
  }
}