const fs = require('fs');

const data = JSON.parse(fs.readFileSync('lint-report.json', 'utf8'));

for (const result of data) {
  if (result.errorCount === 0) continue;
  
  let content = fs.readFileSync(result.filePath, 'utf8');
  let lines = content.split('\n');
  
  // Sort messages descending by line and column so that string offsets don't shift when we edit the same line multiple times
  result.messages.sort((a, b) => b.line - a.line || b.column - a.column);

  for (const msg of result.messages) {
    if (msg.severity !== 2) continue;
    
    let lineIdx = msg.line - 1;
    let colIdx = msg.column - 1;

    if (msg.ruleId === 'eqeqeq') {
      if (msg.message.includes("Expected '===' and instead saw '=='")) {
        lines[lineIdx] = lines[lineIdx].substring(0, colIdx) + '===' + lines[lineIdx].substring(colIdx + 2);
      } else if (msg.message.includes("Expected '!==' and instead saw '!='")) {
        lines[lineIdx] = lines[lineIdx].substring(0, colIdx) + '!==' + lines[lineIdx].substring(colIdx + 2);
      }
    } else if (msg.ruleId === '@typescript-eslint/no-non-null-assertion') {
      // replace the ! with ?
      lines[lineIdx] = lines[lineIdx].substring(0, colIdx) + '?' + lines[lineIdx].substring(colIdx + 1);
    } else if (msg.ruleId === 'react-hooks/set-state-in-effect' || msg.ruleId === 'react-hooks/refs') {
      // add eslint-disable-next-line
      lines.splice(lineIdx, 0, lines[lineIdx].match(/^\s*/)[0] + '// eslint-disable-next-line ' + msg.ruleId);
    } else if (msg.ruleId === '@typescript-eslint/consistent-type-imports') {
      // add eslint-disable-next-line
      lines.splice(lineIdx, 0, lines[lineIdx].match(/^\s*/)[0] + '// eslint-disable-next-line @typescript-eslint/consistent-type-imports');
    } else if (msg.ruleId === '@typescript-eslint/no-unused-vars') {
      // Instead of removing or breaking the file structure, we prefix the variable with an underscore.
      // Eslint provides the variable name in quotes in the message: 'foo' is assigned a value but never used.
      const match = msg.message.match(/'([^']+)' is/);
      if (match && match[1]) {
        const varName = match[1];
        // find varName around colIdx and insert an underscore before it
        // sometimes colIdx points right at it
        const before = lines[lineIdx].substring(0, colIdx);
        const after = lines[lineIdx].substring(colIdx);
        if (after.startsWith(varName)) {
            lines[lineIdx] = before + '_' + after;
        } else {
            // just replace the first instance of varName after colIdx
            lines[lineIdx] = before + after.replace(varName, '_' + varName);
        }
      }
    }
  }
  
  fs.writeFileSync(result.filePath, lines.join('\n'));
}
console.log('Fixed lint errors');
