import { Text, View } from "react-native";
import React from "react";
import { Row, Image, TouchableOpacity } from "@shoutem/ui";

class Card extends React.Component {
  render() {
    const {
      itemContainerStyle,
      descriptionContainerStyle,
      titleTextStyle,
      descriptionTextContainerStyle,
      descriptionTextStyle,
      titleContainerStyle,
      starStyle
    } = styles;

    const {
      handleShowDetail,
      imageURL,
      title,
      description,
      recipeUsers,
      currentUserId
    } = this.props;

    return (
      <View style={itemContainerStyle}>
        <TouchableOpacity onPress={handleShowDetail}>
          <Row>
            <Image
              styleName="medium rounded-corners"
              source={{
                uri: imageURL
              }}
            />
            {recipeUsers.map((user, index) => {
              if (user.id === currentUserId) {
                return (
                  <Text key={index} style={starStyle}>
                    ★
                  </Text>
                );
              }
            })}
            <View style={descriptionContainerStyle}>
              <View style={titleContainerStyle}>
                <Text style={titleTextStyle}>{title}</Text>
              </View>
              <View style={descriptionTextContainerStyle}>
                <Text style={descriptionTextStyle}>{description}</Text>
              </View>
            </View>
          </Row>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1
  },
  itemContainerStyle: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#F6BB32",
    margin: 10
  },
  descriptionTextStyle: {
    flex: 1,
    flexWrap: "wrap"
  },
  titleTextStyle: {
    fontSize: 20,
    color: "#F6BB32",
    fontWeight: "bold",
    marginBottom: 5
  },
  descriptionContainerStyle: {
    flexDirection: "column",
    justifyContent: "space-around"
  },
  descriptionTextContainerStyle: {
    flexDirection: "row"
  },
  titleContainerStyle: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  starStyle: {
    color: "red",
    fontSize: 30,
    marginBottom: 22,
    marginRight: 5
  }
};

export default Card;
