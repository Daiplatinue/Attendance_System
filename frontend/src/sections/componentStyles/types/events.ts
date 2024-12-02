export interface Event {
    id: string;
    name: string;
    type: string;
    location: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    status: string;
    departments: string[];
    organizer: string;
    description: string;
    avatarUrl?: string;
  }