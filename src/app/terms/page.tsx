"use client";

import localFont from "next/font/local";
import Link from "next/link";

const bartle = localFont({ src: "../../../public/fonts/BBHBartle-Regular.ttf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });
const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });

export default function TermsAndConditions() {
  return (
    <div className={`min-h-screen bg-black text-white ${softura.className}`}>
      {/* Outer padding container */}
      <div className="p-3 sm:p-3">
        {/* Header - Curved Box */}
        <div className="relative bg-gradient-to-br from-[#4ADE80] via-[#22c55e] to-[#16a34a] py-16 px-8 overflow-hidden rounded-[2.5rem]">
          {/* Grid Pattern Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Noise Overlay */}
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-overlay" />

          {/* Content */}
          <div className="max-w-5xl mx-auto relative z-10">
            <h1
              className={`text-2xl md:text-6xl font-bold text-black ${bartle.className}`}
              style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.1)' }}
            >
              TERMS & CONDITIONS
            </h1>
            <p className="text-black mt-4 text-lg font-medium">
              By accessing the Website or participating in SIGNIFIYA, all parties agree to these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Section 1 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              1. Acceptance of Terms
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Registration, entry, sponsorship engagement, or attendance constitutes unconditional acceptance of these Terms.</li>
              <li>The Organizer reserves the right to modify or update policies at any time without prior notice. Continued participation implies acceptance of revised terms.</li>
            </ol>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              2. Eligibility and Registration
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>All Participants, Sponsors, Stall Partners, Media Partners, and Visitors must complete official registration procedures where applicable.</li>
              <li>The Organizer may verify identities and credentials at any stage.</li>
              <li>Any false, misleading, or incomplete information may result in rejection, suspension, or removal from the Event without refund.</li>
            </ol>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              3. Code of Conduct and Compliance
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>All attendees must maintain professional behavior and adhere to institutional policies, applicable laws, and safety regulations.</li>
              <li>Harassment, discrimination, unlawful promotion, damage to property, or disruptive behavior is strictly prohibited.</li>
              <li>The Organizer retains sole discretion to deny entry or remove individuals or organizations violating these rules.</li>
            </ol>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              4. Participants (Competitions, Workshops, Activities)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Participants must comply with event-specific rules published on the Website or communicated by organizers.</li>
              <li>Any form of cheating, plagiarism, or unfair advantage may lead to immediate disqualification.</li>
              <li>Judging decisions are final and not subject to appeal.</li>
              <li>The Organizer may use submissions for promotional purposes while respecting intellectual ownership.</li>
            </ol>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              5. Sponsors
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Sponsorship benefits shall be governed by individual agreements and sponsorship decks approved by the Organizer.</li>
              <li>Sponsors must provide logos, creatives, and branding assets within prescribed timelines.</li>
              <li>The Organizer reserves the right to reject or remove promotional material deemed inappropriate, illegal, or conflicting with institutional values.</li>
              <li>Sponsors shall not conduct independent promotional activities within the campus without written authorization.</li>
            </ol>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              6. Stall Partners / Exhibitors
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Stall allocation is subject to availability, safety compliance, and approval by the Organizer.</li>
              <li>Stall Partners must operate strictly within assigned spaces and adhere to operational timings.</li>
              <li>Sale or display of prohibited, unsafe, illegal, or restricted items is strictly forbidden.</li>
              <li>Stall Partners assume full responsibility for equipment, staff, financial transactions, and inventory.</li>
              <li>Any damage caused to property or infrastructure must be compensated by the Stall Partner.</li>
            </ol>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              7. Media Rights, Photography, and Publicity
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>By attending SIGNIFIYA, all attendees grant the Organizer the right to capture and use photographs, videos, and recordings for promotional, educational, and archival purposes without additional consent or compensation.</li>
              <li>Media Partners must obtain prior written approval before conducting large-scale recordings or interviews.</li>
              <li>Unauthorized commercial use of Event branding, logos, or intellectual property is prohibited.</li>
            </ol>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              8. Payments, Fees, Refunds, and Cancellation Policy
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>All payments (registration, sponsorship, stall bookings, or other fees) must be completed via official channels designated by the Organizer.</li>
              <li>Unless otherwise specified in writing, all fees are non-refundable.</li>
              <li>The Organizer reserves the right to modify schedules, venues, event formats, or programming without liability.</li>
              <li>In case of Event cancellation by the Organizer, refund decisions shall be made at the sole discretion of the Organizer.</li>
            </ol>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              9. Intellectual Property Rights
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Participants retain ownership of their original work but grant the Organizer a worldwide, non-exclusive, royalty-free license to display, promote, and archive submissions related to SIGNIFIYA.</li>
              <li>Unauthorized use of the Organizer's trademarks, logos, or brand identity is strictly prohibited without written permission.</li>
            </ol>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              10. Safety, Risk Acknowledgment, and Liability Disclaimer
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>All attendees participate at their own risk.</li>
              <li>The Organizer shall not be liable for any personal injury, loss, theft, or damage to property occurring during the Event, except where required by applicable law.</li>
              <li>Attendees must follow all security instructions, emergency protocols, and safety guidelines issued during the Event.</li>
            </ol>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              11. Indemnification
            </h2>
            <p className="text-gray-300 mb-4">
              Participants, Sponsors, Stall Partners, Media Partners, and Visitors agree to indemnify and hold harmless the Organizer, its officers, volunteers, and affiliates from any claims, damages, liabilities, losses, or expenses arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Violation of these Terms and Conditions;</li>
              <li>Negligent or unlawful conduct;</li>
              <li>Breach of third-party rights;</li>
              <li>Unauthorized commercial or promotional activities.</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              12. Force Majeure
            </h2>
            <p className="text-gray-300">
              The Organizer shall not be held responsible for failure or delay in performance due to circumstances beyond reasonable control, including but not limited to natural disasters, government restrictions, public health emergencies, technical failures, civil disturbances, or acts of God. The Organizer reserves the right to reschedule, modify, or cancel the Event under such conditions.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              13. Privacy and Data Protection
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Personal information collected during registration shall be used solely for event administration, communication, analytics, and security purposes.</li>
              <li>Data may be shared with authorized partners only where necessary for Event operations or as required by law.</li>
              <li>By registering, users consent to such data processing.</li>
            </ol>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              14. Website Use
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Users agree not to misuse the Website through hacking, unauthorized access, distribution of malware, or unlawful activities.</li>
              <li>The Organizer does not guarantee uninterrupted or error-free website functionality.</li>
            </ol>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              15. Governing Law and Dispute Resolution
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>These Terms and Conditions shall be governed by and construed in accordance with the laws of India.</li>
              <li>Any disputes arising out of or relating to SIGNIFIYA shall be subject to the exclusive jurisdiction of the competent courts located in the jurisdiction of the Host Institution.</li>
            </ol>
          </section>

          {/* Section 16 */}
          <section>
            <h2 className={`text-2xl md:text-4xl font-bold text-[#4ADE80] mb-4 ${gilton.className}`}>
              16. Severability
            </h2>
            <p className="text-gray-300">
              If any provision of these Terms is held invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          {/* Final Statement */}
          <section className="border-t border-[#4ADE80] pt-8">
            <p className="text-gray-300 text-center font-bold">
              By registering for, sponsoring, exhibiting at, covering, or attending SIGNIFIYA, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
            </p>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="bg-[#4ADE80] text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#3bc970] transition-colors border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
