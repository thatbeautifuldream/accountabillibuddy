import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Accountabillibuddy",
    description: "Terms of Service for Accountabillibuddy",
};

export default function TermsOfService() {
    return (
        <main className="container max-w-3xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose prose-sm sm:prose-base max-w-none">
                <p className="text-muted-foreground mb-4">Last Updated: 4/13/2025</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
                    <p>
                        By accessing or using Accountabillibuddy (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these Terms, please do not use the Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
                    <p>
                        Accountabillibuddy is a platform that allows users to share their accountability goals publicly and interact with other users&apos; content. We provide this service to help users stay accountable to their goals and inspire others.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
                    <p>
                        To use certain features of the Service, you must create an account. You are responsible for:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>Providing accurate and complete information when creating your account</li>
                        <li>Maintaining the security of your account credentials</li>
                        <li>All activities that occur under your account</li>
                    </ul>
                    <p className="mt-2">
                        We reserve the right to suspend or terminate accounts if we suspect unauthorized or fraudulent use.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">4. User Content</h2>
                    <p>
                        You retain all rights to the content you post on Accountabillibuddy. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, and display such content in connection with the Service.
                    </p>
                    <p className="mt-2">
                        You are solely responsible for your content and the consequences of posting it. You agree not to post content that:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>Is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                        <li>Infringes on any intellectual property rights of any party</li>
                        <li>Contains personal or private information of any third party without their consent</li>
                        <li>Contains spam, commercial solicitations, or chain letters</li>
                        <li>Contains viruses, corrupted data, or other harmful files</li>
                    </ul>
                    <p className="mt-2">
                        We reserve the right to remove any content that violates these terms or that we deem inappropriate.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">5. Acceptable Use Policy</h2>
                    <p>
                        When using our Service, you agree not to:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>Use the Service in any way that violates any applicable law or regulation</li>
                        <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity</li>
                        <li>Attempt to gain unauthorized access to systems or user accounts</li>
                        <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                        <li>Collect or store personal data about other users without their consent</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">6. Intellectual Property</h2>
                    <p>
                        The Service and its original content, features, and functionality are owned by Accountabillibuddy and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">7. Disclaimers and Limitations of Liability</h2>
                    <p>
                        The Service is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, timely, secure, or error-free.
                    </p>
                    <p className="mt-2">
                        To the fullest extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of the Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">8. Modifications to Terms</h2>
                    <p>
                        We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on our website. Your continued use of the Service after such modifications constitutes your acceptance of the new Terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">9. Termination</h2>
                    <p>
                        We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">10. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">11. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <p className="mt-2">Email: contact@accountabillibuddy.com</p>
                </section>
            </div>
        </main>
    );
} 