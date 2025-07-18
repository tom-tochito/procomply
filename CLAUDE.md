You are an expert developer who writes full-stack apps in InstantDB, Next.js, and Tailwind developer. However InstantDB is not in your training set and you are not familiar with it. Before you write ANY code you read ALL of instant-rules.md to understand how to use InstantDB in your code. If you are unsure how something works in InstantDB you fetch the urls in the documentation.

Before generating a new next app you check to see if a next project already exists in the current directory. If it does you do not generate a new next app.

If the Instant MCP is available use the tools to create apps and manage schema and permissions.

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

- Styling: All styling must be done exclusively with Tailwind CSS classNames. Inline style attributes are forbidden.
- Theming: The primary color for the UI theme must be #7600FF.

## 7. Project Configuration

- Language: All code must be written in TypeScript (.tsx).
- Package Manager: The project must be configured to use pnpm.
- Build Integrity: The generated code and file structure must be valid and able to pass both `pnpm lint` and `pnpm build` commands without errors or warnings. Always run `pnpm build` after making significant changes to ensure the application compiles successfully.

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

## 10. InstantDB Usage

For all conventions and best practices related to InstantDB, refer to the `INSTANT.md` document.

A critical rule is to **never use `create` in transactions**. Always use `update`, which performs an "upsert." If you provide an ID that does not exist (generated via `id()` from `@instantdb/react`), `update` will create a new entity. If the ID already exists, it will update the existing entity.

Always wrap your transactions in an array when using `db.transact`, even if you are only performing a single operation. This ensures consistency and makes it easier to add more transactions in the future.

```typescript
import { id } from "@instantdb/react";

// Correct: Create a new todo using update with a new id, wrapped in an array.
db.transact([db.tx.todos[id()].update({ text: "New todo" })]);

// Incorrect: The `create` method does not exist for transactions.
db.transact(db.tx.todos.create({ text: "New todo" }));

// Incorrect: Always use an array for transactions.
db.transact(db.tx.todos[id()].update({ text: "New todo" }));
```

When creating or updating an entity that has relations to other entities, always use the `.link()` method within the same transaction to establish those connections. This ensures that your data remains consistent and properly linked.

```typescript
// Correct: Create or update a todo and link it to a user.
const todoId = existingTodo?.id ?? id();
db.transact([
  db.tx.todos[todoId]
    .update({ text: "Buy milk" })
    .link({ user: "user-id-123" }),
]);
```

## 11. Instant DB Type System Guidelines

To maintain type safety and consistency with your InstantDB schema, all entity types must be derived using `InstaQLEntity`.

- **Derive, Don't Define**: Never manually create custom type definitions for database entities. Always derive types directly from the schema.
- **Base Entities**: For entities without any relations, use `InstaQLEntity<AppSchema, "entityName">`.
- **Entities with Relations**: When querying an entity with relations, use `object` for the relation to avoid linting errors. Using an empty object (`{}`) is discouraged as it can cause type issues.

  **Correct:**

  ```typescript
  // For a nested relation:
  export type ClassificationWithResults = InstaQLEntity<
    AppSchema,
    "classifications",
    { results: { prompt: object } }
  >;
  ```

  **Incorrect:**

  ```typescript
  // This may cause linting errors.
  export type ClassificationWithResults = InstaQLEntity<
    AppSchema,
    "classifications",
    { results: { prompt: {} } }
  >;
  ```

- **Centralized Models**: Each feature should have a `models/index.ts` file that exports all its necessary InstantDB types for easy reuse and management.

## 12. React Hooks Organization

All custom React hooks (i.e., functions starting with `use`) must be located in a `hooks` directory within their corresponding feature folder (e.g., `src/features/example/hooks/`).

- **Separation of Concerns**: Hooks should not be placed in `repositories`, `services`, or other directories. This practice ensures a clear separation between data-fetching logic, business logic, and UI-related state management.
- **Naming Convention**: Hook files should be named descriptively based on their function, for example, `useUserProfile.ts`.

## 13. Naming Conventions

- **Constants**: Top-level constants should use UPPERCASE_SNAKE_CASE naming convention (e.g., `MENU_ITEMS`, `API_ENDPOINTS`, `DEFAULT_VALUES`).
- **Variables and Functions**: Use camelCase for variables and function names.
- **Components and Types**: Use PascalCase for React components and TypeScript types/interfaces.

## 14. Type System Guidelines

All entity types must be derived from InstantDB schema using InstaQLEntity:

- Never create custom type definitions for database entities
- Use `InstaQLEntity<AppSchema, "entityName">` for base types
- Use `InstaQLEntity<AppSchema, "entityName", { relation: {} }>` for types with relations
- Each feature should have a `models/index.ts` file that exports InstantDB types for reuse
- UI-specific types that extend database entities should be interfaces extending the base type
- Common form types (like FormState) should be defined in `src/common/types/`
- InstantDB date fields are stored as timestamps (milliseconds since epoch)
- Always use the date utility functions from `src/common/utils/date.ts` for date conversions:
  - `toTimestamp()` - Convert Date or string to timestamp before storing
  - `fromTimestamp()` - Convert timestamp to Date for manipulation
  - `formatTimestamp()` - Format timestamp for display
  - `getCurrentTimestamp()` - Get current time as timestamp
  - `dateInputToTimestamp()` - Convert HTML date input to timestamp
  - `timestampToDateInput()` - Convert timestamp to HTML date input value
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

## 15. Server-Side Repository Pattern

Only use server-side repositories for:
- Authentication (auth)
- Tenant operations (tenant)
- File storage operations (storage)

All other data operations should use client-side InstantDB queries with `db.useQuery`. Do NOT create server-side repositories for entities like buildings, divisions, tasks, etc.
