import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TextInput, TouchableOpacity} from 'react-native';

class ReservationReqInfo extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const screenConfig = navigation.getParam('screenConfig', 'default value');
        this.state = {
            modal: false,
            optionalData: {},
            textboxValue: "",
            isLoading : false,
            buttonIsDisabled: false,
            screenConfig: screenConfig,
        };
        this.toggle = this.toggle.bind(this);
        this.save = this.save.bind(this);
        this.changeModalLoadingState = this.changeModalLoadingState.bind(this);
    }

    toggle(optionalData) {
        if(optionalData){
            this.setState({
                modal: !this.state.modal,
                optionalData: optionalData
            });
        }else{
            if(!this.state.isLoading){
                this.setState({
                    modal: !this.state.modal
                });
            }
        }
    }

    changeModalLoadingState(closeModal){
        if(closeModal){
            this.setState({
                modal: !this.state.modal,
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        }else{
            this.setState({
                isLoading: !this.state.isLoading,
                buttonIsDisabled: !this.state.buttonIsDisabled
            })
        }
    }

    save() {
        if(this.props.modalConfigObj.saveFunction){
            this.props.triggerSaveModal(this.props.modalConfigObj.saveFunction,{optionValue:this.state.optionValue, textboxValue:this.state.textboxValue })
        }else{
            this.props.modalSave(this.state.textboxValue);
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
          })
    }

    render() {
        return (
            <>
                {this.state.screenConfig ? (
                    <View style={styles.container}>
                        <Text style={styles.titleText}>{this.state.screenConfig.title}</Text>
                        <Text style={styles.infoText}>{this.state.screenConfig.mainText}</Text>
                        {this.state.screenConfig.textboxDisplay ? 
                        (
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder={this.state.screenConfig.textboxLabel}
                                placeholderTextColor="#ffffff"
                                onChangeText={this.handleInput}
                                value={this.state.textboxValue}
                            />
                        ) : (null)}
                    
                        
                        {this.state.screenConfig.login_status == 'LOGGED_IN' ? (
                            <View style={{flexDirection: 'row'}}>
                                {this.state.screenConfig.cancelAvailable == true ? (<TouchableOpacity style={styles.button} onPress={()=> {this.props.navigation.goBack()}}> 
                                                                                        <Text style={styles.buttonText}>{this.state.screenConfig.cancelText}</Text>
                                                                                    </TouchableOpacity>
                                                                                   ) : (null)
                                }                                                    
                                {this.state.screenConfig.confirmAvailable == true ? (<TouchableOpacity style={styles.button} /*onPress={()=> {this.save}}*/> 
                                                                                        <Text style={styles.buttonText}>{this.state.screenConfig.confirmText}</Text>
                                                                                     </TouchableOpacity>
                                                                                    ) : (null)
                                }
                            </View>
                        ) : (null)}    
                    </View>
                ) : (null)}                
            </>   
        );
    }
        
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText:{
    fontSize: 32, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 20,
    marginBottom: 5,
  },
  subTitleText:{
    fontSize: 20, 
    fontWeight: 'bold',
    color: "#FFF",
    marginBottom: 5,
  },
  infoText:{
    color: "#FFF",
  },
  inputBox: {
    width:300,
    backgroundColor:'rgba(255,255,255,0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:100,
    height:30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#0069c0',
    borderRadius: 15,
    marginVertical: 20,
    elevation: 3,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff'
  },
});

export default ReservationReqInfo;