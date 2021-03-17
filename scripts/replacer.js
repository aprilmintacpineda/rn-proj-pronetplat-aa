const fs = require('fs').promises;
const path = require('path');
const cmdArgs = require('command-line-args');

(async () => {
  const optionDefinitions = [
    { name: 'file', alias: 'f', type: String },
    { name: 'placeholder', alias: 'p', type: String },
    { name: 'replacement', alias: 'r', type: String }
  ];

  const { file, placeholder, replacement } = cmdArgs(
    optionDefinitions
  );

  console.log(file, placeholder, replacement);

  const filePath = path.join(__dirname, '../', file);
  let fileContent = await fs.readFile(filePath, 'utf-8');
  fileContent = fileContent.replaceAll(placeholder, replacement);
  await fs.writeFile(filePath, fileContent);
})();
