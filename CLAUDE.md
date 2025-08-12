You are an expert developer who writes full-stack apps in Convex, Next.js, and Tailwind. Before you write ANY code involving Convex, you MUST read ALL of convex-rules.md to understand how to use Convex in your code. If you are unsure how something works in Convex you fetch the urls in the documentation.

For additional Convex documentation and LLM context, refer to: https://docs.convex.dev/llms.txt

ALL BUSINESS LOGIC MUST BE IN CONVEX FUNCTIONS OR ACTIONS. Do not create business logic in React hooks, components, or server actions outside of Convex.

Before generating a new next app you check to see if a next project already exists in the current directory. If it does you do not generate a new next app.

# Project Rules and Guidelines

## 1. Server Component Purity

All page.tsx files within the app/ directory must be Server Components. The "use client" directive is strictly forbidden in these files. Their sole responsibility is data fetching and composing UI features.

## 2. Feature-Centric Component Organization

All UI components must be located in the top-level features/ directory. Each subdirectory within features/ should correspond to a specific business domain or feature (e.g., features/user, features/auth).

## 3. Isolate Client-Side Interactivity

Any component that uses React hooks (useState, useEffect, etc.) or event handlers (onClick, onChange, etc.) must be explicitly declared as a Client Component using the "use client" directive at the top of the file.

## 4. Practical Component Modularity

Create components that represent logical, reusable features (e.g., SearchBar, FilterPanel). Avoid breaking components into overly atomic parts if those parts are never used independently.

## 5. Semantic Naming

Component filenames must be descriptive of their function (e.g., ProfileCard.tsx, SignInForm.tsx). Do not use environment-specific suffixes like Client or Server in filenames.

## 6. Styling and Theming

- All styling must use Tailwind CSS classNames only. No inline styles.
- Primary theme color: #7600FF

## 7. Project Configuration

- Language: TypeScript (.tsx)
- Package Manager: pnpm
- Build Integrity: Code must pass `pnpm lint` and `pnpm build` without errors

## 8. Shadcn

Use Shadcn as the component library

All `shadcn` components must be added using the `pnpm dlx` command. The format is as follows:

`pnpm dlx shadcn@latest add <component_name>`

For example:

`pnpm dlx shadcn@latest add button`

## 9. Error Handling

Never use `any` type in catch blocks. Always use `unknown` type and check with `instanceof Error`:

```typescript
catch (error: unknown) {
  console.error("Error message:", error);
  if (error instanceof Error) {
    // Handle error with error.message
  } else {
    // Handle unknown error type
  }
}
```

## 10. Convex Usage

For all conventions and best practices related to Convex, refer to the `convex-rules.md` document.

Key Convex principles:

- **Function Registration**: Use `query`, `mutation`, and `action` for public functions. Use `internalQuery`, `internalMutation`, and `internalAction` for private functions.
- **Always use validators**: Include `args` and `returns` validators for all Convex functions. If no return, use `returns: v.null()`.
- **Schema Definition**: Define your schema in `convex/schema.ts` using `defineSchema` and `defineTable`.
- **No filter, use indexes**: Always use `withIndex` for queries instead of `filter()`. Define appropriate indexes in the schema.
- **Transactions**: Use `ctx.db.insert`, `ctx.db.replace`, `ctx.db.patch`, and `ctx.db.delete` for mutations.
- **Type Safety**: Never use `any` type. Always use proper Convex types:
  - Use `Id<"tableName">` for document IDs
  - Use `Doc<"tableName">` for full document types
  - Use `Partial<Doc<"tableName">>` for update objects
  - Import types from `convex/_generated/dataModel`

Example Convex query:

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getBuildings = query({
  args: { tenantId: v.id("tenants") },
  returns: v.array(
    v.object({
      _id: v.id("buildings"),
      _creationTime: v.number(),
      name: v.string(),
      tenantId: v.id("tenants"),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("buildings")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
  },
});
```

Example Convex mutation with proper typing:

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

export const updateBuilding = mutation({
  args: {
    buildingId: v.id("buildings"),
    name: v.optional(v.string()),
    templateId: v.optional(v.id("templates")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const building = await ctx.db.get(args.buildingId);
    if (!building) {
      throw new Error("Building not found");
    }

    const updates: Partial<Doc<"buildings">> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.templateId !== undefined) updates.templateId = args.templateId;

    await ctx.db.patch(args.buildingId, updates);
    return null;
  },
});
```

- **Centralized Models**: Each feature should have a `models/index.ts` file that exports TypeScript types derived from the Convex schema.

## 11. React Hooks Organization

All custom React hooks (i.e., functions starting with `use`) must be located in a `hooks` directory within their corresponding feature folder (e.g., `src/features/example/hooks/`).

- **Separation of Concerns**: Hooks should not be placed in `repositories`, `services`, or other directories. This practice ensures a clear separation between data-fetching logic, business logic, and UI-related state management.
- **Naming Convention**: Hook files should be named descriptively based on their function, for example, `useUserProfile.ts`.

## 12. Naming Conventions

- **Constants**: Top-level constants should use UPPERCASE_SNAKE_CASE naming convention (e.g., `MENU_ITEMS`, `API_ENDPOINTS`, `DEFAULT_VALUES`).
- **Variables and Functions**: Use camelCase for variables and function names.
- **Components and Types**: Use PascalCase for React components and TypeScript types/interfaces.

## 13. Type System Guidelines

All entity types must be derived from Convex schema using the generated types:

- Use `Doc<"tableName">` for base document types from `convex/_generated/dataModel`
- Use `Id<"tableName">` for document ID types
- Each feature should have a `models/index.ts` file that exports types for reuse
- UI-specific types that extend database entities should be interfaces extending the base type
- Common form types (like FormState) should be defined in `src/common/types/`
- Convex stores dates as numbers (timestamps). Always use the date utility functions from `src/common/utils/date.ts` for date conversions:
  - `toTimestamp()` - Convert Date or string to timestamp before storing
  - `fromTimestamp()` - Convert timestamp to Date for manipulation
  - `formatTimestamp()` - Format timestamp for display
  - `getCurrentTimestamp()` - Get current time as timestamp
  - `dateInputToTimestamp()` - Convert HTML date input to timestamp
  - `timestampToDateInput()` - Convert timestamp to HTML date input value
- Always pass full entity models to functions/components instead of just IDs when the data is already available
  - This pattern improves type safety and reduces the need for additional queries
  - Exception: Convex queries/mutations should receive IDs as parameters

Example pattern:

```typescript
// src/features/buildings/models/index.ts
import { Doc, Id } from "convex/_generated/dataModel";

export type Building = Doc<"buildings">;
export type BuildingId = Id<"buildings">;

// UI-specific extension
export interface BuildingWithStats extends Building {
  compliance?: number;
  status?: string;
}
```

## 14. Template System Rules

### Template Field Definitions

Templates use a `fields` array in JSON format with typed TemplateField[]. Each field must have:

- `key`: Unique identifier (alphanumeric, no spaces, camelCase)
- `label`: Display name for the field
- `type`: Field type (text, textarea, number, date, select, multiselect, checkbox, image, file, url)
- `required`: Boolean indicating if field is mandatory
- Additional properties based on type (options, min/max, rows, accept)

### Template Data Storage

- Building data is stored in the `data` field as JSON (Record<string, any>)
- Keys in `data` must match field `key` values from the template
- Always validate data against template field definitions before saving
- Use type guards when retrieving data to ensure type safety

### Template Operations

1. **Creating/Updating Buildings:**

   ```typescript
   // In a Convex mutation
   import { mutation } from "./_generated/server";
   import { v } from "convex/values";

   export const updateBuilding = mutation({
     args: {
       buildingId: v.id("buildings"),
       data: v.any(), // Template data
     },
     returns: v.null(),
     handler: async (ctx, args) => {
       const building = await ctx.db.get(args.buildingId);
       if (!building) throw new Error("Building not found");

       const template = await ctx.db.get(building.templateId);
       if (!template) throw new Error("Template not found");

       // Validate data against template fields
       const templateData: Record<string, any> = {};
       template.fields.forEach((field) => {
         if (field.required && !args.data[field.key]) {
           throw new Error(`${field.label} is required`);
         }
         templateData[field.key] = args.data[field.key];
       });

       await ctx.db.patch(args.buildingId, { data: templateData });
       return null;
     },
   });
   ```

2. **Displaying Buildings:**

   - Fetch building with template relation using Convex queries
   - Loop through template.fields to determine display order and formatting
   - Retrieve values from building.data using field keys
   - Apply field type formatting (dates as timestamps, etc.)

3. **Template Changes:**
   - Templates should be treated as immutable once buildings use them
   - Create new template versions rather than modifying existing ones
   - New fields can be added (existing buildings show empty values)
   - Field removal should be handled gracefully (preserve data)
   - Never modify field keys after template is in use

### Template Builder Component

- Use a simple form-based interface (no drag-and-drop)
- Provide field type selection via dropdown
- Show/hide type-specific options based on selection
- Validate field keys are unique within template
- Preview the generated form before saving

## 15. File Upload Pattern

File uploads use server actions that handle both Cloudflare R2 storage and Convex metadata in a single operation:

1. **Server Actions for Uploads**: Create focused server actions for specific upload tasks

   ```typescript
   // Good: Task-specific upload action
   export async function uploadDocumentAction(params: {
     file: File;
     buildingId: string;
     category?: string;
   }) {
     // Upload to R2
     // Create Convex record
   }

   // Bad: Generic upload with complex metadata
   export async function uploadFileAction(
     file: File,
     metadata: ComplexMetadata
   );
   ```

2. **File Storage Structure**:

   - Store files in R2 with logical paths: `type/parentId/timestamp-filename`
   - Examples: `documents/building123/1234567-report.pdf`, `buildings/abc123/image-1234567.jpg`

3. **Atomic Operations**: Always upload file and create database record in the same action

   - Use `fetchMutation` from `convex/nextjs` in server actions
   - Return success/error status with relevant IDs

4. **File URLs**: Use the `getStorageFileUrl` helper to construct public URLs from file paths

## 16. Multi-Tenant Architecture

### Tenant Access Control

All Convex queries and mutations must enforce tenant-based access control:

1. **Required Tenant ID**: All queries and mutations that access tenant-scoped data MUST require `tenantId` as a parameter:
   ```typescript
   args: { 
     tenantId: v.id("tenants"),
     // other args...
   }
   ```

2. **URL-Based Tenant System**: 
   - All tenant-scoped URLs follow the pattern: `/tenant/[slug]/*`
   - Tenant ID must be derived from the URL slug, never randomly selected
   - Frontend components receive tenant data from server components or URL params

3. **Access Control Helper**: Use the `requireTenantAccess` helper for all tenant-scoped operations:
   ```typescript
   import { requireTenantAccess } from "./helpers/tenantAccess";
   
   export const getSomeData = query({
     args: { tenantId: v.id("tenants") },
     handler: async (ctx, args) => {
       const { tenantId, userId, user, isAdmin } = await requireTenantAccess(ctx, args.tenantId);
       // Query implementation...
     },
   });
   ```

4. **Admin Access**: 
   - Users with `role: "admin"` can access any tenant's data
   - Regular users can only access tenants they're assigned to via the `userTenants` table

5. **Frontend Pattern**:
   ```typescript
   // Server component gets tenant from URL
   const { tenant: tenantSlug } = await params;
   const tenant = await getTenantBySlug(tenantSlug);
   
   // Pass tenant to client components
   <SomeComponent tenant={tenant} />
   
   // Client component uses tenant._id in queries
   const data = useQuery(api.someQuery, { tenantId: tenant._id });
   ```

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
