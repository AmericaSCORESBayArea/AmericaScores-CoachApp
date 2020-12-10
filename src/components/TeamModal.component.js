import React from 'react';
import { Modal, Card, Text, Button, Layout, Input, IndexPath, Select, SelectItem } from '@ui-kitten/components';
import Autocomplete from 'react-native-autocomplete-input';
import {
    StyleSheet,
    TouchableOpacity,
  } from 'react-native';
  

export const AddNewTeamModal = ({navigation}) => {
    const [visible, setVisible] = React.useState(true);
    const [nameValue, setNameValue] = React.useState();
    const [programSiteValue, setProgramSiteValue] = React.useState();
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
        // For Main Data
    const [films, setFilms] = React.useState([]);
    // For Filtered Data
    const [filteredFilms, setFilteredFilms] = React.useState([]);
    // For Selected Data
    const [selectedValue, setSelectedValue] = React.useState({});
    const [selectedValue1, setSelectedValue1] = React.useState({});
    const [selectedValue2, setSelectedValue2] = React.useState({});
    const [selectedValue3, setSelectedValue3] = React.useState({});

    function closeModal() {
        setVisible(false); 
        navigation.goBack();
    }

    const suggestions = [
        {
            id: 1,
            title: "Carlos Yanzon"},
        {
            id: 2,
            title: "Ignacio Lopez Scala"
        },
        {
            id: 3,
            title: "Pete Swearengen"
        },
        {
            id: 4,
            title: "Colin Schmidt"
        }
      ]

    // React.useEffect(() => {
    //     fetch('https://aboutreact.herokuapp.com/getpost.php?offset=1')
    //       .then((res) => res.json())
    //       .then((json) => {
    //         const {results: films} = json;
    //         setFilms(films);
    //         //setting the data in the films state
    //       })
    //       .catch((e) => {
    //         alert(e);
    //       });
    //   }, []);

      const findFilm = (query) => {
        // Method called every time when we change the value of the input
        if (query) {
          // Making a case insensitive regular expression
          const regex = new RegExp(`${query.trim()}`, 'i');
          // Setting the filtered film array according the query
          setFilteredFilms(
              suggestions.filter((film) => film.title.search(regex) >= 0)
          );
        } else {
          // If the query is null then return blank
          setFilteredFilms([]);
        }
      };

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
        <Modal
            visible={visible}
            onBackdropPress={() => closeModal()}
            style={{width:'90%'}}>
            <Card disabled={true} header={Header} footer={Footer}>
                <Text >Team Name</Text>
                <Input
                    placeholder='Name'
                    value={nameValue}
                    onChangeText={enteredValue => setNameValue(enteredValue)}
                    size='small'
                />
                <Text >Program Site</Text>
                <Input
                    placeholder='Program Site'
                    value={programSiteValue}
                    onChangeText={enteredProgramSiteValue => setProgramSiteValue(enteredProgramSiteValue)}
                    size='small'
                />
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
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    // Data to show in suggestion
                    data={filteredFilms}
                    // Default value if you want to set something in input
                    defaultValue={
                        JSON.stringify(selectedValue) === '{}' ?
                        '' :
                        selectedValue
                    }
                    // Onchange of the text changing the state of the query
                    // Which will trigger the findFilm method
                    // To show the suggestions
                    onChangeText={(text) => findFilm(text)}
                    placeholder="Enter name here"
                    renderItem={({item, i}) => (
                        // For the suggestion view
                        <TouchableOpacity
                        onPress={() => {
                            setSelectedValue(item.title);
                            setFilteredFilms([]);
                        }}>
                        <Text style={styles.itemText}>
                            {item.title}
                        </Text>
                        </TouchableOpacity>
                    )}
                    />
                 <Text >Soccer Coach</Text>
                {/* <Input
                    placeholder='Name'
                    value={programSiteValue}
                    onChangeText={enteredProgramSiteValue => setProgramSiteValue(enteredProgramSiteValue)}
                    size='small'
                /> */}
                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    // Data to show in suggestion
                    data={filteredFilms}
                    // Default value if you want to set something in input
                    defaultValue={
                        JSON.stringify(selectedValue) === '{}' ?
                        '' :
                        selectedValue
                    }
                    // Onchange of the text changing the state of the query
                    // Which will trigger the findFilm method
                    // To show the suggestions
                    onChangeText={(text) => findFilm(text)}
                    placeholder="Enter name here"
                    renderItem={({item, i}) => (
                        // For the suggestion view
                        <TouchableOpacity
                        onPress={() => {
                            setSelectedValue1(item.title);
                            setFilteredFilms([]);
                        }}>
                        <Text style={styles.itemText}>
                            {item.title}
                        </Text>
                        </TouchableOpacity>
                    )}
                    />
                 <Text >Program Coordinator</Text>
                {/* <Input
                    placeholder='Name'
                    value={programSiteValue}
                    onChangeText={enteredProgramSiteValue => setProgramSiteValue(enteredProgramSiteValue)}
                    size='small'
                /> */}
                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    // Data to show in suggestion
                    data={filteredFilms}
                    // Default value if you want to set something in input
                    defaultValue={
                        JSON.stringify(selectedValue) === '{}' ?
                        '' :
                        selectedValue
                    }
                    // Onchange of the text changing the state of the query
                    // Which will trigger the findFilm method
                    // To show the suggestions
                    onChangeText={(text) => findFilm(text)}
                    placeholder="Enter name here"
                    renderItem={({item, i}) => (
                        // For the suggestion view
                        <TouchableOpacity
                        onPress={() => {
                            setSelectedValue2(item.title);
                            setFilteredFilms([]);
                        }}>
                        <Text style={styles.itemText}>
                            {item.title}
                        </Text>
                        </TouchableOpacity>
                    )}
                    />
                 <Text >Program Manager</Text>
                {/* <Input
                    placeholder='Name'
                    value={programSiteValue}
                    onChangeText={enteredProgramSiteValue => setProgramSiteValue(enteredProgramSiteValue)}
                    size='small'
                /> */}
                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    // Data to show in suggestion
                    data={filteredFilms}
                    // Default value if you want to set something in input
                    defaultValue={
                        JSON.stringify(selectedValue) === '{}' ?
                        '' :
                        selectedValue
                    }
                    // Onchange of the text changing the state of the query
                    // Which will trigger the findFilm method
                    // To show the suggestions
                    onChangeText={(text) => findFilm(text)}
                    placeholder="Enter name here"
                    renderItem={({item, i}) => (
                        // For the suggestion view
                        <TouchableOpacity
                        onPress={() => {
                            setSelectedValue3(item.title);
                            setFilteredFilms([]);
                        }}>
                        <Text style={styles.itemText}>
                            {item.title}
                        </Text>
                        </TouchableOpacity>
                    )}
                    />
            </Card>
        </Modal>
    );
}

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



  
  