import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Accountabillibuddy",
    description: "Privacy Policy for Accountabillibuddy",
};

export default function PrivacyPolicy() {
    return (
        <main className="container max-w-3xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose prose-sm sm:prose-base max-w-none">
                <p className="text-muted-foreground mb-4">Last Updated: 4/13/2025</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                    <p>
                        Welcome to Accountabillibuddy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our accountability sharing platform.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
                    <p>We collect the following types of information:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>
                            <strong>Account Information:</strong> When you register, we collect your name, email address, and other authentication details through our identity provider (Clerk).
                        </li>
                        <li>
                            <strong>User Content:</strong> We collect and store the accountability posts and goals you share on the platform.
                        </li>
                        <li>
                            <strong>Usage Data:</strong> We collect information about how you interact with our service, including access times, pages viewed, and features used.
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>To provide, maintain, and improve our services</li>
                        <li>To display your accountability posts to other users</li>
                        <li>To communicate with you about account-related matters</li>
                        <li>To personalize your experience and tailor content</li>
                        <li>To detect and prevent fraudulent activity and improve security</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
                    <p>We may share your information with:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>
                            <strong>Service Providers:</strong> Third-party vendors that assist us in providing our services (such as Convex for database management and Clerk for authentication).
                        </li>
                        <li>
                            <strong>Other Users:</strong> Your accountability posts and user profile information are visible to other users of the platform.
                        </li>
                        <li>
                            <strong>Legal Requirements:</strong> We may disclose your information if required by law or if we believe in good faith that such action is necessary to comply with legal obligations.
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
                    <p>
                        We implement reasonable security measures to protect your personal information from unauthorized access and disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
                    <p>Depending on your location, you may have rights regarding your personal information, including:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>Accessing, correcting, or deleting your personal information</li>
                        <li>Withdrawing consent where processing is based on consent</li>
                        <li>Requesting restriction of processing</li>
                        <li>Data portability</li>
                    </ul>
                    <p className="mt-2">
                        To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">7. Children&apos;s Privacy</h2>
                    <p>
                        Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. The updated version will be indicated by the &quot;Last Updated&quot; date and will be effective immediately upon posting. We encourage you to review this Privacy Policy periodically.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
                    <p>
                        If you have questions or concerns about this Privacy Policy or our practices, please contact us at:
                    </p>
                    <p className="mt-2">Email: contact@accountabillibuddy.com</p>
                </section>
            </div>
        </main>
    );
} 