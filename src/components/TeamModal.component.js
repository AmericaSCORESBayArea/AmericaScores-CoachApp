import React from 'react';
import { Modal, Card, Text, Button, Layout, Input, IndexPath, Select, SelectItem, Autocomplete, AutocompleteItem } from '@ui-kitten/components';
import {
    StyleSheet,
    TouchableOpacity,
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

export const AddNewTeamModal = ({navigation}) => {
    const [visible, setVisible] = React.useState(true);
    const [nameValue, setNameValue] = React.useState();
    const [programSiteValue, setProgramSiteValue] = React.useState();
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
        // For Main Data
    const [names, setNames] = React.useState(suggestions);
    const [sites, setSites] = React.useState(psites);
    // For Filtered Data
    const [filteredNames, setFilteredNames] = React.useState([]);
    const [filteredNames1, setFilteredNames1] = React.useState([]);
    const [filteredNames2, setFilteredNames2] = React.useState([]);
    const [filteredNames3, setFilteredNames3] = React.useState([]);
    const [filteredNames4, setFilteredNames4] = React.useState([]);
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


    const onSelect = (name, index) => {
        console.log(sites[index].title);
        setFilteredNames(sites[index].title);
      };
    
      const onChangeText = (name, query) => {
        // filteredNames[name] = query;
        setFilteredNames(query);
        // console.log(filteredNames[0][name]);
        setSites(psites.filter(item => filter(item, query)));
      };

      const onSelect1 = (name, index) => {
        console.log(names[index].title);
        setFilteredNames1(names[index].title);
      };
    
      const onChangeText1 = (name, query) => {
        // filteredNames[name] = query;
        setFilteredNames1(query);
        // console.log(filteredNames[0][name]);
        setNames(suggestions.filter(item => filter(item, query)));
      };

      const onSelect2 = (name, index) => {
        console.log(names[index].title);
        setFilteredNames2(names[index].title);
      };
    
      const onChangeText2 = (name, query) => {
        // filteredNames[name] = query;
        setFilteredNames2(query);
        // console.log(filteredNames[0][name]);
        setNames(suggestions.filter(item => filter(item, query)));
      };

      const onSelect3 = (name, index) => {
        console.log(names[index].title);
        setFilteredNames3(names[index].title);
      };
    
      const onChangeText3 = (name, query) => {
        // filteredNames[name] = query;
        setFilteredNames3(query);
        // console.log(filteredNames[0][name]);
        setNames(suggestions.filter(item => filter(item, query)));
      };

      const onSelect4 = (name, index) => {
        console.log(names[index].title);
        setFilteredNames4(names[index].title);
      };
    
      const onChangeText4 = (name, query) => {
        // filteredNames[name] = query;
        setFilteredNames4(query);
        // console.log(filteredNames[0][name]);
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
          <Text category='s1' appearance='hint'>A team with the following attributes will be created for the current season</Text>
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
                        value={filteredNames}
                        size='small'
                        onSelect={index => onSelect("programSite", index)}
                        onChangeText={query => onChangeText("programSite", query)}>
                        {sites.map(renderOptions)}
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
                        value={filteredNames1}
                        size='small'
                        onSelect={index => onSelect1("programSite", index)}
                        onChangeText={query => onChangeText1("programSite", query)}>
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
                        value={filteredNames2}
                        size='small'
                        onSelect={index => onSelect2("programSite", index)}
                        onChangeText={query => onChangeText2("programSite", query)}>
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
                        value={filteredNames3}
                        size='small'
                        onSelect={index => onSelect3("programSite", index)}
                        onChangeText={query => onChangeText3("programSite", query)}>
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
                        value={filteredNames4}
                        size='small'
                        onSelect={index => onSelect4("programSite", index)}
                        onChangeText={query => onChangeText4("programSite", query)}>
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



  
  