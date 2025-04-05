export const DEFAULT_TEMPLATES = {
    'ai-policy.json': JSON.stringify({
        version: "1.0",
        environment: "{{environment}}",
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
    }, null, 2),
    'agents.json': JSON.stringify({
        version: "1.0",
        agents: []
    }, null, 2),
    'llms.txt': `# LLM Access Rules for {{projectName}}
# Environment: {{environment}}
# Version: {{version}}

User-agent: *
Allow: /api/ai-negotiate
Allow: /ai-sitemap.json
Disallow: /private/*
`,
    'semantic-sitemap.json': JSON.stringify({
        version: "{{version}}",
        baseUrl: "{{baseUrl}}",
        paths: {
            "/": {
                title: "Home",
                description: "Main page of {{projectName}}",
                allowedAgents: ["*"],
                children: []
            },
            "/api": {
                title: "API Endpoints",
                description: "API documentation and endpoints",
                allowedAgents: ["api-docs-agent"],
                children: [
                    "/api/ai-negotiate"
                ]
            }
        },
        metadata: {
            lastUpdated: "{{timestamp}}",
            environment: "{{environment}}"
        }
    }, null, 2),
    'security-rules.json': JSON.stringify({
        version: "{{version}}",
        environment: "{{environment}}",
        rules: {
            authentication: {
                required: true,
                methods: ["api_key", "oauth2"],
                oauth2: {
                    authorizationUrl: "{{authUrl}}",
                    tokenUrl: "{{tokenUrl}}",
                    scopes: ["ai.read", "ai.write"]
                }
            },
            rateLimit: {
                enabled: true,
                default: {
                    requests: 100,
                    period: "1m"
                },
                paths: {
                    "/api/*": {
                        requests: 50,
                        period: "1m"
                    }
                }
            },
            contentSecurity: {
                maxTokensPerRequest: 4096,
                allowedMimeTypes: [
                    "text/plain",
                    "application/json",
                    "text/markdown"
                ],
                maxRequestSize: "1mb"
            }
        }
    }, null, 2),
    'agent-capabilities.json': JSON.stringify({
        version: "{{version}}",
        standardCapabilities: {
            read: {
                description: "Read and understand content",
                permissions: ["content.read"]
            },
            navigate: {
                description: "Navigate through site structure",
                permissions: ["sitemap.read"]
            },
            search: {
                description: "Search through content",
                permissions: ["content.search"]
            },
            interact: {
                description: "Interact with UI elements",
                permissions: ["ui.interact"]
            },
            api: {
                description: "Make API calls",
                permissions: ["api.call"]
            }
        },
        customCapabilities: {
            project: "{{projectName}}",
            capabilities: {}
        }
    }, null, 2)
};
//# sourceMappingURL=types.js.map