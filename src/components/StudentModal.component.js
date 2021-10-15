import React from 'react';
import { Modal, Card, Text, Button, Layout, Input,  Autocomplete, AutocompleteItem, Icon } from '@ui-kitten/components';
import { StyleSheet, View, TouchableOpacity, Linking, Platform, ScrollView } from 'react-native';
import moment from "moment";

export const CreateStudentModal = ({navigation}) => {
    const [visible, setVisible] = React.useState(true);
    const [nameValue, setNameValue] = React.useState();
    const [surenameValue, setSureNameValue] = React.useState();

    function closeModal() {
        setVisible(false); 
        navigation.goBack();
    }

    function createStudent() {
        console.log(nameValue, surenameValue);
        closeModal();
    }

    const Footer = (props) => (
        <Layout {...props}>
            <Button appearance='ghost' status='danger' onPress={() => createStudent()}>
                Cancel
            </Button>
            <Button onPress={() => createStudent()}>
                CREATE STUDENT
            </Button>
        </Layout>
    );

    const Header = (props) => (
        <Layout {...props}>
          <Text category='h6'>Create Student</Text>
          <Text category='s1' appearance='hint'>A student with the following attributes will be created.</Text>
        </Layout>
    );

    return(
        <Modal
            visible={visible}
            onBackdropPress={() => closeModal()}
            style={{width:'80%'}}>
            <Card disabled={true} header={Header} footer={Footer}>
                <Text >Student name</Text>
                <Input
                    placeholder='Name'
                    value={nameValue}
                    onChangeText={enteredValue => setNameValue(enteredValue)}
                />
                <Text >Student surename</Text>
                <Input
                    placeholder='Surename'
                    value={surenameValue}
                    onChangeText={enteredSureNameValue => setSureNameValue(enteredSureNameValue)}
                />
                <Text >Team</Text>
                <Input
                    placeholder='Team'
                    value={surenameValue}
                    onChangeText={enteredSureNameValue => setSureNameValue(enteredSureNameValue)}
                />
            </Card>
        </Modal>
    );
}

export const AddStudentToTeamModal = ({navigation}) => {
    const movies = [
        { title: 'Star Wars' },
        { title: 'Back to the Future' },
        { title: 'The Matrix' },
        { title: 'Inception' },
        { title: 'Interstellar' },
      ];
      
      const filter = (item, query) => item.title.toLowerCase().includes(query.toLowerCase());
    const [visible, setVisible] = React.useState(true);
    const [nameValue, setNameValue] = React.useState();
    const [surenameValue, setSureNameValue] = React.useState();

    function closeModal() {
        setVisible(false); 
        navigation.goBack();
    }

    function createStudent() {
        console.log(nameValue, surenameValue);
        closeModal();
    }

        const [value, setValue] = React.useState(null);
    const [data, setData] = React.useState(movies);

    const onSelect = (index) => {
        setValue(movies[index].title);
    };

    const onChangeText = (query) => {
        setValue(query);
        setData(movies.filter(item => filter(item, query)));
    };
    const renderOption = (item, index) => (
        <AutocompleteItem
          key={index}
          title={item.title}
        />
      );

    const Footer = (props) => (
        <Layout {...props}>
            <Button appearance='ghost' status='danger' onPress={() => createStudent()}>
                Cancel
            </Button>
            <Button onPress={() => createStudent()}>
                ADD STUDENT
            </Button>
        </Layout>
    );

    const Header = (props) => (
        <Layout {...props}>
          <Text category='h6'>Add a Student to a team</Text>
          <Text category='s1' appearance='hint'>Search for a student and add it to a team.</Text>
        </Layout>
    );

    return(
        <Modal
            visible={visible}
            onBackdropPress={() => closeModal()}
            style={{width:'80%'}}>
            <Card disabled={true} header={Header} footer={Footer}>
                <Autocomplete
                placeholder='Student Name'
                value={value}
                onSelect={onSelect}
                onChangeText={onChangeText}>
                {data.map(renderOption)}
                </Autocomplete>
            </Card>
        </Modal>
    );
}

export const StudentInfoModal = ({navigation, route}) => {
    const [visible, setVisible] = React.useState(true);
    const {StudentName,
        Birthdate,
        Allergies, 
        ParentName, 
        ParentPhone, 
        EmergencyContactName, 
        EmergencyContactRelationToChild, 
        EmergencyContactPhone, 
        SecondEmergencyContactName, 
        SecondEmergencyContactRelationToChild,
        SecondEmergencyContactPhone,
        LastModifiedDate} = route.params;

    function closeModal() {
        setVisible(false); 
        navigation.goBack();
    }

    
    function openNumber(phone){

        let phoneNumber = '';
    
        if (Platform.OS === 'android') {
          phoneNumber = `tel:${phone}`;
        } else {
          phoneNumber = `telprompt:${phone}`;
        }
    
        Linking.openURL(phoneNumber);
      };

    const Footer = (props) => (
        <Layout {...props}>
            <Button onPress={() => closeModal()}>
                CLOSE
            </Button>
        </Layout>
    );

    const Header = (props) => (
        <Layout {...props}>
          <Text category='h6'>{StudentName}</Text>
          <Text category='s1'>Date of Birth: {Birthdate}</Text>
          <Text category='s1' appearance='hint'>Last Modified Date: {moment(LastModifiedDate).format("MMMM Do YYYY, h:mm:ss a")}</Text>
        </Layout>
    );

    return(
        <Modal
            visible={visible}
            onBackdropPress={() => closeModal()}
            style={{width:'80%'}}>
            <Card disabled={true} header={Header} footer={Footer}>
                <Text >Allergies: {Allergies}</Text>
                <Text >Parent Info:</Text>
                <Text >   {'\n'}   {ParentName}</Text>
                <TouchableOpacity onPress={() => openNumber(ParentPhone)} style={{height: "6%", width: "50%"}}>
                    <Text style={{color: '#add8e6'}}>   {ParentPhone}</Text>
                </TouchableOpacity>
                <Text >Emergency Contact:</Text>
                <Text >   {'\n'}   {EmergencyContactName}</Text>
                <Text >   Relationship To Child:{'\n'}   {EmergencyContactRelationToChild}</Text>
                <TouchableOpacity onPress={() => openNumber(EmergencyContactPhone)} style={{height: "6%", width: "50%"}}>
                    <Text style={{color: '#add8e6'}}>   {EmergencyContactPhone}</Text>
                </TouchableOpacity>
                <Text >Second Emergency Contact:</Text>
                <Text >  {'\n'}   {SecondEmergencyContactName}</Text>
                <Text >   Relationship To Child:{'\n'}   {SecondEmergencyContactRelationToChild}</Text>
                <TouchableOpacity onPress={() => openNumber(SecondEmergencyContactPhone)} style={{height: "6%", width: "50%"}}>
                    <Text style={{color: '#add8e6'}}>   {SecondEmergencyContactPhone}</Text>
                </TouchableOpacity>
            </Card>
        </Modal>
    );
}
  
  