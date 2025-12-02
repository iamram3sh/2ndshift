/**
 * Batch update text colors and section separators across all pages
 * Run with: node scripts/batch-update-colors.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Files to update
const files = glob.sync('app/**/*.tsx', { cwd: path.join(__dirname, '..') });

const colorMappings = [
  // Headings
  { from: /text-slate-900/g, to: 'text-[#111]' },
  { from: /text-slate-800/g, to: 'text-[#111]' },
  { from: /text-slate-700/g, to: 'text-[#111]' },
  // Body text
  { from: /text-slate-600/g, to: 'text-[#333]' },
  { from: /text-slate-500/g, to: 'text-[#333]' },
  { from: /text-slate-400/g, to: 'text-[#333]' },
];

const sectionMappings = [
  // Light sections
  { from: /section className="py-(\d+)(?: lg:py-(\d+))? bg-white"/g, to: 'section className="py-$1$2 bg-white border-t border-slate-200"' },
  { from: /section className="py-(\d+)(?: lg:py-(\d+))? bg-slate-50"/g, to: 'section className="py-$1$2 bg-slate-50 border-t border-slate-200"' },
  { from: /section className="py-(\d+)(?: lg:py-(\d+))?"(?!.*border-t)/g, to: (match) => {
    if (!match.includes('bg-slate-900') && !match.includes('bg-slate-800')) {
      return match.replace('"', ' border-t border-slate-200"');
    }
    return match;
  }},
  // Dark sections
  { from: /section className="py-(\d+)(?: lg:py-(\d+))? bg-slate-900"(?!.*border-t)/g, to: 'section className="py-$1$2 bg-slate-900 border-t border-slate-800"' },
  { from: /section className="py-(\d+)(?: lg:py-(\d+))? bg-slate-800"(?!.*border-t)/g, to: 'section className="py-$1$2 bg-slate-800 border-t border-slate-800"' },
];

console.log(`Found ${files.length} files to process...\n`);

let updated = 0;
files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Skip if already processed (has text-[#111] or text-[#333])
  if (content.includes('text-[#111]') || content.includes('text-[#333]')) {
    // Still check for section separators
    const originalContent = content;
    
    sectionMappings.forEach(({ from, to }) => {
      if (typeof to === 'function') {
        content = content.replace(from, to);
      } else {
        content = content.replace(from, to);
      }
    });
    
    if (content !== originalContent) {
      modified = true;
    }
  } else {
    // Apply color mappings
    colorMappings.forEach(({ from, to }) => {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    // Apply section mappings
    sectionMappings.forEach(({ from, to }) => {
      if (typeof to === 'function') {
        content = content.replace(from, to);
      } else {
        content = content.replace(from, to);
      }
    });
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated: ${file}`);
    updated++;
  }
});

console.log(`\n✅ Updated ${updated} files.`);
console.log('⚠️  Note: Review dark background sections manually.');

