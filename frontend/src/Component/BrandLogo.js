import React from "react";
import { Link } from "react-router-dom";
import { LOGO } from "../utils/Constants";

/**
 * Unified authentic FoodNinja Brand Logo
 * Matches the bowl & leaves design from the official FoodNinja Mockup.
 *
 * @param {string|null} to - Target route for navigation, default is "/"
 * @param {"light"|"dark"} variant - Color theme (light for standard, dark for dark footer)
 * @param {"sm"|"md"|"lg"} size - Icon & text sizing scale
 * @param {boolean} badge - Wraps the logo icon in a rounded white badge container
 * @param {boolean} hideText - Hide the "FoodNinja" text and subtitle, show only icon
 * @param {boolean} hideSubtitle - Hide the "Restaurant Food Delivery" tagline
 * @param {boolean} adminBadge - Shows an [ADMIN] pill tag next to the logo text
 * @param {string} className - Additional CSS classes
 */
const BrandLogo = ({
  to = "/",
  variant = "light",
  size = "md",
  badge = false,
  hideText = false,
  hideSubtitle = false,
  adminBadge = false,
  className = "",
}) => {
  const isDark = variant === "dark";

  // Sizing definitions
  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-14 w-14",
  };

  const badgeSizes = {
    sm: "h-8 w-8 p-1",
    md: "h-10 w-10 p-1.5",
    lg: "h-16 w-16 p-2",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  const subtitleSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
  };

  const logoGraphic = badge ? (
    <div
      className={`flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-200/60 shrink-0 ${
        badgeSizes[size] || badgeSizes.md
      }`}
    >
      <img
        src={LOGO}
        alt="FoodNinja Logo"
        className="h-full w-full object-contain pointer-events-none"
        draggable={false}
      />
    </div>
  ) : (
    <div
      className={`flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
        iconSizes[size] || iconSizes.md
      }`}
    >
      <img
        src={LOGO}
        alt="FoodNinja Logo"
        className="h-full w-full object-contain pointer-events-none"
        draggable={false}
      />
    </div>
  );

  const innerContent = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {logoGraphic}

      {!hideText && (
        <div className="leading-tight text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight ${textSizes[size] || textSizes.md} ${
                isDark ? "text-white" : "text-[#0F172A]"
              }`}
            >
              Food<span className={isDark ? "text-emerald-400" : "text-emerald-600"}>Ninja</span>
            </span>
            {adminBadge && (
              <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white tracking-wider">
                Admin
              </span>
            )}
          </div>
          {!hideSubtitle && (
            <span
              className={`block font-medium tracking-wider ${subtitleSizes[size] || subtitleSizes.md} ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Restaurant Food Delivery
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="group inline-flex items-center transition hover:opacity-95">
        {innerContent}
      </Link>
    );
  }

  return innerContent;
};

export default BrandLogo;
