import { InformationPage } from "@/components/common/InformationPage";
export const metadata = {
  title: "Terms & conditions",
  description: "A few details for a thoughtful gifting experience.",
  alternates: { canonical: "/terms" },
};
export default function Page() {
  return (
    <InformationPage
      title={"Terms & conditions"}
      intro={"A few details for a thoughtful gifting experience."}
      sections={[
        {
          title: "Using this website",
          text: "The Pookie Craft Co. website is a product catalog and enquiry service. Browsing, submitting a custom request, or opening WhatsApp does not place or confirm an order. Product availability and specifications are confirmed directly with the owner.",
        },
        {
          title: "Prices and customization",
          text: "Prices are displayed in Indian rupees. \u201cFrom\u201d indicates a starting price. Customization may change the final amount. The owner confirms the complete price, delivery charges, preparation time, and advance-payment details before an order is finalized.",
        },
        {
          title: "Payment and confirmation",
          text: "Advance payment is required for all orders, using UPI or bank transfer as agreed with the owner. The website does not process payments. Never provide banking passwords, UPI PINs, or authentication codes through this website.",
        },
        {
          title: "Handmade variations",
          text: "Handmade pieces may have small variations. Discuss required colours, sizes, text, and design details before confirming. These variations do not excuse supplying an incorrect or defective product or overriding applicable rights.",
        },
        {
          title: "Delivery and remedies",
          text: "Please read the Shipping & Delivery and Returns & Replacement pages. Shipping estimates are agreed directly. Applicable mandatory consumer protections remain in effect.",
        },
        {
          title: "Responsible use",
          text: "Use the enquiry forms for genuine requests. Do not submit unlawful, abusive, or sensitive content. Contact the owner for permission before reusing brand photographs or other original website content.",
        },
      ]}
    />
  );
}
