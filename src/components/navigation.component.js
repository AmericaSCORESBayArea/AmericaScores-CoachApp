import React, {Component} from "react";
import {  Icon,TopNavigation, TopNavigationAction, Text, Button, OverflowMenu, MenuItem } from '@ui-kitten/components';
import {SafeAreaView} from "react-native-safe-area-context";

export default class TopBarNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overflowMenuVisible: false,
            isCreateStudentModalVisible: true,
        }
    };
    
    menuItemOnPress(modalScreen) {
        this.setState({overflowMenuVisible: false});
        this.props.navigation.navigate(modalScreen);
    }

    render() {
        const {navigation} = this.props;

        const BackIcon = (props) => ( <Icon {...props} name='arrow-back' /> );
        const BackAction = () => (
            <TopNavigationAction style={{font: 'red'}} icon={BackIcon} appearance="default" onPress={() => navigation.goBack()}/>
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
                    <MenuItem title='Create Student' onPress={() => this.menuItemOnPress("CreateStudentModal")}/>
                    <MenuItem title='Add student' onPress={() => this.menuItemOnPress("AddStudentToTeamModal")}/>
                </OverflowMenu>
            );  
        };  

        const TitleText = () => {
            return(<Text style={{color:"white", fontWeight:'bold'}}> Home Screen</Text>);
        }

        return (
            <SafeAreaView  style={{ backgroundColor:'#284de0'}} edges={['right', 'top', 'left']} >
                <TopNavigation style={{ backgroundColor: '#284de0'}} title={TitleText} alignment='center' accessoryLeft={() => <BackAction />} accessoryRight={()=> <OptionOverflowMenu />} />
            </SafeAreaView>
        )
    }
}

// /* Color Theme Swatches in Hex */
// .Dashboard-design-2019-1-hex { color: #482EF2; }
// .Dashboard-design-2019-2-hex { color: #F2F2F2; }
// .Dashboard-design-2019-3-hex { color: #3747A6; }
// .Dashboard-design-2019-4-hex { color: #4E5BA6; }
// .Dashboard-design-2019-5-hex { color: #F25050; }

// /* Color Theme Swatches in RGBA */
// .Dashboard-design-2019-1-rgba { color: rgba(72, 46, 242, 1); }
// .Dashboard-design-2019-2-rgba { color: rgba(242, 242, 242, 1); }
// .Dashboard-design-2019-3-rgba { color: rgba(54, 71, 165, 1); }
// .Dashboard-design-2019-4-rgba { color: rgba(77, 91, 165, 1); }
// .Dashboard-design-2019-5-rgba { color: rgba(242, 79, 79, 1); }

// /* Color Theme Swatches in HSLA */
// .Dashboard-design-2019-1-hsla { color: hsla(247, 88, 56, 1); }
// .Dashboard-design-2019-2-hsla { color: hsla(0, 0, 95, 1); }
// .Dashboard-design-2019-3-hsla { color: hsla(230, 50, 43, 1); }
// .Dashboard-design-2019-4-hsla { color: hsla(230, 36, 47, 1); }
// .Dashboard-design-2019-5-hsla { color: hsla(0, 86, 63, 1); }