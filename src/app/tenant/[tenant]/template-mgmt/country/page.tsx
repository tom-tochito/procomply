import CountryManagement from "@/features/template-mgmt/components/CountryManagement";
import { initialCountries } from "@/data/template-mgmt/countries";

interface CountryPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function CountryPage({ params }: CountryPageProps) {
  await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CountryManagement initialCountries={initialCountries} />
      </div>
    </div>
  );
}