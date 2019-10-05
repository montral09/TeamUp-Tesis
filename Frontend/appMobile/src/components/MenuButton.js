import React, {Component} from 'react';
import { StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default class MenuButton extends Component{
    constructor(props){
        super(props);
        
    }

    render (){
        return(
            <Ionicons
                name="md-menu"
                color="#fff"
                size={32}
                onPress={()=>this.props.navigation.toggleDrawer()}
            />
        )
    }
}
