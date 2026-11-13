/**
 * Shared frontend data store (localStorage only — no backend).
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "rj_portfolio_store_v2";
  var AUTH_KEY = "rj_admin_demo_auth";

  var DEFAULT_DATA = {
    profile: {
      name: "Raymond John",
      role: "Software Developer",
      location: "Nigeria",
      tagline: "I build the systems businesses actually run on.",
      intro:
        "Websites, web apps and backend structure with clarity first — so the product feels intentional and keeps working after launch.",
      email: "hello@raymondjohn.dev",
      whatsapp: "+234 XXX XXX XXXX",
      whatsappUrl: "https://wa.me/2340000000000",
      github: "github.com/raymondjohn",
      githubUrl: "https://github.com/",
      linkedin: "linkedin.com/in/raymondjohn",
      linkedinUrl: "https://linkedin.com/",
      bioLead:
        "I'm Raymond John, a software developer passionate about building digital products and solving real-world problems through technology.",
      bio:
        "I work across the stack — from clean, accessible interfaces to structured backend systems and databases. My focus is creating solutions that feel intentional for users and reliable for businesses. I enjoy turning rough ideas into organised digital products: clear pages, useful flows and technical foundations that can grow with the project.",
      philosophy:
        "Great software is more than working code — it is clarity in structure, care in craft, and solutions that respect both the problem and the people who use them.",
      interests: [
        "Software development",
        "Web application development",
        "Backend development",
        "Database management",
        "User interface design",
        "Business digital solutions",
      ],
    },
    aboutMeta: {
      journey: [
        {
          id: "j1",
          label: "Foundation",
          title: "Learning the craft",
          text: "Building a strong base in HTML, CSS, JavaScript and structured problem solving.",
        },
        {
          id: "j2",
          label: "Application",
          title: "Building for the web",
          text: "Creating websites and web applications with PHP, MySQL and modern frontend techniques.",
        },
        {
          id: "j3",
          label: "Focus",
          title: "Solving real problems",
          text: "Designing digital products that help businesses present services and reach customers.",
        },
        {
          id: "j4",
          label: "Today",
          title: "Refining the experience",
          text: "Improving interface quality, animation craft and end-to-end product thinking.",
        },
      ],
      education: [
        {
          id: "e1",
          title: "Software Development Studies",
          place: "Self-directed & formal learning",
          period: "Ongoing",
          detail: "Focus on web technologies, databases and application structure.",
        },
      ],
      experience: [
        {
          id: "x1",
          title: "Software Developer",
          place: "Independent / Client projects",
          period: "Present",
          detail: "Designing and developing websites and web applications for businesses.",
        },
      ],
    },
    skills: {
      frontend: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
      backend: ["PHP", "MySQL", "REST API Development"],
      tools: ["Git", "GitHub", "VS Code"],
    },
    services: [
      {
        id: "s1",
        title: "Website Development",
        description:
          "Custom, responsive websites built with clean markup, modern CSS and purposeful interaction.",
        published: true,
      },
      {
        id: "s2",
        title: "Business Website Design",
        description:
          "Professional online presence for brands — structured layouts, clear messaging and conversion-focused pages.",
        published: true,
      },
      {
        id: "s3",
        title: "Web Application Development",
        description: "Functional web applications tailored to workflows, users and business operations.",
        published: true,
      },
      {
        id: "s4",
        title: "PHP Backend Development",
        description: "Server-side logic, authentication flows and application architecture with PHP.",
        published: true,
      },
      {
        id: "s5",
        title: "Database Development",
        description:
          "Structured MySQL schemas and data flows that keep applications reliable and maintainable.",
        published: true,
      },
      {
        id: "s6",
        title: "Website Maintenance",
        description:
          "Ongoing updates, fixes and improvements to keep existing sites secure and performing well.",
        published: true,
      },
    ],
    process: [
      {
        id: "p1",
        num: "01",
        title: "Discover",
        text: "Understand the business, goals and requirements.",
      },
      {
        id: "p2",
        num: "02",
        title: "Design",
        text: "Plan the structure, user experience and interface.",
      },
      {
        id: "p3",
        num: "03",
        title: "Develop",
        text: "Build the frontend, backend and database functionality.",
      },
      {
        id: "p4",
        num: "04",
        title: "Deliver",
        text: "Test, optimize and prepare the final solution.",
      },
    ],
    projects: [
      {
        id: "rd-vendora",
        title: "RD Vendora",
        category: "Marketplace",
        summary:
          "A multi-vendor marketplace designed to help businesses create online storefronts and reach customers.",
        overview:
          "RD Vendora is a multi-vendor marketplace concept focused on helping businesses open online storefronts and connect with customers through a structured product experience.",
        objectives: [
          "Support multiple vendor storefronts",
          "Present products clearly to shoppers",
          "Provide a scalable marketplace structure",
        ],
        features: [
          "Vendor-oriented storefront concept",
          "Product browsing experience",
          "Category-based discovery",
          "Responsive storefront layouts",
        ],
        technologies: ["PHP", "MySQL", "JavaScript", "HTML / CSS"],
        liveUrl: "",
        githubUrl: "",
        published: true,
        featured: true,
        coverLabel: "RD Vendora — Screenshot Placeholder",
        galleryLabels: ["Storefront overview placeholder", "Vendor dashboard placeholder"],
        order: 1,
      },
      {
        id: "feel-good-spa",
        title: "Feel Good Spa",
        category: "Hospitality",
        summary:
          "A premium spa and massage website designed to present services and create a professional online experience.",
        overview:
          "Feel Good Spa is a hospitality website concept crafted to present spa services with calm visual hierarchy and a clear booking-oriented structure.",
        objectives: [
          "Communicate a premium wellness brand",
          "Present treatments clearly",
          "Guide visitors toward enquiry or booking",
        ],
        features: [
          "Service presentation pages",
          "Atmospheric visual direction",
          "Clear calls to action",
          "Mobile-first layout",
        ],
        technologies: ["HTML", "CSS", "JavaScript", "Bootstrap"],
        liveUrl: "",
        githubUrl: "",
        published: true,
        featured: true,
        coverLabel: "Feel Good Spa — Screenshot Placeholder",
        galleryLabels: ["Hero atmosphere placeholder", "Services layout placeholder"],
        order: 2,
      },
      {
        id: "travelbookings",
        title: "TravelBookings",
        category: "Travel",
        summary:
          "A travel booking platform concept designed around flight and hotel discovery and reservations.",
        overview:
          "TravelBookings explores a travel discovery experience focused on flights, hotels and a streamlined reservation journey.",
        objectives: [
          "Simplify flight and hotel discovery",
          "Support a clear booking flow concept",
          "Present destinations with clarity",
        ],
        features: [
          "Search-oriented interface concept",
          "Flight and hotel browsing",
          "Reservation flow structure",
          "Responsive results layouts",
        ],
        technologies: ["PHP", "MySQL", "JavaScript", "REST API"],
        liveUrl: "",
        githubUrl: "",
        published: true,
        featured: true,
        coverLabel: "TravelBookings — Screenshot Placeholder",
        galleryLabels: ["Search results placeholder", "Booking flow placeholder"],
        order: 3,
      },
      {
        id: "crystallite-school",
        title: "Crystallite School",
        category: "Education",
        summary:
          "An educational platform concept focused on school management, e-learning, assignments and examinations.",
        overview:
          "Crystallite School is an education platform concept covering school management workflows, learning content, assignments and examinations.",
        objectives: [
          "Centralize school management tools",
          "Support learning and assignment flows",
          "Organize examinations digitally",
        ],
        features: [
          "School management modules concept",
          "E-learning structure",
          "Assignments workflow",
          "Examinations overview",
        ],
        technologies: ["PHP", "MySQL", "JavaScript", "HTML / CSS"],
        liveUrl: "",
        githubUrl: "",
        published: true,
        featured: false,
        coverLabel: "Crystallite School — Screenshot Placeholder",
        galleryLabels: ["Dashboard placeholder", "Learning module placeholder"],
        order: 4,
      },
    ],
    messages: [],
    media: [
      {
        id: "m1",
        name: "Portrait placeholder",
        type: "image",
        label: "Professional portrait placeholder",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m2",
        name: "Project cover placeholders",
        type: "image",
        label: "Project screenshot placeholders",
        createdAt: new Date().toISOString(),
      },
    ],
    settings: {
      siteTitle: "Raymond John — Software Developer",
      siteDescription:
        "Software developer portfolio — modern websites, web applications and digital solutions.",
      accentColor: "#FF4F1A",
      showProcess: true,
      maintenanceMode: false,
    },
    adminProfile: {
      displayName: "Raymond John",
      username: "admin",
      email: "admin@raymondjohn.dev",
      role: "Administrator",
      // Demo only — not secure authentication
      demoPassword: "admin123",
    },
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        var seeded = clone(DEFAULT_DATA);
        save(seeded);
        return seeded;
      }
      var parsed = JSON.parse(raw);
      return Object.assign(clone(DEFAULT_DATA), parsed, {
        profile: Object.assign({}, DEFAULT_DATA.profile, parsed.profile || {}),
        aboutMeta: Object.assign({}, DEFAULT_DATA.aboutMeta, parsed.aboutMeta || {}),
        skills: Object.assign({}, DEFAULT_DATA.skills, parsed.skills || {}),
        settings: Object.assign({}, DEFAULT_DATA.settings, parsed.settings || {}),
        adminProfile: Object.assign({}, DEFAULT_DATA.adminProfile, parsed.adminProfile || {}),
        projects: parsed.projects || DEFAULT_DATA.projects,
        services: parsed.services || DEFAULT_DATA.services,
        process: parsed.process || DEFAULT_DATA.process,
        messages: parsed.messages || [],
        media: parsed.media || DEFAULT_DATA.media,
      });
    } catch (e) {
      return clone(DEFAULT_DATA);
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    try {
      global.dispatchEvent(new CustomEvent("rj:data-updated", { detail: data }));
    } catch (err) {}
  }

  function uid(prefix) {
    return (prefix || "id") + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function getPublishedProjects() {
    return load()
      .projects.filter(function (p) {
        return p.published;
      })
      .sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
      });
  }

  function getProjectById(id) {
    return load().projects.find(function (p) {
      return p.id === id;
    });
  }

  function getPublishedServices() {
    return load().services.filter(function (s) {
      return s.published !== false;
    });
  }

  function isAdminLoggedIn() {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function loginDemo(username, password) {
    var data = load();
    var ok =
      username === data.adminProfile.username && password === data.adminProfile.demoPassword;
    if (ok) {
      try {
        sessionStorage.setItem(AUTH_KEY, "1");
      } catch (e) {}
    }
    return ok;
  }

  function logoutDemo() {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch (e) {}
  }

  function resetToDefaults() {
    var data = clone(DEFAULT_DATA);
    save(data);
    return data;
  }

  global.RJData = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_DATA: DEFAULT_DATA,
    load: load,
    save: save,
    uid: uid,
    clone: clone,
    getPublishedProjects: getPublishedProjects,
    getProjectById: getProjectById,
    getPublishedServices: getPublishedServices,
    isAdminLoggedIn: isAdminLoggedIn,
    loginDemo: loginDemo,
    logoutDemo: logoutDemo,
    resetToDefaults: resetToDefaults,
  };
})(window);
