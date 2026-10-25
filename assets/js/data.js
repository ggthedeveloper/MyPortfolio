const PORTFOLIO_DATA = {
  currentStatus: {
    label: "Currently",
    text: "B.Tech CSE (Minor in Math) · SRM University-AP",
    detail: "Transformer Compression Researcher · CGPA 9.49"
  },
  availability: "Available for Roles & Research",

  experience: [
    {
      period: "May 2026 — July 2026",
      company: "Indian Institute of Technology (IIT) Bhubaneswar",
      role: "Research Intern (Transformer Compression)",
      desc: [
        "Researched Transformer compression architectures combining CoFi (Coarse- and Fine-grained structured pruning) with QA-LoRA (Quantization-Aware Low-Rank Adaptation).",
        "Engineered end-to-end PyTorch and Hugging Face evaluation pipelines; achieved sharp parameter count reduction while retaining >95% benchmark task accuracy.",
        "Benchmarked multi-head attention sparsity patterns and feedforward layer pruning against baseline BERT/RoBERTa architectures on high-performance compute clusters."
      ]
    },
    {
      period: "June 2026 — July 2026",
      company: "SRM University-AP · Efficient AI Lab",
      role: "Summer Research Fellow (Efficient AI)",
      desc: [
        "Investigated parameter-efficient fine-tuning (PEFT) pipelines under 4-bit NormalFloat (NF4) and 8-bit post-training quantization.",
        "Quantified GPU VRAM consumption, cache memory footprint, and token latency trade-offs on memory-constrained compute environments.",
        "Authored structured comparative technical reports on quantization-aware adaptation for resource-constrained edge deployments."
      ]
    }
  ],

  education: [
    {
      period: "2024 — 2028",
      institution: "SRM University-AP · Andhra Pradesh, India",
      degree: "Bachelor of Technology (B.Tech) in Computer Science & Engineering",
      desc: [
        "CGPA: 9.49 / 10.0 (Rank: Top 1% of B.Tech CSE Cohort)",
        "Minor Specialization in Mathematics",
        "Core Coursework: Data Structures & Algorithms, Design and Analysis of Algorithms, Database Management Systems (DBMS), Operating Systems, Computer Organization & Architecture, Object-Oriented Programming, Linear Algebra, Probability & Statistics."
      ]
    }
  ],

  research: [
    {
      link: "https://github.com/ggthedeveloper",
      image: "assets/preview-lab.png",
      imageLabel: "Transformer Compression & Sparsity Lab",
      badge: "IIT Bhubaneswar & SRM University-AP · Research Fellowship",
      title: "Structured Transformer Pruning & Quantization-Aware Adaptation (CoFi + QA-LoRA)",
      description: "Investigated holistic compression strategies for dense Transformer models under compute constraints. Synergized coarse- and fine-grained structured pruning (CoFi) with low-rank quantization adaptation (QA-LoRA), drastically reducing parameter counts while maintaining over 95% downstream benchmark accuracy.",
      techs: ["PyTorch", "Hugging Face", "CoFi Pruning", "QA-LoRA", "PEFT", "Transformers", "CUDA"],
      linkText: "View Code & Telemetry ↗",
      meta: [
        { label: "Institution", value: "IIT Bhubaneswar & SRM-AP" },
        { label: "Accuracy Retained", value: ">95% on GLUE" },
        { label: "Architecture", value: "CoFi + QA-LoRA" }
      ]
    }
  ],

  projects: [
    {
      link: "https://varsha-purvanuman-ai.vercel.app/",
      image: "assets/images/projects/varsha-hero.png",
      frame: "browser",
      imageLabel: "Climate Downscaling Dashboard",
      badge: "SIH 2026 Finalist · SIH26080 · MoES / IMD",
      title: "VarshaPurvanumanAI: India-Scale Regime-Aware Rainfall Downscaling",
      description: "Architected a dual-stage post-processing pipeline featuring hierarchical weather regime classification and spatial downscaling models for the Ministry of Earth Sciences (MoES / IMD). Built with asynchronous FastAPI microservices, an interactive React telemetry dashboard, and validated with 150 automated tests.",
      techs: ["PyTorch", "FastAPI", "React", "Python", "Tailwind CSS", "Scikit-Learn", "Docker", "REST API"],
      linkText: "Live Demo ↗",
      github: "https://github.com/ggthedeveloper/VarshaPurvanumanAI",
      extraVisualClass: "",
      caseStudy: {
        slug: "varshapurvanuman",
        tagline: "India-scale regime-aware AI/ML rainfall downscaling system built for Ministry of Earth Sciences & IMD.",
        meta: [
          { label: "Role", value: "Team Lead & ML Architect" },
          { label: "Domain", value: "Climate AI & Telemetry" },
          { label: "Stack", value: "PyTorch · FastAPI · React" },
          { label: "Status", value: "Live · 150 Tests" }
        ],
        problem: [
          "Numerical Weather Prediction (NWP) precipitation forecasts frequently lack the micro-scale spatial resolution and regime awareness needed to predict localized extreme rainfall events.",
          "VarshaPurvanumanAI bridges raw grid simulations and localized forecasting through regime-conditioned deep learning post-processing."
        ],
        features: [
          "Hierarchical meteorological weather regime classification across Indian sub-regions",
          "Spatial precipitation downscaling with localized micro-climate correction",
          "Asynchronous FastAPI ingestion microservices",
          "Interactive React telemetry dashboard with live geospatial heatmaps",
          "Automated CI/CD validation suite with 150 unit and integration tests"
        ],
        results: [
          { value: "150+", label: "Passing Automated Tests" },
          { value: "SIH26080", label: "MoES Problem Statement" },
          { value: "Sub-daily", label: "Telemetry Ingestion" },
          { value: "Live", label: "Deployed on Vercel" }
        ],
        links: [
          { label: "Live Demo ↗", url: "https://varsha-purvanuman-ai.vercel.app/" },
          { label: "GitHub ↗", url: "https://github.com/ggthedeveloper/VarshaPurvanumanAI" }
        ]
      }
    },
    {
      link: "https://rail-samanvay-ai.vercel.app/",
      image: "assets/images/projects/railsamanvay-hero.jpg",
      frame: "browser",
      imageLabel: "Railway Dispatch Optimizer",
      badge: "SIH 2026 Finalist · SIH26027 · Ministry of Railways",
      title: "RailSamanvayAI: Intelligent Railway Maintenance Block Scheduling",
      description: "Engineered an intelligent maintenance block scheduling and operational conflict optimization platform for the Ministry of Railways. Implemented multi-constraint combinatorial solvers balancing asset failure probability, track possession windows, and crew rosters.",
      techs: ["Python", "FastAPI", "Scikit-Learn", "React", "Tailwind CSS", "Optimization", "Vercel"],
      linkText: "Live Demo ↗",
      github: "https://github.com/ggthedeveloper/RailSamanvayAI",
      extraVisualClass: "",
      caseStudy: {
        slug: "railsamanvay",
        tagline: "AI railway block scheduling and conflict elimination for Ministry of Railways.",
        meta: [
          { label: "Role", value: "Core Developer" },
          { label: "Domain", value: "Operations Research & AI" },
          { label: "Stack", value: "Python · Scikit-Learn · React" },
          { label: "Status", value: "Live" }
        ],
        problem: [
          "Railway networks struggle with track possession contention between scheduled traffic and vital infrastructure maintenance blocks.",
          "RailSamanvayAI uses combinatorial solvers to automatically resolve schedule conflicts while minimizing train delays."
        ],
        results: [
          { value: "SIH26027", label: "Railways Problem Statement" },
          { value: "Zero", label: "Direct Block Conflicts" },
          { value: "Live", label: "Deployed on Vercel" }
        ],
        links: [
          { label: "Live Demo ↗", url: "https://rail-samanvay-ai.vercel.app/" },
          { label: "GitHub ↗", url: "https://github.com/ggthedeveloper/RailSamanvayAI" }
        ]
      }
    },
    {
      link: "https://github.com/ggthedeveloper/DrainSenseAI",
      image: "animated-drainsense",
      frame: "browser",
      isAnimatedGrid: true,
      imageLabel: "810-Grid Cell Flood Inundation Matrix",
      badge: "Urban Hydrology · ML Early Warning",
      title: "DrainSenseAI: 810-Grid Cell Urban Flood Susceptibility Mapping",
      description: "Developed an urban flood early-warning model across 810 spatial grid cells in Vijayawada. Integrated extreme rainfall telemetry, SRTM elevation data, and municipal drainage layers with TreeSHAP feature explainability, backed by 18 automated tests.",
      techs: ["Python", "TreeSHAP", "XGBoost", "GIS", "GeoPandas", "Scikit-Learn", "FastAPI"],
      linkText: "GitHub Codebase ↗",
      github: "https://github.com/ggthedeveloper/DrainSenseAI",
      extraVisualClass: "drainsense-visual"
    },
    {
      link: "https://smart-route-finder-n52n.onrender.com/",
      image: "assets/images/projects/smartroute-hero.png",
      frame: "browser",
      imageLabel: "Topological Route Finder",
      badge: "Graph Theory · Algorithmic Navigation",
      title: "Smart Route Finder: Multi-Criteria OpenStreetMap Pathfinding",
      description: "Engineered a graph pathfinding application over OpenStreetMap road networks using OSMnx, NetworkX, Dijkstra, and A*. Dynamic heuristic cost functions factor road distance, surface roughness, and topological grade elevation.",
      techs: ["Python", "OSMnx", "NetworkX", "Flask", "OpenStreetMap", "Leaflet.js", "Render"],
      linkText: "Live Demo ↗",
      github: "https://github.com/ggthedeveloper/Smart-Route-Finder",
      extraVisualClass: ""
    },
    {
      link: "https://ggthedeveloper.github.io/Space-Shooter-3D/",
      image: "assets/images/projects/spaceshooter-hero.png",
      frame: "browser",
      imageLabel: "WebGL Flight Arcade",
      badge: "60-FPS WebGL · Three.js Graphics",
      title: "Space-Shooter-3D: Interactive Browser Flight Simulator",
      description: "Architected a responsive, 60-FPS browser-based arcade space combat simulator with Three.js, featuring procedural starfields, custom particle thrusters, spatial Web Audio synthesis, and mobile touch flight controls.",
      techs: ["JavaScript", "Three.js", "WebGL", "Web Audio API", "HTML5 Canvas"],
      linkText: "Play Live ↗",
      github: "https://github.com/ggthedeveloper/Space-Shooter-3D",
      extraVisualClass: ""
    }
  ],

  skills: [
    {
      category: "Languages",
      tags: ["Python", "C", "C++", "Java", "JavaScript", "TypeScript", "SQL", "Bash"]
    },
    {
      category: "AI / ML & Deep Learning",
      tags: ["PyTorch", "Hugging Face", "Scikit-Learn", "PEFT", "Transformers", "TreeSHAP", "XGBoost", "Pandas", "NumPy"]
    },
    {
      category: "Backend & Systems",
      tags: ["FastAPI", "Node.js", "Express.js", "REST APIs", "WebSockets", "Asynchronous Python"]
    },
    {
      category: "Frontend & UI",
      tags: ["React.js", "Tailwind CSS", "HTML5", "CSS3", "Three.js", "Responsive Design"]
    },
    {
      category: "Databases",
      tags: ["PostgreSQL", "MongoDB", "MySQL", "Redis"]
    },
    {
      category: "Core Computer Science",
      tags: ["DSA", "Algorithms", "DBMS", "Operating Systems", "OOP", "System Architecture"]
    },
    {
      category: "Tools & DevOps",
      tags: ["Git & GitHub", "Docker", "Linux", "Postman", "VS Code", "Vercel", "Render"]
    }
  ],

  certifications: [
    {
      icon: "code",
      date: "2026-06",
      title: "Transformer Compression & Deep Learning Fellowship",
      sub: "IIT Bhubaneswar & SRM University-AP · 2026"
    },
    {
      icon: "server",
      date: "2026-04",
      title: "High-Performance Systems & Microservices",
      sub: "FastAPI, Docker & Asynchronous Architecture · 2026"
    },
    {
      icon: "database",
      date: "2025-12",
      title: "Advanced Database Architecture & Algorithms",
      sub: "PostgreSQL, MongoDB & Algorithmic Optimization · 2025"
    }
  ],

  achievements: [
    {
      icon: "trophy",
      date: "2026-03",
      title: "Smart India Hackathon (SIH 2026) Finalist",
      sub: "Internal Finalist across 2 Ministry Problem Statements (MoES SIH26080 & Railways SIH26027)"
    },
    {
      icon: "medal",
      date: "2026-04",
      title: "Academic Merit Scholar (CGPA 9.49 / 10.0)",
      sub: "Ranked in the top 1% of the B.Tech CSE cohort at SRM University-AP"
    },
    {
      icon: "award",
      date: "2026-05",
      title: "150+ Automated Test Suite Deployment",
      sub: "Zero-regression testing and CI/CD validation across machine learning microservices"
    },
    {
      icon: "patent",
      date: "2026-02",
      title: "21 Public Open-Source Repositories",
      sub: "Active open-source contributions across AI/ML downscaling, optimization, and graphs"
    }
  ],

  leadership: [
    {
      role: "Associate Convenor",
      org: "Coding Club SRMAP",
      period: "2025 — Present",
      current: true
    },
    {
      role: "Technical Workshop Lead",
      org: "Department of Computer Science & Engineering, SRM-AP",
      period: "2025 — 2026"
    },
    {
      role: "Hackathon Technical Mentor",
      org: "SRM University-AP Peer Engineering Network",
      period: "2025 — 2026"
    }
  ]
};
