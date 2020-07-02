import React, {Component} from "react";
import { Layout, Divider, List, ListItem, Icon } from '@ui-kitten/components';

import { TopBarNavigation } from "./components/navigation.component";

export default class TodayScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        let dataArray = [
            {title: 'Poetry', description: 'School A - Season 1 - 09:00 AM'},
            {title: 'Soccer', description: 'School A - Season 1 - 10:30 AM'},
            {title: 'Soccer', description: 'School B - Season 1 - 3:00 PM'}
        ]
        this.setState({data: dataArray})
    }

    render() {
        const { navigation } = this.props;
        const renderItemIcon = (props) => (
            <Icon {...props} name='arrow-ios-forward-outline'/>
        );

        let renderItem = ({ item, index }) => (
            <ListItem
                title={`${item.title}`}
                description={`${item.description}`}
                accessoryRight={renderItemIcon}
                onPress={() => navigation.navigate("Attendance")}
            />
        );

        return(
            <Layout style={{ flex: 1, justifyContent: 'center' }}>
                <TopBarNavigation/>
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