import { InformationPage } from "@/components/common/InformationPage";
export const metadata = {
  title: "A few little answers.",
  description: "Everything you might like to know before you say hello.",
  alternates: { canonical: "/faq" },
};
export default function Page() {
  return (
    <InformationPage
      title={"A few little answers."}
      intro={"Everything you might like to know before you say hello."}
      sections={[
        {
          title: "How do I order?",
          text: "Explore the shop, choose your options on a product page, and add one or more selections to your enquiry bag. Review quantities and the product subtotal, then send one WhatsApp enquiry or copy the summary for Instagram. You can also enquire about a single product directly. The owner confirms availability, final pricing, delivery, and payment in conversation. The website does not offer checkout or automatically confirm orders.",
        },
        {
          title: "Can you make something personal?",
          text: "Yes, we welcome custom ideas. Submit a custom request with your idea, colours, budget, and personalized text or design. The studio will confirm what is possible and provide a quote.",
        },
        {
          title: "What does \u201cFrom\u201d mean next to a price?",
          text: "It is a starting price. Changes to size, colours, arrangement, or design may affect the final amount. We confirm a quote before you finalize the order.",
        },
        {
          title: "Do you deliver across India?",
          text: "Yes. Charges depend on your location and the product. Preparation time and delivery estimates are confirmed directly before ordering.",
        },
        {
          title: "How do payments work?",
          text: "Advance payment is required for all orders. UPI and bank transfer are accepted. The owner confirms the full amount including delivery and explains the advance amount, deadline, and payment confirmation process. Never share a UPI PIN or banking password on this website.",
        },
        {
          title: "What if something arrives damaged or incorrect?",
          text: "Please contact the studio with the relevant order details and supporting photos. The owner will review the issue and confirm the appropriate remedy. General returns are not offered; applicable consumer rights remain unaffected.",
        },
        {
          title: "Can I ask about a sold-out piece?",
          text: "Of course. Use the restock enquiry action on its page to ask about restocking or made-to-order possibilities. Availability and timing must be confirmed.",
        },
        {
          title: "How should I care for handmade flowers?",
          text: "Keep chenille crafts dry and handle gently. Use a soft dry brush for dust. Ask us for care instructions specific to your chosen product, especially lamps or pieces containing food.",
        },
      ]}
    />
  );
}
