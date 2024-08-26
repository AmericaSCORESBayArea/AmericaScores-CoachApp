import React, { useEffect, useState } from 'react';

import { FocusAwareStatusBar, Text, View } from '@/ui';
import { Axios } from 'axios';
import { getStudent } from '@/api';

export default function Feed() {
  const { data, isPending, isError } = getStudent();

  useEffect(() => {
    if (isError) {
      console.error('Error Loading data');
    }
    if (isPending) {
      console.log('Loading data');
    }
  }, [isError, isPending]);
  console.log('data', data);

  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />

      <Text className="text-center text-2xl font-bold">Home</Text>
      {/* <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        estimatedItemSize={300}
      /> */}
    </View>
  );
}
