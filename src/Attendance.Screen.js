import React, { Component} from 'react';
import { Layout,CheckBox, Button, Divider, Icon, List, ListItem, Text, Modal, Card, Spinner  } from '@ui-kitten/components';
import { StyleSheet, View, RefreshControl, ScrollView, Image, ImageBackground, Alert } from 'react-native';
import { connect} from 'react-redux';
import { syncSessions, updateSession} from "./Redux/actions/Session.actions";
import {UnsavedAttendance} from "./Redux/actions/UnsavedAttendance.actions";
import { bindActionCreators } from 'redux';
import Axios from 'axios';
import { ApiConfig } from './config/ApiConfig';
import moment from "moment";
import {isEqual} from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
            regionCoach:this.props.sessionScreen.region,
            arrowSession: undefined,
            loadingModalRecords:false
        }
    }
    
    /*import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
    <MaterialCommunityIcons name={'clipboard-pulse-outline'} size={25} color={'#4f5c63'} /> Assessment icon*/ 

    componentDidMount() {
        this.setState({auxRedux: []});
        this._setCurrentSessionData();
    }
    
    // componentWillMount() {
    //     this._setCurrentSessionData();
    // }
    ForwardArrow() {
        const {route} = this.props;
        (route.params.activitiesRegion).map(value =>{
            if(value.Sessions !== null){
                value.Sessions.map(val =>{
                    if(val.SessionId === this.state.sessionId){
                        var posAc=(route.params.activitiesRegion).indexOf(value)
                        if((route.params.activitiesRegion[posAc].Sessions).length >= 1){
                            var pos=(route.params.activitiesRegion[posAc].Sessions.indexOf(val))
                            if(pos === 0){
                                if(posAc === 0){
                                    Alert.alert('','No following sessions found.\nTry adjusting the date range in the Sessions Calendar.')
                                }else{
                                    var ACPos=posAc-1
                                    while(route.params.activitiesRegion[ACPos].Sessions === null){
                                        ACPos=ACPos-1;
                                        if(ACPos < 0){
                                            break;
                                        }
                                    }
                                    if(ACPos < 0){
                                        Alert.alert('','No following sessions found.\nTry adjusting the date range in the Sessions Calendar.')
                                    }else{
                                        this.setState({auxRedux: []});
                                        var cont=posAc-1;
                                        while(route.params.activitiesRegion[cont].Sessions === null){
                                            cont=cont-1
                                        }
                                        if(cont !== posAc-1 ){
                                            var backlong=route.params.activitiesRegion[cont].Sessions.length;
                                            this.setState({ arrowSession: route.params.activitiesRegion[cont].Sessions[backlong-1] });
                                        }else{
                                            var backlong=route.params.activitiesRegion[posAc-1].Sessions.length;
                                            this.setState({ arrowSession: route.params.activitiesRegion[posAc-1].Sessions[backlong-1] });
                                        }
                                        this.setState({loadingModalstate:true});
                                        this._setCurrentSessionData();
                                    }
                                }
                            }else{
                                this.setState({auxRedux: []});
                                this.setState({ arrowSession: route.params.activitiesRegion[posAc].Sessions[pos-1] });
                                this.setState({loadingModalstate:true});
                                this._setCurrentSessionData();
                            }
                        }
                    }
                })
            }
        })
    };

    backArrow() {
        const {route} = this.props;
        (route.params.activitiesRegion).map(value =>{
            if(value.Sessions !== null){
                value.Sessions.map(val =>{
                    if(val.SessionId === this.state.sessionId){
                        var posAc=(route.params.activitiesRegion).indexOf(value);
                        if((route.params.activitiesRegion[posAc].Sessions).length >= 1){
                            var pos=(route.params.activitiesRegion[posAc].Sessions.indexOf(val));
                            var long=route.params.activitiesRegion[posAc].Sessions.length;
                            var aclong=route.params.activitiesRegion.length;
                            if(aclong === 1){
                                if(posAc === aclong-1){
                                    if(pos === long-1){
                                        Alert.alert('','No previous sessions found.\nTry adjusting the date range in the Sessions Calendar.')
                                    }else{
                                        this.setState({auxRedux: []});
                                        this.setState({ arrowSession: route.params.activitiesRegion[posAc].Sessions[pos+1] });
                                        this.setState({loadingModalstate:true});
                                        this._setCurrentSessionData();
                                    }
                                }else{
                                    this.setState({auxRedux: []});
                                    var cont=posAc+1;
                                    while(route.params.activitiesRegion[cont].Sessions[0] === null){
                                        cont=cont+1
                                        if(cont > aclong-1){
                                            break;
                                        }
                                    }
                                    if(cont > aclong){
                                        Alert.alert('','No previous sessions found.\nTry adjusting the date range in the Sessions Calendar.')
                                    }else{
                                        if(cont!==posAc+1){
                                            this.setState({ arrowSession: route.params.activitiesRegion[cont].Sessions[0] });
                                        }else{
                                            this.setState({ arrowSession: route.params.activitiesRegion[posAc+1].Sessions[0] });
                                        }
                                        this.setState({loadingModalstate:true});
                                        this._setCurrentSessionData();
                                    }
                                }
                            }else{
                                if(pos === long-1){
                                    if(posAc === aclong-1){
                                        Alert.alert('','No previous sessions found.\nTry adjusting the date range in the Sessions Calendar.')
                                    }else{
                                        var cont=posAc+1;
                                        while(route.params.activitiesRegion[cont].Sessions === null){
                                            cont=cont+1
                                            if(cont > aclong-1){
                                                break;
                                            }
                                        }
                                        if(cont > aclong-1){
                                            Alert.alert('','No previous sessions found.\nTry adjusting the date range in the Sessions Calendar.')
                                        }else{
                                            if(cont!==posAc+1){
                                                this.setState({ arrowSession: route.params.activitiesRegion[cont].Sessions[0] });
                                            }else{
                                                this.setState({ arrowSession: route.params.activitiesRegion[posAc+1].Sessions[0] });
                                            }
                                            this.setState({auxRedux: []});
                                            this.setState({loadingModalstate:true});
                                            this._setCurrentSessionData();
                                        }
                                    }
                                }else{
                                    this.setState({auxRedux: []});
                                    this.setState({ arrowSession: route.params.activitiesRegion[posAc].Sessions[pos+1] });
                                    this.setState({loadingModalstate:true});
                                    this._setCurrentSessionData();
                                }
                            }
                        }
                    }
                })
            }
        })
    };

    formatEnrollmentsToRequest(enrollments) {
        let studentsList = [];
            
        enrollments.forEach(student => {
            let attendance = false;
            let attendanceId = "";
            console.log(student)
            if (student.AttendanceId) attendanceId = student.AttendanceId;
            if (student.Attended) attendance = true; 

            studentsList.push({
                AttendanceId: attendanceId,
                Attended: attendance,
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
        var currentSession = await this.props.sessions.sessions.find(session => session.TeamSeasonId === route.params.teamSeasonId);
        var currentSessionData = await currentSession.Sessions.find(session => session.SessionId === route.params.sessionId);
        if( this.state.arrowSession !== undefined){
            var currentSession = await this.props.sessions.sessions.find(session => session.TeamSeasonId === this.state.arrowSession.TeamSeasonId);
            var currentSessionData = await currentSession.Sessions.find(session => session.SessionId === this.state.arrowSession.SessionId);
        }
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
                enrollments: [],
                teamName: currentSession.TeamSeasonName,
                teamSeasonId: currentSession.Sessions[0].TeamSeasonId,
                completeTeamSeasonId: currentSession.TeamSeasonId,
                topic: currentTopic,
                date: moment(currentDate).format("MMM-DD-YYYY"),
                numberOfStudents: 0,
                missingEnrollments: [],
            }
            await this.setState(newState);
            await this._fetchGetEnrollments();
            await this.verifyAttendance();

            if(this.props.sessionAttendance.sessionsAttendance !== undefined){
                console.log("redux",this.props.sessionAttendance.sessionsAttendance)
            }
            if(this.props.sessionAttendance.sessionsAttendance.length !== 0){
                if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                    this.props.sessionAttendance.sessionsAttendance.map((valueredux) =>{
                        console.log(valueredux)
                        if(valueredux.SessionId === currentSessionData.SessionId){
                            this.setState({nomatchattendance:true})
                            this.state.enrollments.map((value) =>{
                                //value.Attended = false
                                valueredux.attendanceList.map((redux) =>{
                                    if(value.StudentId === redux.StudentId){
                                        value.Attended = redux.Attended
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
                                    //value.Attended=false
                                    valueredux.attendanceList.map((redux) =>{
                                        if(value.StudentId === redux.StudentId){
                                            value.Attended = redux.Attended
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
                                    //value.Attended=false
                                }
                                { () => this.studentAttendanceItem(this.state.enrollments) }
                            })
                    }
                }
                await this._fetchSessionInfo();
                if(this.state.enrollments.length !== 0){
                    this.setState({nomatchModalVisibility: false})
                }else{
                    this.setState({nomatchModalVisibility: true})
                }
            }else{
                if(this.state.enrollments.length !== 0){
                    this.setState({nomatchModalVisibility: false})
                    this.state.enrollments.map((value) =>{
                        if(value.Attended !== undefined){
                            //value.Attended = false
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

    async createMissingAttendance(attendanceRecords) {
        //this.setState({loadingModalstate:true});
        await Axios.post(
            `${ApiConfig.dataApi}/attendances`,
            attendanceRecords
        ).then(res => {
            if (res.status === 200){ 
               // Alert.alert("Success", "Attendance records created succesfully. Pull down to refresh");
                this._setCurrentSessionData();
                setTimeout(() => {this.setState({loadingModalRecords:false})}, 3500);
        }
        }).catch(error => {
            this.setState({loadingModalRecords:false});
            console.log("SOMETHING HAPPENED")
            throw error;
        })
    }
    
    async verifyAttendance() {
        const {user} = this.props.user;
        console.log("[Attendance.Screen.js] : FETCH ENROLLMENTS");
        await Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/enrollments`)
        .then(async res => {
            if (res.status === 200) {
                if (res.data.length <= 0) {
                    console.log("[Attendance.Screen.js | FETCH ENROLLMENTS | GET status = 200 ] -> No students found");
                } else {
                    console.log("[Attendance.Screen.js | FETCH ENROLLMENTS | GET status = 200 ] -> Students found, updated state");
                    // console.log(res.data);
                    const verifiedEnrollments = await this.parseFetchedAttendanceToObject(res.data);
                    // console.log(verifiedEnrollments);
                    // this.setState({missingEnrollments: verifiedEnrollments});
                    if(verifiedEnrollments.length > 0){
                        let missingEnrollments = [];
                        await verifiedEnrollments.map(async enrollment => {
                            let studentRecord = {
                                SessionId: this.state.sessionId,
                                StudentId: enrollment.StudentId,
                                Attended: false
                            }
                            missingEnrollments.push(studentRecord);
                        })
                        this.setState({loadingModalstate:false});
                        this.setState({loadingModalRecords:true});
                        this.createMissingAttendance(missingEnrollments)
                        //Alert.alert("Attendance records missing",`The following attendance records are missing ${verifiedEnrollments.map((value) => {return value.StudentName})}, touch "OK" to create them`,[{ text: "OK", onPress: () => this.createMissingAttendance(missingEnrollments) }]);
                    }
                }
            }
            else {console.log("[Attendance.Screen.js | CREATE MISSING RECORDS | GET status = 400 ] Something went wrong");}
        }).catch(error => { console.log("[Attendance.Screen.js |  FETCH ENROLLMENTS |GET request issue]:" +`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/enrollments`,error) })
    }

    async parseFetchedAttendanceToObject(enrollmentData) {
        let parsedEnrollments = [];
        let parsedAttendance = [];
        const attendanceList = await this.state.enrollments;
        await attendanceList.map(async attendance =>{
            let attendancetStudent = {
                StudentId: attendance.StudentId,
            };
            if(enrollmentData.find(element => element.StudentId === attendance.StudentId) === undefined){
                const index = await attendanceList.findIndex(value => value.StudentId === attendance.StudentId);
                attendanceList.splice(index, 1);
            }
            parsedAttendance.push(attendancetStudent);
        })
        this.setState({enrollments: attendanceList, numberOfStudents: attendanceList.length});
        await enrollmentData.map(async enrollment =>{
            if(parsedAttendance.find(element => element.StudentId === enrollment.StudentId) === undefined){
                let enrollmentStudent = {
                    StudentId: enrollment.StudentId,
                    StudentName: enrollment.StudentName
                };
                parsedEnrollments.push(enrollmentStudent);
            }
        })
        
        console.log(parsedAttendance, parsedEnrollments)
        return parsedEnrollments;
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
        var currentSession = this.props.sessions.sessions.find(session => session.TeamSeasonId === route.params.teamSeasonId);
        var currentSessionData = currentSession.Sessions.find(session => session.SessionId === route.params.sessionId);
        if( this.state.arrowSession !== undefined){
            var currentSession = this.props.sessions.sessions.find(session => session.TeamSeasonId === this.state.arrowSession.TeamSeasonId);
            var currentSessionData = currentSession.Sessions.find(session => session.SessionId === this.state.arrowSession.SessionId);
        }
        newEnrollments.map((value) =>{
            if(value.Attended !== undefined){
               /* if(value.Attended === true){*/
                    if(this.state.attendanceListRedux.filter((attendance) =>(attendance.StudentId.match(value.StudentId))).length !== 0){
                    }else{
                        this.state.attendanceListRedux.push(value)
                    }
               /* }*/
                /*else{
                    if(this.state.attendanceListRedux.filter((attendance) =>(attendance.StudentId.match(value.StudentId))).length !== 0){
                        const index = this.state.attendanceListRedux.indexOf(value);
                        if (index > -1) {
                            this.state.attendanceListRedux.splice(index, 1);//saving a new array with all students with value True for attendence
                        }
                    }
                }*/
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
            actions.UnsavedAttendance(this.state.auxRedux)
            //this.setState({isUpdated: false})
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
        console.log(enrollments)
        const {user} = this.props.user;
        Axios.patch(
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
        console.log("[Attendance.Screen.js] : FETCH ATTENDANCE");
        console.log(this.state.sessionId)
        await Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/sessions/${this.state.sessionId}/attendances`)
        .then(async res => {
            if (res.status === 200) {
                if (res.data.length <= 0) {
                    console.log("[Attendance.Screen.js | FETCH ATTENDANCE | GET status = 200 ] -> No students found")
                } else {
                    console.log("[Attendance.Screen.js | FETCH ATTENDANCE | GET status = 200 ] -> Students found, updated state")
                    console.log(res.data)
                    let parsedEnrollments = await this.parseFetchedEnrollmentToObject(res.data);
                    await this.setState({enrollments: parsedEnrollments, numberOfStudents: res.data.length});
                }
            }
            else {console.log("[Attendance.Screen.js | FETCH ATTENDANCE | GET status = 400 ] No enrollments found");}
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

    async parseFetchedEnrollmentToObject(enrollmentData) {
        let parsedEnrollments = [];
        enrollmentData.forEach(enrollment => {
            let attendance = false;
            if (enrollment.Attended === "true") attendance = true;
            let student = {
                Attended: attendance,
                StudentId: enrollment.StudentId,
                StudentName: enrollment.StudentName,
                AttendanceId: enrollment.AttendanceId
            };
            parsedEnrollments.push(student);
        });
        parsedEnrollments.sort((a, b) => a.StudentName.localeCompare(b.StudentName));

        return parsedEnrollments;
    }
    LoadingGif = () =>{
        if(this.props.sessionScreen.region === "ASBA"){
            return require('../assets/Scores_Logo.gif');//Scores logo gif
        }else if(this.props.sessionScreen.region === "IFC"){
            return require('../assets/IFC_Logo_animated.gif');//IFC logo gif
        }else if(this.props.sessionScreen.region === "OGSC"){
            return require('../assets/OGSC_logo_spinner.gif');//Genesis logo gif
        }
    }
    toogleUpdate(){
        const { actions } = this.props;
        const {route} = this.props;
        this.setState({auxRedux: []});
        this.updateAttendance();
        var currentSession = this.props.sessions.sessions.find(session => session.TeamSeasonId === route.params.teamSeasonId);
        var currentSessionData = currentSession.Sessions.find(session => session.SessionId === route.params.sessionId);
        if( this.state.arrowSession !== undefined){
            var currentSession =  this.props.sessions.sessions.find(session => session.TeamSeasonId === this.state.arrowSession.TeamSeasonId);
            var currentSessionData = currentSession.Sessions.find(session => session.SessionId === this.state.arrowSession.SessionId);
        }
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
        const forwardIcon = (props) => ( <Icon {...props} name='arrow-ios-forward-outline' /> );
        const backIcon = (props) => ( <Icon {...props} name='arrow-ios-back-outline' /> );
        //const assessmentIcon = () => ( <MaterialCommunityIcons name={'clipboard-pulse-outline'} size={25} color={'#4f5c63'} /> );
        let refreshing = false;

        const onRefresh = () => {
            this.setState({loadingModalstate: true});
            refreshing = true;
            this._setCurrentSessionData().then(() => refreshing = false);
            setTimeout(() => {this.setState({loadingModalstate:false})}, 3500);
            // wait(2000).then(() => refreshing = false);
        };

        const studentAttendanceItem = ({ item, index }) => (
            <ListItem
              title={`${item.StudentName}`}
              //onPress={() => this.checkStudent(index, !this.state.enrollments[index].Attended)}
              accessoryLeft={() => {
                if (this.state.enrollments[index].Attended) return <CheckBox checked={true} onChange={() => this.checkStudent(index, false)} />
                else return <CheckBox checked={false} onChange={() => this.checkStudent(index,true)} />
              }}
              accessoryRight={() => {
                const {route} = this.props;
                const {user} = this.props.user;
                var currentSession = this.props.sessions.sessions.find(session => session.TeamSeasonId === route.params.teamSeasonId);
                var currentSessionData = currentSession.Sessions.find(session => session.SessionId === route.params.sessionId);
                return <MaterialCommunityIcons name={'clipboard-pulse-outline'} size={25} color={'#4f5c63'} onPress={() => this.props.navigation.navigate('assessmentModal', {
                Student: item, User: user, Session: currentSessionData})}/>}}
            />
        );

        const descriptionRowText = (label, description) => (
            <View style={styles.row}>
                <Text style={styles.attendanceDescriptionText_Label} category='s1'>{label} </Text>
                <Text style={{fontSize: 14}} category="p1">{description}</Text>
            </View>
        );
        const descriptionRowTextDate = (label, description) => (
            <View style={styles.row}>
                <Text style={styles.attendanceDescriptionText_Label} category='s1'>{label} </Text>
                {(moment().format("MM-DD-YYYY") === moment(description).format("MM-DD-YYYY"))?
                    <Text style={{fontSize: 14}} category="p1">Today, {description}</Text>:
                    <Text style={{fontSize: 14}} category="p1">{description}</Text>
                }
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
                {description === "Soccer" ?
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
        const SuccessHeader = (props) => (
            <Layout {...props}>
                 <ImageBackground
                    resizeMode="contain"
                    style={{height:100, width:100, alignSelf:"center"}}
                    source={require('../assets/success_icon.png')}
                />
            </Layout>
        );
        const UnsuccessHeader = (props) => (
            <Layout {...props}>
                 <ImageBackground
                    resizeMode="contain"
                    style={{height:100, width:100, alignSelf:"center"}}
                    source={require('../assets/error_icon.png')}
                />
            </Layout>
        );
        const updateSuccessCard = (status, text) => (
            <Card disabled={true} header={SuccessHeader}>
                <Text style={styles.modalText} status={status}>{text}</Text> 
                <Button appearance='outline' size={'small'} onPress={() => {this.toggleNotificationOff(),onRefresh()}} status={status}>
                    OK
                </Button>
            </Card>
        );
        const updateUnSuccessCard = (status, text) => (
            <Card disabled={true} header={UnsuccessHeader}>
                <Text style={styles.modalText} status={status}>{text}</Text> 
                <Button appearance='outline' size={'small'} onPress={() => this.toggleNotificationOff()} status={status}>
                    OK
                </Button>
            </Card>
        );

        const updateModal = () => (
            <Modal
                visible={this.state.responseStatusModal}
                style={styles.popOverContent}
                onBackdropPress={() => this.toggleNotificationOff()}>
                { (this.state.responseSuccess) ?
                    updateSuccessCard("success", "Attendance updated successfuly") :
                    updateUnSuccessCard("danger", "Something went wrong. Please, try again.")
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
            <Modal
                style={styles.popOverContentModal}
                visible={this.state.loadingModalstate}
                backdropStyle={styles.backdrop}>
                <Image source={this.LoadingGif()}/>
                {this.state.date === undefined ?
                null:
                <View style={{backgroundColor: "rgba(0, 0, 0, 0.3)",  alignItems: 'center',alignSelf:'center', borderRadius:10, padding:'10%'}}>
                    <Text status='control' category='h6' style={{textAlign:'center'}}>{this.state.teamName}</Text>
                    {(moment().format("MM-DD-YYYY") === moment(this.state.date).format("MM-DD-YYYY"))?
                    <Text status='control' category='h6' style={{marginTop:'5%'}}>Today, {this.state.date}</Text>:
                    <Text status='control' category='h6' style={{marginTop:'5%'}}>{this.state.date}</Text>
                }
                </View>}
            </Modal>
        )
        const loadingModalRecords = () => (
            <Modal
                style={styles.popOverContentModal}
                visible={this.state.loadingModalRecords}
                backdropStyle={styles.backdrop}>
                <Image source={this.LoadingGif()}/>
                {this.state.date === undefined ?
                null:
                <View style={{backgroundColor: "rgba(0, 0, 0, 0.3)",  alignItems: 'center',alignSelf:'center', borderRadius:10, padding:'10%'}}>
                    <Text status='control' category='h6' style={{textAlign:'center'}}>Updating Attendance Records...</Text>
                    <Text status='control' category='h6' style={{textAlign:'center'}}>{this.state.teamName}</Text>
                    {(moment().format("MM-DD-YYYY") === moment(this.state.date).format("MM-DD-YYYY"))?
                    <Text status='control' category='h6' style={{marginTop:'5%'}}>Today, {this.state.date}</Text>:
                    <Text status='control' category='h6' style={{marginTop:'5%'}}>{this.state.date}</Text>
                }
                </View>}
            </Modal>
        )
        const noMatch = (status) => (
            (
                (this.state.nomatchModalVisibility) &&
                <Card style={{opacity: 0.9}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center'}}>
                        Please ensure that the enrollments and the attendance records have been created for this Team/Session.
                    </Text>
                </Card>
            )
        );
        const buttonColor = () =>{
            if(this.props.sessionScreen.region === "ASBA"){
                return "#00467F"
            }else{
                return "#001541"
            }
        }
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
                            {descriptionRowTextDate("Date:", this.state.date)}
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
                {loadingModalRecords()}
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
                <View style={styles.row}>
                    <Button style={{width:'17%', backgroundColor: buttonColor(), marginRight:'2%'}} status="primary" accessoryLeft={backIcon} onPress={() => this.backArrow()}></Button>
                    <Button style={{width:'62%',alignSelf: 'center', backgroundColor: buttonColor()}} status="primary" accessoryLeft={editIcon} onPress={() => this.editSession("EditSessionModal")}>EDIT SESSION</Button>
                    <Button style={{width:'17%', backgroundColor: buttonColor(), marginLeft: '2%'}} status="primary" accessoryLeft={forwardIcon} onPress={() => this.ForwardArrow()}></Button>
                </View>
            </Layout>
        )
    }
};

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user, sessionAttendance: state.sessionAttendance, sessionScreen: state.sessionScreen });
  
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
    popOverContentModal: {
       // flexDirection: 'row',
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
    backdropModal:{
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
    },
    scrollView: {
        // flex: 1,
        // backgroundColor: 'pink',
        
      }
});
