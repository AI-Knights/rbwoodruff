import React from 'react';

const PrivacyPage = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl text-gray-800">
            <h1 className="text-3xl font-bold mb-6">NEWORKX Privacy Policy</h1>
            <p className="mb-4"><strong>Effective Date:</strong> January 26, 2026</p>
            <p className="mb-4"><strong>Company:</strong> NEWORKX, LLC</p>
            <p className="mb-8"><strong>Contact:</strong> info@neworkx.com</p>

            <p className="mb-8">This Privacy Policy explains how NEWORKX collects, uses, shares, and protects information when you use the Service.</p>

            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-2">1) Information We Collect</h2>
                    <h3 className="text-lg font-medium mt-4 mb-2">A. Information you provide</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Account info (name, email, phone number, login credentials)</li>
                        <li>Profile/resume info (work history, skills, certifications, availability, location preferences)</li>
                        <li>Program info (job-first or training-first selection, progress notes)</li>
                        <li>Proof uploads (documents, screenshots, certificates, completion evidence)</li>
                        <li>Communications (messages to/from NEWORKX, support requests)</li>
                        <li>Payment confirmations (we typically receive limited payment metadata from processors, not full card/bank details)</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-4 mb-2">B. Information collected automatically</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Device and app activity (IP address, device identifiers, app events, log data)</li>
                        <li>Approximate location (derived from IP) and/or location you choose to provide</li>
                        <li>Cookies or similar technologies on our websites (if applicable)</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-4 mb-2">C. Information from partners or third parties (where applicable)</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Referral/enrollment data from courts, agencies, training providers, employers, or community partners</li>
                        <li>Verification signals (e.g., training enrollment confirmation if provided by the program/provider)</li>
                        <li>Job listing content from third-party job sources (links/postings)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2) How We Use Information</h2>
                    <p>We use information to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Provide and operate the Service (accounts, tools, dashboards)</li>
                        <li>Deliver program features (job leads, training referrals, resume generation)</li>
                        <li>Verify and display proof/status and produce partner reports (when authorized)</li>
                        <li>Process payments (via third-party processors)</li>
                        <li>Communicate with you (support, reminders, security alerts)</li>
                        <li>Prevent fraud, abuse, and security incidents</li>
                        <li>Improve and troubleshoot the Service (analytics, debugging)</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                    <p className="mt-2">We do not use your data to guarantee or determine employment outcomes.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3) How We Share Information</h2>
                    <p>We may share information in these situations:</p>

                    <h3 className="text-lg font-medium mt-4 mb-2">A. With your authorized partners (when applicable)</h3>
                    <p>If you are referred by or connected to a court/agency/employer/training provider, we may share information necessary for program administration and reporting, such as enrollment status, proof timestamps, completion signals you provide, and participation status.</p>

                    <h3 className="text-lg font-medium mt-4 mb-2">B. With service providers</h3>
                    <p>We use vendors that help us run the Service (hosting, analytics, customer support tools, messaging/SMS providers). They are authorized to access data only to perform services for us.</p>

                    <h3 className="text-lg font-medium mt-4 mb-2">C. With payment processors</h3>
                    <p>Payments are processed by third parties (e.g., PayPal, Klarna, Affirm). We share what’s necessary to complete the transaction and receive back limited transaction status. The processor’s privacy practices govern their handling of payment data.</p>

                    <h3 className="text-lg font-medium mt-4 mb-2">D. For legal, safety, and compliance reasons</h3>
                    <p>We may disclose information to comply with law, legal process, or lawful requests, or to protect rights, safety, and security.</p>

                    <h3 className="text-lg font-medium mt-4 mb-2">E. Business transfers</h3>
                    <p>If we are involved in a merger, acquisition, financing, or sale of assets, information may be transferred as part of that transaction.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">4) "Sale" of Personal Information / Targeted Advertising</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>We do not sell personal information for money.</li>
                        <li>If we ever use targeted advertising or "sharing" that could be treated as a "sale/share" under certain state laws, we will provide required opt-out mechanisms.</li>
                        <li>We do not knowingly engage in targeted advertising to users we know are under 16.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">5) Data Security</h2>
                    <p>We use administrative, technical, and physical safeguards designed to protect information. No system is 100% secure, so we cannot guarantee absolute security.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">6) Data Retention</h2>
                    <p>We keep information as long as needed for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>providing the Service,</li>
                        <li>program administration and reporting,</li>
                        <li>legal/compliance needs,</li>
                        <li>resolving disputes and enforcing agreements.</li>
                    </ul>
                    <p className="mt-2">We may de-identify and retain aggregated data longer.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">7) Your Choices and Rights</h2>
                    <h3 className="text-lg font-medium mt-4 mb-2">A. Account controls</h3>
                    <p>You can request access, correction, or deletion by contacting info@neworkx.com. Some data may be retained for legal/compliance reasons.</p>

                    <h3 className="text-lg font-medium mt-4 mb-2">B. State privacy rights (where applicable)</h3>
                    <p>Depending on your state of residence and our processing thresholds, you may have rights such as:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>access/confirm processing,</li>
                        <li>delete,</li>
                        <li>correct,</li>
                        <li>opt out of targeted advertising,</li>
                        <li>opt out of certain profiling,</li>
                        <li>opt out of "sale/share" (as defined by law),</li>
                        <li>appeal a denial of a request.</li>
                    </ul>
                    <p className="mt-2">We will respond as required by applicable law.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">8) Children's Privacy</h2>
                    <p>The Service is not intended for children under 16. If we learn we collected personal information from someone under 16 without appropriate authorization, we will delete it.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">9) Georgia-Specific Notes (Identity Theft / SSN Handling / Breach Notice)</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Breach notification:</strong> If a security breach affects certain personal information, Georgia law requires notification in accordance with the Georgia Personal Identity Protection Act provisions.</li>
                        <li><strong>Social Security numbers:</strong> We do not require Social Security numbers to use the Service. If SSNs are ever collected for a specific program workflow, Georgia law restricts certain uses and requires secure transmission/access controls.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">10) FTC / Consumer Protection</h2>
                    <p>We aim to provide clear privacy disclosures and avoid unfair or deceptive practices.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">11) Updates to This Policy</h2>
                    <p>We may update this Privacy Policy. If changes are material, we will provide notice in the app and/or by email. The effective date will be updated at the top.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">12) Contact Us</h2>
                    <p>Privacy questions or requests: info@neworkx.com</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPage;
