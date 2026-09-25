const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname);
const outDir = path.resolve(__dirname, 'www');

// Ensure www exists and clean it
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Files to copy
const files = ['index.html', 'styles.css', 'app.js', 'config.js'];
files.forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(outDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> www/${file}`);
  }
});

// Directories to copy
const dirs = ['assets'];
dirs.forEach(dir => {
  const src = path.join(srcDir, dir);
  const dest = path.join(outDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Copied ${dir}/ -> www/${dir}/`);
  }
});

console.log('Build completed successfully!');
