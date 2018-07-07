import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import React from "react";
import { TouchableOpacity } from "@shoutem/ui";
import Card from "./Card";

const GET_ALL_RECIPES = gql`
  {
    allRecipes(orderBy: dateOfCreation_DESC) {
      id
      title
      description
      instructions
      ingredients
      imageURL
      users {
        id
      }
    }
  }
`;

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigate, navigation }) => ({
    title: "COOKBOOK",
    headerStyle: {
      backgroundColor: "#F6BB32"
    },
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("AddRecipe");
        }}
      >
        <Text style={styles.addButtonStyle}>+</Text>
      </TouchableOpacity>
    )
  });

  state = {
    refreshing: false,
    userId: this.props.navigation.getParam("userId")
  };

  keyExtractor = item => item.id;

  handleShowDetail = (recipe, userId) => {
    this.props.navigation.navigate("Details", { recipe, userId });
  };

  renderItem = ({ item: recipe }) => (
    <Card
      handleShowDetail={() => this.handleShowDetail(recipe, this.state.userId)}
      imageURL={recipe.imageURL}
      title={recipe.title}
      description={recipe.description}
      recipeUsers={recipe.users}
      currentUserId={this.state.userId}
    />
  );

  render() {
    return (
      <View style={styles.containerStyle}>
        <Query query={GET_ALL_RECIPES}>
          {({ loading, data, fetchMore, error }) =>
            loading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={data ? data.allRecipes : []}
                renderItem={this.renderItem}
                refreshing={this.state.refreshing}
                onRefresh={() =>
                  fetchMore({
                    updateQuery: (prevState, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prevState;
                      return Object.assign({}, prevState, {
                        allRecipes: [...fetchMoreResult.allRecipes]
                      });
                    }
                  })
                }
              />
            )
          }
        </Query>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1
  },
  addButtonStyle: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 7,
    marginRight: 10
  }
};

export default HomeScreen;
