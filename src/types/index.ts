export type UserRole = 'super-admin' | 'university-admin' | 'faculty' | 'student';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  universityId?: string;
  universityName?: string;
  branch?: string;
  class?: string;
  batch?: string;
  createdAt: Date;
}

export interface University {
  id: string;
  name: string;
  domain: string;
  adminEmail: string;
  status: 'active' | 'trial' | 'inactive';
  createdAt: Date;
  studentsCount: number;
  facultyCount: number;
  subscription: {
    plan: string;
    expiresAt: Date;
  };
}

export interface Session {
  id: string;
  facultyId: string;
  facultyName: string;
  universityId: string;
  code: string;
  title: string;
  branches: string[];
  classes: string[];
  batches: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  attendanceCount: number;
}

export interface Attendance {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  verified: boolean;
}

export interface Branch {
  id: string;
  name: string;
  universityId: string;
}

export interface Class {
  id: string;
  name: string;
  branchId: string;
  universityId: string;
}

export interface Batch {
  id: string;
  name: string;
  classId: string;
  year: number;
  universityId: string;
}
