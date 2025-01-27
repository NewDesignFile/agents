import { readJSONSync } from 'fs-extra';
import Ajv from 'ajv';
import path from 'path';
import schema from './schemas/ai-policy.schema.json' assert { type: 'json' }; // Direct import
const ajv = new Ajv();
export async function validateFiles(outputDir = '.well-known') {
    const validateAIPolicy = ajv.compile(schema);
    const policy = readJSONSync(path.join(outputDir, 'ai-policy.json'));
    if (!validateAIPolicy(policy)) {
        throw new Error(`Invalid ai-policy.json: ${ajv.errorsText(validateAIPolicy.errors)}`);
    }
}
