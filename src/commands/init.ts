import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import { Logger } from '../utils/logger.js';
import { ConfigManager } from '../utils/config.js';
import { TemplateEngine } from '../utils/template.js';
import { Environment, TemplateVariables } from '../types.js';
import { DEFAULT_TEMPLATES } from '../types.js';

const logger = Logger.getInstance();
const config = ConfigManager.getInstance();
const templateEngine = TemplateEngine.getInstance();

interface InitOptions {
  dir?: string;
  interactive?: boolean;
  environment?: Environment;
  dryRun?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  try {
    await config.loadConfig();

    const answers = options.interactive
      ? await promptForOptions(options)
      : getDefaultOptions(options);

    const spinner = ora('Generating AI agent policy files...').start();

    try {
      const variables: TemplateVariables = {
        environment: answers.environment,
        projectName: path.basename(process.cwd()),
        version: '1.0',
        baseUrl: process.env.AGENTS_BASE_URL || 'http://localhost:3000',
        timestamp: new Date().toISOString(),
        authUrl:
          process.env.AGENTS_AUTH_URL ||
          `${process.env.AGENTS_BASE_URL}/auth` ||
          'http://localhost:3000/auth',
        tokenUrl:
          process.env.AGENTS_TOKEN_URL ||
          `${process.env.AGENTS_BASE_URL}/token` ||
          'http://localhost:3000/token',
      };

      if (options.dryRun) {
        logger.info('Dry run - would create the following files:');
        await previewChanges(answers.outputDir, variables);
        spinner.stop();
        return;
      }

      await generateFiles(answers.outputDir, variables);
      spinner.succeed('AI agent policy files generated successfully!');

      if (answers.createConfig) {
        await config.saveConfig();
      }
    } catch (error) {
      spinner.fail('Error generating files');
      throw error;
    }
  } catch (error) {
    logger.error('Initialization failed:', error as Error);
    process.exit(1);
  }
}

interface PromptAnswers {
  outputDir: string;
  environment: Environment;
  createConfig: boolean;
}

async function promptForOptions(options: InitOptions): Promise<PromptAnswers> {
  // Use individual prompts instead of an array of questions
  const outputDir = await inquirer.prompt({
    type: 'input',
    name: 'outputDir',
    message: 'Where should the policy files be generated?',
    default: options.dir || '.well-known',
  });

  const environmentAnswer = await inquirer.prompt({
    type: 'list',
    name: 'environment',
    message: 'Which environment is this for?',
    choices: ['development', 'staging', 'production'] as Environment[],
    default: options.environment || 'development',
  });

  const configAnswer = await inquirer.prompt({
    type: 'confirm',
    name: 'createConfig',
    message: 'Would you like to create a configuration file (.agentsrc.json)?',
    default: true,
  });

  // Combine the answers
  return {
    outputDir: outputDir.outputDir,
    environment: environmentAnswer.environment as Environment,
    createConfig: configAnswer.createConfig,
  };
}

function getDefaultOptions(options: InitOptions): PromptAnswers {
  return {
    outputDir: options.dir || '.well-known',
    environment: (options.environment || 'development') as Environment,
    createConfig: false,
  };
}

async function previewChanges(outputDir: string, variables: TemplateVariables): Promise<void> {
  for (const [filename, template] of Object.entries(DEFAULT_TEMPLATES)) {
    const content = templateEngine.render(template, variables);
    logger.info(`\n${path.join(outputDir, filename)}:`);
    console.log(content);
  }
}

async function generateFiles(outputDir: string, variables: TemplateVariables): Promise<void> {
  await fs.ensureDir(outputDir);

  for (const [filename, template] of Object.entries(DEFAULT_TEMPLATES)) {
    const content = templateEngine.render(template, variables);
    const filepath = path.join(outputDir, filename);

    const missing = templateEngine.validateVariables(template, variables);
    if (missing.length > 0) {
      throw new Error(`Missing required variables for ${filename}: ${missing.join(', ')}`);
    }

    if (await fs.pathExists(filepath)) {
      logger.warn(`File already exists: ${filepath}`);
      continue;
    }

    await fs.writeFile(filepath, content);
    logger.success(`Created ${filepath}`);
  }
}
