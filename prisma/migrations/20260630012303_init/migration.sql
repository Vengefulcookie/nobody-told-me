-- CreateTable
CREATE TABLE "CareerCluster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CareerCluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerField" (
    "id" TEXT NOT NULL,
    "clusterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plainDescription" TEXT NOT NULL,
    "hookQuestion" TEXT NOT NULL,
    "timelineRange" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CareerField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerSpecialization" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'popular',
    "didYouKnow" TEXT,
    "confusedWith" TEXT,

    CONSTRAINT "CareerSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qualification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "qualificationType" TEXT NOT NULL,
    "nqfLevel" INTEGER NOT NULL,
    "durationYears" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "saqaId" TEXT,

    CONSTRAINT "Qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "website" TEXT,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionProgram" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "qualificationId" TEXT NOT NULL,
    "programUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastVerified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pathway" (
    "id" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,
    "qualificationId" TEXT NOT NULL,
    "pathwayType" TEXT NOT NULL,
    "isPrimaryPath" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,

    CONSTRAINT "Pathway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathwayStep" (
    "id" TEXT NOT NULL,
    "pathwayId" TEXT NOT NULL,
    "stepType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationYears" DOUBLE PRECISION,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PathwayStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "pathwayId" TEXT,
    "stepId" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "detail" TEXT,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "costType" TEXT,
    "costAmountMin" DOUBLE PRECISION,
    "costAmountMax" DOUBLE PRECISION,
    "costNote" TEXT,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequirementSource" (
    "id" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "verifiedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RequirementSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CareerCluster_slug_key" ON "CareerCluster"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CareerField_slug_key" ON "CareerField"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CareerSpecialization_slug_key" ON "CareerSpecialization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_slug_key" ON "Institution"("slug");

-- AddForeignKey
ALTER TABLE "CareerField" ADD CONSTRAINT "CareerField_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "CareerCluster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerSpecialization" ADD CONSTRAINT "CareerSpecialization_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "CareerField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionProgram" ADD CONSTRAINT "InstitutionProgram_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionProgram" ADD CONSTRAINT "InstitutionProgram_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pathway" ADD CONSTRAINT "Pathway_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "CareerSpecialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pathway" ADD CONSTRAINT "Pathway_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathwayStep" ADD CONSTRAINT "PathwayStep_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "Pathway"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "Pathway"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "PathwayStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementSource" ADD CONSTRAINT "RequirementSource_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
