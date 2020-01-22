import React, {Component} from "react";
import { StyleSheet,Text,View,ScrollView,Keyboard,Image,TextInput,TouchableOpacity,Modal,TouchableHighlight,ToastAndroid} from 'react-native';

class TabQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textQuestion : "",
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    render() {
        const {arrQA, isMyPublication} = this.props;
        return (
            <View style={styles.container}>
                {arrQA && arrQA.length > 0 ? (
                    <>    
                    {arrQA.map((QA, index) => {
                        return (                           
                            <React.Fragment key={index}>
                                <View style={{marginLeft: 25}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={styles.subTitleText}>{QA.Name} {QA.CreationDate}</Text>                                      
                                    </View>
                                    <Text style={styles.questionText}>{QA.Question}</Text>
                                    <>
                                    {!QA.Answer && isMyPublication ? (
                                        <>
                                        <TouchableOpacity style={{elevation: 1}} onPress={() => this.props.triggerScreen({mode:"ANSWER", questionObj: QA })}>
                                            <Text style={styles.answerButtonText}>Responder</Text>   
                                        </TouchableOpacity>
                                        </>
                                        ) : (null)
                                    }
                                    
                                    </>                                  
                                
                                {QA.Answer ? (
                                    <View style={{marginLeft: 25}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subTitleText}>Respuesta {QA.Answer.CreationDate}</Text>
                                        </View>
                                        <Text style={styles.answerText}>{QA.Answer.Answer}</Text>
                                    </View>
                                ) : (null)}
                                </View>
                            </React.Fragment>                        
                        )
                    })}
                    </>
                ) : (
                        <Text style={styles.noQuestionsText}>Sin preguntas</Text>
                    )}

                    {isMyPublication ? (null) : (
                        <View style={{marginLeft: 25}}>
                            <Text style={styles.subTitleText}>Haga su consulta</Text>
                            <Text style={styles.infoText}>Nombre</Text>
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder='Nombre'
                                placeholderTextColor="#ffffff"
                                value={this.props.userData.Name || ""}
                                editable = {false}
                            />
                            <Text style={styles.infoText}>Consulta</Text>  
                            <TextInput style={styles.inputBox} 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value={this.state.textQuestion}
                                onChange ={this.onChange}
                                multiline = {true}
                                numberOfLines = {4}
                            />  
                            <TouchableOpacity style={styles.button} /*onPress ={ () => this.props.saveQuestion(this.state.textQuestion)}*/>
                                <Text style={styles.buttonText}>Consultar</Text>   
                            </TouchableOpacity> 
                        </View>    
                        )
                    }
                    
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2196f3',
        alignItems: 'flex-start',
    },
    titleText: {
        fontSize: 24, 
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
        paddingLeft: 25,
    },
    subTitleText: {
        fontSize: 16, 
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 20,
        marginBottom: 15,
    },
    infoText:{
        color: "#FFF",
    },
    noQuestionsText:{
        color: "#FFF",
        marginLeft: 25, 
        marginTop: 20,
    },
    inputBox: {
        width:300,
        backgroundColor:'rgba(255,255,255,0.3)',
        borderRadius: 25,
        paddingLeft: 25,
        fontSize: 16,
        color:'#ffffff',
        marginVertical: 10
    },
    questionText: {
      color: '#FFF',
    },
    answerText: {
      color: '#FFF',
    },
    buttonsView: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
      paddingLeft: 25,
    },
    button: {
        width:130,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 10,
        marginLeft: 20,
        elevation: 3,
    },
    button2: {
        width:170,
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0069c0',
        borderRadius: 15,
        marginVertical: 10,
        marginLeft: 25,
        elevation: 3,
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
    },
    answerButtonText: {
        fontSize:12,
        fontWeight:'500',
        color:'#ffffff',
    },
    destinations: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 30,
    },
});

export default TabQuestions;