import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SECTIONS = [
  { id: "sec-1", num: "01", title: "Intermediary & Marketplace Status" },
  { id: "sec-2", num: "02", title: "Food Quality & Allergen Disclaimer" },
  { id: "sec-3", num: "03", title: "Orders, Pricing & Payments" },
  { id: "sec-4", num: "04", title: "Delivery Logistics & Force Majeure" },
  { id: "sec-5", num: "05", title: "Cancellation & Refund Policy" },
  { id: "sec-6", num: "06", title: "Limitation of Legal Liability" },
  { id: "sec-7", num: "07", title: "Intellectual Property Rights" },
  { id: "sec-8", num: "08", title: "Governing Law & Arbitration" },
  { id: "sec-9", num: "09", title: "Grievance Redressal Officer" },
];

const Terms = () => {
  const [activeSection, setActiveSection] = useState("sec-1");

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
            <span className="text-slate-900 font-bold">Terms of Service</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4faee] border border-emerald-200/80 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
            <span>Effective: October 2025 • Ver. 2.4</span>
          </div>
        </div>

        {/* Page Header (Matches FoodNinja Brand Header) */}
        <div className="mb-10 max-w-3xl">
          <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-emerald-800 mb-2">
            Legal Terms & Operating Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            These terms govern your access to the FoodNinja platform, restaurant ordering facilitation, and delivery coordination. By using our service, you agree to these legally binding terms.
          </p>

          <div className="mt-4 rounded-2xl bg-[#fff8e7] border border-amber-200/70 p-4 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <strong className="font-extrabold text-amber-950">Notice on Safe Harbor & Allergen Disclaimers:</strong> FoodNinja acts as an intermediary facilitating marketplace food discovery. Food preparation and allergen compliance remain the sole responsibility of the preparing kitchen partner.
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
              {SECTIONS.map((sec) => {
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
              <p className="font-semibold text-slate-700">Need legal assistance?</p>
              <Link to="/contact" className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline">
                <span>Contact Grievance Desk</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Full Legal Clauses */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Clause 1 */}
            <article id="sec-1" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  01
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Platform Status as an Intermediary & Marketplace Facilitator
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>1.1 Intermediary Service:</strong> FoodNinja operates strictly as a digital marketplace facilitator and technology intermediary under Section 79 of the Information Technology Act, 2000 (and applicable safe harbor doctrines). We connect independent third-party kitchens, restaurants, and cloud outlets (&quot;Restaurant Partners&quot;) with consumers seeking food items and logistics coordination (&quot;Customers&quot;).
                </p>
                <p>
                  <strong>1.2 Independent Merchants:</strong> FoodNinja does not own, operate, cook, or prepare food items. The commercial contract for the sale, preparation, hygiene, and packaging of any dish is formed exclusively between you and the respective Restaurant Partner.
                </p>
                <p>
                  <strong>1.3 Third-Party Logistics:</strong> Delivery logistics are carried out by independent dispatch drivers or third-party courier operators. FoodNinja provides routing and status communication but disclaims direct employment liability over independent carriers.
                </p>
              </div>
            </article>

            {/* Clause 2 */}
            <article id="sec-2" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  02
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Food Preparation, Quality & Allergen Disclaimer
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>2.1 Allergen Warning:</strong> Food items may contain or come into contact with common allergens, including peanuts, tree nuts, dairy, soy, gluten, seafood, eggs, or sesame. FoodNinja disclaims all liability regarding allergic reactions, ingredient variations, or cross-contamination at restaurant premises.
                </p>
                <p>
                  <strong>2.2 Dietary Badges & Descriptions:</strong> While Restaurant Partners provide dietary markers (e.g. &quot;Veg&quot;, &quot;Non-Veg&quot;, calorie estimates), FoodNinja relies on merchant representations in good faith. Users with severe allergies must contact the preparing kitchen directly before ordering.
                </p>
                <p>
                  <strong>2.3 Warranty Disclaimer:</strong> All menu listings and food orders are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express, statutory, or implied, including warranties of merchantability, fitness for a particular purpose, taste preference, or temperature retention.
                </p>
              </div>
            </article>

            {/* Clause 3 */}
            <article id="sec-3" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  03
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Orders, Pricing, Billing & Payment Processing
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>3.1 Order Confirmation:</strong> An order placed through FoodNinja constitutes an offer to purchase. A binding agreement is formed only upon acceptance and kitchen confirmation.
                </p>
                <p>
                  <strong>3.2 Pricing & Taxes:</strong> All prices displayed are set by Restaurant Partners and are inclusive of applicable taxes (GST) and delivery/packaging surcharges as detailed at checkout. In the event of a typographical pricing error, FoodNinja reserves the right to cancel the order prior to dispatch with a full refund.
                </p>
                <p>
                  <strong>3.3 Secure Payment Gateways:</strong> Payments are processed via PCI-DSS compliant third-party payment processors (e.g., Razorpay, Stripe, Net Banking, UPI). FoodNinja does not store your complete credit card numbers, CVV, or banking PINs on its servers.
                </p>
              </div>
            </article>

            {/* Clause 4 */}
            <article id="sec-4" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  04
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Delivery Estimates, Access & Force Majeure
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>4.1 Non-Guaranteed Delivery Times:</strong> Stated delivery windows (e.g., &quot;25–35 mins&quot;) are non-binding operational estimates influenced by preparation complexity, peak rush hours, traffic volume, and road conditions. Time is not of the essence in food transit.
                </p>
                <p>
                  <strong>4.2 Accurate Delivery Details:</strong> Customers must provide complete delivery addresses, contact numbers, and building instructions. If delivery cannot be completed due to customer unavailability or gated access refusal after 10 minutes of arrival, the order will be deemed completed and non-refundable.
                </p>
                <p>
                  <strong>4.3 Force Majeure:</strong> FoodNinja and its delivery partners shall not be liable for failure to deliver or delays arising from events beyond reasonable control, including adverse weather, civic unrest, curfews, strikes, government restrictions, or telecommunication outages.
                </p>
              </div>
            </article>

            {/* Clause 5 */}
            <article id="sec-5" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  05
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Cancellations, Missing Items & Refund Policy
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>5.1 Cancellation Window:</strong> Because food preparation begins immediately upon order receipt, cancellations by the customer are only permitted within 60 seconds of order placement. Once the kitchen has accepted the order, the full order amount is non-refundable.
                </p>
                <p>
                  <strong>5.2 Damaged or Missing Goods:</strong> If an order arrives with missing items or severe packaging damage, the customer must submit photographic evidence to our Help Center within two (2) hours of delivery. Verified claims will be remediated via item replacement or pro-rata refund.
                </p>
                <p>
                  <strong>5.3 Refund Processing:</strong> Approved refunds are credited to the original source payment method within 3 to 7 business days, depending on your financial institution.
                </p>
              </div>
            </article>

            {/* Clause 6 */}
            <article id="sec-6" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  06
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Limitation of Legal Liability & Total Cap
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>6.1 Consequential Damages Waiver:</strong> To the maximum extent permitted by applicable law, FoodNinja, its directors, officers, employees, founders, and affiliates shall under no circumstances be liable for any indirect, incidental, special, punitive, exemplary, or consequential damages arising out of or related to your use of the platform.
                </p>
                <div className="rounded-xl bg-[#f0f9ff] border border-sky-200/80 p-3.5 text-xs text-sky-950 font-semibold">
                  <strong>6.2 STRICT LIABILITY CAP:</strong> FOODNINJA&apos;S ENTIRE AGGREGATE LIABILITY ARISING FROM ANY CLAIM, TORT, CONTRACT, OR NEGLIGENCE SHALL BE STRICTLY LIMITED TO THE GREATER OF: (A) THE TOTAL AMOUNT ACTUALLY PAID BY YOU FOR THE SPECIFIC ORDER IN DISPUTE; OR (B) INR 500 (FIVE HUNDRED INDIAN RUPEES).
                </div>
              </div>
            </article>

            {/* Clause 7 */}
            <article id="sec-7" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  07
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Intellectual Property & Proprietary Rights
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The FoodNinja name, trade dress, custom leaf & bowl logos, graphical mockups, brand assets, site architecture, and source code are the proprietary intellectual property of FoodNinja Technologies. Unauthorized scraping, reverse engineering, or commercial exploitation is strictly prohibited and subject to civil and criminal prosecution.
              </div>
            </article>

            {/* Clause 8 */}
            <article id="sec-8" className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-200 transition">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  08
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Governing Law, Arbitration & Dispute Resolution
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>8.1 Governing Law:</strong> These Terms shall be construed and governed in accordance with the substantive laws of the Republic of India.
                </p>
                <p>
                  <strong>8.2 Mandatory Arbitration:</strong> Any dispute or claim shall first be submitted to mutual amicable resolution. If unresolved within 30 days, it shall be resolved by binding solo arbitration in New Delhi, India in accordance with the Arbitration and Conciliation Act, 1996.
                </p>
                <p>
                  <strong>8.3 Exclusive Jurisdiction:</strong> Subject to arbitration, the competent courts in New Delhi, India shall have exclusive territorial jurisdiction.
                </p>
              </div>
            </article>

            {/* Clause 9: Statutory Grievance Redressal Card */}
            <article id="sec-9" className="rounded-2xl border border-emerald-200/80 bg-[#f4faee] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-mono font-bold">
                  09
                </span>
                <h2 className="text-base sm:text-lg font-black text-emerald-950 tracking-tight">
                  Statutory Grievance Redressal Officer
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-emerald-900 space-y-2 leading-relaxed">
                <p>
                  In compliance with the Information Technology (Intermediary Guidelines) Rules, 2021 and Consumer Protection (E-Commerce) Rules, 2020:
                </p>
                <div className="mt-3 rounded-xl bg-white p-4 border border-emerald-200 text-xs space-y-1 text-slate-700">
                  <p><strong>Designation:</strong> Statutory Grievance Redressal Officer</p>
                  <p><strong>Entity:</strong> FoodNinja Technologies</p>
                  <p><strong>Official Email:</strong> <a href="mailto:grievance@foodninja.com" className="text-emerald-700 font-bold hover:underline">grievance@foodninja.com</a></p>
                  <p><strong>Corporate Address:</strong> FoodNinja Corporate Hub, Connaught Place, New Delhi 110001, India</p>
                  <p><strong>Turnaround Time:</strong> Acknowledgment within 24–48 hours; resolution within 15 working days.</p>
                </div>
              </div>
            </article>

          </div>

        </div>

        {/* Bottom CTA Row */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Have questions about these terms? Visit our <Link to="/contact" className="text-emerald-700 font-bold hover:underline">Help Center</Link>.
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

export default Terms;