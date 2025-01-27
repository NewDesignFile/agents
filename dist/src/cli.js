#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const generators_1 = require("./generators");
const utils_1 = require("./utils");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name('agents')
    .description(chalk_1.default.blue('Generate AI agent policy files by @new-ui'))
    .version('0.1.0');
program
    .command('init')
    .description('Initialize policy files')
    .option('-d, --dir <path>', 'Output directory', '.well-known')
    .option('-f, --files <items>', 'Comma-separated files to generate', 'ai-policy.json,agents.json,llms.txt')
    .option('-v, --validate', 'Validate generated files', true)
    .action((options) => {
    try {
        (0, generators_1.generateFiles)({
            outputDir: options.dir,
            files: options.files.split(',')
        });
        if (options.validate) {
            (0, utils_1.validateFiles)(options.dir);
            console.log(chalk_1.default.green('✓ Validation passed!'));
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(chalk_1.default.red('✗ Error:'), message);
        process.exit(1);
    }
});
program.parse(process.argv);
