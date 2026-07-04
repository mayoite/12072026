import { Project, CallExpression, SyntaxKind } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: './tsconfig.json'
});

const testFiles = project.getSourceFiles().filter(f => f.getFilePath().includes('.test.ts') || f.getFilePath().includes('.test.tsx'));

const fakeTests = [];

testFiles.forEach(sourceFile => {
  const filePath = sourceFile.getFilePath();
  
  // Find all test() or it() calls
  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  const testCalls = calls.filter(call => {
    const expr = call.getExpression();
    const text = expr.getText();
    return text === 'test' || text === 'it' || text === 'test.skip' || text === 'it.skip' || text === 'test.todo' || text === 'it.todo';
  });

  if (testCalls.length === 0) {
    fakeTests.push({ file: filePath, reason: 'No tests found in file' });
    return;
  }

  testCalls.forEach(call => {
    const exprText = call.getExpression().getText();
    const args = call.getArguments();
    if (args.length < 1) return;
    
    const testName = args[0].getText();
    
    // Check if skipped or todo
    if (exprText.includes('skip') || exprText.includes('todo')) {
      fakeTests.push({ file: filePath, test: testName, reason: `Marked as ${exprText}` });
      return;
    }

    // Check for empty body or no expects
    if (args.length >= 2) {
      const body = args[1];
      const bodyText = body.getText();
      if (!bodyText.includes('expect(') && !bodyText.includes('expect.')) {
        fakeTests.push({ file: filePath, test: testName, reason: 'No assertions (expect) found in test body' });
      }
    } else {
       fakeTests.push({ file: filePath, test: testName, reason: 'Test has no body' });
    }
  });
});

console.log(JSON.stringify(fakeTests, null, 2));
