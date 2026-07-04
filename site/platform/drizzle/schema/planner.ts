import { pgTable, text, timestamp, jsonb, uuid, index, primaryKey } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("profiles_email_idx").on(table.email),
  index("profiles_role_idx").on(table.role),
  index("profiles_created_at_idx").on(table.createdAt),
]);

export const plans = pgTable("oando_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  engine: text("engine").notNull(),
  payload: jsonb("payload").notNull().default({}),
  thumbnailUrl: text("thumbnail_url"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("plans_user_id_idx").on(table.userId),
  index("plans_status_idx").on(table.status),
  index("plans_created_at_idx").on(table.createdAt),
  index("plans_updated_at_idx").on(table.updatedAt),
  index("plans_user_id_status_idx").on(table.userId, table.status),
  index("plans_user_id_created_at_idx").on(table.userId, table.createdAt),
  index("plans_user_id_updated_at_idx").on(table.userId, table.updatedAt),
]);

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("teams_created_at_idx").on(table.createdAt),
]);

export const teamMembers = pgTable("team_members", {
  teamId: uuid("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.teamId, table.userId] }),
  index("team_members_team_id_idx").on(table.teamId),
  index("team_members_user_id_idx").on(table.userId),
]);

export const invites = pgTable("invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  invitedBy: uuid("invited_by").notNull().references(() => profiles.id),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("invites_team_id_idx").on(table.teamId),
  index("invites_invited_by_idx").on(table.invitedBy),
  index("invites_email_idx").on(table.email),
  index("invites_created_at_idx").on(table.createdAt),
]);

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").notNull(),
  actorId: uuid("actor_id").notNull(),
  action: text("action").notNull(),
  targetType: text("target_type"),
  targetId: uuid("target_id"),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("audit_events_team_id_idx").on(table.teamId),
  index("audit_events_actor_id_idx").on(table.actorId),
  index("audit_events_action_idx").on(table.action),
  index("audit_events_created_at_idx").on(table.createdAt),
  index("audit_events_team_id_created_at_idx").on(table.teamId, table.createdAt),
]);
