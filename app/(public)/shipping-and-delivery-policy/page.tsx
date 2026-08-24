import type { Metadata } from "next"
import LegalPageLayout from "@/components/main/LegalPageLayout"

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy | KDR Tech",
  description:
    "KDR Tech's Shipping and Delivery Policy covering digital delivery of software development services and project deliverables.",
  alternates: {
    canonical: "https://kdrtech.in/shipping-and-delivery-policy",
  },
}

export default function ShippingAndDeliveryPolicyPage() {
  return (
    <LegalPageLayout
      title="Shipping and Delivery Policy"
      effectiveDate="August 24, 2026"
      lastUpdated="August 24, 2026"
    >
      <h2>1. Digital Services</h2>
      <p>
        KDR Tech provides software development and other digital services.
        Our services do not involve the sale or shipment of physical
        products.
      </p>
      <p>Services may include:</p>
      <ul>
        <li>Mobile application development</li>
        <li>Website development</li>
        <li>E-commerce development</li>
        <li>CMS and web application development</li>
        <li>UI/UX design</li>
        <li>Backend and API development</li>
        <li>Software integration</li>
        <li>Application deployment</li>
        <li>Technical support and maintenance</li>
      </ul>
      <p>
        Because these are digital services, physical shipping is not
        applicable.
      </p>

      <h2>2. Digital Delivery</h2>
      <p>
        Project deliverables are provided electronically through appropriate
        digital channels agreed with the client.
      </p>
      <p>Depending on the project, delivery may include:</p>
      <ul>
        <li>Source code</li>
        <li>Design files</li>
        <li>Documentation</li>
        <li>Application builds</li>
        <li>Website deployment</li>
        <li>Backend configuration</li>
        <li>Digital assets</li>
        <li>Access credentials or handover information</li>
      </ul>
      <p>
        The exact deliverables and delivery schedule are determined by the
        applicable project proposal, quotation, milestone or service
        agreement.
      </p>

      <h2>3. Project Timelines</h2>
      <p>
        Estimated delivery timelines are communicated before or during
        project commencement.
      </p>
      <p>
        Timelines may depend on the scope of work, client approvals,
        availability of required information, third-party services and
        other project dependencies.
      </p>

      <h2>4. App Store and Platform Submission</h2>
      <p>
        Where app-store submission is included in the agreed scope, KDR Tech
        may assist with submission to platforms such as Google Play and the
        Apple App Store.
      </p>
      <p>
        Final approval and publication are controlled by the respective
        platform and may be subject to their review processes, policies and
        timelines.
      </p>
      <p>
        KDR Tech cannot guarantee the approval or publication time of
        third-party platforms.
      </p>

      <h2>5. Client Responsibilities</h2>
      <p>
        Clients are responsible for providing required content, credentials,
        approvals, legal documents, business information and other materials
        necessary for delivery.
      </p>
      <p>
        Delays in receiving required information may affect the project
        delivery timeline.
      </p>

      <h2>6. Physical Shipping</h2>
      <p>
        KDR Tech does not currently sell or ship physical products. No
        physical shipping charges apply to our digital development services.
      </p>
      <p>
        For this reason, shipping and physical delivery are not applicable
        to the services provided by KDR Tech.
      </p>

      <h2>7. Contact</h2>
      <p>
        For questions regarding delivery of a project or digital
        deliverables, please contact:
      </p>
      <p>
        Email:{" "}
        <a href="mailto:developer.kdrtech.in@gmail.com">
          developer.kdrtech.in@gmail.com
        </a>
        <br />
        Website: <a href="https://www.kdrtech.in/">https://www.kdrtech.in/</a>
        <br />
        Business Hours: Monday – Friday, 9:00 AM – 7:00 PM IST
      </p>
    </LegalPageLayout>
  )
}
