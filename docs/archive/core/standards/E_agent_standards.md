# Agent Standards for Monorepo

## Table of Contents
1. [Agent Roles](#1-agent-roles)
   - [Role Definitions](#11-role-definitions)
   - [Responsibilities](#12-responsibilities)
   - [Boundaries](#13-boundaries)
2. [Communication Standards](#2-communication-standards)
   - [Message Format](#21-message-format)
   - [State Transfer](#22-state-transfer)
   - [Error Handling](#23-error-handling)
3. [Workflow Patterns](#3-workflow-patterns)
   - [Sequential Flow](#31-sequential-flow)
   - [Parallel Flow](#32-parallel-flow)
   - [Error Recovery](#33-error-recovery)
4. [State Management](#4-state-management)
   - [Context Management](#41-context-management)
   - [Token Management](#42-token-management)
   - [Recovery Procedures](#43-recovery-procedures)

## 1. Agent Roles

### 1.1 Role Definitions
```typescript
// Agent role configuration
interface AgentRole {
  name: string;
  description: string;
  capabilities: string[];
  allowedOperations: string[];
  contextThresholds: {
    warning: number;
    critical: number;
  };
}

const agentRoles: Record<string, AgentRole> = {
  ARCHITECT: {
    name: 'architect',
    description: 'System architecture and design decisions',
    capabilities: ['design', 'review', 'validate'],
    allowedOperations: ['read', 'validate'],
    contextThresholds: {
      warning: 70,
      critical: 85
    }
  },
  CODE: {
    name: 'code',
    description: 'Implementation and code management',
    capabilities: ['implement', 'test', 'document'],
    allowedOperations: ['read', 'write', 'test'],
    contextThresholds: {
      warning: 70,
      critical: 85
    }
  },
  QA: {
    name: 'qa',
    description: 'Quality assurance and testing',
    capabilities: ['test', 'validate', 'report'],
    allowedOperations: ['read', 'test'],
    contextThresholds: {
      warning: 70,
      critical: 85
    }
  }
};
```

### 1.2 Responsibilities
```typescript
// Agent responsibility definitions
interface AgentResponsibility {
  primary: string[];
  secondary: string[];
  validations: string[];
  outputs: string[];
}

const agentResponsibilities: Record<string, AgentResponsibility> = {
  ARCHITECT: {
    primary: [
      'System design',
      'Architecture validation',
      'Technical decisions'
    ],
    secondary: [
      'Code review',
      'Performance analysis'
    ],
    validations: [
      'Architecture compliance',
      'Design patterns',
      'System constraints'
    ],
    outputs: [
      'Architecture documents',
      'Design decisions',
      'Technical specifications'
    ]
  },
  CODE: {
    primary: [
      'Implementation',
      'Testing',
      'Documentation'
    ],
    secondary: [
      'Code optimization',
      'Bug fixes'
    ],
    validations: [
      'Code quality',
      'Test coverage',
      'Documentation completeness'
    ],
    outputs: [
      'Source code',
      'Test suites',
      'Technical documentation'
    ]
  }
};
```

### 1.3 Boundaries
```typescript
// Agent boundary definitions
interface AgentBoundary {
  allowedPaths: string[];
  restrictedPaths: string[];
  allowedOperations: {
    read: string[];
    write: string[];
    execute: string[];
  };
  contextLimits: {
    maxTokens: number;
    maxOperations: number;
    timeoutMs: number;
  };
}

const agentBoundaries: Record<string, AgentBoundary> = {
  ARCHITECT: {
    allowedPaths: [
      '/docs/architecture',
      '/docs/design'
    ],
    restrictedPaths: [
      '/src',
      '/tests'
    ],
    allowedOperations: {
      read: ['*'],
      write: ['.md', '.yaml'],
      execute: []
    },
    contextLimits: {
      maxTokens: 200000,
      maxOperations: 10,
      timeoutMs: 30000
    }
  },
  CODE: {
    allowedPaths: [
      '/src',
      '/tests',
      '/docs/implementation'
    ],
    restrictedPaths: [
      '/docs/architecture'
    ],
    allowedOperations: {
      read: ['*'],
      write: ['.ts', '.tsx', '.js', '.jsx', '.test.ts'],
      execute: ['test', 'build']
    },
    contextLimits: {
      maxTokens: 200000,
      maxOperations: 20,
      timeoutMs: 60000
    }
  }
};
```

## 2. Communication Standards

### 2.1 Message Format
```typescript
// Inter-agent message format
interface AgentMessage {
  source: {
    agent: string;
    role: string;
    task: string;
  };
  target: {
    agent: string;
    role: string;
  };
  content: {
    type: 'TASK' | 'VALIDATION' | 'RESPONSE' | 'ERROR';
    payload: any;
    metadata: {
      timestamp: string;
      contextSize: number;
      priority: 'low' | 'medium' | 'high';
    };
  };
  state: {
    preserved: any;
    required: string[];
  };
}

// Message validation
function validateMessage(message: AgentMessage): boolean {
  // Validate source
  if (!message.source.agent || !message.source.role) {
    return false;
  }

  // Validate target
  if (!message.target.agent || !message.target.role) {
    return false;
  }

  // Validate content
  if (!message.content.type || !message.content.payload) {
    return false;
  }

  // Validate state
  if (!message.state.required) {
    return false;
  }

  return true;
}
```

### 2.2 State Transfer
```typescript
// State transfer protocol
interface StateTransfer {
  source: {
    state: any;
    context: number;
    timestamp: string;
  };
  target: {
    requirements: string[];
    context: number;
    timestamp: string;
  };
  validation: {
    rules: any[];
    thresholds: any;
  };
}

class StateManager {
  async transferState(transfer: StateTransfer): Promise<boolean> {
    // Validate state requirements
    if (!this.validateStateRequirements(transfer)) {
      return false;
    }

    // Check context limits
    if (!this.checkContextLimits(transfer)) {
      return false;
    }

    // Transfer state
    await this.performStateTransfer(transfer);

    // Validate transfer
    return this.validateTransfer(transfer);
  }
}
```

### 2.3 Error Handling
```typescript
// Error handling protocol
interface AgentError {
  code: string;
  message: string;
  source: {
    agent: string;
    operation: string;
  };
  context: {
    state: any;
    tokens: number;
  };
  recovery: {
    type: 'retry' | 'rollback' | 'escalate';
    attempts: number;
    maxAttempts: number;
  };
}

class ErrorHandler {
  async handleError(error: AgentError): Promise<void> {
    // Log error
    await this.logError(error);

    // Attempt recovery
    if (error.recovery.attempts < error.recovery.maxAttempts) {
      await this.attemptRecovery(error);
    } else {
      await this.escalateError(error);
    }
  }
}
```

## 3. Workflow Patterns

### 3.1 Sequential Flow
```typescript
// Sequential workflow definition
interface SequentialWorkflow {
  steps: {
    agent: string;
    operation: string;
    requirements: string[];
    validation: string[];
  }[];
  transitions: {
    from: string;
    to: string;
    condition: string;
  }[];
  validation: {
    checkpoints: string[];
    requirements: string[];
  };
}

const implementationWorkflow: SequentialWorkflow = {
  steps: [
    {
      agent: 'ARCHITECT',
      operation: 'design_review',
      requirements: ['specifications', 'constraints'],
      validation: ['architecture_compliance']
    },
    {
      agent: 'CODE',
      operation: 'implement',
      requirements: ['design_approval'],
      validation: ['code_quality', 'test_coverage']
    },
    {
      agent: 'QA',
      operation: 'validate',
      requirements: ['implementation_complete'],
      validation: ['functional_requirements', 'quality_gates']
    }
  ],
  transitions: [
    {
      from: 'ARCHITECT',
      to: 'CODE',
      condition: 'design_approved'
    },
    {
      from: 'CODE',
      to: 'QA',
      condition: 'implementation_complete'
    }
  ],
  validation: {
    checkpoints: ['design', 'implementation', 'testing'],
    requirements: ['all_tests_passing', 'coverage_threshold_met']
  }
};
```

### 3.2 Parallel Flow
```typescript
// Parallel workflow definition
interface ParallelWorkflow {
  parallel_tasks: {
    group: string;
    agents: string[];
    operations: string[];
    sync_point: string;
  }[];
  coordination: {
    sync_strategy: 'barrier' | 'queue';
    timeout_ms: number;
    retry_count: number;
  };
  completion: {
    requirements: string[];
    validation: string[];
  };
}

const reviewWorkflow: ParallelWorkflow = {
  parallel_tasks: [
    {
      group: 'code_review',
      agents: ['CODE', 'ARCHITECT'],
      operations: ['review_code', 'validate_architecture'],
      sync_point: 'review_complete'
    },
    {
      group: 'testing',
      agents: ['QA', 'CODE'],
      operations: ['run_tests', 'fix_issues'],
      sync_point: 'tests_complete'
    }
  ],
  coordination: {
    sync_strategy: 'barrier',
    timeout_ms: 30000,
    retry_count: 3
  },
  completion: {
    requirements: ['all_reviews_complete', 'all_tests_passing'],
    validation: ['quality_gates_passed', 'coverage_threshold_met']
  }
};
```

### 3.3 Error Recovery
```typescript
// Error recovery workflow
interface RecoveryWorkflow {
  error_types: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    recovery_strategy: 'retry' | 'rollback' | 'escalate';
  }[];
  recovery_steps: {
    strategy: string;
    actions: string[];
    validation: string[];
  }[];
  escalation: {
    levels: string[];
    timeout_ms: number;
    notifications: string[];
  };
}

const errorRecoveryFlow: RecoveryWorkflow = {
  error_types: [
    {
      type: 'context_overflow',
      severity: 'high',
      recovery_strategy: 'rollback'
    },
    {
      type: 'validation_failure',
      severity: 'medium',
      recovery_strategy: 'retry'
    }
  ],
  recovery_steps: [
    {
      strategy: 'rollback',
      actions: ['save_state', 'clear_context', 'restore_last_valid'],
      validation: ['state_integrity', 'context_size']
    },
    {
      strategy: 'retry',
      actions: ['increment_attempt', 'wait_backoff', 'retry_operation'],
      validation: ['operation_success', 'system_stability']
    }
  ],
  escalation: {
    levels: ['team_lead', 'system_admin', 'emergency_contact'],
    timeout_ms: 300000,
    notifications: ['slack', 'email', 'pager']
  }
};
```

## 4. State Management

### 4.1 Context Management
```typescript
// Context management configuration
interface ContextConfig {
  thresholds: {
    warning: number;
    critical: number;
  };
  monitoring: {
    check_points: string[];
    metrics: string[];
  };
  actions: {
    at_warning: string[];
    at_critical: string[];
  };
}

const contextConfig: ContextConfig = {
  thresholds: {
    warning: 70,
    critical: 85
  },
  monitoring: {
    check_points: [
      'before_operation',
      'after_large_changes',
      'before_state_transitions'
    ],
    metrics: [
      'token_count',
      'operation_count',
      'memory_usage'
    ]
  },
  actions: {
    at_warning: [
      'complete_current_operation',
      'force_incremental_commit',
      'break_task_into_chunks'
    ],
    at_critical: [
      'stop_current_operation',
      'force_immediate_commit',
      'clear_context',
      'restart_with_fresh_context'
    ]
  }
};
```

### 4.2 Token Management
```typescript
// Token management system
interface TokenManager {
  current: number;
  limit: number;
  warning_threshold: number;
  critical_threshold: number;
  monitoring: {
    enabled: boolean;
    interval_ms: number;
    metrics: string[];
  };
}

class TokenManagementSystem {
  private tokenManager: TokenManager;

  constructor() {
    this.tokenManager = {
      current: 0,
      limit: 200000,
      warning_threshold: 140000,
      critical_threshold: 170000,
      monitoring: {
        enabled: true,
        interval_ms: 1000,
        metrics: ['token_usage', 'token_rate', 'peak_usage']
      }
    };
  }

  async monitorTokens(): Promise<void> {
    while (this.tokenManager.monitoring.enabled) {
      const usage = await this.getCurrentTokenUsage();
      
      if (usage >= this.tokenManager.critical_threshold) {
        await this.handleCriticalTokenUsage();
      } else if (usage >= this.tokenManager.warning_threshold) {
        await this.handleWarningTokenUsage();
      }

      await sleep(this.tokenManager.monitoring.interval_ms);
    }
  }
}
```

### 4.3 Recovery Procedures
```typescript
// Recovery procedures configuration
interface RecoveryConfig {
  procedures: {
    type: string;
    steps: string[];
    validation: string[];
  }[];
  state_management: {
    backup_interval_ms: number;
    max_backups: number;
    cleanup_threshold: number;
  };
  monitoring: {
    metrics: string[];
    alerts: string[];
  };
}

const recoveryConfig: RecoveryConfig = {
  procedures: [
    {
      type: 'context_overflow',
      steps: [
        'pause_operations',
        'save_state',
        'clear_context',
        'restore_essential_state',
        'resume_operations'
      ],
      validation: [
        'state_integrity',
        'context_size',
        'system_stability'
      ]
    },
    {
      type: 'state_corruption',
      steps: [
        'stop_operations',
        'load_last_backup',
        'verify_state',
        'restore_operations'
      ],
      validation: [
        'backup_integrity',
        'state_consistency',
        'system_health'
      ]
    }
  ],
  state_management: {
    backup_interval_ms: 300000,
    max_backups: 5,
    cleanup_threshold: 80
  },
  monitoring: {
    metrics: [
      'recovery_time',
      'success_rate',
      'state_integrity'
    ],
    alerts: [
      'recovery_started',
      'recovery_failed',
      'recovery_completed'
    ]
  }
};
```

Remember to:
- Follow role boundaries strictly
- Maintain proper state transfer
- Handle errors appropriately
- Use correct workflow patterns
- Monitor context usage
- Implement recovery procedures
- Document all interactions