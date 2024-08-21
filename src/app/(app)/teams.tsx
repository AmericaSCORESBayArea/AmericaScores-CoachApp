import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/ui';

export default function Teams() {
  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <Text className="text-center text-2xl font-bold">Teams</Text>
    </View>
  );
}
