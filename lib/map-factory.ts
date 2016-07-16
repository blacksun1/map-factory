﻿import {IMapFactory, IMapping} from "./interfaces";
import Mapper from "./mapper";
import Mapping from "./mapping";

export default function createMapper(obj: any): IMapFactory {

  const me = {
    mapper: new Mapper(obj),
  };

  const map: IMapFactory = function map(source: string | string[]): IMapping {

    const mapping = new Mapping(source);
    this.mapper.registerMapping(mapping);

    return mapping;
  }.bind(me);

  map.execute = function (source: any) {

    return this.mapper.execute(source);
  }.bind(me);

  return map;

}
