# mExpress Architecture Documentation

## Overview

This documentation set provides a comprehensive view of the mExpress system architecture. It covers the system's organization, component relationships, technical standards, and integration patterns.

## Document Index

### System Architecture
- [**System Overview**](./system-overview.md) - High-level overview of the monorepo architecture, core structure, and major components
- [**Package Architecture**](./package-architecture.md) - Detailed examination of package organization, boundaries, and API design
- [**Integration Architecture**](./integration-architecture.md) - Comprehensive guide to component integration, data flows, and external system connections
- [**Technical Standards**](./technical-standards.md) - Defined standards for code quality, development practices, testing, and security
- [**Development Workflow**](./development-workflow.md) - Agent-based development model, validation chains, and quality processes

### Additional Architecture Documents
- [Architecture Summary](./architecture-summary.md) - Condensed summary of key architectural aspects
- [Current Status](./current-status.md) - Current implementation state and ongoing developments
- [Integration Specification](./integration-spec.md) - Detailed integration specifications and contracts
- [Message Queue Design](./message-queue-redesign.md) - Architecture of the messaging system
- [Repair System Assessment](./repair-system-assessment.md) - Evaluation of the repair tracking system
- [Repair Workflow Specification](./repair-workflow-spec.md) - Detailed workflow for repair processes

### Architecture Decisions
Architecture Decision Records (ADRs) are available in the [decisions](./decisions/) directory.

### QC Integration
Quality Control integration documentation is available in the [qc-integration](./qc-integration/) directory.

### GPM Handoff
Project management handoff documentation is available in the [gpm-handoff](./gpm-handoff/) directory.

## Documentation Purpose

These architecture documents serve multiple purposes:

1. **Design Reference** - Authoritative source for architectural patterns and standards
2. **Onboarding Material** - Introduction to system architecture for new team members
3. **Decision Records** - Documentation of key architectural decisions and their rationales
4. **QC Reference** - Quality verification source for architectural compliance
5. **Evolution Guide** - Framework for architectural evolution and maintenance

## Intended Audience

This documentation is intended for:

- **Architects** - For architectural design and decision-making
- **Developers** - For implementation guidance and standards
- **Quality Engineers** - For verification against architectural standards
- **Project Managers** - For understanding technical constraints and capabilities
- **Security Specialists** - For reviewing security architecture and standards

## Documentation Standards

All architecture documentation follows these standards:

1. **Clarity** - Clear, concise language accessible to the intended audience
2. **Completeness** - Comprehensive coverage of architectural concerns
3. **Consistency** - Uniform terminology and structure across documents
4. **Currency** - Regular updates to reflect the current architecture
5. **Traceability** - Links to related documents and decision records

## Maintenance Responsibility

Architecture documentation is maintained by the Architect role with review and validation from QC.

---

*Last Updated: February 26, 2025*