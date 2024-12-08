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
  id: string;
  name: string;
  sections: Section[];
}