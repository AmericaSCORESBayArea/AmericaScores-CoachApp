import React from 'react';
import { Modal, Card, Text, Button, Layout, Input,  Autocomplete, AutocompleteItem, Icon } from '@ui-kitten/components';
import { StyleSheet, View, TouchableOpacity, Linking, Platform, ScrollView } from 'react-native';
import moment from "moment";
import Axios from 'axios';
import {ApiConfig} from "../config/ApiConfig";

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
    const [students, setStudents] = React.useState([]);
    const filter = async (item, query) => await item.Name.toLowerCase().includes(query.toLowerCase());
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
    const [data, setData] = React.useState(students);

    const onSelect = (index) => {
        setValue(students[index].Name);
    };

    async function fetchStudents() {
        await Axios.get(`${ApiConfig.dataApi}/contacts/search`, {
            params: {
                // Hardcoded value, change the "2019-08-21" for this.state.date for getting the result in a specific date
                searchString: value,    
            }
        })
              .then(res => setStudents(res.data))
              .catch(e => console.log(e));
    }

    const onChangeText = async (query) => {
        setValue(query);
        await fetchStudents();
        console.log(students);
        const filteredData = students.filter(async item => await filter(item, query));
        setData(filteredData);
    };
    const renderOption = (item, index) => (
        <AutocompleteItem
          key={index}
          title={item.Name}
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
                <Text style={{fontWeight: 'bold', fontSize: 16}} >Allergies/Medical Conditions:</Text>
                <Text>    {Allergies}</Text>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>{'\n'}Parent Info:</Text>
                <Text >   {ParentName}</Text>
                <TouchableOpacity onPress={() => openNumber(ParentPhone)} style={{height: "6%", width: "50%"}}>
                    <Text style={{color: '#add8e6', textDecorationLine: 'underline'}}>+1{ParentPhone}</Text>
                </TouchableOpacity>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>{'\n'}Emergency Contact:</Text>
                <Text >   {EmergencyContactName}</Text>
                <Text style={{fontWeight: 'bold'}}>   Relationship To Child:</Text>
                <Text>   {EmergencyContactRelationToChild}</Text>
                <TouchableOpacity onPress={() => openNumber(EmergencyContactPhone)} style={{height: "6%", width: "50%"}}>
                    <Text style={{color: '#add8e6', textDecorationLine: 'underline'}}>+1{EmergencyContactPhone}</Text>
                </TouchableOpacity>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>{'\n'}Second Emergency Contact:</Text>
                <Text >   {SecondEmergencyContactName}</Text>
                <Text style={{fontWeight: 'bold'}}>   Relationship To Child:</Text>
                <Text>   {SecondEmergencyContactRelationToChild}</Text>
                <TouchableOpacity onPress={() => openNumber(SecondEmergencyContactPhone)} style={{height: "6%", width: "50%"}}>
                    <Text style={{color: '#add8e6', textDecorationLine: 'underline'}}>+1{SecondEmergencyContactPhone}</Text>
                </TouchableOpacity>
            </Card>
        </Modal>
    );
}
  
  