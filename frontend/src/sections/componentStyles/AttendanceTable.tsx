import { AttendanceRecord, SectionSchedule } from '@/sections/componentStyles/types/attendance';
import { formatTimestamp, isValidTimestamp } from '@/sections/componentStyles/types/dateUtils';
import { getAttendanceStatus } from '@/sections/componentStyles/types/dateUtils/attendance';

interface AttendanceTableProps {
  data: AttendanceRecord[];
  schedule: SectionSchedule;
}

export function AttendanceTable({ data, schedule }: AttendanceTableProps) {
  const sanitizeName = (name: string): string => {
    return name ? name.replace(/[0-9]/g, '').trim() || 'N/A' : 'N/A';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Present':
        return 'text-green-400';
      case 'Late':
        return 'text-yellow-400';
      case 'Very Late':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="relative overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-white/5">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium text-gray-400">Timestamp</th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-400">Name</th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-400">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {data.map((record, index) => {
            const timestamp = new Date(record.timestamp);
            const status = getAttendanceStatus(timestamp, schedule);
            
            return (
              <tr key={index} className="bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={!isValidTimestamp(record.timestamp) ? "text-yellow-500" : ""}>
                    {formatTimestamp(record.timestamp)}
                  </span>
                </td>
                <td className="px-6 py-4">{sanitizeName(record.name)}</td>
                <td className={`px-6 py-4 ${getStatusColor(status)}`}>
                  {status}
                </td>
              </tr>
            );
          })}
          {data.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                No attendance records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}