# Change Management

## Purpose

Change Management is the ITIL practice that ensures changes to IT services are planned, assessed, approved, implemented, and reviewed in a controlled manner. The objective is to minimize risks while improving IT services without causing unnecessary service disruptions.

---

## Overview

A change is any addition, modification, or removal of an IT service, infrastructure component, software, hardware, or configuration item that could affect business operations.

Examples of changes include:

- Installing a new server
- Updating Windows
- Upgrading Microsoft Office
- Deploying a new application
- Replacing network switches
- Updating firewall rules

Unlike incidents, changes are planned activities.

---

## Objectives

- Reduce risks associated with changes.
- Minimize service downtime.
- Improve service quality.
- Ensure proper approvals before implementation.
- Maintain complete documentation of all changes.

---

## Types of Changes

### Standard Change

A low-risk, pre-approved, and repeatable change.

Examples:

- Installing approved software
- Resetting user permissions
- Creating user accounts

---

### Normal Change

A planned change requiring review and approval.

Examples:

- Server upgrade
- Network configuration change
- Database migration

---

### Emergency Change

A change implemented immediately to restore critical services.

Examples:

- Security vulnerability patch
- Critical server outage
- Firewall rule update during an attack

---

## Change Lifecycle

1. Submit Change Request
2. Review Change
3. Risk Assessment
4. Approval
5. Implementation Planning
6. Testing
7. Deployment
8. Validation
9. Documentation
10. Change Closure

---

## Roles and Responsibilities

### Requester

Submits the change request.

### Change Manager

Reviews and coordinates the change process.

### Change Advisory Board (CAB)

Evaluates significant changes and provides approval.

### Technical Team

Implements and validates the change.

---

## Risk Assessment

Before implementing a change, consider:

- Business impact
- Technical complexity
- Rollback availability
- Security risks
- Service downtime
- Testing requirements

---

## Rollback Plan

Every significant change should include a rollback plan.

Example:

If a software upgrade fails:

- Restore previous version.
- Restore backup.
- Verify service availability.
- Notify stakeholders.

---

## Best Practices

- Test changes before deployment.
- Schedule changes during maintenance windows.
- Inform affected users.
- Document implementation steps.
- Keep rollback plans ready.
- Review successful and failed changes.

---

## Related ITIL Practices

- Incident Management
- Problem Management
- Release Management
- Deployment Management

---

## Keywords

Change

CAB

Standard Change

Normal Change

Emergency Change

Rollback

Deployment

Risk Assessment

Maintenance