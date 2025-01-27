"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFiles = validateFiles;
const fs_extra_1 = require("fs-extra");
const ajv_1 = __importDefault(require("ajv"));
const path_1 = __importDefault(require("path"));
const ajv = new ajv_1.default();
function validateFiles(outputDir = '.well-known') {
    const validateAIPolicy = ajv.compile(require('../schemas/ai-policy.schema.json'));
    const policy = (0, fs_extra_1.readJSONSync)(path_1.default.join(outputDir, 'ai-policy.json'));
    if (!validateAIPolicy(policy)) {
        throw new Error(`Invalid ai-policy.json: ${ajv.errorsText(validateAIPolicy.errors)}`);
    }
}
