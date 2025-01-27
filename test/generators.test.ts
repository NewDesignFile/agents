import fs from 'fs';
import path from 'path';
import { generateFiles } from '../src/generators';
import { TEMPLATES } from '../src/types';

const TEST_DIR = path.join(__dirname, 'test-output');

describe('File Generator', () => {
  beforeEach(() => {
    // Clean test directory
    if (fs.existsSync(TEST_DIR)) {
      fs.rmdirSync(TEST_DIR, { recursive: true });
    }
    fs.mkdirSync(TEST_DIR);
  });

  afterEach(() => {
    fs.rmdirSync(TEST_DIR, { recursive: true });
  });

  test('generates ai-policy.json', () => {
    generateFiles({
      outputDir: TEST_DIR,
      files: ['ai-policy.json']
    });
    
    const content = fs.readFileSync(
      path.join(TEST_DIR, 'ai-policy.json'), 
      'utf-8'
    );
    expect(content).toEqual(TEMPLATES['ai-policy.json']);
  });

  test('generates agents.json', () => {
    generateFiles({
      outputDir: TEST_DIR,
      files: ['agents.json']
    });
    
    const content = fs.readFileSync(
      path.join(TEST_DIR, 'agents.json'), 
      'utf-8'
    );
    expect(content).toEqual(TEMPLATES['agents.json']);
  });

  test('throws error for unsupported files', () => {
    expect(() => {
      generateFiles({
        outputDir: TEST_DIR,
        files: ['unknown.txt']
      });
    }).toThrow('Unsupported file type: unknown.txt');
  });
});