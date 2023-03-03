const vm = require("node:vm");

const {
  getBuiltInComputationHelpers,
  getBuiltInIOHelpers,
} = require("./builtInUtils.js");

function buildContext() {
  return {
    ...getBuiltInComputationHelpers(),
    IO: {
      ...getBuiltInIOHelpers(),
      External: {},
    },
  };
}

function makeScript(fname, args, body) {
  const f = new vm.Script(`
async function ${fname} (${args.join(
    ", "
  )}) { ${body}; } ${fname};`).runInNewContext(buildContext());

  return f;
}

module.exports.makeScript = makeScript;
