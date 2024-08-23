import React, { useEffect, useState } from 'react';

import { FocusAwareStatusBar, Text, View } from '@/ui';
import { Axios } from 'axios';

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

  // const [studentList, setStudentList] = useState([]);

  // const fetchStudents = async () => {
  //   return await Axios.get(
  //     `${ApiConfig.dataApi}/coach/${user.user.ContactId}/teamseasons/${route.params.teamSeasonId}/enrollments`
  //   )
  //     .then((res) => {
  //       setStudentList(
  //         res.data.sort(
  //           (a, b) =>
  //             a.StudentName.split(' ')[1].toLowerCase() >
  //             b.StudentName.split(' ')[1].toLowerCase()
  //         )
  //       );
  //     })
  //     .catch((e) => console.log(e));
  // };

  // useEffect(() => {
  //   fetchStudents();
  // }, []);

  // async fetchStudents() {
  //   this.setState({ loadingModalstate: true });
  //   const { user } = this.props;
  //   const { route } = this.props;
  //   return await Axios.get(
  //     `${ApiConfig.dataApi}/coach/${user.user.ContactId}/teamseasons/${route.params.teamSeasonId}/enrollments`
  //   )
  //     .then((res) => {
  //       this.setState({
  //         studentList: res.data.sort(
  //           (a, b) =>
  //             a.StudentName.split(" ")[1].toLowerCase() >
  //             b.StudentName.split(" ")[1].toLowerCase()
  //         ),
  //         loadingModalstate: false,
  //       });
  //     })
  //     .catch((e) => console.log(e));
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
