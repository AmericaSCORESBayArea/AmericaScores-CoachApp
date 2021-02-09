import React from 'react';
import { Modal, Card, Text, Button, Layout, Input, IndexPath, Select, SelectItem, Autocomplete, AutocompleteItem, CheckBox  } from '@ui-kitten/components';
import {
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView
  } from 'react-native';
import axios from 'axios';
import { ApiConfig } from "../config/ApiConfig";
  const suggestions = [
    {
        title: "Carlos Yanzon"
    },
    {
        title: "Ignacio Lopez Scala"
    },
    {
        title: "Pete Swearengen"
    },
    {
        title: "Colin Schmidt"
    },
    {
        title: "Santosh Mankala"
    }
  ];

  const psites = [
    {
        title: "Woodrow Wilson Elementary School"
    },
    {
        title: "ASCEND Elementary School"
    },
    {
        title: "Panorama Elementary School"
    },
    {
        title: "Hayward Unified School District"
    },
    {
        title: "Glassbrook Elementary School"
    }
  ];

  const filter = (item, query) => item.title.toLowerCase().includes(query.toLowerCase());

export const AddOtherTeamModal = ({route, navigation}) => {
    const [visible, setVisible] = React.useState(true);
    const [nameValue, setNameValue] = React.useState();
    const [programSiteValue, setProgramSiteValue] = React.useState();
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
    const {item, user} = route.params;
    const [checkedWritin, setCheckedWriting] = React.useState(false);
    const [checkedSoccer, setCheckedSoccer] = React.useState(false);
    const [checkedCoor, setCheckedCoor] = React.useState(false);
    const [checkedManager, setCheckedManager] = React.useState(false);
    
        // For Main Data
    const [CoachWriting, setCoachWriting] = React.useState(item.CoachWriting);
    const [CoachSoccer, setCoachSoccer] = React.useState(item.CoachSoccer);
    const [ProgramCoordinator, setProgramCoordinator] = React.useState(item.ProgramCoordinator);
    const [ProgramManager, setProgramManager] = React.useState(item.ProgramManager);
    
    // For Selected Data
//    var filteredNames = [{
//         "writingCoach": "",
//         "soccerCoach": "",
//         "programCoordinator": "",
//         "programManager": "",
//         "programSite": ""

//    }];

    function closeModal() {
        setVisible(false); 
        navigation.goBack();
    }


    const params = JSON.stringify({
        "TeamSeasonName": item.TeamSeasonName,
        "TeamId": item.TeamId,
        "SeasonId": item.SeasonId,
        "SchoolSite": item.SchoolSite,
        "Partnership": item.Partnership,
        "TotalNoOfPlayers": item.TotalNoOfPlayers,
        "TotalNoOfSessions": item.TotalNoOfSessions,
        "SeasonStartDate": item.SeasonStartDate,
        "SeasonEndDate": item.SeasonEndDate,
        "CoachSoccer": item.CoachSoccer,
        "CoachWriting": item.CoachWriting
      });


    function createTeam() {
        
        axios.patch(`${ApiConfig.dataApi}/teamseasons/`+teamSeasonId, params,{

            "headers": {
            
            "content-type": "application/json",
            
            },
            
            })
            .then(function(response) {
            
            console.log(response);
            
            })
            
            .catch(function(error) {
            
            console.log(error);
            
            });
        closeModal();
    }
    

    const Footer = (props) => (
        <Layout {...props}>
            <Button appearance='ghost' status='danger' onPress={() => createTeam()}>
                Cancel
            </Button>
            <Button onPress={() => createTeam()}>
                CONFIRM
            </Button>
        </Layout>
    );

    const data = [
        '--Select an option--',
        'Alumni',
        'Junior',
        'Middle',
        'Select',
        'Summer Camp',
        'Mixed Level',
      ];

    const renderOption = (title) => (
        <SelectItem title={title}/>
    );

    const displayValue = data[selectedIndex.row];

    const Header = (props) => (
        <Layout {...props}>
          <Text category='h6'>Change Team Role</Text>
          <Text category='s1' appearance='hint'>Select a role you would like to replace with yourself</Text>
        </Layout>
    );
    
    return(
        
        <KeyboardAvoidingView behavior={'position'} style={{flex: 1}}>
        <Modal
            visible={visible}
            onBackdropPress={() => closeModal()}
            style={{width:'90%', overflow:"scroll"}}
            >
            
            <Card disabled={true} header={Header} footer={Footer}>
            

            <CheckBox
                checked={checkedWritin}
                onChange={nextChecked => setCheckedWriting(user.FirstName+user.LastName)}>
                {`Coach Writing:`+CoachWriting}
                </CheckBox>
                <CheckBox
                checked={checkedSoccer}
                onChange={nextChecked => setCheckedSoccer(nextChecked)}>
                {`Coach Soccer:`+CoachSoccer}
                </CheckBox>
                <CheckBox
                checked={checkedCoor}
                onChange={nextChecked => setCheckedCoor(nextChecked)}>
                {`Program Coordinator:`+ProgramCoordinator}
                </CheckBox>
                <CheckBox
                checked={checkedManager}
                onChange={nextChecked => setCheckedManager(nextChecked)}>
                {`Program Manager:`+ProgramManager}
                </CheckBox>
                {/* <Text >Coach Writing:</Text>
                <Text>              {coachW}</Text>
                <Text>Coach Soccer:</Text>
                <Text>              {coachS}</Text>
                <Text >Program Coordinator</Text>
                <Text>              {progC}</Text>
                <Text >Program Manager</Text>
                <Text>              {progM}</Text> */}

                
                
         
            </Card>
            
        </Modal>
        </KeyboardAvoidingView>
       
        
    );
}

// const autoSuggest = datos => {
//     const onSelectWriteCoach = (index) => {
//         setFilteredNames(names[index].title);
//       };
    
//       const onChangeTextWriteCoach = (query) => {
//         setFilteredNames(query);
//         setNames(suggestions.filter(item => filter(item, query)));
//       };
//       const display = (
//         <Autocomplete
//                         placeholder='Name'
//                         value={filteredNames3}
//                         size='small'
//                         onSelect={onSelectProgManager}
//                         onChangeText={onChangeTextProgManager}>
//                         {names.map(renderOptions)}
//          </Autocomplete>
//       );

//       export default autoSuggest;   
//     };
   

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#F5FCFF',
      flex: 1,
      padding: 16,
      marginTop: 40,
    },
    autocompleteContainer: {
      backgroundColor: '#ffffff',
      borderWidth: 0,
    },
    descriptionContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    itemText: {
      fontSize: 15,
      paddingTop: 5,
      paddingBottom: 5,
      margin: 2,
    },
    infoText: {
      textAlign: 'center',
      fontSize: 16,
    },
  });
