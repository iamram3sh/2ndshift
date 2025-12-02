/**
 * Script to fix text colors across all pages
 * Replaces text-slate-* with #111 for headings and #333 for body text
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Text color mappings
const colorMappings = {
  // Headings - use #111
  'text-slate-900': 'text-[#111]',
  'text-slate-800': 'text-[#111]',
  'text-slate-700': 'text-[#111]',
  
  // Body text - use #333
  'text-slate-600': 'text-[#333]',
  'text-slate-500': 'text-[#333]',
  'text-slate-400': 'text-[#333]', // For light backgrounds, use #333
};

// Pages to update
const pagesToUpdate = [
  'app/about/page.tsx',
  'app/employers/page.tsx',
  'app/how-it-works/page.tsx',
  'app/jobs/page.tsx',
  'app/pricing/page.tsx',
  'app/workers/page.tsx',
  'app/for-workers/page.tsx',
  'app/features/page.tsx',
];

console.log('Starting text color fixes...\n');

pagesToUpdate.forEach(pagePath => {
  const fullPath = path.join(__dirname, '..', pagePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${pagePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Apply color mappings
  Object.entries(colorMappings).forEach(([oldColor, newColor]) => {
    if (content.includes(oldColor)) {
      // Don't replace if it's in a dark background context
      const regex = new RegExp(`(?!.*bg-slate-900|.*bg-slate-800)${oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
      const newContent = content.replace(regex, newColor);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated: ${pagePath}`);
  } else {
    console.log(`⏭️  Skipped: ${pagePath} (no changes needed)`);
  }
});

console.log('\n✅ Text color fixes complete!');
console.log('⚠️  Note: Dark background sections need manual review.');

