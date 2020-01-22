import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, ToastAndroid, Picker, SafeAreaView} from 'react-native';
import { Header } from 'react-native-elements';

import Globals from '../Globals';

import SearchSpaceList from '../components/SearchSpaceList';

class SearchPublications extends React.Component {
	constructor(props) {
        super(props);
        const { navigation } = this.props;
        const spaceTypeSelectParam = JSON.stringify(navigation.getParam('spaceTypeSelect', 'default value'));//props.match.params.publicationID;
        const cityParam = navigation.getParam('city', 'default value');
        const capacityParam = navigation.getParam('capacity', 'default value');
        console.log("params: " + spaceTypeSelectParam)
        this.state = { 
            list: 'active',
            publications : [],
            facilities : [],
            spaceTypes : [],
            spacetypeSelected : spaceTypeSelectParam == "empty" ? "" : spaceTypeSelectParam,
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
            facilitiesSelected : []
        };
        this.loadInfraestructure = this.loadInfraestructure.bind(this);		
        this.loadSpaceTypes = this.loadSpaceTypes.bind(this);
        this.startSearch = this.startSearch.bind(this);
        //this.redirectToPub = this.redirectToPub.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }
    
    handleErrors(error){
        this.setState({ generalError: true });
        console.log("ERROR:");
        console.log(error);
    }

    onSelectionsChangePubPerPage = (itemValue,itemIndex) => {
        this.setState({publicationsPerPage:itemValue})
    }

    onChange = (e) => {
        const targetId = e.target.label;
        this.setState({
            [targetId]: e.target.value
        }, () =>{
            if(targetId == "publicationsPerPage" || targetId == "currentPage" || targetId == "facilitiesSelected" || targetId == "spacetypeSelected"){
                this.startSearch();
            }
        });
    }
    
    componentDidMount() {
        this.loadInfraestructure();
        this.loadSpaceTypes();
    }

    componentWillReceiveProps(newProps) {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.spacetypeSelected !== this.state.spacetypeSelected) {
        this.handleUpdateName();
        }
    }

    handleUpdateName = () => {
        this.setState({ spacetypeSelected: this.spaceTypeSelectParam })
    }

    /*redirectToPub(id){
        this.props.history.push('/publications/viewPublication/viewPublication/'+id);
    }*/

    startSearch() {
        var objToSend = {}
        var fetchUrl = Globals.baseURL + '/publications';
        var method = "POST";

        var objToSend = {
            "SpaceType": this.state.spacetypeSelected,
            "Capacity": this.state.capacity,
            "State": "ACTIVE",
            "City": this.state.city,
            "PageNumber" : parseInt(this.state.currentPage)-1,
            "PublicationsPerPage": parseInt(this.state.publicationsPerPage)
        }
        if(this.state.facilitiesSelected.length > 0){
            objToSend.Facilities = this.state.facilitiesSelected;
        }
        console.log("startSearch:");
        console.log(JSON.stringify(objToSend));
        this.setState({ publicationsLoaded: false });
        fetch(fetchUrl, {
            method: method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objToSend)
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data.responseCode == "SUCC_PUBLICATIONSOK") {
                let newTotalPages = Math.round(parseFloat(data.TotalPublications/this.state.publicationsPerPage));
                let newPagination = [];
                for(var i=1;i<=newTotalPages;i++){
                    newPagination.push(i);
                }
                this.setState({ publicationsLoaded: true, publications:data.Publications, 
                    totalPublications:data.TotalPublications,totalPages:newTotalPages, pagination: newPagination });
            } else {
                this.handleErrors(data.responseCode || "Generic error");
            }
        }
        ).catch(error => {
            this.handleErrors(error);
        }
        )
    }

    loadInfraestructure() {
        try {
            fetch(Globals.baseURL + '/facilities').then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_FACILITIESOK") {
                    this.setState({ facilities: data.facilities });
                } else {
                    ToastAndroid.showWithGravity(
                        'Internal error',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                    );
                }
            }
            ).catch(error => {
                this.handleErrors(error || "Generic error");
            }
            )
        } catch (error) {
            this.handleErrors(error);
        }
    }

    loadSpaceTypes() {
        try {
            fetch(Globals.baseURL + '/spaceTypes'
            ).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_SPACETYPESOK") {
                    console.log("Space para search: " + JSON.stringify(data));
                    if(this.state.spacetypeSelected == ""){
                        var newSpaceTypeSelected = data.spaceTypes[0].Code;
                        var spaceTypeSelectedText = data.spaceTypes.filter(function(st){
                            return parseInt(st.Code) === parseInt(newSpaceTypeSelected);
                        });
                        this.setState({ spaceTypes: data.spaceTypes, spacetypeSelected: newSpaceTypeSelected, spaceTypesLoaded: true, spaceTypeSelectedText: spaceTypeSelectedText[0].Description },
                                        () => {this.startSearch();})
                    }else{
                        let sts = this.state.spacetypeSelected;
                        var spaceTypeSelectedText = data.spaceTypes.filter(function(st){
                            return parseInt(st.Code) === parseInt(sts);
                        });
                        if(!spaceTypeSelectedText){
                            spaceTypeSelectedText = data.spaceTypes[0].Description;
                            this.setState({ spacetypeSelected: data.spaceTypes[0].Code})
                        }
                        this.setState({ spaceTypes: data.spaceTypes, spaceTypesLoaded: true, spaceTypeSelectedText: spaceTypeSelectedText[0].Description || "" },
                            () => {this.startSearch();})
                    }
                } else {
                    this.handleErrors(data.responseCode || "Generic error");

                }
            }
            ).catch(error => {
                this.handleErrors(error || "Generic error");

            }
            )
        } catch (error) {
            this.handleErrors(error || "Generic error");
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>{this.state.spaceTypeSelectedText}</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.descriptionText}>Ordenar por: </Text>
                    <Picker
                        style={styles.pickerBoxOrder}
                        //selectedValue={this.props.parentState.spaceTypeSelect}
                        //onValueChange={this.onChange}
                        >  
                        <Picker.Item value={1} label={'Defecto'}/>
                        <Picker.Item value={2} label={'Menor Precio'}/>
                        <Picker.Item value={3} label={'Mayor Precio'}/>
                    </Picker>
                    <Text style={styles.descriptionText}>Mostrar: </Text>
                    <Picker
                        style={styles.pickerBoxShow}
                        selectedValue={this.state.publicationsPerPage}
                        onValueChange={this.onSelectionsChangePubPerPage}
                        >
                        <Picker.Item value={10} label={'10'}/>
                        <Picker.Item value={30} label={'30'}/>
                        <Picker.Item value={50} label={'50'}/>
                    </Picker>
                </View>
                {parseInt(this.state.publications.length) === 0 ? (
                    <Text style={styles.subtitleText}>No se encontraron publicaciones</Text>
                ) : (/*<View style={styles.scrollContainer}>*/
                        <ScrollView vertical={true}
                                    contentContainerStyle={styles.scrollContainer}
                        >
                            <SearchSpaceList /*redirectToPub={this.redirectToPub}*/ publications = {this.state.publications} navigate={this.props.navigation.navigate}/>
                            <Text style={styles.descriptionText}>Mostrando {this.state.publications.length} publicaciones de {this.state.totalPublications}</Text>
                        </ScrollView>
                     /*</View>*/
                    )
                }    
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  scrollContainer: {
    //paddingTop: 10,
    alignItems: 'center',
  },
  titleText:{
    fontSize: 32, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 40,
    //marginLeft: 20,
    marginBottom: 10,
  },
  subtitleText:{
    fontSize: 24, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 20,
    //marginLeft: 20,
    marginBottom: 10,  
  },
  descriptionText: {
    color: '#FFF',
    marginLeft: 25,
    marginTop: 10,
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
});

export default SearchPublications;