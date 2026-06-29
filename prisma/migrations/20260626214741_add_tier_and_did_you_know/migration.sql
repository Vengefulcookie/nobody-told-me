-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CareerSpecialization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fieldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'popular',
    "didYouKnow" TEXT,
    "confusedWith" TEXT,
    CONSTRAINT "CareerSpecialization_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "CareerField" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CareerSpecialization" ("description", "fieldId", "id", "name", "slug") SELECT "description", "fieldId", "id", "name", "slug" FROM "CareerSpecialization";
DROP TABLE "CareerSpecialization";
ALTER TABLE "new_CareerSpecialization" RENAME TO "CareerSpecialization";
CREATE UNIQUE INDEX "CareerSpecialization_slug_key" ON "CareerSpecialization"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
