import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Picker, Dimensions} from 'react-native';
import { Header } from 'react-native-elements';
import { Ionicons } from "@expo/vector-icons";
import { connect } from 'react-redux';
import { callAPI } from '../common/genericFunctions';
import SelectMultiple from 'react-native-select-multiple';
import translations from '../common/translations';
import SearchSpaceList from '../components/SearchSpaceList';

const renderLabel = (label, style) => {
    return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{marginLeft: 10}}>
        <Text style={{color: 'white'}}>{label}</Text>
        </View>
    </View>
    )
}

class SearchPublications extends Component {
	constructor(props) {
        super(props);
        const { navigation } = this.props;
        const spaceTypeSelectParam = navigation.getParam('spaceTypeSelect', 'default value');
        const cityParam = navigation.getParam('city', 'default value');
        const capacityParam = navigation.getParam('capacity', 'default value');
        this.state = { 
            list: 'active',
            publications : [],
            facilities : [],
            spaceTypes : [],
            spacetypeSelected : spaceTypeSelectParam,
            spaceTypeSelectedText : "",
            capacity : capacityParam == "empty" ? "" : capacityParam,
            city : cityParam  == "empty" ? "" : cityParam,
            totalPublications : 10,
            spaceTypesLoaded : false,
            publicationsLoaded : false,
            currentPage : 1,
            totalPages : 1,
            publicationsPerPage : 10,
            pagination : [1],
            generalError : false,
            facilitiesSelected : [],
            facilitiesSelectMultiple: [],
            filterVisible: false,
        };
    }
    
    onChange = (e) => {
        const targetId = e.target.id;
        this.setState({
            [targetId]: e.target.value
        }, () =>{
            if(targetId == "publicationsPerPage" || targetId == "currentPage" || targetId == "facilitiesSelected" || targetId == "spacetypeSelected"){
                //this.startSearchMP();
            }
        });
    }
    
    componentDidMount() {
        this.loadInfraestructureMP();
        this.loadSpaceTypesMP();
    }

    loadInfraestructureMP = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/facilities";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_FACILITIESOK : '',
        };
        objApi.functionAfterSuccess = "loadInfraestructureMP";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }

    loadSpaceTypesMP = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/spaceTypes";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_SPACETYPESOK : '',
        };
        objApi.functionAfterSuccess = "loadSpaceTypesMP";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }

    startSearchMP = () => {
        var objApi = {};
        objApi.objToSend = {
            "SpaceType": this.state.spacetypeSelected,
            "Capacity": this.state.capacity,
            "State": "ACTIVE",
            "City": this.state.city,
            "PageNumber" : parseInt(this.state.currentPage)-1,
            "PublicationsPerPage": parseInt(this.state.publicationsPerPage)
        }
        if(this.state.facilitiesSelected.length > 0){
            objApi.objToSend.Facilities = this.state.facilitiesSelected;
        }
        objApi.fetchUrl = "api/publications";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK : '',
        };
        objApi.functionAfterSuccess = "startSearchMP";
        objApi.errorMSG= {}
        this.setState({ publicationsLoaded: false });
        this.setState({filterVisible:false})
        let sts = this.state.spacetypeSelected;
        var spaceTypeSelectedTextNew = this.state.spaceTypes.filter(function(st){
            return parseInt(st.Code) === parseInt(sts);
        });
        this.setState({spaceTypeSelectedText:spaceTypeSelectedTextNew[0].Description})
        callAPI(objApi, this);
    }

    handleOnPress(){
        if (this.state.filterVisible) {
            this.setState({filterVisible:false});
        }else{
            this.setState({filterVisible:true});
        }
    }

    onSelectionsChange = (facilitiesSelectMultiple) => {
        // selectedFacilities is array of { label, value }
        this.setState({facilitiesSelectMultiple})
        var newFacilities = [];
        facilitiesSelectMultiple.map((y) => {
            return newFacilities.push(y.value)
        })
        this.setState({facilitiesSelected:newFacilities})
    }

    onSelectionsChangeSpace = (itemValue,itemIndex) => {
        this.setState({spacetypeSelected:itemValue})
    }

    getInfraList = () => {
        var obj = {value: null, label: null}
        var newArray = []
        this.state.facilities.map((facility) => {
        return (obj = {value: facility.Code, label: facility.Description},
        newArray.push(obj) // Push the object
        );
        
        })
        this.setState({ facilities: newArray });
    }

    render() {
        const { systemLanguage } = this.props;
        return (
            <>
                {this.state.spaceTypesLoaded === true && this.state.publicationsLoaded === true ? (
                    <>
                    <View style={styles.container}>   
                        <Header
                            rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
                        />
                        <Text style={styles.titleText}>{this.state.spaceTypeSelectedText}</Text>
                        <View style={{flexDirection: 'row', width: Dimensions.get('window').width - 20}}>
                            <Text style={styles.descriptionText}>{translations[systemLanguage].messages['sortBy_w']}: </Text>
                            <Picker
                                style={styles.pickerBoxOrder}
                                //selectedValue={this.props.parentState.spaceTypeSelect}
                                //onValueChange={this.onChange}
                                >  
                                <Picker.Item value={1} label={translations[systemLanguage].messages['default_w']}/>
                                
                            </Picker>
                            <Text style={styles.descriptionText}>{translations[systemLanguage].messages['show_w']}: </Text>
                            <Picker
                                style={styles.pickerBoxShow}
                                selectedValue={this.state.publicationsPerPage}
                                onValueChange={this.onChange}
                                >
                                <Picker.Item value={10} label={'10'}/>
                                <Picker.Item value={30} label={'30'}/>
                                <Picker.Item value={50} label={'50'}/>
                            </Picker>
                            <TouchableOpacity
                                style={{marginLeft: 10}}
                                onPress={() => {
                                this.handleOnPress();
                                }}>
                                <Ionicons name="ios-options" size={40} color="white"/>
                            </TouchableOpacity> 
                        </View>
                        <ScrollView vertical={true}            
                            contentContainerStyle={styles.scrollContainer}
                        >
                        {this.state.filterVisible === true ? (
                            <>
                                <Picker
                                    style={styles.pickerBox}
                                    selectedValue={this.state.spacetypeSelected}
                                    onValueChange={this.onSelectionsChangeSpace}
                                >
                                    {
                                        this.state.spaceTypes.map((space, key) => {
                                            return (<Picker.Item key={key} value={space.Code} label={space.Description} />);
                                        })
                                    }  
                                </Picker>
                                <View style={{width:300}}>
                                    <SelectMultiple
                                        items={this.state.facilities}
                                        renderLabel={renderLabel}
                                        rowStyle={{backgroundColor: '#2196f3'}}
                                        checkboxSource={require('../images/facilityNotSelected.png')}
                                        checkboxStyle={{width: 20, height: 20}}
                                        selectedCheckboxSource={require('../images/facilitySelected.png')}
                                        selectedCheckboxStyle={{width: 20, height: 20}}
                                        selectedItems={this.state.facilitiesSelectMultiple}
                                        onSelectionsChange={this.onSelectionsChange} 
                                    />
                                </View>
                                <TouchableOpacity style={styles.button} onPress={this.startSearchMP}><Text style={styles.buttonText}>Filtrar</Text></TouchableOpacity>
                            </>
                        ) : (null)
                        }
                        {parseInt(this.state.publications.length) === 0 ? (
                            <Text style={styles.subtitleText}>{translations[systemLanguage].messages['searchNo_pubs']}</Text>
                        ) : (   
                                <>
                                    <SearchSpaceList publications={this.state.publications} navigate={this.props.navigation.navigate}/>
                                    {this.state.pagination.map((page) => {
                                        return (
                                            <>
                                                
                                                <TouchableOpacity style={styles.button} key={page} onClick={() => this.onChange({target:{id:'currentPage',value:page}})}><Text style={styles.buttonText}>{page}</Text></TouchableOpacity>
                                            </>
                                        );
                                    })}
                                    <Text style={styles.descriptionText}>{translations[systemLanguage].messages['showing_w']} {this.state.publications.length} {translations[systemLanguage].messages['publicationsLC_w']} {translations[systemLanguage].messages['of_w']} {this.state.totalPublications}</Text>
                                </>
                            )
                        }   
                        </ScrollView> 
                    </View>
                    </>
                ) : 
                (<ActivityIndicator
                    animating = {true}
                    color = 'white'
                    size = "large"
                    style = {styles.activityIndicator}
                />)
            }
            </>     
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
    alignItems: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
  },
  titleText:{
    fontSize: 32, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 40,
    marginBottom: 10,
  },
  subtitleText:{
    fontSize: 24, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 20,
    marginBottom: 10,  
  },
  descriptionText: {
    color: '#FFF',
    marginLeft: 10,
    marginTop: 10,
  },
  pickerBox: {
    width:300,
    backgroundColor:'rgba(255,255,255,0.3)',
    color:'#ffffff',
    marginVertical: 10
  },
  pickerBoxOrder: {
    width: 120,
    height: 20,
    backgroundColor:'rgba(255,255,255,0.3)',
    color:'#ffffff',
    marginVertical: 10
  },
  pickerBoxShow: {
    width: 40,
    height: 20,
    backgroundColor:'rgba(255,255,255,0.3)',
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width: 130,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0069c0',
    borderRadius: 15,
    marginVertical: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff'
  },
  activityIndicator: {
    flex: 1,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
});

const mapStateToProps = (state) => {
    return {
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(SearchPublications);

//{this.state.currentPage === page ? ('active') : ('')} 