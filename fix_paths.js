const fs = require('fs');
const path = require('path');

const referRoot = 'd:\\OandO07072026\\Refer';
const workspaceRoot = 'd:\\OandO07072026';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.md')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(referRoot);
let updatedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Find markdown links: [text](href)
  // We need to carefully replace the href part.
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  content = content.replace(regex, (match, text, href) => {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('file://')) {
      return match;
    }
    if (href.startsWith('#')) return match; // anchor
    
    // Split href into path and hash
    let hrefPath = href;
    let hash = '';
    const hashIndex = href.indexOf('#');
    if (hashIndex !== -1) {
      hrefPath = href.substring(0, hashIndex);
      hash = href.substring(hashIndex);
    }
    
    if (!hrefPath) return match;
    
    // Resolve current href against the file's directory
    const fileDir = path.dirname(file);
    const resolvedInRefer = path.resolve(fileDir, hrefPath);
    
    if (fs.existsSync(resolvedInRefer)) {
      // It exists within Refer (or resolves successfully), no change needed.
      return match;
    }
    
    // If it doesn't exist, it might need an extra '../' because the file was moved down one level into 'Refer'.
    // Let's check if adding '../' makes it exist in the workspace root.
    const newHrefPath = '../' + hrefPath;
    const resolvedInWorkspace = path.resolve(fileDir, newHrefPath);
    
    if (fs.existsSync(resolvedInWorkspace)) {
      // It exists with the extra '../', so we update the link.
      const newHref = newHrefPath.replace(/\\/g, '/') + hash;
      return `[${text}](${newHref})`;
    }
    
    // If we still can't find it, we could blindly add '../' assuming it's an external link, 
    // or just leave it. Let's blindly add '../' if it's a relative link going outside its dir, just in case.
    if (hrefPath.startsWith('../') || hrefPath.startsWith('./')) {
      const fallbackHref = '../' + hrefPath;
      return `[${text}](${fallbackHref.replace(/\\/g, '/')}${hash})`;
    }
    
    return match;
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    updatedFiles++;
  }
});

console.log(`Updated paths in ${updatedFiles} files.`);
