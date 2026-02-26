/**
 * Application Configuration
 * Centralized configuration for Signifiya app
 */

export const APP_CONFIG = {
  // Event Information
  event: {
    name: "SIGNIFIYA",
    year: "2026",
    fullName: "SIGNIFIYA'26",
    dates: {
      day1: "27th March, 2026",
      day2: "28th March, 2026",
    },
    established: "2021",
  },

  // Pass Pricing
  passPrices: {
    dual: 79,
    single: 49,
    full: 499,
  },

  // Pass Type Labels
  passTypeLabels: {
    dual: "Double Day Pass",
    single: "Single Day Pass",
    full: "Visitor Pass",
  },

  /**
   * Event registration flash sale discounts.
   * Each entry: { start: ISO date, durationHours, discountPercent }
   * Active discount is the first window where now >= start && now < start + duration.
   */
  eventDiscounts: [
    {
      start: "2026-02-23T16:00:00+05:30",
      durationHours: 6,
      discountPercent: 10,
      label: "Flash Sale 10% OFF",
    },
    {
      start: "2026-03-01T00:00:00+05:30",
      durationHours: 12,
      discountPercent: 5,
      label: "Early Bird 5% OFF",
    },
    {
      start: "2026-03-22T00:00:00+05:30",
      durationHours: 24,
      discountPercent: 10,
      label: "Last Chance 10% OFF",
    },
  ] as const,
  // Contact Information
  contact: {
    members: [
      {
        id: 1,
        name: "Ashish R. Das",
        role: "Lead Developer",
        email: "0day.ashish@gmail.com",
        phone: "+91 8910114007",
        image: "/team/Ashish.jpg",
        color: "#deb3fa",
        social: {
          instagram: "https://instagram.com/ashishh_rd_",
          linkedin: "https://linkedin.com/in/arddev",
          whatsapp: "https://wa.me/918910114007",
        },
      },
      {
        id: 2,
        name: "Arijit Dey",
        role: "Finance Head",
        email: "arijit1504@gmail.com",
        phone: "+91 9831093297",
        image: "/team/Arijit.jpg",
        color: "#FCD34D",
        social: {
          instagram: "https://instagram.com/arijit_.04",
          linkedin: "https://linkedin.com/in/arijit-de-ba1594358",
          whatsapp: "https://wa.me/919831093297",
        },
      },
      {
        id: 3,
        name: "Garima Roy",
        role: "Documentations Head",
        email: "roygarima@gmail.com",
        phone: "+91 9073377527",
        image: "/team/Garima.jpeg",
        color: "#3B82F6",
        social: {
          instagram: "https://instagram.com/_garimaa.07_",
          linkedin: "https://linkedin.com/in/garima-roy-032277290",
          whatsapp: "https://wa.me/919073377527",
        },
      },
    ],
  },

  // Social Media Links
  social: {
    instagram: "https://www.instagram.com/signifiya/",
    discord: "https://discord.com/invite/qP7YC9EDRZ",
    twitter: "#",
    youtube: "https://www.youtube.com/@SIGNIFIYA/featured",
  },

  // External Services
  services: {
    qrCodeApi: "https://api.qrserver.com/v1/create-qr-code/",
  },

  // Organization Info
  organization: {
    name: "SIGNIFIYA",
    fullName: "SIGNIFIYA, SOET",
    copyright: "© 2026 SIGNIFIYA, SOET.",
  },
} as const;

// Type exports for better TypeScript support
export type ContactMember = (typeof APP_CONFIG.contact.members)[number];
export type PassType = keyof typeof APP_CONFIG.passPrices;
