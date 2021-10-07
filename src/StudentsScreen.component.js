import React, { Component } from 'react';
import { Layout, AutocompleteItem, Autocomplete, Divider, Icon, List, ListItem } from '@ui-kitten/components';

import Axios from "axios";
import moment from "moment";

import {ApiConfig} from "./config/ApiConfig";
import AsyncStorage from '@react-native-community/async-storage';

export default class StudentsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentsList: [],
            selectedStudents: [],
            value: "",
        }
    }

    async componentDidMount() {
        const user = await this.getData();
        console.log(user);
        await Axios.get(`${ApiConfig.dataApi}/coach/${user}/all`, {
            params: {
                // Hardcoded value, change the "2019-08-21" for this.state.date for getting the result in a specific date
                date: moment().format("YYYY-MM-DD")
            }
          })
          .then(res => this.setState({studentsList: res.data, selectedStudents: res.data}))
          .catch(e => console.log(e));
        
    }

    async getData(){
        try {
          const loginData = await AsyncStorage.getItem('loginData');
          console.log(loginData);
          return loginData != null ? loginData : null;
        } catch(e) {
          // error reading value
        }
      }
      
      

    setSearchBarValue(value) { this.setState({value: value}); }
    onSelect = (index) => { this.setSearchBarValue(this.state.selectedStudents[index].title)};
    filter(item, query) { return item.title.toLowerCase().includes(query.toLowerCase()) };

    setFilteredStudentsList(data) { 
        this.setState({ selectedStudents: data})
    };
    
    onChangeText = (query) => {
        this.setSearchBarValue(query);
        this.setFilteredStudentsList(this.state.studentsList.filter(item => this.filter(item, query)))
    };

    render() {
        const {navigation} = this.props;

        const studentIcon = (props) => ( <Icon {...props} name='person'/> );
       

        let studentItem = ({ item, index }) => {
            if (item.Enrollments === null) return ;
            else {
                let name = "NN"
                if (item.Enrrolments[0].FirstName) name = item.Enrrolments[0].FirstName;

                return <ListItem
                    title={name}
                    // description={`${item.TeamSeasonName}`}
                    accessoryRight={studentIcon}
                    onPress={() => {}}
            />
            }
        }

        return(
            <Layout style={{ flex: 1}}>
                <Autocomplete style={{margin:"2%"}}
                    placeholder='Place your Text'
                    ItemSeparatorComponent={Divider}
                    value={this.state.value}
                    onSelect={this.onSelect}
                    onChangeText={this.onChangeText}
                >
                    {/* {this.state.selectedStudents.map(renderStudent)} */}
                </Autocomplete>
                <Divider/>
            
                <Divider/>
                <List
                    style={{width: "100%"}}
                    data={this.state.selectedStudents}
                    ItemSeparatorComponent={Divider}
                    renderItem={studentItem}
                    />
            </Layout>
        )
    }
}

// const mapStateToProps = state => ({ user: state.user });
  
// // const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

// export default connect(mapStateToProps)(StudentsScreen);

