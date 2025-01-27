import fs from 'fs-extra';
import path from 'path';
export const TEMPLATES = {
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
export function generateFiles(options) {
    options.files.forEach(file => {
        const templatePath = path.join('templates', file); // Updated path
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${file}`);
        }
        const outputPath = path.join(options.outputDir, file);
        fs.ensureDirSync(path.dirname(outputPath));
        fs.copySync(templatePath, outputPath);
    });
}
