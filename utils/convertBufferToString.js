const DataUri = require("datauri");
const path = require("path");

// Datauri is used  to convert the buffer into string
const dataURIChild = new DataUri();

module.exports = function(originalName, buffer) {
  let extension = path.extname(originalName);
  return dataURIChild.format(extension, buffer).content;
};