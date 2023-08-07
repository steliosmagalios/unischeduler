import { type TimetableSemester } from "@prisma/client";

export const TIMESLOTS = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
] as const;

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export type CurrentTimetable =
  | {
      tasks: {
        startTime: number;
        roomName: string;
        courseName: string;
        semester: number;
        lecture: {
          name: string;
          professor: string[];
          groups: string[];
          duration: number;
        };
      }[];
      id: number;
      name: string;
      semester: TimetableSemester;
      published: boolean;
      generated: boolean;
      createdAt: Date;
      updatedAt: Date;
    }
  | undefined;
