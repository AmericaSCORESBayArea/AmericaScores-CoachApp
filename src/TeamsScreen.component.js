import React, {Component} from "react";

import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { bindActionCreators } from 'redux';
import { ImageBackground } from "react-native";

import { Layout, Divider, List, ListItem, Icon, AutocompleteItem, Autocomplete, Text } from '@ui-kitten/components';
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
            otherTeamsData: [],
            otherTeamsSelectedData: [],
            season: "",
            region: "",
        }
    }

    loadOtherTeams = () => {
        const {user} = this.props.user;
        Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasonsNotOwnedByCoach`, {
            params: {
                region: this.state.region,
                season: this.state.season 
            }
        })
        .then(responsed => {this.setState({otherTeamsData: responsed.data, otherTeamsSelectedData: responsed.data});
    console.log(responsed.data);
    })
    }

    componentDidMount() {
        const {user} = this.props.user;
        Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons`, {
                params: {
                    date: moment().format("YYYY-MM-DD")
                }
            })
            .then(response => {
                 this.setState({data: response.data, selectedData: response.data, season: response.data[0].SeasonId, region: response.data[0].Region});
                console.log(this.state.region, this.state.season);
            }).then(this.loadOtherTeams)
            .catch(e => console.log(e));

            
            
            // Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasonsNotOwnedByCoach`, {
            //     params: {
            //         region: this.state.region,
            //         season: this.state.season 
            //     }
            // })
            // .then(response => this.setState({otherTeamsData: response.data, otherTeamsSelectedData: response.data}))
            // .catch(e => console.log(e));
    }

    setSearchBarValue(value) { this.setState({value: value}); }
    onSelect = (index) => { this.setSearchBarValue(this.state.selectedData[index].TeamSeasonName)};
    filter(item, query) { return item.TeamSeasonName.toLowerCase().includes(query.toLowerCase()) };

    setData(data) { this.setState({selectedData: data}) };
    
    onChangeText = (query) => {
        this.setSearchBarValue(query);
        this.setData(this.state.data.filter(item => this.filter(item, query)))
    };

    onPressTeam(teamSeasonId) {
        this.props.navigation.navigate("Team Activities", {teamSeasonId: teamSeasonId});
    }

    onPressOtherTeam(modalScreen, item) {
        // setOverflowMenuVisible(false);
        const {user} = this.props.user;
        this.props.navigation.navigate(modalScreen, {item: item, user: user});
    };

    render() {
        const rightArrowIconRender = (props) => ( <Icon {...props} name='arrow-ios-forward-outline'/>);
        let teamItem = ({ item, index }) => (
            <ListItem 
                title={`${item.TeamSeasonName}`}
                // description={`${item.description} ${index + 1}`}
                accessoryRight={rightArrowIconRender}
                onPress={() => this.onPressTeam(item.TeamSeasonId)}
            />
        );

        let otherteamItem = ({ item, index }) => (
            <ListItem 
                title={`${item.TeamSeasonName}`}
                // description={`${item.description} ${index + 1}`}
                style= {{backgroundColor: "rgba(255,255,255,0.7)"}}
                accessoryRight={rightArrowIconRender}
                onPress={() => this.onPressOtherTeam("AddOtherTeamModal", item)}
            />
        );
  
        return(
            <Layout style={{ flex: 1, justifyContent: 'center'}}>
                <Autocomplete style={{margin:"2%"}}
                    placeholder='Place your Text'
                    ItemSeparatorComponent={Divider}
                    value={this.state.value}
                    onSelect={this.onSelect}
                    onChangeText={this.onChangeText} >
                </Autocomplete>
                <Divider/>
                <Text style={{fontSize: 20, fontStyle: "italic"}}>  My Teams:</Text>
                <ImageBackground source={require('../assets/ASBA_Logo.png')} style={{flex: 1}}>
                    <List
                        style={{width:"100%", height: "5%" , backgroundColor: "rgba(255,255,255,0.9)"}}
                        data={this.state.selectedData}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItem}
                        />
                        <Divider/>
                        <Text style={{fontSize: 20, fontStyle: "italic"}}>  Other Teams:</Text>
                        <Divider/>
                        <List
                        style={{width:"100%", height: "20%" , backgroundColor: "rgba(255,255,255,0.9)"}}
                        data={this.state.otherTeamsSelectedData}
                        ItemSeparatorComponent={Divider}
                        renderItem={otherteamItem}
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