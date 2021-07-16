import React, {Component} from "react";
import { Layout, Divider, List, ListItem, Icon, Text, Datepicker, Card, Button, ButtonGroup, IndexPath, Select, Modal, SelectItem} from '@ui-kitten/components';
import { ImageBackground, View, StyleSheet, RefreshControl, ScrollView , Image, TouchableOpacity} from "react-native";

import { MomentDateService } from '@ui-kitten/moment';

import Axios from "axios";
import moment from "moment";

import AsyncStorage from '@react-native-community/async-storage';

import {ApiConfig} from "./config/ApiConfig";

import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { updateFirstTimeLoggedIn } from "./Redux/actions/user.actions";
import { changeTitle } from "./Redux/actions/SessionScreen.actions";
import { changeRegion } from "./Redux/actions/SessionScreen.actions";
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
            regions:['Other','San Francisco','San Jose','San Rafael','Oakland','Daly City','Hayward','Redwood City',
            'San Francisco Civic Center','San Francisco Crocker','Alameda','Marin','San Mateo','Unrestricted',
            'IFC-SF', 'Genesis'],
            selectedIndex: "",
            displayedValue: "",
            isUpdated: false,
            teamSeasonId: "",
            listofSessions: null,
            seasonName: "",
            visible:false,
            activitiesArray: [],
            RegionSelected: "",//setting the region selected
        }
    }

    

    async componentDidMount() {
        this.setState({displayedValue:this.state.regions[0]})//setting "basic" region filter with Other
        this.setState({RegionSelected:"ASBA"})
        if(this.props.sessionScreen.region === null){
            this.setState({visible: true})
        }
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
                if (route.name === "Team Sessions" && route.params && route.params.teamSeasonId){
                    this.filterActivitiesByTeamSeasonId(route.params.teamSeasonId); // filter the activities for a specific team
                    this.setState({isUpdated: true, teamSeasonId: route.params.teamSeasonId});
                }
            })
            .catch(error => console.log(error));
    }

    //Syncs activitiesToRedux and state
    _syncReduxActivities(activitiesList) {
        const { actions } = this.props;
        const { route } = this.props;
        this.setState({listofSessions: null});
        actions.syncSessions(activitiesList);
        this.setState({activities: activitiesList});//saving the activitiesList
        this.setState({activitiesRegion:activitiesList.filter((value) =>(value.Region.match("Other")))})//saving sessions with region sf
        this.setState({displayedValue:this.state.regions[0]})//setting "basic" region filter with Other
        this.setState({RegionSelected:"ASBA"})
        if(activitiesList.length === 0){
            (this.setState({seasonName: "Sessions", nomatchModalVisibility: true}))//saving seasonName
        }else{
            (this.setState({seasonName: activitiesList[0].Season_Name ,nomatchModalVisibility: false}))//saving seasonName
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
            this.filterActivitiesByTeamSeasonId(route.params.teamSeasonId); // filter the activities for a specific team
            this.setState({isUpdated: true, teamSeasonId: route.params.teamSeasonId});
        }
        if (this.state.seasonName !== ""){
            if(this.state.seasonName !== "Sessions"){
                actions.changeTitle(this.state.seasonName + " " + "Sessions")//shows the actual season name
            }else{
                actions.changeTitle(this.state.seasonName)//shows the actual season name
            }
        }
    }

    filterActivitiesByTeamSeasonId(teamSeasonId) {
        this.setState({listofSessions: null});
        const activities = this.state.activities.filter(
            activity => { if (activity.Sessions) return activity.Sessions[0].TeamSeasonId === teamSeasonId;});
        this.setState({activities: activities});
        this.setState({activitiesRegion:activities.filter((value) =>(value.Region.match("Other")))})
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
        console.log((this.state.regions[index.row]))
        this.setState({activitiesRegion:this.state.activities.filter((value) =>(value.Region.match(this.state.regions[index.row])))})
        if(this.state.regions[index.row] === "Other"){
            this.setState({RegionSelected:"ASBA"})
        }else{
            this.setState({RegionSelected:this.state.regions[index.row]})
        }
    }
    SelectRegion(region){
        const { actions } = this.props;
        this.setState({visible:false})
        actions.changeRegion(region)
    }
    StatefulModalContent = () => {
        return (
            <View style={{flexDirection: "row",alignContent: "space-between"}}>
                <Card onPress={() => {this.SelectRegion("Scores")}} style={{maxWidth:"60%"}}>
                    <Image source={require('../assets/ASBA_Logo_Only_Removedbg.png')} style={{height:100, width:100}}/>
                    <Text category="s2" style={{alignSelf: 'center'}}>America SCORES</Text>
                </Card>
                <Card onPress={() => {this.SelectRegion("IFC")}} style={{maxWidth:"60%"}}>
                    <Image source={require('../assets/IFC-Logo.png')} style={{height:100, width:100}}/>
                    <Text category="s2" style={{alignSelf: 'center'}}>Independent FC</Text>
                </Card>
            </View>
        );
      };
    render() {
        const addIcon = (props) => ( <Icon {...props} name='person-add-outline'/> );
        let refreshing = false;
        const onRefresh = () => {
            refreshing = true;

            this._syncActivities().then(() => refreshing = false);

            // wait(2000).then(() => refreshing = false);
        };
        
        const CalendarIcon = (props) => ( <Icon {...props} name='calendar'/> );
        const renderItemIcon = (props) => (
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
                <Text  style={{alignSelf:"baseline"}}></Text>
                {/*<Icon {...props} name='people-outline'/> fill="#D62E0A"*/}
                <Icon {...props} name='calendar-outline'/> 
                <Icon {...props} name='arrow-ios-forward-outline'/> 
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
                                    style={{backgroundColor: "#C0E4F5"}}
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
                                        style={{backgroundColor: "#C0E4F5"}}
                                        /*description={sessionTopic.replace(/_/g,' ')}*/
                                        accessoryLeft={RenderItemImageNL}
                                        accessoryRight={renderItemIconRed}
                                        onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                    />
                                }else{
                                    return <ListItem
                                        key={value.SessionId}
                                        title={`${item.Team_Name}`}
                                        style={{backgroundColor: "#C0E4F5"}}
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
                                        style={{backgroundColor: "#C0E4F5"}}
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
                                        style={{backgroundColor: "#C0E4F5"}}
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
                                            style={{backgroundColor: "#C0E4F5"}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageSW}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: "#C0E4F5"}}
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
                                            style={{backgroundColor: "#C0E4F5"}}
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
                                        style={{backgroundColor: "#C0E4F5"}}
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
                                            style={{backgroundColor: "#C0E4F5"}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageS}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: "#C0E4F5"}}
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
                                            style={{backgroundColor: "#C0E4F5"}}
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
                                        style={{backgroundColor: "#C0E4F5"}}
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
                                            style={{backgroundColor: "#C0E4F5"}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageW}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: "#C0E4F5"}}
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
                                            style={{backgroundColor: "#C0E4F5"}}
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
                                        style={{backgroundColor: "#C0E4F5"}}
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
                                            style={{backgroundColor: "#C0E4F5"}}
                                            /*description={sessionTopic.replace(/_/g,' ')}*/
                                            accessoryLeft={RenderItemImageGD}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: "#C0E4F5"}}
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
                                            style={{backgroundColor: "#C0E4F5"}}
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
                placeholder='Pick Date'
                date={this.state.date}
                size='large'
                // min={minDatePickerDate}
                style={{margin: "2%"}}
                dateService={dateService}
                onSelect={nextDate => this.selectDate(nextDate)}
                accessoryRight={CalendarIcon}
            />
        );

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
                (this.state.activitiesRegion.length !== 0 && this.state.RegionSelected.length !== 0) &&
                    <View style={{backgroundColor:"#52a5cc"}}>
                            <Text style={{textAlign:"center"}} status={status} category='h6'>
                                {this.state.RegionSelected}
                            </Text>
                    </View>
            )
        );
        const noMatchRegion = (status) =>(
            (
                (this.state.activities.length !== 0 && this.state.activitiesRegion.length === 0 && this.state.RegionSelected.length !== 0) &&
                <Card style={{opacity: 0.9, backgroundColor:"#C0E4F5"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#C0E4F5"}}>
                        There are no active Sessions for the selected Region.
                    </Text>
                </Card>
            )
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
        const regionModal = () =>(
            <Modal visible={this.state.visible} style={styles.popOverContent} backdropStyle={styles.backdrop}>
                {this.StatefulModalContent()}
            </Modal>
        );
        const noMatch = (status) => (
            (
                (this.state.nomatchModalVisibility) &&
                <Card style={{opacity: 0.9, backgroundColor:"#C0E4F5"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#C0E4F5"}}>
                        There are no active Sessions for the selected date.
                    </Text>
                </Card>
            )
        );

        const addButton = () => {
            if (this.state.isUpdated){
                 return <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <ButtonGroup>
                <Button style={{width:"46%"}} status="primary" onPress={() => this.props.navigation.navigate("AddSessionModal", {teamSeasonId: this.state.teamSeasonId})}>+ ADD SESSION</Button>
                {/* <Button style={{width:"54%"}} accessoryLeft={addIcon} status="primary" onPress={() => this.props.navigation.navigate("AddStudentToTeamModal", {teamSeasonId: this.state.teamSeasonId})}>ENROLL STUDENT</Button>           */}
                </ButtonGroup>
                </View>
                }
        };
        const getImage = () =>{
            if(this.props.sessionScreen.region === "IFC"){
                return require('../assets/IFC-Logo.png');
            }else{
                return require('../assets/ASBA_Logo.png');
            }
        }
        return(
            /*<View source={require('../assets/ASBA_Logo.png')} style={{flex: 1}}>*/
                <Layout style={{ flex: 1, justifyContent: 'center'}}>
                {searchBox()}
                {selectBox()}
                <Divider/>
                {helloMessage("info")}
                {regionModal()}
                {noMatch("basic")}
                    <ImageBackground  source={getImage()} style={styles.image}>
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
                </Layout>      
           /* </View>     */                 
        );
    };
};

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user , sessionScreen: state.sessionScreen , sessionAttendance: state.sessionAttendance });
  
const ActionCreators = Object.assign( {}, { syncSessions, updateFirstTimeLoggedIn, changeTitle, changeRegion } );
  
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
        opacity: 0.99
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});