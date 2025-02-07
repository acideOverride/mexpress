export type CommitType = 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'test' | 'chore';

export interface CommitMessage {
  type: CommitType;
  scope?: string;
  subject: string;
  body?: string;
  footer?: string;
}

export interface BranchConfig {
  name: string;
  protected: boolean;
  requirePullRequest: boolean;
  requiredReviewers: number;
  enforceAdmins: boolean;
  requireStatusChecks: boolean;
  requireLinearHistory: boolean;
  allowForcePush: boolean;
  allowDeletion: boolean;
}

export interface BranchStrategy {
  main: BranchConfig;
  develop: BranchConfig;
  feature: {
    prefix: string;
    template: string;
    autoDelete: boolean;
  };
  release: {
    prefix: string;
    template: string;
    tagPrefix: string;
  };
  hotfix: {
    prefix: string;
    template: string;
    tagPrefix: string;
  };
}

export interface ReviewConfig {
  requiredReviewers: number;
  dismissStaleReviews: boolean;
  requireLatestCode: boolean;
  requireCodeOwners: boolean;
  allowSelfReview: boolean;
  requireTemplates: boolean;
}

export interface CommitHookConfig {
  preCommit: {
    linting: boolean;
    formatting: boolean;
    tests: boolean;
    coverage: boolean;
  };
  commitMsg: {
    conventional: boolean;
    maxSubjectLength: number;
    requireScope: boolean;
    requireBody: boolean;
    requireFooter: boolean;
  };
  preRebase: {
    protectedBranches: string[];
    allowMerge: boolean;
  };
}

export interface WorkflowConfig {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    labels?: Record<string, string>;
  };
  spec: {
    branches: BranchStrategy;
    reviews: ReviewConfig;
    hooks: CommitHookConfig;
    coverage: {
      threshold: number;
      excludePaths: string[];
      requireIncrease: boolean;
    };
    staticAnalysis: {
      enabled: boolean;
      tools: string[];
      failOnIssues: boolean;
      excludePaths: string[];
    };
  };
}

export interface WorkflowConfigOptions {
  name: string;
  namespace: string;
  branches?: Partial<BranchStrategy>;
  reviews?: Partial<ReviewConfig>;
  hooks?: Partial<CommitHookConfig>;
  coverage?: {
    threshold?: number;
    excludePaths?: string[];
    requireIncrease?: boolean;
  };
  staticAnalysis?: {
    enabled?: boolean;
    tools?: string[];
    failOnIssues?: boolean;
    excludePaths?: string[];
  };
  labels?: Record<string, string>;
}

export interface WorkflowValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BranchOperationResult {
  success: boolean;
  branch: string;
  operation: 'create' | 'delete' | 'protect' | 'merge';
  error?: string;
  warnings?: string[];
}

export interface CommitValidationResult {
  valid: boolean;
  message?: CommitMessage;
  errors: string[];
  warnings: string[];
}

export interface ReviewAssignment {
  pullRequest: string;
  reviewers: string[];
  requiredCount: number;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface ReviewResult {
  pullRequest: string;
  reviewer: string;
  status: 'approved' | 'rejected' | 'commented';
  comments: Array<{
    path?: string;
    line?: number;
    comment: string;
  }>;
  timestamp: Date;
}