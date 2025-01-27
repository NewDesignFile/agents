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
    if (!(file in TEMPLATES)) {
      throw new Error(`Unsupported file type: ${file}`);
    }
    
    const outputPath = path.join(options.outputDir, file);
    fs.ensureDirSync(path.dirname(outputPath));
    fs.writeFileSync(outputPath, TEMPLATES[file as keyof TemplateFiles]);
  });
}