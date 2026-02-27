"use client";

import localFont from "next/font/local";
import Link from "next/link";

const bartle = localFont({ src: "../../../public/fonts/BBHBartle-Regular.ttf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });
const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });

const privacySections = [
  {
    id: 1,
    title: "1. Information We Collect",
    preamble: "When you register or interact with the SIGNIFIYA website or event, we may collect the following categories of personal information:",
    items: [
      "Identity data: full name, student/institutional ID, year of study, and institution name.",
      "Contact data: email address and phone number.",
      "Payment data: transaction IDs and payment status processed via our payment gateway (we do not store card or banking details).",
      "Technical data: IP address, browser type, device information, and cookies collected automatically during website use.",
      "Usage data: pages visited, links clicked, time spent, and referral sources.",
      "Communications data: messages, feedback, or queries submitted via our contact form.",
    ],
    type: "ul",
  },
  {
    id: 2,
    title: "2. How We Use Your Information",
    preamble: "We use the information we collect for the following purposes:",
    items: [
      "To process registrations and manage event participation.",
      "To send you important event-related communications, schedules, and updates.",
      "To verify your identity and prevent fraudulent activity.",
      "To process payments and issue confirmation receipts.",
      "To improve our website, services, and future events through analytics.",
      "To comply with legal obligations or respond to legal requests.",
      "To share event highlights, including your photograph or video, in our promotional content (you may opt out by contacting us).",
    ],
    type: "ul",
  },
  {
    id: 3,
    title: "3. Legal Basis for Processing",
    preamble: "We process your personal data on the following legal grounds:",
    items: [
      "Consent — when you voluntarily register or submit your information.",
      "Contractual necessity — to fulfil our obligations arising from your registration.",
      "Legitimate interests — to operate, secure, and improve our event and website.",
      "Legal compliance — when required by applicable laws or regulations.",
    ],
    type: "ul",
  },
  {
    id: 4,
    title: "4. Sharing of Information",
    preamble:
      "We do not sell, rent, or trade your personal data. We may share it only in the following circumstances:",
    items: [
      "Service providers: third-party vendors (payment gateways, cloud storage, email services) assisting in event operations, bound by confidentiality agreements.",
      "Institution authorities: where required by the Host Institution for safety, security, or administrative purposes.",
      "Legal authorities: when required to comply with applicable law, court orders, or law enforcement requests.",
      "Event partners: sponsors and stall partners may receive aggregated, non-identifiable statistical data only.",
    ],
    type: "ul",
  },
  {
    id: 5,
    title: "5. Cookies and Tracking Technologies",
    preamble: "Our website uses cookies and similar technologies to:",
    items: [
      "Maintain user session and authentication state.",
      "Remember your preferences and settings.",
      "Analyse website traffic and usage patterns.",
      "Deliver a personalised browsing experience.",
    ],
    postamble:
      "You may disable cookies through your browser settings; however, certain features of the website may not function correctly without them.",
    type: "ul",
  },
  {
    id: 6,
    title: "6. Data Retention",
    paragraph:
      "We retain your personal data only for as long as necessary to fulfil the purposes outlined in this Policy, or as required by applicable law. Registration and payment records may be retained for up to two years following the event for audit and compliance purposes. You may request deletion of your data subject to legal retention obligations.",
    type: "p",
  },
  {
    id: 7,
    title: "7. Data Security",
    paragraph:
      "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, alteration, or disclosure. This includes encrypted data transmission (HTTPS), access controls, and secure cloud infrastructure. While we strive to protect your information, no method of transmission over the internet is 100% secure. In the event of a data breach that poses a risk to your rights, we will notify affected individuals as required by applicable law.",
    type: "p",
  },
  {
    id: 8,
    title: "8. Your Rights",
    preamble: "Subject to applicable law, you have the following rights regarding your personal data:",
    items: [
      "Right to access — request a copy of the personal data we hold about you.",
      "Right to correction — request correction of inaccurate or incomplete data.",
      "Right to erasure — request deletion of your data where it is no longer necessary.",
      "Right to restriction — request that we restrict processing of your data.",
      "Right to withdrawal of consent — withdraw consent at any time, without affecting prior processing.",
      "Right to lodge a complaint — with the relevant data protection authority in your jurisdiction.",
    ],
    postamble: "To exercise any of these rights, contact us at the details provided in Section 12.",
    type: "ul",
  },
  {
    id: 9,
    title: "9. Children's Privacy",
    paragraph:
      "SIGNIFIYA is intended for participants aged 16 and above. We do not knowingly collect personal data from individuals under the age of 16 without verifiable parental or guardian consent. If we become aware that we have inadvertently collected such data, it will be promptly deleted.",
    type: "p",
  },
  {
    id: 10,
    title: "10. Third-Party Links",
    paragraph:
      "Our website may contain links to third-party websites, including social media platforms and sponsor pages. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party sites you visit.",
    type: "p",
  },
  {
    id: 11,
    title: "11. Changes to This Policy",
    paragraph:
      "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. The revised policy will be posted on this page with an updated effective date. We encourage you to review this Policy periodically. Continued use of our website or services after changes are posted constitutes acceptance of the revised Policy.",
    type: "p",
  },
  {
    id: 12,
    title: "12. Contact Us",
    preamble:
      "For any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:",
    items: [
      "Email: signifiya.soet@gmail.com",
      "Website: https://signifiya.in/contact",
      "Organisation: SIGNIFIYA, School of Engineering & Technology (SOET)",
    ],
    type: "ul",
  },
] as const;

type Section = {
  id: number;
  title: string;
  type: string;
  items?: readonly string[];
  preamble?: string;
  paragraph?: string;
  postamble?: string;
};

function renderSection(section: Section) {
  return (
    <section key={section.id}>
      <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
        {section.title}
      </h2>
      {section.preamble && (
        <p className="text-gray-300 mb-3">{section.preamble}</p>
      )}
      {section.paragraph && (
        <p className="text-gray-300">{section.paragraph}</p>
      )}
      {section.items && section.type === "ol" && (
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          {section.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      )}
      {section.items && section.type === "ul" && (
        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
          {section.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {section.postamble && (
        <p className="text-gray-300 mt-3">{section.postamble}</p>
      )}
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className={`min-h-screen bg-black text-white ${softura.className}`}>
      <div className="p-3 sm:p-3">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#4ADE80] via-[#22c55e] to-[#16a34a] py-16 px-8 overflow-hidden rounded-[2.5rem]">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-overlay" />

          <div className="max-w-5xl mx-auto relative z-10">
            <p className="text-black/70 text-sm font-semibold uppercase tracking-widest mb-2">
              Legal
            </p>
            <h1
              className={`text-2xl md:text-6xl font-bold text-black ${bartle.className}`}
              style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.1)" }}
            >
              PRIVACY POLICY
            </h1>
            <p className="text-black mt-4 text-lg font-medium max-w-2xl">
              How we collect, use, store, share, and protect your information when you interact with SIGNIFIYA&apos;26.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-12">
          <div className="bg-white/5 border border-[#4ADE80]/30 rounded-2xl px-6 py-4">
            <p className="text-[#4ADE80] font-semibold text-sm uppercase tracking-widest">
              Effective Date
            </p>
            <p className="text-gray-300 mt-1">
              This Privacy Policy is effective as of 1st March, 2026 and applies to all activities relating to SIGNIFIYA&apos;26.
            </p>
          </div>

          <p className="text-gray-300 leading-relaxed">
            SIGNIFIYA (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), organised by the School of Engineering &amp; Technology (SOET), is committed to protecting the personal information of every individual who interacts with our event and website. This Privacy Policy explains how we collect, use, store, share, and protect your information. Please read it carefully.
          </p>

          {privacySections.map((section) => renderSection(section as Section))}

          <section className="border-t border-[#4ADE80] pt-8">
            <p className="text-gray-300 text-center font-bold">
              By using our website or registering for SIGNIFIYA, you confirm that you have read and understood this Privacy Policy and consent to the processing of your personal data as described herein.
            </p>
          </section>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link
            href="/terms"
            className="bg-white/10 text-white border-2 border-[#4ADE80] px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/20 transition-all shadow-[4px_4px_0px_0px_rgba(74,222,128,0.4)] hover:shadow-[2px_2px_0px_0px_rgba(74,222,128,0.4)] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            ← TERMS & CONDITIONS
          </Link>
          <Link
            href="/"
            className="bg-[#4ADE80] text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#3bc970] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
