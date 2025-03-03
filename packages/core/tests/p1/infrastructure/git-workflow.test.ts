import { GitWorkflow } from '../../../src/lib/git-workflow';
import { 
  WorkflowConfigOptions, 
  CommitMessage, 
  BranchOperationResult,
  CommitValidationResult,
  ReviewAssignment,
  ReviewResult
} from '../../../src/types/git-workflow-config';

describe('GitWorkflow', () => {
  describe('Configuration Setup', () => {
    let workflow: GitWorkflow;
    
    beforeEach(() => {
      workflow = new GitWorkflow({
        name: 'test-workflow',
        namespace: 'default',
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
            allowDeletion: false
          }
        },
        reviews: {
          requiredReviewers: 2,
          dismissStaleReviews: true,
          requireLatestCode: true,
          requireCodeOwners: true,
          allowSelfReview: false,
          requireTemplates: true
        }
      });
    });

    test('should create valid workflow configuration', () => {
      const config = workflow.getWorkflowConfig();
      expect(config.apiVersion).toBe('v1');
      expect(config.kind).toBe('WorkflowConfiguration');
      expect(config.metadata.name).toBe('test-workflow');
      expect(config.spec.branches.main.protected).toBe(true);
      expect(config.spec.reviews.requiredReviewers).toBe(2);
    });

    test('should throw error for invalid configuration', () => {
      expect(() => new GitWorkflow({
        name: '',
        namespace: '',
        branches: {
          main: {
            name: '',
            protected: false,
            requirePullRequest: false,
            requiredReviewers: -1,
            enforceAdmins: false,
            requireStatusChecks: false,
            requireLinearHistory: false,
            allowForcePush: true,
            allowDeletion: true
          }
        }
      })).toThrow('Invalid workflow configuration');
    });
  });

  describe('Branch Management', () => {
    let workflow: GitWorkflow;
    
    beforeEach(() => {
      workflow = new GitWorkflow({
        name: 'test-workflow',
        namespace: 'default',
        branches: {
          feature: {
            prefix: 'feature/',
            template: 'feature/${name}',
            autoDelete: true
          }
        }
      });
    });

    test('should create feature branch with correct naming', async () => {
      const result = await workflow.createBranch('feature', 'add-auth');
      expect(result.success).toBe(true);
      expect(result.branch).toBe('feature/add-auth');
      expect(result.operation).toBe('create');
    });

    test('should validate branch name format', async () => {
      const result = await workflow.createBranch('feature', 'invalid name!');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid branch name format');
    });
  });

  describe('Commit Message Validation', () => {
    let workflow: GitWorkflow;
    
    beforeEach(() => {
      workflow = new GitWorkflow({
        name: 'test-workflow',
        namespace: 'default',
        hooks: {
          commitMsg: {
            conventional: true,
            maxSubjectLength: 72,
            requireScope: true,
            requireBody: false,
            requireFooter: false
          }
        }
      });
    });

    test('should validate conventional commit message', () => {
      const message: CommitMessage = {
        type: 'feat',
        scope: 'auth',
        subject: 'add OAuth2 authentication',
        body: 'Implements OAuth2 authentication flow\nwith support for multiple providers'
      };

      const result = workflow.validateCommitMessage(message);
      expect(result.valid).toBe(true);
      expect(result.message).toEqual(message);
    });

    test('should reject invalid commit message', () => {
      const message: CommitMessage = {
        type: 'feat',
        subject: 'this is a very long subject that exceeds the maximum length limit and should be rejected by the validator',
        body: ''
      };

      const result = workflow.validateCommitMessage(message);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Subject exceeds maximum length');
      expect(result.errors).toContain('Scope is required');
    });
  });

  describe('Review Process', () => {
    let workflow: GitWorkflow;
    
    beforeEach(() => {
      workflow = new GitWorkflow({
        name: 'test-workflow',
        namespace: 'default',
        reviews: {
          requiredReviewers: 2,
          dismissStaleReviews: true,
          requireLatestCode: true,
          requireCodeOwners: true,
          allowSelfReview: false,
          requireTemplates: true
        }
      });
    });

    test('should assign reviewers automatically', async () => {
      const assignment = await workflow.assignReviewers('PR-123', ['team/backend']);
      expect(assignment.pullRequest).toBe('PR-123');
      expect(assignment.reviewers).toHaveLength(2);
      expect(assignment.requiredCount).toBe(2);
    });

    test('should validate review requirements', async () => {
      const review = {
        pullRequest: 'PR-123',
        reviewer: 'john.doe',
        status: 'approved' as const,
        comments: [],
        timestamp: new Date()
      };

      const result = await workflow.processReview(review);
      expect(result.pullRequest).toBe('PR-123');
      expect(result.status).toBe('approved');
    });
  });
});