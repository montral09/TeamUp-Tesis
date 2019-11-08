import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';

export default class UserTypeSelector extends Component<{}>{
    state = {
        active: null,
    }

    handleType = id => {
        const { active } = this.state;
        this.setState({ active: active === id ? null : id });
    }

    render(){
        const { active } = this.state;
        return(
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => this.handleType('usuario')}
                    style={active === 'usuario' ? styles.activeBorder : null}
                >
                    <View style={[styles.selectContainer, active === 'usuario' ? styles.activeBorder : null]}>
                        {
                            active === 'usuario' ? (
                                <View style={styles.tickView}>
                                    <Image style={{width: 14, height: 14}}
                                        source={require('../images/Tick.png')}
                                    />
                                </View>
                            ) : null
                        }
                        <View style={styles.iconContainer}>
                            <Image style={{width:32, height: 32}}
                                source={require('../images/Usuario.png')}
                            /> 
                        </View>  
                        <Text style={styles.selectText}>
                            Busco alquilar espacios 
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => this.handleType('gestor')}
                    style={active === 'gestor' ? styles.activeBorder : null}
                >
                    <View style={[styles.selectContainer, active === 'gestor' ? styles.activeBorder : null]}>
                        {
                            active === 'gestor' ? (
                                <View style={styles.tickView}>
                                    <Image style={{width: 14, height: 14}}
                                        source={require('../images/Tick.png')}
                                    />
                                </View>
                            ) : null
                        }
                        <View style={styles.iconContainer}>
                            <Image style={{width:38, height: 38}}
                                source={require('../images/Gestor.png')}
                            />
                        </View>
                        <Text style={styles.selectText}>
                            Busco publicar espacios
                        </Text> 
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

} 

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
        paddingVertical: 15,
        //alignItems: 'center',
        justifyContent: 'flex-end',
        //backgroundColor: 'white',
    },
    selectContainer: {
        flexDirection: 'column',
        elevation: 3,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginRight: 18,
        marginLeft: 18,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#0069c0',
        paddingVertical: 15,
    },
    selectText: {
        fontSize: 14,
        paddingHorizontal: 5,
        color: 'white',
    },
    iconContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginTop: 3,
        marginBottom: 3,
        marginLeft: 3,
        marginRight: 3,
        backgroundColor: 'white',
    },
    tickView: {
        width: 25,
        height: 25,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        position: 'absolute',
        right: -8,
        top: -8,
    },
    activeBorder: {
        elevation: 1,
        borderColor: 'white',
    }
 });