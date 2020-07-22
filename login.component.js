import React from 'react';
import { SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { Button, Divider, Layout, TopNavigation, Icon, Input, Text, Card } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import Axios from 'axios';
import { ApiConfig } from './src/config/ApiConfig';
import { firebase } from "./src/config/FirebaseConfig";

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

const GoogleIcon = (props) => ( <Icon {...props} name='google-outline'/> );
const PhoneIcon = (props) => ( <Icon {...props} name='phone-outline'/> );
const WhatsAppIcon = (props) => ( <Icon {...props} name='message-circle-outline'/> )

export const LogInScreen = ({ navigation }) => {
  const navigateDetails = async () => {
    await Axios.get(ApiConfig.baseUrl + `/auth/login`, {
      params: {
        useridentifier: 'test@gmail.com',
        serviceprovider: 'google'
      }
    })
    .then(res => {
      if (res.status === 200) console.log("Success!", res.data)
      else console.log(res);
    })
    .catch(e => console.log(e));
    return navigation.navigate('HomeRoot');
  }

  const loginInputState = useInputState();
  const secretInputState = useInputState();

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const toggleSecureEntry = () => setSecureTextEntry(!secureTextEntry);
  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
    </TouchableWithoutFeedback>
  );

  //Auth
  // If null, no SMS has been sent
  const [confirm, setConfirm] = React.useState(null);
  const [code, setCode] = React.useState('+54 358 6022 629');

  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  const recaptchaVerifier = React.useRef(null);

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {

    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    const verificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier.current
    );
    console.log(verificationId)
  }


  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }


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
            </Card>                

            <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Button style={{width:'100%'}} accessoryLeft={PhoneIcon} appearance="ghost" status="primary" onPress={() => signInWithPhoneNumber('+54 358 6022 629')}>SIGN IN WITH PHONE</Button>
              <Button style={{width:'100%'}} accessoryLeft={GoogleIcon} appearance="ghost" status="danger" onPress={navigateDetails}>GOOGLE</Button>
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