import React, { Component } from 'react';
import { View, Animated, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import { string, func, bool } from 'prop-types';

export default class FloatingTitleTextInputField extends Component {
  static propTypes = {
    attrName: string.isRequired,
    title: string.isRequired,
    value: string.isRequired,
    updateMasterState: func.isRequired,
    editBool: bool,
    passBool: bool,
  }

  constructor(props) {
    super(props);
    const { value } =  this.props;
    this.position = new Animated.Value(value ? 1 : 0);
    this.state = {
      isFieldActive: false,
    }
  }

  _handleFocus = () => {
    if (!this.state.isFieldActive) {
      this.setState({ isFieldActive: true });
      Animated.timing(this.position, {
        toValue: 1,
        duration: 150,
      }).start();
    }
  }

  _handleBlur = () => {
    if (this.state.isFieldActive && !this.props.value) {
      this.setState({ isFieldActive: false });
      Animated.timing(this.position, {
        toValue: 0,
        duration: 150,
      }).start();
    }
  }

  _onChangeText = (updatedValue) => {
    const { attrName, updateMasterState } = this.props; 
    updateMasterState(attrName, updatedValue);
  }

  _returnAnimatedTitleStyles = () => {
    const { isFieldActive } = this.state;
    return {
      top: this.position.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
      }),
      fontSize: isFieldActive ? 11.5 : 15,
      color: isFieldActive ? 'white' : '#0069c0',
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style = {this.props.editBool ? Styles.container : Styles.containerDisabled}>
        <Animated.Text
          style = {this.props.editBool ? [Styles.titleStyles, this._returnAnimatedTitleStyles()] : Styles.titleStylesDisabled}
        >
        {
            /*this.props.editBool === true ? (*/this.props.title/*) : null */
        }
        </Animated.Text>
        <TextInput
            value = {this.props.value}
            style = {Styles.textInput}
            underlineColorAndroid = 'rgba(0,0,0,0)'
            onFocus = {this._handleFocus}
            onBlur = {this._handleBlur}
            onChangeText = {this._onChangeText}
            editable = {this.props.editBool}
            secureTextEntry={this.props.passBool}
        />
      </KeyboardAvoidingView>
    )
  }
}

const Styles = StyleSheet.create({
  container: {
    width: '80%',
    borderRadius: 3,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: 'white',
    height: 50,
    marginVertical: 4,
  },
  containerDisabled: {
    height: 50,  
  },
  textInput: {
    fontSize: 16,
    marginTop: 15,
    marginLeft: 5,
    color: '#FFF',
  },
  titleStyles: {
    position: 'absolute',
    left: 3,
    left: 4,
  },
  titleStylesDisabled: {
    position: 'absolute',
    left: 3,
    left: 4,
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  }
})