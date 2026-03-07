export interface EventDetail {
  id: string;
  name: string;
  category: string;
  description: string;
  objective: string[];
  participation: {
    teamSize: string;
    registrationFee: string;
    eligibility: string;
  };
  format: string[];
  judgingCriteria: string[];
  requirements: string[];
  prizeStructure: {
    prizePool: string;
    details?: string[];
  };
  schedule: {
    date: string;
    time: string;
    venue: string;
    duration?: string;
  };
  rules?: string[];
  additionalInfo?: string[];
}

export const eventDetails: Record<string, EventDetail> = {
  path: {
    id: "path",
    name: "Path Follower",
    category: "Technical Event",
    description:
      "Path Follower is a robotics-based competition where participants control a robot to navigate through a predefined, twisted track within a limited time. The robots will be provided by the organizing team, ensuring equal opportunity for all participants. The challenge focuses on precision control, quick reflexes, and strategic maneuvering. Participants must efficiently guide the robot through curves and obstacles without deviating from the track.",
    objective: [
      "Promote practical exposure to robotics and automation concepts",
      "Encourage teamwork and strategic thinking",
      "Test precision control and time management skills",
      "Provide a platform for students to experience hands-on technical challenges",
    ],
    participation: {
      teamSize: "3 Members",
      registrationFee: "₹219 per team",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Round 1: Basic track navigation round to qualify teams",
      "Round 2: Twisted and complex path with time-based scoring",
      "Final Round: Shortest completion time without track deviation determines winner",
    ],
    judgingCriteria: [
      "Completion time",
      "Accuracy in following the path",
      "Number of deviations or penalties",
      "Team coordination during execution",
    ],
    requirements: [
      "Indoor classroom/lab setup (SOET 3103)",
      "Pre-built robots provided by organizing team",
      "Marked track with twists and turns",
      "Power backup for charging and equipment",
      "Technical supervision team",
    ],
    prizeStructure: {
      prizePool: "₹5,000",
      details: [
        "Winner – ₹3,000",
        "Runner-up – ₹2,000",
        "Certificates for all participants",
      ],
    },
    schedule: {
      date: "27th March",
      venue: "SOET 3103",
      time: "1:30 PM - 4:30 PM",
    },
  },
  lathe: {
    id: "lathe",
    name: "Lathe War",
    category: "Technical Event",
    description:
      "Lathe War is a skill-based machining competition where participants demonstrate their theoretical knowledge and practical expertise in operating a lathe machine. The event evaluates participants on machining accuracy, dimensional precision, surface finish, and adherence to safety standards within a defined time limit. Teams must interpret technical drawings and manufacture a component using the provided raw material under strict supervision.",
    objective: [
      "Promote hands-on exposure to machining and manufacturing processes",
      "Test theoretical understanding of lathe machines and operations",
      "Evaluate precision engineering and dimensional accuracy skills",
      "Encourage teamwork, technical discipline, and safety compliance",
      "Provide practical experience aligned with mechanical workshop standards",
    ],
    participation: {
      teamSize: "Minimum 3 – Maximum 4 Members",
      registrationFee: "₹219 per team",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Round 1: Theoretical Round (20 Marks) - 20 Multiple Choice Questions on lathe machines, cutting tools, operations, tolerances, and safety",
      "Round 2: Practical Machining Round (30 Marks) - Teams machine a component based on technical drawing with provided raw material",
    ],
    judgingCriteria: [
      "Theoretical Round: 1 mark per correct MCQ (20 Marks)",
      "Practical Round: Dimensional Accuracy – 20 Marks, Surface Finish & Machining Quality – 10 Marks",
      "Disqualification Conditions: Exceeding tolerance limits, unsafe working practices, intentional damage, using unauthorized tools, taking external assistance",
    ],
    requirements: [
      "Venue: Workshop",
      "Operational lathe machines",
      "Standard cutting tools (provided by organizers)",
      "Specified raw material for machining",
      "Printed technical drawings with tolerances",
      "Technical supervision team",
      "Power supply and safety equipment",
    ],
    prizeStructure: {
      prizePool: "₹10,000",
      details: [
        "Winner – ₹6,000",
        "Runner-up – ₹4,000",
        "Certificates for all participants",
      ],
    },
    schedule: {
      date: "28th March",
      venue: "Workshop",
      time: "10:00 AM – 3:00 PM",
    },
  },
  circuit: {
    id: "circuit",
    name: "Circuitronix",
    category: "Technical Event",
    description:
      "Circuitronix is a one-day technical competition focused on circuit design, electronics, and problem-solving skills. The event challenges participants through multiple rounds that test theoretical knowledge as well as practical implementation. Teams will work on hardware and software integration tasks using provided electronic components and microcontrollers, followed by project presentations.",
    objective: [
      "Promote practical learning in electronics and circuit design",
      "Enhance problem-solving and analytical thinking skills",
      "Encourage innovation through hardware and software integration",
      "Provide hands-on experience with real electronic components and systems",
      "Develop teamwork and presentation skills among participants",
    ],
    participation: {
      teamSize: "1–4 Members",
      registrationFee: "₹300 per team",
      eligibility:
        "Open to Engineering Students & Tech Enthusiasts (Inter-college participation allowed)",
    },
    format: [
      "Round 1: Qualifier Round - Objective-based and short-answer technical questions with negative marking (No internet access)",
      "Round 2: Hardware & Software Integration - Build and program circuits using provided components (Internet allowed, includes PPT preparation)",
      "Final Evaluation: Project presentation and judging based on implementation and performance",
    ],
    judgingCriteria: [
      "Technical accuracy and circuit functionality",
      "Innovation and problem-solving approach",
      "Project implementation and performance",
      "Presentation quality and explanation",
      "Time management and teamwork",
    ],
    requirements: [
      "Indoor lab/classroom setup (SOET 5204)",
      "Electronic components, sensors, and microcontrollers (provided by organizers)",
      "Power supply and technical supervision team",
      "Participants must bring laptops with Arduino IDE installed and Micro USB cables",
      "Valid College/University ID cards for registration",
    ],
    prizeStructure: {
      prizePool: "₹6,000",
      details: ["Certificates for all participants"],
    },
    schedule: {
      date: "28th March",
      venue: "SOET 5204",
      time: "2 – 6 Hours",
    },
  },
  cpl: {
    id: "cpl",
    name: "Coding Premier League",
    category: "Technical Event",
    description:
      "Coding Premier League (CPL) is a competitive programming event designed to test participants' coding proficiency, logical thinking, and problem-solving abilities under time constraints. Participants will compete in an intense coding environment where they must solve algorithmic and programming challenges efficiently and accurately.",
    objective: [
      "Enhance programming and algorithmic problem-solving skills",
      "Encourage logical thinking and efficient coding practices",
      "Promote competitive coding culture among students",
      "Improve time management and analytical abilities",
      "Provide a platform for students to showcase coding talent",
    ],
    participation: {
      teamSize: "Individual / Team (Maximum 4)",
      registrationFee: "₹240",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Coding Challenge Round: Solve multiple programming problems within a fixed time limit",
      "Problems vary in difficulty levels, testing logic, algorithms, and optimization skills",
      "Scoring based on correctness, efficiency, and submission time",
      "Final Ranking: Participants ranked based on total score and time efficiency",
    ],
    judgingCriteria: [
      "Number of problems solved",
      "Accuracy of solutions",
      "Code efficiency and optimization",
      "Submission time and leaderboard ranking",
    ],
    requirements: [
      "Computer lab setup with stable internet connection",
      "Coding platform access for participants",
      "Power backup and technical supervision team",
      "System compatibility for common programming languages",
    ],
    prizeStructure: {
      prizePool: "₹10,000",
      details: ["In-kind Value: Certificates and Cheque awards for winners"],
    },
    schedule: {
      date: "27th March",
      venue: "Lab 2102 & 2103",
      time: "4 Hours",
    },
  },
  refab: {
    id: "refab",
    name: "RE-FAB",
    category: "Technical Event",
    description:
      "Re-Fab is a team-based innovation and design challenge that encourages participants to rethink, redesign, and creatively fabricate solutions using available resources. The event focuses on creativity, teamwork, and practical problem-solving within a limited timeframe. Participants will collaborate to conceptualize and present innovative ideas while demonstrating design thinking and execution skills.",
    objective: [
      "Promote innovation and creative problem-solving",
      "Encourage teamwork and collaborative thinking",
      "Develop practical design and fabrication skills",
      "Provide hands-on experience in rapid ideation and execution",
      "Enhance presentation and time management abilities",
    ],
    participation: {
      teamSize: "4 Members",
      registrationFee: "₹280",
      eligibility:
        "Open to inter-college participants (Expected: 10 Teams, ~40 Participants)",
    },
    format: [
      "Design & Fabrication Challenge: Teams given a problem statement or creative task",
      "Participants ideate, design, and develop a solution within given time",
      "Final concepts/projects will be presented for evaluation",
      "Winners determined based on creativity, execution, and presentation quality",
    ],
    judgingCriteria: [
      "Creativity and innovation",
      "Practicality and execution of idea",
      "Team coordination",
      "Presentation and explanation",
      "Time management",
    ],
    requirements: [
      "Indoor classroom setup (Room 3304 or 3305)",
      "Basic decoration setup",
      "Workspace for teams",
      "Technical supervision and event management support",
    ],
    prizeStructure: {
      prizePool: "₹10,000",
      details: ["In-kind Value: Certificates and Cheque awards"],
    },
    schedule: {
      date: "27th March",
      venue: "3304",
      time: "1:30 PM - 3:30 PM",
      duration: "2 hours",
    },
  },
  treasure: {
    id: "treasure",
    name: "Treasure Hunt",
    category: "Non-Technical Event",
    description:
      "Treasure Hunt is an interactive team-based adventure event where participants solve clues, complete challenges, and navigate across different locations within the campus to reach the final destination. The event tests participants' logical thinking, observation skills, teamwork, and problem-solving abilities while creating an exciting and engaging experience.",
    objective: [
      "Encourage teamwork and collaboration among participants",
      "Enhance logical reasoning and problem-solving skills",
      "Promote engagement through fun and interactive challenges",
      "Develop decision-making and time management abilities",
      "Provide an entertaining yet competitive campus experience",
    ],
    participation: {
      teamSize: "3 + 1 Members",
      registrationFee: "₹299 per team",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Clue-Based Hunt: Teams receive sequential clues leading to different campus locations",
      "Each clue must be solved to unlock the next stage",
      "Tasks or mini-challenges may be included at checkpoints",
      "Final Round: Team that reaches final location in shortest time with correct solutions wins",
    ],
    judgingCriteria: [
      "Accuracy in solving clues",
      "Completion time",
      "Team coordination and strategy",
      "Rule compliance during the hunt",
    ],
    requirements: [
      "Campus-wide setup (Adamas Campus)",
      "Printed clues and checkpoint arrangements",
      "Volunteers stationed at different locations",
      "Event coordination and supervision team",
    ],
    prizeStructure: {
      prizePool: "₹5,000",
      details: ["Certificates for participants and winners"],
    },
    schedule: {
      date: "28th March",
      venue: "Adamas Campus",
      time: "2:00 PM – 5:00 PM",
      duration: "3 Hours",
    },
  },
  design: {
    id: "design",
    name: "Dil Se Design",
    category: "Technical Event",
    description:
      "Dil Se Design is a creative design competition that encourages participants to showcase their artistic vision, creativity, and design thinking skills. The event focuses on transforming ideas into visually appealing designs through innovative concepts and aesthetic execution. Participants will work on design-based challenges within a limited timeframe, promoting originality, creativity, and effective visual communication.",
    objective: [
      "Encourage creativity and innovative design thinking",
      "Provide a platform for students to express artistic and visual ideas",
      "Enhance skills in digital and conceptual design",
      "Promote problem-solving through creative approaches",
      "Develop presentation and execution skills",
    ],
    participation: {
      teamSize: "Individual / Team (3 Members)",
      registrationFee: "₹219 per team",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Design Challenge Round: Participants given a design theme or problem statement",
      "Designs must be created within the allotted time",
      "Participants present their final designs for evaluation",
      "Final Evaluation: Judging based on creativity, originality, and execution quality",
    ],
    judgingCriteria: [
      "Creativity and originality",
      "Visual aesthetics and design quality",
      "Concept clarity and innovation",
      "Presentation and explanation",
      "Time management",
    ],
    requirements: [
      "Indoor classroom setup (SOET 2103)",
      "Power backup and technical supervision team",
    ],
    prizeStructure: {
      prizePool: "₹3,000",
      details: ["Certificates for all participants"],
    },
    schedule: {
      date: "28th March",
      venue: "SOET 2103",
      time: "10:00 AM – 2:00 PM",
      duration: "1 Day",
    },
  },
  bridge: {
    id: "bridge",
    name: "Bridge Building",
    category: "Technical Event",
    description:
      "Bridge Building is a structural engineering challenge where participants design and construct a load-bearing bridge using limited materials within a fixed time frame. The competition evaluates creativity, structural efficiency, teamwork, and engineering fundamentals while promoting innovation, safety, and sustainable design thinking.",
    objective: [
      "Encourage practical understanding of structural mechanics",
      "Develop problem-solving and design optimization skills",
      "Test teamwork and time management under constraints",
      "Promote innovation using limited resources",
      "Evaluate load-bearing capacity and structural stability",
    ],
    participation: {
      teamSize: "Maximum 4 Members",
      registrationFee: "₹280 per team",
      eligibility: "Open to inter-college participants (Expected: ~10 teams)",
    },
    format: [
      "Each team provided with 150 ice cream sticks and glue",
      "Teams must bring their own clips and scissors/cutters",
      "Structure Requirements: Minimum Height: 20 cm, Minimum Length: 60 cm",
      "Time Limit: 2.5 hours for construction",
      "Structures must dry for 1 day before load testing",
      "Teams must attach identification token with group number and member names",
      "Personal glue or adhesives are strictly prohibited",
    ],
    judgingCriteria: [
      "Maximum load sustained by the bridge",
      "Structural stability under applied load",
      "Appearance of cracks during load testing",
      "Overall structural efficiency",
      "Judges' decision will be final and binding",
    ],
    requirements: [
      "Venue: SOET 5008",
      "Ice cream sticks (150 per team)",
      "Adhesive (provided by organizers)",
      "Load testing setup",
      "Weighing/Load application mechanism",
      "Technical supervision team",
      "Workspace tables",
    ],
    prizeStructure: {
      prizePool: "₹3,000",
      details: [
        "Winner – ₹2,000",
        "Runner-up – ₹1,000",
        "Certificates for all participants",
      ],
    },
    schedule: {
      date: "27th March",
      venue: "SOET 5008",
      time: "1:00 PM – 3:15 PM",
    },
  },
  tower: {
    id: "tower",
    name: "Tower Making",
    category: "Technical Event",
    description:
      "Tower Making is a structural design competition where teams construct a vertically stable and load-bearing tower using limited materials. The challenge tests structural integrity, height optimization, material efficiency, and teamwork under time constraints.",
    objective: [
      "Apply structural engineering principles in vertical design",
      "Promote creativity and stability optimization",
      "Enhance collaboration and execution efficiency",
      "Test strength-to-height ratio under load conditions",
      "Encourage sustainable material utilization",
    ],
    participation: {
      teamSize: "Maximum 4 Members",
      registrationFee: "₹280 per team",
      eligibility: "Open to inter-college participants (Expected: ~10 teams)",
    },
    format: [
      "Each team provided with 150 ice cream sticks and glue",
      "Teams must bring their own clips and scissors/cutters",
      "Structure Requirements: Minimum Height: 60 cm, Minimum Base Length: 20 cm",
      "Time Limit: 2.5 hours for construction",
      "Structures must dry for 1 day before load testing",
      "Identification token with group number and member names must be attached",
      "Use of personal adhesives leads to disqualification",
    ],
    judgingCriteria: [
      "Maximum load sustained by the tower",
      "Structural stability and crack resistance",
      "Height-to-strength efficiency",
      "Overall construction quality",
      "Judges' decision will be final and binding",
    ],
    requirements: [
      "Venue: SOET 6002",
      "Ice cream sticks (150 per team)",
      "Adhesive (provided by organizers)",
      "Load testing apparatus",
      "Measurement tools (height verification)",
      "Technical supervision team",
      "Workspace tables",
    ],
    prizeStructure: {
      prizePool: "₹3,000",
      details: [
        "Winner – ₹2,000",
        "Runner-up – ₹1,000",
        "Certificates for all participants",
      ],
    },
    schedule: {
      date: "27th March",
      venue: "SOET 6002",
      time: "3:20 PM – 5:30 PM",
    },
  },
  dance: {
    id: "dance",
    name: "Dance Battle",
    category: "Non-Technical Event",
    description:
      "Dance Battle is a performance-based competition where participants present pre-prepared choreography across diverse dance styles. The event evaluates creativity, synchronization, stage presence, musical interpretation, and overall performance impact. Participants may compete as Solo performers or Crews.",
    objective: [
      "Provide a platform for artistic expression and creativity",
      "Encourage confidence and stage performance skills",
      "Promote coordination and teamwork",
      "Showcase versatility across dance forms",
      "Evaluate choreography, rhythm, and audience engagement",
    ],
    participation: {
      teamSize: "Solo / Crew (1 / 2 / 3 / 4 / 5 Members)",
      registrationFee: "₹199 (Solo) / ₹499 (Duo/Crew)",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Round Type: Pre-prepared choreography",
      "Time Limits: Solo - 90 seconds, Crew - 2.5 minutes",
      "All dance styles allowed (Hip-Hop, Bollywood, Contemporary, Classical Fusion, Freestyle, etc.)",
      "Music must be submitted in MP3 format at least 24 hours prior",
      "Backup music must be carried in a pen drive",
      "Props allowed (safe and setup within 30 seconds)",
      "Reporting time: 30 minutes before performance",
    ],
    judgingCriteria: [
      "Synchronization (for Solo/Crew)",
      "Creativity & Choreography",
      "Musicality",
      "Expressions & Stage Presence",
      "Overall Impact",
      "Judges' decision will be final and binding",
    ],
    requirements: [
      "Venue: Basketball Court",
      "Professional sound system",
      "Performance area",
      "Technical support team",
      "Judging panel",
      "Power backup",
      "Stage 3ft size",
    ],
    prizeStructure: {
      prizePool: "₹10,000",
      details: [
        "Winner and Runner-up distribution as per organizing committee decision",
        "Certificates & Medals for all participants",
      ],
    },
    schedule: {
      date: "27th March",
      venue: "Basketball Court",
      time: "4:30 PM – 6:30 PM",
    },
  },
  gaming: {
    id: "gaming",
    name: "Valorant",
    category: "Gaming Event",
    description:
      "The Valorant Tournament at Signifiya 2026 is a professional 5v5 competitive esports event conducted in alignment with VCT (Valorant Champions Tour) competitive standards. The tournament begins with Online Qualifiers and culminates in a LAN Grand Final, ensuring high-level gameplay, competitive integrity, and an immersive spectator experience.",
    objective: [
      "Promote structured esports competition under standardized rules",
      "Provide a professional LAN tournament experience",
      "Encourage teamwork, strategy, and tactical coordination",
      "Ensure competitive integrity through strict fair-play enforcement",
      "Deliver a premium spectator and player experience",
    ],
    participation: {
      teamSize: "5 Members",
      registrationFee: "₹499 per team",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Game Settings: Competitive 5v5 Standard, First to 13 rounds, Overtime: Win by 2 (if 12–12)",
      "Map Pool: Abyss, Breeze, Bind, Corrode, Haven, Pearl, Split",
      "Map Veto: Best of 1 (Online Qualifiers & Semi-Finals), Best of 3 (Grand Finals)",
      "Online Stage (Single Elimination): Early Qualifiers – Bo1, Quarter-Finals – Bo1",
      "LAN Stage: Semi-Finals – Bo1, Grand Finals – Bo3",
      "Top 4 teams from Online stage advance to LAN",
    ],
    judgingCriteria: [
      "Must compete using registered Riot ID",
      "No smurfing or substitute players (immediate disqualification)",
      "Server: Mumbai",
      "Vanguard anti-cheat mandatory",
      "No third-party software permitted",
      "Teams must report 15 minutes before match",
      "10-minute grace period allowed",
      "Zero tolerance for racism, sexism, or hate speech",
    ],
    requirements: [
      "Venue: SV Hall (LAN Stage)",
      "High-refresh-rate gaming setups",
      "Ethernet connectivity",
      "Tournament Mode custom lobby access",
      "Professional referees",
      "Large LCD projection for spectators",
      "Power backup",
    ],
    prizeStructure: {
      prizePool: "₹30,000",
      details: [
        "Distribution as per organizing committee decision",
        "Certificates for all participants",
      ],
    },
    schedule: {
      date: "27th March",
      venue: "SV Hall",
      time: "12:30 PM – 7:00 PM",
    },
  },
  arm: {
    id: "arm",
    name: "Arm Wrestling",
    category: "Non-Technical Event",
    description:
      "Arm Wrestling is a strength-based knockout competition that tests participants' upper-body power, technique, endurance, and mental focus. The event follows standard competitive arm wrestling regulations, ensuring safety, fairness, and disciplined sportsmanship under referee supervision.",
    objective: [
      "Promote physical fitness and competitive spirit",
      "Test strength, grip control, and technique",
      "Encourage discipline and sportsmanship",
      "Ensure adherence to official match standards",
    ],
    participation: {
      teamSize: "1 Member (Individual)",
      registrationFee: "₹99 per participant",
      eligibility:
        "Open to inter-college participants (Weight Categories: 60 kg, 70 kg, 80 kg, 90+ kg)",
    },
    format: [
      "Matches conducted in knockout format",
      "Both competitors must place elbow firmly on elbow pad",
      "Shoulders must remain square before the start",
      "Knuckles visible; wrist straight at starting position",
      "Win declared when opponent's hand touches the pin pad",
      "Grip Rules: Unintentional slip → Strap match applied, Intentional slip → Foul",
      "Foul System: Two fouls may result in loss of the match",
      "Participants must report 30 minutes before their match",
    ],
    judgingCriteria: [
      "Common Fouls: Elbow lifting off pad, Early start, Releasing side peg, Shoulder crossing center line, Intentional slip, Unsportsmanlike conduct",
      "Strict adherence to official competition standards",
      "Referee's decision will be final and binding",
      "Any misconduct may lead to immediate disqualification",
    ],
    requirements: [
      "Venue: Canopy Area",
      "Professional arm wrestling table with elbow pads and pin pads",
      "Certified referee",
      "Weight verification setup",
      "Medical support/first aid",
      "Technical supervision team",
    ],
    prizeStructure: {
      prizePool: "₹3,000",
      details: [
        "Distribution as per organizing committee decision",
        "Certificates for participants",
      ],
    },
    schedule: {
      date: "27th March",
      venue: "Canopy Area",
      time: "4:00 PM – 5:00 PM",
    },
  },
  powerdeal: {
    id: "powerdeal",
    name: "The Power Deal",
    category: "Business Event",
    description:
      "The Power Deal is a bidding-based strategic simulation where teams compete to acquire high-valuation companies using limited virtual currency. Participants must manage capital, assess risk, and strategically bid without knowing the actual company valuations. The event emphasizes analytical thinking, portfolio optimization, and competitive financial decision-making.",
    objective: [
      "Promote entrepreneurial and strategic thinking",
      "Develop budgeting and capital allocation skills",
      "Enhance risk assessment under uncertainty",
      "Encourage team-based financial decision-making",
      "Introduce portfolio optimization concepts",
    ],
    participation: {
      teamSize: "3 Members",
      registrationFee: "₹149 per team",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Duration: 2 Hours",
      "Each team receives $150 virtual currency",
      "30–50 companies auctioned sequentially",
      "Each company displayed with starting bid",
      "Fixed bid increment announced before auction",
      "Highest bidder wins the company",
      "Winning bid deducted from team's balance",
      "No rebidding or transfer once sold",
      "Actual company valuations remain hidden during auction",
      "Event ends after all companies are sold or time concludes",
    ],
    judgingCriteria: [
      "After auction, hidden valuations revealed",
      "Total valuation of acquired companies calculated",
      "Team with highest combined portfolio valuation wins",
      "Judges'/Moderator's decision will be final and binding",
    ],
    requirements: [
      "Venue: AU1 International Lounge",
      "Projector + Laptop",
      "Excel/PowerPoint slides showing company name, starting bid, bid increment",
      "Balance tracking sheet for each team",
      "1 Moderator (auction lead)",
      "1 Volunteer (budget tracking)",
    ],
    prizeStructure: {
      prizePool: "₹5,000",
      details: ["Certificates for all participants"],
    },
    schedule: {
      date: "27th March",
      venue: "AU1 International Lounge",
      time: "2:30 PM – 4:30 PM",
    },
  },
  techmonopoly: {
    id: "techmonopoly",
    name: "Tech Monopoly",
    category: "Business Event",
    description:
      "Tech Monopoly is a live startup-investment simulation where teams act as Venture Capital firms managing virtual capital. Participants invest in curated tech startups and respond to market fluctuations, valuation changes, crises, and economic scenarios. The competition evaluates financial reasoning, strategic investment planning, and adaptability under pressure.",
    objective: [
      "Develop venture capital and investment analysis skills",
      "Promote financial reasoning and valuation understanding",
      "Strengthen strategic portfolio diversification",
      "Encourage decision-making under uncertainty",
      "Foster interdisciplinary entrepreneurial thinking",
    ],
    participation: {
      teamSize: "3 Members",
      registrationFee: "₹149 per team",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Duration: 3 Hours",
      "Round 1 – Initial Investment Phase: Each team receives virtual capital (₹10,00,000), mandatory diversification across startups",
      "Round 2 – Market Update Phase: Structured market updates announced, startup valuations rise/fall, portfolio adjustment opportunity",
      "Round 3 – Crisis / Opportunity Phase: Simulated economic shift introduced, final rebalancing of investments",
      "Final Round – Portfolio Valuation: Net worth calculated, team with highest final portfolio value wins",
    ],
    judgingCriteria: [
      "Portfolio diversification strategy",
      "Investment timing decisions",
      "Risk management effectiveness",
      "Final portfolio performance",
      "Decision of evaluation panel will be final and binding",
    ],
    requirements: [
      "Venue: AU1 International Lounge",
      "Projector + Laptop",
      "Excel-based valuation tracking sheet",
      "Startup valuation slides (per round)",
      "Printed investment sheets (one per team)",
      "Registration desk",
    ],
    prizeStructure: {
      prizePool: "₹5,000",
      details: ["Certificates for all participants"],
    },
    schedule: {
      date: "28th March",
      venue: "AU1 International Lounge",
      time: "10:00 AM – 1:00 PM",
    },
  },
  rap: {
    id: "rap",
    name: "Rap Battle",
    category: "Non-Technical Event",
    description:
      "Rap Battle is a high-intensity lyrical competition where participants showcase verbal agility, creativity, rhythm control, and stage presence. Contestants compete head-to-head within a regulated time limit, delivering written or freestyle performances while adhering to strict content and conduct guidelines.",
    objective: [
      "Promote creative expression through hip-hop culture",
      "Encourage lyrical innovation and wordplay",
      "Develop confidence and stage control",
      "Maintain competitive spirit within structured discipline",
      "Ensure a safe and respectful performance environment",
    ],
    participation: {
      teamSize: "Solo / Duo / Group (1 / 2 / 3 / 4 Members)",
      registrationFee: "₹149 per participant/team",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Time Limit: 60 seconds per round",
      "Participants must stop immediately when time ends",
      "Mic and sound system controlled by organizers",
      "Written and freestyle performances allowed",
      "Participants must report 30 minutes before event",
      "Late arrival may result in elimination",
    ],
    judgingCriteria: [
      "Flow & Rhythm",
      "Lyrics & Creativity",
      "Stage Presence",
      "Crowd Engagement",
      "Judges' decision will be final and binding",
    ],
    requirements: [
      "Venue: Canopy Area",
      "Sound system with mic control",
      "Backup audio system",
      "Beat submission prior to event (if required)",
      "Security/volunteer supervision near stage",
      "Event recording setup",
    ],
    prizeStructure: {
      prizePool: "₹3,000",
      details: ["Certificates for participants"],
    },
    schedule: {
      date: "28th March",
      venue: "Canopy Area",
      time: "3:00 PM – 4:00 PM",
    },
    rules: [
      "Strictly Prohibited Content: Caste-based slurs, Religious insults, Racist remarks, Threats of violence, Family-related abuse, Defamation of real individuals within the college",
      "If content crosses limits, mic will be cut immediately and participant may be disqualified",
      "Allowed Content: Light roasting, Creative punchlines, Competitive disses within respectful limits, Wordplay and metaphor-driven attacks",
      "Conduct Regulations: No physical contact with opponent, No pushing/touching/invading personal space, No throwing objects, No alcohol or substance use before performance, Respect judges, host, and audience",
      "Violation = Immediate disqualification",
    ],
  },
  robo: {
    id: "robo",
    name: "Robo Soccer",
    category: "Technical Event",
    description:
      "Robo Soccer is a competitive robotics event where teams design and operate manually controlled robots to compete in a football-style match. The objective is to score more goals than the opponent within the allotted time while complying with technical, safety, and control regulations. The event evaluates engineering design, performance efficiency, and tactical execution.",
    objective: [
      "Promote hands-on robotics development",
      "Encourage strategic thinking and teamwork",
      "Test robot design efficiency and maneuverability",
      "Evaluate technical knowledge through viva assessment",
      "Ensure safe and fair competitive gameplay",
    ],
    participation: {
      teamSize: "Maximum 3 Members",
      registrationFee: "₹219 per team",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Match Format: 6-minute match (3 minutes per half)",
      "1-minute halftime break",
      "3-minute reporting delay results in walkover",
      "Scoring: 1 Goal = 1 Point, Ball must completely cross goal line, Own goal counts for opponent",
      "Tie Breaker: 2-minute sudden death, 3 penalty shots per team, Sudden shootout if required",
    ],
    judgingCriteria: [
      "Total 100 Marks:",
      "Technical Evaluation (Robot structure, innovation, design features) – 40 Marks",
      "Performance During Match – 40 Marks",
      "Viva (Materials, circuitry, mechanism explanation) – 20 Marks",
      "Referee and evaluation panel decision will be final",
    ],
    requirements: [
      "Field Specifications: Rectangular field (6 ft × 4 ft), Flat smooth surface, Goal width: 30 cm, Goal depth: Minimum 10 cm",
      "Robot Specifications: Maximum size: 25 cm × 25 cm, No sharp edges or hazardous projections, No ball grabbing or trapping mechanisms",
      "Power System: External AC supply provided, Maximum operating voltage: 24V DC, Batteries allowed up to 24V DC",
      "Control System: Manual control only, Wireless (Bluetooth/WiFi – ESP based) allowed",
    ],
    prizeStructure: {
      prizePool: "₹5,000",
      details: ["Certificates for all participants"],
    },
    schedule: {
      date: "28th March",
      venue: "SOET 3101",
      time: "10:00 AM – 1:00 PM",
    },
    rules: [
      "Fouls & Penalties: Minor Foul (Blocking, pushing, trapping) – Free hit",
      "Major Foul (Damage, voltage violation) – Goal awarded or disqualification",
      "Intentional damage leads to penalty/disqualification",
      "Signal interference strictly prohibited",
    ],
  },
  bgmi: {
    id: "bgmi",
    name: "BGMI",
    category: "Gaming Event",
    description:
      "BGMI – Signifiya Cup S1 is a competitive Battle Royale esports tournament conducted under official competitive integrity standards. The event follows structured match parameters, scoring systems, anti-cheat regulations, and professional conduct guidelines to ensure fairness and high-level gameplay.",
    objective: [
      "Promote structured esports competition",
      "Encourage strategic squad gameplay",
      "Ensure competitive integrity and fair play",
      "Provide professional LAN tournament exposure",
    ],
    participation: {
      teamSize: "4 Players (Starting Lineup)",
      registrationFee: "₹399 per team",
      eligibility:
        "Minimum age: 16 years, Minimum Rank: Platinum I, Minimum Level: 30, Indian Nationals only, Single Team Exclusivity enforced",
    },
    format: [
      "Match Parameters: Mode: TPP, Maps: Erangel, Miramar, Sanhok, Red Zone: Disabled, Flare Guns: Disabled, Aim Assist: Disabled, Playzone Speed: x1.1",
      "Scoring System - Placement Points: 1st–10, 2nd–6, 3rd–5, 4th–4, 5th–3, 6th–2, 7–8–1, 9–20–0",
      "Elimination: 1 finish = 1 point",
      "Tie-breakers: Most first-place finishes, Highest cumulative placement points, Highest finishes across matches, Latest match placement",
    ],
    judgingCriteria: [
      "Strict prohibition on: Collusion, Cheating/third-party tools, Exploiting game bugs, Ringing, Vulgar or hateful speech, Gambling, Streaming without permission",
      "Violation = Disqualification + Ban",
    ],
    requirements: [
      "Venue: Convention Hall",
      "LAN Setup",
      "Stable internet",
      "Referee Panel",
      "Projection Display",
      "Anti-cheat monitoring",
    ],
    prizeStructure: {
      prizePool: "₹40,000",
      details: ["Certificates for all participants"],
    },
    schedule: {
      date: "28th March",
      venue: "Convention Hall",
      time: "10:00 AM – 4:00 PM",
    },
  },
  efootball: {
    id: "efootball",
    name: "E-Football",
    category: "Gaming Event",
    description:
      "E-Football is a competitive mobile football simulation tournament conducted under standardized match settings to ensure skill-based competition. All participants must adhere strictly to the non-negotiable gameplay configurations.",
    objective: [
      "Promote fair and skill-based competition",
      "Encourage strategic gameplay and tactical control",
      "Maintain professional esports standards",
    ],
    participation: {
      teamSize: "1 Player (Individual)",
      registrationFee: "₹149",
      eligibility: "Open to inter-college participants",
    },
    format: [
      "Game Mode: Authentic Match-Up, Dream Team: Not Allowed, Custom Squads: Not Allowed",
      "Match Settings: Match Time: 6 Minutes, Extra Time: Enabled (Knockout), Penalties: Enabled, Smart Assist: OFF (Mandatory), Uniform Ratings Only",
      "Team Selection Rules: Teams from Top European Leagues only, Team locked after selection, Maximum 2 changes during tournament (with admin approval)",
    ],
    judgingCriteria: [
      "Fair Play Regulations: No time-wasting, No glitch abuse, No exploit usage, No lag manipulation",
      "Violation = Immediate Forfeit",
    ],
    requirements: [
      "Venue: Seminar Hall",
      "Mobile devices only",
      "Stable WiFi",
      "Admin Panel",
      "Scoreboard tracking",
    ],
    prizeStructure: {
      prizePool: "₹15,000",
      details: ["Certificates for participants"],
    },
    schedule: {
      date: "28th March",
      venue: "Seminar Hall",
      time: "10:00 AM – 4:00 PM",
    },
  },
  freefire: {
    id: "freefire",
    name: "Free Fire",
    category: "Gaming Event",
    description:
      "Free Fire – Signifiya 2026 is a competitive Squad Battle Royale tournament conducted under official esports tournament rules ensuring fairness, anti-cheat compliance, and structured scoring.",
    objective: [
      "Promote squad coordination and strategy",
      "Ensure professional competitive integrity",
      "Provide esports platform for emerging players",
    ],
    participation: {
      teamSize: "4 Players",
      registrationFee: "₹399 per team",
      eligibility:
        "Minimum Age: 16 years, Minimum Level: 40, Minimum Rank: Platinum, Indian Nationals only",
    },
    format: [
      "Game Mode: Squad Mode Battle Royale",
      "Map Pool: Bermuda, Kalahari, Purgatory",
      "Scoring (Punch Table): 1st–12, 2nd–9, 3rd–8, 4th–7, 5th–6, 6th–5, 7th–4, 8th–3, 9th–2, 10th–1, 11–12–0",
      "Kills: 1 point per kill",
    ],
    judgingCriteria: [
      "Strictly prohibited: Teaming, Bug exploitation, Hacks or third-party tools, Ringing, Vulgar speech, Streaming without permission",
      "Rehost conditions allowed only under organizer discretion",
    ],
    requirements: [
      "Venue: Convention Hall",
      "Mobile devices only (No emulators)",
      "Stable internet",
      "Referee Panel",
      "Projection display",
    ],
    prizeStructure: {
      prizePool: "₹20,000",
      details: ["Certificates for all participants"],
    },
    schedule: {
      date: "27th March",
      venue: "Convention Hall",
      time: "1:30 PM – 7:00 PM",
    },
  },
};
