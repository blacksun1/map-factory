var Benchmark = require("benchmark");
var Chalk = require("chalk");
var createMapper = require("../dist/lib");


// Arrange our artifacts up front.
function mapperFactory() {

  return createMapper()
    .map("a").to("z.a")
    .map("b").to("z.b")
    .map("y");
}

var reUsableMapper = mapperFactory();
var testObject = {
  a: "a",
  b: "b",
  y: "y"
}


// Benchmark tests
function nonReuse() {

  var tempMapper = mapperFactory();
  return tempMapper.execute(testObject);
}

function reuse() {

  return reUsableMapper.execute(testObject);
}


// Create a suite with the tests
var suite = (new Benchmark.Suite("non-async suite"))
  .add("Non-Reuse", nonReuse)
  .add("Reuse", reuse)

// Add listeners
suite.on("start", function(event) {

  console.log(Chalk.green("Running non-async benchmark"));
})
suite.on("error", function(event) {

  console.log("An error happened in '" + event.target.name + "'", event.target.error);
})
suite.on("cycle", function(event) {

  console.log(String(event.target));
})
suite.on("complete", function() {

  console.log("Fastest is " + this.filter("fastest").map("name"));

  // // Re-run the suite - over and over again.
  // suite.reset();
  // suite.run({
  //   async: false
  // })
});

// Run the benchmark
suite.run({
  async: false
})
