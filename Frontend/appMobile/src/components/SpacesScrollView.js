import React, {Component} from 'react';
import {View,Text,Image,StyleSheet} from 'react-native';

export default class SpacesScrollView extends Component {

    render (){
        const { Capacity, Title, IdPublication, ImagesURL, City} = this.props;
        //const { relatedPublications } = this.props;
        return (
                <View style={styles.spacesContainer}>
                    <View style={styles.imageView}>
                        <Image style={styles.image} source={{uri: ImagesURL[0]}}/>
                    </View>
                    <View style={styles.textView}>
                        <Text style={{color: 'white'}}>{Title}</Text>
                        <Text style={{color: 'white'}}>{City}</Text>
                        <Text style={{color: 'white'}}>{Capacity}</Text>
                    </View>
                </View>    
        );
    }

        //return null;
}

const styles = StyleSheet.create({
    image:{
        width: 160,
        height: 130,  
        borderRadius: 20,
    },
    spacesContainer:{
        //height: 220, 
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

});