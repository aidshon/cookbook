import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Input from "./Input";

const CREATE_USER = gql`
  mutation createUser(
    $authProvider: AuthProviderSignupData = {
      email: { email: "", password: "" }
    }
  ) {
    createUser(authProvider: $authProvider) {
      email
      password
    }
  }
`;

class Registration extends React.Component {
  static navigationOptions = {
    title: "Registration",
    headerStyle: {
      backgroundColor: "#F6BB32"
    }
  };

  state = {
    email: "",
    password: ""
  };

  handleChangeEmail = email => {
    this.setState({
      email
    });
  };

  handleChangePassword = password => {
    this.setState({
      password
    });
  };

  handleRegistration = async createUser => {
    try {
      const result = await createUser({
        variables: {
          authProvider: {
            email: {
              email: this.state.email,
              password: this.state.password
            }
          }
        }
      });

      this.setState({
        email: "",
        password: ""
      });

      this.props.navigation.navigate("SignIn");
    } catch (error) {
      console.log("Error: ", error);
      this.setState({
        email: "",
        password: ""
      });
    }
  };

  render() {
    const { buttonStyle, buttonTextStyle, containerStyle } = styles;

    return (
      <View style={containerStyle}>
        <Mutation mutation={CREATE_USER}>
          {(createUser, { data, loading, error }) => (
            <View>
              {!!data && <Text>{data.name}</Text>}
              <Input
                email={this.state.email}
                password={this.state.password}
                onChangeEmail={this.handleChangeEmail}
                onChangePassword={this.handleChangePassword}
              />
              <TouchableOpacity
                disabled={loading}
                onPress={() => this.handleRegistration(createUser)}
                style={buttonStyle}
              >
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={buttonTextStyle}>Register</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Mutation>
      </View>
    );
  }
}

const styles = {
  buttonStyle: {
    width: 90,
    height: 35,
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#F6BB32"
  },
  buttonTextStyle: {
    fontSize: 22,
    alignSelf: "center",
    margin: 3
  },
  containerStyle: {
    flex: 1,
    margin: 25,
    marginTop: 70
  }
};

export default Registration;
