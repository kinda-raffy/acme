import {uuidv7} from 'uuidv7';
import {sqliteTable} from 'drizzle-orm/sqlite-core';
import {CourseSection} from './course-section';

export type CourseSectionFileType = 'pdf';

export const CourseSectionFile = sqliteTable('CourseSectionFile', d => ({
  courseSectionMaterialId: d
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  courseSectionId: d
    .text()
    .notNull()
    .references(() => CourseSection.courseSectionId, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
  name: d.text().notNull(),
  blob: d.blob().notNull(),
  fileType: d.text().$type<CourseSectionFileType>(),
  fileSize: d.integer(),
  rag: d.text({mode: 'json'}),
}));
