import React, {Component} from "react";
import { Layout, Divider, List, ListItem, Icon } from '@ui-kitten/components';

import TopBarNavigation  from './components/navigation.component';

export default class SchoolsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        let dataArray = new Array(8).fill({title: 'School - Season', description: 'Description for Item'});
        this.setState({data: dataArray})
    }

    render() {
        const {navigation} = this.props;

        const renderItemIcon = (props) => (
            <Icon {...props} name='arrow-ios-forward-outline'/>
        );

        let renderItem = ({ item, index }) => (
            <ListItem
                title={`${item.title} ${index + 1}`}
                description={`${item.description} ${index + 1}`}
                accessoryRight={renderItemIcon}
                onPress={() => navigation.navigate("Activities")}
            />
        );

        return(
            <Layout style={{ flex: 1, justifyContent: 'center'}}>
                <TopBarNavigation navigation={navigation} />
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