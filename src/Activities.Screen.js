import React, {Component} from "react";
import { Layout, Divider, List, ListItem, Icon, Text, Datepicker, Card, Button, ButtonGroup, Select, SelectItem } from '@ui-kitten/components';
import { ImageBackground, View, StyleSheet, RefreshControl, Image } from "react-native";
import { MomentDateService } from '@ui-kitten/moment';
import Axios from "axios";
import moment from "moment";
import BottomSheet from 'react-native-simple-bottom-sheet';

import AsyncStorage from '@react-native-community/async-storage';

import {ApiConfig} from "./config/ApiConfig";

import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { updateFirstTimeLoggedIn } from "./Redux/actions/user.actions";
import { changeTitle } from "./Redux/actions/SessionScreen.actions";
import { bindActionCreators } from 'redux';

class ActivitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment(),
            activities: "",
            activitiesRegion: "",
            welcomeModalVisibility: false,
            nomatchModalVisibility: false,
            regions:this.props.sessionScreen.listofregions,
            selectedIndex: "",
            displayedValue: "",
            isUpdated: false,
            teamSeasonId: "",
            listofSessions: null,
            seasonName: "",
            activitiesArray: [],
            RegionSelected: "",//setting the region selected
            selectedIndexDrawer: "",
            OverflowMenuVisible:false,
            disabledbox:false,
            displayMessage:"Don't forget to take attendance!",
        }
    }

    

    async componentDidMount() {
        this.setState({displayedValue:this.state.regions[0]})//setting "basic" region filter with All
        this.setState({RegionSelected:"All"})
        this.__syncCoachRegions();
        this._syncActivities();
        await AsyncStorage.setItem('loggedStatus', "true");
        if (this.props.user.firstTimeLoggedIn) {
            setTimeout(() => (this.setState({welcomeModalVisibility: true})), 500);
            setTimeout(() => {this.setState({welcomeModalVisibility: false})}, 3500);
        }
        console.log(this.props.user);
    }

    async _syncActivities() {
        const { route } = this.props;
        //Syncs activities from endpoint
        this.fetchActivities()
            .then(activitiesList => this._syncReduxActivities(activitiesList))    
            .then(() =>{
                //Check if we are in the team activities name
                if (route.name === "Team Sessions" && route.params && route.params.teamSeasonId && route.params.region && route.params.teamName){
                    this.filterActivitiesByTeamSeasonId(route.params.teamSeasonId,route.params.region,route.params.teamName); // filter the activities for a specific team
                    this.setState({isUpdated: true, teamSeasonId: route.params.teamSeasonId, region: route.params.region, teamName: route.params.teamName});
                }
            })
            .catch(error => console.log(error));
    }
    async __syncCoachRegions(){
        console.log(this.state.date.format("YYYY-MM-DD"))
        const { user } = this.props;
        return await Axios.get(`${ApiConfig.dataApi}/coach/${user.user.ContactId}/regions`, {
           params: {
                // Hardcoded value, change the "2019-08-21" for this.state.date for getting the result in a specific date
                date: this.state.date.format("YYYY-MM-DD")
            }
          })
          .then(res => console.log(res.data))
          .catch(e => console.log(e));
    }
    //Syncs activitiesToRedux and state
    _syncReduxActivities(activitiesList) {
        const { actions } = this.props;
        const { route } = this.props;
        this.setState({listofSessions: null});
        actions.syncSessions(activitiesList);
        this.setState({activities: activitiesList});//saving the activitiesList
        if (this.props.sessionScreen.region === 'IFC'){
            this.setState({activitiesRegion:activitiesList.filter((value) => (value.Region.match('IFC-SF'))),displayedValue:this.state.regions[0],RegionSelected:"All"})//saving sessions without filtering
        }else if (this.props.sessionScreen.region === 'OGSC'){
            this.setState({activitiesRegion:activitiesList.filter((value) => (value.Region.match('Genesis'))),displayedValue:this.state.regions[0],RegionSelected:"All"})//saving sessions without filtering
        }else{
            this.setState({activitiesRegion:activitiesList.filter((value => (!value.Region.match('Genesis'),!value.Region.match('IFC-SF')))),displayedValue:this.state.regions[0],RegionSelected:"All"})//saving sessions without filtering
        }
        activitiesList.map(value => {
                if(value.Sessions !== null){
                    this.setState({ listofSessions: value.Sessions})
                }
            });
        if(this.state.listofSessions === null){
            this.setState({nomatchModalVisibility: true})
        }else{
            this.setState({nomatchModalVisibility: false})
        }
        if(route.name === "Team Sessions"){
            this.filterActivitiesByTeamSeasonId(route.params.teamSeasonId,route.params.region, route.params.teamName); // filter the activities for a specific team
            this.setState({isUpdated: true, teamSeasonId: route.params.teamSeasonId, region: route.params.region, teamName: route.params.teamName});
        }else{
            if(activitiesList.length === 0){
                (this.setState({seasonName: "Sessions", nomatchModalVisibility: true}))//saving seasonName
            }else{
                (this.setState({seasonName: activitiesList[0].Season_Name ,nomatchModalVisibility: false}))//saving seasonName
            }
            if (this.state.seasonName !== ""){
                if(this.state.seasonName !== "Sessions"){
                    actions.changeTitle(this.state.seasonName + " " + "Sessions")//shows the actual season name
                }else{
                    actions.changeTitle(this.state.seasonName)//shows the actual season name
                }
            }
        }
    }

    filterActivitiesByTeamSeasonId(teamSeasonId,region,teamName) {
        if(region === 'Other'){
            this.setState({displayMessage:teamName, displayedValue:region, RegionSelected:'ASBA', selectedIndex:this.state.regions.indexOf(region), disabledbox:true});
        }else{
            this.setState({displayMessage:teamName, displayedValue:region, RegionSelected:region, selectedIndex:this.state.regions.indexOf(region), disabledbox:true});
        }
        this.setState({listofSessions: null});
        const activities = this.state.activities.filter(
            activity => { if (activity.Sessions) return activity.Sessions[0].TeamSeasonId === teamSeasonId;});
        this.setState({activities: activities});
        this.setState({activitiesRegion:this.state.activities.filter((value) =>(value.Region.match(region)))})
        activities.map(value => {
            if(value.Sessions !== null){
                this.setState({ listofSessions: value.Sessions})
            }
        });
        if(this.state.listofSessions === null){
            this.setState({nomatchModalVisibility: true})
        }else{
            this.setState({nomatchModalVisibility: false})
        }
    }

    async fetchActivities() {
        const { user } = this.props;
        return await Axios.get(`${ApiConfig.dataApi}/coach/${user.user.ContactId}/all`, {
            params: {
                // Hardcoded value, change the "2019-08-21" for this.state.date for getting the result in a specific date
                date: this.state.date.format("YYYY-MM-DD")
            }
          })
          .then(res => res.data)
          .catch(e => console.log(e));
    }

    async selectDate(date) { 
        await this.setState({date: date})
        const activitiesList = await this.fetchActivities();
        this._syncReduxActivities(activitiesList);
    }

    selectActivity(teamSeasonId, sessionId) { this.props.navigation.navigate("Attendance", {teamSeasonId: teamSeasonId, sessionId: sessionId}) }

    toggleWelcomeModalOff() { 
        const { actions } = this.props;
        this.setState({welcomeModalVisibility: false})
        actions.updateFirstTimeLoggedIn();
    }
    SelectIndex(index){
        this.setState({selectedIndex: index});
        this.setState({displayedValue: this.state.regions[index.row]});
        if(this.state.regions[index.row] === "All"){
            if (this.props.sessionScreen.region === 'IFC'){
                this.setState({activitiesRegion:this.state.activities.filter((value) => (value.Region.match('IFC-SF')))})//saving sessions without filtering
            }else if (this.props.sessionScreen.region === 'OGSC'){
                this.setState({activitiesRegion:this.state.activities.filter((value) => (value.Region.match('Genesis')))})//saving sessions without filtering
            }else{
                this.setState({activitiesRegion:this.state.activities.filter((value => (!value.Region.match('Genesis'),!value.Region.match('IFC-SF'))))})//saving sessions without filtering
            }
        }else{
            this.setState({activitiesRegion:this.state.activities.filter((value) =>(value.Region.match(this.state.regions[index.row])))})
        }
        if(this.state.regions[index.row] === "Other"){
            this.setState({RegionSelected:"ASBA"})
        }else{
            this.setState({RegionSelected:this.state.regions[index.row]})
        }
    }
    SelectIndexDrawer(index){
        this.setState({selectedIndexDrawer: index})
    }
    render() {
        const addIcon = (props) => ( <Icon {...props} name='person-add-outline'/> );
        let refreshing = false;
        const onRefresh = () => {
            refreshing = true;

            this._syncActivities().then(() => refreshing = false);

            // wait(2000).then(() => refreshing = false);
        };
        
        const CalendarIcon = (props) => ( <Icon {...props} name='calendar'/> );
        const ArrowIcon = (props) => ( <Icon {...props} size='medium' name='menu-2-outline'/> );
        const renderItemIcon = (props) => (
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
                <Text  style={{alignSelf:"baseline"}}></Text>
                {/*<Icon {...props} name='people-outline'/> fill="#D62E0A"*/}
                <Icon {...props} fill="#4f5c63" name='calendar-outline'/> 
                <Icon {...props} fill="#4f5c63" name='arrow-ios-forward-outline'/> 
            </View>
        );
        const renderItemIconRed = (props) => (
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
                <Text  style={{alignSelf:"baseline"}}></Text>
                {/*<Icon {...props} name='people-outline'/> fill="#D62E0A"*/}
                <Icon {...props} fill="#D62E0A" name='calendar-outline'/> 
                <Icon {...props} fill="#D62E0A" name='arrow-ios-forward-outline'/> 
            </View>
        );
        const RenderItemImageNL = () => (
            <Image
              style={{ width: 45, height: 35,resizeMode: "contain"}}
              source={require('../assets/Unassigned_Session.png')}
            />
          );
        const RenderItemImageSW = () => (
            <Image
              style={{ width: 45, height: 45,resizeMode: "contain"}}
              source={require('../assets/Scores_Soccer_and_writing.png')}
            />
          );
        const RenderItemImageS = () => (
                <Image
                style={{ width: 45, height: 45, resizeMode: "contain"}}
                source={require('../assets/Scores_Ball.png')}
                />
            );
        const RenderItemImageW = () => (
                <Image
                style={{  width: 45, height: 45,resizeMode: "contain"}}
                source={require('../assets/Scores_Pencil_Edit.png')}
                />
        );
        const RenderItemImageGD = () => (
            <Image
            style={{  width: 45, height: 45,resizeMode: "contain"}}
            source={require('../assets/Scores_goal.png')}
            />
        );
        const colorList = () =>{
            if(this.props.sessionScreen.region === "ASBA"){
                return "#C0E4F5"
            }else{
                return "#86c0e3"
            }
        }
        let activityItem = ({ item, index }) => {
            if (item.Sessions === null){
                return; 
            }
            else {
                //let sessionTopic = "Unasigned"
                //if (item.Sessions[0].SessionTopic) sessionTopic = item.Sessions[0].SessionTopic;
                return item.Sessions.map(value => {
                    if(value.SessionTopic === null){
                        if(String(this.props.sessionAttendance.sessionsAttendance).length !== 0){
                            if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                                return <ListItem
                                    key={value.SessionId}
                                    title={`${item.Team_Name}`}
                                    style={{backgroundColor: colorList()}}
                                    /*description={sessionTopic.replace(/_/g,' ')}*/
                                    accessoryLeft={RenderItemImageNL}
                                    accessoryRight={(String(this.props.sessionAttendance.sessionsAttendance).length !== 0)?
                                        ((value.SessionId !== this.props.sessionAttendance.sessionsAttendance[0].SessionId)?
                                        renderItemIcon
                                        :
                                        renderItemIconRed)
                                        :
                                        renderItemIcon}
                                    onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                />                                      
                            }else{
                                let found=null;
                                this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) =>{
                                    if(value.SessionId === valueredux.SessionId){
                                        found=true
                                    }
                                });
                                if(found === true){
                                    return <ListItem
                                        key={value.SessionId}
                                        title={`${item.Team_Name}`}
                                        style={{backgroundColor: colorList()}}
                                        /*description={sessionTopic.replace(/_/g,' ')}*/
                                        accessoryLeft={RenderItemImageNL}
                                        accessoryRight={renderItemIconRed}
                                        onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                    />
                                }else{
                                    return <ListItem
                                        key={value.SessionId}
                                        title={`${item.Team_Name}`}
                                        style={{backgroundColor: colorList()}}
                                        /*description={sessionTopic.replace(/_/g,' ')}*/
                                        accessoryLeft={RenderItemImageNL}
                                        accessoryRight={renderItemIcon}
                                        onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                    />
                                }
                            }
                        }else{
                            return <ListItem
                                        key={value.SessionId}
                                        title={`${item.Team_Name}`}
                                        style={{backgroundColor: colorList()}}
                                        /*description={sessionTopic.replace(/_/g,' ')}*/
                                        accessoryLeft={RenderItemImageNL}
                                        accessoryRight={renderItemIcon}
                                        onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                    />
                        }
                    }else{
                        if(value.SessionTopic.replace(/_/g,' ') === "Soccer and Writing"){
                            if(String(this.props.sessionAttendance.sessionsAttendance).length !== 0){
                                if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                                    return <ListItem
                                        key={value.SessionId}
                                        title={`${item.Team_Name}`}
                                        style={{backgroundColor: colorList()}}
                                        /*description={sessionTopic.replace(/_/g,' ')}*/
                                        accessoryLeft={RenderItemImageSW}
                                        accessoryRight={(String(this.props.sessionAttendance.sessionsAttendance).length !== 0)?
                                            ((value.SessionId !== this.props.sessionAttendance.sessionsAttendance[0].SessionId)?
                                            renderItemIcon
                                            :
                                            renderItemIconRed)
                                            :
                                            renderItemIcon}
                                        onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                    />
                                          
                                }else{
                                    let found=null;
                                    this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) =>{
                                        if(value.SessionId === valueredux.SessionId){
                                            found=true
                                        }
                                    });
                                    if(found === true){
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageSW}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageSW}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }
                                }
                            }else{
                                return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageSW}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                            }
                        }else if(value.SessionTopic.replace(/_/g,' ') === "Soccer"){
                            if(String(this.props.sessionAttendance.sessionsAttendance).length !== 0){
                                if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                                    return <ListItem
                                        key={value.SessionId}
                                        title={`${item.Team_Name}`}
                                        style={{backgroundColor: colorList()}}
                                        /*description={sessionTopic.replace(/_/g,' ')}*/
                                        accessoryLeft={RenderItemImageS}
                                        accessoryRight={(String(this.props.sessionAttendance.sessionsAttendance).length !== 0)?
                                            ((value.SessionId !== this.props.sessionAttendance.sessionsAttendance[0].SessionId)?
                                            renderItemIcon
                                            :
                                            renderItemIconRed)
                                            :
                                            renderItemIcon}
                                        onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                    />
                                          
                                }else{
                                    let found=null;
                                    this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) =>{
                                        if(value.SessionId === valueredux.SessionId){
                                            found=true
                                        }
                                    });
                                    if(found === true){
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageS}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageS}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }
                                }
                            }else{
                                return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageS}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                            }
                        }else if(value.SessionTopic.replace(/_/g,' ') === "Writing"){
                            if(String(this.props.sessionAttendance.sessionsAttendance).length !== 0){
                                if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                                    return <ListItem
                                        key={value.SessionId}
                                        title={`${item.Team_Name}`}
                                        style={{backgroundColor: colorList()}}
                                        /*description={sessionTopic.replace(/_/g,' ')}*/
                                        accessoryLeft={RenderItemImageW}
                                        accessoryRight={(String(this.props.sessionAttendance.sessionsAttendance).length !== 0)?
                                            ((value.SessionId !== this.props.sessionAttendance.sessionsAttendance[0].SessionId)?
                                            renderItemIcon
                                            :
                                            renderItemIconRed)
                                            :
                                            renderItemIcon}
                                        onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                    />
                                        
                                }else{
                                    let found=null;
                                    this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) =>{
                                        if(value.SessionId === valueredux.SessionId){
                                            found=true
                                        }
                                    });
                                    if(found === true){
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageW}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageW}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }
                                }
                            }else{
                                return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageW}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                            }
                        }
                        else if(value.SessionTopic.replace(/_/g,' ') === "Game Day"){
                            if(String(this.props.sessionAttendance.sessionsAttendance).length !== 0){
                                if(this.props.sessionAttendance.sessionsAttendance[0][0] === undefined){
                                    return <ListItem
                                        key={value.SessionId}
                                        title={`${item.Team_Name}`}
                                        style={{backgroundColor: colorList()}}
                                        /*description={sessionTopic.replace(/_/g,' ')}*/
                                        accessoryLeft={RenderItemImageGD}
                                        accessoryRight={(String(this.props.sessionAttendance.sessionsAttendance).length !== 0)?
                                            ((value.SessionId !== this.props.sessionAttendance.sessionsAttendance[0].SessionId)?
                                            renderItemIcon
                                            :
                                            renderItemIconRed)
                                            :
                                            renderItemIcon}
                                        onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                    />
                                        
                                }else{
                                    let found=null;
                                    this.props.sessionAttendance.sessionsAttendance[0].map((valueredux) =>{
                                        if(value.SessionId === valueredux.SessionId){
                                            found=true
                                        }
                                    });
                                    if(found === true){
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageGD}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageGD}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }
                                }
                            }else{
                                return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList()}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageGD}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                            }
                        }
                    }
                })
            }
        }
        const dateService = new MomentDateService();
        // var date = moment();

        // const minDatePickerDate = moment("20190101", "YYYYMMDD").toDate();

        const searchBox = () => (
            <Datepicker
                label="Select a Date"
                placeholder='Pick Date'
                date={this.state.date}
                size='large'
                placement="bottom"
                // min={minDatePickerDate}
                style={{margin: "2%",minWidth:"90%"}}
                dateService={dateService}
                onSelect={nextDate => this.selectDate(nextDate)}
                accessoryRight={CalendarIcon}
            />
        );

        const selectBox = () => (
            <Select
                disabled={this.state.disabledbox}
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
                (this.state.activitiesRegion.length !== 0 && this.state.RegionSelected.length !== 0 && this.state.nomatchModalVisibility===false) &&
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
                (this.state.activities.length !== 0 && this.state.activitiesRegion.length === 0 && this.state.RegionSelected.length !== 0 && this.state.nomatchModalVisibility===false) &&
                (this.props.sessionScreen.region === "ASBA"?
                <Card style={{opacity: 0.9, backgroundColor:"#C0E4F5"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#C0E4F5"}}>
                        There are no active Sessions for the selected Region.
                    </Text>
                </Card>:
                <Card style={{opacity: 0.9, backgroundColor:"#86c0e3"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#86c0e3"}}>
                        There are no active Sessions for the selected Region.
                    </Text>
                </Card>
            ))
        );
        const helloMessage = (status) => (
            (
                (this.state.welcomeModalVisibility) &&
                    <Card style={{opacity: 0.9}}>
                        <Text category="s1" status={status} style={{alignSelf: 'center'}}>
                            {this.props.user.user.FirstName} {this.props.user.user.LastName}
                        </Text>
                    </Card>
            )
        );

        const noMatch = (status) => (
            (
                (this.state.nomatchModalVisibility) &&
                (this.props.sessionScreen.region === "ASBA"?
                <Card style={{opacity: 0.9, backgroundColor:"#C0E4F5"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#C0E4F5"}}>
                        There are no active Sessions for the selected date.
                    </Text>
                </Card>:
                <Card style={{opacity: 0.9, backgroundColor:"#86c0e3"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#86c0e3"}}>
                        There are no active Sessions for the selected date.
                    </Text>
                </Card>
            ))
        );
        const message = (status) =>(
            <Card appearance="filled" style={{opacity: 0.95, position:"absolute",top:0,alignSelf: 'center',justifyContent: 'center', }}>
                    <Text category="h6" status={status} style={{alignSelf: 'center',justifyContent: 'center', opacity: 0.95}}>
                        {this.state.displayMessage}
                    </Text>
                </Card>
        );
        const addButton = () => {
                 return <View style={{justifyContent: 'center', alignItems: 'center', marginBottom:"8%"}}>
                <ButtonGroup>
                <Button style={{width:"46%"}} status="primary" onPress={() => this.props.navigation.navigate("AddSessionModal", {teamSeasonId: this.state.teamSeasonId})}>+ ADD SESSION</Button>
                {/* <Button style={{width:"54%"}} accessoryLeft={addIcon} status="primary" onPress={() => this.props.navigation.navigate("AddStudentToTeamModal", {teamSeasonId: this.state.teamSeasonId})}>ENROLL STUDENT</Button>           */}
                </ButtonGroup>
                </View>
                
        };
        const getImage = () =>{
            if(this.props.sessionScreen.region === "IFC"){
                return require('../assets/IFC-Logo.png');
            }else if(this.props.sessionScreen.region === "ASBA"){
                return require('../assets/ASBA_Logo.png');
            }else{
                return require('../assets/Genesis_Logo.png');
            }
        }
        const OptionButtons = () => (
            <Button style={{position:"absolute",top:"1.2%", left:"5%"}} appearance='ghost' accessoryRight={ArrowIcon} onPress={() => this.setState({OverflowMenuVisible:true})}/>
        );
        return(
            /*<View source={require('../assets/ASBA_Logo.png')} style={{flex: 1}}>*/
                <Layout style={{ flex: 1, justifyContent: 'center'}}>
                    {message("warning")}
                    <Divider style={{marginTop:"15%"}}/>
                    <ImageBackground source={getImage()} style={styles.image}>
                        {helloMessage("info")}
                        {noMatch("basic")}
                        {noMatchRegion("basic")}
                        {regionName("basic")}
                            <List
                                style={{opacity: 0.95}}
                                data={this.state.activitiesRegion}
                                renderItem={activityItem}
                                Divider={Divider}
                                refreshControl={
                                    <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    />
                                }
                            />
                    </ImageBackground>
                    {addButton()}
                    <BottomSheet isOpen sliderMinHeight={28} lineStyle={{marginTop:"3%"}}>
                        {searchBox()}
                        {selectBox()}
                    </BottomSheet>
                </Layout>      
           /* </View>     */                 
        );
    };
};

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user , sessionScreen: state.sessionScreen , sessionAttendance: state.sessionAttendance });
  
const ActionCreators = Object.assign( {}, { syncSessions, updateFirstTimeLoggedIn, changeTitle} );
  
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesScreen);

const styles = StyleSheet.create({
    popOverContent: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'center',
        shadowRadius: 10,
        shadowOpacity: 0.12,
        shadowColor: "#000"
    },
    image: {
        flex:1, 
        resizeMode: "contain",
        opacity: 0.99,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});