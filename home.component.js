import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TopNavigation } from "@ui-kitten/components";

export const HomeScreen = ({navigation}) => {
    return(
        <SafeAreaView style={{flex:1}}>
            <TopNavigation title='Home Screen' alignment='center'/>

        </SafeAreaView>
    );
}