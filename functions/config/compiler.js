const fs = require('fs');
const pug = require('pug');
const path = require('path');
const viewsDir = path.resolve(__dirname, '../resources/views/templates');

let getTemplate = (templatename) => {
  return path.resolve(viewsDir, templatename + '.pug');
};

let compileTemplate = (templatename, jsonData) => {
  let template = getTemplate(templatename);
  let compiled = pug.compileFile(template);
  return compiled(jsonData);
};

let output = (data) => {
  let file = path.resolve(__dirname, '../../output.html');
  fs.writeFileSync(file, data);
};

module.exports = { compileTemplate };

output(compileTemplate('verification', {}));