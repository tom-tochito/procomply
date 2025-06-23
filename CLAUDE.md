# Project Rules and Guidelines

<rules>

## 1. Server Component Purity

All page.tsx files within the app/ directory must be Server Components. The "use client" directive is strictly forbidden in these files. Their sole responsibility is data fetching and composing UI features.

## 2. Feature-Centric Component Organization

All UI components must be located in the top-level features/ directory. Each subdirectory within features/ should correspond to a specific business domain or feature (e.g., features/building-search, features/user-profile).

## 3. Isolate Client-Side Interactivity

Any component that uses React hooks (useState, useEffect, etc.) or event handlers (onClick, onChange, etc.) must be explicitly declared as a Client Component using the "use client" directive at the top of the file.

## 4. Practical Component Modularity

Create components that represent logical, reusable features (e.g., SearchBar, FilterPanel, BuildingCardGrid). Avoid breaking components into overly atomic parts if those parts are never used independently.

## 5. Semantic Naming

Component filenames must be descriptive of their function (e.g., BuildingCard.tsx, SignInForm.tsx). Do not use environment-specific suffixes like Client or Server in filenames.

## 6. Styling and Theming

- Styling: All styling must be done exclusively with Tailwind CSS classNames. Inline style attributes are forbidden.
- Theming: The primary color for the UI theme must be #F30.

## 7. Project Configuration

- Language: All code must be written in TypeScript (.tsx).
- Package Manager: The project must be configured to use pnpm.
- Build Integrity: The generated code and file structure must be valid and able to pass a pnpm build command without errors.

## 8. Server Actions and Repository Syntax

All repository files must use the "use server" directive at the top of the file. When using "use server" directive, you must use export function syntax. Classes with "use server" are not allowed. All server actions and repository methods must be exported as individual functions, not as static methods on a class.

## 9. File Storage Service

All file uploads and downloads must use the storage service located at src/common/services/storage/storage.service.ts. When implementing file upload/download functionality:

- Use `uploadFile(path, file)` for uploading files to Cloudflare storage
- Use `getFileUrl(tenant, path)` from src/common/utils/file.ts to generate a URL for serving files via HTTP GET requests
- Use `deleteFile(path)` for removing files from storage
- Store the file path (returned from uploadFile) in the database for reference
- The path parameter must start with "/" (e.g., "/documents/file.pdf")
- Files can be accessed via GET request at `/tenant/[tenant]/files/[path]` (e.g., `/tenant/acme/files/documents/report.pdf`)
- Never implement direct file system access or custom upload/download logic

## 10. Route Parameters

All Next.js route handlers must await params when accessing route parameters. The params object is now a Promise that must be awaited:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;
  // ... rest of handler
}
```

## 11. Next.js Form Guidelines

All forms in client components must follow Next.js form guidelines with server actions and useActionState:

- Use `useActionState` hook for form state management instead of `useState`
- Remove `preventDefault` and use native form submission with `action` attribute
- Server actions receive FormData directly and handle validation
- Use `isPending` from useActionState for loading states instead of manual state
- Display errors through the state returned by useActionState, not alerts
- Forms support progressive enhancement when JavaScript is disabled

Example pattern:

```typescript
"use client";
import { useActionState } from "react";

interface FormState {
  error: string | null;
  success: boolean;
}

export function MyForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      // Validation and server action call
      const result = await myServerAction(formData);
      return result.success
        ? { error: null, success: true }
        : { error: result.error, success: false };
    },
    { error: null, success: false }
  );

  return (
    <form action={formAction}>
      {state.error && <div className="error">{state.error}</div>}
      <input name="field" required disabled={isPending} />
      <button disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
```

## 12. Type System Guidelines

All entity types must be derived from InstantDB schema using InstaQLEntity:

- Never create custom type definitions for database entities
- Use `InstaQLEntity<AppSchema, "entityName">` for base types
- Use `InstaQLEntity<AppSchema, "entityName", { relation: {} }>` for types with relations
- Each feature should have a `models/index.ts` file that exports InstantDB types for reuse
- UI-specific types that extend database entities should be interfaces extending the base type
- Common form types (like FormState) should be defined in `src/common/types/`
- InstantDB date fields accept ISO string format (e.g., new Date().toISOString())
- Always pass full entity models to functions/components instead of just IDs (e.g., pass full Tenant object, not tenantId)

Example pattern:

```typescript
// src/features/buildings/models/index.ts
import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

export type Building = InstaQLEntity<AppSchema, "buildings">;
export type BuildingWithTenant = InstaQLEntity<
  AppSchema,
  "buildings",
  { tenant: {} }
>;

// UI-specific extension
export interface BuildingWithStats extends Building {
  compliance?: number;
  status?: string;
}
```

## 13. InstantDB Read/Write Separation 🚨🚨🚨

**CRITICAL RULE - MUST FOLLOW AT ALL TIMES:**

- **READ OPERATIONS:** ALWAYS use `~/lib/db.ts` client for ALL read operations
  - Import: `import { db } from "~/lib/db";`
  - Use `db.useQuery()` in client components for real-time subscriptions
  - This is the ONLY way to read data from InstantDB
  
- **WRITE OPERATIONS:** ALWAYS use `~/lib/db-admin.ts` for ALL write operations
  - Import: `import { dbAdmin } from "~/lib/db-admin";`
  - Use in server actions with "use server" directive
  - Use `dbAdmin.transact()` for mutations
  - Use `dbAdmin.query()` ONLY for authorization checks before writes
  
**NEVER MIX THESE UP! NEVER USE db FOR WRITES! NEVER USE dbAdmin FOR CLIENT-SIDE READS!**

Example:
```typescript
// ❌ WRONG - Never use dbAdmin in client components
"use client";
import { dbAdmin } from "~/lib/db-admin"; // ❌ WRONG!

// ✅ CORRECT - Client component read
"use client";
import { db } from "~/lib/db";
const { data } = db.useQuery({ users: {} });

// ✅ CORRECT - Server action write
"use server";
import { dbAdmin } from "~/lib/db-admin";
await dbAdmin.transact([
  dbAdmin.tx.users[id].update({ name: "New Name" })
]);
```

</rules>
