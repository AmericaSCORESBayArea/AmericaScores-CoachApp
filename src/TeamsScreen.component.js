import React, {Component} from "react";

import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { bindActionCreators } from 'redux';
import { ImageBackground, View} from "react-native";

import { Layout, Divider, List, ListItem, Icon, AutocompleteItem, Autocomplete, Card, Text,  IndexPath, Select, SelectItem} from '@ui-kitten/components';
import Axios from "axios";

import moment from "moment";
import { ApiConfig } from "./config/ApiConfig";


class TeamsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedData: [],
            value: "",
            nomatchModalVisibility: false,
            regions:[
                'All',
                'San Rafael',
                'San Francisco',
                'Oakland',
            ],
            selectedIndex: "",
            displayedValue: "",
        }
    }

    componentDidMount() {
        
        const {user} = this.props.user;
        Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons`, {
                params: {
                    date: moment().format("YYYY-MM-DD")
                }
            })
            .then(response => this.setState({data: response.data, selectedData: response.data}))
            .catch(e => console.log(e));
    }

    setSearchBarValue(value) { this.setState({value: value}); }
    onSelect = (index) => { this.setSearchBarValue(this.state.selectedData[index].TeamSeasonName)};
    filter(item, query) { return item.TeamSeasonName.toLowerCase().includes(query.toLowerCase()) };

    setData(data,query) { 
        this.setState({selectedData: data})
        if(!data.length){
            this.setState({nomatchModalVisibility: true})
        }else{
            this.setState({nomatchModalVisibility: false})
        }
    };

    onChangeText = (query) => {
        this.setSearchBarValue(query);
        this.setData(this.state.data.filter(item => this.filter(item, query)),query)
    };

    onPressTeam(teamSeasonId) {
        this.props.navigation.navigate("Team Sessions", {teamSeasonId: teamSeasonId});
    };

    SelectIndex(index){
        this.setState({selectedIndex: index});
        this.setState({displayedValue: this.state.regions[index.row]});
    };

    render() {
        const rightArrowIconRender = (props) => ( 
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
            <Text  style={{alignSelf:"baseline"}}></Text>
                <Icon {...props} name='people-outline'/>
                <Icon {...props} name='arrow-ios-forward-outline'/> 
            </View>);
        let teamItem = ({ item, index }) => (
            <ListItem 
                title={`${item.TeamSeasonName}`}
                style={{backgroundColor: "#C0E4F5"}}
                // description={`${item.description} ${index + 1}`}
                accessoryRight={rightArrowIconRender}
                onPress={() => this.onPressTeam(item.TeamSeasonId)}
            />
        );
        const noMatch = (status) => (
            (
                (this.state.nomatchModalVisibility) &&
                <Card style={{opacity: 0.9, backgroundColor:"#C0E4F5"}}>
                    <Text category="s2" status={status} style={{alignSelf: 'center', backgroundColor:"#C0E4F5"}}>
                        No matches found.
                    </Text>
                </Card>
            )
        );
        /*const selectBox = () => (
            <Select
                label="Select a Region"
                placeholder={this.state.regions[0]}
                selectedIndex={this.state.selectedIndex}
                style={{marginBottom:"2%", marginTop:"1%", marginLeft:"2%", marginRight:"2%"}}
                value={this.state.displayedValue}
                onSelect={index => this.SelectIndex(index)}>
                {this.state.regions.map((title,i) =>
                    <SelectItem key={title} title={title}/>
                )}
          </Select>
                );*/
        return(
            <Layout style={{ flex: 1, justifyContent: 'center'}}>
                <Autocomplete style={{margin:"2%"}}
                    placeholder='Search by Team name'
                    ItemSeparatorComponent={Divider}
                    value={this.state.value}
                    onSelect={this.onSelect}
                    onChangeText={this.onChangeText} >
                </Autocomplete>
                <Divider/>
                {/*{selectBox()}*/}
                {noMatch("basic")}
                <ImageBackground source={require('../assets/ASBA_Logo.png')} style={{flex: 1}}>
                    <List
                        style={{width:"100%", backgroundColor: "rgba(255,255,255,0.9)", opacity: 0.95}}
                        data={this.state.selectedData}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItem}
                        />
                </ImageBackground>

            </Layout>
        );
    };
}

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user });
  
const ActionCreators = Object.assign( {}, { syncSessions } );
  
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(TeamsScreen);