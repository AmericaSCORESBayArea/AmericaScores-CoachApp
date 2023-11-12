import React from "react";
import { ApiConfig } from "../config/ApiConfig";
import DeviceInfo from "react-native-device-info";
import axios from "axios";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export async function RequestDeleteAccount(
  closeModal,
  user,
  closeLoadingModal,
  logOutUser,
  changeRegion,
  goToLogin
) {
  const message = {
    "Content-type": "application/json",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*Message:* " +
            " " +
            "The following Coach has requested to delete their account.",
        },
        fields: [
          {
            type: "mrkdwn",
            text: "*Coach Information*",
          },
          {
            type: "mrkdwn",
            text: "*First Name:* " + " " + user.FirstName,
          },
          {
            type: "mrkdwn",
            text: "*Last Name:* " + " " + user.LastName,
          },
          {
            type: "mrkdwn",
            text: "*ContactId:* " + " " + user.ContactId,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "Sent From: " +
            " " +
            DeviceInfo.getSystemName() +
            " " +
            DeviceInfo.getSystemVersion(),
        },
      },
      {
        type: "divider",
        block_id: "divider1",
      },
    ],
  };
  postMessageToChannel(
    closeModal,
    message,
    closeLoadingModal,
    logOutUser,
    changeRegion,
    goToLogin
  );
}

async function logOutOnPress(logOutUser, changeRegion, goToLogin) {
  try {
    await GoogleSignin.signOut();
    await auth().signOut();
    await logOutUser();
    await changeRegion();
    await goToLogin();
  } catch (error) {
    console.log(error);
  }
}

const postMessageToChannel = (
  closeModal,
  message,
  closeLoadingModal,
  logOutUser,
  changeRegion,
  goToLogin
) => {
  axios
    .post(ApiConfig.slackWebHookDeleteUser, message)
    .then(function (response) {
      closeModal();
      closeLoadingModal();
      logOutOnPress(logOutUser, changeRegion, goToLogin);
    })
    .catch(function (error) {
      console.log(error);
      Alert.alert(
        "Oops",
        "An Error occured while deleting the user. Please try again."
      );
      closeLoadingModal();
    });
};
