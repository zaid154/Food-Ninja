import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../utils/Constants";

const TERMS_SECTIONS = [
  {
    num: "01",
    title: "FoodNinja Restaurant Operations & Culinary Services",
    items: [
      { prefix: "1.1 Direct Kitchen Operations:", text: "FoodNinja operates its own certified professional kitchen and food preparation facility. All recipes, dishes, and beverages presented on this platform are freshly cooked on order by our executive culinary staff. We are a direct restaurant brand, not a third-party aggregator." },
      { prefix: "1.2 Freshness & Hygiene Standard:", text: "Every dish is prepared adhering strictly to FSSAI standards and international kitchen hygiene practices. Meals are packaged in food-grade, tamper-evident containers to guarantee freshness and heat retention during transit." },
      { prefix: "1.3 Delivery Logistics:", text: "Delivery is executed via our dedicated dispatch team and trusted logistics partners to ensure prompt delivery within estimated transit windows." }
    ]
  },
  {
    num: "02",
    title: "Dietary Markers (Veg, Non-Veg, Vegan) & Allergen Verification",
    items: [
      { prefix: "2.1 Strict Kitchen Segregation:", text: "We proudly prepare authentic Vegetarian, Non-Vegetarian, and Vegan dishes. Our kitchen maintains strictly segregated preparation zones, cookware, and cutting boards to avoid cross-contact between Vegetarian and Non-Vegetarian items." },
      { prefix: "2.2 Certified Dietary Badges:", text: "Every menu item is clearly labeled with its respective dietary symbol: Green badge (Vegetarian), Red badge (Non-Vegetarian), and Vegan markers. Detailed ingredient listings and calorie counts are provided on each recipe card." },
      { prefix: "2.3 Allergen Protocols:", text: "While our kitchen follows thorough sanitization, common ingredients containing gluten, tree nuts, peanuts, dairy, soy, or eggs are present in our facility. Customers with acute, life-threatening medical allergies must review ingredient breakdowns carefully and note special requirements during checkout." },
      { prefix: "2.4 Fresh-to-Order Guarantee:", text: "We never serve frozen, pre-cooked, or leftover dishes. Every order triggers fresh preparation immediately upon confirmation." }
    ]
  },
  {
    num: "03",
    title: "Orders, Pricing, Billing & Payment Processing",
    items: [
      { prefix: "3.1 Order Confirmation:", text: "An order placed on FoodNinja constitutes an offer to purchase freshly prepared food. Acceptance occurs when our kitchen begins active preparation." },
      { prefix: "3.2 Transparent Pricing & Taxes:", text: "Menu prices are the item prices. Applicable GST, delivery charges, and packaging or handling fees are shown separately in the checkout bill before you place your order." },
      { prefix: "3.3 Secure Payment Gateways:", text: "Payments are processed via PCI-DSS certified third-party payment gateways (Razorpay, Stripe, UPI, Net Banking). FoodNinja does not store your credit/debit card numbers, CVVs, or banking PINs." }
    ]
  },
  {
    num: "04",
    title: "Delivery Windows, Hot Dispatch & Force Majeure",
    items: [
      { prefix: "4.1 Estimated Delivery Times:", text: "Displayed delivery estimates (e.g., \"25–35 mins\") reflect kitchen preparation and average transit time. Delays may occur during peak dining hours or heavy traffic." },
      { prefix: "4.2 Accurate Delivery Information:", text: "Customers must supply an accurate address, contact number, and building instructions. If delivery cannot be completed due to unreachable contact or address refusal after arrival, the order will be marked complete and is non-refundable." },
      { prefix: "4.3 Force Majeure:", text: "FoodNinja shall not be held liable for delivery delays or failures arising from severe weather (heavy rainfall, waterlogging), civic unrest, road blockades, or government-imposed curfews." }
    ]
  },
  {
    num: "05",
    title: "Cancellations, Missing Items & Kitchen Refund Policy",
    items: [
      { prefix: "5.1 Cancellation Window:", text: "Because raw ingredients are fired immediately upon order arrival, cancellations are strictly permitted within 60 seconds of order placement. Once cooking begins, orders cannot be canceled." },
      { prefix: "5.2 Damaged or Incorrect Dishes:", text: "If your delivery arrives damaged, tampered, or missing an item, report the issue via our Help Center with a photo within two (2) hours of delivery. Verified claims receive an immediate replacement dish or full refund." },
      { prefix: "5.3 Refund Timeline:", text: "Approved refunds are credited directly to your original payment method within 3 to 5 business days." }
    ]
  },
  {
    num: "06",
    title: "Limitation of Legal Liability & Total Cap",
    items: [
      { prefix: "6.1 Consequential Damages Waiver:", text: "To the maximum extent permitted by applicable law, FoodNinja, its culinary team, officers, and employees shall not be liable for any indirect, punitive, or consequential damages." }
    ],
    highlightBox: "6.2 STRICT LIABILITY CAP: FOODNINJA'S ENTIRE AGGREGATE LIABILITY ARISING FROM ANY ORDER DISPUTE SHALL BE STRICTLY LIMITED TO: (A) REPLACING THE AFFECTED DISH AT NO EXTRA CHARGE; OR (B) REFUNDING THE EXACT AMOUNT PAID FOR THAT ORDER."
  },
  {
    num: "07",
    title: "Intellectual Property & Proprietary Recipes",
    rawContent: "The FoodNinja name, brand logos, custom UI design, proprietary culinary recipe formulations, dish images, and digital code are the proprietary intellectual property of FoodNinja Technologies. Unauthorized reproduction or commercial imitation is strictly prohibited."
  },
  {
    num: "08",
    title: "Governing Law & Dispute Resolution",
    items: [
      { prefix: "8.1 Governing Law:", text: "These terms shall be governed by and interpreted in accordance with the substantive laws of the Republic of India." },
      { prefix: "8.2 Amicable Resolution & Jurisdiction:", text: "Customer complaints are resolved directly through our customer support desk. In the unlikely event of an unresolved legal claim, exclusive jurisdiction shall lie with the competent courts of New Delhi, India." }
    ]
  }
];

const TermsPage = () => {
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
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Terms & Conditions of Service</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">FoodNinja Restaurant & Kitchen • Customer Operating Agreement</p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 text-xs font-bold text-emerald-800">
            Last Updated: October 2025
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-[#f8fafc] p-5 sm:p-6 mb-8 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
          <p>Welcome to FoodNinja. We operate a direct chef-crafted restaurant and gourmet kitchen offering fresh artisan pizzas, aromatic dum biryanis, gourmet burgers, salads, and chilled beverages delivered fresh to your doorstep.</p>
          <p className="font-semibold text-slate-800">By creating an account, browsing our menu, or ordering meals, you confirm that you accept and agree to be bound by these service terms.</p>
        </div>

        <div className="space-y-6">
          {TERMS_SECTIONS.map((sec) => (
            <article key={sec.num} className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4faee] text-emerald-800 text-xs font-mono font-bold">
                  {sec.num}
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{sec.title}</h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                {sec.rawContent && <p>{sec.rawContent}</p>}
                {sec.items?.map((item, idx) => (
                  <p key={idx}><strong>{item.prefix}</strong> {item.text}</p>
                ))}
                {sec.highlightBox && (
                  <div className="rounded-xl bg-[#f0f9ff] border border-sky-200/80 p-3.5 text-xs text-sky-950 font-semibold">
                    {sec.highlightBox}
                  </div>
                )}
              </div>
            </article>
          ))}

          {/* Section 09: Statutory Grievance Redressal Card */}
          <article className="rounded-2xl border border-emerald-200/80 bg-[#f4faee] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-mono font-bold">09</span>
              <h2 className="text-base sm:text-lg font-black text-emerald-950 tracking-tight">Customer Care & Statutory Grievance Officer</h2>
            </div>
            <div className="text-xs sm:text-sm text-emerald-900 space-y-2 leading-relaxed">
              <p>In compliance with the Consumer Protection (E-Commerce) Rules, 2020:</p>
              <div className="mt-3 rounded-xl bg-white p-4 border border-emerald-200 text-xs space-y-1 text-slate-700">
                <p><strong>Desk:</strong> Customer Care & Grievance Redressal Officer</p>
                <p><strong>Restaurant Entity:</strong> {settings.restaurantName || "Food Ninja"}</p>
                <p><strong>Official Email:</strong> <a href={`mailto:${settings.storeEmail || "support@foodninja.com"}`} className="text-emerald-700 font-bold hover:underline">{settings.storeEmail || "support@foodninja.com"}</a></p>
                <p><strong>Kitchen Hub:</strong> {settings.storeAddress || "Food Ninja Central Kitchen, Delhi NCR, India"}</p>
                <p><strong>Turnaround:</strong> Acknowledgment within 24–48 hours; prompt resolution within 7 working days.</p>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Have questions about ingredients or orders? Visit our <Link to="/contact" className="text-emerald-700 font-bold hover:underline">Help Center</Link>.
          </p>
          <Link to="/menu" className="rounded-full bg-emerald-700 px-7 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs">
            Explore Menu →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
