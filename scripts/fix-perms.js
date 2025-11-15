const fs = require('fs');
const path = './node_modules/.bin/vite';
try {
  fs.chmodSync(path, 0o755);
  console.log('chmod applied to', path);
} catch (e) {
  console.log('chmod skipped or failed (normal on Windows):', e.message);
}
