import React from "react";
import { TextInput, View } from "react-native";

class Input extends React.Component {
  render() {
    const { email, password, onChangeEmail, onChangePassword } = this.props;
    
    return (
      <View>
        <TextInput
          value={email}
          placeholder="E-mail"
          onChangeText={onChangeEmail}
          style={styles.inputStyle}
        />
        <TextInput
          secureTextEntry
          value={password}
          placeholder="Password"
          onChangeText={onChangePassword}
          style={styles.inputStyle}
        />
      </View>
    );
  }
}

const styles = {
  inputStyle: {
    borderWidth: 1.5,
    borderRadius: 10,
    width: 300,
    height: 35,
    fontSize: 20,
    padding: 7,
    borderColor: "#F6BB32",
    margin: 15
  }
};

export default Input;
