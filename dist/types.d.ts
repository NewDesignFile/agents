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
export declare const TEMPLATES: {
    'ai-policy.json': string;
    'agents.json': string;
    'llms.txt': string;
};
