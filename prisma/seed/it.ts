import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding IT & Software Development career data...')

  // ─── CLEAN EXISTING IT DATA ───────────────────────────────────────────────
  // Only deletes the IT cluster and related data, not civil engineering
  const existingCluster = await prisma.careerCluster.findUnique({
    where: { slug: 'information-technology' }
  })
  if (existingCluster) {
    console.log('Removing existing IT cluster data...')
    const fields = await prisma.careerField.findMany({
      where: { clusterId: existingCluster.id },
      include: { specializations: { include: { pathways: { include: { steps: { include: { requirements: { include: { sources: true } } } }, requirements: { include: { sources: true } } } } } } }
    })
    for (const field of fields) {
      for (const spec of field.specializations) {
        for (const pathway of spec.pathways) {
          for (const step of pathway.steps) {
            for (const req of step.requirements) {
              await prisma.requirementSource.deleteMany({ where: { requirementId: req.id } })
            }
            await prisma.requirement.deleteMany({ where: { stepId: step.id } })
          }
          await prisma.pathwayStep.deleteMany({ where: { pathwayId: pathway.id } })
          for (const req of pathway.requirements) {
            await prisma.requirementSource.deleteMany({ where: { requirementId: req.id } })
          }
          await prisma.requirement.deleteMany({ where: { pathwayId: pathway.id } })
        }
        await prisma.pathway.deleteMany({ where: { specializationId: spec.id } })
      }
      await prisma.careerSpecialization.deleteMany({ where: { fieldId: field.id } })
    }
    await prisma.careerField.deleteMany({ where: { clusterId: existingCluster.id } })
    await prisma.careerCluster.delete({ where: { id: existingCluster.id } })
  }

  // ─── CLUSTER ──────────────────────────────────────────────────────────────
  const cluster = await prisma.careerCluster.create({
    data: {
      name: 'Information Technology & Computing',
      slug: 'information-technology',
      description: 'Build software, protect systems, analyse data, and shape the digital world. IT careers span every industry in South Africa and globally.',
          }
  })

  // ─── CAREER FIELD ─────────────────────────────────────────────────────────
  const itField = await prisma.careerField.create({
    data: {
      clusterId: cluster.id,
      name: 'Information Technology',
      slug: 'information-technology-careers',
      plainDescription: `Information Technology is one of the most diverse career fields in the world. At school, IT is usually presented as a single subject — but in reality, it branches into dozens of distinct careers, each with its own skills, qualifications, and daily work.\n\nThis field covers everyone from the developer writing the code that powers an app, to the analyst making sense of business data, to the engineer keeping systems secure and running. Some IT careers are well-known; others are in high demand but rarely talked about in schools.\n\nIn South Africa, IT skills are needed in banking, healthcare, government, retail, mining, and education — making it one of the most employment-friendly fields you can enter.\n\nYou do not need to be a genius at mathematics to work in IT. Different specialisations have different requirements — some need strong maths, others need creativity, communication skills, or logical thinking.`,
      hookQuestion: 'Do you like solving problems, building things, or figuring out how technology works?',
      timelineRange: '3-4 years to first job (degree route) or 1-3 years (diploma/certificate route)',
          }
  })

  // ─── SPECIALISATIONS ──────────────────────────────────────────────────────

  // TIER 1 — Popular (what schools mention)
  const softwareDev = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'Software Developer',
      slug: 'software-developer',
      description: 'Write, test, and maintain the code that makes apps, websites, and systems work.',
      tier: 'popular',
      didYouKnow: 'Software Developer and Software Engineer are often used interchangeably — but they are slightly different. A Software Developer typically focuses on writing code for specific applications or features. A Software Engineer takes a broader systems-thinking approach, designing how large, complex software systems are architected and built. In South Africa, most job listings use both titles for similar roles. As you grow in your career, the distinction matters more.',
      confusedWith: 'software-engineer',
          }
  })

  const softwareEng = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'Software Engineer',
      slug: 'software-engineer',
      description: 'Design and architect complex software systems, thinking about how all the parts work together at scale.',
      tier: 'popular',
      didYouKnow: 'Software Engineer and Software Developer are often confused. The key difference: Software Developers build features and applications. Software Engineers design the systems and architecture that those applications run on. Think of it like this — the developer builds the rooms; the engineer designs the whole building. In practice, many South African companies use both titles for the same role, especially at junior level. The distinction becomes clearer as you progress in your career.',
      confusedWith: 'software-developer',
          }
  })

  const itTechnician = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'IT Technician / Systems Administrator',
      slug: 'it-technician-systems-admin',
      description: 'Keep computers, networks, and systems running — the people organisations call when technology breaks.',
      tier: 'popular',
      didYouKnow: null,
      confusedWith: null,
          }
  })

  const networkEng = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'Network Engineer',
      slug: 'network-engineer',
      description: 'Design and manage the cables, routers, and systems that connect computers and allow them to communicate.',
      tier: 'popular',
      didYouKnow: null,
      confusedWith: null,
          }
  })

  // TIER 2 — Popular but unexplained at school
  const dataAnalyst = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'Data Analyst',
      slug: 'data-analyst',
      description: 'Turn raw numbers and data into insights that help organisations make better decisions.',
      tier: 'popular',
      didYouKnow: 'Data Analyst and Data Scientist sound similar but differ significantly. A Data Analyst works with existing data — cleaning it, visualising it, and reporting on it using tools like Excel, SQL, and Power BI. A Data Scientist builds predictive models and uses machine learning to find patterns in data. Data Analyst roles are more common at entry level in South Africa and require less advanced mathematics than Data Science.',
      confusedWith: 'data-scientist',
          }
  })

  const webDev = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'Web Developer',
      slug: 'web-developer',
      description: 'Build websites and web applications — everything you see and use in a browser is built by web developers.',
      tier: 'popular',
      didYouKnow: 'Web Developer and Software Developer overlap significantly, but Web Developers specialise specifically in browser-based applications — the things you access through Chrome, Safari, or Firefox. Software Developers work on a broader range of software including desktop apps, mobile apps, and backend systems. Many web developers also call themselves software developers as their skills grow.',
      confusedWith: 'software-developer',
          }
  })

  const uiuxDesigner = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'UI/UX Designer',
      slug: 'ui-ux-designer',
      description: 'Design how apps and websites look and feel — making technology easy, beautiful, and intuitive to use.',
      tier: 'popular',
      didYouKnow: 'UI and UX are two different things that are often combined in one job title. UI (User Interface) design is about how something looks — the colours, buttons, typography, and layout. UX (User Experience) design is about how something works — the flow, the logic, and how easy it is to use. Many designers do both, but larger companies often hire separately for each role.',
      confusedWith: null,
          }
  })

  const businessAnalyst = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'Business Analyst (IT)',
      slug: 'business-analyst-it',
      description: 'Bridge the gap between business problems and technology solutions — translating what a business needs into what developers build.',
      tier: 'popular',
      didYouKnow: 'A Business Analyst in IT is different from a financial or management business analyst. IT Business Analysts work specifically on technology projects — they gather requirements from business stakeholders, document what a system needs to do, and communicate this to developers. They do not write code, but they need to understand technology well enough to translate between business and technical teams.',
      confusedWith: 'data-analyst',
          }
  })

  // TIER 3 — Emerging / taking over the market
  const aiMlEng = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'AI / Machine Learning Engineer',
      slug: 'ai-ml-engineer',
      description: 'Build systems that learn from data and make predictions — the people behind chatbots, recommendation engines, and intelligent automation.',
      tier: 'emerging',
      didYouKnow: 'AI Engineer and Data Scientist overlap but differ in focus. Data Scientists discover insights and build models. AI/ML Engineers take those models and deploy them into real products that millions of people use. AI Engineering is one of the fastest-growing and highest-paid fields in global tech right now.',
      confusedWith: 'data-analyst',
          }
  })

  const cloudEng = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'Cloud Engineer',
      slug: 'cloud-engineer',
      description: 'Build and manage the infrastructure that runs modern software — servers, storage, and networking in the cloud (AWS, Azure, Google Cloud).',
      tier: 'emerging',
      didYouKnow: null,
      confusedWith: 'devops-engineer',
          }
  })

  const cybersecurity = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'Cybersecurity Analyst',
      slug: 'cybersecurity-analyst',
      description: 'Protect organisations from hackers, data breaches, and cyber attacks — one of the most in-demand IT careers globally.',
      tier: 'emerging',
      didYouKnow: null,
      confusedWith: null,
          }
  })

  const devops = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'DevOps Engineer',
      slug: 'devops-engineer',
      description: 'Automate and streamline how software is built, tested, and deployed — bridging the gap between development and operations teams.',
      tier: 'emerging',
      didYouKnow: 'DevOps is one of the least understood IT careers at school level because it did not exist as a distinct role until relatively recently. DevOps Engineers combine software development skills with systems operations knowledge. They build the pipelines that automatically test, build, and deploy code — meaning developers can ship software faster and more reliably. The role requires understanding both coding and infrastructure.',
      confusedWith: 'cloud-engineer',
          }
  })

  const dataSci = await prisma.careerSpecialization.create({
    data: {
      fieldId: itField.id,
      name: 'Data Scientist',
      slug: 'data-scientist',
      description: 'Use advanced mathematics and machine learning to find patterns in large datasets and build predictive models.',
      tier: 'emerging',
      didYouKnow: 'Data Scientist roles typically require stronger mathematics than Data Analyst roles — including statistics, linear algebra, and calculus. In South Africa, Data Scientist is still an emerging title and many organisations use Data Analyst and Data Scientist interchangeably at junior level. If you love mathematics and want to work with AI, Data Science is the path.',
      confusedWith: 'data-analyst',
          }
  })

  console.log('Specialisations created.')

  // ─── QUALIFICATIONS ───────────────────────────────────────────────────────

  const bscCS = await prisma.qualification.create({
    data: {
      name: 'BSc Computer Science',
      qualificationType: 'DEGREE',
      nqfLevel: 7,
      durationYears: 3,
      description: 'A three-year bachelor\'s degree covering the theoretical and applied foundations of computer science. Offered at traditional universities. Can be followed by an Honours year (NQF 8) for specialisation.',
      saqaId: null,
    }
  })

  const bscIT = await prisma.qualification.create({
    data: {
      name: 'BSc Information Technology',
      qualificationType: 'DEGREE',
      nqfLevel: 7,
      durationYears: 3,
      description: 'A three-year bachelor\'s degree with a more applied focus than BSc Computer Science. Covers software development, databases, networking, and systems. Offered at traditional universities.',
      saqaId: null,
    }
  })

  const dipICT = await prisma.qualification.create({
    data: {
      name: 'Diploma in ICT: Applications Development',
      qualificationType: 'DIPLOMA',
      nqfLevel: 6,
      durationYears: 3,
      description: 'A three-year diploma offered at Universities of Technology (UoTs). More applied and practical than a university degree. Leads directly to junior developer roles. Offered at DUT, CPUT, TUT, CUT, VUT, MUT.',
      saqaId: null,
    }
  })

  const advDipICT = await prisma.qualification.create({
    data: {
      name: 'Advanced Diploma in ICT',
      qualificationType: 'ADVANCED_DIPLOMA',
      nqfLevel: 7,
      durationYears: 1,
      description: 'A one-year advanced diploma that can be completed after the Diploma in ICT. Brings you to the same NQF level as a university degree and allows progression to Honours.',
      saqaId: null,
    }
  })

  const bscHonsCS = await prisma.qualification.create({
    data: {
      name: 'BSc Honours in Computer Science',
      qualificationType: 'DEGREE',
      nqfLevel: 8,
      durationYears: 1,
      description: 'A one-year honours degree completed after BSc Computer Science or BSc IT. Required for postgraduate study and strongly recommended for senior software engineering, data science, and AI roles.',
      saqaId: null,
    }
  })

  console.log('Qualifications created.')

  // ─── INSTITUTIONS ─────────────────────────────────────────────────────────

  const ukzn = await prisma.institution.upsert({
      where: { slug: 'ukzn' },
      update: {},
      create: {
      name: 'University of KwaZulu-Natal',
      slug: 'ukzn',
      type: 'UNIVERSITY',
      province: 'KWAZULU_NATAL',
      website: 'https://www.ukzn.ac.za',
    }
  })

  const wits = await prisma.institution.upsert({
      where: { slug: 'wits' },
      update: {},
      create: {
      name: 'University of the Witwatersrand',
      slug: 'wits',
      type: 'UNIVERSITY',
      province: 'GAUTENG',
      website: 'https://www.wits.ac.za',
    }
  })

  const uct = await prisma.institution.upsert({
      where: { slug: 'uct' },
      update: {},
      create: {
      name: 'University of Cape Town',
      slug: 'uct',
      type: 'UNIVERSITY',
      province: 'WESTERN_CAPE',
      website: 'https://www.uct.ac.za',
    }
  })

  const up = await prisma.institution.upsert({
      where: { slug: 'up' },
      update: {},
      create: {
      name: 'University of Pretoria',
      slug: 'up',
      type: 'UNIVERSITY',
      province: 'GAUTENG',
      website: 'https://www.up.ac.za',
    }
  })

  const unisa = await prisma.institution.upsert({
      where: { slug: 'unisa' },
      update: {},
      create: {
      name: 'University of South Africa (UNISA)',
      slug: 'unisa',
      type: 'UNIVERSITY',
      province: 'GAUTENG',
      website: 'https://www.unisa.ac.za',
    }
  })

  const dut = await prisma.institution.upsert({
      where: { slug: 'dut' },
      update: {},
      create: {
      name: 'Durban University of Technology',
      slug: 'dut',
      type: 'UNIVERSITY_OF_TECHNOLOGY',
      province: 'KWAZULU_NATAL',
      website: 'https://www.dut.ac.za',
    }
  })

  const cput = await prisma.institution.upsert({
       where: { slug: 'cput' },
       update: {},
       create: {
      name: 'Cape Peninsula University of Technology',
      slug: 'cput',
      type: 'UNIVERSITY_OF_TECHNOLOGY',
      province: 'WESTERN_CAPE',
      website: 'https://www.cput.ac.za',
    }
  })

  const tut = await prisma.institution.upsert({
       where: { slug: 'tut' },
       update: {},
       create: {
      name: 'Tshwane University of Technology',
      slug: 'tut',
      type: 'UNIVERSITY_OF_TECHNOLOGY',
      province: 'GAUTENG',
      website: 'https://www.tut.ac.za',
    }
  })

  console.log('Institutions created.')

  // Link institutions to qualifications
  await prisma.institutionProgram.createMany({
    data: [
      { institutionId: ukzn.id, qualificationId: bscCS.id, isActive: true, programUrl: 'https://wp-smscs.ukzn.ac.za/computer-science/' },
      { institutionId: wits.id, qualificationId: bscCS.id, isActive: true, programUrl: 'https://www.wits.ac.za/course-finder/undergraduate/science/bsc/' },
      { institutionId: uct.id, qualificationId: bscCS.id, isActive: true, programUrl: 'https://sit.uct.ac.za/bsc-degrees' },
      { institutionId: up.id, qualificationId: bscCS.id, isActive: true, programUrl: 'https://www.up.ac.za' },
      { institutionId: unisa.id, qualificationId: bscIT.id, isActive: true, programUrl: 'https://www.unisa.ac.za' },
      { institutionId: dut.id, qualificationId: dipICT.id, isActive: true, programUrl: 'https://www.dut.ac.za/wp-content/uploads/career_leaflets/FAI%20ICT%20DBN.pdf' },
      { institutionId: cput.id, qualificationId: dipICT.id, isActive: true, programUrl: 'https://prospectus.cput.ac.za/index.php/course-details?q=DPICTA&f=220' },
      { institutionId: tut.id, qualificationId: dipICT.id, isActive: true, programUrl: 'https://www.tut.ac.za/media/tshwane-interim/site-content/images/prospectus/Part6_ICT_Prospectus.pdf' },
      { institutionId: wits.id, qualificationId: bscHonsCS.id, isActive: true, programUrl: 'https://www.wits.ac.za/course-finder/postgraduate/science/computer-science/' },
      { institutionId: uct.id, qualificationId: bscHonsCS.id, isActive: true, programUrl: 'https://sit.uct.ac.za/honours-computer-science' },
    ]
  })

  console.log('Institution programs linked.')

  // ─── PATHWAYS FOR SOFTWARE DEVELOPER ─────────────────────────────────────
  // Pathway 1: University degree route (BSc CS)

  const swDevDegreePathway = await prisma.pathway.create({
    data: {
      specializationId: softwareDev.id,
      qualificationId: bscCS.id,
      pathwayType: 'STANDARD_DEGREE',
      isPrimaryPath: true,
      description: 'The traditional university route. Three years of BSc Computer Science at a university, followed by an optional Honours year. Leads to mid-to-senior developer roles and opens doors to postgraduate study in AI, data science, or research.',
    }
  })

  // Steps for university route
  const swDevStep1 = await prisma.pathwayStep.create({
    data: {
      pathwayId: swDevDegreePathway.id,
      stepType: 'APPLICATION',
      title: 'Step 1: Meet entry requirements and apply',
      description: 'Apply to a South African university offering BSc Computer Science. Applications usually open between March and September for the following year. Apply to multiple institutions — programmes are competitive.',
      durationYears: 0,
          }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep1.id,
      type: 'ENTRY_REQUIREMENT',
      category: 'ACADEMIC',
      description: 'NSC with Bachelors pass',
      detail: 'You need a full Bachelors pass in your National Senior Certificate to apply to a university degree programme.',
      isMandatory: true,
            sources: {
        create: [{
          sourceName: 'DHET National Senior Certificate requirements',
          sourceType: 'GOVERNMENT_GAZETTE',
          sourceUrl: 'https://www.dhet.gov.za',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep1.id,
      type: 'ENTRY_REQUIREMENT',
      category: 'ACADEMIC',
      description: 'Mathematics Level 5 (60%+). Some universities require Level 6 (70%+)',
      detail: 'Mathematics is essential for Computer Science. UKZN requires Mathematics at Level 5 (60%). UCT and Wits typically require Level 6 (70%+) due to competition. Check your specific institution.',
      isMandatory: true,
            sources: {
        create: [{
          sourceName: 'UKZN Computer Science admission requirements',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://wp-smscs.ukzn.ac.za/computer-science/',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }, {
          sourceName: 'Wits BSc admission requirements',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://www.wits.ac.za/course-finder/undergraduate/science/bsc/',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: false,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep1.id,
      type: 'ENTRY_REQUIREMENT',
      category: 'ACADEMIC',
      description: 'English Level 4 (50%+)',
      detail: 'English is required at Level 4 or higher at most universities for BSc programmes.',
      isMandatory: true,
            sources: {
        create: [{
          sourceName: 'UKZN Computer Science admission requirements',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://wp-smscs.ukzn.ac.za/computer-science/',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep1.id,
      type: 'ENTRY_REQUIREMENT',
      category: 'ACADEMIC',
      description: 'APS score: typically 28-35+ depending on institution',
      detail: 'APS (Admission Point Score) requirements vary by university. UKZN Computer Science typically requires 28+. UCT and Wits are more competitive. Calculate your APS by converting each subject percentage to a level (1-7) and adding your best 6 subjects excluding Life Orientation.',
      isMandatory: true,
            sources: {
        create: [{
          sourceName: 'South African Universities 2026 Apply Guide',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://gocareers.co.za/apply/south-african-universities-2026',
          verifiedDate: new Date('2026-05-17'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep1.id,
      type: 'ENTRY_REQUIREMENT',
      category: 'FINANCIAL',
      description: 'Application fees: R100-R300 per institution',
      detail: 'Most universities charge an application fee. UCT, Wits, and Stellenbosch charge R100. UP charges R300. CAO (for DUT, UKZN, MUT, Unizulu) charges R250. Apply through CAO if applying to KZN-based institutions.',
      isMandatory: false,
            costType: 'RANGE_INSTITUTION',
      costAmountMin: 100,
      costAmountMax: 300,
      costNote: 'Per institution. Apply to multiple — programmes are competitive.',
      sources: {
        create: [{
          sourceName: 'South African Universities 2026 Apply Guide',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://gocareers.co.za/apply/south-african-universities-2026',
          verifiedDate: new Date('2026-05-17'),
          isPreferred: true,
        }]
      }
    }
  })

  const swDevStep2 = await prisma.pathwayStep.create({
    data: {
      pathwayId: swDevDegreePathway.id,
      stepType: 'STUDY_YEAR',
      title: 'Step 2: Complete BSc Computer Science (3 years)',
      description: 'Full-time study at a South African university. Covers programming, data structures, algorithms, databases, operating systems, and software engineering. Part-time is not typically available for BSc programmes.',
      durationYears: 3,
          }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep2.id,
      type: 'QUALIFICATION_REQUIREMENT',
      category: 'ACADEMIC',
      description: 'Full-time attendance for 3 years. Part-time generally not available.',
      isMandatory: true,
            sources: {
        create: [{
          sourceName: 'UKZN Computer Science programme information',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://wp-smscs.ukzn.ac.za/computer-science/',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep2.id,
      type: 'QUALIFICATION_REQUIREMENT',
      category: 'FINANCIAL',
      description: 'Tuition: approximately R35,000-R65,000 per year depending on institution',
      detail: 'Tuition varies significantly by university. UNISA is significantly cheaper for distance learning. NSFAS funding is available for qualifying students (household income below R350,000/year).',
      isMandatory: true,
            costType: 'RANGE_INSTITUTION',
      costAmountMin: 35000,
      costAmountMax: 65000,
      costNote: 'Per year. Verify with your chosen institution. NSFAS may cover this for qualifying students.',
      sources: {
        create: [{
          sourceName: 'South African Universities 2026 Apply Guide — fees section',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://gocareers.co.za/apply/south-african-universities-2026',
          verifiedDate: new Date('2026-05-17'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep2.id,
      type: 'QUALIFICATION_REQUIREMENT',
      category: 'FINANCIAL',
      description: 'Laptop required — budget R8,000-R15,000 for a suitable development laptop',
      detail: 'A laptop capable of running development software (IDEs, virtual machines, compilers) is essential. UCT Computer Science explicitly states a laptop requirement. Most CS programmes require one.',
      isMandatory: true,
            costType: 'LIKELY_ADDITIONAL',
      costAmountMin: 8000,
      costAmountMax: 15000,
      costNote: 'One-off cost. Look for student deals at Incredible Connection, Takealot, or through your institution.',
      sources: {
        create: [{
          sourceName: 'UCT School of IT — laptop requirement note',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://sit.uct.ac.za/computer-science-courses',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep2.id,
      type: 'QUALIFICATION_REQUIREMENT',
      category: 'FINANCIAL',
      description: 'Textbooks and learning materials: approximately R3,000-R8,000 per year',
      isMandatory: false,
            costType: 'LIKELY_ADDITIONAL',
      costAmountMin: 3000,
      costAmountMax: 8000,
      costNote: 'Many CS programmes use open-source textbooks and free online resources — actual cost varies.',
      sources: {
        create: [{
          sourceName: 'Estimated from general SA university student cost guides',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://gocareers.co.za/apply/south-african-universities-2026',
          verifiedDate: new Date('2026-05-17'),
          isPreferred: true,
        }]
      }
    }
  })

  const swDevStep3 = await prisma.pathwayStep.create({
    data: {
      pathwayId: swDevDegreePathway.id,
      stepType: 'STUDY_YEAR',
      title: 'Step 3: Graduate with BSc Computer Science',
      description: 'You now hold an NQF Level 7 qualification. You are ready to apply for junior software developer roles. There is no professional registration body for software developers in South Africa — your degree plus a portfolio of projects is what gets you hired.',
      durationYears: 0,
          }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep3.id,
      type: 'POST_QUALIFICATION',
      category: 'ACADEMIC',
      description: 'No mandatory professional registration required to work as a Software Developer in South Africa',
      detail: 'Unlike engineering or medicine, software development in SA does not require registration with a professional body before you can practise. Your degree and portfolio of projects are what employers look for.',
      isMandatory: false,
            sources: {
        create: [{
          sourceName: 'There is no statutory body regulating software development practice in South Africa',
          sourceType: 'GOVERNMENT_GAZETTE',
          sourceUrl: null,
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep3.id,
      type: 'POST_QUALIFICATION',
      category: 'ACADEMIC',
      description: 'Build a portfolio of projects on GitHub to show employers what you can build',
      detail: 'In software development, what you have built matters as much as your qualification. A GitHub profile with real projects (apps, tools, contributions to open source) significantly improves your chances of getting hired.',
      isMandatory: false,
            sources: {
        create: [{
          sourceName: 'Industry standard practice — SA tech recruitment norms',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: null,
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: swDevStep3.id,
      type: 'POST_QUALIFICATION',
      category: 'ACADEMIC',
      description: 'Optional: BSc Honours in Computer Science (1 additional year, NQF 8)',
      detail: 'An Honours year is recommended if you want to move into senior engineering, data science, AI/ML, or academic roles. It is not required for junior or mid-level developer positions.',
      isMandatory: false,
            sources: {
        create: [{
          sourceName: 'Wits BSc Honours in Computer Science',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://www.wits.ac.za/course-finder/postgraduate/science/computer-science/',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  // Pathway 2: UoT Diploma route
  const swDevDiplomaPathway = await prisma.pathway.create({
    data: {
      specializationId: softwareDev.id,
      qualificationId: dipICT.id,
      pathwayType: 'DIPLOMA_ROUTE',
      isPrimaryPath: false,
      description: 'The University of Technology route. Three years of Diploma in ICT: Applications Development at DUT, CPUT, TUT, CUT, VUT, or MUT. More hands-on and applied than a university degree. Lower entry requirements and more affordable. Leads to junior developer roles and can be followed by an Advanced Diploma (NQF 7) for further progression.',
    }
  })

  const dipStep1 = await prisma.pathwayStep.create({
    data: {
      pathwayId: swDevDiplomaPathway.id,
      stepType: 'APPLICATION',
      title: 'Step 1: Meet entry requirements and apply through CAO or directly',
      description: 'Apply to a University of Technology offering the Diploma in ICT: Applications Development. KZN institutions (DUT, MUT) use the CAO system. Other UoTs have their own portals.',
      durationYears: 0,
          }
  })

  await prisma.requirement.create({
    data: {
      stepId: dipStep1.id,
      type: 'ENTRY_REQUIREMENT',
      category: 'ACADEMIC',
      description: 'NSC with Diploma pass or higher',
      isMandatory: true,
            sources: {
        create: [{
          sourceName: 'DUT ICT Applications Development entry requirements',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://www.dut.ac.za/wp-content/uploads/career_leaflets/FAI%20ICT%20DBN.pdf',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: dipStep1.id,
      type: 'ENTRY_REQUIREMENT',
      category: 'ACADEMIC',
      description: 'Mathematics Level 4 (50%+). Mathematical Literacy may be accepted at some institutions with a higher APS.',
      isMandatory: true,
            sources: {
        create: [{
          sourceName: 'DUT ICT Applications Development entry requirements',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://www.dut.ac.za/wp-content/uploads/career_leaflets/FAI%20ICT%20DBN.pdf',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: dipStep1.id,
      type: 'ENTRY_REQUIREMENT',
      category: 'ACADEMIC',
      description: 'APS score: typically 23-28 depending on institution (lower than university degree)',
      detail: 'TUT requires a minimum APS of 23 with Mathematics (or 25 with Mathematical Literacy) for the extended programme. Standard programme requirements are higher. Check your specific institution.',
      isMandatory: true,
            sources: {
        create: [{
          sourceName: 'TUT ICT Faculty Prospectus 2026',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://www.tut.ac.za/media/tshwane-interim/site-content/images/prospectus/Part6_ICT_Prospectus.pdf',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: dipStep1.id,
      type: 'ENTRY_REQUIREMENT',
      category: 'FINANCIAL',
      description: 'CAO application fee: R250 (for KZN institutions). Other UoTs: check institution website.',
      isMandatory: false,
            costType: 'EXACT_PUBLISHED',
      costAmountMin: 250,
      costAmountMax: 250,
      costNote: 'CAO fee for 2026. R470 for late applications.',
      sources: {
        create: [{
          sourceName: 'South African Universities 2026 Apply Guide — CAO fees',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://gocareers.co.za/apply/south-african-universities-2026',
          verifiedDate: new Date('2026-05-17'),
          isPreferred: true,
        }]
      }
    }
  })

  const dipStep2 = await prisma.pathwayStep.create({
    data: {
      pathwayId: swDevDiplomaPathway.id,
      stepType: 'STUDY_YEAR',
      title: 'Step 2: Complete Diploma in ICT: Applications Development (3 years)',
      description: 'Hands-on, applied learning covering programming, databases, web development, and systems analysis. More practical than a university degree. Includes work-integrated learning components at some institutions.',
      durationYears: 3,
          }
  })

  await prisma.requirement.create({
    data: {
      stepId: dipStep2.id,
      type: 'QUALIFICATION_REQUIREMENT',
      category: 'FINANCIAL',
      description: 'Tuition: approximately R20,000-R40,000 per year depending on institution',
      detail: 'UoT tuition is generally lower than traditional university tuition. NSFAS funding available for qualifying students.',
      isMandatory: true,
            costType: 'RANGE_INSTITUTION',
      costAmountMin: 20000,
      costAmountMax: 40000,
      costNote: 'Per year. Verify with your chosen institution. NSFAS may cover this.',
      sources: {
        create: [{
          sourceName: 'DUT ICT fee guide 2026',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://www.dut.ac.za/wp-content/uploads/career_leaflets/FAI%20ICT%20DBN.pdf',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: dipStep2.id,
      type: 'QUALIFICATION_REQUIREMENT',
      category: 'ACADEMIC',
      description: 'Laptop required for practical programming work',
      isMandatory: true,
            costType: 'LIKELY_ADDITIONAL',
      costAmountMin: 8000,
      costAmountMax: 15000,
      costNote: 'One-off cost.',
      sources: {
        create: [{
          sourceName: 'DUT ICT programme requirements',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://www.dut.ac.za/wp-content/uploads/career_leaflets/FAI%20ICT%20DBN.pdf',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  const dipStep3 = await prisma.pathwayStep.create({
    data: {
      pathwayId: swDevDiplomaPathway.id,
      stepType: 'STUDY_YEAR',
      title: 'Step 3: Graduate and enter the job market as a junior developer',
      description: 'Your Diploma (NQF 6) qualifies you for junior software developer, programmer, and systems analyst roles. You can also continue to the Advanced Diploma (NQF 7) or articulate to a university degree with credit exemptions at some institutions.',
      durationYears: 0,
          }
  })

  await prisma.requirement.create({
    data: {
      stepId: dipStep3.id,
      type: 'POST_QUALIFICATION',
      category: 'ACADEMIC',
      description: 'No professional registration required to practise as a software developer',
      isMandatory: false,
            sources: {
        create: [{
          sourceName: 'Software development is not a regulated profession in South Africa',
          sourceType: 'GOVERNMENT_GAZETTE',
          sourceUrl: null,
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  await prisma.requirement.create({
    data: {
      stepId: dipStep3.id,
      type: 'POST_QUALIFICATION',
      category: 'ACADEMIC',
      description: 'Optional: Advanced Diploma in ICT (1 additional year, NQF 7) for further progression',
      detail: 'The Advanced Diploma brings your qualification to NQF 7 — the same level as a university degree. This opens doors to Honours study and more senior roles.',
      isMandatory: false,
            sources: {
        create: [{
          sourceName: 'TUT ICT Faculty Prospectus 2026 — Advanced Diploma information',
          sourceType: 'INSTITUTION_WEBSITE',
          sourceUrl: 'https://www.tut.ac.za/media/tshwane-interim/site-content/images/prospectus/Part6_ICT_Prospectus.pdf',
          verifiedDate: new Date('2026-03-01'),
          isPreferred: true,
        }]
      }
    }
  })

  // Link software engineer to same pathways (same qualification routes)
  await prisma.pathway.create({
    data: {
      specializationId: softwareEng.id,
      qualificationId: bscCS.id,
      pathwayType: 'STANDARD_DEGREE',
      isPrimaryPath: true,
      description: 'Software Engineers typically follow the same degree route as Software Developers — BSc Computer Science or BSc IT. The distinction between the two roles becomes clearer at mid-to-senior level. Entry routes are identical.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: softwareEng.id,
      qualificationId: dipICT.id,
      pathwayType: 'DIPLOMA_ROUTE',
      isPrimaryPath: false,
      description: 'The Diploma in ICT route is also valid for Software Engineering roles, particularly at junior level. As you grow, the BSc or Advanced Diploma becomes more relevant for senior engineering positions.',
    }
  })

  // Link other specialisations to relevant qualifications
  await prisma.pathway.create({
    data: {
      specializationId: webDev.id,
      qualificationId: dipICT.id,
      pathwayType: 'DIPLOMA_ROUTE',
      isPrimaryPath: true,
      description: 'Web development is well served by the Diploma in ICT: Applications Development. The practical, applied focus of UoT programmes maps closely to real-world web development work.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: webDev.id,
      qualificationId: bscIT.id,
      pathwayType: 'STANDARD_DEGREE',
      isPrimaryPath: false,
      description: 'BSc IT or BSc Computer Science also leads to web development roles, with a stronger theoretical foundation.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: dataAnalyst.id,
      qualificationId: bscIT.id,
      pathwayType: 'STANDARD_DEGREE',
      isPrimaryPath: true,
      description: 'Data Analyst roles are accessible through BSc IT, BSc Computer Science, or BCom Information Systems. Strong SQL and Excel skills are essential regardless of qualification route.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: itTechnician.id,
      qualificationId: dipICT.id,
      pathwayType: 'DIPLOMA_ROUTE',
      isPrimaryPath: true,
      description: 'IT Technician and Systems Administrator roles are well served by the Diploma in ICT. Vendor certifications (CompTIA A+, Microsoft, Cisco) are often more important than the degree for this specialisation.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: networkEng.id,
      qualificationId: dipICT.id,
      pathwayType: 'DIPLOMA_ROUTE',
      isPrimaryPath: true,
      description: 'Network Engineering is accessible through the Diploma in ICT, combined with Cisco CCNA or CompTIA Network+ certifications. The certifications often matter more than the formal qualification for entry-level roles.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: cybersecurity.id,
      qualificationId: bscCS.id,
      pathwayType: 'STANDARD_DEGREE',
      isPrimaryPath: true,
      description: 'Cybersecurity roles typically require a BSc Computer Science or BSc IT foundation, supplemented by certifications such as CompTIA Security+, CEH (Certified Ethical Hacker), or CISSP for senior roles.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: cloudEng.id,
      qualificationId: bscCS.id,
      pathwayType: 'STANDARD_DEGREE',
      isPrimaryPath: true,
      description: 'Cloud Engineering is highly certification-driven. Microsoft Azure, AWS, and Google Cloud certifications (like the Azure Administrator or AWS Solutions Architect) are often as important as a formal degree. A BSc provides the foundation.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: devops.id,
      qualificationId: bscCS.id,
      pathwayType: 'STANDARD_DEGREE',
      isPrimaryPath: true,
      description: 'DevOps Engineers typically come from a software development or systems administration background. A BSc Computer Science combined with cloud certifications (Azure DevOps, AWS) and real pipeline-building experience is the most common path.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: aiMlEng.id,
      qualificationId: bscHonsCS.id,
      pathwayType: 'STANDARD_DEGREE',
      isPrimaryPath: true,
      description: 'AI and Machine Learning Engineering typically requires at least an Honours degree in Computer Science, with strong mathematics (linear algebra, calculus, statistics). BSc + Honours is the standard entry path at most SA companies.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: dataSci.id,
      qualificationId: bscHonsCS.id,
      pathwayType: 'STANDARD_DEGREE',
      isPrimaryPath: true,
      description: 'Data Science typically requires strong mathematical foundations. Most SA Data Scientist roles expect at minimum a BSc with strong statistics and mathematics, with Honours preferred for mid-level roles.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: businessAnalyst.id,
      qualificationId: bscIT.id,
      pathwayType: 'STANDARD_DEGREE',
      isPrimaryPath: true,
      description: 'IT Business Analysts come from both IT and business backgrounds. BSc IT or BCom Information Systems are common entry qualifications. Strong communication skills and business understanding matter as much as technical knowledge.',
    }
  })

  await prisma.pathway.create({
    data: {
      specializationId: uiuxDesigner.id,
      qualificationId: dipICT.id,
      pathwayType: 'DIPLOMA_ROUTE',
      isPrimaryPath: true,
      description: 'UI/UX Design does not have a single dedicated qualification path in SA. Design diplomas, IT diplomas with design electives, or graphic design qualifications combined with a strong portfolio are all valid routes. Portfolio matters enormously in this field.',
    }
  })

  console.log('All pathways created.')
  console.log('IT seed data complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })