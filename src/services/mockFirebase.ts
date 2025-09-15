import { User, UserRole, University, Session, Attendance } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyA_o7mQC-KbyxK6iFZ28IrsvnGpzLw1L-0",
  authDomain: "unimark-ffb10.firebaseapp.com",
  projectId: "unimark-ffb10",
  storageBucket: "unimark-ffb10.appspot.com",
  messagingSenderId: "36244654330",
  appId: "1:36244654330:android:8cb694a5a34eb78147e143"
};

// Mock Data Storage
class MockDatabase {
  private users: User[] = [];
  private universities: University[] = [];
  private sessions: Session[] = [];
  private attendance: Attendance[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create sample universities
    this.universities = [
      {
        id: 'univ-1',
        name: 'Darshan University',
        domain: 'darshan.ac.in',
        adminEmail: 'admin@darshan.ac.in',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        studentsCount: 2500,
        facultyCount: 180,
        subscription: {
          plan: 'Premium',
          expiresAt: new Date('2025-01-15')
        }
      },
      {
        id: 'univ-2',
        name: 'Gujarat University',
        domain: 'gujaratuniversity.ac.in',
        adminEmail: 'admin@gujaratuniversity.ac.in',
        status: 'trial',
        createdAt: new Date('2024-11-01'),
        studentsCount: 1200,
        facultyCount: 85,
        subscription: {
          plan: 'Trial',
          expiresAt: new Date('2025-02-01')
        }
      },
      {
        id: 'univ-3',
        name: 'Nirma University',
        domain: 'nirmauni.ac.in',
        adminEmail: 'admin@nirmauni.ac.in',
        status: 'active',
        createdAt: new Date('2024-03-20'),
        studentsCount: 1800,
        facultyCount: 120,
        subscription: {
          plan: 'Standard',
          expiresAt: new Date('2025-03-20')
        }
      }
    ];

    // Create sample users
    this.users = [
      {
        id: 'super-admin-1',
        email: 'superadmin@unimark.com',
        role: 'super-admin' as UserRole,
        name: 'Super Administrator',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'admin-1',
        email: 'admin@darshan.ac.in',
        role: 'university-admin' as UserRole,
        name: 'Dr. Rajesh Patel',
        universityId: 'univ-1',
        universityName: 'Darshan University',
        createdAt: new Date('2024-01-16')
      },
      {
        id: 'faculty-1',
        email: 'prof.sharma@darshan.ac.in',
        role: 'faculty' as UserRole,
        name: 'Prof. Priya Sharma',
        universityId: 'univ-1',
        universityName: 'Darshan University',
        branch: 'Computer Engineering',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'student-1',
        email: 'student@darshan.ac.in',
        role: 'student' as UserRole,
        name: 'Rahul Patel',
        universityId: 'univ-1',
        universityName: 'Darshan University',
        branch: 'Computer Engineering',
        class: 'B.Tech',
        batch: '2022-2026',
        createdAt: new Date('2024-02-15')
      }
    ];

    // Create sample sessions
    this.sessions = [
      {
        id: 'session-1',
        facultyId: 'faculty-1',
        facultyName: 'Prof. Priya Sharma',
        universityId: 'univ-1',
        code: '123',
        title: 'Data Structures & Algorithms',
        branches: ['Computer Engineering'],
        classes: ['B.Tech'],
        batches: ['2022-2026'],
        location: {
          latitude: 23.0225,
          longitude: 72.5714
        },
        radius: 500,
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        isActive: true,
        attendanceCount: 45
      }
    ];
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  // Universities
  async getUniversities(): Promise<University[]> {
    return this.universities;
  }

  async createUniversity(universityData: Omit<University, 'id' | 'createdAt' | 'studentsCount' | 'facultyCount'>): Promise<University> {
    const university: University = {
      ...universityData,
      id: uuidv4(),
      createdAt: new Date(),
      studentsCount: 0,
      facultyCount: 0
    };
    this.universities.push(university);
    return university;
  }

  async updateUniversity(id: string, updates: Partial<University>): Promise<University | null> {
    const index = this.universities.findIndex(univ => univ.id === id);
    if (index === -1) return null;
    
    this.universities[index] = { ...this.universities[index], ...updates };
    return this.universities[index];
  }

  async deleteUniversity(id: string): Promise<boolean> {
    const index = this.universities.findIndex(univ => univ.id === id);
    if (index === -1) return false;
    
    this.universities.splice(index, 1);
    return true;
  }

  // Sessions
  async getSessions(universityId?: string): Promise<Session[]> {
    if (universityId) {
      return this.sessions.filter(session => session.universityId === universityId);
    }
    return this.sessions;
  }

  async createSession(sessionData: Omit<Session, 'id'>): Promise<Session> {
    const session: Session = {
      ...sessionData,
      id: uuidv4()
    };
    this.sessions.push(session);
    return session;
  }

  async getSessionByCode(code: string): Promise<Session | null> {
    return this.sessions.find(session => session.code === code && session.isActive) || null;
  }

  // Attendance
  async markAttendance(attendanceData: Omit<Attendance, 'id'>): Promise<Attendance> {
    const attendance: Attendance = {
      ...attendanceData,
      id: uuidv4()
    };
    this.attendance.push(attendance);
    
    // Update session attendance count
    const sessionIndex = this.sessions.findIndex(s => s.id === attendanceData.sessionId);
    if (sessionIndex !== -1) {
      this.sessions[sessionIndex].attendanceCount++;
    }
    
    return attendance;
  }

  async getAttendanceByStudent(studentId: string): Promise<Attendance[]> {
    return this.attendance.filter(att => att.studentId === studentId);
  }
}

// Mock Firebase Authentication
export class MockFirebaseAuth {
  private db = new MockDatabase();

  async signIn(credentials: { username: string; password: string; role: UserRole }): Promise<User> {
    const { username, password, role } = credentials;

    // Super Admin login
    if (role === 'super-admin') {
      if (username === 'SUPERADMIN' && password === 'SUPER9090@@@@') {
        return {
          id: 'super-admin-1',
          email: 'superadmin@unimark.com',
          role: 'super-admin',
          name: 'Super Administrator',
          createdAt: new Date()
        };
      }
      throw new Error('Invalid super admin credentials');
    }

    // Demo login for other roles
    const users = await this.db.getUsers();
    const user = users.find(u => u.role === role);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Simulate password validation (in real app, this would be secure)
    if (password.length < 4) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async signOut(): Promise<void> {
    // Mock sign out
  }
}

// Mock Firestore
export class MockFirestore {
  private db = new MockDatabase();

  // Universities collection
  universities() {
    return {
      get: () => this.db.getUniversities(),
      add: (data: any) => this.db.createUniversity(data),
      doc: (id: string) => ({
        update: (data: any) => this.db.updateUniversity(id, data),
        delete: () => this.db.deleteUniversity(id)
      })
    };
  }

  // Sessions collection
  sessions() {
    return {
      get: (universityId?: string) => this.db.getSessions(universityId),
      add: (data: any) => this.db.createSession(data),
      where: (field: string, operator: string, value: any) => ({
        get: () => {
          if (field === 'code' && operator === '==' && value) {
            return [this.db.getSessionByCode(value)].filter(Boolean);
          }
          return [];
        }
      })
    };
  }

  // Attendance collection
  attendance() {
    return {
      add: (data: any) => this.db.markAttendance(data),
      where: (field: string, operator: string, value: any) => ({
        get: () => {
          if (field === 'studentId' && operator === '==' && value) {
            return this.db.getAttendanceByStudent(value);
          }
          return [];
        }
      })
    };
  }
}

// Export mock instances
export const mockFirebaseAuth = new MockFirebaseAuth();
export const mockFirestore = new MockFirestore();

// Utility functions
export const generateSessionCode = (): string => {
  return Math.floor(100 + Math.random() * 900).toString();
};

export const hashPassword = async (password: string): Promise<string> => {
  // Simple hash simulation (use bcrypt in production)
  return btoa(password + 'salt');
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return btoa(password + 'salt') === hash;
};
