import type { Metadata } from "next"
import LegalPageLayout from "@/components/main/LegalPageLayout"

export const metadata: Metadata = {
  title: "Terms and Conditions | KDR Tech",
  description:
    "Terms and Conditions governing the use of the KDR Tech website and the purchase or engagement of software development and related digital services.",
  alternates: { canonical: "https://kdrtech.in/terms-and-conditions" },
}

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      effectiveDate="August 24, 2026"
      lastUpdated="August 24, 2026"
    >
      <p>
        These Terms and Conditions govern the use of the KDR Tech website and
        the purchase or engagement of software development and related
        digital services provided by KDR Tech.
      </p>
      <p>
        By engaging KDR Tech for services or making a payment toward a
        project, the client agrees to these Terms and Conditions together
        with any applicable project proposal, quotation, statement of work,
        invoice or separate service agreement.
      </p>

      <h2>1. About KDR Tech</h2>
      <p>
        KDR Tech provides digital technology and software development
        services, including mobile application development, website
        development, e-commerce solutions, CMS platforms, UI/UX design,
        backend/API development, deployment assistance and related technical
        services.
      </p>

      <h2>2. Project Scope</h2>
      <p>
        Before development begins, the project scope, deliverables, estimated
        timeline, pricing and payment schedule may be defined through a
        quotation, proposal, statement of work, invoice or separate
        agreement.
      </p>
      <p>
        KDR Tech is responsible for delivering the services and deliverables
        specifically included in the agreed project scope.
      </p>
      <p>
        Requests for features, functionality, integrations, designs or
        services outside the agreed scope may be treated as additional work
        and may require additional fees and/or an updated delivery timeline.
      </p>

      <h2>3. Pricing and Payments</h2>
      <p>
        Project pricing is based on the agreed quotation, proposal, invoice
        or service agreement.
      </p>
      <p>Payments may be structured as milestones or other agreed payment stages.</p>
      <p>
        Where milestone payments are used, work associated with subsequent
        milestones may depend on the successful completion and payment of the
        applicable previous milestone.
      </p>
      <p>
        Payment processing may be handled through third-party payment
        providers. KDR Tech does not store complete payment-card information
        on its own systems where payment processing is handled by such
        providers.
      </p>

      <h2>4. Client Responsibilities</h2>
      <p>
        The client agrees to provide accurate project requirements, content,
        credentials, approvals, feedback and other information reasonably
        required to complete the project.
      </p>
      <p>
        Delays caused by missing information, delayed feedback, unavailable
        access, third-party services or other circumstances outside KDR
        Tech&apos;s reasonable control may affect the project timeline.
      </p>
      <p>
        The client is responsible for ensuring that materials, content,
        trademarks, images, data and other assets supplied to KDR Tech may
        legally be used for the project.
      </p>

      <h2>5. Design, Revisions and Approvals</h2>
      <p>
        Where design and revision rounds are included in the agreed project
        scope, the number of revisions may be limited according to the
        applicable proposal or agreement.
      </p>
      <p>
        Changes requested after approval of a design, feature or milestone
        may require additional work and may result in additional charges or
        timeline changes.
      </p>
      <p>
        Client approval of a milestone or deliverable confirms that the
        client has reviewed the applicable work and authorizes the project to
        proceed to the next stage, subject to the applicable agreement.
      </p>

      <h2>6. Delivery and Timelines</h2>
      <p>
        KDR Tech will make reasonable efforts to complete projects within the
        estimated timeline communicated to the client.
      </p>
      <p>
        Estimated timelines are dependent on timely client feedback,
        approvals, content, access credentials, third-party services and
        other project dependencies.
      </p>
      <p>
        KDR Tech is not responsible for delays caused by circumstances
        outside its reasonable control, including third-party platform
        outages, app-store review processes, hosting issues, payment-provider
        issues or delays in receiving required client information.
      </p>

      <h2>7. Third-Party Services</h2>
      <p>
        Projects may require third-party services such as hosting providers,
        cloud platforms, payment gateways, app stores, APIs, domain providers
        or other external services.
      </p>
      <p>
        Third-party fees are generally the responsibility of the client
        unless expressly included in the agreed project price.
      </p>
      <p>
        KDR Tech cannot guarantee the continued availability, pricing,
        policies or performance of third-party services.
      </p>

      <h2>8. Intellectual Property and Source Code</h2>
      <p>
        Unless otherwise stated in the applicable project agreement, the
        client will receive the agreed project deliverables and source code
        upon completion of the applicable payment obligations.
      </p>
      <p>
        Third-party libraries, frameworks, open-source software, APIs, fonts,
        stock assets and other components remain subject to their respective
        licenses and terms.
      </p>
      <p>
        KDR Tech retains ownership of its pre-existing tools, reusable
        components, internal frameworks, methodologies and general
        development knowledge unless otherwise agreed in writing.
      </p>

      <h2>9. Confidentiality</h2>
      <p>
        KDR Tech will make reasonable efforts to protect confidential
        information provided by clients in connection with a project.
      </p>
      <p>
        Where required, the parties may enter into a separate Non-Disclosure
        Agreement (NDA).
      </p>

      <h2>10. Post-Launch Support</h2>
      <p>
        Where post-launch support is included in the project agreement, KDR
        Tech will provide support for the period and scope specified in that
        agreement.
      </p>
      <p>
        Support generally covers fixing defects attributable to the delivered
        implementation and does not automatically include new features,
        major changes, third-party changes or new development.
      </p>

      <h2>11. Cancellation and Refunds</h2>
      <p>
        Cancellation and refund requests are governed by the KDR Tech Refund
        and Cancellation Policy and any specific terms agreed in the
        applicable project agreement.
      </p>
      <p>
        Because software development involves allocated resources, design,
        development time and project-specific work, payments relating to
        work already performed may not be refundable.
      </p>

      <h2>12. Limitation of Liability</h2>
      <p>
        KDR Tech will make reasonable efforts to provide professional and
        functional services but does not guarantee that software will be
        completely free from defects, interruptions or compatibility issues
        in every environment.
      </p>
      <p>
        KDR Tech is not responsible for indirect, incidental, consequential
        or third-party losses arising from the use or inability to use a
        delivered product, except where liability cannot legally be excluded.
      </p>

      <h2>13. Website Information</h2>
      <p>
        Information displayed on the KDR Tech website is provided for
        general informational purposes and may be updated from time to time.
      </p>
      <p>
        Project pricing, timelines and deliverables are subject to the
        specific quotation, proposal or agreement provided to the client.
      </p>

      <h2>14. Changes to These Terms</h2>
      <p>
        KDR Tech may update these Terms and Conditions when necessary. The
        updated version will be published on this page with a revised
        effective or updated date.
      </p>

      <h2>15. Contact</h2>
      <p>For questions regarding these Terms and Conditions, please contact:</p>
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
