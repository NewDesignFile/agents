"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATES = void 0;
exports.TEMPLATES = {
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
