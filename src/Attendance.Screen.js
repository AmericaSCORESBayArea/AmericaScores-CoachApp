import React, { Component } from 'react';
import { Layout,CheckBox, Button, Divider, Icon, List, ListItem, Text, Modal, Card } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

import { connect } from 'react-redux';
import { syncSessions, updateSession } from "./Redux/actions/Session.actions";
import { bindActionCreators } from 'redux';
import Axios from 'axios';
import { ApiConfig } from './config/ApiConfig';

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

        if (currentSession) {            
            const newState = {
                sessionId: currentSession.Sessions[0].SessionId,
                enrollments: currentSession.Enrollments,
                teamName: currentSession.TeamSeasonName,
                teamSeasonId: currentSession.Sessions[0].TeamSeasonId,
                completeTeamSeasonId: currentSession.TeamSeasonId,
                topic: currentSession.Sessions[0].SessionTopic,
                date: currentSession.Sessions[0].SessionDate,
                numberOfStudents: Number(currentSession.TotalNoOfPlayers),
            }

            await this.setState(newState);
            await this._fetchGetEnrollments();
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
                if (res.status === 200) this.setState({responseSuccess: true, isUpdated: false, responseStatusModal: true})
                else this.setState({responseStatusModal: true})
            }).catch(error => {
                this.setState({responseStatusModal: true});
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

    toggleNotificationOff() { this.setState({responseStatusModal: false, responseSuccess: false}) }

    render() {
        const {navigation} = this.props;
        const cameraIcon = (props) => ( <Icon {...props} name='camera-outline'/> );

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
            if (this.state.isUpdated) return <Button style={{flex:1}} onPress={() => this.updateAttendance()} appearance="outline" status="success"> Updated Attendance </Button>
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
        
        const descriptionArea = () => (
            <Layout style={{padding: 5}}level="2">
                <View style={styles.row}>
                    <View style={styles.column}>
                        {descriptionRowText("Team",this.state.teamName)}
                        {descriptionRowText("Class",this.state.topic)}
                        {descriptionRowText("Date", this.state.date)}
                        {descriptionRowText("Students", this.state.numberOfStudents)}
                    </View>
                </View>
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
                <List
                    style={{width: "100%"}}
                    data={this.state.enrollments}
                    ItemSeparatorComponent={Divider}
                    renderItem={studentAttendanceItem}
                    />

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
    }
});
