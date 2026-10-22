import React from "react";
import { Link } from "react-router-dom";
import { LOGO } from "../utils/Constants";

/**
 * 5 Distinct Creative Logo Icon Components
 */

// Option 1: Modern Sprout Bowl (Mockup Evolution)
export const SproutBowlIcon = ({ className = "h-full w-full" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="19" cy="27" rx="7" ry="4" transform="rotate(-22 19 27)" fill="#15803D" />
    <path d="M 19 27 Q 22 26 25 28" stroke="#4ADE80" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M 30 7 C 37 7 40 15 36 26 C 33 29 28 29 26 24 C 23 16 25 7 30 7 Z" fill="#22C55E" />
    <path d="M 30 10 Q 32 18 30 25" stroke="#BBF7D0" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 41 14 C 49 18 49 26 44 30 C 40 32 36 30 36 26 C 37 20 39 16 41 14 Z" fill="#16A34A" />
    <path d="M 40 17 Q 42 23 40 28" stroke="#86EFAC" strokeWidth="0.9" strokeLinecap="round" />
    <path d="M 24 28 Q 28 24 32 29" stroke="#F97316" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="34" cy="27" r="2" fill="#F59E0B" />
    <path d="M 8 31 C 8 48 20 56 32 56 C 44 56 56 48 56 31 C 56 29 54 28.5 32 28.5 C 10 28.5 8 29 8 31 Z" fill="#0F172A" />
    <ellipse cx="32" cy="30" rx="23" ry="2" fill="#1E293B" />
  </svg>
);

// Option 2: Stealth Ninja & Ramen Bowl
export const NinjaBowlIcon = ({ className = "h-full w-full" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 26 21 C 24 14 28 9 26 4 C 29 8 27 14 30 19 Z" fill="#10B981" opacity="0.85" />
    <path d="M 36 20 C 39 13 36 8 39 3 C 37 7 41 13 38 19 Z" fill="#059669" opacity="0.85" />
    <path d="M 32 10 C 34 14 34 18 32 22 C 30 18 30 14 32 10 Z" fill="#34D399" />
    <path d="M 8 34 Q 2 31 0 26 Q 5 29 10 31 Z" fill="#10B981" />
    <path d="M 8 35 Q 2 37 0 42 Q 5 38 10 36 Z" fill="#059669" />
    <path d="M 10 34 C 10 52 20 59 32 59 C 44 59 54 52 54 34 C 54 31 10 31 10 34 Z" fill="#0F172A" />
    <path d="M 10 33 L 54 33 L 54 36.5 L 10 36.5 Z" fill="#10B981" />
    <path d="M 21 42 Q 25 40 29 42" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
    <path d="M 35 42 Q 39 40 43 42" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Option 3: Shuriken Citrus Star
export const ShurikenCitrusIcon = ({ className = "h-full w-full" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 32 4 C 37 14 37 24 32 31 C 27 24 27 14 32 4 Z" fill="#10B981" />
    <path d="M 32 8 Q 33 18 32 28" stroke="#A7F3D0" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 32 60 C 27 50 27 40 32 33 C 37 40 37 50 32 60 Z" fill="#059669" />
    <path d="M 32 56 Q 31 46 32 36" stroke="#6EE7B7" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 60 32 C 50 37 40 37 33 32 C 40 27 50 27 60 32 Z" fill="#84CC16" />
    <path d="M 56 32 Q 46 33 36 32" stroke="#D9F99D" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 4 32 C 14 27 24 27 31 32 C 24 37 14 37 4 32 Z" fill="#65A30D" />
    <path d="M 8 32 Q 18 31 28 32" stroke="#BEF264" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="32" cy="32" r="8.5" fill="#0F172A" />
    <circle cx="32" cy="32" r="5" fill="#F59E0B" />
    <circle cx="32" cy="32" r="2" fill="#FFFBEB" />
  </svg>
);

// Option 4: Chef Blade & Basil Flourish
export const ChefBladeIcon = ({ className = "h-full w-full" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 10 32 A 22 22 0 1 0 46 14" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
    <path d="M 14 18 L 38 42 C 40 44 43 44 44 42 L 49 37 C 50 35 49 32 46 30 L 22 9 C 20 7 17 9 15 12 Z" fill="#0F172A" />
    <path d="M 18 20 L 41 42" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="18" cy="15" r="1.5" fill="#F8FAFC" />
    <path d="M 36 12 C 43 10 50 14 48 21 C 46 26 39 26 36 22 C 32 18 32 14 36 12 Z" fill="#10B981" />
    <path d="M 38 15 Q 42 18 43 22" stroke="#A7F3D0" strokeWidth="0.9" strokeLinecap="round" />
    <path d="M 45 44 Q 49 40 53 42 Q 51 48 45 44 Z" fill="#EF4444" />
  </svg>
);

// Option 5: Monogram Hex Shield
export const MonogramShieldIcon = ({ className = "h-full w-full" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 32 8 L 52 19 L 52 45 L 32 57 L 12 45 L 12 19 Z" fill="#0F172A" />
    <path d="M 32 11 L 49 21 L 49 43 L 32 53 L 15 43 L 15 21 Z" stroke="#1E293B" strokeWidth="1.2" />
    <path d="M 22 23 L 22 43" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M 22 24 L 35 24" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M 22 31 L 31 31" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M 32 43 L 32 26" stroke="#10B981" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M 24 26 L 40 43" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
    <path d="M 40 43 L 40 26" stroke="#10B981" strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="40" cy="22" r="2.2" fill="#34D399" />
  </svg>
);

export const LOGO_OPTIONS = {
  1: {
    id: 1,
    name: "Modern Sprout Bowl",
    tagline: "Restaurant Food Delivery",
    accentColor: "text-emerald-600",
    Icon: SproutBowlIcon,
  },
  2: {
    id: 2,
    name: "Stealth Ninja & Steaming Bowl",
    tagline: "Stealth Speed Delivery",
    accentColor: "text-emerald-500",
    Icon: NinjaBowlIcon,
  },
  3: {
    id: 3,
    name: "Shuriken Citrus Star",
    tagline: "Fresh Speed Kitchen",
    accentColor: "text-lime-500",
    Icon: ShurikenCitrusIcon,
  },
  4: {
    id: 4,
    name: "Chef Katana & Basil Flourish",
    tagline: "Artisan Gourmet Kitchen",
    accentColor: "text-teal-600",
    Icon: ChefBladeIcon,
  },
  5: {
    id: 5,
    name: "Modern Monogram Shield (FN)",
    tagline: "Food Delivery App",
    accentColor: "text-emerald-500",
    Icon: MonogramShieldIcon,
  },
};

/**
 * Unified authentic FoodNinja Brand Logo
 * Supports all 5 distinct design variations.
 *
 * @param {string|null} to - Target route for navigation, default is "/"
 * @param {"light"|"dark"} variant - Color theme (light for standard, dark for dark footer)
 * @param {"sm"|"md"|"lg"} size - Icon & text sizing scale
 * @param {number} option - 1, 2, 3, 4, or 5 (defaults to 1)
 * @param {boolean} badge - Wraps the logo icon in a rounded white badge container
 * @param {boolean} hideText - Hide the "FoodNinja" text and subtitle, show only icon
 * @param {boolean} hideSubtitle - Hide the tagline
 * @param {boolean} adminBadge - Shows an [ADMIN] pill tag next to the logo text
 * @param {string} className - Additional CSS classes
 */
const BrandLogo = ({
  to = "/",
  variant = "light",
  size = "md",
  option = 1,
  badge = false,
  hideText = false,
  hideSubtitle = false,
  adminBadge = false,
  className = "",
}) => {
  const isDark = variant === "dark";
  const currentOption = LOGO_OPTIONS[option] || LOGO_OPTIONS[1];
  const IconComponent = currentOption.Icon;

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
      <IconComponent className="h-full w-full object-contain" />
    </div>
  ) : (
    <div
      className={`flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
        iconSizes[size] || iconSizes.md
      }`}
    >
      <IconComponent className="h-full w-full object-contain" />
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
              Food
              <span className={isDark ? "text-emerald-400" : currentOption.accentColor}>
                Ninja
              </span>
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
              {currentOption.tagline}
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
