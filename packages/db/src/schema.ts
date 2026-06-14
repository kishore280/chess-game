import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

export const gameStatusEnum = pgEnum("game_status", ["waiting", "in_progress", "completed", "abandoned"]);
export const gameResultEnum = pgEnum("game_result", ["white", "black", "draw"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const games = pgTable("games", {
  id: uuid("id").defaultRandom().primaryKey(),
  whitePlayerId: uuid("white_player_id").references(() => users.id).notNull(),
  blackPlayerId: uuid("black_player_id").references(() => users.id).notNull(),
  status: gameStatusEnum("status").default("in_progress").notNull(),
  result: gameResultEnum("result"),
  currentFen: text("current_fen"),
  startAt: timestamp("start_at").defaultNow().notNull(),
  endAt: timestamp("end_at"),
});

export const moves = pgTable("moves", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id").references(() => games.id).notNull(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  san: text("san").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
