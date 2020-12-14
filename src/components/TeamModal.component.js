import React from 'react';
import { Modal, Card, Text, Button, Layout, Input, IndexPath, Select, SelectItem, Autocomplete, AutocompleteItem } from '@ui-kitten/components';
import {
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    View,
    Keyboard,
    KeyboardAvoidingView
  } from 'react-native';
  
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

  const filter = (item, query) => item.title.toLowerCase().includes(query.toLowerCase());

export const AddNewTeamModal = ({navigation}) => {
    const [visible, setVisible] = React.useState(true);
    const [nameValue, setNameValue] = React.useState();
    const [programSiteValue, setProgramSiteValue] = React.useState();
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
        // For Main Data
    const [names, setNames] = React.useState(suggestions);
    // For Filtered Data
    
    // const [filteredNames1, setFilteredNames1] = React.useState([]);
    // const [filteredNames2, setFilteredNames2] = React.useState([]);
    // const [filteredNames3, setFilteredNames3] = React.useState([]);
    // For Selected Data
   var filteredNames = [{
        "writingCoach": "",
        "soccerCoach": "",
        "programCoordinator": "",
        "programManager": "",
        "programSite": ""

   }];

    function closeModal() {
        setVisible(false); 
        navigation.goBack();
    }


    const onSelect = (name, index) => {
        filteredNames[name] = names[index].title;
      };
    
      const onChangeText = (name, query) => {
        filteredNames[name] = query;
        setNames(suggestions.filter(item => filter(item, query)));
      };

      
    
      const renderOptions = (item, index) => (
        <AutocompleteItem
          key={index}
          title={item.title}
        />
      );


    function createTeam() {
        console.log(nameValue, programSiteValue);
        closeModal();
    }

    const Footer = (props) => (
        <Layout {...props}>
            <Button appearance='ghost' status='danger' onPress={() => createTeam()}>
                Cancel
            </Button>
            <Button onPress={() => createTeam()}>
                CREATE TEAM
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
          <Text category='h6'>Add a Team</Text>
          <Text category='s1' appearance='hint'>A team with the following attributes will be created.</Text>
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
            
                <Text >Team Name</Text>
                <Input
                    placeholder='Name'
                    value={nameValue}
                    onChangeText={enteredValue => setNameValue(enteredValue)}
                    size='small'
                />
                <Text >Program Site</Text>
                {/* <Input
                    placeholder='Program Site'
                    value={programSiteValue}
                    onChangeText={enteredProgramSiteValue => setProgramSiteValue(enteredProgramSiteValue)}
                    size='small'
                /> */}
                <Autocomplete
                        placeholder='Name'
                        value={filteredNames.programSite}
                        size='small'
                        onSelect={index => onSelect("programSite", index)}
                        onChangeText={text => onChangeText("programSite", text)}>
                        {names.map(renderOptions)}
                </Autocomplete>
                <Text >Scores Program Type</Text>
                <Select
                    selectedIndex={selectedIndex}
                    size='small'
                    value={displayValue}
                    placeholder='Select a type'
                    // label='Scores Program Type'
                    onSelect={index => setSelectedIndex(index)}>
                    {data.map(renderOption)}
                </Select>
                <Text >Writing Coach</Text>
                {/* <Input
                    placeholder='Name'
                    value={programSiteValue}
                    onChangeText={enteredProgramSiteValue => setProgramSiteValue(enteredProgramSiteValue)}
                    size='small'
                /> */}
                    <Autocomplete
                        placeholder='Name'
                        value={filteredNames.writingCoach}
                        size='small'
                        onSelect={(index) => onSelect(filteredNames.writingCoach, index)}
                        onChangeText={onChangeText}>
                        {names.map(renderOptions)}
                </Autocomplete>
                    
                 <Text >Soccer Coach</Text>
                {/* <Input
                    placeholder='Name'
                    value={programSiteValue}
                    onChangeText={enteredProgramSiteValue => setProgramSiteValue(enteredProgramSiteValue)}
                    size='small'
                /> */}
                    <Autocomplete
                        placeholder='Name'
                        value={filteredNames.soccerCoach}
                        size='small'
                        onSelect={(index) => onSelect(filteredNames.soccerCoach, index)}
                        onChangeText={onChangeText}>
                        {names.map(renderOptions)}
                </Autocomplete>
                    
                 <Text >Program Coordinator</Text>
                {/* <Input
                    placeholder='Name'
                    value={programSiteValue}
                    onChangeText={enteredProgramSiteValue => setProgramSiteValue(enteredProgramSiteValue)}
                    size='small'
                /> */}
                <Autocomplete
                        placeholder='Name'
                        value={filteredNames.programCoordinator}
                        size='small'
                        onSelect={(index) => onSelect(filteredNames.programCoordinator, index)}
                        onChangeText={onChangeText}>
                        {names.map(renderOptions)}
                </Autocomplete>
                
                 <Text >Program Manager</Text>
                {/* <Input
                    placeholder='Name'
                    value={programSiteValue}
                    onChangeText={enteredProgramSiteValue => setProgramSiteValue(enteredProgramSiteValue)}
                    size='small'
                /> */}
                <Autocomplete
                        placeholder='Name'
                        value={filteredNames.programManager}
                        size='small'
                        onSelect={(index) => onSelect(filteredNames.programManager, index)}
                        onChangeText={onChangeText}>
                        {names.map(renderOptions)}
                </Autocomplete>
                
         
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



  
  