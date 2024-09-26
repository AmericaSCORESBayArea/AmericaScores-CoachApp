import React from 'react';

import { FocusAwareStatusBar, Pressable, Text, View } from '@/ui';
import { removeItem } from '@/core/storage';
import { router } from 'expo-router';

export default function Profile() {
  const removeUser = async () => {
    await removeItem('user');
    router.push('/login');
  };

  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <Pressable onPress={removeUser}>
        <Text className="my-10 text-center text-2xl font-bold text-[#0b274f] ">
          Logout User
        </Text>
      </Pressable>
    </View>
  );
}
