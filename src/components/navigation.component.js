import React, {Component} from "react";
import {  Icon,TopNavigation, TopNavigationAction, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';

export default class TopBarNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overflowMenuVisible: false,
            isCreateStudentModalVisible: true,
        }
    };
    
    render() {
        const {navigation} = this.props;

        const BackIcon = (props) => ( <Icon {...props} name='arrow-back' /> );
        const BackAction = () => (
            <TopNavigationAction icon={BackIcon} appearance="default" onPress={() => navigation.goBack()}/>
        );

        const OptionsIcon = (props) => ( <Icon {...props} name='more-vertical-outline' /> );
        const OptionButtons = () => (
            <TopNavigationAction icon={OptionsIcon} appearance="default" onPress={() => this.setState({overflowMenuVisible: true})}/>
        );
        const OptionOverflowMenu = () => {
            return (
                <OverflowMenu
                anchor={OptionButtons}
                visible={this.state.overflowMenuVisible}
                placement={"bottom"}
                onBackdropPress={() => this.setState({overflowMenuVisible: false})}>
                    <MenuItem title='Create Student'/>
                    <MenuItem title='Add student'/>
                </OverflowMenu>
            );
        };  

        return (
            <TopNavigation title='Home Screen' alignment='center' accessoryLeft={() => <BackAction />} accessoryRight={()=> <OptionOverflowMenu />}/>
        )
    }
}
