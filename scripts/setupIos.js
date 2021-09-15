const fs = require('fs').promises;
const path = require('path');

async function generateFile (filePath, placeholders) {
  let fileContents = await fs.readFile(filePath, 'utf-8');

  placeholders.forEach(placeholder => {
    fileContents = fileContents.replace(
      new RegExp(`__${placeholder}__`, 'gim'),
      process.env[placeholder]
    );
  });

  await fs.writeFile(filePath, fileContents);
}

(async () => {
  try {
    await generateFile(
      path.join(
        __dirname,
        '../ios/proj_pronetplat_aa/AppDelegate.m'
      ),
      ['GOOGLE_API_KEY_IOS']
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
