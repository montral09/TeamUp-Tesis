import React, {Component} from 'react';
import {View,Text,Image,StyleSheet,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from "@expo/vector-icons";
import translations from '../common/translations';

class SpacesScrollView extends Component {

    render (){
        const { systemLanguage } = this.props;
        const { Capacity, Title, IdPublication, ImagesURL, City, type} = this.props;
        return (
                <View style={styles.spacesContainer}>
                    <View style={styles.imageView}>
                        <Image style={styles.image} source={{uri: ImagesURL[0]}}/>
                    </View>
                    <View style={styles.textView}>
                        <Text style={{color: 'white'}}>{Title}</Text>
                        <View style={{flexDirection:'row'}}>
                            <Ionicons name="ios-home"
                                color="#fff"
                                size={20}
                            />
                            <Text style={{color: 'white', marginLeft: 5}}>{City}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Ionicons name="ios-people"
                                color="#fff"
                                size={20}
                            />
                            <Text style={{color: 'white', marginLeft: 5}}>{Capacity}</Text>
                        </View>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        {type === 'recommended' ? (
                                <TouchableOpacity style={styles.button} onPress={()=>this.props.navigate('SpaceView', {PubId: IdPublication})}> 
                                    <Text style={styles.buttonText}>{translations[systemLanguage].messages['view_w']}</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.button} onPress={()=>this.props.push('SpaceView', {PubId: IdPublication})}> 
                                    <Text style={styles.buttonText}>{translations[systemLanguage].messages['view_w']}</Text>
                                </TouchableOpacity>
                            )
                        }  
                    </View>
                </View>    
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemLanguage: state.loginData.systemLanguage
    }
}

export default connect(mapStateToProps)(SpacesScrollView)

const styles = StyleSheet.create({
    image:{
        width: 160,
        height: 130,  
        borderRadius: 20,
    },
    spacesContainer:{
        width: 160,
        elevation: 3,
        borderWidth: 0.5,
        borderColor: '#0069c0',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
    },
    imageView:{
        flex: 2, 
    },
    textView:{
        flex: 1,
        paddingLeft: 10,
        paddingTop: 10,
        color: 'white',
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
        paddingHorizontal: 5,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff'
    },

});