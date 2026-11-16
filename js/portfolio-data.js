/**
 * Gaurav Gautam — Personal Portfolio Configuration & Data Layer
 * Single source of truth for all projects, research, academic credentials, and links.
 * All claims grounded strictly in verified resume and GitHub repository evidence.
 */

const PORTFOLIO_DATA = {
  profile: {
    name: "Gaurav Gautam",
    monogram: "GG",
    role: "AI/ML Engineer in the Making · Research · Full-Stack Systems",
    institution: "SRM University-AP",
    degree: "B.Tech Computer Science and Engineering (Minor in Mathematics)",
    cgpa: "9.49 / 10.0",
    cgpaNote: "Through 4th Semester",
    location: "Amaravati, Andhra Pradesh, India",
    email: "ggraipurchor@gmail.com",
    githubUsername: "ggthedeveloper",
    githubUrl: "https://github.com/ggthedeveloper",
    linkedinUrl: "https://linkedin.com/in/ggthedeveloper",
    shortBio: "Computer Science undergraduate specializing in AI/ML systems, Transformer model compression (CoFi pruning, QA-LoRA), and full-stack engineering. Focused on turning complex geospatial, climate, and operational data into resilient applications.",
    aboutParagraphs: [
      "I am an undergraduate researcher and full-stack software engineer at SRM University-AP with a current CGPA of 9.49/10.0. My work sits at the convergence of efficient deep learning systems and resilient software engineering: training and compressing Transformer models for constrained environments, and building production-grade web systems that solve tangible national and civic challenges.",
      "During my research internships at IIT Bhubaneswar and SRM University-AP, I focused on structured pruning (CoFi) and parameter-efficient fine-tuning (QA-LoRA, 4-bit/8-bit quantization), investigating how to retain strong downstream accuracy while reducing compute and memory footprints.",
      "Beyond machine learning, I engineer end-to-end applications with React 19, TypeScript, and FastAPI microservices—from national hackathon finalists like VarshaPurvanumanAI (climate post-processing) and RailSamanvayAI (railway block optimization) to urban waterlogging early-warning systems."
    ]
  },

  projects: [
    {
      id: "varshapurvanuman",
      title: "VarshaPurvanumanAI",
      subtitle: "India-Scale Regime-Aware AI/ML Precipitation Post-Processing System",
      category: "Climate AI & Systems",
      badge: "SIH 2026 Internal Finalist (SIH26080)",
      targetOrg: "Ministry of Earth Sciences (MoES) / IMD / NCMRWF",
      team: "The Steel Bytes 800 (Team Lead)",
      statusLabel: "Production Prototype v2.0.0",
      featured: true,
      summary: "AI/ML post-processing platform for spatial downscaling of coarse NWP rainfall models to localized grids across India, coupled with asynchronous FastAPI microservices and an interactive telemetry dashboard.",
      problem: "Numerical Weather Prediction (NWP) precipitation forecasts frequently lack the micro-scale spatial resolution and regime awareness needed to predict localized extreme rainfall events, causing delayed alerts and response bottlenecks in climate resilience operations.",
      solution: "Architected a dual-stage post-processing pipeline featuring hierarchical weather regime classification across Indian meteorological zones and spatial downscaling models. Paired with asynchronous FastAPI microservices and an interactive React 19 telemetry console.",
      contribution: "Team lead and core ML/backend architect. Designed the async FastAPI inference microservices, data ingestion modules, and telemetry frontend in React 19 & TypeScript, verified with 150 automated tests.",
      stack: ["Python 3.13+", "PyTorch", "FastAPI", "React 19", "TypeScript", "Tailwind CSS v4", "Vite", "Pytest", "Vitest"],
      metrics: "150 automated tests (122 backend pytest + 28 frontend vitest, 100% pass rate).",
      githubUrl: "https://github.com/ggthedeveloper/VarshaPurvanumanAI",
      demoUrl: "https://varsha-purvanuman-ai.vercel.app/",
      demoStatus: "verified_live",
      highlights: [
        "Hierarchical weather regime classification tailored for Indian monsoon dynamics",
        "Asynchronous FastAPI backend with sub-50ms query responses",
        "React 19 & Vite frontend featuring real-time radar overlays and alert dispatches",
        "150/150 automated tests passing across backend and frontend suites"
      ],
      visualTheme: "cyan"
    },
    {
      id: "railsamanvay",
      title: "RailSamanvayAI",
      subtitle: "Intelligent Maintenance Planning & Conflict-Aware Block Scheduling",
      category: "Operational Optimization",
      badge: "SIH 2026 Internal Finalist (SIH26027)",
      targetOrg: "Ministry of Railways",
      team: "SIH 2026 Team Project",
      statusLabel: "Interactive Prototype",
      featured: true,
      summary: "AI-driven decision-support platform for railway maintenance block scheduling that balances asset failure probability, track possession windows, and crew constraints.",
      problem: "Railway maintenance departments struggle with manual block scheduling where track possessions conflict with train timetables, crew availability, and equipment allocation, risking both track safety and network punctuality.",
      solution: "Engineered multi-constraint heuristic optimization algorithms that evaluate track asset degradation risk, available possession intervals, and crew schedules to generate conflict-free maintenance rosters and delay mitigation plans.",
      contribution: "Formulated the asset degradation risk scoring logic and built the interactive scheduling frontend in TypeScript and React.",
      stack: ["Python", "Scikit-Learn", "TypeScript", "React", "Tailwind CSS", "Optimization Algorithms"],
      metrics: "Multi-constraint heuristic solver balancing failure risk, track windows, and crew rosters.",
      githubUrl: "https://github.com/ggthedeveloper/RailSamanvayAI",
      demoUrl: "https://rail-samanvay-ai.vercel.app/",
      demoStatus: "verified_live",
      highlights: [
        "Predictive risk scoring on track assets based on wear telemetry and maintenance cycles",
        "Multi-constraint possession window conflict detection matrix",
        "Visual timeline and corridor Gantt viewer for railway section controllers",
        "Interactive scenario simulator for emergency track possession overrides"
      ],
      visualTheme: "amber"
    },
    {
      id: "drainsense",
      title: "DrainSense AI",
      subtitle: "Urban Waterlogging Early-Warning & Decision Intelligence",
      category: "Hydrology & Geospatial ML",
      badge: "Scientific Research Prototype",
      targetOrg: "Vijayawada / Amaravati Municipal Case Study",
      team: "Developer / Geospatial ML Engineer",
      statusLabel: "Research Prototype (18 Tests)",
      featured: true,
      summary: "Short-term urban flood early-warning intelligence estimating susceptibility across 810 spatial cells (500m × 500m) in Vijayawada/Amaravati using SRTM terrain, rainfall telemetry, and calibrated XGBoost with TreeSHAP.",
      problem: "Indian urban centers face recurrent catastrophic monsoon flash waterlogging (e.g., Budameru Rivulet inundation in Vijayawada) where emergency teams lack interpretable, localized susceptibility forecasts ahead of severe cloudbursts.",
      solution: "Discretized a 202.5 km² urban watershed into 810 deterministic 500m × 500m grid cells. Fused SRTM 30m digital elevation data, flow accumulation proxies, canal distances, and antecedent rainfall with a calibrated XGBoost classifier and TreeSHAP explainability.",
      contribution: "Built the geospatial ingestion pipeline, calibrated the XGBoost classifier, implemented TreeSHAP local explanations, and verified the pipeline with 18 automated tests.",
      stack: ["Python 3.11+", "XGBoost", "FastAPI", "Next.js 14", "Docker", "TreeSHAP", "SRTM DEM", "Pytest"],
      metrics: "810 discrete 500m cells; 18 automated pipeline tests; strictly bounded operational advisory scope.",
      githubUrl: "https://github.com/ggthedeveloper/DrainSenseAI",
      demoUrl: null,
      demoStatus: "prototype_repo",
      highlights: [
        "810 deterministic 500m × 500m grid cells covering the 202.5 km² Budameru & Krishna basin",
        "Calibrated XGBoost susceptibility model paired with local TreeSHAP attribution maps",
        "SRTM 30m terrain topography integration (elevation, slope, flow accumulation)",
        "Strictly bounded scientific positioning as operational decision-support tool"
      ],
      visualTheme: "blue"
    },
    {
      id: "smartroutefinder",
      title: "Smart Route Finder",
      subtitle: "Multi-Criteria Graph Navigation Engine on OpenStreetMap",
      category: "Graph Algorithms & Systems",
      badge: "Open-Source Navigation Engine",
      targetOrg: "OpenStreetMap Ecosystem",
      team: "Solo Developer",
      statusLabel: "Live Engine Deployment",
      featured: true,
      summary: "Full-stack routing engine applying Dijkstra and A* algorithms over real-world road network graphs retrieved via OSMnx, with multi-criteria comparisons and Folium map rendering.",
      problem: "Standard commercial mapping services are closed-source black boxes that do not allow algorithmic introspection or custom multi-objective routing (toll minimization vs. fuel vs. shortest distance).",
      solution: "Engineered a modular Python routing backend using OSMnx and NetworkX to dynamically extract, cache, and traverse road topology. Implemented Dijkstra and A* with haversine heuristics, calculating multi-route trade-offs rendered on interactive Folium layers.",
      contribution: "Built the entire application end-to-end: algorithm implementations, graph caching layer, Flask web interface, and interactive Folium HTML map visualizer.",
      stack: ["Python", "Flask", "OSMnx", "NetworkX", "Folium", "OpenRouteService", "OpenStreetMap"],
      metrics: "Dijkstra & A* graph traversals with dynamic route trade-offs and synthetic graph fallback.",
      githubUrl: "https://github.com/ggthedeveloper/Smart-Route-Finder",
      demoUrl: "https://smart-route-finder-n52n.onrender.com/",
      demoStatus: "verified_live",
      highlights: [
        "Custom Dijkstra and A* pathfinding implementations with haversine distance heuristics",
        "Dynamic OSMnx street network graph download and local caching mechanism",
        "Interactive Folium layer rendering comparing shortest, fastest, and alternative routes",
        "Built-in synthetic graph fallback for zero-dependency offline exploration"
      ],
      visualTheme: "emerald"
    },
    {
      id: "spaceshooter3d",
      title: "Space-Shooter-3D",
      subtitle: "Procedural 3D Space Combat Simulation in WebGL",
      category: "Graphics & Simulation",
      badge: "WebGL / Three.js Interactive Showcase",
      targetOrg: "Open Source Showcase",
      team: "Solo Developer",
      statusLabel: "Verified Live Showcase",
      featured: false,
      summary: "Fast 60-FPS browser arcade space combat built with Three.js and WebGL, featuring procedural asteroid field generation, spatial particle collisions, and custom shaders.",
      problem: "Demonstrating high-performance real-time rendering and state synchronization directly in client browsers without heavy game engines.",
      solution: "Engineered custom particle emission systems, procedural mesh generation, and bounding-box collision detection utilizing Three.js and raw WebGL APIs.",
      contribution: "Solo project developing 3D camera controls, shader effects, and game state loops.",
      stack: ["JavaScript", "Three.js", "WebGL", "HTML5 Canvas", "Web Audio API"],
      metrics: "60 FPS rendering loop with zero external game engine dependencies.",
      githubUrl: "https://github.com/ggthedeveloper/Space-Shooter-3D",
      demoUrl: "https://ggthedeveloper.github.io/Space-Shooter-3D/",
      demoStatus: "verified_live",
      highlights: [
        "Lightweight Three.js scene architecture maintaining smooth 60 FPS",
        "Custom procedural starfields and collision particle systems",
        "Keyboard and mobile-responsive flight controls"
      ],
      visualTheme: "purple"
    }
  ],

  research: [
    {
      institution: "Indian Institute of Technology (IIT) Bhubaneswar",
      role: "Research Intern — Transformer Model Compression & Efficient Deep Learning",
      period: "May 2026 – July 2026",
      location: "Remote / Supervised",
      summary: "Researched Transformer model compression utilizing CoFi structured pruning and QA-LoRA adaptation to enable efficient execution on resource-constrained compute hardware.",
      deliverables: [
        "Engineered pruning and fine-tuning pipelines using PyTorch and Hugging Face Transformers.",
        "Applied Coarse-to-Fine (CoFi) structured pruning to eliminate redundant attention heads, hidden dimensions, and feed-forward layers.",
        "Integrated Quantization-Aware Low-Rank Adaptation (QA-LoRA) to adapt pruned weights under low-bit quantization.",
        "Resume-reported outcome: Drastically reduced parameter footprints while retaining over 95% benchmark task accuracy (presented as resume-reported empirical result)."
      ],
      workflowSteps: [
        { title: "Dense Backbone", desc: "Base pretrained Transformer architecture loaded in PyTorch & Hugging Face" },
        { title: "CoFi Pruning", desc: "Structured coarse-to-fine mask learning across heads, layers, and MLP intermediate states" },
        { title: "QA-LoRA Adaptation", desc: "Quantization-aware low-rank adaptation applied to maintain parameter efficiency" },
        { title: "Empirical Evaluation", desc: "Task validation showing parameter footprint reduction with >95% retained benchmark accuracy" }
      ],
      note: "Workflow diagram serves as an explanatory illustration of the compression and adaptation paradigm reported in the resume."
    },
    {
      institution: "SRM University-AP",
      role: "Summer Research Fellow — Efficient AI Systems",
      period: "June 2026 – July 2026",
      location: "Amaravati, India",
      summary: "Investigated parameter-efficient fine-tuning (PEFT) pipelines under 4-bit and 8-bit post-training quantization across standard language benchmarks.",
      deliverables: [
        "Benchmarked GPU VRAM utilization, parameter footprint reduction, and zero-shot reasoning throughput.",
        "Analyzed speed-memory-accuracy trade-offs across quantized Transformer backbones.",
        "Evaluated memory bandwidth bottlenecks during low-resource edge deployment simulations."
      ],
      workflowSteps: [
        { title: "Quantization Setup", desc: "4-bit and 8-bit NF4/INT8 matrix precision quantization" },
        { title: "PEFT Injection", desc: "Low-Rank Adaptation (LoRA) adapter attachment to critical projection weights" },
        { title: "Throughput Benchmarking", desc: "Empirical VRAM profiling and token generation latency analysis" }
      ],
      note: "Exploratory research fellowship focusing on memory-constrained deployment trade-offs."
    }
  ],

  education: {
    institution: "SRM University-AP",
    location: "Amaravati, Andhra Pradesh, India",
    degree: "Bachelor of Technology in Computer Science and Engineering",
    minor: "Minor in Mathematics",
    period: "Aug 2024 – May 2028",
    cgpa: "9.49 / 10.0",
    cgpaDetails: "Through 4th semester",
    coursework: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming (C++)",
      "Database Management Systems",
      "Operating Systems",
      "Linear Algebra",
      "Probability & Statistics",
      "Graph Theory & Combinatorics"
    ],
    priorEducation: [
      {
        institution: "Intermediate High School Raipurchor",
        location: "Bihar, India",
        board: "BSEB — Senior Secondary (Class XII)",
        score: "77.2%",
        period: "2020 – 2022"
      },
      {
        institution: "Secondary School (Class X)",
        location: "Bihar, India",
        board: "BSEB — Secondary School Examination",
        score: "90.6%",
        period: "2020"
      }
    ]
  },

  skills: {
    languages: [
      { name: "C++", note: "DSA, OOP, System Fundamentals" },
      { name: "Python", note: "PyTorch, FastAPI, Scientific Stack" },
      { name: "TypeScript", note: "Typed Full-Stack Applications" },
      { name: "JavaScript (ES6+)", note: "Modern DOM & Asynchronous Architecture" },
      { name: "C", note: "Low-Level Computing & Memory Concepts" },
      { name: "SQL", note: "Relational Schemas & Analytical Queries" },
      { name: "Java", note: "Problem Solving with Software" }
    ],
    aiMl: [
      { name: "PyTorch", note: "Deep Learning & Model Training" },
      { name: "Hugging Face", note: "Transformer Pipelines & Tokenization" },
      { name: "CoFi Pruning", note: "Coarse-to-Fine Structured Compression" },
      { name: "QA-LoRA & PEFT", note: "Quantized Parameter-Efficient Adaptation" },
      { name: "Scikit-Learn", note: "Classical ML & Feature Pipelines" },
      { name: "XGBoost & TreeSHAP", note: "Gradient Boosting & Model Interpretability" },
      { name: "Pandas & NumPy", note: "Data Wrangling & Tensor Computations" }
    ],
    webBackend: [
      { name: "React 19", note: "Modern Hooks & Concurrent UI" },
      { name: "FastAPI", note: "High-Throughput Async REST APIs" },
      { name: "Node.js & Express", note: "Backend Runtimes & Middleware" },
      { name: "Next.js 14", note: "Server-Rendered Frameworks" },
      { name: "Vite", note: "Modern Build Orchestration" },
      { name: "Tailwind CSS", note: "Design Tokens & Utility Architecture" },
      { name: "Flask", note: "Lightweight Micro-Frameworks" }
    ],
    toolsDatabases: [
      { name: "Docker", note: "Containerized Workflows & Reproducibility" },
      { name: "MongoDB", note: "Document Stores (Certified Associate)" },
      { name: "MySQL", note: "Relational Database Management" },
      { name: "Git & GitHub", note: "Version Control & Branching Workflows" },
      { name: "Linux / Bash", note: "Shell Scripting & Server Administration" },
      { name: "Postman", note: "API Contract Verification" },
      { name: "Pytest & Vitest", note: "Automated Unit & Integration Testing" }
    ]
  },

  leadership: [
    {
      role: "Associate Convenor",
      organization: "Coding Club, SRM University-AP",
      period: "Sept 2026 – Present",
      description: "Co-lead a community of 500+ student developers. Organize campus hackathons, algorithmic coding competitions, and technical workshops in machine learning and modern web technologies."
    },
    {
      role: "Class Representative (CR)",
      organization: "SRM University-AP (CSE Department)",
      period: "Aug 2024 – Present",
      description: "Represent 60+ engineering undergraduates across 4 semesters. Serve as direct liaison with department faculty, academic coordinators, and university administration."
    },
    {
      role: "Internal Round Finalist",
      organization: "Smart India Hackathon (SIH 2026)",
      period: "2026",
      description: "Finalist at SRM University-AP internal screening round for nationwide disaster management (SIH26080) and railway block scheduling (SIH26027) solutions."
    }
  ],

  certifications: [
    {
      title: "MongoDB Certified Developer Associate",
      issuer: "MongoDB",
      status: "Verified Credential Listed in Resume"
    },
    {
      title: "Java Programming: Solving Problems with Software",
      issuer: "Duke University via Coursera",
      status: "Verified Coursework Listed in Resume"
    },
    {
      title: "Problem Solving (C++, DSA)",
      issuer: "HackerRank",
      status: "Verified Skill Assessment Listed in Resume"
    },
    {
      title: "100 Days of Code: The Complete Python Pro Bootcamp",
      issuer: "Udemy",
      status: "Verified Certificate Listed in Resume"
    }
  ]
};

// Freeze data to prevent accidental runtime mutations
if (typeof Object.freeze === "function") {
  Object.freeze(PORTFOLIO_DATA);
}

// Export for module environments or assign to global window for browser runtime
if (typeof module !== "undefined" && module.exports) {
  module.exports = PORTFOLIO_DATA;
}
