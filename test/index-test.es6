const createMapper = require("../lib/index");

const basicMappingGroup = {

  "Can require the module from ES5 land": function (test) {
    const source = {
      "fieldName": "name1"
    };

    const expected = {
      "field": {
        "name": "name1"
      }
    };

    const map = createMapper();

    map("fieldName").to("field.name");

    const actual = map.execute(source);

    test.deepEqual(actual, expected);
    test.done();
  }
};

exports.basicMapping = basicMappingGroup;
