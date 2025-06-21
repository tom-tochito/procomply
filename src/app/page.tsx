import { findAllTenants } from "@/features/tenant/repository/tenant.repository";
import { ROOT_DOMAIN, PROTOCOL } from "@/constants";

export default async function Page() {
  const tenants = await findAllTenants();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Procomply</h1>
        <p className="text-xl text-gray-600">
          Select your organization to continue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full px-4">
        {tenants.map((tenant) => (
          <a
            key={tenant.id}
            href={`${PROTOCOL}://${ROOT_DOMAIN}/tenant/${tenant.slug}/login`}
            className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F30] to-[#ff6b6b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

            <div className="p-8 flex flex-col items-center justify-center h-48">
              <div className="w-16 h-16 bg-[#F30] bg-opacity-10 rounded-full flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-[#F30]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 text-center group-hover:text-[#F30] transition-colors duration-300">
                {tenant.name}
              </h2>

              {tenant.description && (
                <p className="text-sm text-gray-500 text-center mt-2 line-clamp-2">
                  {tenant.description}
                </p>
              )}
            </div>

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-5 h-5 text-[#F30]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {tenants.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-600">
            No organizations available at this time.
          </p>
        </div>
      )}
    </div>
  );
}
