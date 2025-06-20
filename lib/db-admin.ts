import { init } from "@instantdb/admin";
import schema from "../instant.schema";

const appId = process.env.INSTANT_APP_ID;
const adminToken = process.env.INSTANT_ADMIN_TOKEN;

export const dbAdmin = init({
  appId: appId!,
  adminToken: adminToken!,
  schema,
});
