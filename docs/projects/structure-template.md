# Standard Project Documentation Structure

```
{client}_{purpose}/
├── business/              # ASK agent
│   ├── requirements/
│   ├── acknowledgments/
│   ├── validation/
│   └── qa/
│       ├── quality-gates/
│       ├── reports/
│       └── decisions/
│
├── architecture/         # ARCHITECT agent
│   ├── technical-specs/
│   ├── decisions/
│   ├── validation/
│   └── qa/
│
├── implementation/       # CODE agent
│   ├── code-docs/
│   ├── test-docs/
│   ├── validation/
│   └── qa/
│
└── git/                  # GIT agent
    ├── branch-strategy/
    ├── release-docs/
    ├── validation/
    └── qa/