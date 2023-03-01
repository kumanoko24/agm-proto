const { resolve, sep } = require("node:path");

const { open } = require("node:fs/promises");

const { glob } = require("glob");

function makeRecordObject() {
  const recordObject = {
    ExportsObjects: [],
    DataValidationsObjects: [],
    DataTransformationsObjects: [],
    FunctionsObjects: [],
    ExternalIOHelpersObjects: [],
  };

  return recordObject;
}

async function parseOneTSV(filePath, recordObject) {}

async function parseTSVs(dirPath) {
  const recordObject = makeRecordObject();

  const tsvGlobPattern = resolve(dirPath, "**", "*.tsv").split(sep).join("/");

  const filePaths = await glob(tsvGlobPattern);

  console.log(filePaths);
}

module.exports.parseTSVs = parseTSVs;
