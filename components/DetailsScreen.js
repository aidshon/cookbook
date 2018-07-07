import React from "react";
import { Image, ScrollView, Share, Text, View } from "react-native";
import { TouchableOpacity } from "@shoutem/ui";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const ADD_RECIPE_TO_USER = gql`
  mutation addRecipeToUser($usersUserId: ID!, $recipesRecipeId: ID!) {
    addToRecipeOnUser(
      usersUserId: $usersUserId
      recipesRecipeId: $recipesRecipeId
    ) {
      recipesRecipe {
        id
      }
    }
  }
`;

class DetailsScreen extends React.Component {
  static navigationOptions = {
    title: "Detail",
    headerStyle: {
      backgroundColor: "#F6BB32"
    }
  };

  share = (title, description) => {
    Share.share({
      message: description,
      title: "New recipe for you: " + title
    });
  };

  render() {
    const recipe = this.props.navigation.getParam("recipe");
    const userId = this.props.navigation.getParam("userId");

    const {
      imageStyle,
      shareButtonStyle,
      itemStyle,
      buttonTextStyle,
      labelStyle,
      descriptionStyle,
      containerStyle,
      addButtonStyle
    } = styles;
    
    return (
      <View style={containerStyle}>
        <ScrollView>
          <Image
            source={{
              uri: recipe.imageURL
            }}
            style={imageStyle}
          />
          <Text style={descriptionStyle}>{recipe.description}</Text>
          <Text style={labelStyle}>Ingredients:</Text>
          {recipe.ingredients.map((item, index) => (
            <Text key={index} style={itemStyle}>
              - {item}
            </Text>
          ))}
          <Text style={labelStyle}>Instructions:</Text>
          {recipe.instructions.map((item, index) => (
            <Text key={index} style={itemStyle}>
              - {item}
            </Text>
          ))}
          <TouchableOpacity
            onPress={() => this.share(recipe.title, recipe.description)}
            style={shareButtonStyle}
          >
            <Text style={buttonTextStyle}>Share</Text>
          </TouchableOpacity>
          <Mutation mutation={ADD_RECIPE_TO_USER}>
            {(addToRecipeOnUser, { data, loading, error }) => (
              <ScrollView alwaysBounceVertical={false}>
                {!!data && <Text>{data.name}</Text>}
                <TouchableOpacity
                  onPress={() => {
                    addToRecipeOnUser({
                      variables: {
                        usersUserId: userId,
                        recipesRecipeId: recipe.id
                      }
                    }),
                      this.props.navigation.navigate("Home");
                  }}
                  style={addButtonStyle}
                >
                  <Text style={buttonTextStyle}>Add to favorites</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </Mutation>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  imageStyle: {
    width: 380,
    height: 80
  },
  shareButtonStyle: {
    width: 80,
    height: 30,
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#F6BB32"
  },
  buttonTextStyle: {
    fontSize: 20,
    alignSelf: "center",
    margin: 3
  },
  itemStyle: {
    fontSize: 18,
    marginLeft: 20
  },
  descriptionStyle: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    margin: 20
  },
  labelStyle: {
    fontSize: 20,
    color: "#F6BB32",
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 5
  },
  containerStyle: {
    flex: 1
  },
  addButtonStyle: {
    width: 250,
    height: 30,
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#F6BB32"
  }
};

export default DetailsScreen;
