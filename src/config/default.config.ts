import { AgentsConfig } from '../types.js';

export const defaultConfig: AgentsConfig = {
  outputDir: '.well-known',
  templates: {
    directory: 'templates',
    customDir: '.agents/templates',
  },
  validation: {
    enabled: true,
    strict: false,
  },
  environments: ['development', 'production'],
  logging: {
    level: 'info',
    format: 'pretty',
  },
  security: {
    checkPolicies: true,
    allowMerge: true,
  }
};
