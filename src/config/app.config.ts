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
      day1: "13th March, 2026",
      day2: "14th March, 2026",
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

  // Contact Information
  contact: {
    members: [
      {
        id: 1,
        name: "Ashish R. Das",
        role: "Lead Developer",
        email: "ard@signifiya.com",
        phone: "+91 8910114007",
        image: "/avatar1.jpg",
        color: "#deb3fa",
        social: {
          instagram: "https://instagram.com/ashishh_rd_",
          linkedin: "https://linkedin.com/in/arddev",
          twitter: "https://twitter.com/Ashishrd06",
        },
      },
      {
        id: 2,
        name: "Arijit Dey",
        role: "Finance Head",
        email: "arijit@signifiya.com",
        phone: "+91 9831093297",
        image: "/avatar5.jpg",
        color: "#FCD34D",
        social: {
          instagram: "https://instagram.com/jane",
          linkedin: "https://linkedin.com/in/jane",
          twitter: "https://twitter.com/jane",
        },
      },
      {
        id: 3,
        name: "Garima Roy",
        role: "Core Committee",
        email: "garima@signifiya.com",
        phone: "+91 9073377527",
        image: "/avatar3.jpg",
        color: "#3B82F6",
        social: {
          instagram: "https://instagram.com/mike",
          linkedin: "https://linkedin.com/in/mike",
          twitter: "https://twitter.com/mike",
        },
      },
    ],
  },

  // Social Media Links
  social: {
    instagram: "https://www.instagram.com/signifiya/",
    discord: "#",
    twitter: "#",
    youtube: "#",
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
export type ContactMember = typeof APP_CONFIG.contact.members[number];
export type PassType = keyof typeof APP_CONFIG.passPrices;
