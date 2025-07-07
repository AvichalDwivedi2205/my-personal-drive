import "server-only";
// This guarentees a runtime or build error when we import it on the client

import { int, bigint, text, singlestoreTableCreator, index } from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator((name) => `drive-tutorial_${name}`)
// This schema is followed so that we can have multiple projects in the same database with one prefix used for one single projects' tables

export const files_table = createTable("files_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  size: int("size").notNull(),
  url: text("url").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true }).notNull(),
}, (t) => {
  return [index("parent_index").on(t.parent)];
});

export const folders_table = createTable("folders_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true }),
}, (t) => {
  return [index("parent_index").on(t.parent)];
});