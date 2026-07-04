const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      findFiles(path.join(dir, file), filter, fileList);
    } else if (filter.test(file)) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const testFiles = findFiles(path.join(__dirname, '../tests'), /\.test\.tsx?$/);
const fakeTests = [];

for (const file of testFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  // A naive check: find all `test('...'` or `it('...'` or `describe('...'`
  // Actually, we can just look for files that don't have `expect(`
  if (!content.includes('expect(')) {
    fakeTests.push(`File has no assertions: ${file}`);
  }
  
  // Look for test.todo or it.todo
  if (content.includes('test.todo') || content.includes('it.todo') || content.includes('test.skip') || content.includes('it.skip')) {
    fakeTests.push(`File contains skipped/todo tests: ${file}`);
  }
}

console.log(JSON.stringify(fakeTests, null, 2));
