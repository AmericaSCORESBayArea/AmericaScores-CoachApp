import React, { Component } from "react";
import {
  Layout,
  CheckBox,
  Button,
  Divider,
  Icon,
  List,
  ListItem,
  Text,
  Modal,
  Card,
  Spinner,
  Input,
} from "@ui-kitten/components";
import {
  StyleSheet,
  View,
  RefreshControl,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { connect } from "react-redux";
import {
  syncSessions,
  updateSession,
  syncSessions_SessionTab,
} from "./Redux/actions/Session.actions";
import { UnsavedAttendance } from "./Redux/actions/UnsavedAttendance.actions";
import { bindActionCreators } from "redux";
import Axios from "axios";
import { ApiConfig } from "./config/ApiConfig";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

class AttendanceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentsList: [],
      teamName: "",
      sessionStart: "",
      sessionEnd: "",
      isUpdated: false,
      responseSuccess: false,
      responseStatusModal: false,
      currentSession: undefined,
      updatingModalstate: false,
      nomatchModalVisibility: false,
      attendanceListRedux: [],
      auxRedux: [],
      nomatchattendance: false,
      loadingModalstate: true,
      regionCoach: this.props.sessionScreen.region,
      arrowSession: undefined,
      loadingModalRecords: false,
      duplicatedRecords: false,
      duplicatesRecordsModal: false,
      headCountModalStatus: false,
      headCount: 0,
      headCountFemale: 0,
      headCountNonBinary: 0,
      headCountUnknown: 0,
      numberOfStudentsCounted: 0,
      duplicateRecordsList: [],
      showHeadcounts: false,
      showNullSessionsError: false,
      keyboardIsActive: false,
    };
  }

  /*import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
    <MaterialCommunityIcons name={'clipboard-pulse-outline'} size={25} color={'#4f5c63'} /> Assessment icon*/

  componentDidMount() {
    this.setState({ auxRedux: [] });
    this._setCurrentSessionData();
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
      this.setState({ keyboardIsActive: true })
    );
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
      this.setState({ keyboardIsActive: false })
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  ForwardArrow() {
    const { route } = this.props;
    route.params.activitiesRegion.map((value) => {
      value = { Sessions: [value] };
      if (value.Sessions !== null || value.Sessions.length !== 0) {
        value.Sessions.map((val) => {
          if (val.SessionId === this.state.sessionId) {
            let posAc = route.params.activitiesRegion.indexOf(val);
            if (
              JSON.stringify(route.params.activitiesRegion[posAc]).length >= 1
            ) {
              var aclong = route.params.activitiesRegion.length;
              console.log(posAc, aclong - 1);
              if (posAc == aclong - 1) {
                Alert.alert(
                  "",
                  "No following sessions found.\nTry adjusting the date range in the Sessions Calendar."
                );
              } else {
                console.log("entered", posAc, aclong - 1);
                this.setState({ auxRedux: [] });
                this.setState({
                  arrowSession: route.params.activitiesRegion[posAc + 1],
                });
                this.setState({ loadingModalstate: true });
                this._setCurrentSessionData();
              }
            }
          }
        });
      }
    });
  }

  backArrow() {
    const { route } = this.props;
    route.params.activitiesRegion.map((value) => {
      value = { Sessions: [value] };
      if (value.Sessions !== null || value.Sessions.length !== 0) {
        value.Sessions.map((val) => {
          if (val.SessionId === this.state.sessionId) {
            let posAc = route.params.activitiesRegion.indexOf(
              value.Sessions[0]
            );
            if (
              JSON.stringify(route.params.activitiesRegion[posAc]).length >= 1
            ) {
              var aclong = route.params.activitiesRegion.length;
              if (posAc === 0) {
                Alert.alert(
                  "",
                  "No previous sessions found.\nTry adjusting the date range in the Sessions Calendar."
                );
              } else {
                this.setState({ auxRedux: [] });
                this.setState({
                  arrowSession: route.params.activitiesRegion[posAc - 1],
                });
                this.setState({ loadingModalstate: true });
                this._setCurrentSessionData();
              }
            }
          }
        });
      }
    });
  }

  formatEnrollmentsToRequest(enrollments) {
    let studentsList = [];

    enrollments.forEach((student) => {
      let attendance = false;
      let attendanceId = "";
      console.log(student);
      if (student.AttendanceId) attendanceId = student.AttendanceId;
      if (student.Attended) attendance = true;

      studentsList.push({
        AttendanceId: attendanceId,
        Attended: attendance,
      });
    });

    return studentsList;
  }

  updateEnrollmentsToRedux() {
    const { actions } = this.props;
    const { completeTeamSeasonId, enrollments } =
      this.state.completeTeamSeasonId;
    let payload = {
      TeamSeasonId: completeTeamSeasonId,
      enrollments: enrollments,
    };
    actions.updateSession(payload);
  }

  async updateHeadcountAttendance() {
    Keyboard.dismiss();
    const { user } = this.props.user;
    this.setState({ updatingModalstate: true });
    await analytics().logEvent("Headcount", {
      coach_Id: user.ContactId,
      boysPresent: this.state.headCount,
      girlsPresent: this.state.headCountFemale,
      nonbinaryPresent: this.state.headCountNonBinary,
      unknownPresent: this.state.headCountUnknown,
      teamSeasonId: this.state.teamSeasonId,
      sessionId: this.state.sessionId,
      application: "Coach App",
    });
    let headCountObject = {
      BoysPresent: this.state.headCount.length === 0 ? 0 : this.state.headCount,
      GirlsPresent:
        this.state.headCountFemale.length === 0
          ? 0
          : this.state.headCountFemale,
      NonbinaryPresent:
        this.state.headCountNonBinary.length === 0
          ? 0
          : this.state.headCountNonBinary,
      UnknownPresent:
        this.state.headCountUnknown.length === 0
          ? 0
          : this.state.headCountUnknown,
    };
    console.log(headCountObject);
    await Axios.patch(
      `${ApiConfig.dataApi}/sessions/${this.state.sessionId}`,
      headCountObject
    )
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            this.setState({ updatingModalstate: false, responseSuccess: true });
          });
          this.setState({ responseStatusModal: true });
        }
      })
      .catch((error) => {
        this.setState({
          updatingModalstate: false,
          responseSuccess: false,
          responseStatusModal: true,
        });
        console.log("SOMETHING HAPPENED");
        throw error;
      });
  }

  //Filters the current session and sets the student list for attendance
  async _setCurrentSessionData() {
    this.setState({ showNullSessionsError: false });
    const { route } = this.props;
    var currentSession =
      (await route.params.name) === "Sessions"
        ? this.props.sessions.sessions_tab.find(
            (session) => session.SessionId === route.params.sessionId
          )
        : this.props.sessions.sessions.find(
            (session) => session.SessionId === route.params.sessionId
          );
    if (
      currentSession === null ||
      currentSession === undefined ||
      currentSession.length === 0
    ) {
      this.setState({ showNullSessionsError: true, loadingModalstate: false });
    } else {
      var currentSessionData = { SessionId: currentSession.SessionId };
      if (this.state.arrowSession !== undefined) {
        var currentSession =
          (await route.params.name) === "Sessions"
            ? this.props.sessions.sessions_tab.find(
                (session) =>
                  session.SessionId === this.state.arrowSession.SessionId
              )
            : this.props.sessions.sessions.find(
                (session) =>
                  session.SessionId === this.state.arrowSession.SessionId
              );
        var currentSessionData = { SessionId: currentSession.SessionId };
      }
      let currentDate = moment();
      let currentTopic = "";
      let useHeadcount = "";
      let programType = "";
      let girlsHeadcount = "";
      let boysHeadcount = "";
      let nonBinaryHeadcount = "";
      let unknownHeadcount = "";
      let sessionStartTime = "";
      let sessionEndTime = "";
      if (currentSession) {
        console.log("[Attendance.Screen.js] : FETCH SESSION");
        await Axios.get(
          `${ApiConfig.dataApi}/sessions/${currentSessionData.SessionId}`
        )
          .then(async (res) => {
            currentDate = res.data.SessionDate;
            currentTopic =
              res.data.SessionTopic !== null
                ? res.data.SessionTopic.replace(/_/g, " ")
                : undefined;
            useHeadcount = res.data.UsesHeadcount;
            programType = res.data.ProgramType;
            girlsHeadcount = res.data.GirlsPresent;
            boysHeadcount = res.data.BoysPresent;
            nonBinaryHeadcount = res.data.NonbinaryPresent;
            unknownHeadcount = res.data.UnknownPresent;
            sessionStartTime = res.data.SessionStartTime ?? "";
            sessionEndTime = res.data.SessionEndTime ?? "";
          })
          .catch((error) => error);
        if (useHeadcount === true || useHeadcount === "true") {
          this.setState({ showHeadcounts: true });
          if (boysHeadcount !== null) {
            boysHeadcount = boysHeadcount.replace(/\./g, "");
            boysHeadcount = boysHeadcount / 10;
            this.setState({
              headCount: boysHeadcount.toString(),
              numberOfStudentsCounted:
                Number(this.state.headCountFemale) +
                Number(boysHeadcount) +
                Number(this.state.headCountUnknown) +
                Number(this.state.headCountNonBinary),
            });
          } else {
            this.setState({
              headCount: 0,
              numberOfStudentsCounted:
                Number(this.state.headCountFemale) +
                0 +
                Number(this.state.headCountUnknown) +
                Number(this.state.headCountNonBinary),
            });
          }
          if (girlsHeadcount !== null) {
            girlsHeadcount = girlsHeadcount.replace(/\./g, "");
            girlsHeadcount = girlsHeadcount / 10;
            this.setState({
              headCountFemale: girlsHeadcount.toString(),
              numberOfStudentsCounted:
                Number(this.state.headCount) +
                Number(girlsHeadcount) +
                Number(this.state.headCountUnknown) +
                Number(this.state.headCountNonBinary),
            });
          } else {
            this.setState({
              headCountFemale: 0,
              numberOfStudentsCounted:
                Number(this.state.headCount) +
                0 +
                Number(this.state.headCountUnknown) +
                Number(this.state.headCountNonBinary),
            });
          }
          if (nonBinaryHeadcount !== null) {
            nonBinaryHeadcount = nonBinaryHeadcount.replace(/\./g, "");
            nonBinaryHeadcount = nonBinaryHeadcount / 10;
            this.setState({
              headCountNonBinary: nonBinaryHeadcount.toString(),
              numberOfStudentsCounted:
                Number(this.state.headCount) +
                Number(this.state.headCountFemale) +
                Number(this.state.headCountUnknown) +
                Number(nonBinaryHeadcount),
            });
          } else {
            this.setState({
              headCountNonBinary: 0,
              numberOfStudentsCounted:
                Number(this.state.headCount) +
                Number(this.state.headCountFemale) +
                Number(this.state.headCountUnknown) +
                0,
            });
          }
          if (unknownHeadcount !== null) {
            unknownHeadcount = unknownHeadcount.replace(/\./g, "");
            unknownHeadcount = unknownHeadcount / 10;
            this.setState({
              headCountUnknown: unknownHeadcount.toString(),
              numberOfStudentsCounted:
                Number(this.state.headCount) +
                Number(this.state.headCountFemale) +
                Number(this.state.headCountNonBinary) +
                Number(unknownHeadcount),
            });
          } else {
            this.setState({
              headCountUnknown: 0,
              numberOfStudentsCounted:
                Number(this.state.headCount) +
                Number(this.state.headCountFemale) +
                Number(this.state.headCountNonBinary) +
                0,
            });
          }
          const newState = {
            sessionId: currentSessionData.SessionId,
            teamName: currentSession.TeamSeasonName,
            teamSeasonId: currentSession.TeamSeasonId,
            completeTeamSeasonId: currentSession.TeamSeasonId,
            topic: currentTopic,
            date: moment(currentDate).format("MMM-DD-YYYY"),
            numberOfStudents: 0,
            programType: programType,
            sessionStart: sessionStartTime,
            sessionEnd: sessionEndTime,
          };
          await this.setState(newState);
          this.setState({ headCountModalStatus: true });
        } else {
          this.setState({ showHeadcounts: false });
          this.setState({ headCountModalStatus: false });
          const newState = {
            sessionId: currentSessionData.SessionId,
            enrollments: [],
            teamName: currentSession.TeamSeasonName,
            teamSeasonId: currentSession.TeamSeasonId,
            completeTeamSeasonId: currentSession.TeamSeasonId,
            topic: currentTopic,
            date: moment(currentDate).format("MMM-DD-YYYY"),
            numberOfStudents: 0,
            missingEnrollments: [],
            sessionStart: sessionStartTime,
            sessionEnd: sessionEndTime,
          };
          await this.setState(newState);
          await this._fetchGetEnrollments();
          await this.verifyAttendance();

          if (this.props.sessionAttendance.sessionsAttendance !== undefined) {
            console.log(
              "redux",
              this.props.sessionAttendance.sessionsAttendance
            );
          }
          if (this.props.sessionAttendance.sessionsAttendance.length !== 0) {
            if (
              this.props.sessionAttendance.sessionsAttendance[0][0] ===
              undefined
            ) {
              this.props.sessionAttendance.sessionsAttendance.map(
                (valueredux) => {
                  if (valueredux.SessionId === currentSessionData.SessionId) {
                    this.setState({ nomatchattendance: true });
                    this.state.enrollments.map((value) => {
                      //value.Attended = false
                      valueredux.attendanceList.map((redux) => {
                        if (value.StudentId === redux.StudentId) {
                          value.Attended = redux.Attended;
                        }
                      });
                    });
                    this.setState({ isUpdated: true });
                  }
                }
              );
            } else {
              this.props.sessionAttendance.sessionsAttendance[0].map(
                (valueredux) => {
                  if (valueredux.SessionId === currentSessionData.SessionId) {
                    this.setState({ nomatchattendance: true });
                    this.state.enrollments.map((value) => {
                      //value.Attended=false
                      valueredux.attendanceList.map((redux) => {
                        if (value.StudentId === redux.StudentId) {
                          value.Attended = redux.Attended;
                        }
                      });
                    });
                    this.setState({ isUpdated: true });
                  }
                }
              );
            }
            if (this.state.nomatchattendance === false) {
              if (this.state.enrollments !== null) {
                this.state.enrollments.map((value) => {
                  if (value.Attended !== undefined) {
                    //value.Attended=false
                  }
                  {
                    () => this.studentAttendanceItem(this.state.enrollments);
                  }
                });
              }
            }
            await this._fetchSessionInfo();
            if (this.state.enrollments.length !== 0) {
              this.setState({ nomatchModalVisibility: false });
            } else {
              this.setState({ nomatchModalVisibility: true });
            }
          } else {
            if (this.state.enrollments.length !== 0) {
              this.setState({ nomatchModalVisibility: false });
              this.state.enrollments.map((value) => {
                if (value.Attended !== undefined) {
                  //value.Attended = false
                }
              });
            } else {
              this.setState({ nomatchModalVisibility: true });
              this.setState({ loadingModalstate: false });
            }
            await this._fetchSessionInfo();
          }
          this.setState({ loadingModalstate: false });
        }
        this.setState({ loadingModalstate: false });
      }
    }
  }

  async createMissingAttendance(attendanceRecords, enrollmentsDuplicate) {
    enrollmentsDuplicate
      .map((v) => v)
      .sort()
      .sort((a, b) => {
        if (a.StudentId === b.StudentId) {
          this.setState({ duplicatedRecords: true });
          this.state.duplicateRecordsList.push(a.StudentName);
        }
      });
    if (this.state.duplicateRecordsList.length > 0) {
      console.log("duplicates found");
      this.setState({
        loadingModalRecords: false,
        duplicatesRecordsModal: true,
      });
    } else {
      //console.log('MissingEnrollments',enrollmentsDuplicate)
      await Axios.post(`${ApiConfig.dataApi}/attendances`, attendanceRecords)
        .then((res) => {
          if (res.status === 200) {
            // Alert.alert("Success", "Attendance records created succesfully. Pull down to refresh");
            this._setCurrentSessionData();
            setTimeout(() => {
              this.setState({ loadingModalRecords: false });
            }, 3500);
          }
        })
        .catch((error) => {
          this.setState({ loadingModalRecords: false });
          console.log("SOMETHING HAPPENED");
          throw error;
        });
    }
  }

  async verifyAttendance() {
    const { user } = this.props.user;
    console.log("[Attendance.Screen.js] : FETCH ENROLLMENTS");
    await Axios.get(
      `${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/enrollments`
    )
      .then(async (res) => {
        if (res.status === 200) {
          if (res.data.length <= 0) {
            console.log(
              "[Attendance.Screen.js | FETCH ENROLLMENTS | GET status = 200 ] -> No students found"
            );
          } else {
            console.log(
              "[Attendance.Screen.js | FETCH ENROLLMENTS | GET status = 200 ] -> Students found, updated state"
            );
            // console.log(res.data);
            const verifiedEnrollments =
              await this.parseFetchedAttendanceToObject(res.data);
            // console.log(verifiedEnrollments);
            // this.setState({missingEnrollments: verifiedEnrollments});
            if (this.state.duplicatedRecords === false) {
              if (verifiedEnrollments.length > 0) {
                this.setState({
                  duplicatedRecords: false,
                  duplicatesRecordsModal: false,
                });
                let missingEnrollments = [];
                let enrollmentsDuplicate = [];
                await verifiedEnrollments.map(async (enrollment) => {
                  let studentRecord = {
                    SessionId: this.state.sessionId,
                    StudentId: enrollment.StudentId,
                    Attended: false,
                  };
                  let studentRecordDuplicate = {
                    SessionId: this.state.sessionId,
                    StudentName: enrollment.StudentName,
                    StudentId: enrollment.StudentId,
                    Attended: false,
                  };
                  enrollmentsDuplicate.push(studentRecordDuplicate);
                  missingEnrollments.push(studentRecord);
                });
                this.setState({ loadingModalstate: false });
                this.setState({ loadingModalRecords: true });
                this.createMissingAttendance(
                  missingEnrollments,
                  enrollmentsDuplicate
                );
                //Alert.alert("Attendance records missing",`The following attendance records are missing ${verifiedEnrollments.map((value) => {return value.StudentName})}, touch "OK" to create them`,[{ text: "OK", onPress: () => this.createMissingAttendance(missingEnrollments) }]);
              }
            }
          }
        } else {
          console.log(
            "[Attendance.Screen.js | CREATE MISSING RECORDS | GET status = 400 ] Something went wrong"
          );
        }
      })
      .catch((error) => {
        console.log(
          "[Attendance.Screen.js |  FETCH ENROLLMENTS |GET request issue]:" +
            `${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/enrollments`,
          error
        );
      });
  }

  async parseFetchedAttendanceToObject(enrollmentData) {
    let parsedEnrollments = [];
    let parsedAttendance = [];
    const attendanceList = await this.state.enrollments;
    await attendanceList.map(async (attendance) => {
      let attendancetStudent = {
        StudentId: attendance.StudentId,
      };
      if (
        enrollmentData.find(
          (element) => element.StudentId === attendance.StudentId
        ) === undefined
      ) {
        const index = await attendanceList.findIndex(
          (value) => value.StudentId === attendance.StudentId
        );
        attendanceList.splice(index, 1);
      }
      parsedAttendance.push(attendancetStudent);
    });
    this.setState({
      enrollments: attendanceList,
      numberOfStudents: attendanceList.length,
    });
    await enrollmentData.map(async (enrollment) => {
      if (
        parsedAttendance.find(
          (element) => element.StudentId === enrollment.StudentId
        ) === undefined
      ) {
        let enrollmentStudent = {
          StudentId: enrollment.StudentId,
          StudentName: enrollment.StudentName,
        };
        parsedEnrollments.push(enrollmentStudent);
      }
    });
      await analytics().logEvent("AttendanceViewPopulated", {
        coach_Id: user.ContactId,
        teamSeasonId: this.state.teamSeasonId,
        sessionId: this.state.sessionId,
        StudentsFound: numberOfStudents,
        application: "Coach App",
       });
    console.log(parsedAttendance, parsedEnrollments);
    return parsedEnrollments;
  }

  //In order to apply changes to the state list we need to clone it, modify and put it back into state (Is not effective but thats how react works)
  checkStudent(index, value) {
    const { actions } = this.props;
    const { route } = this.props;
    let newEnrollments = [...this.state.enrollments]; //Get the new list
    //Change the student attendance
    this.setState({ auxRedux: [] });
    if (value) newEnrollments[index].Attended = true;
    else newEnrollments[index].Attended = false;
    var currentSession =
      route.params.name === "Sessions"
        ? this.props.sessions.sessions_tab.find(
            (session) => session.SessionId === route.params.sessionId
          )
        : this.props.sessions.sessions.find(
            (session) => session.SessionId === route.params.sessionId
          );
    currentSession = { Sessions: [currentSession] };
    var currentSessionData = currentSession.Sessions.find(
      (session) => session.SessionId === route.params.sessionId
    );
    if (this.state.arrowSession !== undefined) {
      var currentSession =
        route.params.name === "Sessions"
          ? this.props.sessions.sessions_tab.filter(
              (session) =>
                session.TeamSeasonId === this.state.arrowSession.TeamSeasonId
            )
          : this.props.sessions.sessions.filter(
              (session) =>
                session.TeamSeasonId === this.state.arrowSession.TeamSeasonId
            );
      currentSession = { Sessions: currentSession };
      var currentSessionData = currentSession.Sessions.find(
        (session) => session.SessionId === this.state.arrowSession.SessionId
      );
    }
    newEnrollments.map((value) => {
      if (value.Attended !== undefined) {
        /* if(value.Attended === true){*/
        if (
          this.state.attendanceListRedux.filter((attendance) =>
            attendance.StudentId.match(value.StudentId)
          ).length !== 0
        ) {
        } else {
          this.state.attendanceListRedux.push(value);
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
    if (this.state.attendanceListRedux.length !== 0) {
      //checking if there is any attendance to update
      if (
        String(this.props.sessionAttendance.sessionsAttendance).length !== 0
      ) {
        if (
          this.props.sessionAttendance.sessionsAttendance[0][0] === undefined
        ) {
          this.props.sessionAttendance.sessionsAttendance.map((valueredux) => {
            if (valueredux !== undefined) {
              if (valueredux.SessionId === currentSessionData.SessionId) {
                const index =
                  this.props.sessionAttendance.sessionsAttendance.indexOf(
                    valueredux
                  );
                if (index > -1) {
                  this.props.sessionAttendance.sessionsAttendance.splice(
                    index,
                    1
                  ); //saving a new array with all students with value True for attendence
                }
              }
            }
          });
        } else {
          this.props.sessionAttendance.sessionsAttendance[0].map(
            (valueredux) => {
              if (valueredux !== undefined) {
                if (valueredux.SessionId === currentSessionData.SessionId) {
                  const index =
                    this.props.sessionAttendance.sessionsAttendance[0].indexOf(
                      valueredux
                    );
                  if (index > -1) {
                    this.props.sessionAttendance.sessionsAttendance[0].splice(
                      index,
                      1
                    ); //saving a new array with all students with value True for attendence
                  }
                }
              }
            }
          );
        }
        if (
          String(this.props.sessionAttendance.sessionsAttendance).length !== 0
        ) {
          if (
            this.props.sessionAttendance.sessionsAttendance[0][0] === undefined
          ) {
            this.props.sessionAttendance.sessionsAttendance.map(
              (valueredux) => {
                this.state.auxRedux.push(valueredux);
              }
            );
          } else {
            this.props.sessionAttendance.sessionsAttendance[0].map(
              (valueredux) => {
                this.state.auxRedux.push(valueredux);
              }
            );
          }
          console.log("asd", currentSessionData);
          let payloadd = {
            SessionId: currentSessionData.SessionId,
            attendanceList: this.state.attendanceListRedux,
          };
          this.state.auxRedux.push(payloadd);
          actions.UnsavedAttendance(this.state.auxRedux);
        } else {
          let payloadd = {
            SessionId: currentSessionData.SessionId,
            attendanceList: this.state.attendanceListRedux,
          };
          actions.UnsavedAttendance(payloadd);
        }
        this.setState({ isUpdated: true });
      } else {
        let payloadd = {
          SessionId: currentSessionData.SessionId,
          attendanceList: this.state.attendanceListRedux,
        };
        actions.UnsavedAttendance(payloadd);
        this.setState({ isUpdated: true });
      }
    } else {
      if (
        String(this.props.sessionAttendance.sessionsAttendance).length !== 0
      ) {
        if (
          this.props.sessionAttendance.sessionsAttendance[0][0] === undefined
        ) {
          this.props.sessionAttendance.sessionsAttendance.map((valueredux) => {
            if (valueredux.SessionId !== currentSessionData.SessionId) {
              this.state.auxRedux.push(valueredux);
            }
          });
        } else {
          this.props.sessionAttendance.sessionsAttendance[0].map(
            (valueredux) => {
              if (valueredux.SessionId !== currentSessionData.SessionId) {
                this.state.auxRedux.push(valueredux);
              }
            }
          );
        }
        actions.UnsavedAttendance(this.state.auxRedux);
        //this.setState({isUpdated: false})
      }
    }
    this.setState({ enrollments: newEnrollments }); //Set the new list
  }

  checkStudentById = (enrollmentId) => {
    const enrollmentIndex = this.state.enrollments.findIndex(
      (enrollment) => enrollment.StudentId === enrollmentId
    );
    this.checkStudent(enrollmentIndex, true);
  };

  updateAttendance() {
    const { enrollments, sessionId } = this.state;
    let attendanceFetchData = this.formatEnrollmentsToRequest(
      enrollments,
      sessionId
    );
    this._fetchUpdateAttendance(attendanceFetchData)
      .then(() => this.updateEnrollmentsToRedux())
      .catch((error) => {
        throw error;
      });
  }

  _fetchUpdateAttendance = async (enrollments) => {
    console.log(enrollments);
    const { user } = this.props.user;
    Axios.patch(
      `${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/sessions/${this.state.sessionId}/attendances`,
      enrollments
    )
      .then((res) => {
        if (res.status === 200)
          this.setState({
            responseSuccess: true,
            isUpdated: false,
            responseStatusModal: true,
            updatingModalstate: false,
          });
        else
          this.setState({
            responseStatusModal: true,
            updatingModalstate: false,
          });
      })
      .catch((error) => {
        this.setState({ responseStatusModal: true, updatingModalstate: false });
        throw error;
      });
  };

  async _fetchGetEnrollments() {
    const { user } = this.props.user;
    console.log("[Attendance.Screen.js] : FETCH ATTENDANCE");
    console.log(this.state.sessionId);
    await Axios.get(
      `${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/sessions/${this.state.sessionId}/attendances`
    )
      .then(async (res) => {
        if (res.status === 200) {
          if (res.data.length <= 0) {
            console.log(
              "[Attendance.Screen.js | FETCH ATTENDANCE | GET status = 200 ] -> No students found"
            );
          } else {
            console.log(
              "[Attendance.Screen.js | FETCH ATTENDANCE | GET status = 200 ] -> Students found, updated state"
            );
            console.log(res.data);
            let parsedEnrollments = await this.parseFetchedEnrollmentToObject(
              res.data
            );
            await this.setState({
              enrollments: parsedEnrollments,
              numberOfStudents: res.data.length,
            });
          }
        } else {
          console.log(
            "[Attendance.Screen.js | FETCH ATTENDANCE | GET status = 400 ] No enrollments found"
          );
        }
      })
      .catch((error) => {
        console.log(
          "[Attendance.Screen.js |  FETCH ATTENDANCE |GET request issue]:" +
            `${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons/${this.state.teamSeasonId}/sessions/${this.state.sessionId}/attendances`
        );
      });
      
  }

  async _fetchSessionInfo() {
    console.log("[Attendance.Screen.js] : FETCH SESSION");
    await Axios.get(`${ApiConfig.dataApi}/sessions/${this.state.sessionId}`)
      .then(async (res) => {
        console.log(res.data.SessionTopic);
        await this.setState({
          date: res.data.SessionDate.format("MMM-DD-YYYY"),
          topic: res.data.SessionTopic,
        });
      })
      .catch((error) => error);
  }

  async parseFetchedEnrollmentToObject(enrollmentData) {
    let parsedEnrollments = [];
    enrollmentData.forEach((enrollment) => {
      let attendance = false;
      if (enrollment.Attended === "true") attendance = true;
      let student = {
        Attended: attendance,
        StudentId: enrollment.StudentId,
        StudentName: enrollment.StudentName,
        AttendanceId: enrollment.AttendanceId,
      };
      parsedEnrollments.push(student);
    });
    parsedEnrollments.sort((a, b) =>
      a.StudentName.localeCompare(b.StudentName)
    );

    return parsedEnrollments;
  }
  LoadingGif = () => {
    if (this.props.sessionScreen.region === "ASBA") {
      return require("../assets/Scores_Logo.gif"); //Scores logo gif
    } else if (this.props.sessionScreen.region === "IFC") {
      return require("../assets/IFC_Logo_animated.gif"); //IFC logo gif
    } else if (this.props.sessionScreen.region === "OGSC") {
      return require("../assets/OGSC_logo_spinner.gif"); //Genesis logo gif
    }
  };
  toogleUpdate() {
    const { actions } = this.props;
    const { route } = this.props;
    this.setState({ auxRedux: [] });
    this.updateAttendance();
    var currentSession =
      route.params.name === "Sessions"
        ? this.props.sessions.sessions_tab.filter(
            (session) => session.TeamSeasonId === route.params.teamSeasonId
          )
        : this.props.sessions.sessions.filter(
            (session) => session.TeamSeasonId === route.params.teamSeasonId
          );
    currentSession = { Sessions: currentSession };
    var currentSessionData = currentSession.Sessions.find(
      (session) => session.SessionId === route.params.sessionId
    );
    if (this.state.arrowSession !== undefined) {
      var currentSession =
        route.params.name === "Sessions"
          ? this.props.sessions.sessions_tab.filter(
              (session) =>
                session.TeamSeasonId === this.state.arrowSession.TeamSeasonId
            )
          : this.props.sessions.sessions.filter(
              (session) =>
                session.TeamSeasonId === this.state.arrowSession.TeamSeasonId
            );
      currentSession = { Sessions: currentSession };
      var currentSessionData = currentSession.Sessions.find(
        (session) => session.SessionId === this.state.arrowSession.SessionId
      );
    }
    if (this.props.sessionAttendance.sessionsAttendance.length !== 0) {
      if (this.props.sessionAttendance.sessionsAttendance[0][0] === undefined) {
        this.props.sessionAttendance.sessionsAttendance.map((valueredux) => {
          if (valueredux !== undefined) {
            if (valueredux.SessionId === currentSessionData.SessionId) {
              const index =
                this.props.sessionAttendance.sessionsAttendance.indexOf(
                  valueredux
                );
              if (index > -1) {
                this.props.sessionAttendance.sessionsAttendance.splice(
                  index,
                  1
                ); //saving a new array with all students with value True for attendence
              }
            }
          }
        });
      } else {
        this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) => {
          if (valueredux !== undefined) {
            if (valueredux.SessionId === currentSessionData.SessionId) {
              const index =
                this.props.sessionAttendance.sessionsAttendance[0].indexOf(
                  valueredux
                );
              if (index > -1) {
                this.props.sessionAttendance.sessionsAttendance[0].splice(
                  index,
                  1
                ); //saving a new array with all students with value True for attendence
              }
            }
          }
        });
      }
      if (this.props.sessionAttendance.sessionsAttendance.length !== 0) {
        if (
          this.props.sessionAttendance.sessionsAttendance[0][0] === undefined
        ) {
          this.props.sessionAttendance.sessionsAttendance.map((valueredux) => {
            if (valueredux.SessionId !== currentSessionData.SessionId) {
              this.state.auxRedux.push(valueredux);
            }
          });
        } else {
          this.props.sessionAttendance.sessionsAttendance[0].map(
            (valueredux) => {
              if (valueredux.SessionId !== currentSessionData.SessionId) {
                this.state.auxRedux.push(valueredux);
              }
            }
          );
        }
        actions.UnsavedAttendance(this.state.auxRedux),
          this.state.enrollments.map((value) => {
            if (value.Attended !== undefined) {
              value.Attended = false;
            }
          });
        this.setState({ updatingModalstate: true });
      }
    }
  }

  editSession(modalScreen) {
    const number = function (topic) {
      if (topic === "Soccer") return 0;
      else if (topic === "Writing") return 1;
      else if (topic === "Game Day") return 2;
      else if (topic === "Soccer and Writing") return 3;
      else return 0;
    };
    var id = number(this.state.topic);
    this.props.navigation.navigate(modalScreen, {
      session: this.state.sessionId,
      oldDate: this.state.date,
      oldTopic: this.state.topic,
      topicId: id,
      sessionStart: this.state.sessionStart,
      sessionEnd: this.state.sessionEnd,
    });
  }

  editHeadCountSession(modalScreen) {
    const number = function (topic) {
      if (topic === "Soccer") return 0;
      else if (topic === "Writing") return 1;
      else if (topic === "Game Day") return 2;
      else if (topic === "Soccer and Writing") return 3;
      else return 0;
    };
    var id = number(this.state.topic);
    this.props.navigation.navigate(modalScreen, {
      session: this.state.sessionId,
      oldDate: this.state.date,
      oldTopic: this.state.topic,
      topicId: id,
      sessionStart: this.state.sessionStart,
      sessionEnd: this.state.sessionEnd,
    });
  }

  toogleSpinnerOff() {
    this.setState({ updatingModalstate: false });
  }

  toggleNotificationOff() {
    this.setState({ responseStatusModal: false, responseSuccess: false });
  }

  toggleNotificationOffBack() {
    this.setState({ duplicatesRecordsModal: false });
  }

  render() {
    const { navigation } = this.props;
    const cameraIcon = (props) => <Icon {...props} name="camera-outline" />;
    const editIcon = (props) => <Icon {...props} name="edit-2-outline" />;
    const forwardIcon = (props) => (
      <Icon {...props} name="arrow-ios-forward-outline" />
    );
    const backIcon = (props) => (
      <Icon {...props} name="arrow-ios-back-outline" />
    );
    //const assessmentIcon = () => ( <MaterialCommunityIcons name={'clipboard-pulse-outline'} size={25} color={'#4f5c63'} /> );
    let refreshing = false;

    const onRefresh = () => {
      this.setState({ loadingModalstate: true });
      refreshing = true;
      this.setState({
        duplicatedRecords: false,
        duplicatesRecordsModal: false,
        duplicateRecordsList: [],
      });
      this._setCurrentSessionData().then(() => (refreshing = false));
      setTimeout(() => {
        this.setState({ loadingModalstate: false });
      }, 3500);
      // wait(2000).then(() => refreshing = false);
    };
    const sessionPhotographLayout = () => {
      const { user } = this.props.user;
      this.props.navigation.navigate("Session Photograph", {
        team: this.state.teamName,
        session_Type: this.state.topic,
        session_ID: this.state.sessionId,
        region: this.state.regionCoach,
        coach_ID: user.ContactId,
      });
    };
    const studentAttendanceItem = ({ item, index }) => (
      <ListItem
        onPress={() =>
          this.checkStudent(index, !this.state.enrollments[index].Attended)
        }
        title={`${item.StudentName}`}
        //onPress={() => this.checkStudent(index, !this.state.enrollments[index].Attended)}
        accessoryLeft={() => {
          if (this.state.enrollments[index].Attended)
            return (
              <CheckBox
                checked={true}
                onChange={() => this.checkStudent(index, false)}
              />
            );
          else
            return (
              <CheckBox
                checked={false}
                onChange={() => this.checkStudent(index, true)}
              />
            );
        }}
        accessoryRight={() => {
          const { route } = this.props;
          const { user } = this.props.user;
          var currentSession =
            route.params.name === "Sessions"
              ? this.props.sessions.sessions_tab.filter(
                  (session) =>
                    session.TeamSeasonId === route.params.teamSeasonId
                )
              : this.props.sessions.sessions.filter(
                  (session) =>
                    session.TeamSeasonId === route.params.teamSeasonId
                );
          currentSession = { Sessions: currentSession };
          var currentSessionData = currentSession.Sessions.find(
            (session) => session.SessionId === route.params.sessionId
          );
          return (
            <MaterialCommunityIcons
              name={"clipboard-pulse-outline"}
              size={25}
              color={"#4f5c63"}
              onPress={() =>
                this.props.navigation.navigate("assessmentModal", {
                  Student: item,
                  User: user,
                  Session: currentSessionData,
                })
              }
            />
          );
        }}
      />
    );

    const descriptionRowText = (label, description) => (
      <View style={styles.row}>
        <Text style={styles.attendanceDescriptionText_Label} category="s1">
          {label}{" "}
        </Text>
        <Text style={{ fontSize: 14 }} category="p1">
          {description}
        </Text>
      </View>
    );
    const descriptionRowTextDate = (label, description) => (
      <View style={styles.row}>
        <Text style={styles.attendanceDescriptionText_Label} category="s1">
          {label}{" "}
        </Text>
        {moment().format("MM-DD-YYYY") ===
        moment(description).format("MM-DD-YYYY") ? (
          <Text style={{ fontSize: 14 }} category="p1">
            Today, {description}
          </Text>
        ) : (
          <Text style={{ fontSize: 14 }} category="p1">
            {description}
          </Text>
        )}
      </View>
    );
    const descriptionRowTextImage = (label, description) => (
      <View style={styles.row}>
        <Text style={styles.attendanceDescriptionText_Label} category="s1">
          {label}{" "}
        </Text>
        {description === "" || description === undefined ? (
          <Text style={{ fontSize: 14 }} category="p1">
            Unassigned
          </Text>
        ) : (
          <Text style={{ fontSize: 14 }} category="p1">
            {description}
          </Text>
        )}
        {description === "Soccer" ? (
          <Image
            style={{ width: 40, height: 40, resizeMode: "contain" }}
            source={require("../assets/Scores_Ball.png")}
          />
        ) : null}
        {description === "Soccer and Writing" ? (
          <Image
            style={{ width: 40, height: 40, resizeMode: "contain" }}
            source={require("../assets/Scores_Soccer_and_writing.png")}
          />
        ) : null}
        {description === "Writing" ? (
          <Image
            style={{ width: 40, height: 40, resizeMode: "contain" }}
            source={require("../assets/Scores_Pencil_Edit.png")}
          />
        ) : null}
        {description === "Game Day" ? (
          <Image
            style={{ width: 40, height: 40, resizeMode: "contain" }}
            source={require("../assets/Scores_goal.png")}
          />
        ) : null}
        {description === "" || description === undefined ? (
          <Image
            style={{ width: 40, height: 25, resizeMode: "contain" }}
            source={require("../assets/Unassigned_Session.png")}
          />
        ) : null}
      </View>
    );

    const updateButton = () => {
      if (this.state.isUpdated || this.state.showHeadcounts) {
        return (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Button
              style={{ width: "70%" }}
              onPress={() =>
                this.state.showHeadcounts
                  ? this.updateHeadcountAttendance()
                  : this.toogleUpdate()
              }
              size="large"
              appearance="filled"
              status="success"
            >
              {" "}
              Save Attendance{" "}
            </Button>
          </View>
        );
      }
    };
    const SuccessHeader = (props) => (
      <Layout {...props}>
        <ImageBackground
          resizeMode="contain"
          style={{ height: 100, width: 100, alignSelf: "center" }}
          source={require("../assets/success_icon.png")}
        />
      </Layout>
    );
    const UnsuccessHeader = (props) => (
      <Layout {...props}>
        <ImageBackground
          resizeMode="contain"
          style={{ height: 100, width: 100, alignSelf: "center" }}
          source={require("../assets/error_icon.png")}
        />
      </Layout>
    );
    const updateSuccessCard = (status, text) => (
      <Card disabled={true} header={SuccessHeader}>
        <Text style={styles.modalText} status={status}>
          {text}
        </Text>
        <Button
          appearance="outline"
          size={"small"}
          onPress={() => {
            this.toggleNotificationOff(), onRefresh();
          }}
          status={status}
        >
          OK
        </Button>
      </Card>
    );
    const updateUnSuccessCard = (status, text) => (
      <Card disabled={true} header={UnsuccessHeader}>
        <Text style={styles.modalText} status={status}>
          {text}
        </Text>
        <Button
          appearance="outline"
          size={"small"}
          onPress={() => this.toggleNotificationOff()}
          status={status}
        >
          OK
        </Button>
      </Card>
    );

    const updateUnSuccessCardDuplicate = (status, text) => (
      <Card disabled={true} header={UnsuccessHeader}>
        <Text style={styles.modalText} status={status}>
          {text}
        </Text>
        <Button
          appearance="outline"
          size={"small"}
          onPress={() => this.toggleNotificationOffBack()}
          status={status}
        >
          OK
        </Button>
      </Card>
    );

    const updateModal = () => (
      <Modal
        visible={this.state.responseStatusModal}
        style={styles.popOverContent}
        onBackdropPress={() => this.toggleNotificationOff()}
      >
        {this.state.responseSuccess
          ? updateSuccessCard("success", "Attendance updated successfuly")
          : updateUnSuccessCard(
              "danger",
              "Something went wrong. Please, try again."
            )}
      </Modal>
    );

    const duplicatesRecordsModal = () => (
      <Modal
        visible={this.state.duplicatesRecordsModal}
        style={styles.popOverContentModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => this.toggleNotificationOffBack()}
      >
        {updateUnSuccessCardDuplicate(
          "danger",
          `The student/s: ${this.state.duplicateRecordsList.map((value) => {
            return value;
          })} has duplicate enrollments. Please contact your Coordinator to resolve this issue.\nYou may take enrollment for your other students.`
        )}
      </Modal>
    );

    const spinnerCard = () => (
      <Card disabled={true}>
        <Spinner size="large" status="primary" />
      </Card>
    );

    const updatingModal = () => (
      <Modal
        style={styles.popOverContent}
        visible={this.state.updatingModalstate}
        backdropStyle={styles.backdrop}
      >
        {spinnerCard()}
      </Modal>
    );
    const loadingModal = () => (
      <Modal
        style={styles.popOverContentModal}
        visible={this.state.loadingModalstate}
        backdropStyle={styles.backdrop}
      >
        <Image source={this.LoadingGif()} />
        {this.state.date === undefined ? null : (
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              alignItems: "center",
              alignSelf: "center",
              borderRadius: 10,
              padding: "10%",
            }}
          >
            <Text
              status="control"
              category="h6"
              style={{ textAlign: "center" }}
            >
              {this.state.teamName}
            </Text>
            {moment().format("MM-DD-YYYY") ===
            moment(this.state.date).format("MM-DD-YYYY") ? (
              <Text status="control" category="h6" style={{ marginTop: "5%" }}>
                Today, {this.state.date}
              </Text>
            ) : (
              <Text status="control" category="h6" style={{ marginTop: "5%" }}>
                {this.state.date}
              </Text>
            )}
          </View>
        )}
      </Modal>
    );
    const loadingModalRecords = () => (
      <Modal
        style={styles.popOverContentModal}
        visible={this.state.loadingModalRecords}
        backdropStyle={styles.backdrop}
      >
        <Image source={this.LoadingGif()} />
        {this.state.date === undefined ? null : (
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              alignItems: "center",
              alignSelf: "center",
              borderRadius: 10,
              padding: "10%",
            }}
          >
            <Text
              status="control"
              category="h6"
              style={{ textAlign: "center" }}
            >
              Updating Attendance Records...
            </Text>
            <Text
              status="control"
              category="h6"
              style={{ textAlign: "center" }}
            >
              {this.state.teamName}
            </Text>
            {moment().format("MM-DD-YYYY") ===
            moment(this.state.date).format("MM-DD-YYYY") ? (
              <Text status="control" category="h6" style={{ marginTop: "5%" }}>
                Today, {this.state.date}
              </Text>
            ) : (
              <Text status="control" category="h6" style={{ marginTop: "5%" }}>
                {this.state.date}
              </Text>
            )}
          </View>
        )}
      </Modal>
    );
    const noMatch = (status) =>
      this.state.nomatchModalVisibility && (
        <Card style={{ opacity: 0.9 }}>
          <Text category="s1" status={status} style={{ alignSelf: "center" }}>
            Please ensure that the enrollments and the attendance records have
            been created for this Team/Session.
          </Text>
        </Card>
      );
    const nullSessionsError = (status) =>
      this.state.showNullSessionsError && (
        <Card style={{ opacity: 0.9 }}>
          <Text category="s1" status={status} style={{ alignSelf: "center" }}>
            An error occurred. Please go back and try a smaller range of dates
            or refresh the list of sessions.
          </Text>
        </Card>
      );
    const buttonColor = () => {
      if (this.props.sessionScreen.region === "ASBA") {
        return "#00467F";
      } else {
        return "#001541";
      }
    };
    const descriptionAreaHeadcount = () => (
      <Layout style={{ padding: 5 }} level="2">
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.row}>
            <View style={styles.column}>
              {descriptionRowText("Team:", this.state.teamName)}
              {descriptionRowTextImage("Program Type:", this.state.programType)}
              {descriptionRowTextDate("Date:", this.state.date)}
              {descriptionRowTextDate(
                "Start Time:",
                this.state.sessionStart
                  ? moment(
                      new Date(
                        new Date(
                          `2023-08-26T${this.state.sessionStart}`
                        ).setHours(
                          new Date(
                            `2023-08-26T${this.state.sessionStart}`
                          ).getHours() + 3
                        )
                      )
                    ).format("HH:mm")
                  : ""
              )}
              {descriptionRowTextDate(
                "End Time:",
                this.state.sessionEnd
                  ? moment(
                      new Date(
                        new Date(
                          `2023-08-26T${this.state.sessionEnd}`
                        ).setHours(
                          new Date(
                            `2023-08-26T${this.state.sessionEnd}`
                          ).getHours() + 3
                        )
                      )
                    ).format("HH:mm")
                  : ""
              )}
              {descriptionRowText(
                "Session attendance:",
                this.state.numberOfStudentsCounted
              )}
            </View>
          </View>
        </ScrollView>
      </Layout>
    );

    const headCountModal = () => (
      <View
        style={{
          height: "100%",
          justifyContent: "center",
          alignSelf: "center",
          margin: "auto",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 60}
        >
          <ScrollView>
            <Text style={{ marginTop: "5%" }} category="s1">
              Number of:
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                width: "100%",
                alignSelf: "center",
                marginTop: "5%",
              }}
            >
              <Input
                keyboardType="numeric"
                status="primary"
                label="Boys"
                style={{ width: "40%", marginRight: "3%" }}
                value={this.state.headCount.toString()}
                onChangeText={(nextValue) =>
                  this.setState({
                    headCount: nextValue.replace(/\D/g, ""),
                    numberOfStudentsCounted:
                      Number(nextValue.replace(/\D/g, "")) +
                      Number(this.state.headCountFemale) +
                      Number(this.state.headCountUnknown) +
                      Number(this.state.headCountNonBinary),
                  })
                }
              />
              <Input
                keyboardType="numeric"
                status="primary"
                label="Girls"
                style={{ width: "40%", marginRight: "3%" }}
                value={this.state.headCountFemale.toString()}
                onChangeText={(nextValue) =>
                  this.setState({
                    headCountFemale: nextValue.replace(/\D/g, ""),
                    numberOfStudentsCounted:
                      Number(nextValue.replace(/\D/g, "")) +
                      Number(this.state.headCount) +
                      Number(this.state.headCountUnknown) +
                      Number(this.state.headCountNonBinary),
                  })
                }
              />
              <Input
                keyboardType="numeric"
                status="primary"
                label="Non binary"
                style={{ width: "40%", marginTop: "4%", marginRight: "3%" }}
                value={this.state.headCountNonBinary.toString()}
                onChangeText={(nextValue) =>
                  this.setState({
                    headCountNonBinary: nextValue.replace(/\D/g, ""),
                    numberOfStudentsCounted:
                      Number(nextValue.replace(/\D/g, "")) +
                      Number(this.state.headCountFemale) +
                      Number(this.state.headCountUnknown) +
                      Number(this.state.headCount),
                  })
                }
              />
              <Input
                keyboardType="numeric"
                status="primary"
                label="Unknown"
                style={{ width: "40%", marginTop: "4%", marginRight: "3%" }}
                value={this.state.headCountUnknown.toString()}
                onChangeText={(nextValue) => {
                  this.setState({
                    headCountUnknown: nextValue.replace(/\D/g, ""),
                    numberOfStudentsCounted:
                      Number(nextValue.replace(/\D/g, "")) +
                      Number(this.state.headCountFemale) +
                      Number(this.state.headCountNonBinary) +
                      Number(this.state.headCount),
                  });
                }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );

    const descriptionArea = () => (
      <Layout style={{ padding: 5 }} level="2">
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.row}>
            <View style={styles.column}>
              {descriptionRowText("Team:", this.state.teamName)}
              {descriptionRowTextImage("Session Type:", this.state.topic)}
              {descriptionRowTextDate("Date:", this.state.date)}
              {descriptionRowTextDate(
                "Start Time:",
                this.state.sessionStart
                  ? moment(
                      new Date(
                        new Date(
                          `2023-08-26T${this.state.sessionStart}`
                        ).setHours(
                          new Date(
                            `2023-08-26T${this.state.sessionStart}`
                          ).getHours() + 3
                        )
                      )
                    ).format("LT")
                  : ""
              )}
              {descriptionRowTextDate(
                "End Time:",
                this.state.sessionEnd
                  ? moment(
                      new Date(
                        new Date(
                          `2023-08-26T${this.state.sessionEnd}`
                        ).setHours(
                          new Date(
                            `2023-08-26T${this.state.sessionEnd}`
                          ).getHours() + 3
                        )
                      )
                    ).format("LT")
                  : ""
              )}
              {descriptionRowText("Students:", this.state.numberOfStudents)}
            </View>
          </View>
        </ScrollView>
        <Divider />
      </Layout>
    );

    return (
      <Layout style={{ flex: 1 }} level="1">
        <React.Fragment>
          {this.state.showHeadcounts
            ? descriptionAreaHeadcount()
            : descriptionArea()}
          {updateButton()}
          {this.state.headCountModalStatus && headCountModal()}
          {updateModal()}
          {loadingModal()}
          {!this.state.showHeadcounts ? (
            <React.Fragment>
              <View>
                {duplicatesRecordsModal()}
                {loadingModalRecords()}
                {updatingModal()}
                {noMatch("basic")}
                {nullSessionsError("basic")}
              </View>
              <Divider />
              <List
                style={{ width: "100%", marginBottom: "15%" }}
                data={this.state.enrollments}
                ItemSeparatorComponent={Divider}
                renderItem={studentAttendanceItem}
              />
            </React.Fragment>
          ) : null}
          {!this.state.keyboardIsActive && (
            <View style={styles.rowBottom}>
              <Button
                style={{
                  width: "17%",
                  backgroundColor: buttonColor(),
                  marginRight: "2%",
                }}
                status="primary"
                accessoryLeft={backIcon}
                onPress={() => this.backArrow()}
              ></Button>
              <Button
                style={{
                  width: "62%",
                  alignSelf: "center",
                  backgroundColor: buttonColor(),
                }}
                status="primary"
                accessoryLeft={editIcon}
                onPress={() =>
                  this.state.showHeadcounts
                    ? this.editHeadCountSession("EditHeadCountSessionModal")
                    : this.editSession("EditSessionModal")
                }
              >
                EDIT SESSION
              </Button>
              <Button
                style={{
                  width: "17%",
                  backgroundColor: buttonColor(),
                  marginLeft: "2%",
                }}
                status="primary"
                accessoryLeft={forwardIcon}
                onPress={() => this.ForwardArrow()}
              ></Button>
            </View>
          )}
        </React.Fragment>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  sessions: state.sessions,
  sessions_tab: state.sessions_tab,
  user: state.user,
  sessionAttendance: state.sessionAttendance,
  sessionScreen: state.sessionScreen,
});

const ActionCreators = Object.assign(
  {},
  { syncSessions, syncSessions_SessionTab, updateSession, UnsavedAttendance }
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceScreen);

const styles = StyleSheet.create({
  attendanceDescriptionText_Label: {
    margin: 2,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  column: {
    flexDirection: "column",
  },
  popOverContent: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    shadowRadius: 10,
    shadowOpacity: 0.12,
    shadowColor: "#000",
  },
  popOverContentModal: {
    alignItems: "center",
    alignSelf: "center",
    shadowRadius: 10,
    shadowOpacity: 0.12,
    shadowColor: "#000",
  },
  modalText: {
    margin: 15,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropModal: {
    backgroundColor: "rgba(0, 0, 0, 0.0)",
  },
  icon: {
    width: 25,
    height: 25,
    marginBottom: "2%",
  },
});
