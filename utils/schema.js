import { relations } from 'drizzle-orm';
import {
  boolean,
  int,
  mysqlTable,
  varchar,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

export const GRADES = mysqlTable('grades', {
  id: int('id', { length: 11 }).primaryKey(),
  grade: varchar('grade', { length: 10 }).notNull(),
});

export const STUDENTS = mysqlTable('students', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 20 }).notNull(),
  email: varchar('email', { length: 50 }).notNull().unique(),
  gradeId: int('gradeId')
    .notNull()
    .references(() => GRADES.id),
  address: varchar('address', { length: 50 }).default(null),
  contact: varchar('contact', { length: 11 }).default(null),
});

export const TEACHERS = mysqlTable('teachers', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 20 }).notNull(),
  email: varchar('email', { length: 50 }).notNull().unique(),
  address: varchar('address', { length: 50 }).default(null),
  contact: varchar('contact', { length: 11 }).default(null),
});

// SUBJECTS Table
export const SUBJECTS = mysqlTable('subjects', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
});

// Many-to-Many Junction Table
export const TEACHER_SUBJECTS = mysqlTable(
  'teachers_subjects',
  {
    teacherId: int('teacherId').notNull(),
    subjectId: int('subjectId').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.teacherId, table.subjectId] }),
  })
);

export const teacherSubjectsRelations = relations(
  TEACHER_SUBJECTS,
  ({ one }) => ({
    teacher: one(TEACHERS, {
      fields: [TEACHER_SUBJECTS.teacherId],
      references: [TEACHERS.id],
    }),
    subject: one(SUBJECTS, {
      fields: [TEACHER_SUBJECTS.subjectId],
      references: [SUBJECTS.id],
    }),
  })
);

export const GRADE_SUBJECTS = mysqlTable(
  'grades_subjects',
  {
    gradeId: int('gradeId').notNull(),
    subjectId: int('subjectId').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.gradeId, table.subjectId] }),
  })
);

export const gradeSubjectsRelations = relations(GRADE_SUBJECTS, ({ one }) => ({
  grade: one(GRADES, {
    fields: [GRADE_SUBJECTS.gradeId],
    references: [GRADES.id],
  }),
  subject: one(SUBJECTS, {
    fields: [GRADE_SUBJECTS.subjectId],
    references: [SUBJECTS.id],
  }),
}));

export const ATTENDANCE = mysqlTable('attendance', {
  id: int('id', { length: 11 }).autoincrement().primaryKey(),
  studentId: int('studentId', { length: 11 })
    .notNull()
    .references(() => STUDENTS.id),
  present: boolean('present').default(false),
  day: int('day', { length: 11 }).notNull(), //20
  date: varchar('date', { length: 20 }).notNull(), //02/2002
  subjectId: varchar('subjectId', { length: 20 }).notNull(),
  gradeId: int('gradeId')
    .notNull()
    .references(() => GRADES.id),
});

// Roles Table
export const ROLE = mysqlTable('role', {
  id: int('id', { length: 11 }).autoincrement().primaryKey(),
  name: varchar('name', { length: 20 }).notNull().unique(), // Role name (admin, user, etc.)
});

// Users Table
export const USER = mysqlTable('user', {
  id: int('id', { length: 11 }).autoincrement().primaryKey(),
  name: varchar('name', { length: 20 }).notNull(),
  email: varchar('email', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(), // Hashed password
  role_id: int('role_id', { length: 11 })
    .notNull()
    .references(() => ROLE.id), // Foreign key reference to roles table
  otp: varchar('otp', { length: 6 }), // Stores OTP for password reset
  otp_expiry: datetime('otp_expiry'), // OTP expiration time
});
