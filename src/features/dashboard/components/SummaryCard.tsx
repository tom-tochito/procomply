interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  accentColor: string;
}

export default function SummaryCard({ title, value, subtitle, accentColor }: SummaryCardProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${accentColor} hover:shadow-md transition-shadow`}>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}