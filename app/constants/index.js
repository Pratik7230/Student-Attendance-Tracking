import {
  GraduationCap,
  Hand,
  LayoutIcon,
  Settings,
  StickyNote,
} from 'lucide-react';

export const ROLE_IDS = {
  ADMIN: 1,
  TEACHER: 2,
  STUDENT: 3,
};

export const ROLE_NAMES = {
  1: 'Admin',
  2: 'Teacher',
  3: 'Student',
};

export const NAVIGATION_ROUTES = [
  {
    id: 1,
    name: 'Admin Dashboard',
    icon: LayoutIcon,
    path: '/dashboard/admin',
  },
  {
    id: 2,
    name: 'Students',
    icon: GraduationCap,
    path: '/dashboard/students',
  },
  {
    id: 3,
    name: 'Attendance',
    icon: Hand,
    path: '/dashboard/attendance',
  },

  {
    id: 4,
    name: 'Report Generate',
    icon: StickyNote,
    path: '/dashboard/GenerateReport',
  },
  {
    id: 5,
    name: 'Teacher Dashboard',
    icon: LayoutIcon,
    path: '/dashboard/teacher',
  },
  {
    id: 6,
    name: 'Student Dashboard',
    icon: LayoutIcon,
    path: '/dashboard/StudentView',
  },
  {
    id: 7,
    name: 'Settings',
    icon: Settings,
    path: '/dashboard/settings',
  },
];

export const ROUTE_ACCESS = {
  [ROLE_IDS.ADMIN]: [1, 2, 7],
  [ROLE_IDS.TEACHER]: [5, 3, 4, 7],
  [ROLE_IDS.STUDENT]: [6, 7],
};
