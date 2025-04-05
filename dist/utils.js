import { readJSONSync } from 'fs-extra';
import Ajv from 'ajv';
import path from 'path';
import { readFileSync } from 'fs';
const schema = JSON.parse(readFileSync(new URL('./schemas/ai-policy.schema.json', import.meta.url), 'utf-8'));
const ajv = new Ajv.default();
export async function validateFiles(outputDir = '.well-known') {
    const validateAIPolicy = ajv.compile(schema);
    const policy = readJSONSync(path.join(outputDir, 'ai-policy.json'));
    if (!validateAIPolicy(policy)) {
        throw new Error(`Invalid ai-policy.json: ${ajv.errorsText(validateAIPolicy.errors)}`);
    }
}
//# sourceMappingURL=utils.js.map