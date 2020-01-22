import React, {Component} from "react";
import { StyleSheet,Text,View,ScrollView,Keyboard,Image,TextInput,TouchableOpacity,Modal,TouchableHighlight,ToastAndroid} from 'react-native';

import Stars from '../components/StarRating';

class TabReviews extends Component{
   
    render() {
        const {reviews} = this.props;
        return (
            <View style={{marginLeft: 25, marginTop: 20}}>
                {reviews && reviews.length > 0 ? (
                    <>
                        {reviews.map((review, index) => {
                            return (
                                <React.Fragment key={index}> 
                                    <Text style={styles.subTitleText}>{review.Name} {review.date}</Text>
                                    <Stars
                                        votes={review.Rating}
                                        size={18}
                                        color='white'
                                    />
                                    <Text style={styles.infoText}>{review.Review}</Text>
                                </React.Fragment>
                            )
                        })}
                    </>
                ) : (
                <Text style={styles.infoText}>Sin reseñas</Text>
                )}
            </View>
        )
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
    destinations: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 30,
    },
});

export default TabReviews;