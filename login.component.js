import React from 'react';
import { SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { Button, Divider, Layout, TopNavigation, Icon, Input, Text, Card } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

const useInputState = (initialValue = '') => {
    const [value, setValue] = React.useState(initialValue);
    return { value, onChangeText: setValue };
};  

const AlertIcon = (props) => (
    <Icon {...props} name='alert-circle-outline'/>
);

const Header = (props) => (
    <View {...props}>
      <Text category='h6'>Log in</Text>
      <Text category='s1'>America Scores Attendance</Text>
    </View>
);

export const LogInScreen = ({ navigation }) => {
  const navigateDetails = () => navigation.navigate('Home');


  const loginInputState = useInputState();
  const secretInputState = useInputState();

  const [value, setValue] = React.useState('');

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const toggleSecureEntry = () => setSecureTextEntry(!secureTextEntry);
  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
    </TouchableWithoutFeedback>
  );
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title='America Scores' alignment='center'/>

        <Divider/>
        <Layout style={{flex: 1, justifyContent: "center", alignItems: 'center'}} level="4">
            <Layout style={{padding: '5%', width:'100%', height:'100%'}} level="4">
                <Card style={{flex: 1}} status="primary" header={Header}>
                    <Input
                    // style={styles.input}
                    status='primary'
                    label='Username'
                    placeholder='Username'
                    {...loginInputState}
                    />
                  <Input
                    status='primary'
                    label='Password'
                    placeholder='Password'
                    caption='Should contain at least 8 symbols'
                    accessoryRight={renderIcon}
                    captionIcon={AlertIcon}
                    secureTextEntry={secureTextEntry}
                    {...secretInputState}
                  />
                </Card>                

                <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Button style={{width:'100%'}} appearance="ghost" onPress={navigateDetails}>USE GOOGLE</Button>
                    <Button style={{width:'100%'}} appearance="ghost" onPress={navigateDetails}>USE FACEBOOK</Button>
                    <Button style={{width:'100%'}} onPress={navigateDetails}>LOG IN</Button>
                </Layout>            
            </Layout>   
        </Layout>
    </SafeAreaView>
  );
};

//style={styles.card} header={Header} footer={Footer}
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });