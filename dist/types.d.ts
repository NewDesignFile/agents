export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type Environment = 'development' | 'staging' | 'production';
export interface AgentsConfig {
    outputDir: string;
    templates: {
        directory: string;
        customDir: string;
    };
    validation: {
        enabled: boolean;
        strict: boolean;
    };
    environments: Environment[];
    logging: {
        level: LogLevel;
        format: 'pretty' | 'json';
    };
    security: {
        checkPolicies: boolean;
        allowMerge: boolean;
    };
}
export interface TemplateVariables {
    environment: Environment;
    projectName: string;
    version: string;
    baseUrl?: string;
    timestamp?: string;
    authUrl?: string;
    tokenUrl?: string;
    [key: string]: string | undefined;
}
export interface TemplateFiles {
    'ai-policy.json': string;
    'agents.json': string;
    'llms.txt': string;
    'semantic-sitemap.json': string;
    'security-rules.json': string;
    'agent-capabilities.json': string;
    [key: string]: string;
}
export interface AIPolicy {
    version: string;
    environment?: Environment;
    policy: {
        agents: Record<string, AgentPolicy>;
        semantic_sitemap?: string;
        negotiation_api?: string;
        security?: SecurityPolicy;
    };
}
export interface AgentPolicy {
    name: string;
    description?: string;
    capabilities: string[];
    allowedPaths: string[];
    rateLimit?: {
        requests: number;
        period: string;
    };
    authentication?: {
        type: 'none' | 'api_key' | 'oauth2';
        config?: Record<string, unknown>;
    };
}
export interface SecurityPolicy {
    maxTokensPerRequest?: number;
    allowedDomains?: string[];
    requireAuthentication?: boolean;
    rateLimiting?: {
        enabled: boolean;
        maxRequests: number;
        windowMs: number;
    };
}
export declare const DEFAULT_TEMPLATES: {
    'ai-policy.json': string;
    'agents.json': string;
    'llms.txt': string;
    'semantic-sitemap.json': string;
    'security-rules.json': string;
    'agent-capabilities.json': string;
};
//# sourceMappingURL=types.d.ts.map