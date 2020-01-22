import React, { Component } from 'react';
import {View,Text,StyleSheet} from 'react-native';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Stars extends Component {

get stars() {
  const { votes, size, color } = this.props;
  const starsNumber = parseInt(votes);
  const starElements = [];
  for (let i = 0; i < 5; i++) {
    starElements.push(
      <Icon
        key={`star-${i}`}
        name={starsNumber > i ? 'star' : 'star-o'}
        size={size}
        color={starsNumber > i ? color : 'gray'}
        style={styles.star}
      />,
    );
  }
  return starElements;
}

  render() {
  	const { votes } = this.props;
  	return (
      <View style={styles.stars} >
        {this.stars}
        {votes ? (
          <Text style={styles.votesNumber}>
            {votes}
          </Text>
        ) : null}
      </View>
  	);
  }
}

Stars.propTypes = {
  votes: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  star: {
    marginRight: 1,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  votesNumber: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
    marginLeft: 3,
    color: 'white',
  },
});