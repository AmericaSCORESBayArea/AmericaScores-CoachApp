import React, { Component } from 'react';
import { Layout,CheckBox, Button, Divider, Icon, List, ListItem, Text, Popover, Modal } from '@ui-kitten/components';
import { StyleSheet, View, Image } from 'react-native';

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

    formatEnrollmentsToRequest(enrollments, sessionId) {
        let studentsList = [];
            
        enrollments.forEach(student => {
            let attendance = false;
            if (student.attended) attendance = true; 

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

    formatStateStudentsListToEnrollment() {
        console.log(this.state);
        let enrollmentList = this.state.enrollments.forEach(enrollment => {
            console.log("enrollment",enrollment)
        });
    }

    //Filters the current session and sets the student list for attendance 
    _setCurrentSessionData() {
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

            this.setState(newState);//a0q1T000008Jt3NQAS
        }
    }

    //In order to apply changes to the state list we need to clone it, modify and put it back into state (Is not effective but thats how react works)
    checkStudent(index) {
        let newEnrollments = [...this.state.enrollments]; //Get the new list
        newEnrollments[index].Attended = !this.state.enrollments[index].Attended; //Change the student attendance
        this.setState({enrollments: newEnrollments, isUpdated: true}) //Set the new list
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
                `${ApiConfig.dataApi}/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/sessions/${this.state.sessionId}/attendances`,
                enrollments
            ).then(res => {
                if (res.status === 200) this.setState({responseSuccess: true, isUpdated: false, responseStatusModal: true})
                else this.setState({responseStatusModal: true})
            }).catch(error => {
                this.setState({responseStatusModal: true});
                throw error;
            })
    }

    render() {
        const {navigation} = this.props;
        const cameraIcon = (props) => ( <Icon {...props} name='camera-outline'/> );
        const checkIcon = (props) => ( <Icon {...props} name='checkmark'/> );
        const doubledCheckedIcon = (props) => ( <Icon {...props} name='done-all' /> );

        const checkMark = (props) => {
            if (false) return checkIcon(props);
            else return doubledCheckedIcon(props);
        }

        const studentAttendanceItem = ({ item, index }) => (
            <ListItem
              title={`${item.StudentName}`}
              onPress={() => this.checkStudent(index)}
              accessoryLeft={() => {
                if (this.state.enrollments[index].Attended) return <CheckBox checked={true} onChange={() => this.checkStudent(index)} />
                else return <CheckBox checked={false} onChange={() => this.checkStudent(index)} />
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
            if (this.state.isUpdated) return (<Button onPress={() => this.updateAttendance()} appearance="outline" status="success"> Update Attendance </Button>)
        }

        const updateModal = () => {
            return <Modal
                visible={this.state.responseStatusModal}
                onBackdropPress={() => this.setState({responseStatusModal: false, responseSuccess: false})}>
                <Layout style={styles.popOverContent} level="1">
                    { (this.state.responseSuccess) ?
                        <Text status='success'>Attendance updated successfuly</Text> :
                        <Text status='danger'>Something went wrong. Please, try again.</Text>
                    }
                </Layout>
            </Modal>
        }

        return(
            <Layout style={{ flex: 1}} level="1">
                <Button style={{width:"100%"}} appearance='ghost' status='primary' accessoryLeft={cameraIcon} onPress={() => navigation.navigate("Scan students QR")}>
                    SCAN QR CODE
                </Button> 
                <Divider/>
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
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignSelf:'center',
        shadowRadius: 18,
        shadowOpacity: 0.10,
        shadowColor: "#000"
    }
});
