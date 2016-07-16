import Mapper from "./mapper";
import Mapping from "./mapping";

export default function createMapper() {

  const me = {
    mapper: new Mapper()
  };

  const map = function map(source) {

    const mapping = new Mapping(source);
    this.mapper.registerMapping(mapping);

    return mapping;

  }.bind(me);

  map.execute = function (obj) {
    return this.mapper.execute(obj);
  }.bind(me);

  return map;

}
