const fs = require('fs').promises;
const path = require('path');

(async () => {
  const filePath = path.join(
    __dirname,
    '../android/gradle.properties'
  );
  let fileContents = await fs.readFile(filePath, 'utf-8');
  fileContents = fileContents.replaceAll(
    '__KEYSTORE_PASSWORD__',
    process.env.KEYSTORE_PASSWORD
  );

  console.log(fileContents);

  await fs.writeFile(filePath, fileContents);
})();
