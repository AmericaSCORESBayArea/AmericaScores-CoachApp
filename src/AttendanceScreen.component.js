import React, { Component } from 'react';
import { Layout,CheckBox, Text, Button, Divider, Icon, List, ListItem } from '@ui-kitten/components';
import { TopBarNavigation } from './components/navigation.component';

export default class AttendanceScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const cameraIcon = (props) => (
            <Icon {...props} name='camera-outline'/>
        );

        const attendanceCheckBox = (props) => (
            <CheckBox 
                checked={false}
                onChange={nexchecked => console.log(nexchecked)}/>
        );

        const userItem = ({ item, index }) => (
            <ListItem
              title={`${item.title} ${index + 1}`}
              description={`${item.description} ${index + 1}`}
              accessoryLeft={attendanceCheckBox}
            />
        );
        
        const studentData = new Array(8).fill({
            title: 'Student',
            description: 'Description for Student',
        });

        return(
            <Layout style={{ flex: 1}}>
                <TopBarNavigation/>
                <List
                        style={{width: "100%"}}
                        data={studentData}
                        ItemSeparatorComponent={Divider}
                        renderItem={userItem}
                    />
                <Divider/>
                <Button style={{width:"100%"}} appearance='ghost' status='primary' accessoryLeft={cameraIcon}>
                    SCAN QR CODE
                </Button>  
            </Layout>
        )
    }
}

