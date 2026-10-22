import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Terms = () => {
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
            <span className="text-slate-900 font-bold">Terms of Service</span>
          </div>
          <span className="rounded-full bg-slate-200/80 px-3 py-1 text-[11px] font-bold text-slate-700">
            Last Updated: October 2025
          </span>
        </div>

        {/* Title Block */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
            Official Legal Agreement
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Please read these Terms and Conditions (&quot;Terms&quot;, &quot;Agreement&quot;) carefully before accessing or using the FoodNinja web application, mobile interfaces, or any affiliated food delivery services operated by FoodNinja Technologies (&quot;FoodNinja&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>

          <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200/80 p-4 text-xs text-amber-900 leading-relaxed">
            <strong className="font-bold">Important Notice:</strong> By browsing, creating an account, or placing any order through FoodNinja, you explicitly acknowledge that you have read, understood, and irrevocably agree to be bound by these Terms and our Privacy Policy. If you do not accept these Terms in full, you must discontinue using our services immediately.
          </div>
        </div>

        {/* Legal Body Articles */}
        <div className="space-y-6">
          
          {/* Section 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">1</span>
              Platform Status as an Intermediary & Marketplace Facilitator
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>1.1 Intermediary Service:</strong> FoodNinja operates strictly as a digital marketplace facilitator and technology intermediary under Section 79 of the Information Technology Act, 2000 (and applicable safe harbor doctrines). We connect independent third-party kitchens, restaurants, and cloud outlets (&quot;Restaurant Partners&quot;) with consumers seeking food items and logistics coordination (&quot;Customers&quot;).
              </p>
              <p>
                <strong>1.2 Independent Merchants:</strong> FoodNinja does not own, operate, or prepare food items. The commercial contract for the sale, preparation, and packaging of any dish is formed exclusively between you and the respective Restaurant Partner.
              </p>
              <p>
                <strong>1.3 Third-Party Logistics:</strong> Delivery logistics are carried out by independent dispatch drivers or third-party courier operators. FoodNinja provides routing and status communication but disclaims direct employment liability over independent carriers.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">2</span>
              Food Preparation, Quality & Allergen Disclaimer
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>2.1 Allergen Warning:</strong> Food items may contain or come into contact with common allergens, including but not limited to peanuts, tree nuts, dairy, soy, gluten, seafood, eggs, or sesame. FoodNinja disclaims all liability regarding allergic reactions, ingredient variations, or cross-contamination at restaurant premises.
              </p>
              <p>
                <strong>2.2 Dietary Badges & Descriptions:</strong> While Restaurant Partners provide dietary markers (e.g. &quot;Veg&quot;, &quot;Non-Veg&quot;, calorie estimates), FoodNinja relies on merchant representations in good faith and does not perform independent chemical assays. Users with severe allergies must contact the preparing kitchen directly before ordering.
              </p>
              <p>
                <strong>2.3 Warranty Disclaimer:</strong> All menu listings and food orders are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express, statutory, or implied, including warranties of merchantability, fitness for a particular purpose, taste preference, or temperature retention.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">3</span>
              Orders, Pricing, Billing & Payment Processing
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>3.1 Order Confirmation:</strong> An order placed through FoodNinja constitutes an offer to purchase. A binding agreement is formed only upon acceptance and kitchen confirmation.
              </p>
              <p>
                <strong>3.2 Pricing & Taxes:</strong> All prices displayed are set by Restaurant Partners and are inclusive or exclusive of applicable taxes (GST, VAT, sales tax) and delivery/packaging surcharges as detailed at checkout. In the event of a typographical pricing error, FoodNinja reserves the right to cancel the order prior to dispatch with a full refund.
              </p>
              <p>
                <strong>3.3 Secure Payment Gateways:</strong> Payments are processed via PCI-DSS compliant third-party payment processors (e.g., Razorpay, Stripe, Net Banking, UPI). FoodNinja does not store your complete credit card numbers, CVV, or banking PINs on its servers.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">4</span>
              Delivery Estimates, Access & Force Majeure
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>4.1 Non-Guaranteed Delivery Times:</strong> Stated delivery windows (e.g., &quot;25–35 mins&quot;) are non-binding operational estimates influenced by preparation complexity, peak rush hours, traffic volume, and road conditions. Time is not of the essence in food transit.
              </p>
              <p>
                <strong>4.2 Accurate Delivery Details:</strong> Customers must provide complete delivery addresses, contact numbers, and building instructions. If delivery cannot be completed due to customer unavailability, incorrect coordinates, or gated access refusal after 10 minutes of arrival, the order will be deemed completed and non-refundable.
              </p>
              <p>
                <strong>4.3 Force Majeure:</strong> FoodNinja and its delivery partners shall not be liable for failure to deliver or delays arising from events beyond reasonable control, including adverse weather (floods, heavy monsoons), civic unrest, curfews, strikes, government restrictions, or telecommunication outages.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">5</span>
              Cancellations, Missing Items & Refund Policy
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
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
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">6</span>
              Limitation of Legal Liability & Total Cap
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>6.1 Consequential Damages Waiver:</strong> To the maximum extent permitted by applicable law, FoodNinja, its directors, officers, employees, founders, and affiliates shall under no circumstances be liable for any indirect, incidental, special, punitive, exemplary, or consequential damages (including loss of profits, goodwill, business interruption, or personal health consequences) arising out of or related to your use of the platform.
              </p>
              <p className="p-3.5 rounded-xl bg-slate-100 font-mono text-xs text-slate-800 font-semibold">
                <strong>6.2 STRICT LIABILITY CAP:</strong> NOTWITHSTANDING ANYTHING TO THE CONTRARY, FOODNINJA&apos;S ENTIRE AGGREGATE LIABILITY ARISING FROM ANY CLAIM, TORT, CONTRACT, OR NEGLIGENCE SHALL BE STRICTLY LIMITED TO THE GREATER OF: (A) THE TOTAL AMOUNT ACTUALLY PAID BY YOU FOR THE SPECIFIC ORDER IN DISPUTE; OR (B) INR 500 (FIVE HUNDRED INDIAN RUPEES).
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">7</span>
              Intellectual Property & Proprietary Rights
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                The FoodNinja name, trade dress, custom leaf & bowl logos, graphical mockups, brand assets, site architecture, and source code are the proprietary intellectual property of FoodNinja Technologies. Unauthorized scraping, reverse engineering, unauthorized mirroring, or commercial exploitation is strictly prohibited and subject to civil and criminal prosecution.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">8</span>
              Governing Law, Arbitration & Dispute Resolution
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>8.1 Governing Law:</strong> These Terms shall be construed and governed in accordance with the substantive laws of the Republic of India, without regard to its conflict of law provisions.
              </p>
              <p>
                <strong>8.2 Mandatory Arbitration:</strong> Any dispute, controversy, or claim arising out of or relating to this platform shall first be submitted to mutual amicable resolution. If unresolved within 30 days, it shall be resolved by binding solo arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be New Delhi, India.
              </p>
              <p>
                <strong>8.3 Exclusive Jurisdiction:</strong> Subject to arbitration, the competent courts situated in New Delhi, India shall have exclusive territorial jurisdiction over any legal proceedings.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">9</span>
              Statutory Grievance Redressal Officer
            </h2>
            <div className="mt-3 text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
              <p>
                In compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Consumer Protection (E-Commerce) Rules, 2020, the designated Grievance Officer is:
              </p>
              <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <p><strong>Officer:</strong> Grievance Redressal Desk</p>
                <p><strong>Company:</strong> FoodNinja Technologies</p>
                <p><strong>Email:</strong> <a href="mailto:grievance@foodninja.com" className="text-emerald-700 font-bold hover:underline">grievance@foodninja.com</a></p>
                <p><strong>Official Helpdesk:</strong> <Link to="/contact" className="text-emerald-700 font-bold hover:underline">Visit Help Center</Link></p>
                <p><strong>Turnaround Time:</strong> Acknowledgment within 24–48 hours; resolution within 15 working days.</p>
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

export default Terms;