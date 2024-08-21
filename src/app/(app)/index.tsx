import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/ui';

export default function Feed() {
  // const { data, isPending, isError } = usePosts();
  // const renderItem = React.useCallback(
  //   ({ item }: { item: Post }) => <Card {...item} />,
  //   []
  // );

  // if (isError) {
  //   return (
  //     <View>
  //       <Text> Error Loading data </Text>
  //     </View>
  //   );
  // }
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
