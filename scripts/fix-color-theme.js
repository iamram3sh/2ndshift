/**
 * Script to replace all indigo colors with primary brand color #0b63ff
 * Excludes Shifts-related components (amber/orange colors)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color mappings - indigo to primary blue
const colorMappings = [
  // Gradients
  { from: /from-indigo-600 to-purple-600/g, to: 'from-[#0b63ff] to-[#0a56e6]' },
  { from: /from-indigo-500 to-purple-600/g, to: 'from-[#0b63ff] to-[#0a56e6]' },
  { from: /from-indigo-500 to-purple-500/g, to: 'from-[#0b63ff] to-[#0a56e6]' },
  { from: /from-sky-500 to-indigo-600/g, to: 'from-sky-500 to-[#0b63ff]' },
  { from: /from-sky-500 to-indigo-500/g, to: 'from-sky-500 to-[#0b63ff]' },
  { from: /from-purple-600 to-indigo-600/g, to: 'from-purple-600 to-[#0b63ff]' },
  { from: /from-purple-500 to-indigo-600/g, to: 'from-purple-500 to-[#0b63ff]' },
  { from: /from-purple-500 to-indigo-500/g, to: 'from-purple-500 to-[#0b63ff]' },
  
  // Text colors
  { from: /text-indigo-600/g, to: 'text-[#0b63ff]' },
  { from: /text-indigo-700/g, to: 'text-[#0a56e6]' },
  { from: /text-indigo-500/g, to: 'text-[#0b63ff]' },
  { from: /text-indigo-400/g, to: 'text-blue-400' },
  { from: /text-indigo-800/g, to: 'text-[#0a56e6]' },
  { from: /text-indigo-900/g, to: 'text-[#0a56e6]' },
  { from: /text-indigo-100/g, to: 'text-blue-100' },
  
  // Background colors
  { from: /bg-indigo-600/g, to: 'bg-[#0b63ff]' },
  { from: /bg-indigo-700/g, to: 'bg-[#0a56e6]' },
  { from: /bg-indigo-500/g, to: 'bg-[#0b63ff]' },
  { from: /bg-indigo-100/g, to: 'bg-blue-100' },
  { from: /bg-indigo-50/g, to: 'bg-blue-50' },
  { from: /bg-indigo-400/g, to: 'bg-blue-400' },
  { from: /bg-indigo-800/g, to: 'bg-blue-800' },
  { from: /bg-indigo-900/g, to: 'bg-blue-900' },
  
  // Border colors
  { from: /border-indigo-600/g, to: 'border-[#0b63ff]' },
  { from: /border-indigo-500/g, to: 'border-[#0b63ff]' },
  { from: /border-indigo-200/g, to: 'border-blue-200' },
  { from: /border-indigo-300/g, to: 'border-blue-300' },
  { from: /border-indigo-400/g, to: 'border-blue-400' },
  { from: /border-indigo-800/g, to: 'border-blue-800' },
  
  // Hover states
  { from: /hover:text-indigo-600/g, to: 'hover:text-[#0b63ff]' },
  { from: /hover:text-indigo-700/g, to: 'hover:text-[#0a56e6]' },
  { from: /hover:bg-indigo-600/g, to: 'hover:bg-[#0b63ff]' },
  { from: /hover:bg-indigo-700/g, to: 'hover:bg-[#0a56e6]' },
  { from: /hover:bg-indigo-50/g, to: 'hover:bg-blue-50' },
  { from: /hover:border-indigo-600/g, to: 'hover:border-[#0b63ff]' },
  { from: /hover:border-indigo-400/g, to: 'hover:border-blue-400' },
  
  // Focus rings
  { from: /focus:ring-indigo-500/g, to: 'focus:ring-[#0b63ff]' },
  { from: /focus:ring-indigo-100/g, to: 'focus:ring-blue-100' },
  { from: /focus:ring-indigo-900/g, to: 'focus:ring-blue-900' },
  { from: /focus:border-indigo-500/g, to: 'focus:border-[#0b63ff]' },
  
  // Group hover
  { from: /group-hover:text-indigo-600/g, to: 'group-hover:text-[#0b63ff]' },
  { from: /group-hover:text-indigo-400/g, to: 'group-hover:text-blue-400' },
  { from: /group-hover:border-indigo-600/g, to: 'group-hover:border-[#0b63ff]' },
  
  // Dark mode variants
  { from: /dark:text-indigo-400/g, to: 'dark:text-blue-400' },
  { from: /dark:hover:text-indigo-400/g, to: 'dark:hover:text-blue-400' },
  { from: /dark:bg-indigo-900/g, to: 'dark:bg-blue-900' },
  { from: /dark:border-indigo-800/g, to: 'dark:border-blue-800' },
  { from: /dark:border-indigo-600/g, to: 'dark:border-blue-600' },
  { from: /dark:hover:border-indigo-400/g, to: 'dark:hover:border-blue-400' },
  { from: /dark:focus:ring-indigo-900/g, to: 'dark:focus:ring-blue-900' },
  
  // Background gradients
  { from: /from-indigo-50 to-purple-50/g, to: 'from-blue-50 to-slate-50' },
  { from: /from-indigo-50 via-purple-50/g, to: 'from-blue-50 via-slate-50' },
];

// Files/directories to exclude (Shifts components)
const excludePatterns = [
  /shifts/i,
  /Shifts/i,
  /amber/i,
  /orange/i,
  /node_modules/,
  /\.next/,
  /\.git/,
];

function shouldExclude(filePath) {
  return excludePatterns.some(pattern => pattern.test(filePath));
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file contains Shifts/amber/orange - skip if it does
    if (/shifts|amber|orange/i.test(content) && /indigo/i.test(content)) {
      // Only replace if not in Shifts context
      const lines = content.split('\n');
      const newLines = lines.map(line => {
        // Skip lines that contain Shifts-related context
        if (/shifts|amber|orange/i.test(line.toLowerCase())) {
          return line;
        }
        let newLine = line;
        colorMappings.forEach(({ from, to }) => {
          if (from.test(newLine)) {
            newLine = newLine.replace(from, to);
            modified = true;
          }
        });
        return newLine;
      });
      if (modified) {
        content = newLines.join('\n');
      }
    } else {
      // Safe to replace all
      colorMappings.forEach(({ from, to }) => {
        if (from.test(content)) {
          content = content.replace(from, to);
          modified = true;
        }
      });
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (shouldExclude(filePath)) {
      return;
    }
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main execution
const appDir = path.join(__dirname, '..', 'app');
const componentsDir = path.join(__dirname, '..', 'components');

console.log('🔍 Finding files...');
const files = [
  ...findTsxFiles(appDir),
  ...findTsxFiles(componentsDir),
].filter(file => !shouldExclude(file));

console.log(`📝 Found ${files.length} files to process\n`);

let updatedCount = 0;
files.forEach(file => {
  if (processFile(file)) {
    updatedCount++;
  }
});

console.log(`\n✅ Updated ${updatedCount} files`);
console.log('🎨 Color theme standardization complete!');
