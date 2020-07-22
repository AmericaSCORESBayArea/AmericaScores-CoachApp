import React, { Component } from 'react';
import { Layout,CheckBox, Button, Divider, Icon, List, ListItem, Text } from '@ui-kitten/components';
import { StyleSheet, View, Image } from 'react-native';

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
        const cameraIcon = (props) => ( <Icon {...props} name='camera-outline'/> );
        const checkIcon = (props) => ( <Icon {...props} name='checkmark'/> );
        const doubledCheckedIcon = (props) => ( <Icon {...props} name='done-all' /> );

        const checkMark = (props) => {
            if (false) return checkIcon(props);
            else return doubledCheckedIcon(props);
        }

        const studentAttendanceItem = ({ item, index }) => (
            <ListItem
              title={`${item.title} ${index + 1}`}
              description={`${item.description} ${index + 1}`}
              onPress={() => this.checkStudent(index)}
              accessoryLeft={() =><CheckBox checked={this.state.studentsList[index].attended} onChange={() => this.checkStudent(index)} /> }
            />
        );

        const descriptionRowText = (label, description) => (
            <View style={styles.row}>
                <Text style={styles.attendanceDescriptionText_Label} category='s1'>{label}</Text>
                <Text style={{fontSize: 14}} category="p1">{description}</Text>
            </View>
        );

        return(
            <Layout style={{ flex: 1}} level="1">
                <Button style={{width:"100%"}} appearance='ghost' status='primary' accessoryLeft={cameraIcon} onPress={() => navigation.navigate("Scan students QR")}>
                    SCAN QR CODE
                </Button> 
                <Divider/>
                <Layout style={{padding: 5}}level="2">
                    <View style={styles.row}>
                        <Layout style={{margin: 5, flex: 0.5}} level="2">
                            <Image style={{width:100, height:100, alignSelf:"center"}} source={require("./../assets/ASBA_Logo.png")}/>
                        </Layout>
                        <View style={styles.column}>
                            {descriptionRowText("Team","School A - Season 1")}
                            {descriptionRowText("Class","Poetry")}
                            {descriptionRowText("Date", "25 Aug 2020")}
                            {descriptionRowText("Students", 20)}
                        </View>
                    </View>
                    <Divider/>

                </Layout>
                <List
                    style={{width: "100%"}}
                    data={this.state.studentsList}
                    ItemSeparatorComponent={Divider}
                    renderItem={studentAttendanceItem}
                    />
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    attendanceDescriptionText_Label: {
        margin: 2,
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flexDirection: "column"
    }
});
