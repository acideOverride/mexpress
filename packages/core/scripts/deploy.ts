import path from 'path';
import { EnvironmentValidator } from './validate-environment';

interface DeploymentConfig {
  steps: {
    name: string;
    command: string;
  }[];
  rollbackSteps: {
    name: string;
    command: string;
  }[];
}

class Deployer {
  private env: string;
  private deploymentState: Map<string, boolean> = new Map();

  constructor(env: string) {
    this.env = env;
  }

  private async validateEnvironment(): Promise<void> {
    const validator = new EnvironmentValidator(this.env);
    const isValid = await validator.validate();
    
    if (!isValid) {
      throw new Error(`Environment validation failed for ${this.env}`);
    }
  }

  private async executeStep(step: { name: string; command: string }): Promise<void> {
    console.log(`Executing step: ${step.name}`);
    try {
      // Here you would implement the actual command execution
      // For example, using child_process.exec
      console.log(`Running command: ${step.command}`);
      this.deploymentState.set(step.name, true);
    } catch (error) {
      console.error(`Failed to execute step ${step.name}:`, error);
      this.deploymentState.set(step.name, false);
      throw error;
    }
  }

  private async rollback(config: DeploymentConfig): Promise<void> {
    console.log('\nInitiating rollback...');
    
    for (const step of config.rollbackSteps) {
      if (this.deploymentState.get(step.name)) {
        try {
          console.log(`Rolling back step: ${step.name}`);
          // Implement rollback command execution here
          console.log(`Running rollback command: ${step.command}`);
        } catch (error) {
          console.error(`Failed to rollback step ${step.name}:`, error);
          // Continue with other rollback steps even if one fails
        }
      }
    }
  }

  public async deploy(): Promise<void> {
    console.log(`\nStarting deployment to ${this.env} environment\n`);
    
    try {
      // Validate environment before deployment
      await this.validateEnvironment();

      // Load deployment configuration
      const configPath = path.join(process.cwd(), 'config', `deployment-${this.env}.json`);
      const config: DeploymentConfig = require(configPath);

      // Execute deployment steps
      for (const step of config.steps) {
        await this.executeStep(step);
      }

      console.log(`\nDeployment to ${this.env} completed successfully\n`);
    } catch (error) {
      console.error(`\nDeployment to ${this.env} failed:`, error);
      
      // Load config for rollback
      const configPath = path.join(process.cwd(), 'config', `deployment-${this.env}.json`);
      const config: DeploymentConfig = require(configPath);
      
      // Attempt rollback
      await this.rollback(config);
      
      throw error;
    }
  }
}

async function main() {
  try {
    const args = process.argv.slice(2);
    const envArg = args.find(arg => arg.startsWith('--env='));
    
    if (!envArg) {
      throw new Error('Environment not specified. Use --env=<environment>');
    }

    const env = envArg.split('=')[1];
    if (!['staging', 'production'].includes(env)) {
      throw new Error('Invalid environment. Use staging or production');
    }

    const deployer = new Deployer(env);
    await deployer.deploy();
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { Deployer };