const isMac = /^darwin/.test(process.platform);

if (isMac === true) {
  const process = require('child_process');
  process.execSync('npm install fsevents --no-save');
}
