const fs = require("fs");
const path = require("path");

module.exports = (items = [], filename) => {
  let csv = "";
  if (items.length) {
    csv += Object.keys(items[0]).join(",") + "\r\n";
    for (const item of items) {
      csv += Object.values(item).join(",") + "\r\n";
    }
    fs.writeFileSync(path.join(process.cwd(), filename + ".csv"), csv);
  }
};
