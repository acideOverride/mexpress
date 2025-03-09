// Auto-generated dashboard data - Do not edit manually
// Last updated: 2025-03-03
window.dashboardData = {
  "lastUpdated": "2025-03-03",
  "dashboardDescription": "Centralized access to all project metrics, reports, and status information in one place.",
  "tests": {
    "lastUpdated": "2025-03-03",
    "summary": {
      "total": 104,
      "passing": 34,
      "failing": 67,
      "hanging": 3,
      "skipped": 0
    },
    "byPriority": {
      "p0": {
        "total": 25,
        "passing": 21,
        "failing": 4,
        "success": 84
      },
      "p1": {
        "total": 21,
        "passing": 8,
        "failing": 13,
        "success": 38.1
      },
      "p2": {
        "total": 16,
        "passing": 5,
        "failing": 11,
        "success": 31.3
      },
      "p3": {
        "total": 17,
        "passing": 0,
        "failing": 14,
        "hanging": 3,
        "success": 0
      },
      "unclassified": {
        "total": 25,
        "passing": 0,
        "failing": 25,
        "success": 0
      }
    },
    "byProject": {
      "core": {
        "total": 65,
        "passing": 34,
        "failing": 28,
        "hanging": 3,
        "success": 52.3
      },
      "montpc": {
        "total": 14,
        "passing": 0,
        "failing": 14,
        "success": 0
      },
      "ui": {
        "total": 2,
        "passing": 0,
        "failing": 2,
        "success": 0
      }
    },
    "brqs": [
      {
        "id": "MEXP-2025-001-API",
        "name": "API Integration Phase",
        "tests": 3,
        "priority": "P0",
        "status": "in-progress",
        "progress": 33.3
      },
      {
        "id": "MEXP-2025-002-BE",
        "name": "Authentication & Security",
        "tests": 4,
        "priority": "P0",
        "status": "in-progress",
        "progress": 75
      },
      {
        "id": "MEXP-2025-003-BE",
        "name": "Message Queue System",
        "tests": 5,
        "priority": "P0",
        "status": "in-progress",
        "progress": 80
      }
    ]
  },
  "milestones": {
    "lastUpdated": "2025-03-03",
    "summary": {
      "total": 11,
      "completed": 5,
      "inProgress": 2,
      "planned": 4
    },
    "quarters": {
      "q1-2025": {
        "total": 5,
        "completed": 5,
        "success": 100,
        "remaining": 0
      },
      "q2-2025": {
        "total": 2,
        "completed": 0,
        "inProgress": 2,
        "success": 0,
        "planned": 0
      },
      "q3-2025": {
        "total": 2,
        "completed": 0,
        "success": 0,
        "planned": 2
      },
      "q4-2025": {
        "total": 2,
        "completed": 0,
        "success": 0,
        "planned": 2
      }
    },
    "milestones": [
      {
        "id": "milestone-1",
        "name": "Core Infrastructure",
        "status": "completed",
        "quarter": "q1-2025",
        "progress": 100,
        "brqs": [
          "MEXP-2025-003-BE",
          "MEXP-2025-024-INFRA",
          "MEXP-2025-025-INFRA"
        ]
      },
      {
        "id": "milestone-2",
        "name": "Authentication & Security",
        "status": "completed",
        "quarter": "q1-2025",
        "progress": 100,
        "brqs": [
          "MEXP-2025-002-BE"
        ]
      },
      {
        "id": "milestone-3",
        "name": "API Integration Foundation",
        "status": "completed",
        "quarter": "q1-2025",
        "progress": 100,
        "brqs": [
          "MEXP-2025-001-API",
          "MEXP-2025-006-API"
        ]
      }
    ]
  },
  "tasks": {
    "lastUpdated": "2025-03-03",
    "summary": {
      "completedTasks": 9,
      "inProgressTasks": 3,
      "pendingTasks": 8
    },
    "currentSprint": {
      "name": "Service Integration Architecture",
      "dates": "March 1-15, 2025",
      "milestone": "milestone-6",
      "brq": "MEXP-2025-007-BE",
      "completed": 7,
      "inProgress": 2,
      "pending": 3,
      "testsPassing": 7,
      "testsTotal": 9,
      "total": 12
    },
    "nextSprint": {
      "name": "Frontend Architecture",
      "dates": "March 16-31, 2025",
      "milestone": "milestone-7",
      "brqs": [
        "MEXP-2025-002-FE",
        "MEXP-2025-005-FE",
        "MEXP-2025-018-FE"
      ],
      "completed": 2,
      "inProgress": 1,
      "pending": 2,
      "testsPassing": 1,
      "testsTotal": 2,
      "total": 5
    },
    "tasks": [
      {
        "id": "task-1",
        "name": "Service Discovery Implementation",
        "status": "completed",
        "sprint": "Service Integration Architecture",
        "milestone": "milestone-6",
        "brq": "MEXP-2025-007-BE",
        "assignee": "Developer Team",
        "tests": [
          "service-discovery.test.ts"
        ]
      },
      {
        "id": "task-2",
        "name": "Cross-Service Authentication",
        "status": "completed",
        "sprint": "Service Integration Architecture",
        "milestone": "milestone-6",
        "brq": "MEXP-2025-007-BE",
        "assignee": "Security Team",
        "tests": [
          "cross-service-auth.test.ts"
        ]
      },
      {
        "id": "task-9",
        "name": "Component Library Setup",
        "status": "completed",
        "sprint": "Frontend Architecture",
        "milestone": "milestone-7",
        "brq": "MEXP-2025-005-FE",
        "assignee": "UI Team",
        "tests": [
          "component-tests.test.js"
        ]
      }
    ]
  },
  "projects": {
    "mexpress": {
      "name": "mExpress",
      "description": "Core platform for business applications",
      "status": "active",
      "milestoneProgress": 80,
      "testProgress": 52.3
    },
    "montpc": {
      "name": "MontPC CRM",
      "description": "Customer management for PC repair",
      "status": "active",
      "milestoneProgress": 30,
      "testProgress": 0
    },
    "giandra": {
      "name": "Giandra Photos",
      "description": "Photo management and selling platform",
      "status": "planning",
      "milestoneProgress": 5,
      "testProgress": 0
    },
    "jerome": {
      "name": "Jerome Bikes",
      "description": "Bike rental and reservation system",
      "status": "planning",
      "milestoneProgress": 2,
      "testProgress": 0
    }
  },
  "recentUpdates": [
    {
      "date": "2025-03-03",
      "type": "Test",
      "description": "Fixed authentication service tests",
      "status": "Completed"
    },
    {
      "date": "2025-03-02",
      "type": "Milestone",
      "description": "Completed Core Infrastructure milestone",
      "status": "Completed"
    },
    {
      "date": "2025-03-01",
      "type": "Task",
      "description": "Started work on Service Mesh Configuration",
      "status": "In Progress"
    }
  ],
  "summary": {
    "milestoneCompletion": 45,
    "tasksCompleted": "9/20",
    "testsPassing": "33%",
    "brqCompletion": "5%",
    "taskProgress": 45,
    "testProgress": 33,
    "brqProgress": 5
  },
  "brqsCompleted": 5,
  "brqsTotal": 19,
  "activeProjects": 2,
  "planningProjects": 2,
  "maintenanceProjects": 0
};