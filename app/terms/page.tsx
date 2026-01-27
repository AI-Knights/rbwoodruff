import React from 'react';

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl text-gray-800">
      <h1 className="text-3xl font-bold mb-6">NEWORKX Terms & Conditions (Terms of Service)</h1>
      <p className="mb-4"><strong>Effective Date:</strong> January 26, 2026</p>
      <p className="mb-4"><strong>Company:</strong> NEWORKX, LLC ("NEWORKX," "we," "us," "our")</p>
      <p className="mb-8"><strong>Contact:</strong> info@neworkx.com</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1) Agreement to These Terms</h2>
          <p>By downloading, accessing, or using the NEWORKX mobile application, websites, and related services (collectively, the "Service"), you agree to these Terms. If you do not agree, do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2) Who May Use the Service</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Minimum age:</strong> You must be 16 or older to use the Service.</li>
            <li>If you are under 18, you represent that your parent/guardian has reviewed and approved your use of the Service.</li>
            <li>You must be able to form a legally binding contract and comply with applicable laws.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3) What NEWORKX Is (and Is Not)</h2>
          <p>NEWORKX provides a workforce support service that may include:</p>
          <ul className="list-disc pl-5 mb-2 space-y-1">
            <li>job leads and links to third-party job postings,</li>
            <li>referrals to training programs ("Training Referral Bridge"),</li>
            <li>resume/profile tools,</li>
            <li>progress/proof uploads and status tracking,</li>
            <li>dashboards and reporting for approved partners (e.g., courts/agencies/employers/training providers).</li>
          </ul>
          <p>NEWORKX is not:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>an employer, staffing agency, recruiter of record, or placement agency,</li>
            <li>a legal service, probation service, or court,</li>
            <li>a guarantor of employment, wages, interviews, acceptance into training, credentials, or outcomes.</li>
          </ul>
          <p className="mt-2">You are responsible for your job applications, training enrollment, attendance, performance, and compliance with any obligations you may have (including court/agency requirements).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4) Account Registration and Security</h2>
          <p>You must provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5) Fees, Payments, and Refunds</h2>
          <p>Some NEWORKX programs (including certain court/agency-referred programs) require a fee.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Payment processing:</strong> Payments are handled by third-party processors (e.g., PayPal, Klarna, Affirm) and are subject to their terms. NEWORKX does not control approval decisions, installment terms, interest, late fees, or credit checks.</li>
            <li><strong>Installment options:</strong> If offered, installment plans are provided by the processor—not NEWORKX.</li>
            <li><strong>No guarantee:</strong> Paying a fee does not guarantee employment, training acceptance, credential award, or any specific outcome.</li>
          </ul>
          <p className="mt-2 font-semibold">Refund policy (default):</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Unless required by law or a separate written agreement, fees are non-refundable once the program has started or access has been delivered.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6) User Content and Proof Uploads</h2>
          <p>You may upload content such as documents, images, certificates, proof of activity, and messages ("User Content").</p>
          <p className="mt-2">You:</p>
          <ul className="list-disc pl-5 mb-2 space-y-1">
            <li>retain ownership of your User Content,</li>
            <li>grant NEWORKX a worldwide, non-exclusive, royalty-free license to host, store, process, reproduce, and display User Content only as needed to operate the Service, provide reporting to your authorized partners, prevent fraud/abuse, and comply with law.</li>
          </ul>
          <p>You represent you have the rights to upload your User Content and that it does not violate law or third-party rights.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7) Partner Sharing (Courts/Agencies/Employers/Training Providers)</h2>
          <p>If you enroll through or connect your account with a partner (like a court, agency, employer, training provider, or community organization), you authorize NEWORKX to share relevant program activity/status information with that partner, such as:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>enrollment/participation status,</li>
            <li>proof submission timestamps,</li>
            <li>training enrollment/progress signals (when you provide them),</li>
            <li>job-search activity you record in the Service,</li>
            <li>completion or non-responsiveness flags.</li>
          </ul>
          <p className="mt-2">This sharing is described further in the Privacy Policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">8) Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>break the law or violate court/agency instructions,</li>
            <li>impersonate others, falsify proof, or submit misleading information,</li>
            <li>attempt to access accounts or systems without authorization,</li>
            <li>scrape, reverse engineer, disrupt, or overload the Service,</li>
            <li>upload malware or harmful code,</li>
            <li>harass, threaten, or discriminate against others.</li>
          </ul>
          <p className="mt-2">We may suspend or terminate accounts for violations.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9) Third-Party Services and Links</h2>
          <p>The Service may link to third-party sites (job boards, employer application pages, training providers, payment processors). We do not control them and are not responsible for their content, policies, or practices. Your use of third-party services is at your own risk and subject to their terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">10) Communications and Text Messages</h2>
          <p>You may receive emails, in-app messages, push notifications, or SMS regarding your account and program (including reminders). Standard message/data rates may apply. If SMS is used, you can opt out by the method described in the message (unless messages are necessary for critical account/security notices).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">11) Service Changes and Availability</h2>
          <p>We may modify, suspend, or discontinue any part of the Service at any time. We do not guarantee uninterrupted availability.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">12) Disclaimer of Warranties</h2>
          <p className="uppercase">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEWORKX DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">13) Limitation of Liability</h2>
          <p className="uppercase">TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEWORKX WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL.</p>
          <p className="uppercase mt-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEWORKX'S TOTAL LIABILITY FOR ANY CLAIM WILL NOT EXCEED THE AMOUNT YOU PAID TO NEWORKX IN THE 12 MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM (OR $100 IF YOU PAID NOTHING).</p>
          <p className="mt-2">Some states do not allow certain limitations—those limitations apply to you only to the extent permitted by law.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">14) Indemnification</h2>
          <p>You agree to indemnify and hold NEWORKX harmless from claims arising out of your use of the Service, your User Content, or your violation of these Terms or law.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">15) Dispute Resolution, Arbitration, and Class Action Waiver</h2>
          <p>Please read carefully. This affects your legal rights.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Informal resolution first:</strong> Before filing, you agree to contact us at info@neworkx.com and allow 30 days to try to resolve.</li>
            <li><strong>Binding arbitration:</strong> If not resolved, disputes will be resolved by binding arbitration on an individual basis, not in court, except you may bring claims in small claims court if eligible.</li>
            <li><strong>No class actions:</strong> You agree not to participate in a class action, class arbitration, or representative action.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">16) Governing Law and Venue</h2>
          <p>These Terms are governed by the laws of the State of Georgia, without regard to conflict-of-law rules. If arbitration is removed or not permitted, exclusive venue for disputes will be state or federal courts located in Georgia.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">17) Termination</h2>
          <p>You may stop using the Service at any time. We may suspend or terminate your access if we believe you violated these Terms, created risk, or for legal/compliance reasons.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">18) Changes to These Terms</h2>
          <p>We may update these Terms. If changes are material, we will provide notice (e.g., in app or by email). Continued use after the effective date means you accept the updated Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">19) Contact</h2>
          <p>Questions about these Terms: info@neworkx.com</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
