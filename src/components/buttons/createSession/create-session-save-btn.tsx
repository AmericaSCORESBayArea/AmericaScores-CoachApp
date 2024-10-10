import { Pressable, Text, View } from 'react-native';
import React from 'react';

interface SessionTypeSort {
  sessionType: number;
}

interface SessionTaskSort {
  sessionTask: number;
}

interface CreateSessionProps {
  typeItem: SessionTypeSort;
  taskItem: SessionTaskSort;
}

const CreateSessionSaveBtn: React.FC<CreateSessionProps> = ({
  typeItem,
  taskItem,
}) => {
  const isEnabled = typeItem.sessionType > 0 || taskItem.sessionTask > 0;

  return (
    <View className={'w-full items-center'}>
      <Pressable
        className={`mb-2 w-[90%] items-center justify-center rounded-md ${
          isEnabled ? 'bg-primary-700 py-3' : 'py-3'
        }`}
        disabled={!isEnabled}
      >
        <Text className={`text-${isEnabled ? 'white' : 'black'}`}>Save</Text>
      </Pressable>
      <Pressable
        className={`mb-2 w-[90%] items-center justify-center rounded-md ${
          isEnabled ? '' : 'bg-primary-700 py-3'
        }`}
      >
        <Text className={`text-${isEnabled ? 'black' : 'white'}`}>Cancel</Text>
      </Pressable>
    </View>
  );
};

export default CreateSessionSaveBtn;
