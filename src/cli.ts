#!/usr/bin/env node
import { Command } from 'commander';
import { generateFiles } from './generators.js';
import { validateFiles } from './utils.js';
import chalk from 'chalk';

const program = new Command();

program
  .name('agents')
  .description(chalk.blue('Generate AI agent policy files by @new-ui'))
  .version('0.4.0'); // Updated version

  program
  .command('init')
  .description('Initialize policy files')
  .option('-d, --dir <path>', 'Output directory', '.well-known')
  .option('-f, --files <items>', 'Comma-separated files to generate', 'ai-policy.json,agents.json,llms.txt')
  .option('-v, --validate', 'Validate generated files', true)
  .action(async (options) => {
    try {
      generateFiles({
        outputDir: options.dir,
        files: options.files.split(',')
      });
      if (options.validate) {
        await validateFiles(options.dir);
        console.log(chalk.green('✓ Validation passed!'));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red('✗ Error:'), message);
      process.exit(1);
    }
  });

program.parse(process.argv);