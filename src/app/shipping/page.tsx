import { InformationPage } from "@/components/common/InformationPage";
export const metadata = {
  title: "Shipping & delivery",
  description: "A little handmade happiness, delivered across India.",
  alternates: { canonical: "/shipping" },
};
export default function Page() {
  return (
    <InformationPage
      title={"Shipping & delivery"}
      intro={"A little handmade happiness, delivered across India."}
      sections={[
        {
          title: "Where we deliver",
          text: "We deliver across India. Please share your delivery location in your conversation with the studio so serviceability can be confirmed.",
        },
        {
          title: "Shipping charges",
          text: "Charges depend on your location and the product. The owner confirms the complete order amount, including delivery, before requesting advance payment. No fixed delivery charge or free-shipping threshold is promised on this website.",
        },
        {
          title: "Preparation and delivery time",
          text: "Timing depends on the product, customization, and delivery location. The owner will confirm the estimate before the order is finalized. Made-to-order products need preparation time; a listing is not a guaranteed dispatch date.",
        },
        {
          title: "Payments and updates",
          text: "UPI and bank transfer are accepted. Advance payment is required for all orders. The exact advance amount or percentage, deadline, and process for sharing payment proof will be agreed directly. Updates are shared manually through WhatsApp or Instagram.",
        },
      ]}
    />
  );
}
