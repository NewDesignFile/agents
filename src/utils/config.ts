import fs from 'fs-extra';
import path from 'path';
import { cosmiconfig } from 'cosmiconfig';
import { defaultConfig } from '../config/default.config.js';
import { AgentsConfig } from '../types.js';
import { Logger } from './logger.js';

const logger = Logger.getInstance();

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AgentsConfig;
  private configPath?: string;

  private constructor() {
    this.config = { ...defaultConfig };
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  async loadConfig(cwd: string = process.cwd()): Promise<AgentsConfig> {
    try {
      const explorer = cosmiconfig('agents');
      const result = await explorer.search(cwd);

      if (result && !result.isEmpty) {
        this.configPath = result.filepath;
        this.config = this.mergeConfig(defaultConfig, result.config);
        logger.debug('Loaded config from:', this.configPath);
      } else {
        logger.debug('No config file found, using default configuration');
      }

      return this.config;
    } catch (error) {
      logger.error('Error loading config:', error as Error);
      return this.config;
    }
  }

  getConfig(): AgentsConfig {
    return this.config;
  }

  private mergeConfig(
    defaultConfig: AgentsConfig,
    userConfig: Partial<AgentsConfig>
  ): AgentsConfig {
    return {
      ...defaultConfig,
      ...userConfig,
      templates: {
        ...defaultConfig.templates,
        ...userConfig.templates,
      },
      validation: {
        ...defaultConfig.validation,
        ...userConfig.validation,
      },
      logging: {
        ...defaultConfig.logging,
        ...userConfig.logging,
      },
      security: {
        ...defaultConfig.security,
        ...userConfig.security,
      },
    };
  }

  async saveConfig(): Promise<void> {
    if (!this.configPath) {
      this.configPath = path.join(process.cwd(), '.agentsrc.json');
    }

    try {
      await fs.writeJSON(this.configPath, this.config, { spaces: 2 });
      logger.success('Configuration saved to ' + this.configPath);
    } catch (error) {
      logger.error('Error saving config:', error as Error);
      throw error;
    }
  }
}
