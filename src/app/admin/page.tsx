import { loggedIn } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { getRequests } from "@/lib/requests";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { OwnerLogin } from "@/components/admin/OwnerLogin";
export const metadata = {
  title: "Owner studio",
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  if (!(await loggedIn())) return <OwnerLogin />;
  const catalog = await getCatalog();
  return (
    <AdminDashboard initial={catalog} initialRequests={await getRequests()} />
  );
}
