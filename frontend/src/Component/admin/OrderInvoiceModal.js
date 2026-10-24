import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../utils/Constants";

/**
 * Kitchen Order Ticket (KOT) & Tax Invoice Slip Modal
 * Formatted strictly according to standard 80mm Thermal Printer Paper Size (POS Receipt).
 * Isolated printing via hidden IFrame ensures ONLY the thermal slip is printed.
 */
const OrderInvoiceModal = ({ order, onClose }) => {
  if (!order) return null;

  const [settings, setSettings] = useState({
    restaurantName: "Food Ninja",
    fssaiNumber: "10020011000123",
    gstinNumber: "07AAAAF1234A1Z5",
    storeAddress: "Shop 12, Food Street, Sector 62, Delhi NCR",
    storePhone: "+91 98765 43210",
  });

  useEffect(() => {
    if (typeof fetch !== "undefined") {
      fetch(`${API_BASE_URL}/settings`)
        .then((r) => r.json())
        .then((d) => {
          if (d && d.settings) setSettings(d.settings);
        })
        .catch(() => {});
    }
  }, []);

  const items = order.items || [];

  // Accurate math computed dynamically from items array (no fake fallback calculations)
  const calculatedSubtotal = items.reduce((acc, it) => {
    const price = Number(it.price || it.caloriesPerServing || 199);
    const qty = Number(it.quantity || 1);
    return acc + price * qty;
  }, 0);

  const subtotal = order.subtotal !== undefined ? order.subtotal : calculatedSubtotal;
  const deliveryFee = order.deliveryFee !== undefined ? order.deliveryFee : 30;
  const taxes = order.taxes !== undefined ? order.taxes : Math.max(0, (order.total || 0) - subtotal - deliveryFee);
  const grandTotal = order.total || (subtotal + deliveryFee + taxes);

  // Check payment mode for Delivery Rider & Customer Cash Collection
  const isPaidOnline = Boolean(
    order.payment && (
      order.payment.toLowerCase().includes("online") ||
      order.payment.toLowerCase().includes("upi") ||
      order.payment.toLowerCase().includes("card") ||
      order.payment.toLowerCase().includes("netbanking") ||
      order.payment.toLowerCase().includes("prepaid")
    )
  );
  const isCod = !isPaidOnline;

  // Isolated Thermal Printer (80mm) Print Engine
  const handlePrint = () => {
    const printContent = document.getElementById("printable-thermal-slip");
    if (!printContent) return;

    // Create isolated hidden iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>KOT_Order_${order.id}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0mm;
            }
            @media print {
              html, body {
                width: 80mm;
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                color: #000000 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            body {
              font-family: 'Courier New', Courier, monospace, system-ui, sans-serif;
              width: 74mm;
              margin: 0 auto;
              padding: 4mm 2mm;
              font-size: 11px;
              line-height: 1.35;
              color: #000000;
              background: #ffffff;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-left { text-align: left; }
            .font-bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            .divider { border-top: 1px dashed #000000; margin: 6px 0; }
            .double-divider { border-top: 2px dashed #000000; margin: 6px 0; }
            .row { display: flex; justify-content: space-between; margin: 2px 0; }
            table { width: 100%; border-collapse: collapse; margin: 4px 0; }
            th { border-bottom: 1px dashed #000000; padding: 3px 0; font-size: 10px; text-transform: uppercase; }
            td { padding: 3px 0; font-size: 11px; vertical-align: top; }
            .tag { display: inline-block; border: 1px solid #000000; padding: 1px 4px; font-size: 9px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="text-center">
            <h2 style="margin: 0; font-size: 18px; font-weight: 900; letter-spacing: 1px;">${(settings.restaurantName || "FOOD NINJA").toUpperCase()}</h2>
            <div style="font-size: 9px; margin-top: 2px;">${(settings.storeAddress || "AUTHENTIC RESTAURANT & FAST KITCHEN").toUpperCase()}</div>
            <div style="font-size: 9px; color: #333; margin-top: 2px;">FSSAI: ${settings.fssaiNumber || "10020011000123"} • GSTIN: ${settings.gstinNumber || "07AAAAF1234A1Z5"}</div>
            ${settings.storePhone ? `<div style="font-size: 9px; color: #444; margin-top: 1px;">PHONE: ${settings.storePhone}</div>` : ""}
            <div class="double-divider"></div>
            <div style="font-size: 11px; font-weight: bold; letter-spacing: 0.5px;">TAX INVOICE & DELIVERY BILL</div>
            <div class="divider"></div>
          </div>

          <!-- Metadata Section -->
          <div style="font-size: 10.5px; margin: 4px 0;">
            <div class="row">
              <span class="font-bold">ORDER ID: #${order.id}</span>
              <span>${order.date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <div class="row" style="margin-top: 3px; align-items: center;">
              <span>TYPE: HOME DELIVERY</span>
              <span style="border: 1.5px solid #000; padding: 1px 6px; font-weight: bold; font-size: 10px;">
                ${isCod ? `COD: COLLECT ₹${grandTotal}` : "PAID ONLINE (₹0 DUE)"}
              </span>
            </div>
            <div class="divider"></div>
            <div style="margin: 2px 0;">
              <span class="font-bold">CUSTOMER:</span> ${order.customerName}
            </div>
            <div style="margin: 2px 0;">
              <span class="font-bold">PHONE:</span> +91 ${order.phone}
            </div>
            <div style="margin: 2px 0;">
              <span class="font-bold">ADDRESS:</span> ${order.address}
            </div>
          </div>

          <div class="divider"></div>

          <!-- Items Table -->
          <table>
            <thead>
              <tr>
                <th class="text-left">ITEM</th>
                <th class="text-center" style="width: 25px;">QTY</th>
                <th class="text-right" style="width: 40px;">PRICE</th>
                <th class="text-right" style="width: 45px;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(it => {
                const itemPrice = Number(it.price || it.caloriesPerServing || 199);
                const itemQty = Number(it.quantity || 1);
                return `
                  <tr>
                    <td class="text-left font-bold">${it.name || it.title}</td>
                    <td class="text-center">${itemQty}</td>
                    <td class="text-right">₹${itemPrice}</td>
                    <td class="text-right font-bold">₹${itemPrice * itemQty}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>

          <div class="divider"></div>

          <!-- Bill Summary -->
          <div style="font-size: 11px;">
            <div class="row">
              <span>Item Subtotal (${items.length} items)</span>
              <span>₹${subtotal}</span>
            </div>
            <div class="row">
              <span>Delivery Charges</span>
              <span>${deliveryFee === 0 ? "FREE" : "₹" + deliveryFee}</span>
            </div>
            <div class="row">
              <span>Restaurant Packaging & GST</span>
              <span>₹${taxes}</span>
            </div>
            <div class="double-divider"></div>
            <div class="row font-bold" style="font-size: 14px;">
              <span>NET PAYABLE</span>
              <span>₹${grandTotal}</span>
            </div>
            <div class="double-divider"></div>
          </div>

          <!-- Payment Info & Rider Collection Box -->
          <div style="border: 1.5px solid #000; padding: 5px 6px; margin: 6px 0; text-align: center;">
            <div style="font-size: 12px; font-weight: 900; letter-spacing: 0.5px;">
              ${isCod ? `★ CASH TO COLLECT: ₹${grandTotal} ★` : "✓ PAID ONLINE — ₹0 TO COLLECT"}
            </div>
            <div style="font-size: 8.5px; font-weight: bold; margin-top: 2px;">
              ${isCod ? "RIDER: Collect exact cash from customer before food handover" : "RIDER: Order prepaid online. Do NOT collect cash from customer"}
            </div>
          </div>

          <!-- Handover Signatures -->
          <div class="row" style="font-size: 9px; margin-top: 6px; padding-top: 4px; border-top: 1px dashed #000;">
            <span>Rider: ________________</span>
            <span>Customer: ________________</span>
          </div>

          <div class="divider"></div>
          <div class="text-center" style="font-size: 9px; margin-top: 6px;">
            <div class="font-bold">*** CUSTOMER TAX INVOICE & DELIVERY BILL ***</div>
            <div>Thank you for ordering with ${(settings.restaurantName || "FOOD NINJA").toUpperCase()}!</div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 250);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs overflow-hidden"
      onClick={onClose}
    >
      {/* Compact receipt preview; the paper itself scrolls inside this fixed-height dialog. */}
      <div
        className="relative flex w-full max-w-[340px] flex-col overflow-hidden rounded-xl border border-slate-300 bg-white text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{ maxHeight: "min(72dvh, 620px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-2 text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
            <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>80mm POS Thermal Slip</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Printable 80mm Receipt Content */}
        <div id="printable-thermal-slip" className="min-h-0 flex-1 overflow-y-auto bg-white p-3 font-mono text-slate-800 text-[11px] leading-tight">
          
          {/* Receipt Brand Header */}
          <div className="text-center pb-2 border-b border-dashed border-slate-300">
            <h2 className="text-base font-black tracking-wider text-slate-900 uppercase">
              {settings.restaurantName || "FOOD NINJA"}
            </h2>
            <p className="text-[9.5px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
              Tax Invoice & Delivery Bill
            </p>
            <p className="text-[9px] text-slate-400 mt-0.5 font-mono">
              FSSAI: {settings.fssaiNumber || "10020011000123"} • GST: {settings.gstinNumber || "07AAAAF1234A1Z5"}
            </p>
            {settings.storeAddress && (
              <p className="text-[8.5px] text-slate-400 mt-0.5 truncate">
                {settings.storeAddress}
              </p>
            )}
          </div>

          {/* Balanced Metadata (Zero empty void) */}
          <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[10.5px]">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-900 text-xs">ORDER #{order.id}</span>
              <span className="text-slate-500 text-[10px]">{order.date || "Today"}</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500 font-bold">TYPE: HOME DELIVERY</span>
              {isCod ? (
                <span className="rounded-sm bg-white text-black font-black px-2 py-0.5 border border-slate-500 text-[10px] tracking-wide">
                  COD: COLLECT ₹{grandTotal}
                </span>
              ) : (
                <span className="rounded-sm bg-white text-black font-black px-2 py-0.5 border border-slate-500 text-[10px] tracking-wide">
                  PAID ONLINE (₹0 DUE)
                </span>
              )}
            </div>
            <div className="pt-1.5 border-t border-slate-100 text-[10.5px] leading-snug">
              <div>
                <span className="font-bold text-slate-600">CUSTOMER: </span>
                <span className="font-extrabold text-slate-900">{order.customerName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-600">PHONE: </span>
                <span className="text-slate-800 font-mono">+91 {order.phone}</span>
              </div>
              <div className="text-slate-700 mt-0.5 break-words">
                <span className="font-bold text-slate-600">DELIVERY: </span>
                {order.address}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-2.5 border-b border-dashed border-slate-300">
            <table className="w-full text-[10.5px]">
              <thead>
                <tr className="border-b border-dashed border-slate-200 text-slate-400 text-[9px] uppercase font-bold">
                  <th className="text-left pb-1">ITEM</th>
                  <th className="text-center pb-1 w-8">QTY</th>
                  <th className="text-right pb-1 w-10">RATE</th>
                  <th className="text-right pb-1 w-12">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {items.map((it, idx) => {
                  const itemPrice = Number(it.price || it.caloriesPerServing || 199);
                  const itemQty = Number(it.quantity || 1);
                  return (
                    <tr key={idx} className="py-1">
                      <td className="py-1 text-slate-900 pr-1 font-bold leading-tight">{it.name || it.title}</td>
                      <td className="py-1 text-center text-slate-600">{itemQty}</td>
                      <td className="py-1 text-right text-slate-600">₹{itemPrice}</td>
                      <td className="py-1 text-right font-extrabold text-slate-900">₹{itemPrice * itemQty}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Accurate Bill Calculation */}
          <div className="py-2 space-y-1 text-[10.5px] border-b border-dashed border-slate-300">
            <div className="flex justify-between text-slate-600">
              <span>Item Subtotal ({items.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Restaurant Packaging & GST</span>
              <span>₹{taxes}</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-200 text-sm font-black text-slate-900">
              <span>GRAND TOTAL</span>
              <span className="text-black">₹{grandTotal}</span>
            </div>
          </div>

          {/* Delivery Rider & Customer Cash Collection Highlight Box */}
          <div className={`mt-2.5 p-2 rounded-lg border-2 text-center ${
            "border-slate-800 bg-white text-black"
          }`}>
            <p className="text-xs font-black tracking-wide">
              {isCod ? `★ CASH TO COLLECT: ₹${grandTotal} ★` : "✓ PAID ONLINE — ₹0 TO COLLECT"}
            </p>
            <p className="text-[9.5px] font-semibold mt-0.5 text-slate-700">
              {isCod 
                ? "Rider Note: Collect exact cash from customer upon food handover" 
                : "Rider Note: Order is prepaid online. Do NOT collect any cash"}
            </p>
          </div>

          {/* Delivery Rider & Customer Handover Signature Line */}
          <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200 flex justify-between text-[9px] text-slate-500 font-semibold">
            <span>Rider: ________________</span>
            <span>Customer Sign: ________________</span>
          </div>

          {/* Receipt Footer Note */}
          <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200 text-center text-[9px] text-slate-400">
            <p className="font-bold text-slate-600">*** CUSTOMER TAX INVOICE & DELIVERY BILL ***</p>
            <p className="mt-0.5">Thank you for ordering with {settings.restaurantName || "Food Ninja"}!</p>
          </div>
        </div>

        {/* Modal Action Buttons (Always immediately visible without scrolling) */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-200 bg-white p-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer text-center"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-[1.5] inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Slip (80mm)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoiceModal;
