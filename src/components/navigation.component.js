import React, {Component} from "react";
import {  Icon,TopNavigation, TopNavigationAction, Button } from '@ui-kitten/components';

export default class TopBarNavigation extends Component {
    constructor(props) {
        super(props);
    };
    
    render() {
        const {navigation} = this.props;

        const BackIcon = (props) => (
            <Icon {...props} name='arrow-back' />
        );
        
        const BackAction = () => (
            <TopNavigationAction icon={BackIcon} appearance="default" onPress={() => navigation.goBack()}/>
        );

        return (
            <TopNavigation title='Home Screen' alignment='center' accessoryLeft={() => <BackAction />}/>
        )
    }
}
