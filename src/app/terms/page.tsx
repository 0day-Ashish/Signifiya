import localFont from "next/font/local";
import Link from "next/link";

const bartle = localFont({ src: "../../../public/fonts/BBHBartle-Regular.ttf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });
const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });

const tcSections = [
  {
    id: 1,
    title: "1. Acceptance of Terms",
    items: [
      "Registration, entry, sponsorship engagement, or attendance constitutes unconditional acceptance of these Terms.",
      "The Organizer reserves the right to modify or update policies at any time without prior notice. Continued participation implies acceptance of revised terms.",
    ],
    type: "ol",
  },
  {
    id: 2,
    title: "2. Eligibility and Registration",
    items: [
      "All Participants, Sponsors, Stall Partners, Media Partners, and Visitors must complete official registration procedures where applicable.",
      "The Organizer may verify identities and credentials at any stage.",
      "Any false, misleading, or incomplete information may result in rejection, suspension, or removal from the Event without refund.",
    ],
    type: "ol",
  },
  {
    id: 3,
    title: "3. Code of Conduct and Compliance",
    items: [
      "All attendees must maintain professional behavior and adhere to institutional policies, applicable laws, and safety regulations.",
      "Harassment, discrimination, unlawful promotion, damage to property, or disruptive behavior is strictly prohibited.",
      "The Organizer retains sole discretion to deny entry or remove individuals or organizations violating these rules.",
    ],
    type: "ol",
  },
  {
    id: 4,
    title: "4. Participants (Competitions, Workshops, Activities)",
    items: [
      "Participants must comply with event-specific rules published on the Website or communicated by organizers.",
      "Any form of cheating, plagiarism, or unfair advantage may lead to immediate disqualification.",
      "Judging decisions are final and not subject to appeal.",
      "The Organizer may use submissions for promotional purposes while respecting intellectual ownership.",
    ],
    type: "ol",
  },
  {
    id: 5,
    title: "5. Sponsors",
    items: [
      "Sponsorship benefits shall be governed by individual agreements and sponsorship decks approved by the Organizer.",
      "Sponsors must provide logos, creatives, and branding assets within prescribed timelines.",
      "The Organizer reserves the right to reject or remove promotional material deemed inappropriate, illegal, or conflicting with institutional values.",
      "Sponsors shall not conduct independent promotional activities within the campus without written authorization.",
    ],
    type: "ol",
  },
  {
    id: 6,
    title: "6. Stall Partners / Exhibitors",
    items: [
      "Stall allocation is subject to availability, safety compliance, and approval by the Organizer.",
      "Stall Partners must operate strictly within assigned spaces and adhere to operational timings.",
      "Sale or display of prohibited, unsafe, illegal, or restricted items is strictly forbidden.",
      "Stall Partners assume full responsibility for equipment, staff, financial transactions, and inventory.",
      "Any damage caused to property or infrastructure must be compensated by the Stall Partner.",
    ],
    type: "ol",
  },
  {
    id: 7,
    title: "7. Media Rights, Photography, and Publicity",
    items: [
      "By attending SIGNIFIYA, all attendees grant the Organizer the right to capture and use photographs, videos, and recordings for promotional, educational, and archival purposes without additional consent or compensation.",
      "Media Partners must obtain prior written approval before conducting large-scale recordings or interviews.",
      "Unauthorized commercial use of Event branding, logos, or intellectual property is prohibited.",
    ],
    type: "ol",
  },
  {
    id: 8,
    title: "8. Payments, Fees, Refunds, and Cancellation Policy",
    items: [
      "All payments (registration, sponsorship, stall bookings, or other fees) must be completed via official channels designated by the Organizer.",
      "Unless otherwise specified in writing, all fees are non-refundable.",
      "The Organizer reserves the right to modify schedules, venues, event formats, or programming without liability.",
      "In case of Event cancellation by the Organizer, refund decisions shall be made at the sole discretion of the Organizer.",
    ],
    type: "ol",
  },
  {
    id: 9,
    title: "9. Intellectual Property Rights",
    items: [
      "Participants retain ownership of their original work but grant the Organizer a worldwide, non-exclusive, royalty-free license to display, promote, and archive submissions related to SIGNIFIYA.",
      "Unauthorized use of the Organizer's trademarks, logos, or brand identity is strictly prohibited without written permission.",
    ],
    type: "ol",
  },
  {
    id: 10,
    title: "10. Safety, Risk Acknowledgment, and Liability Disclaimer",
    items: [
      "All attendees participate at their own risk.",
      "The Organizer shall not be liable for any personal injury, loss, theft, or damage to property occurring during the Event, except where required by applicable law.",
      "Attendees must follow all security instructions, emergency protocols, and safety guidelines issued during the Event.",
    ],
    type: "ol",
  },
  {
    id: 11,
    title: "11. Indemnification",
    preamble:
      "Participants, Sponsors, Stall Partners, Media Partners, and Visitors agree to indemnify and hold harmless the Organizer, its officers, volunteers, and affiliates from any claims, damages, liabilities, losses, or expenses arising from:",
    items: [
      "Violation of these Terms and Conditions;",
      "Negligent or unlawful conduct;",
      "Breach of third-party rights;",
      "Unauthorized commercial or promotional activities.",
    ],
    type: "ul",
  },
  {
    id: 12,
    title: "12. Force Majeure",
    paragraph:
      "The Organizer shall not be held responsible for failure or delay in performance due to circumstances beyond reasonable control, including but not limited to natural disasters, government restrictions, public health emergencies, technical failures, civil disturbances, or acts of God. The Organizer reserves the right to reschedule, modify, or cancel the Event under such conditions.",
    type: "p",
  },
  {
    id: 13,
    title: "13. Privacy and Data Protection",
    items: [
      "Personal information collected during registration shall be used solely for event administration, communication, analytics, and security purposes.",
      "Data may be shared with authorized partners only where necessary for Event operations or as required by law.",
      "By registering, users consent to such data processing.",
    ],
    type: "ol",
  },
  {
    id: 14,
    title: "14. Website Use",
    items: [
      "Users agree not to misuse the Website through hacking, unauthorized access, distribution of malware, or unlawful activities.",
      "The Organizer does not guarantee uninterrupted or error-free website functionality.",
    ],
    type: "ol",
  },
  {
    id: 15,
    title: "15. Governing Law and Dispute Resolution",
    items: [
      "These Terms and Conditions shall be governed by and construed in accordance with the laws of India.",
      "Any disputes arising out of or relating to SIGNIFIYA shall be subject to the exclusive jurisdiction of the competent courts located in the jurisdiction of the Host Institution.",
    ],
    type: "ol",
  },
  {
    id: 16,
    title: "16. Severability",
    paragraph:
      "If any provision of these Terms is held invalid or unenforceable, the remaining provisions shall continue in full force and effect.",
    type: "p",
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

export default function TermsAndPolicy() {
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
              TERMS & CONDITIONS
            </h1>
            <p className="text-black mt-4 text-lg font-medium max-w-2xl">
              By accessing our website or participating in SIGNIFIYA&apos;26, you agree to the following terms.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {tcSections.map((section) => renderSection(section as Section))}
          <section className="border-t border-[#4ADE80] pt-8">
            <p className="text-gray-300 text-center font-bold">
              By registering for, sponsoring, exhibiting at, covering, or attending SIGNIFIYA, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
            </p>
          </section>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link
            href="/privacy"
            className="bg-white/10 text-white border-2 border-[#4ADE80] px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/20 transition-all shadow-[4px_4px_0px_0px_rgba(74,222,128,0.4)] hover:shadow-[2px_2px_0px_0px_rgba(74,222,128,0.4)] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            PRIVACY POLICY →
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
