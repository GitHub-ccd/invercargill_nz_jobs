"use client";
import { useRef, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const industryData = {
  labels: [
    "Rental, hiring & real estate",
    "Construction",
    "Agriculture, forestry & fishing",
    "Financial & insurance services",
    "Retail trade",
    "Professional, scientific & technical",
    "Health care & social assistance",
  ],
  datasets: [
    {
      label: "Number of Businesses",
      data: [951, 636, 606, 522, 414, 384, 258],
      backgroundColor: [
        "#81B29A",
        "#F2CC8F",
        "#E07A5F",
        "#3D405B",
        "#F4F1DE",
        "#B0A8B9",
        "#8E8D8A",
      ],
      borderColor: "#FFFFFF",
      borderWidth: 2,
      borderRadius: 5,
    },
  ],
};

const industryOptions = {
  indexAxis: "y" as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#3D405B",
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
      padding: 10,
      cornerRadius: 5,
    },
  },
  scales: {
    x: { grid: { color: "#EAEAEA" } },
    y: { grid: { display: false } },
  },
};

const sectors = [
  { id: "trades", name: "Trades & Services", icon: "🛠️" },
  { id: "healthcare", name: "Healthcare", icon: "❤️" },
  { id: "construction", name: "Construction", icon: "🏗️" },
  { id: "agri", name: "Agriculture", icon: "🌱" },
  { id: "mfg", name: "Manufacturing & Logistics", icon: "📦" },
  { id: "retail", name: "Retail", icon: "🛒" },
];

const sectorContents: Record<
  string,
  {
    title: string;
    description: string;
    shortages: string[];
    roles: string[];
    links: { seek: string; tradeMe: string };
  }
> = {
  trades: {
    title: "Skilled Trades & Services",
    description:
      "This is the biggest sector for jobs in Invercargill. Your hands-on skills are in extremely high demand.",
    shortages: [
      "Electricians",
      "Plumbers",
      "Diesel Mechanics (especially with computer skills)",
      "Heavy Machinery Operators",
    ],
    roles: [
      "Electrician",
      "Plumber",
      "Diesel Motor Mechanic",
      "Automotive Electrician",
      "Drainlayer",
      "Gasfitter",
    ],
    links: {
      seek: "https://www.seek.co.nz/jobs/in-southland-invercargill/in-trades-services",
      tradeMe:
        "https://www.trademe.co.nz/a/jobs/trades-services/southland/invercargill",
    },
  },
  healthcare: {
    title: "Healthcare & Social Services",
    description:
      "A critical sector with consistent demand due to a growing population. Many roles are on the immigration Green List.",
    shortages: [
      "Experienced Nurses to mentor graduates",
      "General Practitioners (GPs)",
    ],
    roles: [
      "Registered Nurse (Aged Care, Mental Health)",
      "Support Worker",
      "General Practitioner",
      "Midwife",
      "Clinical Psychologist",
    ],
    links: {
      seek: "https://www.seek.co.nz/jobs/in-southland-invercargill/in-healthcare-medical",
      tradeMe:
        "https://www.trademe.co.nz/a/jobs/healthcare/southland/invercargill",
    },
  },
  construction: {
    title: "Engineering & Construction",
    description:
      "With ongoing development, engineers and construction professionals are vital to the city's growth.",
    shortages: [
      "Engineers of all types",
      "Qualified staff with 3-5 years experience",
    ],
    roles: [
      "Construction Project Manager",
      "Quantity Surveyor",
      "Civil Engineer",
      "Labourer",
      "Surveyor",
    ],
    links: {
      seek: "https://www.seek.co.nz/jobs/in-southland-invercargill/in-construction",
      tradeMe:
        "https://www.trademe.co.nz/a/jobs/construction-roading/southland/invercargill",
    },
  },
  agri: {
    title: "Agriculture",
    description:
      "The backbone of the Southland economy. Opportunities range from on-farm roles to support industries.",
    shortages: [
      "Diesel mechanics for computerized equipment",
      "Dairy Farm Managers",
    ],
    roles: [
      "Dairy Farm Manager",
      "Heavy Machinery Operator",
      "Farm Hand",
      "Livestock Agent",
    ],
    links: {
      seek: "https://www.seek.co.nz/jobs/in-southland-invercargill/in-farming-animals-conservation",
      tradeMe:
        "https://www.trademe.co.nz/a/jobs/agriculture-fishing-forestry/southland/invercargill",
    },
  },
  mfg: {
    title: "Manufacturing, Transport & Logistics",
    description:
      "Invercargill is a hub for processing and transport, with major local employers like Alliance and HWR Group.",
    shortages: ["Staff for shift work and weekends", "Entry-level employees"],
    roles: [
      "Production Operator",
      "Warehouse Person",
      "Class 5 Truck Driver",
      "Qualified Heavy Fabricator",
      "Butcher/Boner",
    ],
    links: {
      seek: "https://www.seek.co.nz/jobs/in-southland-invercargill/in-manufacturing-transport-logistics",
      tradeMe:
        "https://www.trademe.co.nz/a/jobs/manufacturing-operations/southland/invercargill",
    },
  },
  retail: {
    title: "Retail & Hospitality",
    description:
      "Customer-facing roles are always available, offering a great way to connect with the community.",
    shortages: [
      "Hospitality staff (chefs, baristas)",
      "Staff willing to work weekends/evenings",
    ],
    roles: [
      "Retail Sales Assistant",
      "Store Manager",
      "Deli Assistant",
      "Hospitality Team Member",
      "Receptionist",
    ],
    links: {
      seek: "https://www.seek.co.nz/jobs/in-southland-invercargill/in-retail-consumer-products",
      tradeMe:
        "https://www.trademe.co.nz/a/jobs/retail/southland/invercargill",
    },
  },
};

const navLinks = [
  { href: "#welcome", label: "Welcome" },
  { href: "#opportunities", label: "Opportunities" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "#culture", label: "Workplace" },
  { href: "#action-plan", label: "Your Plan" },
];

export default function Home() {
  const [activeSector, setActiveSector] = useState("trades");
  const [activeNav, setActiveNav] = useState("#welcome");
  const sectionRefs = {
    welcome: useRef<HTMLElement>(null),
    opportunities: useRef<HTMLElement>(null),
    toolkit: useRef<HTMLElement>(null),
    culture: useRef<HTMLElement>(null),
    "action-plan": useRef<HTMLElement>(null),
  };

  // Scroll spy for nav highlight
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 100;
      let current = "#welcome";
      for (const key of Object.keys(sectionRefs)) {
        const ref = sectionRefs[key as keyof typeof sectionRefs];
        if (ref.current && ref.current.offsetTop <= scrollY) {
          current = `#${key}`;
        }
      }
      setActiveNav(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionRefs]);

  // Smooth scroll
  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    sectionRefs[id as keyof typeof sectionRefs]?.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="font-sans bg-[#FDFBF8] text-[#3D405B]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">Invercargill Job Finder</div>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`nav-link border-b-2 border-transparent pb-1 transition-all ${
                    activeNav === link.href
                      ? "text-[#81B29A] border-[#81B29A]"
                      : ""
                  } hover:text-[#81B29A]`}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Welcome */}
        <section
          id="welcome"
          ref={sectionRefs.welcome}
          className="py-16 md:py-24 bg-[#F4F1DE]"
        >
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Invercargill!
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              You&apos;ve made a great choice moving here. As a hardworking person
              looking to support your family, you&apos;ll find promising
              opportunities. The city&apos;s job market is set for strong growth, and
              your dedication is exactly what local employers are looking for.
              This guide is designed to help you every step of the way.
            </p>
            <div className="flex justify-center items-center space-x-4 text-gray-600">
              <span className="flex items-center">
                <span className="text-2xl mr-2">📈</span>Positive Job Growth
              </span>
              <span className="flex items-center">
                <span className="text-2xl mr-2">🤝</span>Strong Community
              </span>
              <span className="flex items-center">
                <span className="text-2xl mr-2">🏡</span>Great Work-Life Balance
              </span>
            </div>
          </div>
        </section>

        {/* Opportunities */}
        <section
          id="opportunities"
          ref={sectionRefs.opportunities}
          className="py-16 md:py-20"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Where Are The Jobs?
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Invercargill&apos;s economy is diverse. While farming is a
                cornerstone, sectors like construction, real estate, and
                professional services have many businesses. This creates
                opportunities in a wide range of roles. Let&apos;s explore the key
                areas of demand.
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md mb-16">
              <h3 className="text-2xl font-bold text-center mb-2">
                Top Industries by Number of Businesses
              </h3>
              <p className="text-center text-gray-500 mb-6">
                This chart shows where business activity is highest in the city.
              </p>
              <div
                className="chart-container"
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 800,
                  marginLeft: "auto",
                  marginRight: "auto",
                  height: "400px",
                  maxHeight: "50vh",
                }}
              >
                <Bar data={industryData} options={industryOptions} />
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-center mb-2">
                Explore In-Demand Job Sectors
              </h3>
              <p className="text-center text-gray-500 mb-8">
                Click on a sector below to see specific in-demand roles, skills
                shortages you can help fill, and direct links to find current
                job openings.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {sectors.map((sector) => (
                  <button
                    key={sector.id}
                    className={`sector-card text-center p-3 border-2 rounded-lg transition-all focus:outline-none ${
                      activeSector === sector.id
                        ? "border-[#81B29A] bg-[#F4F1DE]"
                        : "border-gray-200 hover:border-[#81B29A]"
                    }`}
                    onClick={() => setActiveSector(sector.id)}
                  >
                    <div className="text-2xl">{sector.icon}</div>
                    <div className="mt-1 text-sm font-semibold">
                      {sector.name}
                    </div>
                  </button>
                ))}
              </div>

              <div>
                {/* Sector content */}
                {(() => {
                  const content = sectorContents[activeSector];
                  return (
                    <div className="tab-content active p-4 md:p-6 bg-gray-50 rounded-lg">
                      <h4 className="font-bold text-xl md:text-2xl text-[#3D405B] mb-3">
                        {content.title}
                      </h4>
                      <p className="text-gray-600 mb-6">{content.description}</p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-bold mb-2">In-Demand Roles:</h5>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {content.roles.map((role) => (
                              <li key={role}>{role}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg">
                          <h5 className="font-bold mb-2">Your Opportunity!</h5>
                          <p className="text-sm mb-2">
                            Employers have a shortage of:
                          </p>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {content.shortages.map((shortage) => (
                              <li key={shortage}>{shortage}</li>
                            ))}
                          </ul>
                          <p className="text-sm mt-3">
                            Your hard work and reliability can fill this gap.
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <a
                          href={content.links.seek}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto text-center px-6 py-3 font-bold rounded-lg btn-primary bg-[#81B29A] text-white hover:bg-[#6a947d] transition"
                        >
                          Find Jobs on Seek
                        </a>
                        <a
                          href={content.links.tradeMe}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto text-center px-6 py-3 font-bold rounded-lg btn-secondary bg-[#E07A5F] text-white hover:bg-[#c9674f] transition"
                        >
                          Find Jobs on Trade Me
                        </a>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </section>

        {/* Toolkit */}
        <section
          id="toolkit"
          ref={sectionRefs.toolkit}
          className="py-16 md:py-20 bg-[#F4F1DE]"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Your Job Search Toolkit
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Here are the essential resources you&apos;ll need to find and apply
                for jobs effectively in Invercargill.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-3">💻</span>Online Job Boards
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="https://www.seek.co.nz/jobs/in-southland/in-invercargill"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#81B29A] hover:underline"
                    >
                      Seek.co.nz
                    </a>
                    <p className="text-sm text-gray-600">
                      The leading job site in NZ. Essential for any search.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.trademe.co.nz/a/jobs/southland/invercargill"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#81B29A] hover:underline"
                    >
                      Trade Me Jobs
                    </a>
                    <p className="text-sm text-gray-600">
                      Very popular, especially for trades and operations roles.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.careers.govt.nz/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#81B29A] hover:underline"
                    >
                      Careers.govt.nz
                    </a>
                    <p className="text-sm text-gray-600">
                      Government site with great tools for CV building and
                      career planning.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-3">🤝</span>Local Recruitment
                  Agencies
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  These agencies have direct connections with local employers.
                  Contacting them can give you a significant advantage.
                </p>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://www.onestaff.co.nz/branches/invercargill"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#81B29A] hover:underline"
                    >
                      OneStaff Invercargill
                    </a>
                    <p className="text-xs text-gray-500">
                      Specializes in agriculture, manufacturing, and
                      construction.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.advancedpersonnel.co.nz/immigration"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#81B29A] hover:underline"
                    >
                      Advanced Personnel
                    </a>
                    <p className="text-xs text-gray-500">
                      Focuses on construction and industrial roles; great for
                      newcomers.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.enterprise.co.nz/contact-us"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#81B29A] hover:underline"
                    >
                      Enterprise Recruitment
                    </a>
                    <p className="text-xs text-gray-500">
                      Offers general recruitment services in the area.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-3">🌐</span>Networking &
                  Community
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Many jobs are found through connections. Getting involved in
                  the community is key.
                </p>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://www.southlandchamber.co.nz/events-training/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#81B29A] hover:underline"
                    >
                      Southland Business Chamber
                    </a>
                    <p className="text-xs text-gray-500">
                      Attend their events to meet local business people.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.invercargillnz.com/newcomers/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#81B29A] hover:underline"
                    >
                      Welcoming Communities
                    </a>
                    <p className="text-xs text-gray-500">
                      City program to help new residents settle in.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://www.southlandmulticultural.co.nz/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#81B29A] hover:underline"
                    >
                      Southland Multicultural Trust
                    </a>
                    <p className="text-xs text-gray-500">
                      Provides support and social events for newcomers.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Culture */}
        <section
          id="culture"
          ref={sectionRefs.culture}
          className="py-16 md:py-20"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Understanding the Kiwi Workplace
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Adapting to the local work culture is just as important as your
                skills. Here’s what you need to know.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold mb-6">
                  Workplace Culture & Etiquette
                </h3>
                <ul className="space-y-5">
                  <li className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">⚖️</span>
                    <div>
                      <strong className="text-gray-800">Work-Life Balance:</strong>{" "}
                      Kiwis work hard but value their personal time. Flexible
                      hours to support family are common.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">👥</span>
                    <div>
                      <strong className="text-gray-800">Teamwork is Key:</strong>{" "}
                      Hierarchies are flat. Your ideas are welcome, no matter
                      your role. Be ready to collaborate.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">🗣️</span>
                    <div>
                      <strong className="text-gray-800">Direct & Polite:</strong>{" "}
                      Communication is honest and straightforward, but always
                      polite.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">⏰</span>
                    <div>
                      <strong className="text-gray-800">Punctuality Matters:</strong>{" "}
                      Being on time for work and meetings is seen as a sign of
                      respect.
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold mb-6">
                  Your Rights as an Employee
                </h3>
                <p className="text-gray-600 mb-6">
                  New Zealand has strong laws to protect workers. Know your
                  basic rights.
                </p>
                <ul className="space-y-5">
                  <li className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">📄</span>
                    <div>
                      <strong className="text-gray-800">Written Agreement:</strong>{" "}
                      You must receive a written employment agreement. Read it
                      carefully.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">💰</span>
                    <div>
                      <strong className="text-gray-800">Minimum Wage:</strong>{" "}
                      You must be paid at least the legal minimum wage.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">🌴</span>
                    <div>
                      <strong className="text-gray-800">Leave Entitlements:</strong>{" "}
                      You are entitled to paid annual holidays, sick leave, and
                      public holidays.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">⛑️</span>
                    <div>
                      <strong className="text-gray-800">Health & Safety:</strong>{" "}
                      Your employer has a legal duty to provide a safe
                      workplace.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Action Plan */}
        <section
          id="action-plan"
          ref={sectionRefs["action-plan"]}
          className="py-16 md:py-20 bg-[#F4F1DE]"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Your Personal Action Plan
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Success comes from taking consistent action. Use this checklist
                to guide your first few weeks.
              </p>
            </div>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
              <ul className="space-y-4">
                <li className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl mr-4">✅</span>
                  <div>
                    <strong className="text-gray-800">
                      Target In-Demand Sectors:
                    </strong>{" "}
                    Focus your search on Healthcare, Trades, and Construction
                    where your hard work is needed most.
                  </div>
                </li>
                <li className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl mr-4">✅</span>
                  <div>
                    <strong className="text-gray-800">
                      Create a NZ-style CV:
                    </strong>{" "}
                    Use the tools on careers.govt.nz to adapt your CV for local
                    employers.
                  </div>
                </li>
                <li className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl mr-4">✅</span>
                  <div>
                    <strong className="text-gray-800">Set Up Job Alerts:</strong>{" "}
                    Create daily alerts on Seek and Trade Me for roles in
                    Invercargill.
                  </div>
                </li>
                <li className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl mr-4">✅</span>
                  <div>
                    <strong className="text-gray-800">
                      Contact a Recruitment Agency:
                    </strong>{" "}
                    Call or email OneStaff or Advanced Personnel to introduce
                    yourself.
                  </div>
                </li>
                <li className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl mr-4">✅</span>
                  <div>
                    <strong className="text-gray-800">
                      Attend a Community Event:
                    </strong>{" "}
                    Check the Southland Chamber or Multicultural Trust for
                    networking opportunities.
                  </div>
                </li>
                <li className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl mr-4">✅</span>
                  <div>
                    <strong className="text-gray-800">
                      Connect with Support Services:
                    </strong>{" "}
                    Contact Work and Income for job search help and financial
                    support information.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#3D405B] text-white">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="font-bold text-lg mb-4">Key Support Contacts</p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <a
              href="https://workandincome.govt.nz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#81B29A] transition-colors"
            >
              Work and Income NZ
            </a>
            <a
              href="https://www.immigration.govt.nz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#81B29A] transition-colors"
            >
              Immigration New Zealand
            </a>
            <a
              href="https://www.southlandmulticultural.co.nz/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#81B29A] transition-colors"
            >
              Southland Multicultural Trust
            </a>
          </div>
          <p className="text-sm mt-8 text-gray-400">
            This interactive guide was created to help you succeed in your new
            home. Best of luck with your job search!
          </p>
        </div>
      </footer>
    </div>
  );
}