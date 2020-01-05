import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {View,TouchableOpacity,StyleSheet} from 'react-native';
  
export default class HeartButton extends Component {
  constructor(props) {
  	super(props);
  	//this.state = { addedToFavorite: false };

    //this.addToFavorite = this.addToFavorite.bind(this);
  }

  /*componentWillReceiveProps(nextProps) {
    this.setState({ addedToFavorite: nextProps.selected });
  }*/

  //addToFavorite() {
  //  this.setState({
  //    addedToFavorite: !this.state.addedToFavorite,
  //  })/*, () => {
  //    this.props.onPress();
  //  });*/
  //}

  render() {
  	//const { addedToFavorite } = this.state;
  	const { color, selectedColor, favoriteCode } = this.props;

    return (
      <TouchableOpacity
        onPress={this.props.submitFavorite}
      >
        <View style={styles.iconView}>
          <Icon
            name= {favoriteCode === 2 ? 'heart' : 'heart-o'}
            color= {favoriteCode === 2 ? selectedColor : color}
            size={18}
          />  
        </View>
      </TouchableOpacity>
    );
  }
}

HeartButton.propTypes = {
  color: PropTypes.string.isRequired,
  selectedColor: PropTypes.string.isRequired,
  favoriteCode: PropTypes.number.isRequired,
  submitFavorite: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  selectedColor: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  iconView: {
    marginLeft: 10,
  }

});

/*<Icon
            name="heart-o"
            size={18}
            color={color}
            style={[
              { display: addedToFavorite ? 'flex' : 'none' },
              styles.selectedColor,
            ]}
          />*/