import { IMapping } from "./interfaces";
export default class Mapper {
    assignment: IMapping[];
    sourceObject: Object;
    constructor(obj: any);
    registerMapping(mapping: IMapping): void;
    execute(source: any): any;
    private appendMultiSelections(source, target, multiMaps);
}
