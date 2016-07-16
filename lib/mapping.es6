export default class Mapping {

  constructor(source) {

    if (!source) {
      throw new Error("the source field name cannot be null");
    }
    this.source = source;
    this.target;
  }

  to(target, fnc) {

    if (!target) {
      throw new Error("the target field name cannot be null");
    }

    if (fnc) {

      this.target = {
        key: target,
        transform: fnc
      }

      return;
    }

    this.target = target;
  }

}
