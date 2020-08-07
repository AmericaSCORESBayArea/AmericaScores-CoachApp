import React, {Component} from "react";
import { Layout, Divider, List, ListItem, Icon, Text, Datepicker, Modal, Card, Button } from '@ui-kitten/components';
import { ImageBackground, View, StyleSheet } from "react-native";


import Axios from "axios";
import moment from "moment";

import {ApiConfig} from "./config/ApiConfig";

import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { updateFirstTimeLoggedIn } from "./Redux/actions/user.actions";
import { bindActionCreators } from 'redux';

class ActivitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment("20190821", "YYYYMMDD").toDate(),
            activities: "",
            welcomeModalVisibility: false,
        }
    }

    componentDidMount() {
        this._syncActivities();
        if (this.props.user.firstTimeLoggedIn) this.setState({welcomeModalVisibility: true});
        console.log(this.props.user);
    }

    _syncActivities() {
        const { route } = this.props;
        //Syncs activities from endpoint
        this.fetchActivities()
            .then(activitiesList => this._syncReduxActivities(activitiesList))    
            .then(() =>{
                //Check if we are in the team activities name
                if (route.name === "Team Activities" && route.params && route.params.teamSeasonId)
                    this.filterActivitiesByTeamSeasonId(route.params.teamSeasonId); // filter the activities for a specific team
            })
            .catch(error => console.log(error));
    }

    //Syncs activitiesToRedux and state
    _syncReduxActivities(activitiesList) {
        const { actions } = this.props;
        actions.syncSessions(activitiesList);
        this.setState({activities: activitiesList});
    }

    filterActivitiesByTeamSeasonId(teamSeasonId) {
        const activities = this.state.activities.filter(
            activity => { if (activity.Sessions) return activity.Sessions[0].TeamSeasonId === teamSeasonId; });
        this.setState({activities: activities});
    }

    async fetchActivities() {
        const { user } = this.props;
        return await Axios.get(`${ApiConfig.dataApi}/coach/${user.user.ContactId}/all`, {
            params: {
                // Hardcoded value, change the "2019-08-21" for this.state.date for getting the result in a specific date
                date: moment(this.state.date).format("YYYY-MM-DD")
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

    selectActivity(teamSeasonId) { this.props.navigation.navigate("Attendance", {teamSeasonId: teamSeasonId}) }

    toggleWelcomeModalOff() { 
        const { actions } = this.props;
        this.setState({welcomeModalVisibility: false})
        actions.updateFirstTimeLoggedIn();
    }

    render() {
        const CalendarIcon = (props) => ( <Icon {...props} name='calendar'/> );
        const renderItemIcon = (props) => (
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
                <Text  style={{alignSelf:"baseline"}}></Text>
                <Icon {...props} name='people-outline'/> 
                <Icon {...props} name='arrow-ios-forward-outline'/> 
            </View>
        );

        let activityItem = ({ item, index }) => {
            if (item.Sessions === null) return ;
            else {
                return <ListItem
                    title={`${item.Sessions[0].SessionTopic}`}
                    description={`${item.TeamSeasonName}`}
                    accessoryRight={renderItemIcon}
                    onPress={() => this.selectActivity(item.TeamSeasonId)}
            />
            }
        }

        const minDatePickerDate = moment("01/01/2019").toDate();

        const ItemDivider = (props) => <Divider {...props}/>

        const presentationModal = () => (
            <Modal visible={this.state.welcomeModalVisibility} style={styles.popOverContent} onBackdropPress={() => this.toggleWelcomeModalOff()}>
                <Card disabled={true} status="primary">
                    {
                        this.props.user.user &&
                        <Text style={{margin: 15}} category={'s1'}>Welcome {this.props.user.user.FirstName} {this.props.user.user.LastName}</Text>
                    }
                    <Button appearance='outline' size={'small'} onPress={() => this.toggleWelcomeModalOff()} status='primary'>
                        DISMISS
                    </Button>
                </Card>
            </Modal>
        );

        return(
            <ImageBackground source={require('../assets/ASBA_Logo.png')} style={{flex: 1}}>
                <Layout style={{ flex: 1, justifyContent: 'center', backgroundColor: "rgba(255,255,255,0.95)"}}>
                    <Datepicker
                        placeholder='Pick Date'
                        date={this.state.date}
                        min={minDatePickerDate}
                        style={{margin: "2%", }}
                        onSelect={nextDate => this.selectDate(nextDate)}
                        accessoryRight={CalendarIcon}
                    />
                    {presentationModal()}
                    <List
                        style={{backgroundColor: "rgba(0,0,0,0.0)"}}
                        data={this.state.activities}
                        renderItem={activityItem}
                    />
                </Layout>      
            </ImageBackground>                      
        );
    };
};

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user });
  
const ActionCreators = Object.assign( {}, { syncSessions, updateFirstTimeLoggedIn } );
  
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
    }
});