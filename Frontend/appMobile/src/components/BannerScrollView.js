import React, {Component} from 'react';
import {View,ScrollView,Image,StyleSheet,Dimensions} from 'react-native';

const {winWidth} = Dimensions.get('window');
const {bannerHeight} = winWidth * 0.8;
const images = [
            {
                source: {
                    uri: 'https://cdn.pixabay.com/photo/2016/03/28/09/34/bedroom-1285156_960_720.jpg'
                },
            },
            {
                source: {
                    uri: 'https://cdn.pixabay.com/photo/2015/05/15/14/22/conference-room-768441_960_720.jpg'
                },
            },
            {
                source: {
                    uri: 'https://cdn.pixabay.com/photo/2015/04/20/06/43/meeting-room-730679_960_720.jpg'
                },
            },
        ];


export default class Banner extends Component {
    render (){
        
        if (images && images.length){
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
                        {images.map((image, i) => (
                            <Image style={styles.image} source={image.source} key={i} />
                        ))}
                    </ScrollView>
                </View>
            );
        }
        return null;
    }

}

const styles = StyleSheet.create({
    scrollContainer: {
        height: bannerHeight,
    },
    image:{
        width: 412,
        height: 200,
    },
});