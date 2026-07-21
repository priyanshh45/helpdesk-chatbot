# Incident Priority Matrix

## Purpose

This document defines how incident priority is determined based on the impact and urgency of an issue. Proper prioritization ensures that critical business services are restored as quickly as possible.

---

## Overview

Priority is assigned using two factors:

- Impact – How many users or business services are affected.
- Urgency – How quickly the issue must be resolved.

Higher impact and urgency result in a higher priority.

---

## Priority Levels

### P1 – Critical

#### Description

A critical incident affecting business operations.

#### Examples

- Entire network is down.
- Email server is unavailable.
- Production system outage.
- Company-wide VPN failure.

#### Response

- Immediate attention.
- Notify Incident Manager.
- Escalate to senior support teams.
- Continuous communication until resolved.

---

### P2 – High

#### Description

A major issue affecting multiple users or an important department.

#### Examples

- Department cannot access shared drives.
- Printer server failure.
- Teams not working for multiple users.

#### Response

- High priority investigation.
- Escalate if unresolved within SLA.

---

### P3 – Medium

#### Description

An issue affecting a single user with an available workaround.

#### Examples

- Outlook not opening.
- VPN issue for one employee.
- Printer offline for one user.
- Slow computer.

#### Response

- Standard troubleshooting.
- Resolve within normal SLA.

---

### P4 – Low

#### Description

Minor issues or information requests.

#### Examples

- Wallpaper change.
- General software guidance.
- Password change request.
- User training request.

#### Response

Resolve as resources become available.

---

## Priority Matrix

| Impact | Urgency | Priority |
|---------|----------|----------|
| High | High | P1 |
| High | Medium | P2 |
| Medium | Medium | P2 |
| Medium | Low | P3 |
| Low | Medium | P3 |
| Low | Low | P4 |

---

## Best Practices

- Assess business impact before assigning priority.
- Review priority if the situation changes.
- Escalate major incidents immediately.
- Keep users informed.

---

## Related ITIL Practices

- Incident Management
- Service Level Management

---

## Keywords

Priority

P1

P2

P3

P4

Impact

Urgency

SLA