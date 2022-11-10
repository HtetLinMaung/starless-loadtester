#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const testLoad = require("./test-load");
const writeToCsv = require("./write-to-csv");
const rootPath = process.cwd();

async function main() {
  const args = process.argv.slice(2);

  if (args[0]) {
    const json = require(path.join(rootPath, args[0]));

    const items = await testLoad(
      json,
      () => {},
      (results, item, endpointName) => {
        if (args.includes("--out=json")) {
          fs.writeFileSync(
            path.join(rootPath, `${endpointName}_results.json`),
            JSON.stringify(results, null, 2)
          );
        } else {
          writeToCsv(results, `${endpointName}_results`);
        }
      }
    );
    if (args.includes("--out=json")) {
      fs.writeFileSync(
        path.join(rootPath, `${args[0].replace(".json", "")}_summary.json`),
        JSON.stringify(items, null, 2)
      );
    } else {
      writeToCsv(items, `${args[0].replace(".json", "")}_summary`);
    }
  }
}

main();
