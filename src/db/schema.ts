import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import type { Bilingual } from "@/lib/types";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteTitle: text("site_title").notNull(),
  siteDescription: jsonb("site_description").$type<Bilingual>().notNull(),
  heroKicker: jsonb("hero_kicker").$type<Bilingual>().notNull(),
  heroTitle: jsonb("hero_title").$type<Bilingual>().notNull(),
  heroSubtitle: jsonb("hero_subtitle").$type<Bilingual>().notNull(),
  landingQuestion: jsonb("landing_question").$type<Bilingual>().notNull(),
  landingHint: jsonb("landing_hint").$type<Bilingual>().notNull(),
  pathWork: jsonb("path_work").$type<Bilingual>().notNull(),
  pathWorkHint: jsonb("path_work_hint").$type<Bilingual>().notNull(),
  pathMe: jsonb("path_me").$type<Bilingual>().notNull(),
  pathMeHint: jsonb("path_me_hint").$type<Bilingual>().notNull(),
  pathConnect: jsonb("path_connect").$type<Bilingual>().notNull(),
  pathConnectHint: jsonb("path_connect_hint").$type<Bilingual>().notNull(),
  philosophy: jsonb("philosophy").$type<Bilingual>().notNull(),
  symbols: text("symbols").notNull(),
  metaImage: text("meta_image"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tagline: jsonb("tagline").$type<Bilingual>().notNull(),
  shortBio: jsonb("short_bio").$type<Bilingual>().notNull(),
  bio: jsonb("bio").$type<Bilingual>().notNull(),
  photoUrl: text("photo_url"),
  learning: jsonb("learning").$type<Bilingual>().notNull(),
  building: jsonb("building").$type<Bilingual>().notNull(),
  goals: jsonb("goals").$type<Bilingual>().notNull(),
  location: jsonb("location").$type<Bilingual>().notNull(),
  email: text("email").notNull().default(""),
  whatsapp: text("whatsapp").notNull().default(""),
  resumeUrl: text("resume_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortDescription: jsonb("short_description").$type<Bilingual>().notNull(),
  fullDescription: jsonb("full_description").$type<Bilingual>().notNull(),
  imageUrl: text("image_url"),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
  status: text("status").notNull().default("in-progress"),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  projectDate: text("project_date"),
  featured: boolean("featured").notNull().default(false),
  category: text("category").notNull().default("web"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const thoughts = pgTable("thoughts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: jsonb("title").$type<Bilingual>().notNull(),
  excerpt: jsonb("excerpt").$type<Bilingual>().notNull(),
  content: jsonb("content").$type<Bilingual>().notNull(),
  coverImage: text("cover_image"),
  category: text("category").notNull().default("life"),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const timeline = pgTable("timeline", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  title: jsonb("title").$type<Bilingual>().notNull(),
  body: jsonb("body").$type<Bilingual>().notNull(),
  position: integer("position").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default("craft"),
  level: integer("level").notNull().default(50),
  position: integer("position").notNull().default(0),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  url: text("url").notNull(),
  kind: text("kind").notNull().default("social"),
  position: integer("position").notNull().default(0),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
