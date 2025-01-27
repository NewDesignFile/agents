import { readJSONSync } from 'fs-extra';
import { ValidateFunction } from 'ajv';
import Ajv from 'ajv';
import path from 'path';
import { AIPolicy } from './types';

const ajv = new Ajv();

export function validateFiles(outputDir = '.well-known') {
  const validateAIPolicy = ajv.compile(
    require('../dist/schemas/ai-policy.schema.json')
  );
  
  const policy = readJSONSync(
    path.join(outputDir, 'ai-policy.json')
  ) as AIPolicy;
  
  if (!validateAIPolicy(policy)) {
    throw new Error(`Invalid ai-policy.json: ${ajv.errorsText(validateAIPolicy.errors)}`);
  }
}