import React from "react";
import {  Icon,TopNavigation, TopNavigationAction } from '@ui-kitten/components';


const BackIcon = (props) => (
    <Icon {...props} name='arrow-back' />
);

const BackAction = ({navigation}) => (
    <TopNavigationAction icon={BackIcon} appearance="default" onPress={() => navigation.goBack()}/>
);

export const TopBarNavigation = ({navigation}) => (
    <TopNavigation title='Home Screen' alignment='center' accessoryLeft={props => <BackAction {...props} navigation={navigation}/>}/>
)