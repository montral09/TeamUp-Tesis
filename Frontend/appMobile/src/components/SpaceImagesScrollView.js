import React, {Component} from 'react';
import {View,ScrollView,Image,StyleSheet,Dimensions} from 'react-native';

export default class SpaceImages extends Component {
    constructor(props) {
        super(props);
    
    }

    render (){
        
        //if (this.props.ImagesURL && this.props.ImagesURL.length){
            return (
                <View style={styles.scrollContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0}
                        scrollEventThrottle={16}
                        snapToAlignment="center">
                        {this.props.ImagesURL.map((image, i) => (
                            <Image style={styles.imageContainer} source={{uri: image}} key={i} />
                        ))}
                    </ScrollView>
                </View>
            );
        //}
        //return null;
    }

}

const styles = StyleSheet.create({
    scrollContainer: {
        height: Dimensions.get('window').width * 0.8,
    },
    imageContainer:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 0.8,
    },
});