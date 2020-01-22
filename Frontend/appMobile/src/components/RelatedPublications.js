import React, {Component} from "react";
import {StyleSheet,Text,View,ScrollView,TouchableOpacity} from 'react-native';

import SpacesScrollView from './SpacesScrollView';

class RelatedPublications extends Component {
	constructor(props) {
		super(props);
	}
    
 	render() {

		const {relatedPublications, title} = this.props;
		return (
			<React.Fragment>
				{relatedPublications.length > 0 ? (
                    <>
                        <Text style={styles.subtitleText}>{title}</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >  
                            {relatedPublications.map(relPub => {
                                return (
                                    <SpacesScrollView key={relPub.IdPublication}
                                        type={'related'}
                                        push={this.props.push} 
                                        {...relPub}
                                    />
                                )
                            })}
                        </ScrollView>
                    </>
                    ) : (null)
                }
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
titleText:{
    fontSize: 24, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 5,
},
subtitleText:{
    fontSize: 22, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 5,
},
});

export default RelatedPublications