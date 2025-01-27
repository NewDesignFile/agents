"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATES = void 0;
exports.generateFiles = generateFiles;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
exports.TEMPLATES = {
    'ai-policy.json': JSON.stringify({
        version: "1.0",
        policy: {
            agents: {},
            semantic_sitemap: "/ai-sitemap.json",
            negotiation_api: "/api/ai-negotiate"
        }
    }, null, 2),
    'agents.json': JSON.stringify({
        version: "1.0",
        agents: []
    }, null, 2),
    'llms.txt': `# LLM Access Rules
User-agent: *
Allow: /`
};
function generateFiles(options) {
    options.files.forEach(file => {
        if (!(file in exports.TEMPLATES)) {
            throw new Error(`Unsupported file type: ${file}`);
        }
        const outputPath = path_1.default.join(options.outputDir, file);
        fs_extra_1.default.ensureDirSync(path_1.default.dirname(outputPath));
        fs_extra_1.default.writeFileSync(outputPath, exports.TEMPLATES[file]);
    });
}
