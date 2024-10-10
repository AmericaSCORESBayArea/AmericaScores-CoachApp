import { Pressable, Text, View } from 'react-native';
import React from 'react';
import { SoccerSVG } from '@/ui/icons/soccer';

interface SessionTypeSort {
  personalTaskType: number;
}

interface SessionTaskSort {
  personalTaskAddDetail: number;
}

interface CreateSessionProps {
  typeItem: SessionTypeSort;
  taskItem: SessionTaskSort;
}

const CreatePersonalCheckBalanceBtn: React.FC<CreateSessionProps> = ({
  typeItem,
  taskItem,
}) => {
  const isEnabled =
    typeItem.personalTaskType > 0 || taskItem.personalTaskAddDetail > 0;

  return (
    <View className={'w-full items-center'}>
      <Pressable
        className={`mb-2 w-[90%] flex-row items-center justify-center rounded-md ${
          isEnabled ? 'bg-primary-900 py-3' : 'py-3'
        }`}
        disabled={!isEnabled}
      >
        <SoccerSVG height={24} width={24} />
        <Text className={`text-${isEnabled ? 'white' : 'black'}`}>
          Check and Balance
        </Text>
      </Pressable>
    </View>
  );
};

export default CreatePersonalCheckBalanceBtn;
