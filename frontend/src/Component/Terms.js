import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-[85vh] pt-4 sm:pt-6 pb-16 text-slate-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Clean Header Row (No Breadcrumb, No Clutter) */}
        <div className="pb-5 border-b border-slate-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Terms & Conditions of Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              FoodNinja Technologies • Customer Operating Agreement
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 text-xs font-bold text-emerald-800">
            Last Updated: October 2025
          </span>
        </div>

        {/* Introduction Summary */}
        <div className="rounded-2xl border border-slate-100 bg-[#f8fafc] p-5 sm:p-6 mb-8 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
          <p>
            Please read these Terms and Conditions (&quot;Terms&quot;, &quot;Agreement&quot;) carefully before using the FoodNinja platform. These terms govern your access to our food ordering marketplace, delivery coordination, and digital services operated by FoodNinja Technologies (&quot;FoodNinja&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
          <p className="font-semibold text-slate-800">
            By creating an account, browsing menu items, or placing an order, you confirm that you accept and agree to be legally bound by these terms.
          </p>
        </div>

        {/* Direct Single-Column Articles */}
        <div className="space-y-6">
          
          {/* Section 1 */}
          <article className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-xs">
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

          {/* Section 2 */}
          <article className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-xs">
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

          {/* Section 3 */}
          <article className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-xs">
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

          {/* Section 4 */}
          <article className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-xs">
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

          {/* Section 5 */}
          <article className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-xs">
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

          {/* Section 6 */}
          <article className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-xs">
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

          {/* Section 7 */}
          <article className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-xs">
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

          {/* Section 8 */}
          <article className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-xs">
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

          {/* Section 9: Statutory Grievance Redressal Card */}
          <article className="rounded-2xl border border-emerald-200/80 bg-[#f4faee] p-6 sm:p-7 shadow-xs">
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