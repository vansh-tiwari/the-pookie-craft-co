import { InformationPage } from "@/components/common/InformationPage";
export const metadata = {
  title: "Returns & replacements",
  description: "If something isn\u2019t right, please talk to us.",
  alternates: { canonical: "/returns" },
};
export default function Page() {
  return (
    <InformationPage
      title={"Returns & replacements"}
      intro={"If something isn\u2019t right, please talk to us."}
      sections={[
        {
          title: "General returns",
          text: "We do not offer general returns or change-of-mind returns. This policy does not limit any applicable statutory consumer rights or mandatory protections.",
        },
        {
          title: "Damaged or incorrect items",
          text: "Contact the studio if your item arrives damaged or is different from what was agreed. Provide your order details and relevant supporting photos so the issue can be reviewed.",
        },
        {
          title: "Review and resolution",
          text: "The owner will review the information and confirm whether a replacement or another remedy is appropriate. This page does not promise automatic refunds or replacements, and it does not exclude remedies required by applicable law.",
        },
        {
          title: "Contacting the studio",
          text: "Please get in touch through the contact page as soon as you notice the issue. The practical reporting and replacement steps will be explained directly; no unconfirmed reporting deadline is imposed here.",
        },
      ]}
    />
  );
}
