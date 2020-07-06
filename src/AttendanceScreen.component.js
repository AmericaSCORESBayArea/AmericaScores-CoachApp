import React, { Component } from 'react';
import { Layout,CheckBox, Text, Button, Divider, Icon, List, ListItem } from '@ui-kitten/components';
import TopBarNavigation from './components/navigation.component';

export default class AttendanceScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentsList: []
        }
    }

    componentDidMount() {
        let studentDataArray = [
            {title: 'Student A', description: 'Description for Student', attended: false},
            {title: 'Student B', description: 'Description for Student', attended: false}
        ];
        this.setState({studentsList: studentDataArray})
    }

    checkStudent(index) {
        let newStudentsList = [...this.state.studentsList];
        newStudentsList[index].attended = !this.state.studentsList[index].attended;
        this.setState({studentsList: newStudentsList})
    }

    render() {
        const {navigation} = this.props;
        const cameraIcon = (props) => (
            <Icon {...props} name='camera-outline'/>
        );

        const userItem = ({ item, index }) => (
            <ListItem
              title={`${item.title} ${index + 1}`}
              description={`${item.description} ${index + 1}`}
              onPress={() => this.checkStudent(index)}
              accessoryLeft={() =><CheckBox checked={this.state.studentsList[index].attended} onChange={() => this.checkStudent(index)} /> }
            />
        );

        return(
            <Layout style={{ flex: 1}}>
                <TopBarNavigation navigation={navigation}/>
                <Divider/> 
                <Button style={{width:"100%"}} appearance='ghost' status='primary' accessoryLeft={cameraIcon}>
                    SCAN QR CODE
                </Button> 
                <Divider/> 
                <List
                        style={{width: "100%"}}
                        data={this.state.studentsList}
                        ItemSeparatorComponent={Divider}
                        renderItem={userItem}
                    />
            </Layout>
        )
    }
}

