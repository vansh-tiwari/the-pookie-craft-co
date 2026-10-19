import { InformationPage } from "@/components/common/InformationPage";
export const metadata = {
  title: "Privacy policy",
  description: "How your little details are handled on this website.",
  alternates: { canonical: "/privacy" },
};
export default function Page() {
  return (
    <InformationPage
      title={"Privacy policy"}
      intro={"How your little details are handled on this website."}
      sections={[
        {
          title: "Information you provide",
          text: "The custom request form collects your name, email address or phone number, product idea, preferred colours, budget, and personalized text or design. Please avoid including sensitive information. The enquiry bag stores your product selections, quantities, and personalized text/design in this browser’s local storage so they survive a reload. They are not submitted to the studio until you choose to share them through an enquiry channel. Clear your bag to remove the saved selections; avoid putting sensitive information in personalization fields.",
        },
        {
          title: "Why we use it",
          text: "The studio uses custom requests and contact details to review your idea, reply, discuss a quote, and arrange any order you subsequently agree to. The website does not collect payment credentials or require customer accounts.",
        },
        {
          title: "Storage and access",
          text: "Custom requests are stored on the website\u2019s server-side content service and are accessible through the protected owner dashboard. Hosting and storage providers process data to operate the service. The owner should delete request details when they are no longer needed, subject to any applicable retention obligations.",
        },
        {
          title: "Third-party conversations",
          text: "WhatsApp and Instagram links take you to those services. Their privacy policies and terms apply to the conversations you choose to have there. Enquiry text is placed into the WhatsApp link only after you select that action.",
        },
        {
          title: "Cookies and logs",
          text: "Owner sign-in uses an essential, secure session cookie. The enquiry bag uses local browser storage for the selections you save; no customer account is required. The storefront does not use analytics or advertising trackers in this release. Hosting providers may process technical request logs for security and operation. A hosted font service may receive ordinary network request information when fonts load.",
        },
        {
          title: "Your choices and requests",
          text: "Contact the studio to ask about your information, request correction or deletion, or withdraw a request. The owner will respond in accordance with applicable requirements. The owner must confirm the business privacy contact and operating retention schedule before launch.",
        },
      ]}
    />
  );
}
