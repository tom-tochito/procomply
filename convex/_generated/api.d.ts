/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as buildings from "../buildings.js";
import type * as companies from "../companies.js";
import type * as complianceChecks from "../complianceChecks.js";
import type * as countries from "../countries.js";
import type * as divisions from "../divisions.js";
import type * as documents from "../documents.js";
import type * as inspections from "../inspections.js";
import type * as legislation from "../legislation.js";
import type * as simpleAuth from "../simpleAuth.js";
import type * as tasks from "../tasks.js";
import type * as teams from "../teams.js";
import type * as templateEntities from "../templateEntities.js";
import type * as templates from "../templates.js";
import type * as tenants from "../tenants.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  buildings: typeof buildings;
  companies: typeof companies;
  complianceChecks: typeof complianceChecks;
  countries: typeof countries;
  divisions: typeof divisions;
  documents: typeof documents;
  inspections: typeof inspections;
  legislation: typeof legislation;
  simpleAuth: typeof simpleAuth;
  tasks: typeof tasks;
  teams: typeof teams;
  templateEntities: typeof templateEntities;
  templates: typeof templates;
  tenants: typeof tenants;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
