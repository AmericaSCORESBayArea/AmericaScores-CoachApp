import { Checkbox, CheckboxIcon, colors } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SoccerSVG } from '@/ui/icons/soccer';
import { PoetrySVG } from '@/ui/icons/poety';
import { GameDaySVG } from '@/ui/icons/game-day';
import { TakeAttendenceSVG } from '@/ui/icons/take-attendence';
import { RecordVideoSVG } from '@/ui/icons/record-video';
import { RecordPacerSVG } from '@/ui/icons/record-pacer';

interface CreatePersonalAddDetailType {
  id: number;
  name: string;
  // icon: string;
}

interface CreatePersonalAddDetailProps {
  item: CreatePersonalAddDetailType;
  setPersonalTaskAddDetail: React.Dispatch<React.SetStateAction<number>>; // Function to update attendance count
}

const CreatePersonalAddDetail: React.FC<CreatePersonalAddDetailProps> = ({
  item,
  setPersonalTaskAddDetail,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleToggle = () => {
    setChecked((prevChecked) => {
      const newChecked = !prevChecked;
      setPersonalTaskAddDetail(
        (prevCount) => prevCount + (newChecked ? 1 : -1)
      ); // Increment or decrement the count
      return newChecked;
    });
  };

  return (
    <View className="w-full flex-row rounded-sm bg-white p-4">
      <Checkbox.Root
        onChange={handleToggle}
        accessibilityLabel={`Toggle attendance for ${item.name}`}
        checked={checked}
      >
        <Checkbox.Icon checked={checked} />
        {/* {item.icon === 'TakeAttendence' && (
          <TakeAttendenceSVG height={24} width={24} />
        )}
        {item.icon === 'RecordVideo' && (
          <RecordVideoSVG height={24} width={24} />
        )}
        {item.icon === 'RecordPacer' && (
          <RecordPacerSVG height={24} width={24} />
        )} */}

        <Checkbox.Label text={item.name} />
      </Checkbox.Root>
    </View>
  );
};

export default CreatePersonalAddDetail;
