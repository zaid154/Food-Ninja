import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../utils/Constants";

const PRIVACY_SECTIONS = [
  {
    num: "01",
    title: "Categories of Personal Data We Collect",
    paragraphs: [
      { prefix: "1.1 Directly Provided Data:", text: "When registering, placing an order, or contacting our help desk, we collect your full name, email address, telephone number, and physical delivery address (including floor/landmark specifics)." },
      { prefix: "1.2 Transaction & Billing Records:", text: "We maintain logs of your transaction identifiers, dishes ordered, order amounts, and delivery timestamps. Payment card transactions are processed securely through certified PCI-DSS payment gateways. FoodNinja does not capture, store, or process raw credit card numbers or banking PINs." },
      { prefix: "1.3 Geolocation & Technical Metadata:", text: "To calculate delivery feasibility and estimate arrival times, we collect device IP addresses, browser agent headers, and device geolocation coordinates (with explicit user browser permission)." }
    ]
  },
  {
    num: "02",
    title: "Legal Grounds & Purposes for Data Processing",
    lead: "We process your personal information under the following lawful legal bases:",
    list: [
      { title: "Contractual Execution", desc: "To prepare, route, and deliver your food orders to your designated location." },
      { title: "Transactional Communications", desc: "To transmit automated order confirmations, dispatch tracking alerts, and invoices." },
      { title: "Customer Helpdesk", desc: "To resolve order issues, process refunds, and address customer questions via our Help Center." },
      { title: "Fraud Prevention", desc: "To detect malicious bots, verify authentic deliveries, and prevent payment fraud." },
      { title: "Statutory Compliance", desc: "To satisfy tax bookkeeping, GST invoicing, and regulatory reporting mandates." }
    ]
  },
  {
    num: "03",
    title: "Zero-Sale Data Guarantee",
    paragraphs: [
      { text: "FoodNinja guarantees that we do not monetize, sell, or rent your personal data to commercial advertisers, data brokers, or marketing syndicates. Data usage is strictly restricted to executing, verifying, and supporting your food delivery orders." }
    ]
  },
  {
    num: "04",
    title: "Internal Kitchen Preparation & Fulfillment Disclosures",
    lead: "FoodNinja is a direct restaurant and kitchen; we do not share your customer profile with third-party restaurant networks. Data is utilized strictly within our operations:",
    list: [
      { title: "Internal Kitchen Culinary Staff", desc: "Receives meal selections and customer special dietary notes to cook your order fresh." },
      { title: "Dispatch Riders & Couriers", desc: "Receives delivery address, recipient name, and contact number solely to execute physical delivery." },
      { title: "Payment Processors", desc: "Transaction tokens are transmitted via 256-bit encrypted channels to certified payment gateways." },
      { title: "Statutory Compliance", desc: "Data is disclosed only when legally mandated by Indian law enforcement or official court directives." }
    ]
  },
  {
    num: "05",
    title: "Data Security Standards & Encryption",
    lead: "FoodNinja employs robust technological and managerial safeguards to protect your personal information:",
    list: [
      { title: "Encryption in Transit", desc: "All communications between your client device and our servers are encrypted using modern Transport Layer Security (TLS 1.3 / HTTPS)." },
      { title: "Cryptographic Password Protection", desc: "Account passwords are stored exclusively as irreversible, salted cryptographic hashes using standard industry algorithms (e.g., bcrypt)." },
      { title: "Access Controls", desc: "Internal database access is strictly restricted to authorized administrative engineers bound by confidentiality obligations." }
    ]
  },
  {
    num: "06",
    title: "Cookies & Local Browser Storage",
    lead: "FoodNinja uses essential browser storage mechanisms (Session Storage and Local Storage) strictly to preserve:",
    list: [
      { title: "Cart Items", desc: "Active shopping cart items between page refreshes." },
      { title: "Authentication", desc: "Authentication login tokens to maintain secure sessions." },
      { title: "Preferences", desc: "User interface preferences (such as selected delivery address)." }
    ],
    tail: "We do not use invasive third-party tracking pixels that monitor your browsing behavior across unrelated commercial websites."
  },
  {
    num: "07",
    title: "Your Data Rights: Access, Rectification & Erasure",
    lead: "Under the Digital Personal Data Protection (DPDP) Act, 2023 and international privacy standards, you hold enforceable rights:",
    list: [
      { title: "Right to Access", desc: "You may request a complete summary of all personal data held about you." },
      { title: "Right to Rectification", desc: "You may update erroneous phone numbers, names, or addresses at any time in your profile." },
      { title: "Right to Erasure (\"Right to be Forgotten\")", desc: "You may request the permanent deletion of your FoodNinja account and associated contact history, subject to statutory tax retention periods." }
    ],
    contactTail: "To exercise any of these rights, email our data desk at "
  }
];

const PrivacyPage = () => {
  const [settings, setSettings] = useState({
    restaurantName: "Food Ninja",
    storeEmail: "support@foodninja.com",
    storeAddress: "Shop 12, Food Street, Sector 62, Delhi NCR",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadSettings = () => {
      if (typeof fetch === "undefined") return;
      fetch(`${API_BASE_URL}/settings`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.settings) setSettings((prev) => ({ ...prev, ...d.settings }));
        })
        .catch(() => {});
    };
    loadSettings();
    window.addEventListener("store_settings_updated", loadSettings);
    return () => window.removeEventListener("store_settings_updated", loadSettings);
  }, []);

  return (
    <div className="bg-white min-h-[85vh] pt-4 sm:pt-6 pb-16 text-slate-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="pb-5 border-b border-slate-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Privacy & Data Protection Policy</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">FoodNinja Technologies • User Privacy Commitment</p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 text-xs font-bold text-emerald-800">
            DPDP & GDPR Compliant
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-[#f8fafc] p-5 sm:p-6 mb-8 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
          <p>FoodNinja Technologies is dedicated to safeguarding your personal information. This Privacy Policy details how your personal data is collected, handled, and protected when ordering food through our services.</p>
          <p className="font-semibold text-slate-800">We never sell, rent, or trade your dining preferences, contact numbers, or delivery coordinates to commercial brokers or third-party marketing companies.</p>
        </div>

        <div className="space-y-6">
          {PRIVACY_SECTIONS.map((sec) => (
            <article key={sec.num} className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  {sec.num}
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{sec.title}</h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                {sec.lead && <p>{sec.lead}</p>}
                {sec.paragraphs?.map((p, idx) => (
                  <p key={idx}>{p.prefix && <strong>{p.prefix} </strong>}{p.text}</p>
                ))}
                {sec.list && (
                  <ul className="list-disc pl-5 space-y-1.5">
                    {sec.list.map((item, idx) => (
                      <li key={idx}><strong>{item.title}:</strong> {item.desc}</li>
                    ))}
                  </ul>
                )}
                {sec.tail && <p>{sec.tail}</p>}
                {sec.contactTail && (
                  <p>{sec.contactTail}<a href="mailto:foodninja@gmail.com" className="text-emerald-700 font-bold hover:underline">foodninja@gmail.com</a>.</p>
                )}
              </div>
            </article>
          ))}

          {/* Section 08: Statutory Grievance Redressal Card */}
          <article className="rounded-2xl border border-emerald-200/80 bg-[#f4faee] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-mono font-bold">08</span>
              <h2 className="text-base sm:text-lg font-black text-emerald-950 tracking-tight">Data Protection & Grievance Officer</h2>
            </div>
            <div className="text-xs sm:text-sm text-emerald-900 space-y-2 leading-relaxed">
              <p>For questions, concerns, or formal grievances regarding this Privacy Policy or our data handling practices:</p>
              <div className="mt-3 rounded-xl bg-white p-4 border border-emerald-200 text-xs space-y-1 text-slate-700">
                <p><strong>Designation:</strong> Data Protection & Grievance Redressal Officer</p>
                <p><strong>Entity:</strong> {settings.restaurantName || "Food Ninja"}</p>
                <p><strong>Official Email:</strong> <a href={`mailto:${settings.storeEmail || "support@foodninja.com"}`} className="text-emerald-700 font-bold hover:underline">{settings.storeEmail || "support@foodninja.com"}</a></p>
                <p><strong>Corporate Address:</strong> {settings.storeAddress || "Food Ninja Central Kitchen, Delhi NCR, India"}</p>
                <p><strong>Turnaround Time:</strong> Formal response within 48 business hours.</p>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Need more information about your data? Visit our <Link to="/contact" className="text-emerald-700 font-bold hover:underline">Help Center</Link>.
          </p>
          <Link to="/menu" className="rounded-full bg-emerald-700 px-7 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs">
            Explore Menu →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
