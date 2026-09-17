import { requireAuth } from "@/features/auth/actions";
import { DashboardShell } from "@/features/dashboard/componenets/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <DashboardShell user={session.user} plan="Pro">
      {children}
    </DashboardShell>
  );
}
