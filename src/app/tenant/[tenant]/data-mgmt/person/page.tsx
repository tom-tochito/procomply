import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import PersonManagement from "@/features/data-mgmt/components/PersonManagement";

const mockPersons = [
  {
    id: 1,
    name: "Adrian Williams",
    company: "ASAP Comply",
    role: "Fire Risk Assessor",
    email: "adrian.williams@asapcomply.com",
    phone: "07542 823191",
    phoneMobile: "07824 618 767",
  },
  {
    id: 2,
    name: "Alexa Byrne",
    company: "Akelius",
    role: "Branch Manager - Kensington",
    email: "alexa.byrne@akelius.co.uk",
    phone: "020 7870 9641 x1002",
  },
  {
    id: 3,
    name: "Alexandra Walker",
    company: "Akelius Residential Ltd",
    role: "Head of Branch (Hampstead)",
    email: "alexandra.walker@akelius.co.uk",
    phone: "0800 014 8579",
  },
  {
    id: 4,
    name: "Alison Kelly",
    company: "ASAP Comply",
    role: "CEO",
    email: "alison.kelly@asapcomply.com",
    phone: "0151 363 2333",
  },
  {
    id: 5,
    name: "Andrew Speller",
    company: "Akelius",
    email: "andrew.speller@akelius.co.uk",
    phone: "020 3758 8353 x1013",
    phoneMobile: "07584 291 600",
  },
  {
    id: 6,
    name: "Atikah Zarar",
    company: "Akelius",
    role: "Property Administrator",
    email: "atikah.zarar@akelius.co.uk",
  },
  {
    id: 7,
    name: "Chris Tullick",
    company: "Akelius",
    role: "Property Manager",
    email: "chris.tullick@akelius.co.uk",
    phone: "07935 756430",
  },
  {
    id: 8,
    name: "Cristina Parker",
    company: "Akelius",
    role: "Branch Manager (Ealing)",
    email: "cristina.avram@akelius.co.uk",
    phone: "020 3758 8354 x1014",
    phoneMobile: "07788 247002",
  },
  {
    id: 9,
    name: "Diana Porim",
    company: "Akelius",
    role: "Property Manager (Ealing)",
    email: "diana.porim@akelius.co.uk",
    phone: "07587 610592",
  },
  {
    id: 10,
    name: "Francesca D'Souza",
    company: "Akelius",
    role: "Property Administrator (Camden)",
    email: "francesca.d'souza@akelius.co.uk",
    phone: "07741659351",
  },
  {
    id: 11,
    name: "Gary Bryan",
    company: "ASAP Comply",
    role: "Forensic Risk Assessor",
    email: "gary.brya@asapcomply.com",
    phone: "0151 363 2333",
    phoneMobile: "07796 619770",
  },
  {
    id: 12,
    name: "Hyrije Taipi",
    company: "Akelius",
    role: "Property Manager Hampstead",
    email: "Hyrije.Taipi@akelius.co.uk",
  },
];

interface PersonPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { tenant } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Person
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link
              href={generateTenantRedirectUrl(tenant, "/data-mgmt")}
              className="hover:text-blue-600"
            >
              <span>Data Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Person</span>
          </div>
        </div>

        <PersonManagement initialPersons={mockPersons} tenant={tenant} />
      </div>
    </div>
  );
}
