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
            selectedIndex: "",
            displayedValue: "",
            SFRegion: [],
            SJRegion: [],
            OARegion: [],
            OtherRegion: [],
        }
    }

    componentDidMount() {
        
        const {user} = this.props.user;
        Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons`, {
                params: {
                    date: moment().format("YYYY-MM-DD")
                }
            })
        .then(response => {this.setState({data: response.data, selectedData: response.data}),this.regionFiltering(response.data)})
            .catch(e => console.log(e));
    }

    setSearchBarValue(value) { this.setState({value: value}); }
    onSelect = (index) => { this.setSearchBarValue(this.state.selectedData[index].TeamSeasonName)};
    filter(item, query) { return item.TeamSeasonName.toLowerCase().includes(query.toLowerCase()) };

    setData(data) {
        this.setState({selectedData: data})
        this.setState({SFRegion:data.filter((value) =>(value.Region.match("IFC-SF")))})
        this.setState({SJRegion:data.filter((value) =>(value.Region.match("San Jose")))})
        this.setState({OARegion:data.filter((value) =>(value.Region.match("Oakland")))})
        this.setState({OtherRegion:data.filter((value) =>(!value.Region.match("San Jose") && !value.Region.match("IFC-SF") && !value.Region.match("Oakland")))}) 
        if(!data.length){
            this.setState({nomatchModalVisibility: true})
        }else{
            this.setState({nomatchModalVisibility: false})
        }
    };

    onChangeText = (query) => {
        this.setSearchBarValue(query);
        this.setData(this.state.data.filter(item => this.filter(item, query)))
    };

    onPressTeam(teamSeasonId) {
        this.props.navigation.navigate("Team Sessions", {teamSeasonId: teamSeasonId});
    };

    /*SelectIndex(index){
        this.setState({selectedIndex: index});
        this.setState({displayedValue: this.state.regions[index.row]});
    };*/

    regionFiltering = (data) =>{
        this.setState({SFRegion:data.filter((value) =>(value.Region.match("IFC-SF")))})
        this.setState({SJRegion:data.filter((value) =>(value.Region.match("San Jose")))})
        this.setState({OARegion:data.filter((value) =>(value.Region.match("Oakland")))})
        this.setState({OtherRegion:data.filter((value) =>(!value.Region.match("San Jose") && !value.Region.match("IFC-SF") && !value.Region.match("Oakland")))})
    }

    render() {
        const rightArrowIconRender = (props) => ( 
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
            <Text  style={{alignSelf:"baseline"}}></Text>
                <Icon {...props} name='people-outline'/>
                <Icon {...props} name='arrow-ios-forward-outline'/> 
            </View>);
        /*let teamItem = ({ item, index }) => {
            return(
                <ListItem 
                    title={`${item.TeamSeasonName}`}
                    style={{backgroundColor: "#C0E4F5"}}
                    // description={`${item.description} ${index + 1}`}
                    accessoryRight={rightArrowIconRender}
                    onPress={() => this.onPressTeam(item.TeamSeasonId)}
                />
            )
        };*/
        let teamItemSF = ({ item, index }) => {
                return(
                    <ListItem 
                        title={`${item.TeamSeasonName}`}
                        style={{backgroundColor: "#C0E4F5"}}
                        // description={`${item.description} ${index + 1}`}
                        accessoryRight={rightArrowIconRender}
                        onPress={() => this.onPressTeam(item.TeamSeasonId)}
                    />
            )
        };
        const regionSF = (status) => (
            (
                (this.state.SFRegion.length !==0) &&
                    <View style={{backgroundColor:"#52a5cc"}}>
                        <Text style={{textAlign:"center"}} status={status} category='h6'>
                            San Francisco
                        </Text>
                    </View>
            )
        );
        let teamItemSJ = ({ item, index }) => {
            return(
                <ListItem 
                    title={`${item.TeamSeasonName}`}
                    style={{backgroundColor: "#C0E4F5"}}
                    // description={`${item.description} ${index + 1}`}
                    accessoryRight={rightArrowIconRender}
                    onPress={() => this.onPressTeam(item.TeamSeasonId)}
                />
            )
        };
        const regionSJ = (status) => (
            (
                (this.state.SJRegion.length !==0) &&
                    <View style={{backgroundColor:"#52a5cc"}}>
                        <Text style={{textAlign:"center"}} status={status} category='h6'>
                            San Jose
                        </Text>
                    </View>
            )
        );
        const regionOA = (status) => (
            (
                (this.state.OARegion.length !==0) &&
                    <View style={{backgroundColor:"#52a5cc"}}>
                        <Text style={{textAlign:"center"}} status={status} category='h6'>
                            Oakland
                        </Text>
                    </View>
            )
        );
        let teamItemOA = ({ item, index }) => {
            return(
                <ListItem 
                    title={`${item.TeamSeasonName}`}
                    style={{backgroundColor: "#C0E4F5"}}
                    // description={`${item.description} ${index + 1}`}
                    accessoryRight={rightArrowIconRender}
                    onPress={() => this.onPressTeam(item.TeamSeasonId)}
                />
            )
        };
        const regionOther = (status) => (
            (
                (this.state.OtherRegion.length !==0) &&
                    <View style={{backgroundColor:"#52a5cc"}}>
                        <Text style={{textAlign:"center"}} status={status} category='h6'>
                            Other
                        </Text>
                    </View>
            )
        )
        let teamItemOther = ({ item, index }) => {
            return(
                <ListItem 
                    title={`${item.TeamSeasonName}`}
                    style={{backgroundColor: "#C0E4F5"}}
                    // description={`${item.description} ${index + 1}`}
                    accessoryRight={rightArrowIconRender}
                    onPress={() => this.onPressTeam(item.TeamSeasonId)}
                />
            )
        };
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
                <ImageBackground source={require('../assets/ASBA_Logo.png')} style={{flex:1, resizeMode: 'contain',opacity: 0.99, flexWrap: 'wrap'}}>
                    {regionSF("basic")}
                    <List
                        style={{opacity: 0.95, minWidth: "100%", flex:1, minHeight: "20%"}}
                        data={this.state.SFRegion}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItemSF}
                    />
                    {regionSJ("basic")}
                    <List
                        style={{opacity: 0.95, minWidth: "100%", flex:1, minHeight: "20%"}}
                        data={this.state.SJRegion}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItemSJ}
                    />
                    {regionOA("basic")}
                    <List
                        style={{opacity:0.95, minWidth: "100%", flex:1, minHeight: "20%"}}
                        data={this.state.OARegion}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItemOA}
                    />
                    {regionOther("basic")}
                    <List
                        style={{opacity: 0.95, minWidth: "100%", flex:1, minHeight: "20%"}}
                        data={this.state.OtherRegion}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItemOther}
                    />
                     {/*<List
                        style={{width:"100%", backgroundColor: "rgba(255,255,255,0.9)", opacity: 0.95}}
                        data={this.state.selectedData}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItem}
                />*/}
                {/*!this.state.SFRegion.length? 
                    <List
                        style={{width:"100%", backgroundColor: "rgba(255,255,255,0.9)", opacity: 0.95}}
                        data={this.state.selectedData}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItem}
                        />
                    :
                    <List
                        style={{width:"100%", backgroundColor: "rgba(255,255,255,0.9)", opacity: 0.95}}
                        data={this.state.SFRegion}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItemSF}
                    />)
                
                    <List
                        style={{width:"100%", backgroundColor: "rgba(255,255,255,0.9)", opacity: 0.95}}
                        data={this.state.selectedData}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItem}
                />*/}
                </ImageBackground>

            </Layout>
        );
    };
}

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user });
  
const ActionCreators = Object.assign( {}, { syncSessions } );
  
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(TeamsScreen);