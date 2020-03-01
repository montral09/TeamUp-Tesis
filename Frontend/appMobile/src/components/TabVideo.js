import React, {Component} from "react";
import { StyleSheet,Text,View,WebView,ScrollView,Dimensions,AppState} from 'react-native';
class TabVideo extends Component {

    state = {
        appState: AppState.currentState
    }
  
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }
  
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
  
    _handleAppStateChange = (nextAppState) => {        
        this.setState({appState: nextAppState});
    }

 	render() {
        var youtubeUrl = this.props.youtubeUrl;
        youtubeUrl = youtubeUrl.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        var youtubeId = youtubeUrl[2] !== undefined ? youtubeUrl[2].split(/[^0-9a-z_\-]/i)[0] : youtubeUrl[0];
        return (
			<View style={styles.container}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}> 
                    {this.state.appState == 'active' &&    
                        <WebView
                            style={styles.WebViewStyle}
                            javaScriptEnabled={true}
                            domStorageEnabled={true} 
                            source={{uri: `https://www.youtube.com/embed/${youtubeId}`}}
                        />
                    }
                </ScrollView>   
            </View>       
		);
	}
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2196f3',
        alignItems: 'flex-start',
    },
    WebViewStyle: {
        marginTop: 20,
        marginLeft: 10,
        width: Dimensions.get('window').width - 20,
        height: 230,
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

export default TabVideo;

//style={{
//    position: "relative",
//    paddingBottom: "56.25%" /* 16:9 */,
//    paddingTop: 25,
//    height: 0
//}}