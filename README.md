# New UI Agents

A CLI to generate, validate, and manage AI agent policy files for web apps and sites.

## Features

- Interactive setup for easy configuration
- Multi-environment support (development, staging, production)
- Rich template system with variable substitution
- Built-in validation and security checks
- Comprehensive policy file generation
- Dry-run mode for previewing changes
- Automated policy file upgrades

## Installation

```bash
npm install @new-ui/agents --save-dev
```

## Configuration

The package supports multiple configuration methods:

### Environment Variables

```bash
AGENTS_BASE_URL=https://example.com
AGENTS_PROJECT_NAME=my-project
AGENTS_AUTH_URL=https://auth.example.com
AGENTS_TOKEN_URL=https://auth.example.com/token
```

### Configuration File

Create `agents.config.js` or `.agentsrc.json` in your project root:

```json
{
  "baseUrl": "https://example.com",
  "projectName": "my-project",
  "environment": "development",
  "security": {
    "requireAuth": true,
    "cors": {
      "enabled": true,
      "allowedOrigins": ["https://example.com"]
    }
  }
}
```

### Custom Templates

You can override default templates by placing them in `.well-known/templates/`:

```
.well-known/
  templates/
    ai-policy.json
    agents.json
    semantic-sitemap.json
    # ... other templates
```

## Quick Start

```bash
# Interactive setup
npm exec agents init --interactive

# Quick setup with defaults
npm exec agents init
```

## Commands

### Initialize Policy Files

```bash
agents init [options]

Options:
  -d, --dir <path>       Output directory (default: ".well-known")
  -i, --interactive      Enable interactive mode
  -e, --environment      Target environment (development|staging|production)
  --dry-run             Preview changes without writing files
```

### Validate Policy Files

```bash
agents validate [options]

Options:
  -d, --dir <path>      Directory containing policy files
  -f, --fix             Attempt to fix validation issues
```

### Upgrade Policy Files

```bash
agents upgrade [options]

Options:
  -d, --dir <path>      Directory containing policy files
  --dry-run            Preview changes without writing files
```

## Configuration

Create a `.agentsrc.json` file in your project root:

```json
{
  "outputDir": ".well-known",
  "templates": {
    "directory": "templates",
    "customDir": ".agents/templates"
  },
  "validation": {
    "enabled": true,
    "strict": false
  },
  "environments": ["development", "staging", "production"],
  "logging": {
    "level": "info",
    "format": "pretty"
  },
  "security": {
    "checkPolicies": true,
    "allowMerge": true
  }
}
```

## Generated Files

### ai-policy.json
```json
{
  "version": "1.0",
  "environment": "development",
  "policy": {
    "agents": {},
    "semantic_sitemap": "/ai-sitemap.json",
    "negotiation_api": "/api/ai-negotiate",
    "security": {
      "maxTokensPerRequest": 4096,
      "requireAuthentication": true,
      "rateLimiting": {
        "enabled": true,
        "maxRequests": 100,
        "windowMs": 60000
      }
    }
  }
}
```

### agents.json
```json
{
  "version": "1.0",
  "agents": []
}
```

### llms.txt
```
# LLM Access Rules
User-agent: *
Allow: /api/ai-negotiate
Allow: /ai-sitemap.json
Disallow: /private/*
```

## Generated Files

The following files will be generated in your output directory:

1. `ai-policy.json` - Main AI policy configuration
   - Policy rules and settings
   - Supported languages and agent types
   - Contact information
   - Security configurations

2. `agents.json` - List of registered AI agents
   - Agent identifiers and roles
   - Access levels and permissions
   - Version compatibility

3. `llms.txt` - LLM access rules (robots.txt format)
   - Path allow/disallow rules
   - Rate limiting directives
   - API endpoint access

4. `semantic-sitemap.json` - Site structure for AI navigation
   - SEO-optimized metadata
   - Path priorities and access rules
   - Content relationships
   - Role-based access controls

5. `security-rules.json` - Detailed security configurations
   - OAuth2 with PKCE settings
   - JWT configuration
   - IP access controls
   - CORS policies
   - TLS requirements
   - Audit logging

6. `agent-capabilities.json` - Standard and custom agent capabilities
   - Capability definitions and permissions
   - Version requirements
   - Usage examples
   - Dependency relationships

## Template Variables

### Core Variables
- `{{environment}}`: Current environment (development, staging, production)
- `{{projectName}}`: Name of your project
- `{{version}}`: Version of the policy files
- `{{timestamp}}`: Current timestamp

### URL Variables
- `{{baseUrl}}`: Base URL of your site
- `{{authUrl}}`: OAuth2 authorization URL
- `{{tokenUrl}}`: OAuth2 token URL

### Generated Variables
- `{{lastUpdated}}`: File generation timestamp
- `{{generator}}`: Package identifier (@new-ui/agents)

### Environment-Specific Variables
- Development: Relaxed security, detailed logging
- Staging: Production-like settings
- Production: Strict security, optimized settings

