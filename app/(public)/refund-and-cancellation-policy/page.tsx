import type { Metadata } from "next"
import LegalPageLayout from "@/components/main/LegalPageLayout"

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy | KDR Tech",
  description:
    "KDR Tech's Refund and Cancellation Policy for custom software development and other digital services.",
  alternates: {
    canonical: "https://kdrtech.in/refund-and-cancellation-policy",
  },
}

export default function RefundAndCancellationPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund and Cancellation Policy"
      effectiveDate="August 24, 2026"
      lastUpdated="August 24, 2026"
    >
      <p>
        KDR Tech provides custom software development and other digital
        services. Because our services involve dedicated development
        resources, project planning, design, development and other work
        performed specifically for each client, refunds are handled
        according to the stage and nature of the project.
      </p>

      <h2>1. Project Cancellation by the Client</h2>
      <p>
        A client may request cancellation of a project by contacting KDR Tech
        in writing at:
      </p>
      <p>
        Email:{" "}
        <a href="mailto:developer.kdrtech.in@gmail.com">
          developer.kdrtech.in@gmail.com
        </a>
      </p>
      <p>
        Cancellation requests will be reviewed based on the current project
        stage, work already completed, resources allocated and the
        applicable project agreement.
      </p>

      <h2>2. Refunds for Work Already Performed</h2>
      <p>
        Payments relating to work that has already been completed,
        delivered, approved or substantially performed are generally
        non-refundable.
      </p>
      <p>This may include, but is not limited to:</p>
      <ul>
        <li>Project discovery and planning</li>
        <li>UI/UX design</li>
        <li>Development work</li>
        <li>Backend and API development</li>
        <li>Testing and quality assurance</li>
        <li>Deployment and configuration</li>
        <li>Third-party service setup</li>
        <li>Other project-specific work</li>
      </ul>

      <h2>3. Milestone Payments</h2>
      <p>
        For projects paid through milestones, each milestone payment
        corresponds to a defined stage of the project.
      </p>
      <p>
        Once work associated with a milestone has commenced, the amount
        attributable to work already performed may not be refundable.
      </p>
      <p>
        Any refund relating to an unperformed portion of a project will be
        evaluated based on the applicable project agreement and the
        circumstances of cancellation.
      </p>

      <h2>4. Cancellation Before Work Begins</h2>
      <p>
        If a client requests cancellation before project work has started,
        KDR Tech may review the payment for a refund, subject to any
        applicable payment-processing charges, administrative costs or
        specific terms contained in the project agreement.
      </p>
      <p>
        Where a separate agreement provides different cancellation terms,
        that agreement will apply.
      </p>

      <h2>5. Refund Processing</h2>
      <p>
        Where a refund is approved, KDR Tech will initiate the refund through
        the original payment method where reasonably possible.
      </p>
      <p>
        The time required for the refunded amount to appear in the
        client&apos;s account may depend on the payment provider, bank or
        financial institution.
      </p>
      <p>
        KDR Tech is not responsible for delays caused by banks or
        third-party payment processors after the refund has been initiated.
      </p>

      <h2>6. Third-Party Costs</h2>
      <p>
        Payments made to third-party providers on behalf of or for the
        benefit of a client may be non-refundable where those third-party
        providers do not provide refunds.
      </p>
      <p>
        Examples may include hosting, domains, application-store fees, paid
        APIs, software licenses, cloud services and other third-party
        services.
      </p>

      <h2>7. Defects and Corrections</h2>
      <p>
        If a delivered feature does not materially conform to the agreed
        project scope, the client should notify KDR Tech so that the issue
        can be reviewed and corrected where it falls within the agreed scope.
      </p>
      <p>
        Minor bugs, compatibility issues or defects discovered after
        delivery do not automatically qualify the client for a refund where
        KDR Tech is able to reasonably correct the issue.
      </p>

      <h2>8. Client Delays</h2>
      <p>
        Refunds will generally not be provided solely because a project is
        delayed due to the client&apos;s failure to provide required
        information, content, approvals, access credentials, feedback or
        other dependencies.
      </p>
      <p>
        KDR Tech will make reasonable efforts to communicate project
        dependencies and delays.
      </p>

      <h2>9. Non-Refundable Circumstances</h2>
      <p>A refund may not be available where:</p>
      <ul>
        <li>The requested work has already been completed.</li>
        <li>Deliverables have been approved by the client.</li>
        <li>
          The client changes their requirements after development has
          commenced.
        </li>
        <li>The client fails to provide required information or access.</li>
        <li>The issue results from a third-party service or platform.</li>
        <li>
          The client requests functionality outside the agreed project
          scope.
        </li>
        <li>
          The client chooses not to use the completed deliverables after
          delivery.
        </li>
      </ul>

      <h2>10. How to Request a Refund</h2>
      <p>To request cancellation or a refund, contact:</p>
      <p>
        Email:{" "}
        <a href="mailto:developer.kdrtech.in@gmail.com">
          developer.kdrtech.in@gmail.com
        </a>
      </p>
      <p>
        Please include the client&apos;s name, project details, payment or
        invoice reference and the reason for the request.
      </p>
      <p>
        Each request will be reviewed individually in accordance with this
        policy and the applicable project agreement.
      </p>

      <h2>11. Policy Updates</h2>
      <p>
        KDR Tech may update this Refund and Cancellation Policy when
        necessary. The latest version published on this page will apply to
        future transactions unless otherwise agreed in writing.
      </p>
    </LegalPageLayout>
  )
}
