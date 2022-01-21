import React, {useEffect,useCallback} from 'react';
import { Modal, Card, Text, Button, Layout, Input, Select, SelectItem, Icon, Spinner  } from '@ui-kitten/components';
import { ImageBackground,Keyboard, ScrollView, Alert, Dimensions, Image } from 'react-native';
//import DocumentPicker from "react-native-document-picker";
import {launchImageLibrary} from 'react-native-image-picker'; // Migration from 2.x.x to 3.x.x => showImagePicker API is removed.
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ApiConfig } from '../config/ApiConfig';
import DeviceInfo from 'react-native-device-info';

export const CreateReportModal = ({navigation}) => {
    const useInputState = (initialValue = '') => {
        const [descriptionvalue, setDescriptionValue] = React.useState(initialValue);
        return { descriptionvalue, onChangeText: setDescriptionValue};
      };
    const data = [
        'Report a problem',
        'Suggest an improvement',
        'Ask a question'
    ]
    const [visible, setVisible] = React.useState(true);
    const multilineInputState = useInputState();
    const [responseStatusModal, setResponseStatusModal] = React.useState(false);
    const [reponseStatusUnsuccessModal,setReponseStatusUnsuccessModal] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState();
    const [displayedValue, setDisplayedValue] = React.useState(data[0]);
    const [keyboardSize, setKeyboardSize] = React.useState(0);
    const [uploadUrl, setUploadUrl] = React.useState(null);
    const [url,setUrl] = React.useState('');
    const [submit, setSubmit] = React.useState(false);

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardSize(e.endCoordinates.height)
        })

        Keyboard.addListener("keyboardDidHide", (e) => {
            setKeyboardSize(e.endCoordinates.height)
        })

        return (() => {
            Keyboard.removeAllListeners("keyboardDidShow");
            Keyboard.removeAllListeners("keyboardDidHide");
        })
    }, [])
    useEffect(() => {
        console.log(url)
        if(url !== undefined && url.length !== 0){
            setSubmit(true);
            postMessageToChannelWithImage();
        }
    }, [url]);
    const message=
        { 
            'Content-type': 'application/json',
                "blocks": [
                    {
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": "*Coach Name*"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "*Option*"
                            },
                            {
                                "type": "plain_text",
                                "text": useSelector(state => state.user.user.FirstName) + " " + useSelector(state => state.user.user.LastName)
                            },
                            {
                                "type": "plain_text",
                                "text": displayedValue
                            }
                        ],
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text":  "*Message:* " + " " + multilineInputState.descriptionvalue,
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text":  "Sent From: " + " " + DeviceInfo.getSystemName() + " " + DeviceInfo.getSystemVersion(),
                        },
                    },
                    {
                        "type": "divider",
                        "block_id": "divider1"
                    },
                ]
        }
    const messagewithImage= {
        'Content-type': 'application/json',
        "blocks": [
            {
                "type": "divider",
                "block_id": "divider1"
            },
            {
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": "*Coach Name*"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*Option*"
                    },
                    {
                        "type": "plain_text",
                        "text": useSelector(state => state.user.user.FirstName) + " " + useSelector(state => state.user.user.LastName)
                    },
                    {
                        "type": "plain_text",
                        "text": displayedValue
                    }
                ],
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text":  "*Message:* " + " " + multilineInputState.descriptionvalue,
                }
            },{
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text":  "*ImageURL:* " + " " + url,
                },
                "accessory": {
                    "type": "image",
                    "image_url": url,
                    "alt_text": url
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text":  "Sent From: " + " " + DeviceInfo.getSystemName() + " " + DeviceInfo.getSystemVersion(),
                },
            },
            {
                "type": "divider",
                "block_id": "divider2"
            },
        ]
    }
    const postMessageToChannel = () => {axios.post(ApiConfig.slackWebHook,message)
    .then(function (response) {
        console.log(response)
        closeModal();
      })
      .catch(function (error) {
        console.log(error);
        setVisible(false);
        setResponseStatusModal(false);
        setReponseStatusUnsuccessModal(true);
      });
    }

    const postMessageToChannelWithImage = () => {console.log(url),axios.post(ApiConfig.slackWebHook,messagewithImage)
        .then(function (response) {
            console.log(response)
            closeModal();
            setSubmit(false);
          })
          .catch(function (error) {
            console.log(error);
            setVisible(false);
            setResponseStatusModal(false);
            setReponseStatusUnsuccessModal(true);
          });
        }

    function closeModal() {
        setVisible(false);
        setResponseStatusModal(true);
    }

    function toggleNotificationOff(){
        setResponseStatusModal(false);
        navigation.goBack();
    }

    function toggleUnsuccessNotificationOff(){
        setReponseStatusUnsuccessModal(false);
        setVisible(true);
    }
    async function asyncCall() {
        const data = new FormData()
        const uri =  uploadUrl.assets[0].uri;
        const type = uploadUrl.assets[0].type;
        const name = uploadUrl.assets[0].fileName;
        const source = {
          uri,
          type,
          name,
        }
        data.append('file', source)
        data.append('upload_preset', ApiConfig.cloudName)
        data.append("cloud_name", ApiConfig.cloudName)
        fetch(ApiConfig.cloudinaryURL, {
            method: "post",
            body: data
            }).then(res => res.json()).
                then(data => {
                    setUrl(data.secure_url);
                }).catch(err => {
                    console.log(err)
                    Alert.alert('Oops',"An Error occured while uploading the Image. Please try again.")
                }) 
      }
    function createReport() {
        if(multilineInputState.descriptionvalue === ''){
            Alert.alert(
                'Tell us more',
                'Please complete the details field',
                [
                  { text: 'OK', style: 'cancel' }
                ],
                { cancelable: false }
              );
        }else{
            setReponseStatusUnsuccessModal(false);
            if(uploadUrl !== null){
                asyncCall();
            }else{
                postMessageToChannel();
            }
        }
    }
    function cancellReport() {
        setVisible(false);
        navigation.goBack();
    }

    const Footer = (props) => (
        <Layout {...props}>
                <Button appearance='ghost' status='danger' onPress={() => cancellReport()}>
                    Cancel
                </Button>
                <Button onPress={() => createReport()}>
                    {submit?  <Spinner size='small'  status='basic'/>: "Send"}
                </Button>
        </Layout>
    );
    
    const Header = (props) => (
        <Layout {...props}>
          <Text category='h6'>Need help?</Text>
          <Text category='s1' appearance='hint'>Issues or suggestions? Please describe it here so our developers can find a solution.</Text>
        </Layout>
    );

    const SuccessHeader = (props) => (
        <Layout {...props}>
             <ImageBackground
                resizeMode="contain"
                style={{height:100, width:100, alignSelf:"center"}}
                source={require('../../assets/success_icon.png')}
            />
        </Layout>
    );
    const UnsuccessHeader = (props) => (
        <Layout {...props}>
             <ImageBackground
                resizeMode="contain"
                style={{height:100, width:100, alignSelf:"center"}}
                source={require('../../assets/error_icon.png')}
            />
        </Layout>
    );
    const pickFile = useCallback(async () => {
        /*try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
          });
          console.log(res)
          setUploadUrl(res)
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            console.log("User cancelled the picker, exit any dialogs or menus and move on");
          } else {
            throw err;
          }
        }
      }*/
      let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
        },
    };
    launchImageLibrary(options, (res) => {
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                console.log(res.assets)
                setUploadUrl(res)
            }
        })
    },[]);
    const problemIcon = (props) => (<Icon {...props} name='alert-triangle-outline'/>)
    const improvementIcon = (props) => (<Icon {...props} name='message-square-outline'/>)
    const questionIcon = (props) => (<Icon {...props} name='question-mark-circle-outline'/>) 

    const selectIndex = (index) =>{
        setSelectedIndex(index)
        setDisplayedValue(data[index.row])
    }
    const windowHeight = Dimensions.get('window').height;
    return(
        <React.Fragment>
            <Modal
                visible={visible}
                onBackdropPress={() => cancellReport()}
                style={{width:'95%',height:windowHeight,marginBottom: keyboardSize, marginTop:'7%'}}>
                <ScrollView>
                <Card disabled={true} style={{marginBottom: keyboardSize, marginTop:'6%'}} header={Header} footer={Footer}>
                    <ScrollView>
                        <Select
                            label='Select an option'
                            placeholder='Select an option'
                            value={displayedValue}
                            size='large'
                            selectedIndex={selectedIndex}
                            style={{marginBottom:"8%"}}
                            onSelect={index => selectIndex(index)}>
                            <SelectItem title='Report a problem' accessoryLeft={problemIcon} />
                            <SelectItem title='Suggest an improvement' accessoryLeft={improvementIcon} />
                            <SelectItem title='Ask a question' accessoryLeft={questionIcon} />
                        </Select>
                        <Input
                            label='Details'
                            multiline={true}
                            textStyle={{ minHeight: 44,maxHeight: 250 }}
                            placeholder='Tell us more about it'
                            {...multilineInputState}
                        />
                            <Button appearance='ghost' onPress={pickFile}>
                                Choose File
                            </Button>
                            {uploadUrl && <Image source={{uri: uploadUrl.assets[0].uri}} style={{height:80, width:80}}/>}
                    </ScrollView>
                </Card>
                </ScrollView>
            </Modal>
            <Modal
            visible={responseStatusModal}
            style={{width:'80%'}}
            onBackdropPress={() => toggleNotificationOff()}>
                <Card disabled={true} header={SuccessHeader}>
                    <Text status={'success'} style={{ margin: 15, alignSelf:"center"}}>Thanks for your time.</Text> 
                    <Button appearance='outline' size={'small'} onPress={() => toggleNotificationOff()} status={'success'}>
                        OK
                    </Button>
                </Card>
            </Modal>
            <Modal
            visible={reponseStatusUnsuccessModal}
            style={{width:'80%'}}
            onBackdropPress={() => toggleNotificationOff()}>
                <Card disabled={true} header={UnsuccessHeader}>
                    <Text status={'danger'} style={{ margin: 15, alignSelf:"center"}}>Something went wrong. Please, try again.</Text> 
                    <Button appearance='outline' size={'small'} onPress={() => toggleUnsuccessNotificationOff()} status={'danger'}>
                        OK
                    </Button>
                </Card>
            </Modal>
    </React.Fragment>
    );
}