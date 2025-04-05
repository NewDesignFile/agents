import fs from 'fs-extra';
import path from 'path';
import { Logger } from './logger.js';
import { AIPolicy, AgentPolicy, SecurityPolicy } from '../types.js';

const logger = Logger.getInstance();

function validateSecurityPolicy(policy: unknown): SecurityPolicy {
  const securityPolicy = policy as SecurityPolicy;
  if (!securityPolicy || typeof securityPolicy !== 'object') {
    throw new Error('Invalid security policy format');
  }

  if (securityPolicy.maxTokensPerRequest !== undefined && 
      typeof securityPolicy.maxTokensPerRequest !== 'number') {
    throw new Error('maxTokensPerRequest must be a number');
  }

  if (securityPolicy.rateLimiting) {
    if (typeof securityPolicy.rateLimiting.enabled !== 'boolean' ||
        typeof securityPolicy.rateLimiting.maxRequests !== 'number' ||
        typeof securityPolicy.rateLimiting.windowMs !== 'number') {
      throw new Error('Invalid rate limiting configuration');
    }
  }

  return securityPolicy;
}

function validateAgentPolicy(policy: unknown, name?: string, result?: ValidationResult): AgentPolicy {
  const agentPolicy = policy as AgentPolicy;
  if (!agentPolicy || typeof agentPolicy !== 'object') {
    throw new Error('Invalid agent policy format');
  }

  if (typeof agentPolicy.name !== 'string') {
    throw new Error('Agent name must be a string');
  }

  if (!Array.isArray(agentPolicy.capabilities)) {
    throw new Error('Capabilities must be an array');
  }

  if (!Array.isArray(agentPolicy.allowedPaths)) {
    throw new Error('AllowedPaths must be an array');
  }

  if (agentPolicy.rateLimit) {
    if (typeof agentPolicy.rateLimit.requests !== 'number' ||
        typeof agentPolicy.rateLimit.period !== 'string') {
      throw new Error('Invalid rate limit configuration');
    }
  }

  // Additional semantic validation if result is provided
  if (name && result) {
    // Check for description
    if (!agentPolicy.description) {
      result.warnings.push(`Agent '${name}' is missing a description`);
    }

    // Validate paths
    agentPolicy.allowedPaths.forEach((path: string) => {
      if (!path.startsWith('/')) {
        result.warnings.push(`Agent '${name}' has invalid path '${path}' - should start with /`);
      }
    });

    // Check rate limiting
    if (!agentPolicy.rateLimit) {
      result.warnings.push(`Agent '${name}' does not have rate limiting configured`);
    }
  }

  return agentPolicy;
}

function validateAIPolicy(policy: unknown): AIPolicy {
  const aiPolicy = policy as AIPolicy;
  if (!aiPolicy || typeof aiPolicy !== 'object') {
    throw new Error('Invalid AI policy format');
  }

  if (typeof aiPolicy.version !== 'string') {
    throw new Error('Version must be a string');
  }

  if (aiPolicy.environment && 
      !['development', 'staging', 'production'].includes(aiPolicy.environment)) {
    throw new Error('Invalid environment value');
  }

  if (!aiPolicy.policy || typeof aiPolicy.policy !== 'object') {
    throw new Error('Policy section is required');
  }

  if (typeof aiPolicy.policy.agents !== 'object') {
    throw new Error('Agents section must be an object');
  }

  // Validate each agent policy
  Object.entries(aiPolicy.policy.agents).forEach(([name, agent]) => {
    try {
      validateAgentPolicy(agent);
    } catch (error) {
      throw new Error(`Invalid agent policy for ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Validate security policy if present
  if (aiPolicy.policy.security) {
    try {
      validateSecurityPolicy(aiPolicy.policy.security);
    } catch (error) {
      throw new Error(`Invalid security policy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return aiPolicy;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validatePolicyFiles(directory: string, fix = false): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  try {
    // Validate ai-policy.json
    const aiPolicyPath = path.join(directory, 'ai-policy.json');
    if (await fs.pathExists(aiPolicyPath)) {
      const aiPolicyContent = await fs.readJSON(aiPolicyPath);
      try {
        const validatedPolicy = validateAIPolicy(aiPolicyContent);
        
        // Additional semantic validation
        validateSemanticRules(validatedPolicy, result);

        if (fix && result.warnings.length > 0) {
          await fixPolicyIssues(aiPolicyPath, validatedPolicy);
        }
      } catch (error) {
        result.isValid = false;
        if (error instanceof Error) {
          result.errors.push(`AI Policy validation error: ${error.message}`);
        } else {
          result.errors.push('Unknown validation error occurred');
        }
      }
    } else {
      result.errors.push('ai-policy.json not found');
      result.isValid = false;
    }

    // Log validation results
    if (!result.isValid) {
      logger.error('Validation failed:');
      result.errors.forEach(error => logger.error('- ' + error));
    }
    if (result.warnings.length > 0) {
      logger.warn('Validation warnings:');
      result.warnings.forEach(warning => logger.warn('- ' + warning));
    }

    return result;
  } catch (error) {
    logger.error('Validation error:', error as Error);
    result.isValid = false;
    result.errors.push('Unexpected validation error occurred');
    return result;
  }
}

function validateSemanticRules(policy: AIPolicy, result: ValidationResult): void {
  // Check for semantic sitemap when agents are defined
  if (Object.keys(policy.policy.agents).length > 0 && !policy.policy.semantic_sitemap) {
    result.warnings.push('Semantic sitemap is recommended when agents are defined');
  }

  // Check security settings
  if (!policy.policy.security?.requireAuthentication) {
    result.warnings.push('Authentication is recommended for production environments');
  }

  // Validate agent policies
  Object.entries(policy.policy.agents).forEach(([name, agent]) => {
    validateAgentPolicy(agent, name, result);
  });
}



async function fixPolicyIssues(
  filePath: string,
  policy: AIPolicy
): Promise<void> {
  let modified = false;

  // Add semantic sitemap if missing
  if (!policy.policy.semantic_sitemap && Object.keys(policy.policy.agents).length > 0) {
    policy.policy.semantic_sitemap = '/ai-sitemap.json';
    modified = true;
  }

  // Add security settings if missing
  if (!policy.policy.security) {
    policy.policy.security = {
      requireAuthentication: true,
      rateLimiting: {
        enabled: true,
        maxRequests: 100,
        windowMs: 60000,
      },
    };
    modified = true;
  }

  if (modified) {
    await fs.writeJSON(filePath, policy, { spaces: 2 });
    logger.success('Fixed policy issues automatically');
  }
}
