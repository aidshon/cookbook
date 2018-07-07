import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator, createSwitchNavigator } from "react-navigation";
import {
  AddRecipeForm,
  DetailsScreen,
  HomeScreen,
  RegistrationScreen,
  SignInScreen
} from "./components";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "https://api.graph.cool/simple/v1/cjj6owpam27mo01975rhraz1q"
});

const Registration = createStackNavigator({
  Register: {
    screen: RegistrationScreen
  }
})

const SignIn = createStackNavigator({
  SignIn: {
    screen: SignInScreen
  }
})

const OtherScreens = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  Details: {
    screen: DetailsScreen
  },
  AddRecipe: {
    screen: AddRecipeForm
  }
})

const RootStack = createSwitchNavigator({
  SignIn: SignIn,
  Register: Registration,
  Other: OtherScreens
});

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <RootStack />
      </ApolloProvider>
    );
  }
}

export default App;
