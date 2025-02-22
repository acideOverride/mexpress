import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

describe('GitHub Actions CI/CD Configuration', () => {
  const workflowPath = path.join(process.cwd(), '.github/workflows/ci-cd.yml');
  
  let workflowConfig: any;

  beforeAll(() => {
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    workflowConfig = yaml.load(workflowContent);
  });

  describe('Workflow Structure', () => {
    it('should have required workflow properties', () => {
      expect(workflowConfig).toHaveProperty('name');
      expect(workflowConfig).toHaveProperty('on');
      expect(workflowConfig).toHaveProperty('jobs');
    });

    it('should trigger on main branch events', () => {
      expect(workflowConfig.on).toHaveProperty('push');
      expect(workflowConfig.on.push.branches).toContain('main');
    });
  });

  describe('Build Job', () => {
    it('should have build job configuration', () => {
      expect(workflowConfig.jobs).toHaveProperty('build');
      const buildJob = workflowConfig.jobs.build;
      
      expect(buildJob).toHaveProperty('runs-on');
      expect(buildJob).toHaveProperty('steps');
    });

    it('should include required build steps', () => {
      const buildSteps = workflowConfig.jobs.build.steps;
      const stepActions = buildSteps.map((step: any) => step.uses || step.run);
      
      expect(stepActions).toContain('actions/checkout@v3');
      expect(stepActions).toContain('actions/setup-node@v3');
      expect(stepActions.some((action: string) => action?.includes('npm install'))).toBeTruthy();
      expect(stepActions.some((action: string) => action?.includes('npm run build'))).toBeTruthy();
      expect(stepActions.some((action: string) => action?.includes('npm test'))).toBeTruthy();
    });
  });

  describe('Test Coverage', () => {
    it('should enforce minimum test coverage', () => {
      const buildSteps = workflowConfig.jobs.build.steps;
      const coverageStep = buildSteps.find((step: any) => 
        step.run?.includes('npm run test:coverage')
      );
      
      expect(coverageStep).toBeDefined();
      expect(coverageStep.run).toContain('--coverage-threshold=90');
    });
  });

  describe('Deployment Jobs', () => {
    it('should have staging deployment configuration', () => {
      expect(workflowConfig.jobs).toHaveProperty('deploy-staging');
      const stagingJob = workflowConfig.jobs['deploy-staging'];
      
      expect(stagingJob).toHaveProperty('needs', ['build']);
      expect(stagingJob).toHaveProperty('environment', 'staging');
    });

    it('should have production deployment configuration', () => {
      expect(workflowConfig.jobs).toHaveProperty('deploy-production');
      const prodJob = workflowConfig.jobs['deploy-production'];
      
      expect(prodJob).toHaveProperty('needs', ['deploy-staging']);
      expect(prodJob).toHaveProperty('environment', 'production');
    });
  });

  describe('Environment Validation', () => {
    it('should include environment validation steps', () => {
      const deployJobs = ['deploy-staging', 'deploy-production'];
      
      deployJobs.forEach(jobName => {
        const job = workflowConfig.jobs[jobName];
        const validationStep = job.steps.find((step: any) => 
          step.name?.toLowerCase().includes('validate')
        );
        
        expect(validationStep).toBeDefined();
        expect(validationStep.run).toContain('npm run validate:environment');
      });
    });
  });
});