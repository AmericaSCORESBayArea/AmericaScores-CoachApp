import React, {useEffect} from 'react';
import { Modal, Card, Text, Button, Layout, Input, Select, SelectItem, Icon } from '@ui-kitten/components';
import { ImageBackground,Keyboard, ScrollView, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ApiConfig } from '../config/ApiConfig';
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
    const [selectedIndex, setSelectedIndex] = React.useState();
    const [displayedValue, setDisplayedValue] = React.useState(data[0]);
    const [keyboardSize, setKeyboardSize] = React.useState(0);
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
                        "type": "divider",
                        "block_id": "divider1"
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
            postMessageToChannel();
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
                Send
            </Button>
        </Layout>
    );
    
    const Header = (props) => (
        <Layout {...props}>
          <Text category='h6'>Need help?</Text>
          <Text category='s1' appearance='hint'>Please help us filling out this form. This could help our developers to find a solution.</Text>
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
    const problemIcon = (props) => (<Icon {...props} name='alert-triangle-outline'/>)
    const improvementIcon = (props) => (<Icon {...props} name='message-square-outline'/>)
    const questionIcon = (props) => (<Icon {...props} name='question-mark-circle-outline'/>) 

    const selectIndex = (index) =>{
        setSelectedIndex(index)
        setDisplayedValue(data[index.row])
    }
    return(
        <React.Fragment>
            <Modal
                visible={visible}
                onBackdropPress={() => cancellReport()}
                animationType="slide"
                style={{maxWidth:'90%', marginBottom: keyboardSize}}>
                <ScrollView>
                <Card disabled={true} style={{marginBottom: keyboardSize }} header={Header} footer={Footer}>
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
    </React.Fragment>
    );
}