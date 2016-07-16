"use strict";
var Sut = require("../lib/index");
var basicMappingGroup = {
    "Execute should throw if no source is provided": function (test) {
        // Arrange
        var sut = new Sut();
        // Act
        var act = function () { return sut.execute(); };
        // Assert
        test.throws(act);
        return test.done();
    }
};
exports.basicMapping = basicMappingGroup;
//# sourceMappingURL=mapper.js.map