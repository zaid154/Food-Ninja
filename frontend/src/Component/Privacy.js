import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 text-slate-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header Breadcrumb & Document Badge */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="text-emerald-700 hover:underline">Home</Link>
            <span>/</span>
            <span>Legal</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Privacy Policy</span>
          </div>
          <span className="rounded-full bg-slate-200/80 px-3 py-1 text-[11px] font-bold text-slate-700">
            Last Updated: October 2025
          </span>
        </div>

        {/* Title Block */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
            Data Protection & Privacy Notice
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            FoodNinja Technologies (&quot;FoodNinja&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to upholding the confidentiality, integrity, and security of your personal data. This Privacy Policy details how we collect, process, store, and safeguard your personal information when you access our website, applications, and delivery services.
          </p>

          <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200/80 p-4 text-xs text-emerald-900 leading-relaxed flex items-start gap-3">
            <span className="text-lg">🛡️</span>
            <div>
              <strong className="font-bold">Our Core Privacy Commitment:</strong> We never sell, rent, or trade your personal contact details, dining habits, or payment information to commercial data brokers. Your information is used strictly to fulfill your food orders and improve your direct FoodNinja experience.
            </div>
          </div>
        </div>

        {/* Privacy Articles */}
        <div className="space-y-6">
          
          {/* Section 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">1</span>
              Categories of Personal Data We Collect
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>1.1 Directly Provided Data:</strong> When you register an account, update your profile, or place an order, we collect your full name, email address, telephone number, and physical delivery address (including floor/landmark specifics).
              </p>
              <p>
                <strong>1.2 Transaction & Billing Records:</strong> We maintain logs of your transaction identifiers, items ordered, order amounts, and delivery timestamps. Payment card transactions are processed securely through certified PCI-DSS payment gateways. <em>FoodNinja does not capture, store, or process raw credit card numbers or banking PINs.</em>
              </p>
              <p>
                <strong>1.3 Geolocation & Technical Metadata:</strong> To calculate delivery feasibility and estimate arrival times, we collect device IP addresses, browser agent headers, and device geolocation coordinates (with explicit user browser permission).
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">2</span>
              Legal Grounds & Purposes for Data Processing
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>We process your personal information under the following lawful legal bases:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Contractual Necessity:</strong> To prepare, route, and deliver your food orders to the specified destination.</li>
                <li><strong>Service Communication:</strong> To transmit automated transactional updates (order confirmation, dispatch alerts, payment invoices).</li>
                <li><strong>Customer Support:</strong> To investigate missing items, process refunds, and respond to inquiries via our Help Center.</li>
                <li><strong>Fraud Prevention & Platform Security:</strong> To detect malicious bot traffic, verify authentic orders, and prevent payment fraud.</li>
                <li><strong>Statutory Compliance:</strong> To satisfy tax bookkeeping, GST invoicing, and regulatory reporting mandates.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">3</span>
              Authorized Disclosures to Essential Service Providers
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                We disclose limited personal data strictly on a need-to-know basis to fulfill your delivery:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Restaurant Partners:</strong> Receive order items, special cooking instructions, and customer first name. (Full telephone numbers and addresses are shielded where practical).</li>
                <li><strong>Dispatch Drivers & Couriers:</strong> Receive customer delivery address, contact name, and masked phone numbers solely to execute delivery.</li>
                <li><strong>Payment Processors:</strong> Transaction tokens are transmitted via 256-bit encrypted channels to authorized payment gateways.</li>
                <li><strong>Legal & Law Enforcement Demands:</strong> We disclose data only when legally compelled by subpoena, court order, or official governmental investigation under Indian law.</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">4</span>
              Data Security Standards & Encryption
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                FoodNinja employs robust technological and managerial safeguards to protect your personal information:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Encryption in Transit:</strong> All communications between your client device and our servers are encrypted using modern Transport Layer Security (TLS 1.3 / HTTPS).</li>
                <li><strong>Cryptographic Password Protection:</strong> Account passwords are stored exclusively as irreversible, salted cryptographic hashes using standard industry algorithms (e.g., bcrypt).</li>
                <li><strong>Access Controls:</strong> Internal database access is strictly restricted to authorized administrative engineers bound by confidentiality obligations.</li>
              </ul>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">5</span>
              Cookies & Local Browser Storage
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
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
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">6</span>
              Your Data Rights: Access, Rectification & Erasure
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                Under the Digital Personal Data Protection (DPDP) Act, 2023 and international privacy standards, you hold enforceable rights:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Right to Access:</strong> You may request a complete summary of all personal data held about you.</li>
                <li><strong>Right to Rectification:</strong> You may update erroneous phone numbers, names, or addresses at any time in your profile.</li>
                <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request the permanent deletion of your FoodNinja account and associated contact history, subject to statutory tax retention periods (typically financial transaction records retained for legal auditing).</li>
              </ul>
              <p>
                To exercise any of these rights, email our data desk at <a href="mailto:privacy@foodninja.com" className="text-emerald-700 font-bold hover:underline">privacy@foodninja.com</a>.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">7</span>
              Statutory Grievance & Data Protection Officer
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
              <p>
                For questions, concerns, or formal grievances regarding this Privacy Policy or our data handling practices, contact our designated Grievance Officer:
              </p>
              <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <p><strong>Designation:</strong> Data Protection & Grievance Redressal Officer</p>
                <p><strong>Entity:</strong> FoodNinja Technologies</p>
                <p><strong>Email:</strong> <a href="mailto:privacy@foodninja.com" className="text-emerald-700 font-bold hover:underline">privacy@foodninja.com</a></p>
                <p><strong>Physical Address:</strong> FoodNinja Corporate Hub, Connaught Place, New Delhi 110001, India</p>
                <p><strong>Official Helpdesk:</strong> <Link to="/contact" className="text-emerald-700 font-bold hover:underline">Open Help Center Support Ticket</Link></p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Back Button */}
        <div className="mt-10 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-7 py-3 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-sm"
          >
            <span>Return to Menu</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Privacy;