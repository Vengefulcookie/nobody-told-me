-- CreateTable
CREATE TABLE "CareerCluster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "CareerField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clusterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plainDescription" TEXT NOT NULL,
    "hookQuestion" TEXT NOT NULL,
    "timelineRange" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CareerField_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "CareerCluster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CareerSpecialization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fieldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "CareerSpecialization_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "CareerField" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Qualification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "qualificationType" TEXT NOT NULL,
    "nqfLevel" INTEGER NOT NULL,
    "durationYears" REAL NOT NULL,
    "description" TEXT,
    "saqaId" TEXT
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "website" TEXT
);

-- CreateTable
CREATE TABLE "InstitutionProgram" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institutionId" TEXT NOT NULL,
    "qualificationId" TEXT NOT NULL,
    "programUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastVerified" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InstitutionProgram_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InstitutionProgram_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pathway" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "specializationId" TEXT NOT NULL,
    "qualificationId" TEXT NOT NULL,
    "pathwayType" TEXT NOT NULL,
    "isPrimaryPath" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    CONSTRAINT "Pathway_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "CareerSpecialization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pathway_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PathwayStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pathwayId" TEXT NOT NULL,
    "stepType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationYears" REAL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "PathwayStep_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "Pathway" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pathwayId" TEXT,
    "stepId" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "detail" TEXT,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "costType" TEXT,
    "costAmountMin" REAL,
    "costAmountMax" REAL,
    "costNote" TEXT,
    CONSTRAINT "Requirement_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "Pathway" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Requirement_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "PathwayStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RequirementSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requirementId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "verifiedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "RequirementSource_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CareerCluster_slug_key" ON "CareerCluster"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CareerField_slug_key" ON "CareerField"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CareerSpecialization_slug_key" ON "CareerSpecialization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_slug_key" ON "Institution"("slug");
