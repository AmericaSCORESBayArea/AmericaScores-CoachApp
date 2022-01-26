import React, {Component, createRef} from "react";
import { Layout, Divider, List, ListItem, Icon, Text, Datepicker, Card, Button, ButtonGroup, Modal, Select, SelectItem, RangeDatepicker, NativeDateService, Tab, TabBar } from '@ui-kitten/components';
import { ImageBackground, View, StyleSheet, RefreshControl, Image } from "react-native";
import { MomentDateService } from '@ui-kitten/moment';
import Axios from "axios";
import moment from "moment";
import BottomSheet from 'react-native-simple-bottom-sheet';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiConfig} from "./config/ApiConfig";
import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { updateFirstTimeLoggedIn } from "./Redux/actions/user.actions";
import { changeTitle } from "./Redux/actions/SessionScreen.actions";
import { changeTitleTeam } from "./Redux/actions/SessionScreen.actions";
import { bindActionCreators } from 'redux';
import { paletteColors } from './components/paletteColors';       
class ActivitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.RangeDatepicker = createRef();
        this.state = {
            date: moment(),
            activities: "",
            activitiesRegion: "",
            welcomeModalVisibility: false,
            nomatchModalVisibility: false,
            regions: this.props.sessionScreen.listofregions,
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
            selectedTabIndex: 0,
            studentList: "",
            isTeamSessions: false,
            displayMessage:"",
            //range: {startDate: moment(), endDate: moment().add(10, 'days')},
            range:{
                startDate: new Date(moment().subtract(10, "days")),
                endDate: new Date(moment()),
            },
            StartSeason: '',
            EndSeason: '',
            dateCont: 0,
            loadingModalstate:true,
            selected: null
        }
    }
    
    async componentDidMount() {
        let aux= await AsyncStorage.getItem('customTheme');
        if(aux === null){
            this.setState({selected: paletteColors[0]})
        }else{
            this.setState({selected: JSON.parse(aux)})
        }
        const { route } = this.props;
        const { actions } = this.props;
        if (route.name !== "Team Sessions"){
            // this.setState({loadingModalstate:false});
        }else{
            actions.changeTitleTeam(route.params.SeasonName);
        }
        this.setState({displayedValue:this.state.regions[0]})//setting "basic" region filter with All
        if (this.props.sessionScreen.region === 'IFC'){
            this.setState({RegionSelected:"All IFC"})
        }else if (this.props.sessionScreen.region === 'ASBA'){
            this.setState({RegionSelected:"All ASBA"})
        }else if (this.props.sessionScreen.region === 'OGSC'){
            this.setState({RegionSelected:"All OGSC"})
        }

        
        //this.__syncCoachRegions(); call a function that returns coach regions
        await this._syncActivities();
        await AsyncStorage.setItem('loggedStatus', "true");
        if (this.props.user.firstTimeLoggedIn) {
            setTimeout(() => (this.setState({welcomeModalVisibility: true})), 500);
            setTimeout(() => {this.setState({welcomeModalVisibility: false,loadingModalstate:false})}, 3500);
        }
        console.log(this.props.user);
    }

    async _syncActivities() {
        const { route } = this.props;
        //Syncs activities from endpoint
        await this.fetchActivities()
            .then(activitiesList => this._syncReduxActivities(activitiesList))    
            .then(async () => {
                //Check if we are in the team activities name
                if (route.name === "Team Sessions" && route.params && route.params.teamSeasonId && route.params.region && route.params.teamName){
                    await this.fetchStudents();
                    await this.filterActivitiesByTeamSeasonId(route.params.teamSeasonId,route.params.region,route.params.teamName); // filter the activities for a specific team
                    this.setState({isUpdated: true, teamSeasonId: route.params.teamSeasonId, region: route.params.region, teamName: route.params.teamName, isTeamSessions: true});
                }
            })
            .catch(error => console.log(error));
    }

    async fetchStudents(){
        this.setState({loadingModalstate: true});
        const { user } = this.props;
        const { route } = this.props;
        console.log(`${ApiConfig.dataApi}/coach/${user.user.ContactId}/teamseasons/${route.params.teamSeasonId}/enrollments`)
        return await Axios.get(`${ApiConfig.dataApi}/coach/${user.user.ContactId}/teamseasons/${route.params.teamSeasonId}/enrollments`)
              .then(res => {
                    this.setState({studentList: res.data.sort((a, b) => (a.StudentName.split(" ")[1].toLowerCase() > b.StudentName.split(" ")[1].toLowerCase())), loadingModalstate: false})})
              .catch(e => console.log(e));
    }

    _syncReduxActivities(activitiesList) {
        const { actions } = this.props;
        const { route } = this.props;
        this.setState({listofSessions: null});
        actions.syncSessions(activitiesList);
        this.setState({activities: activitiesList});//saving the activitiesList
        if (this.props.sessionScreen.region === 'IFC'){
            this.setState({activitiesRegion:activitiesList.filter((value) => (value.Region.match('IFC-SF'))),displayedValue:this.state.regions[0],RegionSelected:"All IFC"})//saving sessions without filtering
            var activitiesregion = activitiesList.filter((value) => (value.Region.match('IFC-SF')));
        }else if (this.props.sessionScreen.region === 'OGSC'){
            this.setState({activitiesRegion:activitiesList.filter((value) => (value.Region.match('Genesis'))),displayedValue:this.state.regions[0],RegionSelected:"All OGSC"})//saving sessions without filtering
            var activitiesregion = activitiesList.filter((value) => (value.Region.match('Genesis')));
        }else{
            this.setState({activitiesRegion:activitiesList.filter((value => (!value.Region.match('Genesis') && !value.Region.match('IFC-SF')))),displayedValue:this.state.regions[0],RegionSelected:"All ASBA"})//saving sessions without filtering
            var activitiesregion = activitiesList.filter((value => (!value.Region.match('Genesis') && !value.Region.match('IFC-SF'))))
        }
        activitiesregion.map(value => {
                if(value.Sessions !== null){
                    this.setState({ listofSessions: value.Sessions})
                }
            });
        if(this.state.listofSessions === null){
            this.setState({nomatchModalVisibility: true});
        }else{
            this.setState({nomatchModalVisibility: false});
        }
        if(route.name === "Team Sessions"){
            this.filterActivitiesByTeamSeasonId(route.params.teamSeasonId,route.params.region, route.params.teamName, route.params.seasonStart, route.params.seasonEnd); // filter the activities for a specific team
            if(this.state.isUpdated !== true){
                this.setState({range:{startDate: new Date(moment().subtract(10, "days")),endDate: new Date(moment())}})//change
            }
            this.setState({isUpdated: true, teamSeasonId: route.params.teamSeasonId, region: route.params.region, teamName: route.params.teamName, StartSeason: new Date(route.params.seasonStart),EndSeason:  new Date(route.params.seasonEnd)});
        }else{
            if(activitiesList.length === 0){
                (this.setState({seasonName: "Sessions", nomatchModalVisibility: true}))//saving seasonName
            }else{
                if(this.state.listofSessions === null){//if there are teams with null sessions, we set nomatchModal True
                    (this.setState({seasonName: activitiesList[0].Season_Name ,nomatchModalVisibility: true}))//saving seasonName
                }else{
                    (this.setState({seasonName: activitiesList[0].Season_Name ,nomatchModalVisibility: false}))//saving seasonName
                }
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

    async filterActivitiesByTeamSeasonId(teamSeasonId,region,teamName) {
        this.setState({displayMessage:teamName, displayedValue:region, RegionSelected:region, selectedIndex:this.state.regions.indexOf(region), disabledbox:true});
        this.setState({listofSessions: null});
        const activities = await this.state.activities.filter(
            activity => { if (activity.Sessions) return activity.Sessions[0].TeamSeasonId === teamSeasonId;});
        this.setState({activities: activities});
        this.setState({activitiesRegion:this.state.activities.filter((value) =>(region.match(value.Region)))})
        await activities.map(value => {
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
        const { route } = this.props;
        /*delete Axios.defaults.headers.common['client_id'];
        delete Axios.defaults.headers.common['client_secret'];
        Axios.defaults.headers.common['client_id'] = ApiConfig.clientIdSandbox;
        Axios.defaults.headers.common['client_secret'] = ApiConfig.clientSecretSandbox;     
        console.log(Axios.defaults.headers)*/
        if(route.name === "Team Sessions"){
            if(this.state.isUpdated !== true){
                await this.setState({range:{startDate: new Date(moment().subtract(10, "days")),endDate: new Date(moment())}})
            }
        }
        if(this.state.range.endDate !== null){
            return await Axios.get(`${ApiConfig.dataApi}/coach/${user.user.ContactId}/all`, {
                params: {
                    // Hardcoded value, change the "2019-08-21" for this.state.date for getting the result in a specific date
                    firstDate: moment(this.state.range.startDate).format("YYYY-MM-DD"),
                    secondDate: moment(this.state.range.endDate).format("YYYY-MM-DD"),
                }
              })
              .then(res => res.data)
              .catch(e => console.log(e));
        }
        else{
            return await Axios.get(`${ApiConfig.dataApi}/coach/${user.user.ContactId}/all`, {
                params: {
                    // Hardcoded value, change the "2019-08-21" for this.state.date for getting the result in a specific date
                    firstDate: moment(this.state.range.startDate).format("YYYY-MM-DD"),    
                }
            })
              .then(res => res.data)
              .catch(e => console.log(e));
        }
    }

    async selectDate(date) { 
        await this.setState({date: date})
        const activitiesList = await this.fetchActivities();
        this._syncReduxActivities(activitiesList);
    }
    async selectRange(dates) {
        const { route } = this.props;
        console.log(this.state.dateCont, dates.endDate)
        if(dates.endDate === null && this.state.dateCont < 1){
            this.setState({dateCont: this.state.dateCont+1})
            this.setState({range: dates})
        }else{
            this.setState({loadingModalstate:true});
            
                this.RangeDatepicker.current.blur();
                await this.setState({range: dates, dateCont: 0})
                const activitiesList = await this.fetchActivities();
                this._syncReduxActivities(activitiesList);
                this.setState({loadingModalstate:false});
        }
        console.log(this.state.RangeDatepickerVisibility)
    }

    selectActivity(teamSeasonId, sessionId) { this.props.navigation.navigate("Attendance", {teamSeasonId: teamSeasonId, sessionId: sessionId, activitiesRegion: this.state.activitiesRegion}) }

    toggleWelcomeModalOff() { 
        const { actions } = this.props;
        this.setState({welcomeModalVisibility: false})
        actions.updateFirstTimeLoggedIn();
    }
    SelectIndex(index){
        this.setState({selectedIndex: index});
        this.setState({displayedValue: this.state.regions[index.row]});
        if(this.state.regions[index.row] === "All IFC" || this.state.regions[index.row] === "All ASBA" || this.state.regions[index.row] === "All OGSC"){
            if (this.props.sessionScreen.region === 'IFC'){
                this.setState({activitiesRegion:this.state.activities.filter((value) => (value.Region.match('IFC-SF')))})//saving sessions without filtering
                var activitiesregion = this.state.activities.filter((value) => (value.Region.match('IFC-SF')));
            }else if (this.props.sessionScreen.region === 'OGSC'){
                this.setState({activitiesRegion:this.state.activities.filter((value) => (value.Region.match('Genesis')))})//saving sessions without filtering
                var activitiesregion = this.state.activities.filter((value) => (value.Region.match('Genesis')));
            }else{
                this.setState({activitiesRegion:this.state.activities.filter((value => (!value.Region.match('Genesis') && !value.Region.match('IFC-SF'))))})//saving sessions without filtering
                var activitiesregion = this.state.activities.filter((value => (!value.Region.match('Genesis') && !value.Region.match('IFC-SF'))));
            }
        }else{
            this.setState({activitiesRegion:this.state.activities.filter((value) =>((this.state.regions[index.row]).match(value.Region)))})
            var activitiesregion = this.state.activities.filter((value) =>((this.state.regions[index.row]).match(value.Region)));
        }
        this.setState({RegionSelected:this.state.regions[index.row]})
        var cont=0
        activitiesregion.map(value => {
            if (value.Sessions === null){
                cont=cont+1
            }
        })
        if(activitiesregion.length === cont){
            this.setState({activitiesRegion: ''})
        }
    }
    SelectIndexDrawer(index){
        this.setState({selectedIndexDrawer: index})
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
        const TopTabBar = () => (
            (this.state.isTeamSessions === true ?
                <TabBar
                selectedIndex={this.state.selectedTabIndex}
                onSelect={index => this.setState({selectedTabIndex: index})}>
                <Tab title='Team Sessions'/>
                <Tab title='Students'/>
              </TabBar>
              :
              null
        ));

        const addIcon = (props) => ( <Icon {...props} name='person-add-outline'/> );
        let refreshing = false;
        const onRefresh = async () => {
            let aux= await AsyncStorage.getItem('customTheme');
            this.setState({selected: JSON.parse(aux)})
            this.setState({loadingModalstate: true});
            refreshing = true;
            this._syncActivities().then(() => refreshing = false);
            setTimeout(() => {this.setState({loadingModalstate:false})}, 3500);
            // wait(2000).then(() => refreshing = false);
        };
        
        const studentIcon = (props) => ( <Icon {...props} fill="#4f5c63" name='person'/> );
        const CalendarIcon = (props) => ( <Icon {...props} name='calendar'/> );
        const ArrowIcon = (props) => ( <Icon {...props} fill="#4f5c63" size='medium' name='arrow-ios-forward-outline'/> );
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
        const colorList = (date) =>{
            if(moment().format("MM-DD-YYYY") === moment(date).format("MM-DD-YYYY")){
                return this.state.selected.color2
                /*if(this.props.sessionScreen.region === "ASBA"){
                    return this.state.selected.color2//list today #3D7C99
                }else{
                    return this.state.selected.color2//list today #2179ad
                }*/
            }else{
                return this.state.selected.color3
                /*if(this.props.sessionScreen.region === "ASBA"){
                    return "#C0E4F5"//list others #C0E4F5
                }else{
                    return "#86c0e3"//list others #86c0e3
                }*/
            }
        }
        const description = (date) =>(
                (moment().format("MM-DD-YYYY") === moment(date).format("MM-DD-YYYY"))?
                    <Text style={{color: this.state.selected.todayTextColor, fontSize: 15, fontWeight: 'bold'}}>
                        Date: {moment(date).format("MM-DD-YYYY")} {'\n'}
                        Today, {moment(date).format("dddd")}
                    </Text>:
                    <Text  style={{color: this.state.selected.textColor, fontSize: 15}}>
                        Date: {moment(date).format("MM-DD-YYYY")} {'\n'}
                        {moment(date).format("dddd")}
                    </Text>
        );
        const studentDescription = (date) => {
            <Text style={{color:"black", fontSize: 12}}>
                Date: {moment(date).format("MM-DD-YYYY")}
            </Text>
        }
        
        let studentItem = ({item, index}) => {
            if (item === null){
                return; 
            }
            else{
                return (<ListItem
                            key={item.StudentId}
                            title={() => <Text style={{color: this.state.selected.textColor}}>{item.LastName}, {item.FirstName}</Text>}
                            style={{backgroundColor: this.state.selected.color2}}
                            description={studentDescription(item.Birthdate)}
                            accessoryLeft={studentIcon}
                            accessoryRight={ArrowIcon}
                            onPress={() => this.props.navigation.navigate('StudentInfoModal', {
                                StudentName: item.StudentName,
                                Birthdate: item.Birthdate,
                                Allergies: item.Allergies,
                                ParentName: `${item.ParentInfoFirstName.FirstName} ${item.ParentInfoFirstName.LastName}`,
                                ParentPhone: item.ParentInfoFirstName.FirstPhone,
                                EmergencyContactName: item.EmergencyContactInfo.Name,
                                EmergencyContactRelationToChild: item.EmergencyContactInfo.RelationshipToChild,
                                EmergencyContactPhone: item.EmergencyContactInfo.FirstPhone,
                                SecondEmergencyContactName: item.SecondEmergencyContactInfo.Name,
                                SecondEmergencyContactRelationToChild: item.SecondEmergencyContactInfo.RelationshipToChild,
                                SecondEmergencyContactPhone: item.SecondEmergencyContactInfo.FirstPhone,
                                LastModifiedDate: item.LastModifiedDate
                            })}
                        /> )
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
                                    title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor,fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                    style={{backgroundColor: colorList(value.SessionDate)}}
                                    description={() => description(value.SessionDate)}
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
                                        title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                        style={{backgroundColor: colorList(value.SessionDate)}}
                                        description={() => description(value.SessionDate)}
                                        accessoryLeft={RenderItemImageNL}
                                        accessoryRight={renderItemIconRed}
                                        onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                    />
                                }else{
                                    return <ListItem
                                        key={value.SessionId}
                                        title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                        style={{backgroundColor: colorList(value.SessionDate)}}
                                        description={`${value.SessionDate}`}
                                        accessoryLeft={RenderItemImageNL}
                                        accessoryRight={renderItemIcon}
                                        onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                    />
                                }
                            }
                        }else{
                            return <ListItem
                                        key={value.SessionId}
                                        title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                        style={{backgroundColor: colorList(value.SessionDate)}}
                                        description={() => description(value.SessionDate)}
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
                                        title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                        style={{backgroundColor: colorList(value.SessionDate)}}
                                        description={() => description(value.SessionDate)}
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
                                            title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
                                            accessoryLeft={RenderItemImageSW}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
                                            accessoryLeft={RenderItemImageSW}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }
                                }
                            }else{
                                return <ListItem
                                            key={value.SessionId}
                                            title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
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
                                        title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                        style={{backgroundColor: colorList(value.SessionDate)}}
                                        description={() => description(value.SessionDate)}
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
                                            title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
                                            accessoryLeft={RenderItemImageS}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
                                            accessoryLeft={RenderItemImageS}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }
                                }
                            }else{
                                return <ListItem
                                            key={value.SessionId}
                                            title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
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
                                        title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                        style={{backgroundColor: colorList(value.SessionDate)}}
                                        description={() => description(value.SessionDate)}
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
                                            title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
                                            accessoryLeft={RenderItemImageW}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
                                            accessoryLeft={RenderItemImageW}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }
                                }
                            }else{
                                return <ListItem
                                            key={value.SessionId}
                                            title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
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
                                        title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                        style={{backgroundColor: colorList(value.SessionDate)}}
                                        description={() => description(value.SessionDate)}
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
                                            title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text  style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
                                            accessoryLeft={RenderItemImageGD}
                                            accessoryRight={renderItemIconRed}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }else{
                                        return <ListItem
                                            key={value.SessionId}
                                            title={`${item.Team_Name}`}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
                                            accessoryLeft={RenderItemImageGD}
                                            accessoryRight={renderItemIcon}
                                            onPress={() => this.selectActivity(item.TeamSeasonId, value.SessionId)}
                                        />
                                    }
                                }
                            }else{
                                return <ListItem
                                            key={value.SessionId}
                                            title={() => (moment().format("MM-DD-YYYY") === moment(value.SessionDate).format("MM-DD-YYYY"))? <Text style={{color: this.state.selected.todayTextColor, fontSize: 15}}>{item.Team_Name}</Text>:<Text style={{color: this.state.selected.textColor, fontSize: 15, fontWeight: 'bold'}}>{item.Team_Name}</Text>}
                                            style={{backgroundColor: colorList(value.SessionDate)}}
                                            description={() => description(value.SessionDate)}
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
        const formatDateService = new NativeDateService('en', { format: 'MM/DD/YYYY' });

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
        const searchBoxRanges = () => (
            <RangeDatepicker
                label="Select a Date"
                placeholder='Pick Date'
                size='large'
                placement="bottom"
                range={this.state.range}
                min={new Date('01/01/2020')}
                max={this.state.EndSeason}
                onSelect={range => this.selectRange(range)}
                dateService={formatDateService}
                style={{margin: "2%",minWidth:"90%"}}
                accessoryRight={CalendarIcon}
                ref={this.RangeDatepicker}
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
                (this.state.activitiesRegion.length !== 0 && this.state.RegionSelected.length !== 0 && this.state.nomatchModalVisibility===false  && this.state.selectedTabIndex !== 1) &&
                 //(this.props.sessionScreen.region === "ASBA"?
                    <View style={{backgroundColor: this.state.selected.color1}}>{/*Region name #52a5cc*/}
                        <Text style={{textAlign:"center", color:"white"}} status={status} category='h6'>
                            {this.state.RegionSelected}
                        </Text>
                    </View>/*:
                    <View style={{backgroundColor:"#001541"}}>{/*Region name #001541*///}
                            //<Text style={{textAlign:"center",color:"white"}} status={status} category='h6'>
                             //   {this.state.RegionSelected}
                            //</Text>
                   // </View>
                // )
            )
        );
        const noMatchRegion = (status) =>(
            (
                (this.state.activities.length !== 0 && this.state.activitiesRegion.length === 0 && this.state.RegionSelected.length !== 0 && this.state.nomatchModalVisibility===false && this.state.selectedTabIndex !== 1) &&
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
                (this.state.nomatchModalVisibility && this.state.selectedTabIndex !== 1) &&
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
        const emptyStudentsList = (status) => (
            (
                (this.state.studentList.length === 0 && this.state.selectedTabIndex === 1) &&
                (this.props.sessionScreen.region === "ASBA"?
                <Card style={{opacity: 0.9, backgroundColor:"#C0E4F5"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#C0E4F5"}}>
                    No Students Enrolled. Please use the Enroll Feature to Add a Student.
                    </Text>
                </Card>:
                <Card style={{opacity: 0.9, backgroundColor:"#86c0e3"}}>
                    <Text category="s1" status={status} style={{alignSelf: 'center', backgroundColor:"#86c0e3"}}>
                    No Students Enrolled. Please use the Enroll Feature to Add a Student.
                    </Text>
                </Card>
            ))
        );
        const message = (status) =>(
            <Card appearance="filled" style={{opacity: 0.95, position:"absolute",top:0,alignSelf: 'center',justifyContent: 'center'}}>
                <Text status={status} style={{alignSelf: 'center',justifyContent: 'center', opacity: 0.95, fontSize: 16}}>
                    {this.state.displayMessage}
                </Text>
            </Card>
        );
        const addButton = () => {
                 return <View style={{justifyContent: 'center', alignItems: 'center', marginBottom:"8%"}}>
                <ButtonGroup>
                
                {/* <Button style={{width:"54%"}} accessoryLeft={addIcon} status="primary" onPress={() => this.props.navigation.navigate("AddStudentToTeamModal", {teamSeasonId: this.state.teamSeasonId})}>ENROLL STUDENT</Button>           */}
                </ButtonGroup>
                </View>
                
        };
        const loadingModal = () => (
            <Modal
                style={styles.popOverContent}
                visible={this.state.loadingModalstate}
                backdropStyle={styles.backdrop}>
                <Image source={this.LoadingGif()}/>
            </Modal>
        )
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
                    {message("basic")}
                    <Divider />

                    <ImageBackground source={getImage()} style={styles.image}>
                        {TopTabBar()}
                        {loadingModal()}
                        {helloMessage("info")}
                        {noMatch("basic")}
                        {emptyStudentsList("basic")}
                        {noMatchRegion("basic")}
                        {regionName("basic")}
                        {(this.state.selectedTabIndex === 1 ?
                            <List
                            style={{opacity: 0.95}}
                            data={this.state.studentList}
                            renderItem={studentItem}
                            ItemSeparatorComponent={Divider}
                            refreshControl={
                                <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                />
                            }
                            />
                             :
                             <List
                             style={{opacity: 0.95}}
                             data={this.state.activitiesRegion}
                             initialNumToRender={50}
                             renderItem={activityItem}
                             Divider={Divider}
                             refreshControl={
                                 <RefreshControl
                                 refreshing={refreshing}
                                 onRefresh={onRefresh}
                                 />
                             }
                            />
                        )}
                    </ImageBackground>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginBottom:"8%"}}>
                    {(this.state.selectedTabIndex === 1 ?
                        <Button style={{width:"80%", marginTop: "2%"}} accessoryLeft={addIcon} status="primary" onPress={() => this.props.navigation.navigate("AddStudentToTeamModal", {teamSeasonId: this.state.teamSeasonId, region: this.props.sessionScreen.region, enrolled: this.state.studentList})}>ENROLL STUDENT</Button>
                        :
                        <Button style={{width:"46%"}} status="primary" onPress={() => this.props.navigation.navigate("AddSessionModal", {teamSeasonId: this.state.teamSeasonId})}>+ ADD SESSION</Button>

                    )}
                    </View>
                    
                    {(this.state.selectedTabIndex === 0 ?
                    <BottomSheet isOpen sliderMinHeight={28} lineStyle={{marginTop:"3%"}}>
                        {searchBoxRanges()}
                        {/* {searchBox()} */}
                        {selectBox()}
                    </BottomSheet> :
                    null)}
                </Layout>      
           /* </View>     */                 
        );
    };
};

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user , sessionScreen: state.sessionScreen , sessionAttendance: state.sessionAttendance });
  
const ActionCreators = Object.assign( {}, { syncSessions, updateFirstTimeLoggedIn, changeTitle, changeTitleTeam } );
  
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