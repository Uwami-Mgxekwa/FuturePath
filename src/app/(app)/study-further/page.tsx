"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, Navigation, GraduationCap, Building2 } from "lucide-react";

/* ── Institution data ────────────────────────────────────────── */
type InstitutionType = "TVET College" | "University" | "University of Technology";

interface Institution {
  id: number;
  name: string;
  type: InstitutionType;
  province: string;
  city: string;
  website: string;
  offers: string[];
}

const institutions: Institution[] = [
  // ── TVET Colleges ──────────────────────────────────────────
  { id: 1, name: "Ekurhuleni East TVET College", type: "TVET College", province: "Gauteng", city: "Springs", website: "https://www.eec.edu.za", offers: ["Engineering", "Business Studies", "IT", "Tourism"] },
  { id: 2, name: "Ekurhuleni West TVET College", type: "TVET College", province: "Gauteng", city: "Krugersdorp", website: "https://www.ewc.edu.za", offers: ["Engineering", "Business Studies", "Hospitality"] },
  { id: 3, name: "Sedibeng TVET College", type: "TVET College", province: "Gauteng", city: "Vereeniging", website: "https://www.sedibeng.edu.za", offers: ["Engineering", "Business Studies", "IT"] },
  { id: 4, name: "South West Gauteng TVET College", type: "TVET College", province: "Gauteng", city: "Johannesburg", website: "https://www.swgc.edu.za", offers: ["Engineering", "Business Studies", "IT", "Education"] },
  { id: 5, name: "Tshwane North TVET College", type: "TVET College", province: "Gauteng", city: "Pretoria", website: "https://www.tnc.edu.za", offers: ["Engineering", "IT", "Business", "Tourism"] },
  { id: 6, name: "Tshwane South TVET College", type: "TVET College", province: "Gauteng", city: "Pretoria", website: "https://www.tsc.edu.za", offers: ["Engineering", "Business", "Hospitality"] },
  { id: 7, name: "Central Johannesburg TVET College", type: "TVET College", province: "Gauteng", city: "Johannesburg", website: "https://www.cjc.edu.za", offers: ["Business Studies", "IT", "Tourism", "Hospitality"] },
  { id: 8, name: "College of Cape Town", type: "TVET College", province: "Western Cape", city: "Cape Town", website: "https://www.cct.edu.za", offers: ["Engineering", "Business", "IT", "Tourism"] },
  { id: 9, name: "False Bay TVET College", type: "TVET College", province: "Western Cape", city: "Somerset West", website: "https://www.falsebay.edu.za", offers: ["Engineering", "Business", "IT", "Hospitality"] },
  { id: 10, name: "Northlink TVET College", type: "TVET College", province: "Western Cape", city: "Parow", website: "https://www.northlink.edu.za", offers: ["Engineering", "IT", "Business", "Education"] },
  { id: 11, name: "South Cape TVET College", type: "TVET College", province: "Western Cape", city: "George", website: "https://www.southcape.edu.za", offers: ["Engineering", "Business", "Tourism", "Agriculture"] },
  { id: 12, name: "West Coast TVET College", type: "TVET College", province: "Western Cape", city: "Malmesbury", website: "https://www.westcoastcollege.co.za", offers: ["Engineering", "Business", "Agriculture"] },
  { id: 13, name: "Coastal KZN TVET College", type: "TVET College", province: "KwaZulu-Natal", city: "Durban", website: "https://www.coastalkzn.edu.za", offers: ["Engineering", "Business", "IT", "Tourism"] },
  { id: 14, name: "Majuba TVET College", type: "TVET College", province: "KwaZulu-Natal", city: "Newcastle", website: "https://www.majuba.edu.za", offers: ["Engineering", "IT", "Business", "Agriculture"] },
  { id: 15, name: "Umfolozi TVET College", type: "TVET College", province: "KwaZulu-Natal", city: "Empangeni", website: "https://www.umfolozi.edu.za", offers: ["Engineering", "Business", "Tourism", "Agriculture"] },
  { id: 16, name: "Umgungundlovu TVET College", type: "TVET College", province: "KwaZulu-Natal", city: "Pietermaritzburg", website: "https://www.umgungundlovu.edu.za", offers: ["Business", "IT", "Engineering", "Education"] },
  { id: 17, name: "Buffalo City TVET College", type: "TVET College", province: "Eastern Cape", city: "East London", website: "https://www.buffalocitycollege.edu.za", offers: ["Engineering", "Business", "IT", "Tourism"] },
  { id: 18, name: "East Cape Midlands TVET College", type: "TVET College", province: "Eastern Cape", city: "Uitenhage", website: "https://www.ecmc.edu.za", offers: ["Engineering", "Business", "IT"] },
  { id: 19, name: "Ingwe TVET College", type: "TVET College", province: "Eastern Cape", city: "Mount Frere", website: "https://www.ingwe.edu.za", offers: ["Business", "Agriculture", "Education"] },
  { id: 20, name: "King Hintsa TVET College", type: "TVET College", province: "Eastern Cape", city: "Butterworth", website: "https://www.kinghintsa.edu.za", offers: ["Engineering", "Business", "Agriculture"] },
  { id: 21, name: "Port Elizabeth TVET College", type: "TVET College", province: "Eastern Cape", city: "Gqeberha", website: "https://www.pecollege.edu.za", offers: ["Engineering", "Business", "IT", "Tourism"] },
  { id: 22, name: "Lephalale TVET College", type: "TVET College", province: "Limpopo", city: "Lephalale", website: "https://www.lephalale.edu.za", offers: ["Engineering", "Business", "Mining"] },
  { id: 23, name: "Mopani South East TVET College", type: "TVET College", province: "Limpopo", city: "Phalaborwa", website: "https://www.mopani.edu.za", offers: ["Engineering", "Business", "Agriculture"] },
  { id: 24, name: "Sekhukhune TVET College", type: "TVET College", province: "Limpopo", city: "Burgersfort", website: "https://www.sekhukhune.edu.za", offers: ["Business", "Agriculture", "Education"] },
  { id: 25, name: "Vhembe TVET College", type: "TVET College", province: "Limpopo", city: "Thohoyandou", website: "https://www.vhembe.edu.za", offers: ["Engineering", "Business", "IT", "Agriculture"] },
  { id: 26, name: "Waterberg TVET College", type: "TVET College", province: "Limpopo", city: "Mokopane", website: "https://www.waterberg.edu.za", offers: ["Engineering", "Business", "Agriculture"] },
  { id: 27, name: "Ehlanzeni TVET College", type: "TVET College", province: "Mpumalanga", city: "Nelspruit", website: "https://www.ehlanzeni.edu.za", offers: ["Engineering", "Business", "Tourism", "Agriculture"] },
  { id: 28, name: "Gert Sibande TVET College", type: "TVET College", province: "Mpumalanga", city: "Ermelo", website: "https://www.gertsibande.edu.za", offers: ["Engineering", "Business", "Agriculture"] },
  { id: 29, name: "Nkangala TVET College", type: "TVET College", province: "Mpumalanga", city: "Emalahleni", website: "https://www.nkangala.edu.za", offers: ["Engineering", "Mining", "Business", "IT"] },
  { id: 30, name: "Orbit TVET College", type: "TVET College", province: "North West", city: "Rustenburg", website: "https://www.orbit.edu.za", offers: ["Engineering", "Mining", "Business", "IT"] },
  { id: 31, name: "Taletso TVET College", type: "TVET College", province: "North West", city: "Mahikeng", website: "https://www.taletso.edu.za", offers: ["Business", "Agriculture", "Engineering"] },
  { id: 32, name: "Vuselela TVET College", type: "TVET College", province: "North West", city: "Klerksdorp", website: "https://www.vuselela.edu.za", offers: ["Engineering", "Business", "Agriculture"] },
  { id: 33, name: "Flavius Mareka TVET College", type: "TVET College", province: "Free State", city: "Sasolburg", website: "https://www.fmcollege.edu.za", offers: ["Engineering", "Business", "IT"] },
  { id: 34, name: "Goldfields TVET College", type: "TVET College", province: "Free State", city: "Welkom", website: "https://www.goldfields.edu.za", offers: ["Mining", "Engineering", "Business"] },
  { id: 35, name: "Maluti TVET College", type: "TVET College", province: "Free State", city: "Bethlehem", website: "https://www.maluti.edu.za", offers: ["Business", "Agriculture", "Engineering"] },
  { id: 36, name: "Motheo TVET College", type: "TVET College", province: "Free State", city: "Bloemfontein", website: "https://www.motheo.edu.za", offers: ["Engineering", "Business", "IT", "Hospitality"] },
  { id: 37, name: "John Taolo Gaetsewe TVET College", type: "TVET College", province: "Northern Cape", city: "Kuruman", website: "https://www.jtgcollege.edu.za", offers: ["Engineering", "Business", "Agriculture"] },
  { id: 38, name: "Namaqua TVET College", type: "TVET College", province: "Northern Cape", city: "Springbok", website: "https://www.namaqua.edu.za", offers: ["Business", "Agriculture", "Engineering"] },
  { id: 39, name: "Sol Plaatje TVET College", type: "TVET College", province: "Northern Cape", city: "Kimberley", website: "https://www.solplaatje.edu.za", offers: ["Engineering", "Business", "IT", "Mining"] },

  // ── Universities ───────────────────────────────────────────
  { id: 40, name: "University of Pretoria", type: "University", province: "Gauteng", city: "Pretoria", website: "https://www.up.ac.za", offers: ["Engineering", "Law", "Medicine", "Commerce", "Humanities", "IT", "Education"] },
  { id: 41, name: "University of the Witwatersrand", type: "University", province: "Gauteng", city: "Johannesburg", website: "https://www.wits.ac.za", offers: ["Engineering", "Law", "Medicine", "Commerce", "Science", "Humanities"] },
  { id: 42, name: "University of Johannesburg", type: "University", province: "Gauteng", city: "Johannesburg", website: "https://www.uj.ac.za", offers: ["Engineering", "Business", "IT", "Science", "Humanities", "Education", "Law"] },
  { id: 43, name: "University of South Africa (UNISA)", type: "University", province: "Gauteng", city: "Pretoria (Distance Learning)", website: "https://www.unisa.ac.za", offers: ["Law", "Business", "Education", "IT", "Humanities", "Science"] },
  { id: 44, name: "Stellenbosch University", type: "University", province: "Western Cape", city: "Stellenbosch", website: "https://www.sun.ac.za", offers: ["Engineering", "Law", "Medicine", "Commerce", "Agriculture", "Science"] },
  { id: 45, name: "University of Cape Town", type: "University", province: "Western Cape", city: "Cape Town", website: "https://www.uct.ac.za", offers: ["Engineering", "Law", "Medicine", "Commerce", "Science", "Humanities"] },
  { id: 46, name: "University of the Western Cape", type: "University", province: "Western Cape", city: "Bellville", website: "https://www.uwc.ac.za", offers: ["Law", "Business", "Science", "Education", "Dentistry", "Pharmacy"] },
  { id: 47, name: "University of KwaZulu-Natal", type: "University", province: "KwaZulu-Natal", city: "Durban / Pietermaritzburg", website: "https://www.ukzn.ac.za", offers: ["Engineering", "Law", "Medicine", "Commerce", "Education", "Humanities"] },
  { id: 48, name: "University of Zululand", type: "University", province: "KwaZulu-Natal", city: "KwaDlangezwa", website: "https://www.unizulu.ac.za", offers: ["Commerce", "Education", "Humanities", "Science"] },
  { id: 49, name: "Rhodes University", type: "University", province: "Eastern Cape", city: "Makhanda", website: "https://www.ru.ac.za", offers: ["Law", "Pharmacy", "Science", "Humanities", "Education", "Journalism"] },
  { id: 50, name: "University of Fort Hare", type: "University", province: "Eastern Cape", city: "Alice", website: "https://www.ufh.ac.za", offers: ["Law", "Business", "Agriculture", "Education", "Social Work"] },
  { id: 51, name: "Walter Sisulu University", type: "University", province: "Eastern Cape", city: "Mthatha", website: "https://www.wsu.ac.za", offers: ["Business", "Engineering", "Health Sciences", "Education"] },
  { id: 52, name: "University of Limpopo", type: "University", province: "Limpopo", city: "Polokwane", website: "https://www.ul.ac.za", offers: ["Medicine", "Law", "Business", "Humanities", "Science"] },
  { id: 53, name: "University of Mpumalanga", type: "University", province: "Mpumalanga", city: "Mbombela", website: "https://www.ump.ac.za", offers: ["Education", "Agriculture", "Hospitality", "IT"] },
  { id: 54, name: "Sol Plaatje University", type: "University", province: "Northern Cape", city: "Kimberley", website: "https://www.spu.ac.za", offers: ["Education", "Business", "Humanities", "Natural Sciences"] },
  { id: 55, name: "University of the Free State", type: "University", province: "Free State", city: "Bloemfontein", website: "https://www.ufs.ac.za", offers: ["Medicine", "Law", "Business", "Engineering", "Education", "Theology"] },
  { id: 56, name: "North-West University", type: "University", province: "North West", city: "Mahikeng / Potchefstroom", website: "https://www.nwu.ac.za", offers: ["Law", "Business", "Science", "Engineering", "Education", "Pharmacy"] },

  // ── Universities of Technology ─────────────────────────────
  { id: 57, name: "Tshwane University of Technology", type: "University of Technology", province: "Gauteng", city: "Pretoria", website: "https://www.tut.ac.za", offers: ["Engineering", "IT", "Business", "Arts", "Agriculture", "Science"] },
  { id: 58, name: "Vaal University of Technology", type: "University of Technology", province: "Gauteng", city: "Vanderbijlpark", website: "https://www.vut.ac.za", offers: ["Engineering", "IT", "Business", "Tourism", "Science"] },
  { id: 59, name: "Cape Peninsula University of Technology", type: "University of Technology", province: "Western Cape", city: "Cape Town", website: "https://www.cput.ac.za", offers: ["Engineering", "IT", "Business", "Design", "Health Sciences"] },
  { id: 60, name: "Durban University of Technology", type: "University of Technology", province: "KwaZulu-Natal", city: "Durban", website: "https://www.dut.ac.za", offers: ["Engineering", "IT", "Business", "Arts", "Health Sciences"] },
  { id: 61, name: "Mangosuthu University of Technology", type: "University of Technology", province: "KwaZulu-Natal", city: "Umlazi, Durban", website: "https://www.mut.ac.za", offers: ["Engineering", "Management", "Natural Sciences"] },
  { id: 62, name: "Walter Sisulu University (Tech)", type: "University of Technology", province: "Eastern Cape", city: "Mthatha", website: "https://www.wsu.ac.za", offers: ["Engineering", "Business", "Health Sciences"] },
  { id: 63, name: "Central University of Technology", type: "University of Technology", province: "Free State", city: "Bloemfontein", website: "https://www.cut.ac.za", offers: ["Engineering", "IT", "Business", "Health Sciences", "Humanities"] },
];

const SA_PROVINCES = [
  "All Provinces", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape",
];

const typeFilters = ["All", "TVET College", "University", "University of Technology"];

const typeColor: Record<string, string> = {
  "TVET College": "text-blue-600",
  "University": "text-purple-600",
  "University of Technology": "text-brand-green",
};

const typeBg: Record<string, string> = {
  "TVET College": "",
  "University": "",
  "University of Technology": "",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function StudyFurtherPage() {
  const [activeType, setActiveType] = useState("All");
  const [activeProvince, setActiveProvince] = useState("All Provinces");
  const [search, setSearch] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location access.");
      return;
    }
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      () => {
        // In production you would reverse geocode to get province
        // For now we just confirm location was granted
        setLocationLoading(false);
      },
      () => {
        setLocationError("Location access denied. Showing results based on your registered province.");
        setLocationLoading(false);
      }
    );
  }

  const filtered = institutions.filter((inst) => {
    const matchType = activeType === "All" || inst.type === activeType;
    const matchProvince = activeProvince === "All Provinces" || inst.province === activeProvince;
    const matchSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.city.toLowerCase().includes(search.toLowerCase()) ||
      inst.offers.some((o) => o.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchProvince && matchSearch;
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Study Further</h1>
        <p className="text-gray-500 mt-1">
          Explore {institutions.length} public colleges, universities and universities of technology across South Africa.
        </p>
      </motion.div>

      {/* Location banner */}
      <motion.div variants={itemVariants} className="rounded-2xl bg-brand-green p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold">Find institutions near you</p>
          <p className="text-white/70 text-sm mt-0.5">
            Allow location access to automatically filter by your area, or select your province below.
          </p>
          {locationError && <p className="text-yellow-300 text-xs mt-1">{locationError}</p>}
        </div>
        <button
          onClick={requestLocation}
          disabled={locationLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-brand-green font-semibold text-sm hover:bg-gray-50 transition-colors flex-shrink-0 disabled:opacity-60"
        >
          <Navigation className="w-4 h-4" />
          {locationLoading ? "Locating..." : "Use My Location"}
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <input
          type="search"
          placeholder="Search by name, city or field of study..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-sm"
          aria-label="Search institutions"
        />
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeType === t
                  ? "bg-brand-green text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-green hover:text-brand-green"
              }`}
              aria-pressed={activeType === t}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {SA_PROVINCES.map((p) => (
            <button
              key={p}
              onClick={() => setActiveProvince(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeProvince === p
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
              aria-pressed={activeProvince === p}
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results count */}
      <motion.p variants={itemVariants} className="text-sm text-gray-400">
        Showing {filtered.length} institution{filtered.length !== 1 ? "s" : ""}
      </motion.p>

      {/* Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((inst) => (
          <motion.div
            key={inst.id}
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: "6px 6px 0px #00A651" }}
            transition={{ duration: 0.2 }}
            className="card p-5 flex flex-col border border-gray-100"
            style={{ boxShadow: "0px 0px 0px #00A651" }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-2">
                {inst.type === "TVET College"
                  ? <Building2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                  : <GraduationCap className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                }
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug">{inst.name}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />{inst.city}, {inst.province}
                  </p>
                </div>
              </div>
            </div>

            <span className={`self-start text-xs font-semibold mb-3 ${typeColor[inst.type]}`}>
              {inst.type}
            </span>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {inst.offers.map((o) => (
                <span key={o} className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-0.5">{o}</span>
              ))}
            </div>

            <div className="mt-auto">
              <a
                href={inst.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 w-fit"
              >
                Visit Website
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-20">
          <GraduationCap className="w-10 h-10 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500">No institutions found</p>
          <p className="text-sm mt-1 text-gray-400">Try adjusting your filters or search term</p>
        </motion.div>
      )}
    </motion.div>
  );
}
