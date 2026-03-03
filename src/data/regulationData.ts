// AI Regulation Dataset — verified as of March 2026
// Sources: EU AI Act official timeline, White & Case Global AI Regulatory Tracker,
// IAPP Global AI Law Tracker, Wikipedia AI Safety Institutes, Asia Law Portal 2026,
// White House executive orders, CSIS AISI Network report, Stanford AI Index 2025.
// ControlAI DIP alignment scores reflect proximity to ControlAI's Direct Institutional Plan:
// banning deliberate ASI development, mandatory safety evaluations, compute thresholds.

export type Stance = "restrictive" | "moderate" | "permissive" | "minimal"
export type DIPAlignment = "Yes" | "Partial" | "No"

export interface Country {
  iso2: string                    // ISO 3166-1 alpha-2
  name: string
  region: string
  stance: Stance
  // One-hot encoded regulatory features
  hasHorizontalLaw: boolean       // Binding cross-sector AI law in force
  hasFrontierRegs: boolean        // Specific rules for frontier/advanced AI models
  hasComputeThresholds: boolean   // Compute-based thresholds in law
  hasMandatoryEvals: boolean      // Pre-deployment safety evaluations required by law
  hasAISafetyInstitute: boolean   // Government-backed AI safety/security institute
  dipAlignment: DIPAlignment      // Alignment with ControlAI's DIP campaign
  keyLegislation: string          // Key law or framework
  statusNote: string              // One-line current status (March 2026)
}

export const COUNTRIES: Country[] = [
  // ── EU MEMBER STATES ── EU AI Act (Regulation 2024/1689) is directly applicable
  // Horizontal law: YES. Prohibited practices: Feb 2025. GPAI rules: Aug 2025.
  // Full enforcement: Aug 2026. Compute threshold for systemic risk GPAI: 10^25 FLOPs.
  {
    iso2: "DE", name: "Germany", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: true,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act GPAI rules in force Aug 2025. AISI part of international network.",
  },
  {
    iso2: "FR", name: "France", region: "Europe",
    stance: "moderate",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: true,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "Hosted Feb 2025 AI Action Summit. Shifted focus from safety to innovation. LNE/INRIA AISI operational.",
  },
  {
    iso2: "IT", name: "Italy", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: true,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies. AISI part of international network.",
  },
  {
    iso2: "ES", name: "Spain", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies. National competent authority designated Aug 2025.",
  },
  {
    iso2: "NL", name: "Netherlands", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies. Strong GPAI enforcement via EU AI Office.",
  },
  {
    iso2: "PL", name: "Poland", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies. National competent authority designated.",
  },
  {
    iso2: "SE", name: "Sweden", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies.",
  },
  {
    iso2: "DK", name: "Denmark", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies.",
  },
  {
    iso2: "BE", name: "Belgium", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies. Home of EU AI Office (Brussels).",
  },
  {
    iso2: "AT", name: "Austria", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies.",
  },
  {
    iso2: "IE", name: "Ireland", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies. Handles 60% of EU enforcement cases (tech HQ location).",
  },
  {
    iso2: "FI", name: "Finland", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies.",
  },
  {
    iso2: "PT", name: "Portugal", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies.",
  },
  {
    iso2: "RO", name: "Romania", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies.",
  },
  {
    iso2: "GR", name: "Greece", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (2024/1689)",
    statusNote: "EU AI Act applies.",
  },
  // ── EEA NON-EU (EU AI Act via EEA agreement) ──
  {
    iso2: "NO", name: "Norway", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (via EEA)",
    statusNote: "EU AI Act applies via EEA agreement.",
  },
  {
    iso2: "IS", name: "Iceland", region: "Europe",
    stance: "restrictive",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: true,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "EU AI Act (via EEA)",
    statusNote: "EU AI Act applies via EEA agreement.",
  },
  // ── UK ──
  // No enacted AI law. Pro-innovation principles only. AI Security Institute (renamed Feb 2025).
  // Comprehensive AI Bill expected 2026 but not yet introduced.
  {
    iso2: "GB", name: "United Kingdom", region: "Europe",
    stance: "moderate",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: true,
    dipAlignment: "Partial",
    keyLegislation: "Pro-Innovation White Paper 2023 · AI Bill planned 2026",
    statusNote: "No enacted AI law. AI Security Institute (formerly AISI) operational. Comprehensive bill signalled for 2026.",
  },
  // ── SWITZERLAND ──
  // National AI Strategy in place but binding regulatory proposal not yet finalised.
  {
    iso2: "CH", name: "Switzerland", region: "Europe",
    stance: "moderate",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "Partial",
    keyLegislation: "National AI Strategy · Regulatory proposal in progress",
    statusNote: "National AI strategy published. Binding regulatory proposal expected 2026.",
  },
  // ── TURKEY ──
  {
    iso2: "TR", name: "Turkey", region: "Europe",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "Multiple sector guidelines · AI bill in legislative process",
    statusNote: "Published AI sector guidelines. Standalone AI bill now in legislative process.",
  },
  // ── UKRAINE ──
  {
    iso2: "UA", name: "Ukraine", region: "Europe",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "National AI development concept",
    statusNote: "Early-stage AI governance concept. No binding law.",
  },
  // ── RUSSIA ──
  {
    iso2: "RU", name: "Russia", region: "Europe",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "National AI Strategy 2030 · No binding law",
    statusNote: "National AI strategy focused on development. No binding safety regulation.",
  },
  // ── UNITED STATES ──
  // Biden EO 14110 revoked Jan 2025. Trump AI Action Plan July 2025: pro-innovation, anti-regulation.
  // Dec 2025 EO to challenge state AI laws. AISI renamed CAISI, mission changed.
  // No federal AI law. State-level patchwork (Colorado AI Act, California transparency laws).
  {
    iso2: "US", name: "United States", region: "Americas",
    stance: "permissive",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "Executive Orders only · No federal AI law · State patchwork",
    statusNote: "Trump revoked Biden EO Jan 2025. AI Action Plan July 2025 prioritises dominance over safety. AISI became CAISI with changed mission. No federal law.",
  },
  // ── CANADA ──
  // AIDA (Artificial Intelligence and Data Act) still under parliamentary consideration as of March 2026.
  // Canada AISI part of international network. C$50M pledged.
  {
    iso2: "CA", name: "Canada", region: "Americas",
    stance: "moderate",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: true,
    dipAlignment: "Partial",
    keyLegislation: "AIDA (Bill C-27, pending) · Voluntary standards",
    statusNote: "AIDA pending in parliament. Canada AISI operational. C$50M national AI safety commitment.",
  },
  // ── BRAZIL ──
  // Bill 2338/2023 passed Senate Dec 2024, now in lower chamber (Câmara) with committee review.
  // Expected to become law in 2026. Risk-based approach, mirrors EU.
  {
    iso2: "BR", name: "Brazil", region: "Americas",
    stance: "moderate",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "Bill 2338/2023 (pending lower chamber)",
    statusNote: "Risk-based AI bill passed Senate Dec 2024, under committee review in lower chamber. Expected 2026.",
  },
  // ── ARGENTINA ──
  {
    iso2: "AR", name: "Argentina", region: "Americas",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "Bill on Personal Data Protection in AI Systems (draft)",
    statusNote: "Draft AI data protection bill proposed. No binding law in force.",
  },
  // ── MEXICO ──
  {
    iso2: "MX", name: "Mexico", region: "Americas",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "No AI-specific law",
    statusNote: "No AI-specific legislation. OECD.AI observatory participant.",
  },
  // ── CHILE ──
  {
    iso2: "CL", name: "Chile", region: "Americas",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "National AI Policy · No binding law",
    statusNote: "Represented on International AI Safety Report 2026 expert panel. No binding law.",
  },
  // ── CHINA ──
  // First country with binding GenAI regulation (2023). Labelling rules Sep 2025. 
  // No comprehensive horizontal AI law yet (draft in State Council 2024 plan).
  // Focus is content security, political alignment, not safety from existential risk.
  {
    iso2: "CN", name: "China", region: "Asia",
    stance: "moderate",
    hasHorizontalLaw: false, hasFrontierRegs: true, hasComputeThresholds: false,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "GenAI Interim Measures 2023 · AI Labelling Rules Sep 2025",
    statusNote: "World's first binding GenAI law (2023). Mandatory registration and security assessments for public models. Content-focused, not existential risk-focused.",
  },
  // ── JAPAN ──
  // AI Promotion Act May 2025: non-binding, voluntary, no penalties.
  // AISI part of international network. Hiroshima AI Process (G7 presidency 2023).
  {
    iso2: "JP", name: "Japan", region: "Asia",
    stance: "permissive",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: true,
    dipAlignment: "No",
    keyLegislation: "AI Promotion Act (May 2025, non-binding)",
    statusNote: "AI Promotion Act in force June 2025 but voluntary/non-punitive. AISI part of international network. Innovation-first approach.",
  },
  // ── SOUTH KOREA ──
  // AI Basic Act effective January 22, 2026. Risk-based. High-impact AI systems regulated.
  // Korea AISI part of international network.
  {
    iso2: "KR", name: "South Korea", region: "Asia",
    stance: "moderate",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: false,
    hasMandatoryEvals: true, hasAISafetyInstitute: true,
    dipAlignment: "Partial",
    keyLegislation: "AI Basic Act (effective Jan 22, 2026)",
    statusNote: "First comprehensive AI law in APAC. High-impact AI requires risk assessments, human oversight, disclosure. Korea AISI operational.",
  },
  // ── SINGAPORE ──
  // Framework-based, voluntary (AI Verify toolkit). Digital Trust Centre part of AISI network.
  // No binding AI law. Bilateral AI governance agreements with US and EU.
  {
    iso2: "SG", name: "Singapore", region: "Asia",
    stance: "moderate",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: true,
    dipAlignment: "No",
    keyLegislation: "Model AI Governance Framework · AI Verify Toolkit",
    statusNote: "Voluntary frameworks and toolkits. No binding AI law. Digital Trust Centre (AISI equivalent) part of international network.",
  },
  // ── INDIA ──
  // No dedicated AI law. Digital India Act proposed but not passed. DPDPA for data.
  // IndiaAI Safety Institute announced Jan 30, 2025. Soft law approach.
  {
    iso2: "IN", name: "India", region: "Asia",
    stance: "permissive",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: true,
    dipAlignment: "No",
    keyLegislation: "DPDPA 2023 · Voluntary AI guidelines · Digital India Act (proposed)",
    statusNote: "IndiaAI Safety Institute announced Jan 2025. No binding AI law. Soft-law approach via NITI Aayog guidelines.",
  },
  // ── AUSTRALIA ──
  // Voluntary AI Safety Standards. Privacy Act reform ongoing. Australia AISI part of network.
  // Mandatory guardrails for high-risk uses (health, credit, hiring) expected to firm up by 2026.
  {
    iso2: "AU", name: "Australia", region: "Oceania",
    stance: "moderate",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: true,
    dipAlignment: "Partial",
    keyLegislation: "Voluntary AI Safety Standards · Privacy Act reforms",
    statusNote: "Voluntary AI safety standards published. Australia AISI part of international network. Binding guardrails for high-risk uses expected 2026.",
  },
  // ── NEW ZEALAND ──
  // Updating existing laws rather than new AI-specific legislation.
  {
    iso2: "NZ", name: "New Zealand", region: "Oceania",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "Existing privacy and consumer laws · No AI-specific law",
    statusNote: "Sophisticated adopter approach — updating existing laws rather than new AI statute.",
  },
  // ── UAE ──
  // AI Strategy 2031. DIFC AI Licence. Stargate UAE (massive AI datacentre investment).
  // Sector-specific decrees. No comprehensive horizontal law. Pro-acceleration stance.
  {
    iso2: "AE", name: "UAE", region: "Middle East",
    stance: "permissive",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "AI Strategy 2031 · DIFC AI Licence · Sector decrees",
    statusNote: "Stargate UAE 5GW AI campus announced 2026. DIFC AI Licence for financial AI. Pro-acceleration investment focus.",
  },
  // ── SAUDI ARABIA ──
  {
    iso2: "SA", name: "Saudi Arabia", region: "Middle East",
    stance: "permissive",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "National AI Strategy · SDAIA governance body",
    statusNote: "AI strategy focused on economic diversification. No binding safety regulation. Represented on International AI Safety Report 2026 panel.",
  },
  // ── ISRAEL ──
  {
    iso2: "IL", name: "Israel", region: "Middle East",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "No AI-specific law · Sector guidelines",
    statusNote: "No binding AI law. Innovation Hub Israel position. Represented on Int'l AI Safety Report 2026.",
  },
  // ── KENYA ──
  // Notably part of the international AISI network (named at AI Seoul Summit).
  {
    iso2: "KE", name: "Kenya", region: "Africa",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: true,
    dipAlignment: "No",
    keyLegislation: "National AI Strategy (draft)",
    statusNote: "Kenya AISI part of international network — notable for Africa. No binding AI law.",
  },
  // ── NIGERIA ──
  {
    iso2: "NG", name: "Nigeria", region: "Africa",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "NITDA AI Policy Framework",
    statusNote: "Brazil-Nigeria MoU on AI development signed 2025. National AI policy framework published. No binding law.",
  },
  // ── SOUTH AFRICA ──
  {
    iso2: "ZA", name: "South Africa", region: "Africa",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "POPIA (data law) · No AI-specific law",
    statusNote: "No AI-specific legislation. POPIA (data protection) applies to AI systems.",
  },
  // ── VIETNAM ──
  // First SEA country with standalone comprehensive AI law. Effective March 1, 2026.
  {
    iso2: "VN", name: "Vietnam", region: "Asia",
    stance: "moderate",
    hasHorizontalLaw: true, hasFrontierRegs: true, hasComputeThresholds: false,
    hasMandatoryEvals: true, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "Law on Artificial Intelligence (effective Mar 1, 2026)",
    statusNote: "First SEA nation with standalone AI law. Risk-based, mandates human oversight for GenAI, bans certain high-risk applications.",
  },
  // ── INDONESIA ──
  {
    iso2: "ID", name: "Indonesia", region: "Asia",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "AI Ethics Framework (draft) · National AI Strategy",
    statusNote: "Finalising draft AI framework into binding rules. No binding law in force. Represented on Int'l AI Safety Report 2026.",
  },
  // ── THAILAND ──
  {
    iso2: "TH", name: "Thailand", region: "Asia",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "National AI Strategy 2022–2027",
    statusNote: "Draft risk-based AI regulation framework under development. No binding law.",
  },
  // ── MALAYSIA ──
  {
    iso2: "MY", name: "Malaysia", region: "Asia",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "Malaysia National AI Roadmap",
    statusNote: "National AI Roadmap published. No binding AI law.",
  },
  // ── TAIWAN ──
  {
    iso2: "TW", name: "Taiwan", region: "Asia",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "Draft AI governance laws under consideration",
    statusNote: "Draft AI laws under consideration. Sector-specific initiatives in place.",
  },
  // ── PHILIPPINES ──
  {
    iso2: "PH", name: "Philippines", region: "Asia",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "National AI Roadmap · Sector-specific rules",
    statusNote: "Privacy and sector laws apply to AI. No standalone AI legislation. Represented on Int'l AI Safety Report 2026.",
  },
  // ── PAKISTAN ──
  {
    iso2: "PK", name: "Pakistan", region: "Asia",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "National AI Policy (draft)",
    statusNote: "No binding AI law. Draft national AI policy under development.",
  },
  // ── EGYPT ──
  {
    iso2: "EG", name: "Egypt", region: "Africa",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "National AI Strategy 2035",
    statusNote: "AI strategy focused on economic growth. No binding law.",
  },
  // ── RWANDA ──
  {
    iso2: "RW", name: "Rwanda", region: "Africa",
    stance: "minimal",
    hasHorizontalLaw: false, hasFrontierRegs: false, hasComputeThresholds: false,
    hasMandatoryEvals: false, hasAISafetyInstitute: false,
    dipAlignment: "No",
    keyLegislation: "National AI Policy",
    statusNote: "Forward-thinking AI policy. Represented on Int'l AI Safety Report 2026. No binding law.",
  },
]

// Summary stats helper
export function getRegulationStats() {
  const total = COUNTRIES.length
  const withHorizontalLaw = COUNTRIES.filter(c => c.hasHorizontalLaw).length
  const withAISI = COUNTRIES.filter(c => c.hasAISafetyInstitute).length
  const withMandatoryEvals = COUNTRIES.filter(c => c.hasMandatoryEvals).length
  const dipPartialOrYes = COUNTRIES.filter(c => c.dipAlignment !== "No").length
  const stanceCounts = {
    restrictive: COUNTRIES.filter(c => c.stance === "restrictive").length,
    moderate: COUNTRIES.filter(c => c.stance === "moderate").length,
    permissive: COUNTRIES.filter(c => c.stance === "permissive").length,
    minimal: COUNTRIES.filter(c => c.stance === "minimal").length,
  }
  return { total, withHorizontalLaw, withAISI, withMandatoryEvals, dipPartialOrYes, stanceCounts }
}

export const STANCE_COLORS: Record<Stance, { fill: string; label: string; description: string }> = {
  restrictive: { fill: "#166534", label: "Restrictive", description: "Binding comprehensive AI law in force" },
  moderate:    { fill: "#92400e", label: "Moderate",    description: "Active engagement, some binding rules" },
  permissive:  { fill: "#7f1d1d", label: "Permissive",  description: "Pro-innovation, minimal binding rules" },
  minimal:     { fill: "#1e293b", label: "Minimal",     description: "No AI-specific regulation" },
}