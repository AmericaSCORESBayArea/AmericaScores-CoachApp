import React, {Component} from "react";

import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { bindActionCreators } from 'redux';
import { ImageBackground, View, SafeAreaView, Dimensions } from "react-native";

import { Layout, Divider, List, ListItem, Icon, AutocompleteItem, Autocomplete, Card, Text,  IndexPath, Select, SelectItem} from '@ui-kitten/components';
import Axios from "axios";

import moment from "moment";
import { ApiConfig } from "./config/ApiConfig";
import { ScrollView } from "react-native-gesture-handler";


class TeamsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedData: [],
            teamsRegion: "",
            value: "",
            nomatchModalVisibility: false,
            selectedIndex: "",
            displayedValue: "",
            regions:['Other','San Francisco','San Jose','San Rafael','Oakland','Daly City','Hayward','Redwood City',
            'San Francisco Civic Center','San Francisco Crocker','Alameda','Marin','San Mateo','Unrestricted',
            'IFC-SF', 'Genesis'],
            RegionSelected: "",//setting the region selected
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
        this.setState({displayedValue:this.state.regions[0]})//setting "basic" region filter with Other
        this.setState({RegionSelected:"ASBA"})
    }

    setSearchBarValue(value) { this.setState({value: value}); }
    onSelect = (index) => { this.setSearchBarValue(this.state.selectedData[index].TeamSeasonName)};
    filter(item, query) { return item.TeamSeasonName.toLowerCase().includes(query.toLowerCase()) };

    setData(data) {
        this.setState({selectedData: data.filter((value) =>(value.Region.match(this.state.RegionSelected)))})
        this.setState({teamsRegion: data.filter((value) =>(value.Region.match(this.state.RegionSelected)))})
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

    SelectIndex(index){
        this.setState({selectedIndex: index});
        this.setState({displayedValue: this.state.regions[index.row]});
        console.log(this.state.data.filter((value) =>(value.Region.match(this.state.regions[index.row]))))
        this.setState({teamsRegion:this.state.data.filter((value) =>(value.Region.match(this.state.regions[index.row])))})
        if(this.state.regions[index.row] === "Other"){
            this.setState({RegionSelected:"ASBA"})
        }else{
            this.setState({RegionSelected:this.state.regions[index.row]})
        }
    }

    regionFiltering = (data) =>{
        if(data.length === 0){
            this.setState({nomatchModalVisibility: true})
        }else{
            this.setState({teamsRegion:data.filter((value) =>(value.Region.match("Other")))})//saving sessions with region sf
            this.setState({displayedValue:this.state.regions[0]})//setting "basic" region filter with Other
            this.setState({RegionSelected:"ASBA"})
            /*
            this.setState({SFRegion:data.filter((value) =>(value.Region.match("IFC-SF")))})
            this.setState({SJRegion:data.filter((value) =>(value.Region.match("San Jose")))})
            this.setState({OARegion:data.filter((value) =>(value.Region.match("Oakland")))})
            this.setState({OtherRegion:data.filter((value) =>(!value.Region.match("San Jose") && !value.Region.match("IFC-SF") && !value.Region.match("Oakland")))})
        */
        }
    }

    render() {
        const rightArrowIconRender = (props) => ( 
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
            <Text  style={{alignSelf:"baseline"}}></Text>
                <Icon {...props} name='people-outline'/>
                <Icon {...props} name='arrow-ios-forward-outline'/> 
            </View>);
        let teamItem = ({ item, index }) => {
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
        const selectBox = () => (
            <Select
                label="Select a Region"
                selectedIndex={this.state.selectedIndex}
                style={{marginBottom:"2%", marginTop:"1%", marginLeft:"2%", marginRight:"2%"}}
                value={this.state.displayedValue}
                onSelect={index => this.SelectIndex(index)}>
                {this.state.regions.map((title,i) =>
                    <SelectItem key={title} title={title}/>
                )}
          </Select>
        );
        const regionName = (status) =>(
            (
                (this.state.teamsRegion.length !== 0 && this.state.RegionSelected.length !== 0) &&
                    <View style={{backgroundColor:"#52a5cc"}}>
                            <Text style={{textAlign:"center"}} status={status} category='h6'>
                                {this.state.RegionSelected}
                            </Text>
                    </View>
            )
        );
        const noMatchRegion = (status) =>(
            (
                (this.state.data.length !== 0 && this.state.teamsRegion.length === 0 && this.state.RegionSelected.length !== 0 && this.state.nomatchModalVisibility===false) &&
                <Card style={{opacity: 0.9, backgroundColor:"#C0E4F5"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#C0E4F5"}}>
                        There are no active Teams for the selected Region.
                    </Text>
                </Card>
            )
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
        const getImage = () =>{
            if(this.props.sessionScreen.region === "IFC"){
                return require('../assets/IFC-Logo.png');
            }else{
                return require('../assets/ASBA_Logo.png');
            }
        }
        return(
            <Layout style={{ flex: 1, justifyContent: 'center'}}>
                <Autocomplete style={{margin:"2%"}}
                    placeholder='Search by Team name'
                    ItemSeparatorComponent={Divider}
                    value={this.state.value}
                    onSelect={this.onSelect}
                    size="large"
                    onChangeText={this.onChangeText} >
                </Autocomplete>
                {selectBox()}
                <Divider/>
                {noMatch("basic")}
                    <ImageBackground source={getImage()} style={{flex:1, resizeMode: 'contain',opacity: 0.99}}>
                    {noMatchRegion("basic")}
                    {regionName("basic")}
                    <List
                        style={{opacity: 0.95}}
                        data={this.state.teamsRegion}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItem}
                    />
                </ImageBackground>
            </Layout>
        );
    };
}

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user, sessionScreen: state.sessionScreen});
  
const ActionCreators = Object.assign( {}, { syncSessions } );
  
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(TeamsScreen);