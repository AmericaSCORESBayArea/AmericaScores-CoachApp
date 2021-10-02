import React, {Component} from "react";

import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { bindActionCreators } from 'redux';
import { ImageBackground, View, StyleSheet, Image, KeyboardAvoidingView, Platform } from "react-native";

import { Layout, Divider, List, ListItem, Icon, AutocompleteItem, Autocomplete, Card, Text,  IndexPath, Select, SelectItem, Modal } from '@ui-kitten/components';
import BottomSheet from 'react-native-simple-bottom-sheet';
import Axios from "axios";

import moment from "moment";
import { ApiConfig } from "./config/ApiConfig";

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
            regions: this.props.sessionScreen.listofregions,
            RegionSelected: "",//setting the region selected
            loadingModalstate:true,
        }
    }

    componentDidMount() {
        const {user} = this.props.user;
        Axios.get(`${ApiConfig.dataApi}/coach/${user.ContactId}/teamseasons`, {
                params: {
                    date: moment().format("YYYY-MM-DD")
                }
            })
        .then(response => {response.data.sort((a, b) => (a.TeamSeasonName.toLowerCase() > b.TeamSeasonName.toLowerCase()));
            this.setState({data: response.data, selectedData: response.data}),
            this.regionFiltering(response.data),
            console.log(response);
        })
            .catch(e => console.log(e));
        this.setState({displayedValue:this.state.regions[0]})//setting "basic" region filter with All
        if (this.props.sessionScreen.region === 'IFC'){
            this.setState({RegionSelected:"All IFC"})
        }else if (this.props.sessionScreen.region === 'ASBA'){
            this.setState({RegionSelected:"All ASBA"})
        }else if (this.props.sessionScreen.region === 'OGSC'){
            this.setState({RegionSelected:"All OGSC"})
        }
    }
    setSearchBarValue(value) { this.setState({value: value}); }
    onSelect = (index) => { this.setSearchBarValue(this.state.selectedData[index].TeamSeasonName)};
    filter(item, query) { return item.TeamSeasonName.toLowerCase().includes(query.toLowerCase()) };

    setData(data) {
        if(this.state.RegionSelected === "All IFC" || this.state.RegionSelected === "All ASBA" || this.state.RegionSelected === "All OGSC"){
            if (this.props.sessionScreen.region === 'IFC'){
                this.setState({teamsRegion:data.filter((value) => (value.Region.match('IFC-SF'))),selectedData: data})//saving sessions without filtering
            }else if (this.props.sessionScreen.region === 'OGSC'){
                this.setState({teamsRegion:data.filter((value) => (value.Region.match('Genesis'))),selectedData: data})//saving sessions without filtering
            }else{
                this.setState({teamsRegion:data.filter((value => (!value.Region.match('Genesis') && !value.Region.match('IFC-SF')))),selectedData: data})//saving sessions without filtering
            }
        }
        else{
            this.setState({selectedData: data.filter((value) =>(value.Region.match(this.state.RegionSelected)))})
            this.setState({teamsRegion: data.filter((value) =>(value.Region.match(this.state.RegionSelected)))})
        }
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

    onPressTeam(teamSeasonId, TeamName, Region, SeasonName, SeasonStartDate, SeasonEndDate) {
        console.log('Press')
        this.props.navigation.navigate("Team Sessions", {teamSeasonId: teamSeasonId, region: Region, teamName: TeamName, seasonStart: SeasonStartDate, seasonEnd: SeasonEndDate, SeasonName: SeasonName});
    };

    SelectIndex(index){
        this.setState({selectedIndex: index});
        this.setState({displayedValue: this.state.regions[index.row]});
        if(this.state.regions[index.row] === "All IFC" || this.state.regions[index.row] === "All ASBA" || this.state.regions[index.row] === "All OGSC"){
            if (this.props.sessionScreen.region === 'IFC'){
                this.setState({teamsRegion:this.state.data.filter((value) => (value.Region.match('IFC-SF')))})//saving sessions without filtering
            }else if (this.props.sessionScreen.region === 'OGSC'){
                this.setState({teamsRegion:this.state.data.filter((value) => (value.Region.match('Genesis')))})//saving sessions without filtering
            }else{
                this.setState({teamsRegion:this.state.data.filter((value => (!value.Region.match('Genesis') && !value.Region.match('IFC-SF'))))})//saving sessions without filtering
            }
        }else{
            this.setState({teamsRegion:this.state.data.filter((value) =>((this.state.regions[index.row]).match(value.Region)))})
        }
            this.setState({RegionSelected:this.state.regions[index.row]})
    }

    regionFiltering = (data) =>{
        if(data.length === 0){
            this.setState({nomatchModalVisibility: true})
        }else{
            if (this.props.sessionScreen.region === 'IFC'){
                this.setState({teamsRegion:data.filter((value) => (value.Region.match('IFC-SF')))})//saving sessions without filtering
            }else if (this.props.sessionScreen.region === 'OGSC'){
                this.setState({teamsRegion:data.filter((value) => (value.Region.match('Genesis')))})//saving sessions without filtering
            }else{
                this.setState({teamsRegion:data.filter((value) => (!value.Region.match('Genesis') && !value.Region.match('IFC-SF')))})
            }
            this.setState({displayedValue:this.state.regions[0]})//setting "basic" region filter with Other
            if (this.props.sessionScreen.region === 'IFC'){
                this.setState({RegionSelected:"All IFC"})
            }else if (this.props.sessionScreen.region === 'ASBA'){
                this.setState({RegionSelected:"All ASBA"})
            }else if (this.props.sessionScreen.region === 'OGSC'){
                this.setState({RegionSelected:"All OGSC"})
            }
        }
        this.setState({loadingModalstate:false});
    }
    LoadingGif = () =>{
        if(this.props.sessionScreen.region === "ASBA"){
            return require('../assets/Scores_Logo.gif');//Scores logo gif
        }else if(this.props.sessionScreen.region === "IFC"){
            return require('../assets/IFC_Logo_animated.gif');//IFC logo gif
        }else if(this.props.sessionScreen.region === "OGSC"){
            return require('../assets/OGSC_logo_spinner.gif');//Genesis logo gif
        }
    }
    render() {
        const rightArrowIconRender = (props) => ( 
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
            <Text  style={{alignSelf:"baseline"}}></Text>
                <Icon {...props} fill="#4f5c63" name='people-outline'/>
                <Icon {...props} fill="#4f5c63" name='arrow-ios-forward-outline'/> 
            </View>);
        const colorList = () =>{
            if(this.props.sessionScreen.region === "ASBA"){
                return "#C0E4F5"
            }else{
                return "#86c0e3"
            }
        }
        let teamItem = ({ item, index }) => {
            return(
                <ListItem 
                    title={`${item.TeamSeasonName}`}
                    style={{backgroundColor: colorList(), minHeight:70}}
                    accessoryRight={rightArrowIconRender}
                    onPress={() => this.onPressTeam(item.TeamSeasonId,item.TeamName, item.Region, item.SeasonName, item.SeasonStartDate, item.SeasonEndDate)}
                />
            )
        };
        const getItemLayout = (data, index) => (
            {length: 20, offset: 20 * index, index}
          );
        const selectBox = () => (
            <Select
                label="Select a Region"
                selectedIndex={this.state.selectedIndex}
                size='large'
                style={{margin: "2%",minWidth:"90%"}}
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
                    (this.props.sessionScreen.region === "ASBA"?
                        <View style={{backgroundColor:"#52a5cc"}}>
                            <Text style={{textAlign:"center", color:"white"}} status={status} category='h6'>
                                {this.state.RegionSelected}
                            </Text>
                        </View>:
                        <View style={{backgroundColor:"#001541"}}>
                                <Text style={{textAlign:"center",color:"white"}} status={status} category='h6'>
                                    {this.state.RegionSelected}
                                </Text>
                        </View>
                    )
            )
        );
        const noMatchRegion = (status) =>(
            (
                (this.state.data.length !== 0 && this.state.teamsRegion.length === 0 && this.state.RegionSelected.length !== 0 && this.state.nomatchModalVisibility===false) &&
                (this.props.sessionScreen.region === "ASBA"?
                <Card style={{opacity: 0.9, backgroundColor:"#C0E4F5"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#C0E4F5"}}>
                        There are no active Teams for the selected Region.
                    </Text>
                </Card>:
                <Card style={{opacity: 0.9, backgroundColor:"#86c0e3"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#86c0e3"}}>
                        There are no active Teams for the selected Region.
                    </Text>
                </Card>
            ))
        );
        const message = (status) =>(
            <Card appearance="filled" style={{opacity: 0.95, position:"absolute",top:0,alignSelf: 'center',justifyContent: 'center', }}>
                    <Text status={status} style={{alignSelf: 'center',justifyContent: 'center', opacity: 0.95, fontSize: 17}}>
                        
                    </Text>
                </Card>
        );
        const noMatch = (status) => (
            (
                (this.state.nomatchModalVisibility) &&
                (this.props.sessionScreen.region === "ASBA"?
                <Card style={{opacity: 0.9, backgroundColor:"#C0E4F5"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#C0E4F5"}}>
                        No matches found.
                    </Text>
                </Card>:
                <Card style={{opacity: 0.9, backgroundColor:"#86c0e3"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#86c0e3"}}>
                        No matches found.
                    </Text>
                </Card>
            ))
        );
        const loadingModal = () => (
            <Modal
                style={styles.popOverContent}
                visible={this.state.loadingModalstate}
                backdropStyle={styles.backdrop}>
                <Image source={this.LoadingGif()}/>
            </Modal>
        );
        const getImage = () =>{
            if(this.props.sessionScreen.region === "IFC"){
                return require('../assets/IFC-Logo.png');
            }else if(this.props.sessionScreen.region === "ASBA"){
                return require('../assets/ASBA_Logo.png');
            }else{
                return require('../assets/Genesis_Logo.png');
            }
        }
        return(
            <Layout style={{ flex: 1, justifyContent: 'center'}}>
                {message("basic")}
                <Divider style={{marginTop:"15%"}}/>
                {noMatch("basic")}
                    <ImageBackground source={getImage()} style={{flex:1, resizeMode: 'contain',opacity: 0.99}}>
                    {noMatchRegion("basic")}
                    {regionName("basic")}
                    {loadingModal()}
                    <List
                        maxToRenderPerBatch={17}
                        updateCellsBatchingPeriod={3}
                        initialNumToRender={5}
                        windowSize={4}
                        //maxToRenderPerBatch={20}
                        //updateCellsBatchingPeriod={1}
                        //initialNumToRender={10}
                        //windowSize={10}
                        style={{opacity: 0.95}}
                        data={this.state.teamsRegion}
                        ItemSeparatorComponent={Divider}
                        renderItem={teamItem}
                        getItemLayout={getItemLayout}
                    />
                    <View style={{marginTop: '6%'}}/>
                </ImageBackground>
                {Platform.OS === "ios" ? <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? 'position' : null}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                    >
                <BottomSheet isOpen sliderMinHeight={28} lineStyle={{marginTop:"3%"}}>
                        <Autocomplete style={{margin:"2%"}}
                            label="Search a Team"
                            placeholder='Search by Team name'
                            ItemSeparatorComponent={Divider}
                            value={this.state.value}
                            onSelect={this.onSelect}
                            size="large"
                            onChangeText={this.onChangeText} >
                        </Autocomplete>
                        {selectBox()}
                </BottomSheet>
                </KeyboardAvoidingView>: 
                <BottomSheet isOpen sliderMinHeight={28} lineStyle={{marginTop:"3%"}}>
                    <Autocomplete style={{margin:"2%"}}
                        label="Search a Team"
                        placeholder='Search by Team name'
                        ItemSeparatorComponent={Divider}
                        value={this.state.value}
                        onSelect={this.onSelect}
                        size="large"
                        onChangeText={this.onChangeText} >
                    </Autocomplete>
                    {selectBox()}
                </BottomSheet>}
            </Layout>
        );
    };
}

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user, sessionScreen: state.sessionScreen});
  
const ActionCreators = Object.assign( {}, { syncSessions } );
  
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(TeamsScreen);

const styles = StyleSheet.create({
    popOverContent: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'center',
        shadowRadius: 10,
        shadowOpacity: 0.12,
        shadowColor: "#000"
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});