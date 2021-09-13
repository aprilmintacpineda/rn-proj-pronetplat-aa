const fs = require('fs').promises;
const path = require('path');

(async () => {
  try {
    const filePath = path.join(
      __dirname,
      '../android/gradle.properties'
    );

    let fileContents = await fs.readFile(filePath, 'utf-8');

    fileContents = fileContents.replace(
      /__KEYSTORE_PASSWORD__/gim,
      process.env.KEYSTORE_PASSWORD
    );

    fileContents = fileContents.replace(
      /__GOOGLE_API_KEY_ANDROID__/gim,
      process.env.GOOGLE_API_KEY_ANDROID
    );

    await fs.writeFile(filePath, fileContents);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();