import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Mutation } from "react-apollo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import gql from "graphql-tag";
import Input from "./Input";

const SIGN_IN_USER = gql`
  mutation SigninUserMutation($email: AUTH_PROVIDER_EMAIL) {
    signinUser(email: $email) {
      token
      user {
        id
      }
    }
  }
`;

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: "Sign in",
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

  handleSignIn = async signinUser => {
    try {
      const result = await signinUser({
        variables: {
          email: {
            email: this.state.email,
            password: this.state.password
          }
        }
      });

      const userId = result.data.signinUser.user.id;

      this.setState({
        email: "",
        password: ""
      });

      this.props.navigation.navigate("Home", { userId });
    } catch (error) {
      console.log("Error: ", error);
      this.setState({
        email: "",
        password: ""
      });
    }
  };

  render() {
    const { containerStyle, buttonStyle, buttonTextStyle, imageStyle } = styles;

    return (
      <View style={containerStyle}>
        <Image
          source={{
            uri: "https://d30y9cdsu7xlg0.cloudfront.net/png/51422-200.png"
          }}
          style={imageStyle}
        />
        <KeyboardAwareScrollView>
          <Mutation mutation={SIGN_IN_USER}>
            {(signinUser, { data, loading, error }) => (
              <ScrollView
                alwaysBounceVertical={false}
                keyboardShouldPersistTaps="handled"
              >
                {!!data && <Text>{data.name}</Text>}
                <Input
                  email={this.state.email}
                  password={this.state.password}
                  onChangeEmail={this.handleChangeEmail}
                  onChangePassword={this.handleChangePassword}
                />
                <TouchableOpacity
                  disabled={loading}
                  onPress={() => this.handleSignIn(signinUser)}
                  style={buttonStyle}
                >
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={buttonTextStyle}>Sign in</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[buttonStyle, { width: 260 }]}
                  onPress={() => this.props.navigation.navigate("Register")}
                >
                  <Text style={buttonTextStyle}>Do not have an account?</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </Mutation>
        </KeyboardAwareScrollView>
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
  },
  imageStyle: {
    width: 100,
    height: 100,
    alignSelf: "center"
  }
};

export default SignInScreen;
