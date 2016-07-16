import objectMapper from "object-mapper";

export default class Mapper {

  constructor() {

    this.assignment = [];
    this.mapCache = null;
  }

  registerMapping(mapping) {

    this.assignment.push(mapping);
  }

  execute(sourceObject) {

    if (sourceObject === null || sourceObject === undefined) {
      throw new Error("sourceObject is required");
    }

    if (this.mapCache === null) {
      this.mapCache = this.createMapData();
    }

    const output = objectMapper(sourceObject, {}, this.mapCache.transform);

    return this.appendMultiSelections(sourceObject, output, this.mapCache.multiMaps);
  }

  createMapData() {

    const mapData = {
      transform: {},
      multiMaps: []
    };

    for (const item of this.assignment) {

      const sourceKey = item.source;
      let target = item.target;

      if (Array.isArray(item.source)) {

        if (!target.transform) {
          throw new Error("Multiple selections must map to a transform. No transform provided.");
        }

        mapData.multiMaps.push(item);
        continue;
      }

      if (!target) {
        target = sourceKey;
      }

      mapData.transform[sourceKey] = target;

    }

    return mapData;
  }

  appendMultiSelections(source, target, multiMaps) {

    let output = target;

    for (const item of multiMaps) {

      const params = [];

      for (const sourceKey of item.source) {

        const value = objectMapper.getKeyValue(source, sourceKey);
        params.push(value);
      }

      const result = item.target.transform.apply(null, params);

      output = objectMapper.setKeyValue(output, item.target.key, result);

    }

    return output;
  }
}
