import React from "react";
import {
  Modal,
  Card,
  Text,
  Button,
  Layout,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@ui-kitten/components";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import Axios from "axios";
import { ApiConfig } from "../config/ApiConfig";
import analytics from "@react-native-firebase/analytics";

export const AssessmentModal = (props) => {
  const [visible, setVisible] = React.useState(true);
  const [assessmentValue, setAssessmentValue] = React.useState();
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [responseSuccess, setResponseSuccess] = React.useState(false);
  const [updatingModalstate, setUpdatingModalstate] = React.useState(false);
  const [responseStatusModal, setResponseStatusModal] = React.useState(false);
  function closeModal() {
    setVisible(false);
    props.navigation.goBack();
  }
  function toggleNotificationOff() {
    setResponseStatusModal(false);
    setResponseSuccess(false);
    setVisible(false);
    props.navigation.goBack();
  }
  const data = ["PACER", "Activity Feedback"];
  const [fieldValue, setFieldValue] = React.useState(data[0]);
  function createAssessment() {
    setUpdatingModalstate(true);
    uploadAssessment();
  }
  const SuccessHeader = (props) => (
    <Layout {...props}>
      <ImageBackground
        resizeMode="contain"
        style={{ height: 100, width: 100, alignSelf: "center" }}
        source={require("../../assets/success_icon.png")}
      />
    </Layout>
  );
  const UnsuccessHeader = (props) => (
    <Layout {...props}>
      <ImageBackground
        resizeMode="contain"
        style={{ height: 100, width: 100, alignSelf: "center" }}
        source={require("../../assets/error_icon.png")}
      />
    </Layout>
  );
  const updateSuccessCard = (status, text) => (
    <Card
      style={{ alignSelf: "center", marginLeft: "14%" }}
      disabled={true}
      header={SuccessHeader}
    >
      <Text style={{ margin: 15 }} status={status}>
        {text}
      </Text>
      <Button
        appearance="outline"
        size={"small"}
        onPress={() => {
          toggleNotificationOff();
        }}
        status={status}
      >
        OK
      </Button>
    </Card>
  );
  const updateUnSuccessCard = (status, text) => (
    <Card disabled={true} header={UnsuccessHeader}>
      <Text style={{ margin: 15 }} status={status}>
        {text}
      </Text>
      <Button
        appearance="outline"
        size={"small"}
        onPress={() => toggleNotificationOff()}
        status={status}
      >
        OK
      </Button>
    </Card>
  );
  async function uploadAssessment() {
    let assessment = {
      AssessmentResponse: assessmentValue,
      StudentId: props.route.params.Student.StudentId,
      AssessmentType: fieldValue.replace(" ", "_"),
    };
    // console.log(assessment);
    await analytics().logEvent("CreateAssessment", {
      coach_Id: props.route.params.User.ContactId,
      student_Id: assessment.StudentId,
      assessment_Type: assessment.AssessmentType,
      assessment_Response: assessment.AssessmentResponse,
    });
    await Axios.post(
      `${ApiConfig.dataApi}/coach/${props.route.params.User.ContactId}/teamseasons/${props.route.params.Session.TeamSeasonId}/sessions/${props.route.params.Session.SessionId}/assessments`,
      assessment
    )
      .then((res) => {
        // console.log(res.data);
        setUpdatingModalstate(false);
        setResponseStatusModal(true);
        setResponseSuccess(true);
      })
      .catch((e) => {
        setUpdatingModalstate(false);
        setResponseStatusModal(true);
        setResponseSuccess(false);
        console.log(e);
      });
  }
  const Footer = (props) => (
    <Layout {...props}>
      <Button appearance="ghost" status="danger" onPress={() => closeModal()}>
        Cancel
      </Button>
      <Button onPress={() => createAssessment()}>CREATE ASSESSMENT</Button>
    </Layout>
  );

  const Header = (props) => (
    <Layout {...props}>
      <Text category="h6">Create Assessment</Text>
      <Text category="s1" appearance="hint">
        An assessment with the following attributes will be created for the
        selected student.
      </Text>
    </Layout>
  );

  const updateModal = () => (
    <Modal
      visible={responseStatusModal}
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        shadowRadius: 10,
        shadowOpacity: 0.12,
        shadowColor: "#000",
      }}
      backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onBackdropPress={() => toggleNotificationOff()}
    >
      {responseSuccess
        ? updateSuccessCard("success", "Assessment created successfuly")
        : updateUnSuccessCard(
            "danger",
            "Unable to create record. If you are certain this isn´t a duplicate of the same student, session, and type, please report this using Help->Report a Problem"
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
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        shadowRadius: 10,
        shadowOpacity: 0.12,
        shadowColor: "#000",
      }}
      visible={updatingModalstate}
      backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      {spinnerCard()}
    </Modal>
  );

  const selectIndex = (index) => {
    setSelectedIndex(index);
    setFieldValue(data[index.row]);
  };
  return (
    <Modal
      visible={visible}
      onBackdropPress={() => closeModal()}
      style={{ width: "80%" }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.select({
          ios: () => 50,
          android: () => 50,
        })()}
        enabled={true}
      >
        <ScrollView>
          {updatingModal()}
          {updateModal()}
          <Card disabled={true} header={Header} footer={Footer}>
            <ScrollView>
              <Text style={{ marginBottom: "4%" }}>Student name</Text>
              <Input
                placeholder="Name"
                value={props.route.params.Student.StudentName}
                disabled={true}
              />
              <Text style={{ marginBottom: "4%", marginTop: "4%" }}>Type</Text>
              <Select
                placeholder="Type"
                value={fieldValue}
                size="large"
                selectedIndex={selectedIndex}
                onSelect={(index) => selectIndex(index)}
              >
                {data.map((title, i) => (
                  <SelectItem key={title} title={title} />
                ))}
              </Select>
              <Text style={{ marginBottom: "4%", marginTop: "4%" }}>Value</Text>
              <Input
                placeholder="Value"
                value={assessmentValue}
                onChangeText={(enteredAssessmentValue) =>
                  setAssessmentValue(enteredAssessmentValue)
                }
              />
            </ScrollView>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};
