export interface MappingVI {

  /**
   * key in data you want to mapped.
   *
   * @type {string}
   * @memberof MappingVI
   */
  mappingKey?: string;

  /**
   * If you don't want to set default value when mapping empty data, set true to this flag.
   *
   * @type {boolean}
   * @memberof MappingVI
   */
  nullable?: boolean;

}
