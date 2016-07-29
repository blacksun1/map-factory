const Chalk = require("chalk");


// **********************************************
// Re-usable listener handlers
// **********************************************
exports.suiteStart = function suiteStart (event) {

  console.log(Chalk.green(`Running ${this.name} benchmark`));
}

exports.suiteError = function suiteError (event) {

  console.log(`An error happened in '${event.target.name}'`, event.target.error);
}

exports.suiteCycle = function suiteCycle (event) {

  console.log(`${event.target}`);
}

exports.suiteComplete = function suiteComplete (event) {

  console.log(`Suite ${this.name} is complete. Fastest benchmark was ${Chalk.green(this.filter("fastest").map("name"))}`);
}