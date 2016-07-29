"use strict";

const Benchmark = require("benchmark");
const Chalk = require("chalk");
const createMapper = require("../dist/lib");


// **********************************************
// Re-usable listener handlers
// **********************************************
function suiteStart (event) {

  console.log(Chalk.green(`Running ${this.name} benchmark`));
}

function suiteError (event) {

  console.log(`An error happened in '${event.target.name}'`, event.target.error);
}

function suiteCycle (event) {

  console.log(`${event.target}`);
}

function suiteComplete (event) {

  console.log(`Suite ${this.name} is complete. Fastest benchmark was ${Chalk.green(this.filter("fastest").map("name"))}`);
}


// **********************************************
// Arrange our artifacts up front.
// **********************************************

function mapperFactory() {

  return createMapper()
    .map("a").to("z.a")
    .map("b").to("z.b")
    .map("y");
}

let reUsableMapper = mapperFactory();
let testObject = {
  a: "a",
  b: "b",
  y: "y"
};

// **********************************************
// Create a suite with the tests
// **********************************************

(new Benchmark.Suite("mapper speed testing"))
  .add("Non-Reuse", () => {

    let tempMapper = mapperFactory();
    return tempMapper.execute(testObject);
  })
  .add("Reuse", () => {

    return reUsableMapper.execute(testObject);
  })

  // **********************************************
  // Add listeners
  // **********************************************
  .on("start", suiteStart)
  .on("error", suiteError)
  .on("cycle", suiteCycle)
  .on("complete", suiteComplete)

  // **********************************************
  // Run the benchmark
  // **********************************************
  .run();

