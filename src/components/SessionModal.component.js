import React from 'react';
import { Modal, Card, Text, Button, Layout, Datepicker,Icon, IndexPath, Select, SelectItem, Spinner } from '@ui-kitten/components';
import { MomentDateService } from '@ui-kitten/moment';
import Axios from 'axios';
import { ApiConfig } from '../config/ApiConfig';
import { StyleSheet, View, Alert, Image } from 'react-native';
import { AttendanceScreen } from '../Attendance.Screen';
import moment from 'moment';

export const EditSessionModal = ({route, navigation}) => {
    const [visible, setVisible] = React.useState(true);
    
    const {session, oldDate, oldTopic} = route.params;
    const [date, setDate] = React.useState(moment(oldDate));
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
    const [updatingModalstate, setupdatingModalstate] = React.useState(false);
    const [responseSuccess, setResponseSuccess] = React.useState(false);

    function closeModal() {
        setVisible(false); 
        navigation.goBack();
    }

    async function editSession() {
        let changes =
            {
                "SessionDate": date.format("YYYY-MM-DD"),
                "SessionTopic": displayValue.replace(/\s/g, '_'),
            };
        console.log(changes);
        await pushChanges(changes);
        
    }

    const Footer = (props) => (
        <Layout {...props}>
            <Button appearance='ghost' status='danger' onPress={() => closeModal()}>
                Cancel
            </Button>
            <Button onPress={() => editSession()}>
                SAVE CHANGES
            </Button>
        </Layout>
    );

    const spinnerCard = () => (
        <Card disabled={true}>
            <Spinner size='large' status='primary'/>
         </Card>
    )

    const updatingModal = () => (
        <Modal
            style={{flexDirection: 'row',
            alignItems: 'center',
            alignSelf:'center',
            shadowRadius: 10,
            shadowOpacity: 0.12,
            shadowColor: "#000"}}
            visible={updatingModalstate}
            backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                {spinnerCard()}
        </Modal>
    )

    async function pushChanges(changes){
     setupdatingModalstate(true);   
     Axios.patch(
                `${ApiConfig.dataApi}/sessions/${session}`,
                changes
            ).then(res => {
                Alert.alert(
                    res.data.message,
                    "Changes applied: \nOld: "+oldDate+" "+oldTopic+"\nNew: "+date.format("MMM-DD-YYYY")+" "+displayValue+"\n\nPull down on the session description to refresh.",
                    [
                      { text: "OK", onPress: () => navigation.navigate('Home')}
                    ]
                  );
                  console.log(changes);
                setupdatingModalstate(false);
                
            }).catch(error => {
                setupdatingModalstate(false);
                Alert.alert(
                    "Oops",
                    "Something went wrong, try again in a moment",
                    [
                      { text: "OK", onPress: () => navigation.goBack()}
                    ]
                  );
                throw error;
            })
    }

    async function selectDate(date) { 
        await setDate(date)
        const activitiesList = await this.fetchActivities();
        console.log(activitiesList);
        this._syncReduxActivities(activitiesList);
    }

    const Header = (props) => (
        <Layout {...props}>
          <Text category='h6'>Edit Session</Text>
          <Text category='s1' appearance='hint'>Select the properties you wish to change.</Text>
        </Layout>
    );

    const data = [
        'Soccer',
        'Writing',
        'Game Day',
        'Soccer and Writing'
      ];
    const renderImage = (title) => { 
        if(title==="Soccer"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40, resizeMode: "contain"}}
            source={require('../../assets/Scores_Ball.png')}
            />)
        }else if(title==="Soccer and Writing"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Soccer_and_writing.png')}
          />)
        }
        else if(title==="Writing"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Pencil_Edit.png')}
          />)
        }
        else if(title==="Game Day"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Game_Day.png')}
          />)
        }
    };
    const renderImageDisplay = (title) => { 
        if(title==="Soccer"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40, resizeMode: "contain"}}
            source={require('../../assets/Scores_Ball.png')}
            />)
        }else if(title==="Soccer and Writing"){
            return(console.log(title),<Image
            style={{ width: 30, height: 30,resizeMode: "contain"}}
            source={require('../../assets/Scores_Soccer_and_writing.png')}
          />)
        }
        else if(title==="Writing"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Pencil_Edit.png')}
          />)
        }
        else if(title==="Game Day"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Game_Day.png')}
          />)
        }
    };
    const renderOption = (title) => (
        <SelectItem key={title} title={title}  accessoryLeft={() => renderImage(title)}/>
    );
    

    const displayValue = data[selectedIndex.row];

    const CalendarIcon = (props) => ( <Icon {...props} name='calendar'/> );
    const dateService = new MomentDateService();
    const searchBox = () => (
        <Datepicker
            placeholder='Pick Date'
            date={date}
            placement="bottom"
            // min={minDatePickerDate}
            style={{margin: "2%", }}
            dateService={dateService}
            onSelect={nextDate => selectDate(nextDate)}
            accessoryRight={CalendarIcon}
        />
    );
    
    return(
        <Modal
            visible={visible}
            onBackdropPress={() => closeModal()}
            style={{width:'80%'}}>
            <Card disabled={true} header={Header} footer={Footer}>
                <Text >Change Session Date:</Text>
                {searchBox()}
                {updatingModal()}
                <Text >Change Session Type:</Text>
                <Select
                    selectedIndex={selectedIndex}
                    size='medium'
                    value={displayValue}
                    accessoryLeft={() => renderImageDisplay(displayValue)}
                    placeholder='Select a type'
                    // label='Scores Program Type'
                    onSelect={index => setSelectedIndex(index)}>
                    {data.map(renderOption)}
                </Select>
            </Card>
        </Modal>
    );
}


export const AddSessionModal = ({route, navigation}) => {
    const [visible, setVisible] = React.useState(true);
    
    const {teamSeasonId, oldDate, oldTopic} = route.params;
    const [date, setDate] = React.useState(moment(oldDate));
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
    const [updatingModalstate, setupdatingModalstate] = React.useState(false);
    const [responseSuccess, setResponseSuccess] = React.useState(false);

    function closeModal() {
        setVisible(false); 
        navigation.goBack();
    }

    async function editSession() {
        let changes =
            {
                "SessionDate": date.format("YYYY-MM-DD"),
                "SessionTopic": displayValue.replace(/\s/g, '_'),
                "TeamSeasonId": teamSeasonId,
            };
        console.log(changes);
        await pushChanges(changes);
        
    }

    const Footer = (props) => (
        <Layout {...props}>
            <Button appearance='ghost' status='danger' onPress={() => closeModal()}>
                Cancel
            </Button>
            <Button onPress={() => editSession()}>
                CREATE
            </Button>
        </Layout>
    );

    const spinnerCard = () => (
        <Card disabled={true}>
            <Spinner size='large' status='primary'/>
         </Card>
    )

    const updatingModal = () => (
        <Modal
            style={{flexDirection: 'row',
            alignItems: 'center',
            alignSelf:'center',
            shadowRadius: 10,
            shadowOpacity: 0.12,
            shadowColor: "#000"}}
            visible={updatingModalstate}
            backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                {spinnerCard()}
        </Modal>
    )

    async function pushChanges(changes){
     setupdatingModalstate(true);   
     Axios.post(
                `${ApiConfig.dataApi}/sessions`,
                changes
            ).then(res => {
                Alert.alert(
                    "Session created",
                    "Pull down on the sessions list to refresh, or select a new date in the calendar.",
                    [
                      { text: "OK", onPress: () => navigation.goBack()}
                    ]
                  );
                  console.log(changes);
                setupdatingModalstate(false);
                
            }).catch(error => {
                setupdatingModalstate(false);
                Alert.alert(
                    "Oops",
                    "Something went wrong, try again in a moment",
                    [
                      { text: "OK", onPress: () => navigation.goBack()}
                    ]
                  );
                throw error;
            })
    }

    async function selectDate(date) { 
        await setDate(date)
        const activitiesList = await this.fetchActivities();
        console.log(activitiesList);
        this._syncReduxActivities(activitiesList);
    }

    const Header = (props) => (
        <Layout {...props}>
          <Text category='h6'>Create a Session</Text>
          {/*<Text category='s1' appearance='hint'>A Session with the following attributes will be created for the selected Team Season.</Text>*/}
          <Text category='s1' appearance='hint'>A Session will be created for the selected Team Season.</Text>
        </Layout>
    );

    const data = [
        'Soccer',
        'Writing',
        'Game Day',
        'Soccer and Writing'
      ];

      const renderImageAddSession = (title) => { 
        if(title==="Soccer"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40, resizeMode: "contain"}}
            source={require('../../assets/Scores_Ball.png')}
            />)
        }else if(title==="Soccer and Writing"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Soccer_and_writing.png')}
          />)
        }
        else if(title==="Writing"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Pencil_Edit.png')}
          />)
        }
        else if(title==="Game Day"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Game_Day.png')}
          />)
        }
    };

    const renderImageDisplayAddSession = (title) => { 
        if(title==="Soccer"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40, resizeMode: "contain"}}
            source={require('../../assets/Scores_Ball.png')}
            />)
        }else if(title==="Soccer and Writing"){
            return(console.log(title),<Image
            style={{ width: 30, height: 30,resizeMode: "contain"}}
            source={require('../../assets/Scores_Soccer_and_writing.png')}
          />)
        }
        else if(title==="Writing"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Pencil_Edit.png')}
          />)
        }
        else if(title==="Game Day"){
            return(console.log(title),<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Game_Day.png')}
          />)
        }
    };
    const renderOption = (title) => (
        <SelectItem key={title} title={title} accessoryLeft={() => renderImageAddSession(title)}/>
    );
    

    const displayValue = data[selectedIndex.row];

    const CalendarIcon = (props) => ( <Icon {...props} name='calendar'/> );
    const dateService = new MomentDateService();
    const searchBox = () => (
        <Datepicker
            placeholder='Pick Date'
            date={date}
            placement="bottom"
            // min={minDatePickerDate}
            style={{margin: "2%", }}
            dateService={dateService}
            onSelect={nextDate => selectDate(nextDate)}
            accessoryRight={CalendarIcon}
        />
    );

    return(
        <Modal
            visible={visible}
            onBackdropPress={() => closeModal()}
            style={{width:'80%'}}>
            <Card disabled={true} header={Header} footer={Footer}>
                <Text >Session Date:</Text>
                {searchBox()}
                {updatingModal()}
                <Text >Session Topic:</Text>
                <Select
                    selectedIndex={selectedIndex}
                    size='medium'
                    value={displayValue}
                    placeholder='Select a topic'
                    accessoryLeft={() => renderImageDisplayAddSession(displayValue)}
                    // label='Scores Program Type'
                    onSelect={index => setSelectedIndex(index)}>
                    {data.map(renderOption)}
                </Select>
            </Card>
        </Modal>
    );
}

const styles = StyleSheet.create({
    popOverContent: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'center',
        shadowRadius: 10,
        shadowOpacity: 0.12,
        shadowColor: "#000"
    },
    modalText: {
        margin: 15
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
});



  
  