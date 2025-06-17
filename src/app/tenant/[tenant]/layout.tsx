import Header from "@/common/components/Header";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <main>{children}</main>
    </>
  );
}
