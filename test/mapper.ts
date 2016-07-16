import * as nodeunit from "nodeunit";
const Sut = require("../lib/index");

const basicMappingGroup: nodeunit.ITestGroup = {

  "Execute should throw if no source is provided": (test: nodeunit.Test) => {

    // Arrange
    const sut = new Sut();

    // Act
    const act = () => sut.execute();

    // Assert
    test.throws(act);

    return test.done();
  }

}

exports.basicMapping = basicMappingGroup;
