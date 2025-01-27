"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generators_1 = require("../src/generators");
const types_1 = require("../src/types");
const TEST_DIR = path_1.default.join(__dirname, 'test-output');
describe('File Generator', () => {
    beforeEach(() => {
        // Clean test directory
        if (fs_1.default.existsSync(TEST_DIR)) {
            fs_1.default.rmdirSync(TEST_DIR, { recursive: true });
        }
        fs_1.default.mkdirSync(TEST_DIR);
    });
    afterEach(() => {
        fs_1.default.rmdirSync(TEST_DIR, { recursive: true });
    });
    test('generates ai-policy.json', () => {
        (0, generators_1.generateFiles)({
            outputDir: TEST_DIR,
            files: ['ai-policy.json']
        });
        const content = fs_1.default.readFileSync(path_1.default.join(TEST_DIR, 'ai-policy.json'), 'utf-8');
        expect(content).toEqual(types_1.TEMPLATES['ai-policy.json']);
    });
    test('generates agents.json', () => {
        (0, generators_1.generateFiles)({
            outputDir: TEST_DIR,
            files: ['agents.json']
        });
        const content = fs_1.default.readFileSync(path_1.default.join(TEST_DIR, 'agents.json'), 'utf-8');
        expect(content).toEqual(types_1.TEMPLATES['agents.json']);
    });
    test('throws error for unsupported files', () => {
        expect(() => {
            (0, generators_1.generateFiles)({
                outputDir: TEST_DIR,
                files: ['unknown.txt']
            });
        }).toThrow('Unsupported file type: unknown.txt');
    });
});
