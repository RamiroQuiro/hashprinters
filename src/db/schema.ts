
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  nombre: text('nombre').notNull(),
  hashtag: text('hashtag').notNull().unique(),
  fecha: text('fecha').notNull(),
  descripcion: text('descripcion'),
  isActive:integer('isActive',{mode:'boolean'}).default(false),
  createdAt: integer('createdAt',{mode:'timestamp'}),
  updatedAt: integer('updatedAt',{mode:'timestamp'}) ,
});

export const fotos = sqliteTable('fotos', {
  id: text('id').primaryKey(),
  eventoId: text('eventoId').references(() => events.id),
  imageUrl: text('imageUrl').notNull(),
  instagramUrl: text('instagramUrl'),
  username: text('username').notNull(),
  caption: text('caption'),
  status: text('status', { enum: ['pendiente', 'aprobada', 'rechazada'] }).default('pendiente'),
  printed: integer('printed').default(0),
  impresiones: integer('impresiones').default(0),
  createdAt: integer('createdAt',{mode:'timestamp'}),
  updatedAt: integer('updatedAt',{mode:'timestamp'}) ,
  printedAt: integer('printedAt',{mode:'timestamp'}),
});

export const impresiones = sqliteTable('impresiones', {
  id: text('id').primaryKey(),
  fotoId: text('fotoId').references(() => fotos.id),
  printedAt: integer('printedAt',{mode:'timestamp'}).defaultNow(),
  tamanoImpresion: text('tamanoImpresion'),
  printerId: text('printerId'),
});

export const config = sqliteTable('config', {
  id: text('id').primaryKey(),
  autoAprovar: integer('autoAprovar',{mode:'boolean'}).default(false),
  tamanoImpresion: text('tamanoImpresion').default('4x6'),
  maxImpresionesPorUsuario: integer('maxImpresionesPorUsuario').default(5),
  eventId: text('eventId').references(() => events.id),
});
