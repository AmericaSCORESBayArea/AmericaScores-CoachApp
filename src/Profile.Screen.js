import React, {Component, createRef} from "react";
import { Layout, Icon, Text, Button } from '@ui-kitten/components';
import {  TouchableOpacity, View, StyleSheet, Image, ScrollView, Platform, PermissionsAndroid } from "react-native";
import { Avatar,  Overlay } from "react-native-elements";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {launchCamera,launchImageLibrary} from 'react-native-image-picker';
import { connect } from 'react-redux';
import { syncSessions } from "./Redux/actions/Session.actions";
import { updateFirstTimeLoggedIn } from "./Redux/actions/user.actions";
import { bindActionCreators } from 'redux';
import { paletteColors } from './components/paletteColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        console.log(props.user)
        this._carousel = createRef();
        this.state = {
            firstName: this.props.user.user.FirstName,
            lastName: this.props.user.user.LastName,
            visibility: false,
            image: '',
            coloroverlayvisibility: false,
            selected: null,
            activeItem: '',
            activeSlide: 0,
            slider1Ref: '',
            changedColor:false,
        }
    }
    async componentDidMount() {
        let aux= await AsyncStorage.getItem('customTheme');
        let change= await this.setState({selected: JSON.parse(aux).id})
    }
    _renderItem = ({item, index}) => {
        const getImage = () =>{
            if(item.id === 0){
                return require('../assets/Sessions/Color0.jpeg');
            }else if (item.id === 1){
                return require('../assets/Sessions/Color1.jpeg');
            }else if (item.id === 2){
                return require('../assets/Sessions/Color2.jpeg');
            }else if (item.id === 3){
                return require('../assets/Sessions/Color3.jpeg');
            }else{
                return require('../assets/Sessions/Color4.jpeg');
            }
        }
        return (
           <React.Fragment>
               <ScrollView style={{flex:1}}>
                    <View style={{flexDirection:'row'}} >
                        <Text style={{alignSelf:'center',textAlign:'center',marginLeft:'30%', marginRight:'16%'}} category='h6'>Select a Theme</Text>
                        <TouchableOpacity style={{alignSelf:'flex-end',marginTop: '1%', marginLeft:'3%'}} onPress={() => this.setState({coloroverlayvisibility: false, activeSlide:0})}>
                            <EvilIcons name={'close'} size={30} color={'#5D738B'} />
                        </TouchableOpacity>
                    </View>
                        <Image source={getImage()} style={{height:350, width:300,resizeMode:'contain',alignSelf:'center'}}/>
                    <View style={{marginTop:2}}>
                        <View
                            style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                            marginBottom:'5%',
                            marginLeft:'1%',
                            marginRight:'1%'
                            }}
                        />
                        <View style={{backgroundColor: item.color1, width: 100, height: 40, alignSelf:'center'}} />
                        <View style={{backgroundColor: item.color2, width: 100, height: 40, alignSelf:'center'}} />
                        <View style={{backgroundColor: item.color3, width: 100, height: 40, alignSelf:'center'}} />
                    </View>
                </ScrollView>
            </React.Fragment>
        );
    }
    get pagination () {
        const { activeSlide } = this.state;
        return (
            <Pagination
                dotsLength={paletteColors.length}
                activeDotIndex={activeSlide}
                carouselRef={this._carousel}
                tappableDots={!!this._carousel}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)'
                }}
                inactiveDotStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.75)'
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }
    onPressChangeTheme = () =>{
        this.setState({selected: this.state.activeSlide}),
        setTimeout(() => (this.setState({changedColor: true})), 500);
        setTimeout(() => {this.setState({changedColor: false})}, 3500);
        paletteColors.map(async(value) => {
            if(value.id === this.state.activeSlide){
                await AsyncStorage.setItem('customTheme',JSON.stringify(value));
                //let aux= await AsyncStorage.getItem('customTheme')
                //console.log(JSON.parse(aux).id)
                //await AsyncStorage.removeItem('customTheme');
            }
        })
    }
    containerColor() {
        if(this.state.selected === 0){
            return '#3D7C99'
        }else if(this.state.selected === 1){
            return '#2179ad'
        }else if(this.state.selected === 2){
            return '#1F0318'
        }else if(this.state.selected === 3){
            return '#172B52'
        }else if(this.state.selected === 4){
            return '#482728'
        }else{
            return "#3D7C99"
        }   
    }
    render() {
        const cameraIcon = (props) => ( <Icon {...props} name='camera-outline'/> );
        const editIcon = (props) => ( <Icon {...props} name='color-palette-outline' />);
        const checkboxPassive = (props) => ( <Icon {...props} name='checkmark-square-2-outline' fill= '#808080' style={{height:50, width:50}}/> );
        const checkboxActive = (props) => ( <Icon {...props} name='checkmark-square-2-outline' fill= '#4CBB17' style={{height:50, width:50}}/> );
        const saveCameraImage = () => {
            let options = {
                storageOptions: {
                    mediaType:'photo',
                    cameraType:'front',
                    path: 'images',
                },
            };
            launchCamera(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                }  else {
                    this.setState({image:response})
                }
            });
        }
        const requestCameraPermission = async () => {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                  title: "App Camera Permission",
                  message:"App needs access to your camera ",
                  buttonNeutral: "Ask Me Later",
                  buttonNegative: "Cancel",
                  buttonPositive: "OK"
                }
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Camera permission given");
                saveCameraImage();
              } else {
                console.log("Camera permission denied");
              }
            } catch (err) {
              console.warn(err);
            }
        };
        const getImage = () =>{
            return require('../assets/user.png');
        };
        const chooseImage = () => {
            this.setState({visibility:false})
            let options = {
                storageOptions: {
                  skipBackup: true,
                  path: 'images',
                  },
            };
            launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
               this.setState({image:response})
               console.log(response)
            }
            });
        }
        const openCamera = () => {
            this.setState({visibility:false})
            if(Platform.OS === 'ios'){
                saveCameraImage();
            }else{
                requestCameraPermission();
            }
        }
        return(
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ backgroundColor: this.containerColor(),height: 290,width: '95%',marginTop: '6%',marginBottom: '2.5%',borderRadius:15,alignSelf: 'center'}}>
                        <Avatar
                            size="xlarge"
                            rounded
                            ImageComponent={() => (
                                this.state.image.length === 0?
                                <Image
                                resizeMode="cover"
                                style={{
                                    height: 145,
                                    width: 145,
                                    borderRadius: 15,
                                    position: 'absolute',
                                }}
                                source={getImage()}
                                />:
                                <Image
                                resizeMode="cover"
                                style={{
                                    height: 145,
                                    width: 145,
                                    borderRadius: 15,
                                    position: 'absolute',
                                }}
                                source={{uri: (this.state.image).assets[0].uri}}
                                />
                            )}
                            overlayContainerStyle={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 2,
                                borderColor: 'white',
                                borderStyle:'solid'
                            }}
                            activeOpacity={0.7}
                            iconStyle={{ borderColor: 'white',borderStyle:'solid' }}
                            containerStyle={{ borderColor: 'white', borderStyle:'solid', alignSelf:'center', marginTop:'5%'}}
                        />
                        <Layout style={{ flexDirection: 'row',flexWrap: 'wrap', alignSelf:'center', marginTop:'5%',backgroundColor: this.containerColor() }}>
                            <Button appearance='outline' accessoryRight={cameraIcon} style={{backgroundColor: 'white'}} onPress={() => this.setState({visibility: true})} />
                            <Button appearance='outline' accessoryRight={editIcon}  style={{backgroundColor: 'white',marginLeft:'5%'}} onPress={() => this.setState({coloroverlayvisibility: true})} />
                        </Layout>
                        <Text style={{color: 'white', alignSelf:'center', marginTop:'5%'}}>{this.state.firstName} {this.state.lastName}</Text>
                    </View>
                    <Overlay isVisible={this.state.visibility} overlayStyle={styles.overlay} onBackdropPress={() => this.setState({visibility: false})}>
                        <TouchableOpacity onPress={openCamera} >
                            <View style={{flexDirection:'row'}}>
                                <Icon style={styles.icon}  fill='#8F9BB3' name='camera-outline'/>
                                <Text style={styles.optionsTitle}>Take a picture</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={chooseImage} >
                            <View style={{flexDirection:'row'}}>
                                <Icon style={styles.icon}  fill='#8F9BB3' name='image-outline'/>
                                <Text style={styles.optionsTitle}>Upload an image</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({image:''})} >
                            <View style={{flexDirection:'row'}}>
                                <Icon style={styles.icon}  fill='#8F9BB3' name='trash-2-outline'/>
                                <Text style={styles.optionsTitle}>Delete image</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({visibility: false})}>
                            <View style={{flexDirection:'row'}}>
                                <Icon style={styles.icon}  fill='#8F9BB3' name='close-square-outline'/>
                                <Text style={styles.optionsTitle}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                    </Overlay>
                    <Overlay isVisible={this.state.coloroverlayvisibility} overlayStyle={styles.overlayColors} onBackdropPress={() => this.setState({coloroverlayvisibility: false})}>
                        <View style={{alignSelf:'center'}}>
                            <Carousel
                                ref={this._carousel}
                                data={paletteColors}
                                renderItem={this._renderItem}
                                sliderWidth={300}
                                itemWidth={300}
                                onSnapToItem={(index,item) => this.setState({ activeSlide: index}) }
                                //slideStyle={{alignSelf:'center'}}
                                layout={'default'}
                                //hasParallaxImages={true}
                            />
                            <View>
                                {
                                    this.state.changedColor?
                                    <View style={{flexDirection:'row', marginTop:'4%',alignSelf:'center'}}>
                                        <Icon style={styles.icon}  name='checkmark-circle-outline' fill='#4CBB17'/>  
                                        <Text style={{color:'#4CBB17',marginTop:'2%', marginLeft:'2%'}}>THEME CHANGED!</Text>
                                    </View>:<></>
                                }
                                {this.state.selected === this.state.activeSlide ?
                                    <Button appearance='ghost' accessoryRight={checkboxActive} style={{backgroundColor: 'white', alignSelf:'center'}} />
                                    :
                                    <Button appearance='ghost' accessoryRight={checkboxPassive} style={{backgroundColor: 'white', alignSelf:'center'}} onPress={this.onPressChangeTheme}/>
                                }  
                            </View>
                            { this.pagination }
                        </View>
                    </Overlay>
                </ScrollView>
            </View>                      
        );
    };
};

const mapStateToProps = state => ({ sessions: state.sessions, user: state.user,  sessionScreen: state.sessionScreen });
  
const ActionCreators = Object.assign( {}, { syncSessions, updateFirstTimeLoggedIn } );
  
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ActionCreators, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

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
        resizeMode: 'contain',
        opacity: 0.99
    },
    overlay: {
        width: '80%',
        height: '22%',
        alignSelf:'center'
    },
    overlayColors: {
        width: '90%',
        height: '90%',
        alignSelf:'center'
    },
    optionsTitle :{
        marginTop: '2%',
        color: '#5D738B',
        marginLeft:'2%',
    },
    icon: {
        width: 28,
        height: 28,
        marginTop:3
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
    },
});