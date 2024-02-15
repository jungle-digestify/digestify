import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  serial,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import type { AdapterAccount } from "@auth/core/adapters";
import { customType } from "drizzle-orm/pg-core";

function genExpWithWeights(input: string[]) {
  const columnExpressions = input.map((column, index) => {
    const weight = String.fromCharCode(index + 65);
    return `setweight(to_tsvector('config_2_gram_cjk', coalesce(${column}, '')), '${weight}')`;
  });

  const tsvectorColumn = `tsvector GENERATED ALWAYS AS (${columnExpressions.join(
    " || "
  )}) STORED`;

  return tsvectorColumn;
}

export const tsvector = customType<{
  data: string;
  config: { sources: string[]; weighted: boolean };
}>({
  dataType(config) {
    if (config) {
      const sources = config.sources.join(" || ' ' || ");
      return config.weighted
        ? genExpWithWeights(config.sources)
        : `tsvector generated always as (to_tsvector(${sources})) stored`;
    } else {
      return `tsvector`;
    }
  },
});

export const posts = pgTable("post", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  createdAt: timestamp("time", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const workspace = pgTable("workspace", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull().default("새 워크 스페이스"),
  description: text("description"),
  type: text("type", { enum: ["personal", "team"] }).notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const userInWorkspace = pgTable("userInWorkspace", {
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accept: boolean("accept").notNull().default(false),
  isHost: boolean("isHost").notNull().default(false),
});

export const metadata = pgTable("metadata", {
  chatId: text("chatId")
    .notNull()
    .primaryKey()
    .references(() => chats.id),
  keyword: text("keyword"),
});
// chatgpt 기본 예제
export const chats = pgTable(
  "chats",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    workspaceId: text("user_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    videoId: text("video_id"),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => {
    return {
      workspaceIdIndex: index("chats_auth_user_id_idx").on(table.workspaceId),
    };
  }
);
// export const workspaceChatRelation = relations(workspace, ({one,many})=>({
//   profile: one(chats,{
//     fields: [workspace.id],
//     references: [chats.workspaceId]
//   }),
// }))
// export const chatWorkspaceRelation = relations(chats, ({one}) => ({
//   author: one(workspace, {
//     fields: [chats.workspaceId],
//     references: [workspace.id]
//   })
// }))
export type InsertChat = InferInsertModel<typeof chats>;
export type SelectChat = InferSelectModel<typeof chats>;
export const messages = pgTable("messages", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  chatId: text("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  vec: tsvector("vec", {
    sources: ["content"],
    weighted: true,
  }),
});
type MessageSelect = InferSelectModel<typeof messages>;
type MessageInsert = InferInsertModel<typeof messages>;
// https://authjs.dev/reference/adapter/drizzle
export const users = pgTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: text("role", { enum: ["ADMIN", "USER"] })
    .notNull()
    .default("USER"),
  isTwoFactorEnabled: boolean("isTwoFactorEanbled").notNull().default(false),
  defaultWorkspace: text("defaultWorkspace").references(() => workspace.id),
});

export type UserSelect = InferSelectModel<typeof users>;
type UserInsert = InferInsertModel<typeof users>;
export type UserRole = UserSelect["role"];
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);
export const verificationTokens = pgTable(
  "verificationToken",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);
export const passwordResetTokens = pgTable(
  "passwordResetToken",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);
export const twoFactorTokens = pgTable(
  "twoFactorToken",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);
export const twoFactorConfirmation = pgTable("twoFactorConfirmation", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
});
