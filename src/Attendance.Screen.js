import React, { Component } from 'react';
import { Layout,CheckBox, Button, Divider, Icon, List, ListItem, Text, Modal, Card, Spinner  } from '@ui-kitten/components';
import { StyleSheet, View, RefreshControl, ScrollView } from 'react-native';

import { connect } from 'react-redux';
import { syncSessions, updateSession } from "./Redux/actions/Session.actions";
import { bindActionCreators } from 'redux';
import Axios from 'axios';
import { ApiConfig } from './config/ApiConfig';
import moment from "moment";

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

const loadingIndicator = (props) => (
    <View style={[props.style, styles.indicator]}>
      <Spinner size='medium' status='basic'/>
    </View>
  );

class AttendanceScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentsList: [],
            teamName: '',
            isUpdated: false,
            responseSuccess: false,
            responseStatusModal: false,
            currentSession: undefined,
            updatingModalstate: false,
        }
    }
    

    componentDidMount() {
        this._setCurrentSessionData();
    }
    
    // componentWillMount() {
    //     this._setCurrentSessionData();
    // }

    formatEnrollmentsToRequest(enrollments, sessionId) {
        let studentsList = [];
            
        enrollments.forEach(student => {
            let attendance = false;
            if (student.Attended) attendance = true; 

            studentsList.push({
                SessionId: sessionId,
                Attended: attendance,
                StudentId: student.StudentId
            })
        });

        return studentsList;
    }

    updateEnrollmentsToRedux() {
        const { actions } = this.props;
        const {completeTeamSeasonId, enrollments} = this.state.completeTeamSeasonId
        let payload = {
            TeamSeasonId: completeTeamSeasonId,
            enrollments: enrollments
        }
        actions.updateSession(payload);
    }

    //Filters the current session and sets the student list for attendance 
    async _setCurrentSessionData() {
        const {route} = this.props;
        const currentSession = this.props.sessions.sessions.find(session => session.TeamSeasonId === route.params.teamSeasonId);
        let currentDate = moment();
        let currentTopic = "";
        
        if (currentSession) {
            console.log("[Attendance.Screen.js] : FETCH SESSION") 
            await Axios.get(`${ApiConfig.dataApi}/sessions/${currentSession.Sessions[0].SessionId}`)
            .then(async res => {
                console.log(res.data.SessionTopic);
                currentDate = res.data.SessionDate;
                currentTopic = res.data.SessionTopic.replace(/_/g,' ');
            }).catch(error => error)            
            const newState = {
                sessionId: currentSession.Sessions[0].SessionId,
                enrollments: currentSession.Enrollments,
                teamName: currentSession.TeamSeasonName,
                teamSeasonId: currentSession.Sessions[0].TeamSeasonId,
                completeTeamSeasonId: currentSession.TeamSeasonId,
                topic: currentTopic,
                date: moment(currentDate).format("MMM-DD-YYYY"),
                numberOfStudents: Number(currentSession.TotalNoOfPlayers),
            }

            await this.setState(newState);
            await this._fetchGetEnrollments();
            await this._fetchSessionInfo();
            console.log("enrollments", this.state.enrollments);
        }
    }
    

    //In order to apply changes to the state list we need to clone it, modify and put it back into state (Is not effective but thats how react works)
    checkStudent(index, value) {
        let newEnrollments = [...this.state.enrollments]; //Get the new list
        //Change the student attendance
        if (value) newEnrollments[index].Attended = true;
        else newEnrollments[index].Attended = false;
        this.setState({enrollments: newEnrollments, isUpdated: true}) //Set the new list
    }

    checkStudentById = enrollmentId => {
        const enrollmentIndex = this.state.enrollments.findIndex(enrollment => enrollment.StudentId === enrollmentId);
        this.checkStudent(enrollmentIndex, true);
    }

    updateAttendance() {
        const {enrollments, sessionId} = this.state;
        let attendanceFetchData = this.formatEnrollmentsToRequest(enrollments, sessionId); 
        this._fetchUpdateAttendance(attendanceFetchData)
            .then(() => this.updateEnrollmentsToRedux())
            .catch(error => {throw error})
    }

    _fetchUpdateAttendance = async (enrollments) => {
        const {user} = this.props.user;
        Axios.post(
                `${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/sessions/${this.state.sessionId}/attendances`,
                enrollments
            ).then(res => {
                if (res.status === 200) this.setState({responseSuccess: true, isUpdated: false, responseStatusModal: true, updatingModalstate: false})
                else this.setState({responseStatusModal: true, updatingModalstate: false})
            }).catch(error => {
                this.setState({responseStatusModal: true, updatingModalstate: false});
                throw error;
            })
    }

    async _fetchGetEnrollments() {
        const {user} = this.props.user;
        console.log("[Attendance.Screen.js] : FETCH ATTENDANCE") 
        await Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/sessions/${this.state.sessionId}/attendances`)
        .then(res => {
            if (res.status === 200) {
                if (res.data.length <= 0) {
                    console.log("[Attendance.Screen.js | FETCH ATTENDANCE | GET status = 200 ] -> No students found")
                } else {
                    console.log("[Attendance.Screen.js | FETCH ATTENDANCE | GET status = 200 ] -> Students found, updated state")
                    let parsedEnrollments = this.parseFetchedEnrollmentToObject(res.data);
                    this.setState({enrollments: parsedEnrollments});
                }
            }
            else console.log("[Attendance.Screen.js | FETCH ATTENDANCE | GET status = 400 ] No enrollments found");
        }).catch(error => { console.log("[Attendance.Screen.js |  FETCH ATTENDANCE |GET request issue]:" +`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/sessions/${this.state.sessionId}/attendances`) })
    }

     async _fetchSessionInfo() {
        console.log("[Attendance.Screen.js] : FETCH SESSION") 
        await Axios.get(`${ApiConfig.dataApi}/sessions/${this.state.sessionId}`)
        .then(async res => {
            console.log(res.data.SessionTopic);
            await this.setState({
                date: res.data.SessionDate.format("MMM-DD-YYYY"),
                topic: res.data.SessionTopic
            });
        }).catch(error => error)
    }

    parseFetchedEnrollmentToObject(enrollmentData) {
        let parsedEnrollments = [];
        enrollmentData.forEach(enrollment => {
            let attendance = false;
            if (enrollment.Attended === "true") attendance = true;
            let student = {
                Attended: attendance,
                StudentId: enrollment.StudentId,
                StudentName: enrollment.StudentName
            };
            console.log(student.StudentName);
            parsedEnrollments.push(student);
        });
        parsedEnrollments.sort((a, b) => a.StudentName.localeCompare(b.StudentName));

        return parsedEnrollments;
    }

    toogleUpdate(){
        this.updateAttendance();
        this.setState({updatingModalstate: true});
        
    }

    editSession(modalScreen){
        this.props.navigation.navigate(modalScreen, {session: this.state.sessionId, oldDate: this.state.date, oldTopic: this.state.topic});
    }

    toogleSpinnerOff(){ this.setState({updatingModalstate: false}) }

    toggleNotificationOff() { this.setState({responseStatusModal: false, responseSuccess: false}) }

    render() {
        const {navigation} = this.props;
        const cameraIcon = (props) => ( <Icon {...props} name='camera-outline'/> );
        const editIcon = (props) => ( <Icon {...props} name='edit-2-outline'/> );
        let refreshing = false;

        const onRefresh = () => {
            refreshing = true;

            this._setCurrentSessionData().then(() => refreshing = false);

            // wait(2000).then(() => refreshing = false);
        };

        const studentAttendanceItem = ({ item, index }) => (
            <ListItem
              title={`${item.StudentName}`}
              onPress={() => this.checkStudent(index, !this.state.enrollments[index].Attended)}
              accessoryLeft={() => {
                if (this.state.enrollments[index].Attended) return <CheckBox checked={true} onChange={() => this.checkStudent(index, false)} />
                else return <CheckBox checked={false} onChange={() => this.checkStudent(index,true)} />
              }}
            />
        );

        const descriptionRowText = (label, description) => (
            <View style={styles.row}>
                <Text style={styles.attendanceDescriptionText_Label} category='s1'>{label} </Text>
                <Text style={{fontSize: 14}} category="p1">{description}</Text>
            </View>
        );

        const updateButton = () => {
            if (this.state.isUpdated){
                 return <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Button style={{width:"70%"}} onPress={() => this.toogleUpdate()} size='large' appearance="filled" status="success"> Update Attendance </Button>
                </View>
                }
        }

        const updateSuccessCard = (status, text) => (
            <Card disabled={true}>
                <Text style={styles.modalText} status={status}>{text}</Text> 
                <Button appearance='outline' size={'small'} onPress={() => this.toggleNotificationOff()} status={status}>
                    OK
                </Button>
            </Card>
        )

        const updateModal = () => (
            <Modal
                visible={this.state.responseStatusModal}
                style={styles.popOverContent}
                onBackdropPress={() => this.toggleNotificationOff()}>
                { (this.state.responseSuccess) ?
                    updateSuccessCard("success", "Attendance updated successfuly") :
                    updateSuccessCard("danger", "Something went wrong. Please, try again.")
                }
            </Modal>)

        const spinnerCard = () => (
            <Card disabled={true}>
                <Spinner size='large' status='primary'/>
             </Card>
        )

        const updatingModal = () => (
            <Modal
                style={styles.popOverContent}
                visible={this.state.updatingModalstate}
                backdropStyle={styles.backdrop}>
                    {spinnerCard()}
            </Modal>
        )
        
        const descriptionArea = () => (
            <Layout style={{padding: 5}}level="2">
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                    }
                >
                <View style={styles.row}>
                    <View style={styles.column}>
                        {descriptionRowText("Team:",this.state.teamName)}
                        {descriptionRowText("Session Type:",this.state.topic)}
                        {descriptionRowText("Date:", this.state.date)}
                        {descriptionRowText("Students:", this.state.numberOfStudents)}
                    </View>
                </View>
                </ScrollView>
                <Divider/>
            </Layout>
        );

        return(
            <Layout style={{ flex: 1}} level="1">
                <Button style={{width:"100%"}} 
                    appearance='ghost' 
                    status='primary' 
                    accessoryLeft={cameraIcon} 
                    onPress={() => navigation.navigate("Scan students QR", {
                            enrollments: this.state.enrollments,
                            checkStudentById: this.checkStudentById
                        }
                    )}
                >
                    SCAN QR CODE
                </Button> 
                <Divider/>
                {descriptionArea()}
                {updateModal()}
                {updateButton()}
                {updatingModal()}
                <Divider/>
                <List
                    style={{width: "100%"}}
                    data={this.state.enrollments}
                    ItemSeparatorComponent={Divider}
                    renderItem={studentAttendanceItem}
                    />
                    <Button style={{width:'100%'}} status="primary" accessoryLeft={editIcon} onPress={() => this.editSession("EditSessionModal")}>EDIT SESSION</Button>
                    
            </Layout>
        )
    }
};

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user  });
  
const ActionCreators = Object.assign( {}, { syncSessions, updateSession } );
  
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceScreen);

const styles = StyleSheet.create({
    attendanceDescriptionText_Label: {
        margin: 2,
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flexDirection: "column"
    },
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
    },
    scrollView: {
        // flex: 1,
        // backgroundColor: 'pink',
        
      }
});
