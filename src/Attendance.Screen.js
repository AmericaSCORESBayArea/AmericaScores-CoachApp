import React, { Component } from 'react';
import { Layout,CheckBox, Button, Divider, Icon, List, ListItem, Text, Modal, Card, Spinner  } from '@ui-kitten/components';
import { StyleSheet, View, RefreshControl, ScrollView, Image, Animated, Easing } from 'react-native';

import { connect } from 'react-redux';
import { syncSessions, updateSession} from "./Redux/actions/Session.actions";
import {UnsavedAttendance} from "./Redux/actions/UnsavedAttendance.actions";
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
            nomatchModalVisibility:false,
            attendanceListRedux:[],
            auxRedux: [],
            nomatchattendance:false,
            loadingModalstate:true,
            opacity: new Animated.Value(1)
        }
    }
    

    componentDidMount() {
        this.setState({auxRedux: []});
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
        const currentSessionData = currentSession.Sessions.find(session => session.SessionId === route.params.sessionId);
        let currentDate = moment();
        let currentTopic = "";
        
        if (currentSession) {
            console.log("[Attendance.Screen.js] : FETCH SESSION") 
            await Axios.get(`${ApiConfig.dataApi}/sessions/${currentSessionData.SessionId}`)
            .then(async res => {
                console.log(res.data.SessionTopic);
                currentDate = res.data.SessionDate;
                currentTopic = res.data.SessionTopic.replace(/_/g,' ');
            }).catch(error => error)
            const newState = {
                sessionId: currentSessionData.SessionId,
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
            if(this.props.sessionAttendance.sessionsAttendance !== undefined){
                console.log("redux",this.props.sessionAttendance.sessionsAttendance)
            }
            if(this.props.sessionAttendance.sessionsAttendance.length !== 0){
                if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                    this.props.sessionAttendance.sessionsAttendance.map((valueredux) =>{
                        if(valueredux.SessionId === currentSessionData.SessionId){
                            this.setState({nomatchattendance:true})
                            this.state.enrollments.map((value) =>{
                                value.Attended = false
                                valueredux.attendanceList.map((redux) =>{
                                    if(value.StudentId === redux.StudentId){
                                        value.Attended = true
                                    }
                                });
                            });
                            this.setState({isUpdated: true})
                        }
                    });
                }else{
                        this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) =>{
                            if(valueredux.SessionId === currentSessionData.SessionId){
                                this.setState({nomatchattendance:true})
                                this.state.enrollments.map((value) =>{
                                    value.Attended=false
                                    valueredux.attendanceList.map((redux) =>{
                                        if(value.StudentId === redux.StudentId){
                                            value.Attended = true
                                            }
                                        });
                                });
                                this.setState({isUpdated: true})
                            }
                        })
                    }
                    if(this.state.nomatchattendance === false){
                        if(this.state.enrollments !== null){
                            this.state.enrollments.map((value) =>{
                                if(value.Attended !== undefined){
                                    value.Attended=false
                                }
                                { () => this.studentAttendanceItem(this.state.enrollments) }
                            })
                    }
                }
                await this._fetchSessionInfo();
                if(this.state.enrollments !== null){
                    this.setState({nomatchModalVisibility: false})
                }else{
                    this.setState({nomatchModalVisibility: true})
                }
            }else{
                if(this.state.enrollments !== null){
                    this.setState({nomatchModalVisibility: false})
                    this.state.enrollments.map((value) =>{
                        if(value.Attended !== undefined){
                            value.Attended = false
                        }
                    });
                }else{
                    this.setState({nomatchModalVisibility: true})
                    this.setState({loadingModalstate:false});
                }
                await this._fetchSessionInfo();
            }
        this.setState({loadingModalstate:false});
        }
        this.setState({loadingModalstate:false});
    }
    

    //In order to apply changes to the state list we need to clone it, modify and put it back into state (Is not effective but thats how react works)
    checkStudent(index, value) {
        const { actions } = this.props;
        const {route} = this.props;
        let newEnrollments = [...this.state.enrollments]; //Get the new list
        //Change the student attendance
        this.setState({auxRedux: []})
        if (value) newEnrollments[index].Attended = true;
        else newEnrollments[index].Attended = false;
        const currentSession = this.props.sessions.sessions.find(session => session.TeamSeasonId === route.params.teamSeasonId);
        const currentSessionData = currentSession.Sessions.find(session => session.SessionId === route.params.sessionId);
        newEnrollments.map((value) =>{
            if(value.Attended !== undefined){
                if(value.Attended === true){
                    if(this.state.attendanceListRedux.filter((attendance) =>(attendance.StudentId.match(value.StudentId))).length !== 0){
                    }else{
                        this.state.attendanceListRedux.push(value)
                    }
                }
                else{
                    if(this.state.attendanceListRedux.filter((attendance) =>(attendance.StudentId.match(value.StudentId))).length !== 0){
                        const index = this.state.attendanceListRedux.indexOf(value);
                        if (index > -1) {
                            this.state.attendanceListRedux.splice(index, 1);//saving a new array with all students with value True for attendence
                        }
                    }
                }
            }
        });
        if(this.state.attendanceListRedux.length !== 0){//checking if there is any attendance to update
            if(String(this.props.sessionAttendance.sessionsAttendance).length !== 0){
                if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                    this.props.sessionAttendance.sessionsAttendance.map((valueredux) =>{
                        if(valueredux !== undefined){
                            if(valueredux.SessionId === currentSessionData.SessionId){
                                    const index =this.props.sessionAttendance.sessionsAttendance.indexOf(valueredux)
                                    if (index > -1) {
                                        this.props.sessionAttendance.sessionsAttendance.splice(index, 1);//saving a new array with all students with value True for attendence
                                    }
                                }
                            }
                        });
                    }else{
                        this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) =>{
                            if(valueredux !== undefined){
                                if(valueredux.SessionId === currentSessionData.SessionId){
                                        const index =this.props.sessionAttendance.sessionsAttendance[0].indexOf(valueredux)
                                        if (index > -1) {
                                            this.props.sessionAttendance.sessionsAttendance[0].splice(index, 1);//saving a new array with all students with value True for attendence
                                        }
                                    }
                                }
                            })
                    }
                if(String(this.props.sessionAttendance.sessionsAttendance).length !== 0){
                    if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                        this.props.sessionAttendance.sessionsAttendance.map((valueredux) =>{
                            this.state.auxRedux.push(valueredux)
                        });
                    }else{
                        this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) =>{
                            this.state.auxRedux.push(valueredux)
                        });
                    }
                    let payloadd = {
                        SessionId: currentSessionData.SessionId,
                        attendanceList: this.state.attendanceListRedux
                    }
                    this.state.auxRedux.push(payloadd)
                    actions.UnsavedAttendance(this.state.auxRedux);
                }else{
                    let payloadd = {
                        SessionId: currentSessionData.SessionId,
                        attendanceList: this.state.attendanceListRedux
                    }
                    actions.UnsavedAttendance(payloadd);
                }
                this.setState({isUpdated: true})
            }else{
                let payloadd = {
                    SessionId: currentSessionData.SessionId,
                    attendanceList: this.state.attendanceListRedux
                }
                actions.UnsavedAttendance(payloadd);
                this.setState({isUpdated: true})
            }
        }else{
            if(String(this.props.sessionAttendance.sessionsAttendance).length !== 0){
                if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                    this.props.sessionAttendance.sessionsAttendance.map((valueredux) =>{
                        if(valueredux.SessionId !== currentSessionData.SessionId){
                            this.state.auxRedux.push(valueredux)
                        }
                    });
                }else{
                    this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) =>{
                        if(valueredux.SessionId !== currentSessionData.SessionId){
                            this.state.auxRedux.push(valueredux)
                        }
                    });
                }
            actions.UnsavedAttendance(this.state.auxRedux),
            this.setState({isUpdated: false})
            }
        }
        this.setState({enrollments: newEnrollments}) //Set the new list
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
            parsedEnrollments.push(student);
        });
        parsedEnrollments.sort((a, b) => a.StudentName.localeCompare(b.StudentName));

        return parsedEnrollments;
    }

    toogleUpdate(){
        const { actions } = this.props;
        const {route} = this.props;
        this.setState({auxRedux: []});
        this.updateAttendance();
        const currentSession = this.props.sessions.sessions.find(session => session.TeamSeasonId === route.params.teamSeasonId);
        const currentSessionData = currentSession.Sessions.find(session => session.SessionId === route.params.sessionId);
        if(this.props.sessionAttendance.sessionsAttendance.length !== 0){
            if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                this.props.sessionAttendance.sessionsAttendance.map((valueredux) =>{
                    if(valueredux !== undefined){
                        if(valueredux.SessionId === currentSessionData.SessionId){
                                const index =this.props.sessionAttendance.sessionsAttendance.indexOf(valueredux)
                                if (index > -1) {
                                    this.props.sessionAttendance.sessionsAttendance.splice(index, 1);//saving a new array with all students with value True for attendence
                                }
                            }
                        }
                });
            }else{
                this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) =>{
                    if(valueredux !== undefined){
                        if(valueredux.SessionId === currentSessionData.SessionId){
                                const index =this.props.sessionAttendance.sessionsAttendance[0].indexOf(valueredux)
                                if (index > -1) {
                                    this.props.sessionAttendance.sessionsAttendance[0].splice(index, 1);//saving a new array with all students with value True for attendence
                                }
                            }
                        }
                });
            }
            if(this.props.sessionAttendance.sessionsAttendance.length !== 0){
                if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                    this.props.sessionAttendance.sessionsAttendance.map((valueredux) =>{
                        if(valueredux.SessionId !== currentSessionData.SessionId){
                            this.state.auxRedux.push(valueredux)
                        }
                    });
                }else{
                    this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) =>{
                        if(valueredux.SessionId !== currentSessionData.SessionId){
                            this.state.auxRedux.push(valueredux)
                        }
                    });
                }
                actions.UnsavedAttendance(this.state.auxRedux),
                this.state.enrollments.map((value) =>{
                    if(value.Attended !== undefined){
                        value.Attended = false
                    }
                });
                this.setState({updatingModalstate: true});
            }
        }
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
        const descriptionRowTextImage = (label, description) => (
            <View style={styles.row}>
                <Text style={styles.attendanceDescriptionText_Label} category='s1'>{label} </Text>
                {description === "" ?
                    <Text style={{fontSize: 14}} category="p1">Unassigned</Text> 
                    :
                    <Text style={{fontSize: 14}} category="p1">{description}</Text>
                    }
                {description ==="Soccer" ?
                <Image style={{ width: 40, height: 40, resizeMode: "contain"}} source={require('../assets/Scores_Ball.png')}/>: null}
                {description ==="Soccer and Writing" ?
                <Image style={{ width: 40, height: 40, resizeMode: "contain"}} source={require('../assets/Scores_Soccer_and_writing.png')}/>: null}
                {description ==="Writing" ?
                <Image style={{ width: 40, height: 40, resizeMode: "contain"}} source={require('../assets/Scores_Pencil_Edit.png')}/>: null}
                {description ==="Game Day" ?
                <Image style={{ width: 40, height: 40, resizeMode: "contain"}} source={require('../assets/Scores_goal.png')}/>: null}
                {description ==="" ?
                <Image style={{ width: 40, height: 25, resizeMode: "contain"}} source={require('../assets/Unassigned_Session.png')}/>: null}
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
        const loadingModal = () => (
            Animated.loop(
                Animated.sequence([
                  Animated.timing(this.state.opacity, {
                    toValue: 0,
                    duration: 3500,
                    ease: Easing.linear,
                    useNativeDriver: true
                  }),
                ]),
                Animated.timing(this.state.opacity, {
                    toValue: 1,
                    duration: 2500,
                    ease: Easing.linear,
                    useNativeDriver: true
                  })
              ).start(),
            <Modal
                style={styles.popOverContent}
                visible={this.state.loadingModalstate}
                backdropStyle={styles.backdrop}>
                <Animated.Image style={{opacity: this.state.opacity,  width: 200, height: 200,resizeMode: "contain",}}
                    source={require('../assets/ASBA_Logo_Only_Removedbg.png')}
                />
            </Modal>
        )
        const noMatch = (status) => (
            (
                (this.state.nomatchModalVisibility) &&
                <Card style={{opacity: 0.9}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center'}}>
                        This Session has not been set up with a roster of students.
                    </Text>
                </Card>
            )
        );
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
                        {descriptionRowTextImage("Session Type:",this.state.topic)}
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
                {loadingModal()}
                {updateButton()}
                {updatingModal()}
                {noMatch("basic")}
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

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user, sessionAttendance: state.sessionAttendance });
  
const ActionCreators = Object.assign( {}, { syncSessions, updateSession, UnsavedAttendance } );
  
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
