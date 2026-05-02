import { bigserial, bigint, text, integer, timestamp, jsonb, pgTable, uniqueIndex, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const organizations = pgTable('organizations', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  clerkOrgId: text('clerk_org_id').unique().notNull(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  type: text('type').notNull().default('personal'),
  name: text('name'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  typeCheck: check('org_type_check', sql`${table.type} IN ('personal', 'team')`),
}));

export const memberships = pgTable('memberships', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  orgId: bigint('org_id', { mode: 'number' }).notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  clerkUserId: text('clerk_user_id').notNull(),
  role: text('role').notNull().default('owner'),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  uniqueOrgUser: uniqueIndex('memberships_org_user_unique').on(table.orgId, table.clerkUserId),
  roleCheck: check('membership_role_check', sql`${table.role} IN ('owner', 'admin', 'member')`),
}));

export const purchases = pgTable('purchases', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  orgId: bigint('org_id', { mode: 'number' }).notNull().references(() => organizations.id),
  stripeCheckoutSessionId: text('stripe_checkout_session_id').unique(),
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  sku: text('sku').notNull(),
  creditsPurchased: integer('credits_purchased').notNull(),
  amountCents: integer('amount_cents').notNull(),
  currency: text('currency').notNull().default('usd'),
  status: text('status').notNull().default('pending'),
  refundedCredits: integer('refunded_credits').notNull().default(0),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (table) => ({
  statusCheck: check('purchase_status_check', sql`${table.status} IN ('pending','complete','refunded','partially_refunded')`),
}));

export const webhookEvents = pgTable('webhook_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  stripeEventId: text('stripe_event_id').unique().notNull(),
  eventType: text('event_type').notNull(),
  payload: jsonb('payload').notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }).notNull().defaultNow(),
});
