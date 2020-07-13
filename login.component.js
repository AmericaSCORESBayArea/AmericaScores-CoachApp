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

const GoogleIcon = (props) => (
  <Icon {...props} name='google-outline'/>
);

const FacebookIcon = (props) => (
  <Icon {...props} name='facebook-outline'/>
);

const WhatsAppIcon = (props) => (
  <Icon {...props} name='message-circle-outline'/>
)

export const LogInScreen = ({ navigation }) => {
  const navigateDetails = () => navigation.navigate('HomeRoot');

  const loginInputState = useInputState();
  const secretInputState = useInputState();

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const toggleSecureEntry = () => setSecureTextEntry(!secureTextEntry);
  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
    </TouchableWithoutFeedback>
  );
  
  return (
    <Layout style={{flex: 1}} level="4">
      <SafeAreaView forceInset={{ top: 'always', bottom: 'never' }} style={{ flex: 1}}>
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
              <Button style={{width:'100%'}} accessoryLeft={GoogleIcon} appearance="ghost" status="danger" onPress={navigateDetails}>GOOGLE</Button>
              <Button style={{width:'100%'}} accessoryLeft={FacebookIcon} appearance="ghost" status="info" onPress={navigateDetails}>FACEBOOK</Button>
              <Button style={{width:'100%'}} accessoryLeft={WhatsAppIcon} appearance="ghost" status="success" onPress={navigateDetails}>WHATSAPP</Button>
              <Button style={{width:'100%'}} onPress={navigateDetails}>LOG IN</Button>
            </Layout>            
          </Layout>   
        </Layout>
      </SafeAreaView>
    </Layout>
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