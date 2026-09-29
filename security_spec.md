# Security Specification: FerreTask (Hardware Store Task Management)

## 1. Data Invariants
1. **User Identity**: A user cannot modify another user's profile or impersonate another user's UID.
2. **Task Ownership & Delegation**: Tasks can be created by authenticated users. Steps can be updated and checked off by the assigned user or creator.
3. **Notification Privacy**: Notifications are strictly readable by the target `userId` or their creator. Users can update `read` status on their own notifications.
4. **Supplier Leads**: Strategic purchasing leads are accessible to authenticated team members to collaborate on suppliers and pricing.
5. **Length and Type Boundaries**: All string properties have explicit maximum sizes to prevent denial of wallet attacks.

## 2. The Dirty Dozen Test Payloads (Security Invariants)
1. **Unauthenticated Task Creation**: Anonymous or null auth payload attempting to write to `/tasks/task_123` -> Rejected.
2. **ID Spoofing on User Profile**: Authenticated user 'userA' attempting to write to `/users/userB` -> Rejected.
3. **Ghost Fields Injection**: Attempting to inject extra non-schema fields into a Task document -> Rejected.
4. **Oversized String Bomb**: Task title with 50,000 characters -> Rejected by `.size() <= 150`.
5. **Notification Hijack**: Attempting to read another user's notifications without matching `userId` -> Rejected.
6. **Task Status Poisoning**: Setting status to an unauthorized arbitrary string outside the allowed enum -> Rejected.
7. **Orphaned Step Checkbox Injection**: Writing a step with corrupted structure -> Rejected.
8. **Negative Estimated Minutes**: Setting estimated minutes to negative values -> Rejected.
9. **Tampering with CreatedAt**: Overwriting original `createdAt` timestamp during an update -> Rejected.
10. **Malicious Path Traversal**: Requesting a document ID with illegal punctuation or slash characters -> Rejected by `isValidId()`.
11. **Impersonating Admin or Role Escalation**: Regular employee attempting to escalate themselves to 'dueño' without authorization -> Rejected.
12. **Notification Mass Spamming**: Writing a notification targeting a non-existent task or malicious recipient -> Rejected.
