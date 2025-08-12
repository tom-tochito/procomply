"use client";

interface Person {
  id: number;
  name: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  phoneMobile?: string;
}

interface PersonCardProps {
  person: Person;
}

export default function PersonCard({ person }: PersonCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 font-medium">
            {person.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">{person.name}</div>
            {person.role && (
              <div className="text-sm text-gray-500 truncate">{person.role}</div>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="text-gray-700 truncate">{person.company || "—"}</span>
          </div>

          {person.email && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a 
                href={`mailto:${person.email}`}
                className="text-blue-600 hover:text-blue-800 truncate"
              >
                {person.email}
              </a>
            </div>
          )}

          {person.phone && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a 
                href={`tel:${person.phone}`}
                className="text-gray-700 hover:text-gray-900"
              >
                {person.phone}
              </a>
            </div>
          )}

          {person.phoneMobile && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <a 
                href={`tel:${person.phoneMobile}`}
                className="text-gray-700 hover:text-gray-900"
              >
                {person.phoneMobile}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}