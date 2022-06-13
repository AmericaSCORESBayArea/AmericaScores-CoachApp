import React, { useEffect } from 'react';
import { Modal, Card, Text, Button, Layout, Datepicker,Icon, IndexPath, Select, SelectItem, Spinner } from '@ui-kitten/components';
import { MomentDateService } from '@ui-kitten/moment';
import Axios from 'axios';
import { ApiConfig } from '../config/ApiConfig';
import { StyleSheet, View, Alert, Image, ImageBackground } from 'react-native';
import { AttendanceScreen } from '../Attendance.Screen';
import moment from 'moment';
import analytics from '@react-native-firebase/analytics';
import { useSelector } from 'react-redux';

export const EditSessionModal = ({route, navigation}) => {
    const user = useSelector(state => state.user.user)
    const [visible, setVisible] = React.useState(true);
    const {session, oldDate, oldTopic, topicId} = route.params;
    const [date, setDate] = React.useState(moment(oldDate));
    const [warningStatusModal, setWarningStatusModal] = React.useState(false);
    const [responseStatusModal, setResponseStatusModal] = React.useState(false);
    const data = [
        'Soccer',
        'Writing',
        'Game Day',
        'Soccer and Writing'
    ];
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(topicId));

    const [updatingModalstate, setupdatingModalstate] = React.useState(false);
    const [responseSuccess, setResponseSuccess] = React.useState(false);
    const [responseSuccessDelete, setResponseSuccessDelete] = React.useState(false);

    function closeModal() {
        setVisible(false); 
        navigation.goBack();
    }
    function warningModalFunction() {
        setVisible(false); 
        setWarningStatusModal(true);
    }
    function toggleNotificationOff() {
        setWarningStatusModal(false);
        setVisible(true); 
    }
    function toggleNotificationOffStatusModal(){
        setResponseStatusModal(false);
        navigation.goBack();
    }
    function deleteSession() {
        setWarningStatusModal(false);
        setResponseSuccessDelete(true);
        setResponseStatusModal(true);
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
            <Button style={{marginTop: '0.5%' }} status='danger' onPress={() => warningModalFunction()}>
                DELETE SESSION
            </Button>
        </Layout>
    );

    const spinnerCard = () => (
        <Card disabled={true}>
            <Spinner size='large' status='primary'/>
         </Card>
    )
    
    const SuccessHeaderDelete = (props) => (
        <Layout {...props}>
             <ImageBackground
                resizeMode="contain"
                style={{height:100, width:100, alignSelf:"center"}}
                source={require('../../assets/success_icon.png')}
            />
        </Layout>
    );
    const UnsuccessHeaderDelete = (props) => (
        <Layout {...props}>
             <ImageBackground
                resizeMode="contain"
                style={{height:92, width:90, alignSelf:"center"}}
                source={require('../../assets/error_icon.png')}
            />
        </Layout>
    );

    const deleteSuccessCard = (status, text) => (
        <Card disabled={true} header={SuccessHeaderDelete}>
            <Text style={styles.modalText} status={status}>{text}</Text> 
            <Button appearance='outline' size={'small'} onPress={() => toggleNotificationOffStatusModal()} status={status}>
                OK
            </Button>
        </Card>
    );
    const deleteUnSuccessCard = (status, text) => (
        <Card disabled={true} header={UnsuccessHeaderDelete}>
            <Text style={styles.modalText} status={status}>{text}</Text> 
            <Button appearance='outline' size={'small'} onPress={() => toggleNotificationOffStatusModal()} status={status}>
                OK
            </Button>
        </Card>
    );

    const deleteModal = () => (
        <Modal
            visible={responseStatusModal}
            style={styles.popOverContent}
            onBackdropPress={() => toggleNotificationOffStatusModal()}>
            { responseSuccessDelete ?
                deleteSuccessCard("success", "Session deleted successfuly.\n\nPull down on the top of the Sessions screen to refresh.") :
                deleteUnSuccessCard("danger", "Something went wrong. Please, try again.")
            }
        </Modal>
    )

    const WarningHeader = (props) => (
        <Layout {...props}>
             <ImageBackground
                resizeMode="contain"
                style={{height:90, width:90, alignSelf:"center"}}
                source={require('../../assets/warning_icon.png')}
            />
        </Layout>
    );
    const warningCard = (status, text) => (
        <Card disabled={true} header={WarningHeader}>
            <Text style={styles.modalText} status={status}>{text}</Text> 
            <Button appearance='ghost' onPress={() => toggleNotificationOff()} status='danger'>
                Cancel
            </Button>
            <Button appearance='outline' onPress={() => deleteSession()}>
                CONTINUE
            </Button>
        </Card>
    );

    const warningModal = () => (
        <Modal
            visible={warningStatusModal}
            style={styles.popOverContent}
            onBackdropPress={() => toggleNotificationOff()}>
            {
                warningCard("warning", "Removing a session will delete any recorded attendance data.")
            }
        </Modal>
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
     await analytics().logEvent('EditSession', {
        coach_Id: user.ContactId,
        session_Id: session
    });
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

    const renderImage = (title) => { 
        if(title==="Soccer"){
            return(<Image
            style={{ width: 40, height: 40, resizeMode: "contain"}}
            source={require('../../assets/Scores_Ball.png')}
            />)
        }else if(title==="Soccer and Writing"){
            return(<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Soccer_and_writing.png')}
          />)
        }
        else if(title==="Writing"){
            return(<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Pencil_Edit.png')}
          />)
        }
        else if(title==="Game Day"){
            return(<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_goal.png')}
          />)
        }
    };
    const renderImageDisplay = (title) => { 
        if(title==="Soccer"){
            return(<Image
            style={{ width: 40, height: 40, resizeMode: "contain"}}
            source={require('../../assets/Scores_Ball.png')}
            />)
        }else if(title==="Soccer and Writing"){
            return(<Image
            style={{ width: 30, height: 30,resizeMode: "contain"}}
            source={require('../../assets/Scores_Soccer_and_writing.png')}
          />)
        }
        else if(title==="Writing"){
            return(<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Pencil_Edit.png')}
          />)
        }
        else if(title==="Game Day"){
            return(<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_goal.png')}
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
        <React.Fragment>
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
                        onSelect={index => {setSelectedIndex(index), console.log(index), console.log(index.equals)}}>
                        {data.map(renderOption)}
                    </Select>
                </Card>
            </Modal>
            {warningModal()}
            {deleteModal()}
        </React.Fragment>
    );
}

export const EditHeadCountSessionModal = ({route, navigation}) => {
    const [visible, setVisible] = React.useState(true);
    const {session, oldDate, oldTopic, topicId} = route.params;
    const [date, setDate] = React.useState(moment(oldDate));
    const [warningStatusModal, setWarningStatusModal] = React.useState(false);
    const [responseStatusModal, setResponseStatusModal] = React.useState(false);
    const [updatingModalstate, setupdatingModalstate] = React.useState(false);
    const [responseSuccess, setResponseSuccess] = React.useState(false);
    const [responseSuccessDelete, setResponseSuccessDelete] = React.useState(false);

    function closeModal() {
        setVisible(false); 
        navigation.goBack();
    }
    function warningModalFunction() {
        setVisible(false); 
        setWarningStatusModal(true);
    }
    function toggleNotificationOff() {
        setWarningStatusModal(false);
        setVisible(true); 
    }
    function toggleNotificationOffStatusModal(){
        setResponseStatusModal(false);
        navigation.goBack();
    }
    function deleteSession() {
        setWarningStatusModal(false);
        setResponseSuccessDelete(true);
        setResponseStatusModal(true);
    }
    async function editSession() {
        let changes =
            {
                "SessionDate": date.format("YYYY-MM-DD"),
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
            <Button style={{marginTop: '0.5%' }} status='danger' onPress={() => warningModalFunction()}>
                DELETE SESSION
            </Button>
        </Layout>
    );

    const spinnerCard = () => (
        <Card disabled={true}>
            <Spinner size='large' status='primary'/>
         </Card>
    )
    
    const SuccessHeaderDelete = (props) => (
        <Layout {...props}>
             <ImageBackground
                resizeMode="contain"
                style={{height:100, width:100, alignSelf:"center"}}
                source={require('../../assets/success_icon.png')}
            />
        </Layout>
    );
    const UnsuccessHeaderDelete = (props) => (
        <Layout {...props}>
             <ImageBackground
                resizeMode="contain"
                style={{height:92, width:90, alignSelf:"center"}}
                source={require('../../assets/error_icon.png')}
            />
        </Layout>
    );

    const deleteSuccessCard = (status, text) => (
        <Card disabled={true} header={SuccessHeaderDelete}>
            <Text style={styles.modalText} status={status}>{text}</Text> 
            <Button appearance='outline' size={'small'} onPress={() => toggleNotificationOffStatusModal()} status={status}>
                OK
            </Button>
        </Card>
    );
    const deleteUnSuccessCard = (status, text) => (
        <Card disabled={true} header={UnsuccessHeaderDelete}>
            <Text style={styles.modalText} status={status}>{text}</Text> 
            <Button appearance='outline' size={'small'} onPress={() => toggleNotificationOffStatusModal()} status={status}>
                OK
            </Button>
        </Card>
    );

    const deleteModal = () => (
        <Modal
            visible={responseStatusModal}
            style={styles.popOverContent}
            onBackdropPress={() => toggleNotificationOffStatusModal()}>
            { responseSuccessDelete ?
                deleteSuccessCard("success", "Session deleted successfuly.\n\nPull down on the top of the Sessions screen to refresh.") :
                deleteUnSuccessCard("danger", "Something went wrong. Please, try again.")
            }
        </Modal>
    )

    const WarningHeader = (props) => (
        <Layout {...props}>
             <ImageBackground
                resizeMode="contain"
                style={{height:90, width:90, alignSelf:"center"}}
                source={require('../../assets/warning_icon.png')}
            />
        </Layout>
    );
    const warningCard = (status, text) => (
        <Card disabled={true} header={WarningHeader}>
            <Text style={styles.modalText} status={status}>{text}</Text> 
            <Button appearance='ghost' onPress={() => toggleNotificationOff()} status='danger'>
                Cancel
            </Button>
            <Button appearance='outline' onPress={() => deleteSession()}>
                CONTINUE
            </Button>
        </Card>
    );

    const warningModal = () => (
        <Modal
            visible={warningStatusModal}
            style={styles.popOverContent}
            onBackdropPress={() => toggleNotificationOff()}>
            {
                warningCard("warning", "Removing a session will delete any recorded attendance data.")
            }
        </Modal>
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
                    "Changes applied: \nOld: "+oldDate+"\nNew: "+date.format("MMM-DD-YYYY")+"\n\nPull down on the session description to refresh.",
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
        <React.Fragment>
            <Modal
                visible={visible}
                onBackdropPress={() => closeModal()}
                style={{width:'80%'}}>
                <Card disabled={true} header={Header} footer={Footer}>
                    <Text >Change Session Date:</Text>
                    {searchBox()}
                    {updatingModal()}
                </Card>
            </Modal>
            {warningModal()}
            {deleteModal()}
        </React.Fragment>
    );
}


export const AddSessionModal = ({route, navigation}) => {
    const { user } = useSelector(state => state.user);
    const  [ teams ]  = React.useState([]);
    const [ teamsId ] = React.useState([]);
    const [showTeams, setShowTeams] = React.useState(false); 
    useEffect(
        () => {
                if(route.params.teamSeasonId === ''){
                    fetchTeams();
                }
            },
        []
      );
    const [visible, setVisible] = React.useState(true);
    const {teamSeasonId, oldDate, oldTopic} = route.params;
    const [selectedTeamIndex, setSelectedTeamIndex] = React.useState(new IndexPath(0));
    const [date, setDate] = React.useState(moment(oldDate));
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
    const [updatingModalstate, setupdatingModalstate] = React.useState(false);
    const [responseSuccess, setResponseSuccess] = React.useState(false);
    const actualRegion = useSelector(state => state.sessionScreen.region);

    function closeModal() {
        setVisible(false); 
        navigation.goBack();
    }

    async function fetchTeams(){
        await Axios.get(`${ApiConfig.dataApi}/seasons`)//seasons endpoint
        .then(response => {
            response.data.map(value => {
                if (date.format("YYYY-MM-DD") >= value.StartDate && date.format("YYYY-MM-DD") <= value.EndDate) {
                    fetchTeamsBySeason(value);
                }
            })
        }).catch(e => console.log(e));
    }

    async function fetchTeamsBySeason(season){
        await Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons?season=${season.Id}`)
        .then(response => {
            if(actualRegion === 'ASBA'){
                var list=response.data.filter((value => (!value.Region.match('Genesis') && !value.Region.match('IFC-SF'))));
            }else if(actualRegion === 'IFC'){
                var list=response.data.filter((value => (value.Region.match('IFC-SF'))));
            }else if(actualRegion === 'OGSC'){
                var list=response.data.filter((value => (value.Region.match('Genesis'))));
            }
            if (list.length !== 0){
                list.map(value => {
                    teams.push(value.TeamSeasonName),
                    teamsId.push(value.TeamSeasonId)
                })
                setShowTeams(true);
            }else{
                Alert.alert(
                    "Oops",
                    "Adding a new session is not possible. There are no active Teams for the selected affilitation.",
                    [
                    { text: "OK", onPress: () => navigation.goBack()}
                    ]
                );
            }
        })
        .catch(e => console.log(e));
    }
    async function editSession() {
        if(showTeams === true){
            let changes =
            {
                "SessionDate": date.format("YYYY-MM-DD"),
                "SessionTopic": displayValue.replace(/\s/g, '_'),
                "TeamSeasonId": teamsId[selectedTeamIndex.row],
            };
            console.log(changes);
            await pushChanges(changes);
        }else{
            let changes =
                {
                    "SessionDate": date.format("YYYY-MM-DD"),
                    "SessionTopic": displayValue.replace(/\s/g, '_'),
                    "TeamSeasonId": teamSeasonId,
                };
            console.log(changes);
            await pushChanges(changes);
        }
        
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
     await analytics().logEvent('CreateSession', {
        coach_Id: user.ContactId,
        session_Date: changes.SessionDate,
        sessionTopic: changes.SessionTopic,
        teamSeasonId: changes.TeamSeasonId
    });
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
            return(<Image
            style={{ width: 40, height: 40, resizeMode: "contain"}}
            source={require('../../assets/Scores_Ball.png')}
            />)
        }else if(title==="Soccer and Writing"){
            return(<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Soccer_and_writing.png')}
          />)
        }
        else if(title==="Writing"){
            return(<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Pencil_Edit.png')}
          />)
        }
        else if(title==="Game Day"){
            return(<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_goal.png')}
          />)
        }
    };

    const renderImageDisplayAddSession = (title) => { 
        if(title==="Soccer"){
            return(<Image
            style={{ width: 40, height: 40, resizeMode: "contain"}}
            source={require('../../assets/Scores_Ball.png')}
            />)
        }else if(title==="Soccer and Writing"){
            return(<Image
            style={{ width: 30, height: 30,resizeMode: "contain"}}
            source={require('../../assets/Scores_Soccer_and_writing.png')}
          />)
        }
        else if(title==="Writing"){
            return(<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_Pencil_Edit.png')}
          />)
        }
        else if(title==="Game Day"){
            return(<Image
            style={{ width: 40, height: 40,resizeMode: "contain"}}
            source={require('../../assets/Scores_goal.png')}
          />)
        }
    };
    const renderOption = (title) => (
        <SelectItem key={title} title={title} accessoryLeft={() => renderImageAddSession(title)} />
    );
    const renderTeamsOption = (title) => (
        <SelectItem key={title} title={title} />
    );
    const displayedTeamValue = teams[selectedTeamIndex.row];
    const selectTeam = () =>(
        (
            (showTeams && 
            <View>
                <Text style={{margin: "2%"}}>Select a Team:</Text>
                <Select
                    selectedIndex={selectedTeamIndex}
                    size='medium'
                    value={displayedTeamValue}
                    placeholder='Select a team'
                    onSelect={index => setSelectedTeamIndex(index)}>
                    {teams.map(renderTeamsOption)}
            </Select>
           </View>
           )
        )
    )
    
    const displayValue = data[selectedIndex.row];

    const CalendarIcon = (props) => ( <Icon {...props} name='calendar'/> );
    const dateService = new MomentDateService();
    const searchBox = () => (
        <Datepicker
            placeholder='Pick Date'
            date={date}
            placement="bottom"
            // min={minDatePickerDate}
            style={{margin: "2%" }}
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
                {selectTeam()}
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



  
  