import React, { useState } from 'react';
import { Modal, Card, Text, Button, Layout, Input,  Autocomplete, AutocompleteItem, Icon, List, Divider, ListItem } from '@ui-kitten/components';
import { StyleSheet, View, TouchableOpacity, Linking, Platform, ScrollView, Alert, TouchableWithoutFeedback, Image } from 'react-native';
import moment from "moment";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Axios from 'axios';
import {ApiConfig} from "../config/ApiConfig";
import analytics from '@react-native-firebase/analytics';

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
            style={{width:'95%'}}>
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

// const filter = async (item, value) => await item.Name.toLowerCase().includes(value.toLowerCase());

export const AddStudentToTeamModal = ({navigation, route}) => {
    const [students, setStudents] = React.useState([]);
    const [finished, setFinished] = React.useState(false);
    const [started, setStarted] = React.useState(false);
    const {teamSeasonId, region, enrolled} = route.params;
    const [visible, setVisible] = React.useState(true);
    const [selectedStudent, setSelectedStudent] = React.useState();
    const [suggestions, setSuggestions] = React.useState();
    const [loadingModalstate, setLoadingModalstate] = React.useState(false);
    

      const renderSearchIcon = (props) => (
        // <TouchableOpacity onPress={() => filterData()}>
          <Icon {...props} name='search-outline'/>
        // </TouchableOpacity>
      );

    function closeModal() {
        setVisible(false);
        navigation.goBack();
    }
    function openWhatsappGroup(){
        let phoneWithCountryCode = []
        phoneWithCountryCode.map(value => {
            let url = `http://api.whatsapp.com/send?text=hello&phone=${value}`
            Linking.openURL(url).then((data) => {
                console.log('WhatsApp Opened');
              }).catch(() => {
                alert('Make sure WhatsApp installed on your device');
            });
        });
    }
    const LoadingGif = () => {
        if(region === "ASBA"){
            return require('../../assets/Scores_Logo.gif');//Scores logo gif
        }else if(region === "IFC"){
            return require('../../assets/IFC_Logo_animated.gif');//IFC logo gif
        }else if(region === "OGSC"){
            return require('../../assets/OGSC_logo_spinner.gif');//Genesis logo gif
        }
    }

    async function canCreateStudent() {
        if(selectedStudent){
        setLoadingModalstate(true);
        const exists = enrolled.find(student => student.StudentId === selectedStudent.Id);

        if(!exists) {
            createStudent()
        } else {
            setLoadingModalstate(false);
            Alert.alert("Error", "This student is already enrolled in this team");
        }
        }
        else{
            Alert.alert("Error", "You have to select a student first")
        }
    }

    async function createStudent() {
        let student = {
            "TeamSeasonId": teamSeasonId,
            "StudentId": selectedStudent.Id,
        }
        await Axios.post(`${ApiConfig.dataApi}/enrollments`,
            student)
              .then(res => {
                  if(res.data){
                      setLoadingModalstate(false);
                      await analytics().logSelectContent({
                        content_type: `Enrolled student ${selectedStudent.Id}`,
                        item_id: "student_enrolled",
                      }) 
                      Alert.alert("Success", "Student was enrolled succesfully")
                    }
                    setLoadingModalstate(false); 
                })
              .catch(e => console.log(e));
    }

    const [value, setValue] = React.useState("");
    const [data, setData] = React.useState([]);

    const onSelect = (index) => {
        setValue(data[index].Name);
        setSelectedStudent(data[index])
    };

    const loadingModal = () => (
        <Modal
            style={styles.popOverContent}
            visible={loadingModalstate}
            backdropStyle={styles.backdrop}>
            <Image source={LoadingGif()}/>
        </Modal>
    )

    async function fetchStudents(query) {
        return await Axios.get(`${ApiConfig.dataApi}/contacts/search`, {
            params: {
                // Hardcoded value, change the "2019-08-21" for this.state.date for getting the result in a specific date
                searchString: query,    
            }
        })
              .then(res =>
                    res.data
                )
              .catch(e => console.log(e));
    };

    // async function startTimer() {
    //     setTimeout(filterData, 3000);
    //     // console.log()
    // };


    async function filterData() {
        const unfiltered = await fetchStudents(value);
        if(unfiltered.length > 0) {
            setData(unfiltered);
        } else {
            Alert.alert("", "No students found");
        }
    };

    const renderOption = ({item, index}) => ( 
        <ListItem
        title={item.Name}
        onPress={() => onSelect(index)}
        />
    );


    const Footer = (props) => (
        <Layout {...props}>
            <Button appearance='ghost' status='danger' onPress={() => closeModal()}>
                Cancel
            </Button>
            <Button onPress={() => canCreateStudent()}>
                ADD STUDENT
            </Button>
            {/*<Ionicons
                    name="logo-whatsapp"
                    size={28}
                    style={{color: 'green', marginTop:'4.7%',justifyContent:'space-between', marginLeft:'38.9%'}}
                    onPress={() => openWhatsappGroup()}
            />*/}
        </Layout>
    );

    const Header = (props) => (
        <Layout {...props}>
          <Text category='h6'>Add a Student to a team</Text>
          <Text category='s1' appearance='hint'>Search for a student and add it to a team.</Text>
        </Layout>
    );

    const SearchBar = () => (
        <View>
        <Input
            placeholder='Student Name'
            value={value}
            onChangeText={enteredSureNameValue => setValue(enteredSureNameValue)}
        />
        </View>
    )

    return(
        <React.Fragment>
        <Modal
            visible={visible}
            onBackdropPress={() => closeModal()}
            style={{ width: '95%', height: '100%'}}>
            <ScrollView>    
            <Card disabled={true} style={{ marginTop: '6%', height: '100%', width: '100%', marginBottom: '10%' }} header={Header} footer={Footer}>
                <ScrollView>
                {SearchBar()}
                <Button style={{margin: 2}} appearance='outline' accessoryRight={renderSearchIcon} onPress={() => filterData()}>
                    Search
                </Button>
                {loadingModal()}
                {/* <View> */}
                    <List
                        style={{opacity: 0.95, overflow: "scroll", maxHeight: 180}}
                        data={data}
                        ItemSeparatorComponent={Divider}
                        renderItem={renderOption}
                    />
                {/* </View> */}
                </ScrollView>
            </Card>
            </ScrollView>
        </Modal>
        </React.Fragment>
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

    function openWhatsapp(phone){
        let phoneWithCountryCode = '+'+1+phone
        let url = `http://api.whatsapp.com/send?phone=${phoneWithCountryCode}`
        Linking.openURL(url).then((data) => {
            console.log('WhatsApp Opened');
          }).catch(() => {
            alert('Make sure WhatsApp installed on your device');
        });
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
    function smsNumber(phone){
        let phoneNumber = '';
        if (Platform.OS === 'android') {
          phoneNumber = `sms:${phone}`;
        } else {
          phoneNumber = `sms:${phone}`;
        }
        Linking.openURL(phoneNumber);
    }
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
            style={{width:'100%'}}>
            <Card disabled={true} header={Header} footer={Footer} style={{width:'102%'}}>
                <ScrollView >
                    <Text style={{fontWeight: 'bold', fontSize: 16}} >Allergies/Medical Conditions:</Text>
                    <Text>    {Allergies}</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>{'\n'}Parent Info:</Text>
                    <Text >   {ParentName}</Text>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => openNumber(ParentPhone)} style={{width: "45%", marginTop:'1%'}}>
                            <Text style={{color: '#add8e6', textDecorationLine: 'underline'}}>+1{ParentPhone}</Text>
                        </TouchableOpacity>
                        {ParentPhone.length !== 0?
                                <React.Fragment>
                                    <Ionicons
                                            name="logo-whatsapp"
                                            size={28}
                                            style={{color: 'green',justifyContent:'space-between'}}
                                            onPress={() => openWhatsapp(ParentPhone)}
                                        />
                                    <Feather
                                        name="phone-call"
                                        size={25}
                                        style={{color: 'black',justifyContent:'space-between', marginLeft:'7%'}}
                                        onPress={() => openNumber(ParentPhone)}
                                    />
                                    <Feather
                                        name="message-square"
                                        size={25}
                                        style={{color: 'black', justifyContent:'space-between', marginLeft:'7%'}}
                                        onPress={() => smsNumber(ParentPhone)}
                                    />
                                </React.Fragment>
                                : <></>
                            }
                    </View>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>{'\n'}Emergency Contact:</Text>
                    <Text >   {EmergencyContactName}</Text>
                    <Text style={{fontWeight: 'bold'}}>   Relationship:</Text>
                    <Text>   {EmergencyContactRelationToChild}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => openNumber(EmergencyContactPhone)}  style={{width: "45%", marginTop:'1%'}}>
                            <Text style={{color: '#add8e6', textDecorationLine: 'underline'}}>+1{EmergencyContactPhone}</Text>
                        </TouchableOpacity>
                        {EmergencyContactPhone.length !== 0?
                            <React.Fragment>
                                <Ionicons
                                        name="logo-whatsapp"
                                        size={28}
                                        style={{color: 'green',justifyContent:'space-between'}}
                                        onPress={() => openWhatsapp(EmergencyContactPhone)}
                                        />
                                <Feather
                                    name="phone-call"
                                    size={25}
                                    style={{color: 'black',justifyContent:'space-between', marginLeft:'7%'}}
                                    onPress={() => openNumber(EmergencyContactPhone)}
                                    />
                                <Feather
                                    name="message-square"
                                    size={25}
                                    style={{color: 'black',justifyContent:'space-between',marginLeft:'7%'}}
                                    onPress={() => smsNumber(EmergencyContactPhone)}
                                    />
                            </React.Fragment>
                            : <></>
                        }
                    </View>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>{'\n'}Second Emergency Contact:</Text>
                    <Text >   {SecondEmergencyContactName}</Text>
                    <Text style={{fontWeight: 'bold'}}>   Relationship:</Text>
                    <Text>   {SecondEmergencyContactRelationToChild}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => openNumber(SecondEmergencyContactPhone)} style={{width: "45%", marginTop:'1%'}}>
                            <Text style={{color: '#add8e6', textDecorationLine: 'underline'}}>+1{SecondEmergencyContactPhone}</Text>
                        </TouchableOpacity>
                        {SecondEmergencyContactPhone.length !== 0?
                            <React.Fragment>
                                <Ionicons
                                        name="logo-whatsapp"
                                        size={28}
                                        style={{color: 'green',justifyContent:'space-between'}}
                                        onPress={() => openWhatsapp(SecondEmergencyContactPhone)}
                                    />
                                <Feather
                                    name="phone-call"
                                    size={25}
                                    style={{color: 'black',justifyContent:'space-between', marginLeft:'7%'}}
                                    onPress={() => openNumber(SecondEmergencyContactPhone)}
                                />
                                 <Feather
                                    name="message-square"
                                    size={25}
                                    style={{color: 'black',justifyContent:'space-between', marginLeft: '7%'}}
                                    onPress={() => smsNumber(SecondEmergencyContactPhone)}
                                />
                            </React.Fragment>
                            : <></>
                        }
                    </View>
                </ScrollView>
            </Card>
        </Modal>
    );
}
  
const styles = StyleSheet.create({
    popOverContent: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'center',
        shadowRadius: 10,
        shadowOpacity: 0.12,
        shadowColor: "#000"
    },
    image: {
        flex:1, 
        resizeMode: "contain",
        opacity: 0.99,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
