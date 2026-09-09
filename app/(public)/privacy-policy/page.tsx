import type { Metadata } from "next"
import LegalPageLayout from "@/components/main/LegalPageLayout"

export const metadata: Metadata = {
  title: "Privacy Policy | KDR Tech",
  description:
    "How KDR Tech collects, uses, and protects personal data submitted through this website, including project enquiries and testimonials.",
  alternates: { canonical: "https://kdrtech.in/privacy-policy" },
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      effectiveDate="September 9, 2026"
      lastUpdated="September 9, 2026"
    >
      <p>
        This Privacy Policy explains what personal data KDR Tech collects
        through this website, why we collect it, how it is stored, and how
        you can request that it be deleted.
      </p>

      <h2>1. What We Collect</h2>
      <p>We collect personal data only when you choose to provide it, through:</p>
      <ul>
        <li>
          <strong>The project enquiry / &quot;Get Your Free Project
          Roadmap&quot; form</strong> — name, email address, project type,
          project description, and budget range.
        </li>
        <li>
          <strong>Direct contact</strong> — anything you send us by email or
          WhatsApp using the details on our{" "}
          <a href="/contact-us">Contact Us</a> page.
        </li>
        <li>
          <strong>Testimonials</strong> — if you provide a written or video
          testimonial about our work, we may publish your name, company,
          country, and the testimonial content on this website with your
          permission.
        </li>
      </ul>
      <p>
        We do not use analytics or advertising cookies on this website, and
        we do not knowingly collect any personal data beyond what you submit
        directly to us.
      </p>

      <h2>2. How We Use It</h2>
      <p>We use the data you provide to:</p>
      <ul>
        <li>Respond to your project enquiry or question</li>
        <li>Prepare a project scope, timeline, and quotation</li>
        <li>Communicate with you about an active or prospective project</li>
        <li>
          Display testimonials you&apos;ve explicitly agreed to have published
        </li>
      </ul>
      <p>We do not sell your personal data, and we do not use it for advertising.</p>

      <h2>3. Where It&apos;s Stored</h2>
      <p>
        Enquiry and contact data is stored in our database, hosted by
        Supabase, Inc., a third-party infrastructure provider that acts as
        our data sub-processor. Supabase stores data on secure cloud
        infrastructure with encryption in transit and at rest.
      </p>

      <h2>4. Retention</h2>
      <p>
        We retain enquiry and project data for as long as reasonably needed
        to respond to your enquiry, deliver an active project, and meet our
        own business and legal record-keeping needs. You can request earlier
        deletion at any time — see Section 6.
      </p>

      <h2>5. Third-Party Services</h2>
      <p>
        Depending on how you choose to contact us, your data may also pass
        through the following third-party services, each governed by its
        own privacy policy:
      </p>
      <ul>
        <li>WhatsApp (Meta) — if you message us via WhatsApp</li>
        <li>Calendly — if you book a call through our scheduling link</li>
        <li>Google (Gmail) — for email correspondence</li>
      </ul>

      <h2>6. Your Rights</h2>
      <p>You can ask us at any time to:</p>
      <ul>
        <li>Tell you what personal data we hold about you</li>
        <li>Correct inaccurate data</li>
        <li>Delete your data from our systems</li>
        <li>Remove a published testimonial</li>
      </ul>
      <p>
        To make a request, email{" "}
        <a href="mailto:developer.kdrtech.in@gmail.com">
          developer.kdrtech.in@gmail.com
        </a>{" "}
        with your name and email address. We will act on verified requests
        within a reasonable time.
      </p>

      <h2>7. Children&apos;s Privacy</h2>
      <p>
        This website is intended for businesses and individuals seeking
        software development services. We do not knowingly collect personal
        data from children.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The updated
        version will be published on this page with a revised effective
        date.
      </p>

      <h2>9. Contact</h2>
      <p>For questions about this Privacy Policy or your personal data, contact:</p>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:developer.kdrtech.in@gmail.com">
          developer.kdrtech.in@gmail.com
        </a>
        <br />
        <strong>Website:</strong>{" "}
        <a href="https://www.kdrtech.in/">https://www.kdrtech.in/</a>
        <br />
        <strong>Business Hours:</strong> Monday – Friday, 9:00 AM – 7:00 PM
        IST
      </p>
    </LegalPageLayout>
  )
}
