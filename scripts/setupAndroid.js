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
  console.log(`generated ${filePath}`);
}

(async () => {
  try {
    await Promise.all([
      generateFile(
        path.join(__dirname, '../android/gradle.properties'),
        ['KEYSTORE_PASSWORD', 'GOOGLE_API_KEY_ANDROID']
      ),
      generateFile(
        path.join(__dirname, '../android/app/build.gradle'),
        ['GOOGLE_API_KEY_ANDROID']
      )
    ]);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
