import { Pressable, Text, View } from 'react-native';
import React from 'react';

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

const CreatePersonalTaskSaveBtn: React.FC<CreateSessionProps> = ({
  typeItem,
  taskItem,
}) => {
  const isEnabled =
    typeItem.personalTaskType > 0 || taskItem.personalTaskAddDetail > 0;

  return (
    <View>
      <Pressable
        className={`mx-6 mb-2 w-[90%] items-center justify-center rounded-md ${
          isEnabled ? 'bg-primary-700 py-3' : 'py-3'
        }`}
        disabled={!isEnabled}
      >
        <Text className={`text-${isEnabled ? 'white' : 'black'}`}>Save</Text>
      </Pressable>
      <Pressable
        className={`mx-6 mb-2 w-[90%] items-center justify-center rounded-md ${
          isEnabled ? '' : 'bg-primary-700 py-3'
        }`}
      >
        <Text className={`text-${isEnabled ? 'black' : 'white'}`}>Cancel</Text>
      </Pressable>
    </View>
  );
};

export default CreatePersonalTaskSaveBtn;
