import { TENANTS } from "@/data/tenants";
import { ROOT_DOMAIN, PROTOCOL } from "@/constants";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-[#F30] mb-12">Our Tenants</h1>
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl">
        {TENANTS.map((tenant) => (
          <a
            key={tenant.id}
            href={
              ROOT_DOMAIN.includes('.vercel.app')
                ? `${PROTOCOL}://${tenant.id}---${ROOT_DOMAIN}`
                : `${PROTOCOL}://${tenant.id}.${ROOT_DOMAIN}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-lg shadow-lg p-6 aspect-[4/3] flex flex-col items-center justify-center w-[20rem] transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 transform"
          >
            <h2 className="text-2xl font-semibold text-gray-700 text-center group-hover:text-[#F30] transition-colors duration-300">{tenant.name}</h2>
          </a>
        ))}
      </div>
    </div>
  );
}
