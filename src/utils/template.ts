import { TemplateVariables } from '../types.js';

export class TemplateEngine {
  private static instance: TemplateEngine;

  private constructor() {}

  static getInstance(): TemplateEngine {
    if (!TemplateEngine.instance) {
      TemplateEngine.instance = new TemplateEngine();
    }
    return TemplateEngine.instance;
  }

  render(template: string, variables: TemplateVariables): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  validateTemplate(template: string): string[] {
    const variables: string[] = [];
    const regex = /\{\{(\w+)\}\}/g;
    let match;

    while ((match = regex.exec(template)) !== null) {
      variables.push(match[1]);
    }

    return variables;
  }

  validateVariables(template: string, variables: TemplateVariables): string[] {
    const required = this.validateTemplate(template);
    const missing: string[] = [];

    for (const variable of required) {
      if (!variables[variable]) {
        missing.push(variable);
      }
    }

    return missing;
  }
}
