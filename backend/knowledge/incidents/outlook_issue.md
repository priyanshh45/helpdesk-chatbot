# Outlook Issue SOP

## Purpose

This document provides a standard troubleshooting procedure for resolving Microsoft Outlook issues.

---

## Common Symptoms

- Outlook not opening
- Outlook freezes or crashes
- Emails not sending
- Emails not receiving
- Outlook running slowly
- Error while opening Outlook
- Profile corruption

---

## Initial Checks

Before troubleshooting:

- Verify the computer has internet access.
- Check whether Microsoft 365 services are operational.
- Confirm Outlook is installed correctly.
- Ask the user when the problem started.

---

## Troubleshooting Procedure

### Step 1

Restart Microsoft Outlook.

---

### Step 2

Restart the computer.

---

### Step 3

Open Outlook in Safe Mode.

Command:

```
outlook.exe /safe
```

If Outlook opens successfully, disable unnecessary add-ins.

---

### Step 4

Check mailbox storage.

Delete unnecessary emails if the mailbox is full.

---

### Step 5

Repair Microsoft Office.

Go to:

Control Panel → Programs → Microsoft Office → Change → Quick Repair

If required, perform an Online Repair.

---

### Step 6

Create a new Outlook profile if the existing profile is corrupted.

---

### Step 7

Verify Outlook can connect to the mail server.

---

### Step 8

Confirm with the user that Outlook is functioning normally.

---

## Common Causes

- Corrupted Outlook profile
- Faulty add-ins
- Network connectivity issue
- Mail server issue
- Damaged Office installation
- Full mailbox

---

## Escalation

Escalate if:

- Mail server is unavailable.
- Multiple users report the same issue.
- Profile recreation fails.
- Office repair does not resolve the issue.

---

## Best Practices

- Keep Microsoft Office updated.
- Archive old emails regularly.
- Disable unused add-ins.
- Maintain mailbox storage below organizational limits.

---

## Related ITIL Practices

- Incident Management
- Knowledge Management

---

## Keywords

Outlook

Email

Office

Mailbox

Profile

Add-ins

Microsoft 365

Safe Mode