const fs = require('fs');
const path = require('path');

function getFiles(dir, filter, fileList = []) {
  if (dir.includes('node_modules') || dir.includes('.next') || dir.includes('results') || dir.includes('generated-documents') || dir.includes('archive')) {
    return fileList;
  }
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath, filter, fileList);
    } else if (filter.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

try {
  // 1. Get all test files in the directory
  const allTestFiles = getFiles(path.join(__dirname, '..'), /\.test\.tsx?$/)
    .map(f => path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/'));

  // 2. Get executed test files from vitest-results.json
  const resultsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../results/tests/vitest-results.json'), 'utf8'));
  const executedFiles = resultsData.testResults.map(tr => path.relative(path.join(__dirname, '..'), tr.name).replace(/\\/g, '/'));

  // 3. Diff the two sets
  const executedSet = new Set(executedFiles);
  const unrunFiles = allTestFiles.filter(f => !executedSet.has(f));

  console.log(JSON.stringify({
    totalFound: allTestFiles.length,
    totalExecuted: executedFiles.length,
    unrunCount: unrunFiles.length,
    unrunFiles: unrunFiles
  }, null, 2));

} catch (e) {
  console.error("Error:", e);
}
