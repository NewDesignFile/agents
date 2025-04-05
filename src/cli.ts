#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { Logger } from './utils/logger.js';
import { initCommand } from './commands/init.js';
import { Environment } from './types.js';

const logger = Logger.getInstance();

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection:', error as Error);
  process.exit(1);
});

const program = new Command();

program
  .name('agents')
  .description(chalk.blue('Generate and manage AI agent policy files by @new-ui'))
  .version('1.0.0')
  .option('-v, --verbose', 'Enable verbose logging')
  .hook('preAction', (thisCommand) => {
    if (thisCommand.opts().verbose) {
      logger.setLevel('debug');
    }
  });

program
  .command('init')
  .description('Initialize AI agent policy files')
  .option('-d, --dir <path>', 'Output directory', '.well-known')
  .option('-i, --interactive', 'Enable interactive mode', false)
  .option(
    '-e, --environment <env>',
    'Target environment (development|staging|production)',
    'development'
  )
  .option('--dry-run', 'Preview changes without writing files', false)
  .action(async (options) => {
    const env = options.environment as Environment;
    if (!['development', 'staging', 'production'].includes(env)) {
      logger.error('Invalid environment. Must be one of: development, staging, production');
      process.exit(1);
    }

    await initCommand({
      dir: options.dir,
      interactive: options.interactive,
      environment: env,
      dryRun: options.dryRun,
    });
  });

program
  .command('validate')
  .description('Validate existing policy files')
  .option('-d, --dir <path>', 'Directory containing policy files', '.well-known')
  .option('-f, --fix', 'Attempt to fix validation issues', false)
  .action(async () => {
    // TODO: Implement validation command
    logger.info('Validation command not yet implemented');
  });

program
  .command('upgrade')
  .description('Upgrade policy files to the latest version')
  .option('-d, --dir <path>', 'Directory containing policy files', '.well-known')
  .option('--dry-run', 'Preview changes without writing files', false)
  .action(async () => {
    // TODO: Implement upgrade command
    logger.info('Upgrade command not yet implemented');
  });

program.parse(process.argv);
