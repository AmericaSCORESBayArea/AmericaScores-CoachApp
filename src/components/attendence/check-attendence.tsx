import type { GetAttendance } from '@/interfaces/entities/attendance/attendance-entities';
import typography from '@/metrics/typography';
import { Checkbox } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { Text, View } from 'react-native';

interface TakeAttendenceProps {
  item: GetAttendance;
  setAttendenceCount: React.Dispatch<React.SetStateAction<number>>; // Function to update attendance count
  setStudentsAttendanceMark: React.Dispatch<
    React.SetStateAction<{ AttendanceId: string; Attended: boolean }[]>
  >;
}

const CheckAttendence: React.FC<TakeAttendenceProps> = ({
  item,
  setAttendenceCount,
  setStudentsAttendanceMark,
}) => {
  // Determine initial checked state based on the item's Attended value
  const initialChecked = item.Attended.toLowerCase() === 'true';
  const [checked, setChecked] = useState<boolean>(initialChecked);

  const handleToggle = () => {
    setChecked((prevChecked) => {
      const newChecked = !prevChecked; // Toggle checked state

      // Always increase attendance count when checked
      console.log('newCheck :  ', newChecked);

      if (newChecked || !newChecked) {
        setAttendenceCount((prevCount) => prevCount + 1); // Increase count
      }
      // Update studentsAttendanceMark directly here
      setStudentsAttendanceMark((prev) => {
        const existingStudentIndex = prev.findIndex(
          (student) => student.AttendanceId === item.AttendanceId
        );

        if (existingStudentIndex !== -1) {
          // If the student is already in the array, update their Attended status
          const updatedAttendance = [...prev];
          updatedAttendance[existingStudentIndex].Attended = newChecked;
          return updatedAttendance;
        } else {
          // If the student is not in the array, add them
          return [
            ...prev,
            { AttendanceId: item.AttendanceId, Attended: newChecked },
          ];
        }
      });

      return newChecked;
    });
  };

  console.log('Item Attended: ', item.Attended);
  console.log('Checked state: ', checked);

  return (
    <View className="w-full rounded-sm bg-white p-4">
      <Checkbox
        checked={checked} // Ensure checked is a boolean
        onChange={handleToggle}
        label={item.StudentName}
        accessibilityLabel={`Toggle attendance for ${item.StudentName}`}
      />
    </View>
  );
};

export default CheckAttendence;
