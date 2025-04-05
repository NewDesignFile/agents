import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFiles } from '../src/generators.js';
import { DEFAULT_TEMPLATES, TemplateVariables, Environment } from '../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  describe('template generation', () => {
    const defaultVariables: TemplateVariables = {
      environment: 'development' as Environment,
      projectName: 'test-project',
      version: '1.0.0',
      baseUrl: 'https://example.com',
      timestamp: '2025-04-05T16:00:00Z',
      authUrl: 'https://auth.example.com',
      tokenUrl: 'https://auth.example.com/token'
    };

    test('generates ai-policy.json with default options', async () => {
      await generateFiles({
        outputDir: TEST_DIR,
        files: ['ai-policy.json'],
        templates: DEFAULT_TEMPLATES,
        variables: defaultVariables
      });
      
      const content = fs.readFileSync(
        path.join(TEST_DIR, 'ai-policy.json'), 
        'utf-8'
      );
      const expectedContent = JSON.stringify({
        version: "1.0",
        environment: "development",
        policy: {
          agents: {},
          semantic_sitemap: "/ai-sitemap.json",
          negotiation_api: "/api/ai-negotiate",
          security: {
            maxTokensPerRequest: 4096,
            requireAuthentication: true,
            rateLimiting: {
              enabled: true,
              maxRequests: 100,
              windowMs: 60000
            }
          }
        }
      }, null, 2);
      expect(content).toEqual(expectedContent);
    });

    test('generates semantic-sitemap.json with variables', async () => {
      await generateFiles({
        outputDir: TEST_DIR,
        files: ['semantic-sitemap.json'],
        templates: DEFAULT_TEMPLATES,
        variables: defaultVariables
      });
      
      const content = JSON.parse(fs.readFileSync(
        path.join(TEST_DIR, 'semantic-sitemap.json'), 
        'utf-8'
      ));
      
      expect(content.version).toBe('1.0.0');
      expect(content.baseUrl).toBe('https://example.com');
      expect(content.metadata.environment).toBe('development');
      expect(content.metadata.lastUpdated).toBe('2025-04-05T16:00:00Z');
    });

    test('generates security-rules.json with oauth config', async () => {
      await generateFiles({
        outputDir: TEST_DIR,
        files: ['security-rules.json'],
        templates: DEFAULT_TEMPLATES,
        variables: defaultVariables
      });
      
      const content = JSON.parse(fs.readFileSync(
        path.join(TEST_DIR, 'security-rules.json'), 
        'utf-8'
      ));
      
      expect(content.rules.authentication.oauth2.authorizationUrl).toBe('https://auth.example.com');
      expect(content.rules.authentication.oauth2.tokenUrl).toBe('https://auth.example.com/token');
    });

    test('generates agent-capabilities.json with project name', async () => {
      await generateFiles({
        outputDir: TEST_DIR,
        files: ['agent-capabilities.json'],
        templates: DEFAULT_TEMPLATES,
        variables: defaultVariables
      });
      
      const content = JSON.parse(fs.readFileSync(
        path.join(TEST_DIR, 'agent-capabilities.json'), 
        'utf-8'
      ));
      
      expect(content.version).toBe('1.0.0');
      expect(content.customCapabilities.project).toBe('test-project');
      expect(Object.keys(content.standardCapabilities).length).toBeGreaterThan(0);
    });
  });


  test('generates agents.json with minimal config', async () => {
    await generateFiles({
      outputDir: TEST_DIR,
      files: ['agents.json']
    });
    
    const content = JSON.parse(fs.readFileSync(
      path.join(TEST_DIR, 'agents.json'), 
      'utf-8'
    ));
    expect(content.version).toBe('1.0');
    expect(Array.isArray(content.agents)).toBe(true);
  });

  test('throws error for unsupported files', async () => {
    await expect(generateFiles({
      outputDir: TEST_DIR,
      files: ['unknown.txt']
    })).rejects.toThrow('Template not found: unknown.txt');
  });
});