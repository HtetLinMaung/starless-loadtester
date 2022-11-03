#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { timeout } = require("starless-async");
const injectFake = require("./inject-fake");
const request = require("./request");
const writeToCsv = require("./write-to-csv");
const rootPath = process.cwd();

async function main() {
  const args = process.argv.slice(2);

  if (args[0]) {
    const json = require(path.join(rootPath, args[0]));

    const items = [];
    for (const [endpointName, v] of Object.entries(json.endpoints)) {
      const url = `${json.domain}${v.path}`;
      const headers = v.headers || {};
      let body = v.body || {};
      const query = v.query || {};
      const n = v.n || v.t;

      const promises = [];
      for (let i = 0; i < v.t; i++) {
        if (promises.length % n == 0) {
          await timeout(1);
        }
        if (Array.isArray(body)) {
          for (const b of body) {
            promises.push(
              request(
                url,
                v.method,
                injectFake(query),
                injectFake(b),
                injectFake(headers)
              )
            );
          }
        } else {
          promises.push(
            request(
              url,
              v.method,
              injectFake(query),
              injectFake(body),
              injectFake(headers)
            )
          );
        }
      }

      const results = [];
      for (const promise of promises) {
        const result = await promise;
        console.log(result);
        results.push(result);
      }
      if (args.includes("--out=json")) {
        fs.writeFileSync(
          path.join(rootPath, `${endpointName}_results.json`),
          JSON.stringify(results, null, 2)
        );
      } else {
        writeToCsv(results, `${endpointName}_results`);
      }

      const durations = results.map((r) => r.duration);
      const successCounts = results.filter((r) => r.success).length;
      const failCounts = results.filter((r) => !r.success).length;

      const item = {
        name: endpointName,
        min: Math.min(...durations),
        max: Math.max(...durations),
        avg: durations.reduce((a, b) => a + b, 0) / durations.length,
        successCounts,
        failCounts,
        successPercent: (successCounts / v.t) * 100,
        failPercent: (failCounts / v.t) * 100,
      };
      console.log(item);
      items.push(item);
    }
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
