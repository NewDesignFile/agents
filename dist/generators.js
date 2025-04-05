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
Allow: /api/ai-negotiate
Allow: /ai-sitemap.json
Disallow: /private/*`,
    'semantic-sitemap.json': JSON.stringify({
        version: "1.0",
        paths: {
            "/": {
                title: "Home",
                description: "Homepage",
                allowedAgents: ["*"]
            }
        }
    }, null, 2),
    'security-rules.json': JSON.stringify({
        version: "1.0",
        rules: {
            authentication: {
                required: true,
                methods: ["api_key"]
            },
            rateLimit: {
                enabled: true,
                default: {
                    requests: 100,
                    period: "1m"
                }
            }
        }
    }, null, 2),
    'agent-capabilities.json': JSON.stringify({
        version: "1.0",
        standardCapabilities: {
            read: {
                description: "Read content",
                permissions: ["content.read"]
            }
        },
        customCapabilities: {}
    }, null, 2)
};
export async function generateFiles(options) {
    const templates = options.templates || TEMPLATES;
    const variables = options.variables || {};
    options.files.forEach(file => {
        if (!templates[file]) {
            throw new Error(`Template not found: ${file}`);
        }
        const outputPath = path.join(options.outputDir, file);
        fs.ensureDirSync(path.dirname(outputPath));
        let content = templates[file];
        // Replace variables in template
        Object.entries(variables).forEach(([key, value]) => {
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        });
        fs.writeFileSync(outputPath, content, 'utf-8');
    });
}
//# sourceMappingURL=generators.js.map