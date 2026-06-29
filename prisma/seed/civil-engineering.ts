import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.requirementSource.deleteMany()
  await prisma.requirement.deleteMany()
  await prisma.pathwayStep.deleteMany()
  await prisma.pathway.deleteMany()
  await prisma.institutionProgram.deleteMany()
  await prisma.institution.deleteMany()
  await prisma.qualification.deleteMany()
  await prisma.careerSpecialization.deleteMany()
  await prisma.careerField.deleteMany()
  await prisma.careerCluster.deleteMany()

  console.log('Cleared existing data')

  // ─── CLUSTER ───────────────────────
  const engineering = await prisma.careerCluster.create({
    data: {
      name: 'Engineering & Built Environment',
      slug: 'engineering-built-environment',
      description: 'Design, build, and maintain the physical infrastructure and systems around us.',
      order: 1,
    },
  })

  // ─── CAREER FIELD ─────────────────
  const civilEngineering = await prisma.careerField.create({
    data: {
      clusterId: engineering.id,
      name: 'Civil Engineering',
      slug: 'civil-engineering',
      plainDescription: `Civil engineers design, build, and maintain the infrastructure we use every day — bridges, roads, dams, water systems, and buildings.

THREE PROFESSIONAL LEVELS (you choose based on your marks, budget, and career goals):

| LEVEL | ROUTE | MARKS NEEDED | STUDY TIME | PROFESSIONAL TITLE |
|-------|-------|--------------|------------|-------------------|
| Engineer | University BEng | Maths 60%+, Science 60%+ | 4 years | PrEng |
| Technologist | UoT BEngTech | Maths 50%+, Science 50%+ | 3 years | PrTechEng |
| Technician | TVET N Diploma | Grade 9 or matric | 2 years | PrEngTechnician |

ALL THREE levels require additional post-qualification training and ECSA registration before you can practise independently.

Not sure which level fits you? The app will help you compare based on your current marks, timeline, and budget.`,
      hookQuestion: 'Do you like big construction projects and solving practical problems that shape the world around you?',
      timelineRange: '±6-8 years to professional registration',
      order: 1,
    },
  })

  // ─── SUB-SPECIALISATIONS ───────────
  const subSpecs = [
    { name: 'Structural Engineering', slug: 'structural-engineering', description: 'Design buildings, bridges, and towers to safely withstand forces and loads.' },
    { name: 'Geotechnical Engineering', slug: 'geotechnical-engineering', description: 'Analyse soil and rock behaviour to design foundations, tunnels, and earthworks.' },
    { name: 'Transportation Engineering', slug: 'transportation-engineering', description: 'Plan and design roads, railways, airports, and traffic management systems.' },
    { name: 'Water Engineering', slug: 'water-engineering', description: 'Design water supply networks, drainage, flood control, and wastewater treatment.' },
    { name: 'Environmental Engineering', slug: 'environmental-engineering', description: 'Solve environmental problems through sustainable engineering design.' },
    { name: 'Construction Management', slug: 'construction-management', description: 'Oversee construction projects: budgets, schedules, quality, and teams on site.' },
  ]

  for (const spec of subSpecs) {
    await prisma.careerSpecialization.create({
      data: { fieldId: civilEngineering.id, ...spec },
    })
  }

  console.log(`Created ${subSpecs.length} sub-specialisations`)

  // ─── QUALIFICATIONS ────────────────
  const beng = await prisma.qualification.create({
    data: {
      name: 'BEng Civil Engineering',
      qualificationType: 'DEGREE',
      nqfLevel: 8,
      durationYears: 4,
      description: 'Four-year professional engineering degree at a university. Leads to registration as Professional Engineer (PrEng) with ECSA.',
      saqaId: 'SAQA-ENG-BENG-CIVIL',
    },
  })

  const bengtech = await prisma.qualification.create({
    data: {
      name: 'BEngTech Civil Engineering',
      qualificationType: 'DEGREE',
      nqfLevel: 7,
      durationYears: 3,
      description: 'Three-year engineering technology degree at a University of Technology. Leads to registration as Professional Engineering Technologist (PrTechEng).',
      saqaId: 'SAQA-ENG-BENGTECH-CIVIL',
    },
  })

  const nDipCivil = await prisma.qualification.create({
    data: {
      name: 'National N Diploma: Civil Engineering',
      qualificationType: 'NATIONAL_N_DIPLOMA',
      nqfLevel: 6,
      durationYears: 2.5,
      description: 'Two years of theoretical study plus 18 months of workplace experience at a TVET college. Leads to registration as Professional Engineering Technician (PrEngTechnician) or can articulate to BEngTech.',
      saqaId: 'SAQA-ENG-NDIP-CIVIL',
    },
  })

  console.log('Created 3 qualifications')

  // ─── INSTITUTIONS ──────────────────
  const uct = await prisma.institution.create({
    data: { name: 'University of Cape Town', slug: 'uct', type: 'UNIVERSITY', province: 'WESTERN_CAPE', website: 'https://www.uct.ac.za' },
  })
  const wits = await prisma.institution.create({
    data: { name: 'University of the Witwatersrand', slug: 'wits', type: 'UNIVERSITY', province: 'GAUTENG', website: 'https://www.wits.ac.za' },
  })
  const up = await prisma.institution.create({
    data: { name: 'University of Pretoria', slug: 'up', type: 'UNIVERSITY', province: 'GAUTENG', website: 'https://www.up.ac.za' },
  })
  const stellenbosch = await prisma.institution.create({
    data: { name: 'Stellenbosch University', slug: 'stellenbosch', type: 'UNIVERSITY', province: 'WESTERN_CAPE', website: 'https://www.sun.ac.za' },
  })
  const ukzn = await prisma.institution.create({
    data: { name: 'University of KwaZulu-Natal', slug: 'ukzn', type: 'UNIVERSITY', province: 'KWAZULU_NATAL', website: 'https://www.ukzn.ac.za' },
  })
  const cput = await prisma.institution.create({
    data: { name: 'Cape Peninsula University of Technology', slug: 'cput', type: 'UNIVERSITY_OF_TECHNOLOGY', province: 'WESTERN_CAPE', website: 'https://www.cput.ac.za' },
  })
  const dut = await prisma.institution.create({
    data: { name: 'Durban University of Technology', slug: 'dut', type: 'UNIVERSITY_OF_TECHNOLOGY', province: 'KWAZULU_NATAL', website: 'https://www.dut.ac.za' },
  })
  const tut = await prisma.institution.create({
    data: { name: 'Tshwane University of Technology', slug: 'tut', type: 'UNIVERSITY_OF_TECHNOLOGY', province: 'GAUTENG', website: 'https://www.tut.ac.za' },
  })
  const falseBay = await prisma.institution.create({
    data: { name: 'False Bay TVET College', slug: 'false-bay-tvet', type: 'TVET_COLLEGE', province: 'WESTERN_CAPE', website: 'https://www.falsebaycollege.co.za' },
  })
  const ekurhuleni = await prisma.institution.create({
    data: { name: 'Ekurhuleni East TVET College', slug: 'ekurhuleni-east-tvet', type: 'TVET_COLLEGE', province: 'GAUTENG', website: 'https://www.eec.edu.za' },
  })

  // Institution Programs
  const uniList = [uct, wits, up, stellenbosch, ukzn]
  for (const inst of uniList) {
    await prisma.institutionProgram.create({ data: { institutionId: inst.id, qualificationId: beng.id, isActive: true } })
  }

  const uotList = [cput, dut, tut]
  for (const inst of uotList) {
    await prisma.institutionProgram.create({ data: { institutionId: inst.id, qualificationId: bengtech.id, isActive: true } })
  }

  const tvetList = [falseBay, ekurhuleni]
  for (const inst of tvetList) {
    await prisma.institutionProgram.create({ data: { institutionId: inst.id, qualificationId: nDipCivil.id, isActive: true } })
  }

  console.log('Created 10 institutions with programs')

  // Get the first specialisation to attach pathways to
  const structural = await prisma.careerSpecialization.findFirst({ where: { slug: 'structural-engineering' } })

  // ═════════════════════════════════════
  // PATHWAY 1: PrEng (University Route)
  // ═════════════════════════════════════
  const pathwayPrEng = await prisma.pathway.create({
    data: {
      specializationId: structural!.id,
      qualificationId: beng.id,
      pathwayType: 'STANDARD_DEGREE',
      isPrimaryPath: true,
      description: `PROFESSIONAL ENGINEER (PrEng) — THE UNIVERSITY ROUTE

This is the highest level of engineering registration in South Africa. With this qualification, you can:
• Sign off on major infrastructure designs (bridges, dams, high-rise buildings)
• Take full legal responsibility for engineering projects
• Work anywhere in the world (Washington Accord recognition)
• Earn the highest salaries in the field

BUT you need to know:
• This is a THEORETICAL degree — heavy on maths, physics, and calculations
• Entry requirements are high (60-70%+ in Maths and Science)
• TOTAL timeline: 4 years study + 3 years candidate work = ±7-8 years from matric to fully qualified
• You must find your own candidate position after graduation — the university does not place you
• If you don't register as a candidate after graduation, your degree alone does NOT allow you to practise independently

IS THIS AN ACADEMIC OR PROFESSIONAL QUALIFICATION?
The BEng degree itself is an ACADEMIC qualification (it says you studied engineering).
Professional registration (PrEng) is the PROFESSIONAL qualification (it says you can practise).
You need BOTH the degree AND the registration to work independently as an engineer.

WHAT IF YOU DON'T GET IN?
If your marks aren't high enough for a BEng, you have two options:
→ BEngTech at a University of Technology (lower requirements, still leads to professional registration as PrTechEng)
→ Start with a TVET diploma and bridge up later (longest route, but lowest entry barrier)`,
    },
  })

  const prEngStep1 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrEng.id, stepType: 'APPLICATION', title: 'Step 1: Meet entry requirements and apply', description: 'NSC with Bachelors pass. Mathematics ≥ 60% (some universities require 70%+). Physical Sciences ≥ 60% (some require 70%+). Apply during Grade 12 (March-September). Apply to multiple institutions — programmes are competitive.', order: 1 },
  })

  const prEngStep2 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrEng.id, stepType: 'STUDY_YEAR', title: 'Step 2: Complete BEng Civil Engineering (4 years)', description: 'Full-time university study. Covers structural analysis, geotechnical engineering, fluid mechanics, materials science, surveying, and design projects. Graduation gives you an academic qualification but does NOT allow you to practise independently.', durationYears: 4, order: 2 },
  })

  const prEngStep3 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrEng.id, stepType: 'CANDIDACY_PERIOD', title: 'Step 3: Register as Candidate Engineer and complete 3 years training', description: 'Register with ECSA as a Candidate Engineer (fee: ±R2,500). Complete 3 years of engineering work under supervision of a registered PrEng. You must find this position yourself — it is NOT automatically provided after graduation. Submit training reports to ECSA regularly. Most candidates earn a salary during this period.', durationYears: 3, order: 3 },
  })

  const prEngStep4 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrEng.id, stepType: 'PROFESSIONAL_REGISTRATION', title: 'Step 4: Pass Professional Review and register as PrEng', description: 'Submit final training reports to ECSA. Pass the Professional Review (interview and submission assessment). Review fee: ±R5,000. Upon passing, register as Professional Engineer (PrEng). Annual practising fee: ±R3,500.', order: 4 },
  })

  // Requirements for PrEng path
  await prisma.requirement.create({
    data: { stepId: prEngStep1.id, pathwayId: pathwayPrEng.id, type: 'ENTRY_REQUIREMENT', category: 'ACADEMIC', description: 'NSC with Bachelors pass', isMandatory: true, order: 1,
      sources: { create: { sourceName: 'DHET National Senior Certificate requirements', sourceType: 'DHET_REGISTRY', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prEngStep1.id, pathwayId: pathwayPrEng.id, type: 'ENTRY_REQUIREMENT', category: 'ACADEMIC', description: 'Mathematics Level 5 (60%+). Competitive programmes may require Level 6 (70%+)', isMandatory: true, order: 2,
      sources: { create: { sourceName: 'UCT & Wits 2026 Undergraduate Prospectuses', sourceType: 'INSTITUTION_WEBSITE', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prEngStep1.id, pathwayId: pathwayPrEng.id, type: 'ENTRY_REQUIREMENT', category: 'ACADEMIC', description: 'Physical Sciences Level 5 (60%+). Competitive programmes may require Level 6 (70%+)', isMandatory: true, order: 3,
      sources: { create: { sourceName: 'UCT & Wits 2026 Undergraduate Prospectuses', sourceType: 'INSTITUTION_WEBSITE', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prEngStep1.id, pathwayId: pathwayPrEng.id, type: 'ENTRY_REQUIREMENT', category: 'APPLICATION', description: 'Application fees: R100-R500 per institution', isMandatory: true, order: 4, costType: 'RANGE_INSTITUTION', costAmountMin: 100, costAmountMax: 500, costNote: 'Fee waivers may be available for qualifying applicants.',
      sources: { create: { sourceName: 'University admissions pages 2026', sourceType: 'INSTITUTION_WEBSITE', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prEngStep2.id, pathwayId: pathwayPrEng.id, type: 'QUALIFICATION_REQUIREMENT', category: 'FINANCIAL', description: 'Tuition: R40,000-R65,000 per year', isMandatory: true, order: 1, costType: 'RANGE_INSTITUTION', costAmountMin: 40000, costAmountMax: 65000, costNote: 'Range across SA universities. Bursaries and NSFAS may cover costs.',
      sources: { create: { sourceName: 'University fee schedules 2026', sourceType: 'INSTITUTION_WEBSITE', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prEngStep2.id, pathwayId: pathwayPrEng.id, type: 'QUALIFICATION_REQUIREMENT', category: 'FINANCIAL', description: 'Textbooks and materials: ±R5,000-R10,000 per year', isMandatory: true, order: 2, costType: 'LIKELY_ADDITIONAL', costAmountMin: 5000, costAmountMax: 10000, costNote: 'Estimate only. Varies by year and modules.' },
  })
  await prisma.requirement.create({
    data: { stepId: prEngStep2.id, pathwayId: pathwayPrEng.id, type: 'QUALIFICATION_REQUIREMENT', category: 'FINANCIAL', description: 'Accommodation and living expenses: R25,000-R60,000 per year (highly variable by city and lifestyle)', isMandatory: true, order: 3, costType: 'HIGHLY_VARIABLE', costAmountMin: 25000, costAmountMax: 60000, costNote: 'UCT estimates approximately R50,000-R85,000/year for living expenses in Cape Town.' },
  })
  await prisma.requirement.create({
    data: { stepId: prEngStep3.id, pathwayId: pathwayPrEng.id, type: 'POST_QUALIFICATION', category: 'REGISTRATION', description: 'Register as Candidate Engineer with ECSA. Registration fee: ±R2,500. Annual candidate fee: ±R1,200/year.', isMandatory: true, order: 1, costType: 'STANDARDISED_FEE', costAmountMin: 2500,
      sources: { create: { sourceName: 'ECSA Fee Schedule 2026', sourceType: 'PROFESSIONAL_BODY', sourceUrl: 'https://www.ecsa.co.za', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prEngStep3.id, pathwayId: pathwayPrEng.id, type: 'POST_QUALIFICATION', category: 'WORKPLACE_TRAINING', description: 'Complete 3 years of engineering work under supervision of a registered PrEng. You must find this position yourself. Submit training reports to ECSA.', isMandatory: true, order: 2,
      sources: { create: { sourceName: 'Engineering Profession Act 46 of 2000', sourceType: 'GOVERNMENT_GAZETTE', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prEngStep4.id, pathwayId: pathwayPrEng.id, type: 'POST_QUALIFICATION', category: 'BOARD_EXAM', description: 'Pass ECSA Professional Review. Review fee: ±R5,000.', isMandatory: true, order: 1, costType: 'STANDARDISED_FEE', costAmountMin: 5000,
      sources: { create: { sourceName: 'ECSA Fee Schedule 2026', sourceType: 'PROFESSIONAL_BODY', sourceUrl: 'https://www.ecsa.co.za', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prEngStep4.id, pathwayId: pathwayPrEng.id, type: 'POST_QUALIFICATION', category: 'CONTINUING_DEVELOPMENT', description: 'Optional: Specialise in Structural, Geotechnical, Transportation, or Water Engineering through experience and short courses.', isMandatory: false, order: 2, costType: 'UNKNOWN', costNote: 'Costs vary widely by specialisation.' },
  })

  console.log('Created Pathway 1: PrEng (University Route)')

  // ═════════════════════════════════════
  // PATHWAY 2: PrTechEng (UoT Route)
  // ═════════════════════════════════════
  const pathwayPrTechEng = await prisma.pathway.create({
    data: {
      specializationId: structural!.id,
      qualificationId: bengtech.id,
      pathwayType: 'DIPLOMA_ROUTE',
      isPrimaryPath: true,
      description: `PROFESSIONAL ENGINEERING TECHNOLOGIST (PrTechEng) — THE UoT ROUTE

This is a professional engineering registration focused on APPLIED engineering. You work alongside PrEng engineers but with a more practical, hands-on approach. With this qualification, you can:
• Design and implement engineering solutions (with a PrEng signing off on major structures)
• Manage construction sites and technical teams
• Specialise in specific technical areas
• Earn competitive professional salaries (typically 10-20% less than PrEng at senior levels)

WHY CHOOSE THIS OVER A UNIVERSITY DEGREE?
• Lower entry requirements (50%+ in Maths and Science vs 60-70%+)
• Shorter study time (3 years vs 4)
• Lower tuition costs
• More practical, project-based learning — less theoretical maths
• Faster path to earning: 3 years study + 3 years candidacy = ±6 years vs ±7-8

IS THIS AN ACADEMIC OR PROFESSIONAL QUALIFICATION?
The BEngTech degree is an ACADEMIC qualification (NQF Level 7).
Professional registration (PrTechEng) is the PROFESSIONAL qualification.
Both are required to practise independently at this level.

WHAT'S THE DIFFERENCE BETWEEN PrEng AND PrTechEng IN THE REAL WORLD?
• A PrEng can sign off on ANY civil engineering project
• A PrTechEng can do most engineering work but major public infrastructure (large bridges, dams over a certain size) requires a PrEng sign-off
• In practice, PrTechEng and PrEng often work side by side on the same projects
• A PrTechEng can later upgrade to PrEng through further study and assessment

CAREER-CHANGER NOTE:
If you already have a diploma or work experience in construction, you may qualify for credit exemptions, shortening the study time. Part-time study may be available at some UoTs.`,
    },
  })

  const prTechEngStep1 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrTechEng.id, stepType: 'APPLICATION', title: 'Step 1: Meet entry requirements and apply', description: 'NSC with Diploma pass or higher. Mathematics ≥ 50%. Physical Sciences ≥ 50%. Lower entry requirements than BEng. Apply to multiple UoTs.', order: 1 },
  })

  const prTechEngStep2 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrTechEng.id, stepType: 'STUDY_YEAR', title: 'Step 2: Complete BEngTech Civil Engineering (3 years)', description: 'Three-year degree with practical and applied focus. Includes industry-based projects and workplace exposure. Graduation gives you an academic qualification but does NOT allow independent practice.', durationYears: 3, order: 2 },
  })

  const prTechEngStep3 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrTechEng.id, stepType: 'CANDIDACY_PERIOD', title: 'Step 3: Register as Candidate Engineering Technologist and complete 3 years training', description: 'Register with ECSA as Candidate Engineering Technologist. Complete 3 years of work under supervision of a registered professional. Submit training reports to ECSA.', durationYears: 3, order: 3 },
  })

  const prTechEngStep4 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrTechEng.id, stepType: 'PROFESSIONAL_REGISTRATION', title: 'Step 4: Pass Professional Review and register as PrTechEng', description: 'Submit final reports and pass ECSA Professional Review. Register as Professional Engineering Technologist (PrTechEng).', order: 4 },
  })

  await prisma.requirement.create({
    data: { stepId: prTechEngStep1.id, pathwayId: pathwayPrTechEng.id, type: 'ENTRY_REQUIREMENT', category: 'ACADEMIC', description: 'NSC with Diploma pass or higher', isMandatory: true, order: 1,
      sources: { create: { sourceName: 'CPUT 2026 Prospectus', sourceType: 'INSTITUTION_WEBSITE', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prTechEngStep1.id, pathwayId: pathwayPrTechEng.id, type: 'ENTRY_REQUIREMENT', category: 'ACADEMIC', description: 'Mathematics ≥ 50%', isMandatory: true, order: 2,
      sources: { create: { sourceName: 'CPUT 2026 Prospectus', sourceType: 'INSTITUTION_WEBSITE', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prTechEngStep1.id, pathwayId: pathwayPrTechEng.id, type: 'ENTRY_REQUIREMENT', category: 'ACADEMIC', description: 'Physical Sciences ≥ 50%', isMandatory: true, order: 3,
      sources: { create: { sourceName: 'CPUT 2026 Prospectus', sourceType: 'INSTITUTION_WEBSITE', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prTechEngStep2.id, pathwayId: pathwayPrTechEng.id, type: 'QUALIFICATION_REQUIREMENT', category: 'FINANCIAL', description: 'Tuition: R30,000-R45,000 per year', isMandatory: true, order: 1, costType: 'RANGE_INSTITUTION', costAmountMin: 30000, costAmountMax: 45000,
      sources: { create: { sourceName: 'UoT fee schedules 2026', sourceType: 'INSTITUTION_WEBSITE', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prTechEngStep3.id, pathwayId: pathwayPrTechEng.id, type: 'POST_QUALIFICATION', category: 'REGISTRATION', description: 'Register as Candidate Engineering Technologist with ECSA. Fees similar to Candidate Engineer path.', isMandatory: true, order: 1, costType: 'STANDARDISED_FEE', costAmountMin: 2500,
      sources: { create: { sourceName: 'ECSA Fee Schedule 2026', sourceType: 'PROFESSIONAL_BODY', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prTechEngStep4.id, pathwayId: pathwayPrTechEng.id, type: 'POST_QUALIFICATION', category: 'BOARD_EXAM', description: 'Pass ECSA Professional Review for Engineering Technologists.', isMandatory: true, order: 1, costType: 'STANDARDISED_FEE', costAmountMin: 5000,
      sources: { create: { sourceName: 'ECSA Fee Schedule 2026', sourceType: 'PROFESSIONAL_BODY', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })

  console.log('Created Pathway 2: PrTechEng (UoT Route)')

  // ═════════════════════════════════════
  // PATHWAY 3: PrEngTechnician (TVET Route)
  // ═════════════════════════════════════
  const pathwayPrTechnician = await prisma.pathway.create({
    data: {
      specializationId: structural!.id,
      qualificationId: nDipCivil.id,
      pathwayType: 'VOCATIONAL_ROUTE',
      isPrimaryPath: true,
      description: `PROFESSIONAL ENGINEERING TECHNICIAN (PrEngTechnician) — THE TVET ROUTE

This is the most accessible entry point into civil engineering. Technicians do the hands-on technical work that keeps projects running. With this qualification, you can:
• Conduct site tests and surveys
• Prepare technical drawings and specifications
• Supervise construction teams on site
• Inspect materials and workmanship
• Work as a bridge between labour teams and professional engineers

WHY CHOOSE THIS ROUTE?
• LOWEST entry barrier — Grade 9 or matric, no strict Maths/Science requirements
• Lowest study costs (TVET colleges are significantly cheaper than universities)
• Quickest path to earning: you can start working sooner
• Practical skills that are always in demand on construction sites
• You can bridge up to PrTechEng later if you want to advance

IS THIS AN ACADEMIC OR PROFESSIONAL QUALIFICATION?
The National N Diploma is a VOCATIONAL qualification (NQF Level 6) — it's a diploma, not a degree.
Professional registration (PrEngTechnician) is the PROFESSIONAL qualification.
In South Africa, a "diploma" is NOT the same as a "degree" — they're different qualification types with different career ceilings.

WHAT'S THE DIFFERENCE BETWEEN A TECHNICIAN AND A TECHNOLOGIST/ENGINEER?
• Technician: Does the hands-on testing, measuring, and supervising
• Technologist: Designs the technical solutions and manages implementation
• Engineer: Takes overall responsibility and signs off on safety and compliance

REALITY CHECK — WHAT THIS PATH DOES AND DOESN'T DO:
✓ You CAN get employed as a civil engineering technician
✓ You CAN earn a decent professional salary
✓ You CAN bridge to PrTechEng with additional study
✗ You CANNOT sign off on engineering designs without further qualifications
✗ The career ceiling is lower without bridging — you'll hit a limit on how far you can advance

THE BRIDGE OPTION:
After completing your N Diploma and registering as PrEngTechnician, you can enrol for a BEngTech at a UoT (typically 2 additional years of study). This allows you to register as PrTechEng later. Total timeline via this route: ±8-9 years, but you're earning for much of it.`,
    },
  })

  const prTechStep1 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrTechnician.id, stepType: 'APPLICATION', title: 'Step 1: Enrol at a TVET College', description: 'Entry requirement: Grade 9 or NSC (any pass level). Mathematics preferred but not always required. This is the most accessible entry point into civil engineering.', order: 1 },
  })

  const prTechStep2 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrTechnician.id, stepType: 'STUDY_YEAR', title: 'Step 2: Complete N1-N6 + 18 months workplace experience', description: 'N1-N6 theoretical studies (2 years full-time or 3 years part-time) plus 18 months of relevant workplace experience to qualify for the National N Diploma.', durationYears: 3.5, order: 2 },
  })

  const prTechStep3 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrTechnician.id, stepType: 'CANDIDACY_PERIOD', title: 'Step 3: Register as Candidate Engineering Technician and complete 3 years training', description: 'Register with ECSA as Candidate Engineering Technician. Complete 3 years of work experience under supervision. Submit training reports.', durationYears: 3, order: 3 },
  })

  const prTechStep4 = await prisma.pathwayStep.create({
    data: { pathwayId: pathwayPrTechnician.id, stepType: 'PROFESSIONAL_REGISTRATION', title: 'Step 4: Pass Professional Review and register as PrEngTechnician', description: 'Submit final reports and pass ECSA review. Register as Professional Engineering Technician (PrEngTechnician).', order: 4 },
  })

  await prisma.requirement.create({
    data: { stepId: prTechStep1.id, pathwayId: pathwayPrTechnician.id, type: 'ENTRY_REQUIREMENT', category: 'ACADEMIC', description: 'Grade 9 certificate minimum, or NSC (any pass level). No strict Maths or Science requirement, though Mathematics is recommended.', isMandatory: true, order: 1,
      sources: { create: { sourceName: 'DHET TVET College Admission Guidelines', sourceType: 'DHET_REGISTRY', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prTechStep2.id, pathwayId: pathwayPrTechnician.id, type: 'QUALIFICATION_REQUIREMENT', category: 'FINANCIAL', description: 'Tuition: R10,000-R25,000 per year', isMandatory: true, order: 1, costType: 'RANGE_INSTITUTION', costAmountMin: 10000, costAmountMax: 25000,
      sources: { create: { sourceName: 'TVET College fee schedules 2026', sourceType: 'INSTITUTION_WEBSITE', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prTechStep2.id, pathwayId: pathwayPrTechnician.id, type: 'QUALIFICATION_REQUIREMENT', category: 'WORKPLACE_TRAINING', description: '18 months of workplace experience required to complete the National N Diploma. You must find placement yourself.', isMandatory: true, order: 2 },
  })
  await prisma.requirement.create({
    data: { stepId: prTechStep3.id, pathwayId: pathwayPrTechnician.id, type: 'POST_QUALIFICATION', category: 'REGISTRATION', description: 'Register as Candidate Engineering Technician with ECSA.', isMandatory: true, order: 1, costType: 'STANDARDISED_FEE', costAmountMin: 2500,
      sources: { create: { sourceName: 'ECSA Fee Schedule 2026', sourceType: 'PROFESSIONAL_BODY', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  await prisma.requirement.create({
    data: { stepId: prTechStep4.id, pathwayId: pathwayPrTechnician.id, type: 'POST_QUALIFICATION', category: 'BOARD_EXAM', description: 'Pass ECSA Professional Review for Engineering Technicians.', isMandatory: true, order: 1, costType: 'STANDARDISED_FEE', costAmountMin: 5000,
      sources: { create: { sourceName: 'ECSA Fee Schedule 2026', sourceType: 'PROFESSIONAL_BODY', verifiedDate: new Date('2026-03-01'), isPreferred: true } } },
  })
  // Optional bridge
  await prisma.requirement.create({
    data: { stepId: prTechStep4.id, pathwayId: pathwayPrTechnician.id, type: 'POST_QUALIFICATION', category: 'CONTINUING_DEVELOPMENT', description: 'Optional: Articulate from N Diploma to BEngTech (additional 2 years at a UoT). Then register as PrTechEng for higher professional standing.', isMandatory: false, order: 2, costType: 'RANGE_INSTITUTION', costAmountMin: 30000, costAmountMax: 45000, costNote: 'Cost is for the additional study period at UoT rates.' },
  })

  console.log('Created Pathway 3: PrEngTechnician (TVET Route)')
  console.log('')
  console.log('✅ Seed complete! Civil Engineering with all 3 professional routes is ready.')
  console.log('   - Pathway 1: PrEng (University - 4yr degree + 3yr candidacy)')
  console.log('   - Pathway 2: PrTechEng (UoT - 3yr degree + 3yr candidacy)')
  console.log('   - Pathway 3: PrEngTechnician (TVET - 2yr study + 18mo workplace + 3yr candidacy)')
  console.log('   All pathways include plain-language descriptions explaining degree vs diploma,')
  console.log('   career ceilings, bridge options, and what you can actually do at each level.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })