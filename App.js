import React, { useEffect } from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import AppNavigator from "./src/AppNavigator.Screen";
import { Provider } from "react-redux";
import inAppMessaging from "@react-native-firebase/in-app-messaging";
import { default as theme } from "./assets/ASBA_Theme_Light_v1.json"; // <-- Import app theme
import { default as mapping } from "./mapping.json";
import { ApiConfig } from "./src/config/ApiConfig";

import configureStore from "./src/config/ConfigureStore";
import Axios from "axios";

// When configured correctly, URLSchemes should contain your REVERSED_CLIENT_ID
const store = configureStore();

export default function App() {
  Axios.defaults.headers.common["client_id"] = ApiConfig.clientId;
  Axios.defaults.headers.common["client_secret"] = ApiConfig.clientSecret;
  useEffect(() => {
    const dismissFirebaseModal = async () => {
      await inAppMessaging().setMessagesDisplaySuppressed(true);
    };
    dismissFirebaseModal();
  }, []);
  // console.log("store", store.getState());
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        store={configureStore}
        {...eva}
        theme={{ ...eva.light, ...theme }}
        customMapping={mapping}
      >
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </ApplicationProvider>
    </>
  );
}
