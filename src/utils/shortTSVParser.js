const { logger } = require("./logger.js");

const { resolve, sep } = require("node:path");

const { readFile } = require("node:fs/promises");

const { glob } = require("glob");

const { makeScript } = require("./makeScript.js");

function makeRecordObject() {
  const recordObject = {
    ExportsObjects: [],
    DataValidationsObjects: [],
    DataTransformationsObjects: [],
    FunctionsObjects: [],
    DataSchemaObjects: [],
    ExternalIOHelpersObjects: [],
  };

  return recordObject;
}

function getTableCol(table, rowNum, colNum) {
  if (rowNum <= 0 || colNum <= 0) {
    throw new Error("wrong rowNum or colNum");
  }

  return table[rowNum - 1][colNum - 1] || "";
}

function parse0(table, colNames) {
  const result = [];

  let i = null; // usually it is 3, the first line of the value rows (not cols row)
  let rowsCount = table.length;

  table.forEach((row, ii) => {
    if (row[1] === "@@BEGIN" && i === null) {
      i = ii + 2;
    }
  });

  // cols row
  table[i - 1].forEach((c, i) => {
    if (c !== colNames[i]) {
      throw new Error("Colum name not matched " + i + ", " + c);
    }
  });

  while (true) {
    if (i >= rowsCount || table[i] === undefined || table[i] === null) {
      break;
    }

    const row = table[i] || null;

    if (colNames.length > row.length) {
      throw new Error("Missing cols in the table, line: " + (i + 1));
    }

    const oneItem = {};

    colNames.forEach((cn, ii) => {
      oneItem[cn] = row[ii];
    });

    result.push(oneItem);

    i++;
  }

  return result;
}

function parseExports(recordObject, table) {
  const colNames = [
    "Enabled",
    "Name",
    "Export Type",
    "Export Path",
    "Input Mode",
    "Input Validation",
    "Input Transformation",
    "Linked Functions URIs",
    "Output Validation",
    "Output Transformation",
    "Output Mode",
    "Metadata",
  ];

  const parsed = parse0(table, colNames);

  parsed.forEach((p) => recordObject.ExportsObjects.push(p));
}

function parseDataValidations(recordObject, table) {
  const colNames = ["Enabled", "Unique Name", "Input Mode", "Functions URIs"];

  const parsed = parse0(table, colNames);

  parsed.forEach((p) => recordObject.DataValidationsObjects.push(p));
}

function parseDataTransformations(recordObject, table) {
  const colNames = [
    "Enabled",
    "Unique Name",
    "Input Mode",
    "Output Mode",
    "Functions URIs",
  ];

  const parsed = parse0(table, colNames);

  parsed.forEach((p) => recordObject.DataTransformationsObjects.push(p));
}

function parseFunctions(recordObject, table) {
  const colNames = [
    "URI",
    "Name",
    "Input Args",
    "Input Types",
    "Output Type",
    "Function Body",
    "Built-in I/O Helpers",
    "External I/O Helpers",
  ];

  const parsed = parse0(table, colNames);

  parsed.forEach((p) => recordObject.FunctionsObjects.push(p));
}

function parseDataSchemas(recordObject, table) {
  const colNames = [
    "Column Name",
    "Type",
    "Key",
    "Nullable",
    "Indexed",
    "Default Value",
    "Connection To Other Data Schema",
  ];

  const parsed = parse0(table, colNames);

  parsed.forEach((p) => recordObject.DataSchemaObjects.push(p));
}

function parseExternalIOHelpers(recordObject, table) {
  const colNames = [
    "Enabled",
    "URI",
    "Name",
    "Connection URI",
    "Connection User",
    "Connection Password",
    "Type",
    "Used Data Schemas",
    "Metadata",
  ];

  const parsed = parse0(table, colNames);

  parsed.forEach((p) => recordObject.ExternalIOHelpersObjects.push(p));
}

function checkAllParsed(recordObject) {
  logger.debug("check all", recordObject);
}

function loadAll(recordObject) {
  const runtimeObject = {
    Functions: {},
    DataTransformations: {},
    Exports: [],
  };

  // Functions
  for (const f of recordObject.FunctionsObjects) {
    const fname =
      "_" +
      f["URI"]
        .split(/[\/\-\:]/)
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
        .join("_");

    runtimeObject.Functions[f.URI] = makeScript(
      fname,
      f["Input Args"]?.split(",")?.map((c) => c.trim()) || [],
      f["Function Body"]
    );
  }

  // Data Transformations
  for (const DTF of recordObject.DataTransformationsObjects) {
    if (DTF["Enabled"]?.toLowerCase() === "yes") {
      runtimeObject.DataTransformations[DTF["Unique Name"]] = DTF[
        "Functions URIs"
      ]
        .split(",")
        .map((f) => f.trim())
        .map((f) => runtimeObject.Functions[f]);
    }
  }

  // Exports
  for (const Exp of recordObject.ExportsObjects) {
    if (Exp["Enabled"]?.toLowerCase() === "yes") {
      if (Exp["Export Type"].startsWith("HTTP") === true) {
        const obj = {
          method: Exp["Export Type"].split("/")[1].trim().toLowerCase(),
          path: Exp["Export Path"],
          input_validation: [],
          input_transformation:
            runtimeObject.DataTransformations[Exp["Input Transformation"]],
          functions: Exp["Linked Functions URIs"]
            .split(",")
            .map((f) => f.trim())
            .map((f) => runtimeObject.Functions[f]),
          output_validation: [],
          output_transformation:
            runtimeObject.DataTransformations[Exp["Output Transformation"]],
          output_content_type: Exp["Output Mode"],
        };

        runtimeObject.Exports.push(obj);
      }
    }
  }

  return runtimeObject;
}

async function parseTSVs(dirPath) {
  const recordObject = makeRecordObject();

  const tsvGlobPattern = resolve(dirPath, "**", "*.tsv").split(sep).join("/");

  const filePaths = await glob(tsvGlobPattern);

  logger.info("Get TSVs", filePaths);

  for (const filePath of filePaths) {
    const content = await readFile(filePath, { encoding: "utf-8" });

    logger.debug("Parsing file", filePath);

    const table = content
      .split("\r")
      .join("")
      .split("\n")
      .map((line) =>
        line
          .split("\t")
          .map((c) => c.trim())
          .map((c) => (c === "" ? null : c))
      );

    const recordType = getTableCol(table, 2, 1); // A2

    logger.debug("Record Type", recordType);

    if (recordType === "Export") {
      parseExports(recordObject, table);
    }

    if (recordType === "Data Validation") {
      parseDataValidations(recordObject, table);
    }

    if (recordType === "Data Transformation") {
      parseDataTransformations(recordObject, table);
    }

    if (recordType === "Function") {
      parseFunctions(recordObject, table);
    }

    if (recordType === "Data Schema") {
      parseDataSchemas(recordObject, table);
    }

    if (recordType === "External I/O Helper") {
      parseExternalIOHelpers(recordObject, table);
    }
  }

  checkAllParsed(recordObject);

  const runtimeObject = loadAll(recordObject);

  return runtimeObject;
}

module.exports.parseTSVs = parseTSVs;
