type sessionType = {
  id: number;
  title: string;
  location: string;
  time: string;
  hobby: string[];
};
type taskype = {
  id: number;
  title: string;
  date: string;
  time: string;
  subTitle1: string;
  subTitle2: string;
  subTitle3: string;
};
type soonTaskType = {
  id: number;
  title: string;
  location: string;
  date: string;
};
type weekTaskType = {
  id: number;
  title: string;
  location: string;
  date: string;
};
type laterTaskType = {
  id: number;
  title: string;
  location: string;
  date: string;
};
type pastSessionType = {
  id: number;
  title: string;
  location: string;
  time: string;

  attendence: string;
  hobby: string[];
};
export const sessionSingleData: sessionType[] = [
  {
    id: 1,
    title: 'Developer Test Soccer Poets',
    location: 'Albhany High',
    time: '12:00 PM',
    hobby: ['Soccer', 'Poetry'],
  },
];
export const sessionData: sessionType[] = [
  {
    id: 1,
    title: 'Developer Test Soccer Poets',
    location: 'Albhany High',
    time: '12:00 PM',
    hobby: ['Soccer', 'Poetry'],
  },
  {
    id: 2,
    title: 'Take Attendance',
    location: 'Albhany High',
    time: '12:00 PM',
    hobby: ['Soccer', 'Poetry'],
  },
  {
    id: 3,
    title: 'Record Video',
    location: 'Albhany High',
    time: '12:00 PM',
    hobby: ['Soccer', 'Poetry'],
  },
  {
    id: 4,
    title: 'Record Pacer Score',
    location: 'Albhany High',
    time: '12:00 PM',
    hobby: ['Soccer', 'Poetry'],
  },
];
export const taskData: taskype[] = [
  {
    id: 1,
    title: 'Developer Test Soccer Poets',
    date: '12/08/24',
    time: '12:00 PM',
    subTitle1: 'Take Attendence',
    subTitle2: 'Take Attendence',
    subTitle3: 'Record video',
  },
  {
    id: 2,
    title: 'Take Attendance',
    date: '12/08/24',
    time: '12:00 PM',
    subTitle1: 'Take Attendence',
    subTitle2: 'Take Attendence',
    subTitle3: 'Record video',
  },
  {
    id: 3,
    title: 'Record Video',
    date: '12/08/24',
    time: '12:00 PM',
    subTitle1: 'Take Attendence',
    subTitle2: 'Take Attendence',
    subTitle3: 'Record video',
  },
  {
    id: 4,
    title: 'Record Pacer Score',
    date: '12/08/24',
    time: '12:00 PM',
    subTitle1: 'Take Attendence',
    subTitle2: 'Take Attendence',
    subTitle3: 'Record video',
  },
];

export const soonTaskData: soonTaskType[] = [
  {
    id: 1,
    title: 'Take Attendance',
    location: 'Albhany High',
    date: '2024/08/12',
  },
  {
    id: 2,
    title: 'Record a video',
    location: 'Albhany High',
    date: '2024/08/12',
  },
  {
    id: 3,
    title: 'Record Pacer Score',
    location: 'Albhany High',
    date: '2024/08/12',
  },
  {
    id: 4,
    title: 'Record Pacer Score',
    location: 'Albhany High',
    date: '2024/08/12',
  },
];

export const weekTaskData: weekTaskType[] = [
  {
    id: 1,
    title: 'Take Attendance',
    location: 'Albhany High',
    date: '2024/08/12',
  },
  {
    id: 2,
    title: 'Record a video',
    location: 'Albhany High',
    date: '2024/08/12',
  },
  {
    id: 3,
    title: 'Record Pacer Score',
    location: 'Albhany High',
    date: '2024/08/12',
  },
  {
    id: 4,
    title: 'Record Pacer Score',
    location: 'Albhany High',
    date: '2024/08/12',
  },
];

export const laterTaskData: laterTaskType[] = [
  {
    id: 1,
    title: 'Take Attendance',
    location: 'Albhany High',
    date: '2024/08/12',
  },
  {
    id: 2,
    title: 'Record a video',
    location: 'Albhany High',
    date: '2024/08/12',
  },
  {
    id: 3,
    title: 'Record Pacer Score',
    location: 'Albhany High',
    date: '2024/08/12',
  },
  {
    id: 4,
    title: 'Record Pacer Score',
    location: 'Albhany High',
    date: '2024/08/12',
  },
];
export const pastSessionData: pastSessionType[] = [
  {
    id: 1,
    title: 'Take Attendance',
    location: 'Albhany High',
    time: '12:00 PM',
    attendence: '12/24',
    hobby: ['Soccer', 'Poetry'],
  },
  {
    id: 2,
    title: 'Record a video',
    location: 'Albhany High',
    time: '12:00 PM',
    attendence: '12/24',
    hobby: ['Soccer', 'Poetry'],
  },
  {
    id: 3,
    title: 'Record Pacer Score',
    location: 'Albhany High',
    time: '12:00 PM',
    attendence: '12/24',
    hobby: ['Soccer', 'Poetry'],
  },
  {
    id: 4,
    title: 'Record Pacer Score',
    location: 'Albhany High',
    time: '12:00 PM',
    attendence: '12/24',
    hobby: ['Soccer', 'Poetry'],
  },
];
