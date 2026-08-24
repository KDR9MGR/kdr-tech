import type { Metadata } from "next"
import LegalPageLayout from "@/components/main/LegalPageLayout"

export const metadata: Metadata = {
  title: "Contact Us | KDR Tech",
  description:
    "Get in touch with KDR Tech for mobile app, website, e-commerce, CMS and software development enquiries, support requests and business enquiries.",
  alternates: { canonical: "https://kdrtech.in/contact-us" },
}

export default function ContactUsPage() {
  return (
    <LegalPageLayout title="Contact Us" lastUpdated="August 2026">
      <p>
        KDR Tech is a digital technology and software development agency
        providing custom mobile application, website, e-commerce, CMS and
        software development services to businesses, startups, entrepreneurs
        and organizations.
      </p>
      <p>
        For project enquiries, support requests, business enquiries or other
        questions regarding our services, please contact us using the details
        below.
      </p>

      <h2>Contact Information</h2>
      <p>
        Email:{" "}
        <a href="mailto:developer.kdrtech.in@gmail.com">
          developer.kdrtech.in@gmail.com
        </a>
        <br />
        Website: <a href="https://www.kdrtech.in/">https://www.kdrtech.in/</a>
      </p>

      <h2>Business Hours</h2>
      <p>
        Monday – Friday
        <br />
        9:00 AM – 7:00 PM IST
      </p>
      <p>
        We aim to respond to business and project enquiries as soon as
        reasonably possible during our business hours.
      </p>

      <h2>Services</h2>
      <p>Our services include, but are not limited to:</p>
      <ul>
        <li>Mobile application development</li>
        <li>Website development</li>
        <li>E-commerce development</li>
        <li>CMS and web application development</li>
        <li>UI/UX design</li>
        <li>Backend and API development</li>
        <li>Application deployment and store submission assistance</li>
        <li>Software maintenance and post-launch support</li>
      </ul>

      <h2>Project Enquiries</h2>
      <p>
        For new projects, please contact us with information about your
        requirements, preferred technology, expected functionality and any
        relevant project documentation. We will review your requirements and
        provide further information regarding scope, timeline and pricing.
      </p>
      <p>
        For existing clients, please include your project or invoice
        reference where applicable so that we can assist you more
        efficiently.
      </p>

      <h2>Support</h2>
      <p>
        For questions relating to an existing project or delivered service,
        please contact us using the email address above. Support availability
        may vary depending on the service agreement, project scope and
        applicable support period.
      </p>
      <p>
        KDR Tech is committed to providing clear communication and
        professional assistance throughout the project lifecycle.
      </p>
    </LegalPageLayout>
  )
}
