# Network Issue SOP

## Purpose

Provide a standard troubleshooting procedure for resolving network connectivity issues.

---

## Common Symptoms

- No internet connection
- Slow internet
- Wi-Fi disconnected
- Cannot access shared drives
- Unable to reach company servers
- DNS errors
- Limited connectivity

---

## Initial Checks

Verify:

- Network cable is connected.
- Wi-Fi is enabled.
- Router or switch appears operational.
- Other users are affected.

---

## Troubleshooting Procedure

### Step 1

Restart the computer.

---

### Step 2

Reconnect to the network.

---

### Step 3

Check IP configuration.

Command:

```
ipconfig
```

---

### Step 4

Renew IP address.

Commands:

```
ipconfig /release

ipconfig /renew
```

---

### Step 5

Test network connectivity.

Commands:

```
ping google.com

ping <gateway_ip>
```

---

### Step 6

Flush DNS cache.

Command:

```
ipconfig /flushdns
```

---

### Step 7

Restart the network adapter.

---

### Step 8

Verify access to required resources.

---

## Common Causes

- Network cable disconnected
- Router failure
- Switch failure
- DNS issue
- DHCP issue
- ISP outage
- Firewall restrictions

---

## Escalation

Escalate if:

- Multiple users are affected.
- Switch or router failure is suspected.
- Server cannot be reached.
- WAN connection is unavailable.

---

## Best Practices

- Use approved network hardware.
- Maintain updated drivers.
- Report recurring connectivity issues.
- Document troubleshooting performed.

---

## Related ITIL Practices

- Incident Management
- Monitoring and Event Management

---

## Keywords

Network

Internet

Wi-Fi

LAN

DNS

DHCP

Router

Switch

Connectivity

Ping