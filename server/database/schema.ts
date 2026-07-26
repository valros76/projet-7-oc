import { mysqlTable, int, varchar, datetime, mysqlEnum, boolean, decimal, date, index } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

// Table: users
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  role: mysqlEnum('role', ['admin', 'referrer']).notNull().default('referrer'),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  siret: varchar('siret', { length: 14 }),
  iban: varchar('iban', { length: 34 }),
  affiliateCode: varchar('affiliate_code', { length: 50 }).unique(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => [
  index('idx_email').on(table.email),
  index('idx_affiliate_code').on(table.affiliateCode),
])

// Table: refresh_tokens
export const refreshTokens = mysqlTable('refresh_tokens', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: datetime('expires_at').notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('idx_token').on(table.token),
  index('idx_user_id').on(table.userId),
])

// Table: leads
export const leads = mysqlTable('leads', {
  id: int('id').primaryKey().autoincrement(),
  referrerId: int('referrer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyName: varchar('company_name', { length: 150 }).notNull(),
  contactFirstName: varchar('contact_first_name', { length: 100 }).notNull(),
  contactLastName: varchar('contact_last_name', { length: 100 }).notNull(),
  clientSiret: varchar('client_siret', { length: 14 }),
  clientEmail: varchar('client_email', { length: 255 }).notNull(),
  clientPhone: varchar('client_phone', { length: 20 }).notNull(),
  missionTitle: varchar('mission_title', { length: 255 }).notNull(),
  missionStartDate: date('mission_start_date').notNull(),
  durationDays: int('duration_days'),
  isIndefiniteDuration: boolean('is_indefinite_duration').notNull().default(false),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).notNull().default('10.00'),
  status: mysqlEnum('status', ['pending', 'accepted', 'refused', 'finished']).notNull().default('pending'),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => [
  index('idx_referrer_id').on(table.referrerId),
  index('idx_status').on(table.status),
])