import { reqireAuth } from "@/features/auth/actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await reqireAuth();
  return <div className="min-h-svh">{children}</div>;
}
