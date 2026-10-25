import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../utils/cartSlice";
import { addOrder } from "../utils/ordersSlice";
import UserContext from "./Usercontext";
import { API_BASE_URL } from "../utils/Constants";
import { getClosedStoreNotice } from "../utils/storeNotices";
import { calculateOrderPricing } from "../utils/orderPricing";

const FIELD_LABEL_CLASS = "text-[10px] font-bold uppercase text-slate-600";
const FIELD_INPUT_CLASS = "mt-0.5 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500";
const EDIT_ACTION_CLASS = "text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition cursor-pointer";
const CHECKOUT_CARD_CLASS = "rounded-xl border border-slate-200/80 bg-white p-3";

const AddressField = ({ label, value, onChange, type = "text", maxLength, inputMode, mono = false, required = true }) => (
    <label className="block">
        <span className={FIELD_LABEL_CLASS}>{label}</span>
        <input
            type={type}
            required={required}
            maxLength={maxLength}
            inputMode={inputMode}
            value={value}
            onChange={onChange}
            className={`${FIELD_INPUT_CLASS}${mono ? " font-mono" : ""}`}
        />
    </label>
);

const PaymentMarks = () => (
    <div className="flex items-center gap-1 shrink-0" aria-label="UPI, Visa, Mastercard and RuPay">
        <span className="font-bold text-[9px] text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono">UPI</span>
        <span className="font-extrabold text-[9px] text-blue-700 bg-white border border-slate-200 rounded px-1.5 py-0.5 italic">VISA</span>
        <span className="flex items-center rounded border border-slate-200 bg-white px-1 py-0.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="-ml-0.5 h-2 w-2 rounded-full bg-amber-500 opacity-90" />
        </span>
        <span className="font-bold text-[9px] text-emerald-800 bg-white border border-slate-200 rounded px-1.5 py-0.5">RuPay</span>
    </div>
);

const PaymentOption = ({ method, selected, description, badge, onSelect }) => (
    <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`w-full p-2.5 rounded-xl border flex items-center justify-between gap-2 text-left transition cursor-pointer ${selected ? "border-emerald-500 bg-emerald-50/40" : "border-slate-200 bg-white hover:bg-slate-50"}`}
    >
        <span className="flex items-center gap-2 min-w-0">
            <span className={`flex h-4 w-4 items-center justify-center rounded-full border shrink-0 ${selected ? "border-emerald-600" : "border-slate-300"}`}>
                {selected && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
            </span>
            <span className="min-w-0">
                <span className="block font-bold text-xs text-slate-900">{method}</span>
                <span className="block text-[10px] text-slate-400">{description}</span>
            </span>
        </span>
        {badge ? <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded px-2 py-0.5">{badge}</span> : <PaymentMarks />}
    </button>
);

const CheckoutDeliveryPayment = ({ settings, error, addressState, paymentState }) => {
    const {
        name, setName, phone, setPhone, house, setHouse, street, setStreet,
        landmark, setLandmark, city, setCity, pincode, setPincode,
        isEditingAddress, setIsEditingAddress, savedAddresses,
    } = addressState;
    const { payment, setPayment, isChangingPayment, setIsChangingPayment } = paymentState;
    const isClosed = settings.restaurantOpen === false || settings.isEffectiveOpen === false;

    return (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs lg:order-2">
            <header className="mb-3.5 flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </span>
                <span>
                    <h1 className="text-sm sm:text-base font-bold leading-tight tracking-tight text-slate-900">Delivery &amp; Payment</h1>
                    <span className="text-[11px] text-slate-400">Where &amp; how to deliver</span>
                </span>
            </header>

            {isClosed && (
                <div className="mb-3 flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-950">
                    <span className="mt-1 h-2 w-2 shrink-0 animate-pulse rounded-full bg-rose-600" />
                    <span>
                        <strong className="block text-rose-900">Restaurant Currently Closed for Orders</strong>
                        <span className="text-[11px] text-rose-800">{getClosedStoreNotice(settings)}</span>
                    </span>
                </div>
            )}

            <section className={`${CHECKOUT_CARD_CLASS} mb-3`}>
                <div className="flex items-center justify-between pb-2">
                    <h2 className="text-xs font-bold text-slate-800">Delivery Address</h2>
                    <button type="button" onClick={() => setIsEditingAddress(!isEditingAddress)} className={EDIT_ACTION_CLASS}>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>{isEditingAddress ? "Close" : "Change address"}</span>
                    </button>
                </div>

                {!isEditingAddress ? (
                    <div className="flex items-start justify-between gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5">
                        <div className="flex min-w-0 items-start gap-2.5">
                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
                                </svg>
                            </span>
                            <span className="min-w-0">
                                <span className="flex items-center gap-2">
                                    <strong className="truncate text-xs text-slate-900">{name}</strong>
                                    <span className="shrink-0 text-[11px] font-medium text-slate-500">+91 {phone}</span>
                                </span>
                                <span className="mt-0.5 block break-words text-[11px] leading-snug text-slate-600">
                                    {house}, {street}{landmark ? `, Near ${landmark}` : ""}{city ? `, ${city}` : ""}
                                </span>
                                <span className="mt-0.5 block font-mono text-[10px] text-slate-400">PIN: {pincode}</span>
                            </span>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Saved
                        </span>
                    </div>
                ) : (
                    <div className="mt-2.5 space-y-2.5 border-t border-slate-100 pt-2.5">
                        {savedAddresses.length > 0 && (
                            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2">
                                <p className="mb-1 text-[10px] font-bold text-slate-600">Pick Saved Address:</p>
                                <div className="space-y-1">
                                    {savedAddresses.map((addr, idx) => (
                                        <button key={`${addr.pincode}-${idx}`} type="button" onClick={() => {
                                            setName(addr.name || name);
                                            setPhone(addr.phone || phone);
                                            setHouse(addr.house || "");
                                            setStreet(addr.street || "");
                                            setLandmark(addr.landmark || "");
                                            setCity(addr.city || "Noida");
                                            setPincode(addr.pincode || "");
                                            setIsEditingAddress(false);
                                        }} className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-left text-xs transition hover:border-emerald-500 hover:bg-emerald-50/40">
                                            <span className="text-[11px] font-bold text-slate-800">{addr.label || `${addr.house}, ${addr.street}`}</span>
                                            <span className="block text-[10px] text-slate-400">{addr.city} • {addr.pincode}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid gap-2 sm:grid-cols-2">
                            <AddressField label="Full Name *" value={name} onChange={(event) => setName(event.target.value)} />
                            <AddressField label="Phone *" type="tel" maxLength={10} inputMode="numeric" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} />
                        </div>
                        <AddressField label="Flat / House / Building *" value={house} onChange={(event) => setHouse(event.target.value)} />
                        <AddressField label="Street / Area *" value={street} onChange={(event) => setStreet(event.target.value)} />
                        <AddressField label="Landmark (optional)" required={false} value={landmark} onChange={(event) => setLandmark(event.target.value)} />
                        <div className="grid gap-2 sm:grid-cols-2">
                            <AddressField label="City *" value={city} onChange={(event) => setCity(event.target.value)} />
                            <AddressField label="PIN Code *" maxLength={6} inputMode="numeric" mono value={pincode} onChange={(event) => setPincode(event.target.value.replace(/\D/g, ""))} />
                        </div>
                        <button type="button" onClick={() => setIsEditingAddress(false)} className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700">
                            Save Address
                        </button>
                    </div>
                )}
            </section>

            <section className={CHECKOUT_CARD_CLASS}>
                <div className="flex items-center justify-between pb-2">
                    <h2 className="text-xs font-bold text-slate-800">Payment Method</h2>
                    <button type="button" onClick={() => setIsChangingPayment(!isChangingPayment)} className={EDIT_ACTION_CLASS}>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>{isChangingPayment ? "Close" : "Change"}</span>
                    </button>
                </div>

                {!isChangingPayment ? (
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5">
                        <span className="flex min-w-0 items-center gap-2.5">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /></span>
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                            </span>
                            <span className="min-w-0">
                                <strong className="block truncate text-xs text-slate-900">{payment}</strong>
                                <span className="block truncate text-[10px] text-slate-400">{payment === "Online Payment" ? "UPI, Card, Net Banking" : "Pay cash / UPI on arrival"}</span>
                            </span>
                        </span>
                        {payment === "Online Payment" && <PaymentMarks />}
                    </div>
                ) : (
                    <div className="mt-2.5 space-y-2 border-t border-slate-100 pt-2.5">
                        <PaymentOption method="Online Payment" description="UPI, Credit/Debit Card, Net Banking" selected={payment === "Online Payment"} onSelect={() => { setPayment("Online Payment"); setIsChangingPayment(false); }} />
                        <PaymentOption method="Cash on Delivery" description="Pay cash or scan UPI QR upon arrival" badge="COD" selected={payment === "Cash on Delivery"} onSelect={() => { setPayment("Cash on Delivery"); setIsChangingPayment(false); }} />
                    </div>
                )}
            </section>

            {error && (
                <div role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                    <span className="text-sm font-bold">⚠</span><span>{error}</span>
                </div>
            )}
        </section>
    );
};

const CheckoutOrderSummary = ({ items, pricing, settings, submitting }) => {
    const { itemCount, subtotal, deliveryFee, packagingFee, taxes, discountAmount, grandTotal } = pricing;
    const isClosed = settings.restaurantOpen === false || settings.isEffectiveOpen === false;
    const isBelowMinimum = subtotal < (settings.minOrderValue || 0);
    const rows = [
        ["Subtotal", `₹${subtotal}`],
        ["Delivery Fee", deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`],
        ["Packaging / Handling", `₹${packagingFee}`],
        [`GST (${pricing.taxRate}%)`, `₹${taxes}`],
        ["Discount", `−₹${discountAmount}`, "text-emerald-700"],
    ];

    return (
        <aside className="sticky top-20 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs lg:order-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </span>
                    <span>
                        <h2 className="text-base font-bold text-slate-900">Order Summary</h2>
                        <span className="text-xs text-slate-400">{itemCount} items in cart</span>
                    </span>
                </div>
                <span className="rounded-xl bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">₹{grandTotal}</span>
            </div>

            <ul className="my-4 max-h-[300px] space-y-3.5 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                    const imageFallback = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80";
                    return (
                        <li key={idx} className="flex items-center justify-between gap-3 text-xs">
                            <span className="flex min-w-0 flex-1 items-center gap-3">
                                <img src={item.image || imageFallback} alt={item.name || item.title} className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-cover" onError={(event) => { event.currentTarget.src = imageFallback; }} />
                                <span className="min-w-0 flex-1">
                                    <strong className="block truncate leading-snug text-slate-900">{item.name || item.title}</strong>
                                    {item.portionSize && <span className="mt-0.5 block text-[11px] text-emerald-700">{item.portionSize} Plate</span>}
                                    <span className="mt-0.5 block text-[11px] text-slate-400">Qty: {item.quantity || 1}</span>
                                </span>
                            </span>
                            <strong className="shrink-0 text-xs text-slate-900">₹{(item.price ?? item.caloriesPerServing ?? 0) * (item.quantity || 1)}</strong>
                        </li>
                    );
                })}
            </ul>

            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                {rows.map(([label, value, colorClass = "text-slate-600"]) => (
                    <div key={label} className={`flex justify-between font-medium ${colorClass}`}>
                        <span>{label}</span><strong className={colorClass === "text-emerald-700" ? "font-bold" : "font-bold text-slate-900"}>{value}</strong>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-3 text-slate-900">
                <strong className="text-base font-black">Grand Total</strong>
                <strong className="text-xl font-black">₹{grandTotal}</strong>
            </div>

            <button type="submit" disabled={submitting || isClosed || isBelowMinimum} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0c5936] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#084227] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? "Placing Order..." : isClosed ? "Restaurant Closed — Orders Paused" : isBelowMinimum ? `Min. Order ₹${settings.minOrderValue} Required` : (
                    <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        <span>Place Order | ₹{grandTotal}</span>
                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </>
                )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-600">
                <svg className="h-3.5 w-3.5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span>100% secure payments</span><span className="text-slate-300">|</span><span>Quick &amp; safe delivery</span>
            </div>
        </aside>
    );
};

// Validation helper to detect fake keyboard spam / gibberish
const isGibberish = (str) => {
    if (!str) return false;
    const clean = str.trim().toLowerCase();
    // 4+ repeated consecutive identical characters (e.g. "aaaaaa", "111111")
    if (/(.)\1{3,}/.test(clean)) return true;
    // 6+ consecutive consonants without vowel or space (e.g. "ndjuhjdhjsdjas", "asdfghjkl")
    if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(clean)) return true;
    // Common fake patterns
    if (/^(na|n\/a|none|null|nil|test|fake|asdf|qwerty|zxcv)$/i.test(clean)) return true;
    return false;
};

const CheckoutPage = () => {
    const cartItems = useSelector((store) => store.cart.item);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);

    // "Buy now" passes a single product via router state, otherwise use the cart
    const buyNowItem = location.state && location.state.buyNowItem;
    const isBuyNow = Boolean(buyNowItem);

    const items = isBuyNow
        ? [{ ...buyNowItem, quantity: 1 }]
        : cartItems;

    // Structured address fields to ensure 100% valid delivery information
    // Auto-fill from last saved address
    const lastAddr = (() => { try { const arr = JSON.parse(localStorage.getItem("fn_saved_addresses") || "[]"); return Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null; } catch { return null; } })();
    const [name, setName] = useState(user?.name || lastAddr?.name || "Store Administrator");
    const [phone, setPhone] = useState(lastAddr?.phone || "9876543210");
    const [house, setHouse] = useState(lastAddr?.house || "Flat 402, Sunshine Heights, Tower 3");
    const [street, setStreet] = useState(lastAddr?.street || "Sector 62, Noida");
    const [landmark, setLandmark] = useState(lastAddr?.landmark || "");
    const [city, setCity] = useState(lastAddr?.city || "Noida");
    const [pincode, setPincode] = useState(lastAddr?.pincode || "201301");
    const [payment, setPayment] = useState("Online Payment");
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isChangingPayment, setIsChangingPayment] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Load saved address from localStorage on mount
    const [savedAddresses] = useState(() => {
        try {
            const arr = JSON.parse(localStorage.getItem("fn_saved_addresses") || "[]");
            return Array.isArray(arr) ? arr : [];
        } catch { return []; }
    });
    const [settings, setSettings] = useState({
        deliveryFee: 30,
        freeDeliveryThreshold: 499,
        packagingFee: 15,
        taxRate: 5,
        restaurantOpen: true,
        minOrderValue: 99,
        operatingHoursText: "6:00 AM – 8:00 PM",
        restaurantName: "Food Ninja",
        fssaiNumber: "10020011000123",
        gstinNumber: "07AAAAF1234A1Z5",
    });

    useEffect(() => {
        const refreshSettings = () => {
            if (typeof fetch === "undefined") return;
            fetch(`${API_BASE_URL}/settings`)
                .then((r) => r.json())
                .then((d) => {
                    if (d && d.settings) setSettings(d.settings);
                })
                .catch(() => {});
        };
        refreshSettings();
        const interval = setInterval(refreshSettings, 60_000);
        return () => clearInterval(interval);
    }, []);

    const pricing = calculateOrderPricing({ items, settings });
    const { itemCount: totalItems, subtotal, deliveryFee, packagingFee, taxes, discountAmount, grandTotal } = pricing;
    const addressState = {
        name, setName, phone, setPhone, house, setHouse, street, setStreet,
        landmark, setLandmark, city, setCity, pincode, setPincode,
        isEditingAddress, setIsEditingAddress, savedAddresses,
    };
    const paymentState = { payment, setPayment, isChangingPayment, setIsChangingPayment };

    const placeOrder = async (e) => {
        e.preventDefault();
        setError("");

        if (settings.restaurantOpen === false || settings.isEffectiveOpen === false) {
            setError(getClosedStoreNotice(settings));
            return;
        }

        if (subtotal < (settings.minOrderValue || 0)) {
            setError(`Minimum order value is ₹${settings.minOrderValue}. Please add more dishes to proceed.`);
            return;
        }

        // 1. Validate Name
        if (!name.trim() || name.trim().length < 3 || isGibberish(name)) {
            setError("Please enter a valid full name (minimum 3 letters).");
            return;
        }

        // 2. Validate Indian Mobile Number (10 digits starting with 6, 7, 8, or 9)
        const cleanPhone = phone.replace(/\D/g, "");
        if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
            setError("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
            return;
        }

        // 3. Validate House / Flat details
        if (!house.trim() || house.trim().length < 2 || isGibberish(house)) {
            setError("Please enter a valid Flat / House / Building details (e.g. Flat 302, Tower B).");
            return;
        }

        // 4. Validate Street / Locality
        if (!street.trim() || street.trim().length < 4 || isGibberish(street)) {
            setError("Please enter a valid Street / Area / Locality (e.g. Sector 62, MG Road).");
            return;
        }

        // 5. Validate City
        if (!city.trim() || city.trim().length < 3 || isGibberish(city)) {
            setError("Please enter a valid City / Town name (e.g. Delhi NCR, Noida).");
            return;
        }

        // 6. Validate 6-digit PIN code
        const cleanPincode = pincode.trim();
        if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) {
            setError("Please enter a valid 6-digit Indian PIN code (e.g. 110001, 201301).");
            return;
        }

        if (items.length === 0) {
            setError("No items in cart to order.");
            return;
        }

        const fullAddress = `${house.trim()}, ${street.trim()}${landmark.trim() ? `, Near ${landmark.trim()}` : ""}, ${city.trim()} - ${cleanPincode}`;
        const estDelivery = totalItems > 4 ? "40–50 mins" : "25–30 mins";

        const baseOrder = {
            id: Date.now(),
            userEmail: user ? user.email : "foodninja@gmail.com",
            customerName: name.trim(),
            address: fullAddress,
            phone: cleanPhone,
            payment: payment,
            items: items,
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            packagingFee: packagingFee,
            taxes: taxes,
            discount: discountAmount,
            total: grandTotal,
            estDelivery: estDelivery,
            status: "Placed",
            paymentStatus: payment === "Cash on Delivery" ? "Pending" : "Paid",
            paymentMethod: payment === "Cash on Delivery" ? "Cash on Delivery" : "",
            date: new Date().toLocaleString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            })
        };

        const saveAddress = () => {
            try {
                const addrs = JSON.parse(localStorage.getItem("fn_saved_addresses") || "[]");
                const newAddr = { name: name.trim(), phone: cleanPhone, house: house.trim(), street: street.trim(), landmark: landmark.trim(), city: city.trim(), pincode: cleanPincode, label: `${house.trim()}, ${street.trim()}, ${city.trim()}` };
                const exists = addrs.some((addr) => addr.house === newAddr.house && addr.street === newAddr.street && addr.pincode === newAddr.pincode);
                if (!exists) {
                    addrs.push(newAddr);
                    localStorage.setItem("fn_saved_addresses", JSON.stringify(addrs.slice(-5)));
                }
            } catch {}
        };

        const completeOrder = (order) => {
            dispatch(addOrder(order));
            if (!isBuyNow) dispatch(clearCart());
            saveAddress();
            navigate(`/order-confirmation/${order.id}`, {
                replace: true,
                state: { order, supportPhone: settings.supportPhone },
            });
        };

        const finalizeOrder = async (orderToSave) => {
            try {
                // Save to Backend MongoDB Atlas
                const response = await fetch(`${API_BASE_URL}/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderToSave),
                });
                if (!response.ok) {
                    const result = await response.json().catch(() => ({}));
                    const error = new Error(result.message || "Unable to place your order.");
                    error.status = response.status;
                    throw error;
                }
                const savedResult = await response.json().catch(() => ({}));
                const savedOrder = savedResult.order || orderToSave;
                completeOrder(savedOrder);
            } catch (err) {
                console.error("Order error:", err);
                if (err.status === 403) {
                    setError(err.message || settings.effectiveClosedReason || "The restaurant is currently closed for orders.");
                    return;
                }
                completeOrder(orderToSave);
            } finally {
                setSubmitting(false);
            }
        };

        // 1. Cash on Delivery Flow
        if (payment === "Cash on Delivery") {
            setSubmitting(true);
            await finalizeOrder(baseOrder);
            return;
        }

        // 2. Online Payment via Razorpay
        try {
            setSubmitting(true);
            const orderRes = await fetch(`${API_BASE_URL}/payment/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: grandTotal, userEmail: baseOrder.userEmail }),
            });
            const data = await orderRes.json();

            if (!data.success) {
                setError(data.message || "Failed to initialize payment gateway.");
                setSubmitting(false);
                return;
            }

            // If real keys are configured and Razorpay SDK is loaded
            if (!data.isDemo && typeof window.Razorpay !== "undefined") {
                const options = {
                    key: data.key,
                    amount: data.order.amount,
                    currency: data.order.currency || "INR",
                    name: settings.restaurantName || "Food Ninja",
                    description: `Order Payment #${baseOrder.id}`,
                    order_id: data.order.id,
                    prefill: {
                        name: name.trim(),
                        contact: cleanPhone,
                        email: user?.email || "customer@foodninja.com",
                    },
                    theme: {
                        color: "#0c5936",
                    },
                    handler: async function (response) {
                        try {
                            const verifyRes = await fetch(`${API_BASE_URL}/payment/verify`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(response),
                            });
                            const verifyData = await verifyRes.json();
                            if (verifyData.success) {
                                await finalizeOrder({
                                    ...baseOrder,
                                    paymentStatus: "Paid",
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature,
                                    paymentMethod: verifyData.method || "",
                                });
                            } else {
                                setError("Payment signature verification failed.");
                                setSubmitting(false);
                            }
                        } catch {
                            await finalizeOrder({
                                ...baseOrder,
                                paymentStatus: "Paid",
                                razorpayPaymentId: response.razorpay_payment_id,
                                paymentMethod: "",
                            });
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setSubmitting(false);
                        },
                    },
                };
                const rzp = new window.Razorpay(options);
                rzp.on("payment.failed", function (resp) {
                    setError(`Payment failed: ${resp.error?.description || "Transaction declined"}`);
                    setSubmitting(false);
                });
                rzp.open();
            } else {
                // Demo / Test mode (when live/test keys are not yet configured in backend/.env)
                // Seamlessly simulate verification so the user can test the full flow
                const verifyRes = await fetch(`${API_BASE_URL}/payment/verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isDemo: true, razorpay_payment_id: `pay_demo_${Date.now()}` }),
                });
                const verifyData = await verifyRes.json();
                await finalizeOrder({
                    ...baseOrder,
                    paymentStatus: "Paid",
                    razorpayOrderId: data.order?.id || `order_demo_${Date.now()}`,
                    razorpayPaymentId: verifyData.paymentId || `pay_demo_${Date.now()}`,
                    paymentMethod: verifyData.method || "Demo/Test",
                });
            }
        } catch (err) {
            console.error("Razorpay error:", err);
            setError("Unable to connect to payment gateway. Please try again or use Cash on Delivery.");
            setSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center px-4 bg-slate-50">
                <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Your Cart is Empty
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Add some delicious food dishes before checkout.
                    </p>
                    <Link
                        to="/"
                        className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700"
                    >
                        Explore Food Menu
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#f8fafc] px-4 py-8 sm:py-10 min-h-[85vh]">
            <div className="mx-auto max-w-6xl">
                <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">

                    <CheckoutDeliveryPayment
                        settings={settings}
                        error={error}
                        addressState={addressState}
                        paymentState={paymentState}
                    />
                    <CheckoutOrderSummary items={items} pricing={pricing} settings={settings} submitting={submitting} />
                </form>
            </div>
        </section>
    );
};

export default CheckoutPage;
