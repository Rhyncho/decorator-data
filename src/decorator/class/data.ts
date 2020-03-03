import { MappingVI } from '../../interface/mapping-vi.interface';

function initValue(
  defaultValue: any,
  mapConfig: MappingVI,  
  originalKey: string, 
  dataValue
) {
  if (dataValue === null || dataValue === undefined) {

    if (mapConfig.nullable) {
      return dataValue;
    }

    if (Array.isArray(defaultValue)) {
      return [];
    }

    return defaultValue;

  }

  if (typeof dataValue !== typeof defaultValue) {
    throw Error(`The type of Property: ${originalKey} in mapped data and model do not match.`);
  }

  // not Array or object
  if (typeof dataValue !== 'object') {
    return dataValue;
  }

  // Array
  if (Array.isArray(defaultValue)) {

    const typeRef = defaultValue[0];
    if (!typeRef) {
      throw Error(`The default value type of ${originalKey} is Array, it must pass at least 1 element for type mapping.`);
    }

    if (typeof typeRef === 'object') {
      return dataValue.map(itr => new typeRef.constructor(itr));
    }

    return dataValue.map(itr => itr);

  }

  // object
  return new defaultValue.constructor(dataValue);

}

function parseToData(value: any) {

  if (value.__MappingData__ && typeof value.toData === 'function') {
    return value.toData();
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

function toData() {
  const mappingList = this.__MappingData__;
  let keys = Object.keys(mappingList);
  let output = {};
  for (const key of keys) {
    const mappingConfig: MappingVI = mappingList[key];
    output[mappingConfig.mappingKey] = parseToData(this[key]);
  }
  return output;
}

export function Data(originalC: any) {

  // save a reference to the original constructor
  const newConstructor: any = function(...args) {

    if (args.length !== 1) {
      console.warn(`The arguments of @Data model are not one. If the mapping data is not the first args, the program will be something wrong.`);
    }

    const inputData = args[0];
    const c = new originalC(...args);
    const mappingList = c.__MappingData__;

    let keys = [];
    try {
      keys = Object.keys(mappingList);
    } catch (e) {
      throw Error(`There is no mapping data in ${originalC.name}. Please remove @Data on class ${originalC.name} or add @Mapping on its properties.`);
    }

    for (const key of keys) {
      
      const mappingConfig: MappingVI = mappingList[key];
      c[key] = initValue(
        c[key],
        mappingConfig, 
        key, 
        inputData[mappingConfig.mappingKey]
      );

    }

    c.toData = toData.bind(c);

    return c;

  };

  newConstructor.prototype = originalC.prototype;
  newConstructor.prototype.constructor = newConstructor;

  return newConstructor;

}