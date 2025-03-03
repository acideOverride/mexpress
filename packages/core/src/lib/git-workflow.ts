import {
  WorkflowConfig,
  WorkflowConfigOptions,
  BranchOperationResult,
  CommitMessage,
  CommitValidationResult,
  ReviewAssignment,
  ReviewResult,
  WorkflowValidationResult
} from '../types/git-workflow-config';

/**
 * GitWorkflow implementation for test compatibility
 * This class mirrors the GitWorkflow from the utils package
 */
export class GitWorkflow {
  private config: WorkflowConfig;

  constructor(options: WorkflowConfigOptions) {
    this.validateConfig(options);
    this.config = {
      apiVersion: 'v1',
      kind: 'WorkflowConfiguration',
      metadata: {
        name: options.name,
        namespace: options.namespace,
        labels: options.labels
      },
      spec: {
        branches: {
          main: {
            name: 'main',
            protected: true,
            requirePullRequest: true,
            requiredReviewers: 2,
            enforceAdmins: true,
            requireStatusChecks: true,
            requireLinearHistory: true,
            allowForcePush: false,
            allowDeletion: false,
            ...options.branches?.main
          },
          develop: {
            name: 'develop',
            protected: true,
            requirePullRequest: true,
            requiredReviewers: 1,
            enforceAdmins: true,
            requireStatusChecks: true,
            requireLinearHistory: true,
            allowForcePush: false,
            allowDeletion: false,
            ...options.branches?.develop
          },
          feature: {
            prefix: 'feature/',
            template: 'feature/${name}',
            autoDelete: true,
            ...options.branches?.feature
          },
          release: {
            prefix: 'release/',
            template: 'release/v${version}',
            tagPrefix: 'v',
            ...options.branches?.release
          },
          hotfix: {
            prefix: 'hotfix/',
            template: 'hotfix/${name}',
            tagPrefix: 'hotfix-',
            ...options.branches?.hotfix
          }
        },
        reviews: {
          requiredReviewers: 2,
          dismissStaleReviews: true,
          requireLatestCode: true,
          requireCodeOwners: true,
          allowSelfReview: false,
          requireTemplates: true,
          ...options.reviews
        },
        hooks: {
          preCommit: {
            linting: true,
            formatting: true,
            tests: true,
            coverage: true,
            ...options.hooks?.preCommit
          },
          commitMsg: {
            conventional: true,
            maxSubjectLength: 72,
            requireScope: true,
            requireBody: false,
            requireFooter: false,
            ...options.hooks?.commitMsg
          },
          preRebase: {
            protectedBranches: ['main', 'develop'],
            allowMerge: true,
            ...options.hooks?.preRebase
          }
        },
        coverage: {
          threshold: 90,
          excludePaths: [],
          requireIncrease: true,
          ...options.coverage
        },
        staticAnalysis: {
          enabled: true,
          tools: ['eslint', 'prettier'],
          failOnIssues: true,
          excludePaths: [],
          ...options.staticAnalysis
        }
      }
    };
  }

  private validateConfig(options: WorkflowConfigOptions): void {
    if (!options.name || !options.namespace) {
      throw new Error('Invalid workflow configuration');
    }

    if (options.branches?.main) {
      const { requiredReviewers } = options.branches.main;
      if (requiredReviewers !== undefined && requiredReviewers < 0) {
        throw new Error('Invalid workflow configuration');
      }
    }
  }

  public getWorkflowConfig(): WorkflowConfig {
    return this.config;
  }

  public async createBranch(type: 'feature' | 'release' | 'hotfix', name: string): Promise<BranchOperationResult> {
    const branchNameRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (!branchNameRegex.test(name)) {
      return {
        success: false,
        branch: '',
        operation: 'create',
        error: 'Invalid branch name format'
      };
    }

    const branchConfig = this.config.spec.branches[type];
    const branchName = branchConfig.template.replace('${name}', name);

    return {
      success: true,
      branch: branchName,
      operation: 'create'
    };
  }

  public validateCommitMessage(message: CommitMessage): CommitValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { commitMsg } = this.config.spec.hooks;

    // Validate subject length
    if (message.subject.length > commitMsg.maxSubjectLength) {
      errors.push('Subject exceeds maximum length');
    }

    // Validate scope if required
    if (commitMsg.requireScope && !message.scope) {
      errors.push('Scope is required');
    }

    // Validate body if required
    if (commitMsg.requireBody && !message.body) {
      errors.push('Body is required');
    }

    // Validate footer if required
    if (commitMsg.requireFooter && !message.footer) {
      errors.push('Footer is required');
    }

    return {
      valid: errors.length === 0,
      message: errors.length === 0 ? message : undefined,
      errors,
      warnings
    };
  }

  public async assignReviewers(pullRequest: string, teams: string[]): Promise<ReviewAssignment> {
    // In a real implementation, this would query team members and use an algorithm
    // to select reviewers based on expertise, workload, etc.
    return {
      pullRequest,
      reviewers: ['reviewer1', 'reviewer2'],
      requiredCount: this.config.spec.reviews.requiredReviewers,
      priority: 'medium'
    };
  }

  public async processReview(review: ReviewResult): Promise<ReviewResult> {
    // In a real implementation, this would update PR status, notify relevant parties,
    // and handle review state management
    return review;
  }
}