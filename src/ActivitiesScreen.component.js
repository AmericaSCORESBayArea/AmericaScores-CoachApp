import React, {Component} from "react";
import { Layout, Divider, List, ListItem, Icon, Text, Datepicker } from '@ui-kitten/components';
import { View } from "react-native";

export default class ActivitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            date: new Date(),
        }
    }

    componentDidMount() {
        let dataArray = [
            {title: 'Poetry', description: 'School A - Season 1 - 09:00 AM'},
            {title: 'Soccer', description: 'School A - Season 1 - 10:30 AM'},
            {title: 'Soccer', description: 'School B - Season 1 - 3:00 PM'}
        ]
        this.setState({data: dataArray});
    }

    setDate(date) { this.setState({date: date}) }

    render() {
        const { navigation } = this.props;
        const renderItemIcon = (props) => (
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
                <Icon {...props} name='checkmark-outline'/> 
                <Text  style={{alignSelf:"baseline"}}>1 / 21</Text>
                <Icon {...props} name='people-outline'/> 
                <Icon {...props} name='arrow-ios-forward-outline'/> 
            </View>
        );

        let renderItem = ({ item, index }) => (
            <ListItem
                title={`${item.title}`}
                description={`${item.description}`}
                accessoryRight={renderItemIcon}
                onPress={() => navigation.navigate("Attendance")}
            />
        );

        const CalendarIcon = (props) => ( <Icon {...props} name='calendar'/> );

        return(
                <Layout style={{ flex: 1, justifyContent: 'center' }}>
                    <Layout style={{margin: "2%"}}>
                        <Datepicker
                            placeholder='Pick Date'
                            date={this.state.date}
                            onSelect={nextDate => this.setDate(nextDate)}
                            accessoryRight={CalendarIcon}
                        />
                        <Divider/>
                    </Layout>
                    <List
                        style={{width:"100%"}}
                        data={this.state.data}
                        ItemSeparatorComponent={Divider}
                        renderItem={renderItem}
                        />
                </Layout>                            
        );
    };
}