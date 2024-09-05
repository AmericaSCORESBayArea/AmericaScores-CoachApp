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

type studentRecordType = {
  id: number;
  name: string;
  attendence: string;
  image: string;
  notes: string;
};
type takeAttendenceType = {
  id: number;
  name: string;
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
  // {
  //   id: 1,
  //   title: 'Developer Test Soccer Poets',
  //   location: 'Albhany High',
  //   time: '12:00 PM',
  //   hobby: ['Soccer', 'Poetry'],
  // },
  {
    id: 1,
    title: 'Take Attendance',
    location: 'Albhany High',
    time: '12:00 PM',
    hobby: ['Soccer', 'Poetry'],
  },
  {
    id: 2,
    title: 'Record Video',
    location: 'Albhany High',
    time: '12:00 PM',
    hobby: ['Soccer', 'Poetry'],
  },
  {
    id: 3,
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

export const studentRecordData: studentRecordType[] = [
  {
    id: 1,
    name: 'Little Joe smith Alias Johnson',
    attendence: 'Attended',
    image: 'Photo',
    notes: 'Survey/Notes',
  },
  {
    id: 2,
    name: 'Fast Thomas Running Passer',
    attendence: 'Absent',
    image: 'Photo',
    notes: 'Survey/Notes',
  },
  {
    id: 3,
    name: 'Little Joe smith Alias Johnson',
    attendence: 'Absent',
    image: 'Photo',
    notes: 'Survey/Notes',
  },
  {
    id: 4,
    name: 'Little Joe smith Alias Johnson',
    attendence: 'Attended',
    image: 'Photo',
    notes: 'Survey/Notes',
  },
];
export const takeAttendence: takeAttendenceType[] = [
  {
    id: 1,
    name: 'Little Joe smith Alias Johnson',
  },
  {
    id: 2,
    name: 'Fast Thomas Running Passer',
  },
  {
    id: 3,
    name: 'John Joe smith Alias Johnson',
  },
  {
    id: 4,
    name: 'Andrew Joe smith Alias Johnson',
  },
  {
    id: 5,
    name: 'Michael Fast Runner Smith',
  },
  {
    id: 6,
    name: 'Sally Quick Hands Johnson',
  },
  {
    id: 7,
    name: 'Jessica Long Legs Thomas',
  },
  {
    id: 8,
    name: 'Paul Short Smith Alias Johnson',
  },
  {
    id: 9,
    name: 'Tina Speedy Thomas',
  },
  {
    id: 10,
    name: 'George Joe smith Alias Johnson',
  },
  {
    id: 11,
    name: 'Rebecca Fleet Runner',
  },
  {
    id: 12,
    name: 'Samuel Sharp Eyes Johnson',
  },
  {
    id: 13,
    name: 'Nancy Quick Feet Smith',
  },
  {
    id: 14,
    name: 'Harry Fast Fingers Thomas',
  },
  {
    id: 15,
    name: 'Betty Quick Runner Johnson',
  },
];
