import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PRIVACY_SECTIONS = [
  { id: "p-sec-1", num: "01", title: "Information We Collect" },
  { id: "p-sec-2", num: "02", title: "Legal Grounds & Use of Data" },
  { id: "p-sec-3", num: "03", title: "Zero-Sale Data Guarantee" },
  { id: "p-sec-4", num: "04", title: "Authorized Service Disclosures" },
  { id: "p-sec-5", num: "05", title: "Data Security & 256-Bit SSL" },
  { id: "p-sec-6", num: "06", title: "Cookies & Local Storage" },
  { id: "p-sec-7", num: "07", title: "Your Privacy Rights (DPDP)" },
  { id: "p-sec-8", num: "08", title: "Data Protection Officer" },
];

const Privacy = () => {
  const [activeSection, setActiveSection] = useState("p-sec-1");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-white min-h-[85vh] pt-4 sm:pt-6 pb-16 text-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        
        {/* Breadcrumb & Meta Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="text-emerald-700 hover:underline">Home</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">Legal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">Privacy Policy</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4faee] border border-emerald-200/80 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
            <span>DPDP & GDPR Compliant • Ver. 2.1</span>
          </div>
        </div>

        {/* Page Header (Matches FoodNinja Brand Header) */}
        <div className="mb-10 max-w-3xl">
          <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-emerald-800 mb-2">
            Data Protection & Privacy Notice
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            FoodNinja Technologies is dedicated to safeguarding your personal information. This Privacy Policy details how your data is collected, handled, and protected when ordering food through our services.
          </p>

          <div className="mt-4 rounded-2xl bg-[#f4faee] border border-emerald-200/80 p-4 text-xs text-emerald-950 leading-relaxed flex items-start gap-2.5">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <div>
              <strong className="font-extrabold text-emerald-900">Zero-Sale Commitment:</strong> We never sell, rent, or trade your dining preferences, contact numbers, or delivery coordinates to commercial brokers or third-party marketing companies.
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Sticky Sidebar Navigation + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Navigation Sidebar (Desktop Sticky) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-2 rounded-2xl border border-slate-100 bg-[#f8fafc] p-4 shadow-2xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-3 pb-2 border-b border-slate-200/60">
              Table of Articles
            </h3>
            <nav className="space-y-1">
              {PRIVACY_SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? "bg-white text-emerald-800 shadow-2xs border border-emerald-200/80"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-400">{sec.num}</span>
                      <span>{sec.title}</span>
                    </span>
                    {isActive && <span className="text-emerald-600 font-black">→</span>}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-200/60 text-xs text-slate-500 px-2 space-y-1.5">
              <p className="font-semibold text-slate-700">Privacy queries or data deletion?</p>
              <Link to="/contact" className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline">
                <span>Contact Data Protection Desk</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Full Privacy Clauses */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Clause 1 */}
            <article id="p-sec-1" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  01
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Categories of Personal Data We Collect
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>1.1 Directly Provided Data:</strong> When registering, placing an order, or contacting our help desk, we collect your full name, email address, telephone number, and physical delivery address (including floor/landmark specifics).
                </p>
                <p>
                  <strong>1.2 Transaction & Billing Records:</strong> We maintain logs of your transaction identifiers, dishes ordered, order amounts, and delivery timestamps. Payment card transactions are processed securely through certified PCI-DSS payment gateways. <em>FoodNinja does not capture, store, or process raw credit card numbers or banking PINs.</em>
                </p>
                <p>
                  <strong>1.3 Geolocation & Technical Metadata:</strong> To calculate delivery feasibility and estimate arrival times, we collect device IP addresses, browser agent headers, and device geolocation coordinates (with explicit user browser permission).
                </p>
              </div>
            </article>

            {/* Clause 2 */}
            <article id="p-sec-2" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  02
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Legal Grounds & Purposes for Data Processing
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>We process your personal information under the following lawful legal bases:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Contractual Execution:</strong> To prepare, route, and deliver your food orders to your designated location.</li>
                  <li><strong>Transactional Communications:</strong> To transmit automated order confirmations, dispatch tracking alerts, and invoices.</li>
                  <li><strong>Customer Helpdesk:</strong> To resolve order issues, process refunds, and address customer questions via our Help Center.</li>
                  <li><strong>Fraud Prevention:</strong> To detect malicious bots, verify authentic deliveries, and prevent payment fraud.</li>
                  <li><strong>Statutory Compliance:</strong> To satisfy tax bookkeeping, GST invoicing, and regulatory reporting mandates.</li>
                </ul>
              </div>
            </article>

            {/* Clause 3 */}
            <article id="p-sec-3" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  03
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Zero-Sale Data Guarantee
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                FoodNinja guarantees that we do not monetize, sell, or rent your personal data to commercial advertisers, data brokers, or marketing syndicates. Data usage is strictly restricted to executing, verifying, and supporting your food delivery orders.
              </div>
            </article>

            {/* Clause 4 */}
            <article id="p-sec-4" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  04
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Authorized Disclosures to Essential Service Partners
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  We disclose limited personal data strictly on a need-to-know operational basis:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Restaurant Kitchens:</strong> Receive order items, special cooking instructions, and customer first name.</li>
                  <li><strong>Dispatch Drivers & Couriers:</strong> Receive delivery address, contact name, and masked phone number solely to execute physical handover.</li>
                  <li><strong>Payment Processors:</strong> Transaction tokens are transmitted via 256-bit encrypted channels to authorized payment gateways.</li>
                  <li><strong>Legal Authorities:</strong> We disclose data only when legally compelled by subpoena, court order, or official governmental investigation under Indian law.</li>
                </ul>
              </div>
            </article>

            {/* Clause 5 */}
            <article id="p-sec-5" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  05
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Data Security Standards & Encryption
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  FoodNinja employs robust technological and managerial safeguards to protect your personal information:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Encryption in Transit:</strong> All communications between your client device and our servers are encrypted using modern Transport Layer Security (TLS 1.3 / HTTPS).</li>
                  <li><strong>Cryptographic Password Protection:</strong> Account passwords are stored exclusively as irreversible, salted cryptographic hashes using standard industry algorithms (e.g., bcrypt).</li>
                  <li><strong>Access Controls:</strong> Internal database access is strictly restricted to authorized administrative engineers bound by confidentiality obligations.</li>
                </ul>
              </div>
            </article>

            {/* Clause 6 */}
            <article id="p-sec-6" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  06
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Cookies & Local Browser Storage
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  FoodNinja uses essential browser storage mechanisms (Session Storage and Local Storage) strictly to preserve:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Active shopping cart items between page refreshes.</li>
                  <li>Authentication login tokens to maintain secure sessions.</li>
                  <li>User interface preferences (such as selected delivery address).</li>
                </ul>
                <p>
                  We do not use invasive third-party tracking pixels that monitor your browsing behavior across unrelated commercial websites.
                </p>
              </div>
            </article>

            {/* Clause 7 */}
            <article id="p-sec-7" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  07
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Your Data Rights: Access, Rectification & Erasure
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  Under the Digital Personal Data Protection (DPDP) Act, 2023 and international privacy standards, you hold enforceable rights:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Right to Access:</strong> You may request a complete summary of all personal data held about you.</li>
                  <li><strong>Right to Rectification:</strong> You may update erroneous phone numbers, names, or addresses at any time in your profile.</li>
                  <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request the permanent deletion of your FoodNinja account and associated contact history, subject to statutory tax retention periods.</li>
                </ul>
                <p>
                  To exercise any of these rights, email our data desk at <a href="mailto:privacy@foodninja.com" className="text-emerald-700 font-bold hover:underline">privacy@foodninja.com</a>.
                </p>
              </div>
            </article>

            {/* Clause 8: Statutory Grievance Redressal Card */}
            <article id="p-sec-8" className="rounded-2xl border border-emerald-200/80 bg-[#f4faee] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-mono font-bold">
                  08
                </span>
                <h2 className="text-base sm:text-lg font-black text-emerald-950 tracking-tight">
                  Data Protection & Grievance Officer
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-emerald-900 space-y-2 leading-relaxed">
                <p>
                  For questions, concerns, or formal grievances regarding this Privacy Policy or our data handling practices:
                </p>
                <div className="mt-3 rounded-xl bg-white p-4 border border-emerald-200 text-xs space-y-1 text-slate-700">
                  <p><strong>Designation:</strong> Data Protection & Grievance Redressal Officer</p>
                  <p><strong>Entity:</strong> FoodNinja Technologies</p>
                  <p><strong>Official Email:</strong> <a href="mailto:privacy@foodninja.com" className="text-emerald-700 font-bold hover:underline">privacy@foodninja.com</a></p>
                  <p><strong>Corporate Address:</strong> FoodNinja Corporate Hub, Connaught Place, New Delhi 110001, India</p>
                  <p><strong>Turnaround Time:</strong> Formal response within 48 business hours.</p>
                </div>
              </div>
            </article>

          </div>

        </div>

        {/* Bottom CTA Row */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Need more information about your data? Visit our <Link to="/contact" className="text-emerald-700 font-bold hover:underline">Help Center</Link>.
          </p>
          <Link
            to="/menu"
            className="rounded-full bg-emerald-700 px-7 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs"
          >
            Explore Menu →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Privacy;