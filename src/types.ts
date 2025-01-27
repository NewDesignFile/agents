export type TemplateFiles = {
  'ai-policy.json': string;
  'agents.json': string;
  'llms.txt': string;
};

export interface AIPolicy {
  version: string;
  policy: {
    agents: Record<string, unknown>;
    semantic_sitemap?: string;
    negotiation_api?: string;
  };
}

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
} satisfies TemplateFiles;