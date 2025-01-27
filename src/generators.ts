import fs from 'fs-extra';
import path from 'path';
import { TemplateFiles } from './types';

export const TEMPLATES: TemplateFiles = {
  'ai-policy.json': JSON.stringify({
    version: "1.0",
    policy: {
      agents: {},
      semantic_sitemap: "/ai-sitemap.json",
      negotiation_api: "/api/ai-negotiate"
    }
  }, null, 2),
  
  'agents.json': JSON.stringify({
    version: "1.0",
    agents: []
  }, null, 2),
  
  'llms.txt': `# LLM Access Rules
User-agent: *
Allow: /`
};

export function generateFiles(options: { 
  outputDir: string;
  files: string[];
}) {
  options.files.forEach(file => {
    const templatePath = path.join(__dirname, 'templates', file);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${file}`);
    }
    
    const outputPath = path.join(options.outputDir, file);
    fs.copySync(templatePath, outputPath);
  });
}