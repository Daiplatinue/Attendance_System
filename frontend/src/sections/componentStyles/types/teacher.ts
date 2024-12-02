export interface Student {
  id: string;
  name: string;
  dropped: boolean;
}

export interface Section {
  id: string;
  name: string;
  schedule: string;
  students: Student[];
}

export interface Subject {
  id: number;
  name: string;
  sections: Section[];
}