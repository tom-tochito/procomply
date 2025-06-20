# Authentication Module

This module provides magic code authentication using InstantDB with server-side cookie management.

## Overview

The authentication system uses magic codes (6-digit verification codes sent via email) instead of passwords. Users must exist in the database before they can log in.

## Usage Examples

### Protected Pages (Server Components)

```typescript
import { requireAuth } from "@/features/auth";

export default async function DashboardPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const auth = await requireAuth(tenant);
  
  // auth contains: { userId, tenantId, email }
  // Page content here...
}
```

### Login Flow

The login process consists of two steps:
1. User enters email → System checks if user exists → Sends magic code
2. User enters verification code → System validates → Sets auth cookies

Already implemented at `/app/tenant/[tenant]/login/page.tsx`

### Logout Action

```typescript
import { logoutAction } from "@/features/auth";

// In a client component
const handleLogout = async () => {
  await logoutAction(tenantSubdomain);
};
```

### Repository Pattern

Database operations are handled through repository classes:

```typescript
import { UserRepository, TenantRepository } from "@/features/repository";

// Create a user
const user = await UserRepository.create({
  email: "user@example.com",
  role: "user",
  tenantId: "tenant-id"
});

// Find users by tenant
const users = await UserRepository.findByTenant(tenantId);
```

### Seeding Test Users

```bash
# Make sure you have INSTANT_APP_ID and INSTANT_ADMIN_TOKEN in .env.local
pnpm seed:user

# Default test user:
# Email: admin@procomply.co.uk
# Role: admin
# Auth: Magic code will be sent to email
```

## Environment Variables

Add these to your `.env.local`:

```
NEXT_PUBLIC_INSTANT_APP_ID=your-instant-app-id
INSTANT_APP_ID=your-instant-app-id
INSTANT_ADMIN_TOKEN=your-instant-admin-token
```

## Database Schema

The authentication system uses the following schema:

- `$users` entity with `email` and `role` fields (no password)
- `$users` → `tenant` (many-to-one relationship)
- All entities have tenant relationships for proper data isolation

## Security Notes

- Magic codes are sent via InstantDB's built-in auth system
- Users must exist in the database before they can authenticate
- Auth cookies are httpOnly, secure (in production), and sameSite=lax
- Tenant validation ensures users can only access their assigned tenant's data