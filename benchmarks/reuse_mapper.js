"use strict";

const Benchmark = require("benchmark");
const CreateMapper = require("../dist/lib");
const CommonBenchmarkHandlers = require("./common_benchmark_handlers");


// **********************************************
// Arrange our artifacts up front.
// **********************************************

function mapperFactory() {

  return CreateMapper()
    .map("a").to("z.a")
    .map("b").to("z.b")
    .map("y");
}

const reUsableMapper = mapperFactory();
const testObject = {
  a: "a",
  b: "b",
  y: "y"
};


// **********************************************
// Create a suite with the tests
// **********************************************

(new Benchmark.Suite("mapper speed testing"))
  .add("Non-Reuse", () => {

    const tempMapper = mapperFactory();
    return tempMapper.execute(testObject);
  })
  .add("Reuse", () => {

    return reUsableMapper.execute(testObject);
  })

  // **********************************************
  // Add listeners
  // **********************************************
  .on("start", CommonBenchmarkHandlers.suiteStart)
  .on("error", CommonBenchmarkHandlers.suiteError)
  .on("cycle", CommonBenchmarkHandlers.suiteCycle)
  .on("complete", CommonBenchmarkHandlers.suiteComplete)

  // **********************************************
  // Run the benchmark
  // **********************************************
  .run();
