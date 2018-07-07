import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Mutation } from "react-apollo";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import gql from "graphql-tag";
import React from "react";
import { Constants, Permissions, ImagePicker } from "expo";

const CREATE_RECIPE = gql`
  mutation addRecipe(
    $title: String!
    $description: String!
    $ingredients: [String!]
    $instructions: [String!]
    $dateOfCreation: DateTime
    $imageURL: String
  ) {
    createRecipe(
      title: $title
      description: $description
      ingredients: $ingredients
      instructions: $instructions
      dateOfCreation: $dateOfCreation
      imageURL: $imageURL
    ) {
      id
      title
      description
      ingredients
      instructions
      dateOfCreation
      imageURL
    }
  }
`;

const FILE_UPLOAD_URL =
  "https://api.graph.cool/file/v1/cjj6owpam27mo01975rhraz1q";

class AddRecipeForm extends React.Component {
  state = {
    title: "",
    description: "",
    ingredient: "",
    instruction: "",
    ingredients: [],
    instructions: [],
    image: "https://hlfppt.org/wp-content/uploads/2017/04/placeholder.png",
    imageURL: 'https://hlfppt.org/wp-content/uploads/2017/04/placeholder.png'
  };

  static navigationOptions = {
    title: "Add new recipe",
    headerStyle: {
      backgroundColor: "#F6BB32"
    }
  };

  handleChangeTitle = title => {
    this.setState({ title });
  };

  handleChangeDescription = description => {
    this.setState({ description });
  };

  handleChangeIngredient = ingredient => {
    this.setState({ ingredient });
  };

  handleChangeInstruction = instruction => {
    this.setState({ instruction });
  };

  handleAddIngredient = () => {
    const ingredient = this.state.ingredient;
    if (ingredient) {
      this.setState({
        ingredients: [...this.state.ingredients, ingredient],
        ingredient: ""
      });
    }
  };

  handleAddInstruction = () => {
    const instruction = this.state.instruction;
    if (instruction) {
      this.setState({
        instructions: [...this.state.instructions, instruction],
        instruction: ""
      });
    }
  };

  pickFromGallery = async () => {
    const permissions = Permissions.CAMERA_ROLL;
    const { status } = await Permissions.askAsync(permissions);

    if (status === "granted") {
      let image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images"
      }).catch(error => console.log(permissions, { error }));
      console.log(permissions, "SUCCESS", image);
      this.setState({ image: image.uri });
    }
  };

  pickFromCamera = async () => {
    const permissions = Permissions.CAMERA;
    const { status } = await Permissions.askAsync(permissions);

    if (status === "granted") {
      let image = await ImagePicker.launchCameraAsync({
        mediaTypes: "Images"
      }).catch(error => console.log(permissions, { error }));
      console.log(permissions, "SUCCESS", image);
    }
  };

  uploadPhoto = async () => {
    let formData = new FormData();
    formData.append("data", {
      uri: this.state.image,
      name: "image.png",
      type: "multipart/form-data"
    });

    try {
      const res = await fetch(FILE_UPLOAD_URL, {
        method: "POST",
        body: formData
      });
      const resJson = await res.json();
      this.setState({
        imageURL: resJson.url
      })
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  render() {
    const {
      addButtonStyle,
      mainContainerStyle,
      textInputStyle,
      descriptionInputStyle,
      saveButtonStyle,
      buttonTextStyle,
      labelStyle,
      containerStyle,
      titleInputStyle,
      inputContainerStyle,
      imageStyle,
      imageContainer,
      imageBlockContainer
    } = styles;

    return (
      <View style={mainContainerStyle}>
      <KeyboardAwareScrollView>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={imageBlockContainer}>
          <View style={imageContainer}>
            <Image
              style={imageStyle}
              source={{ uri: this.state.image }}
            />
            </View>
                      <View>
            <Button title="Take photo" onPress={this.pickFromCamera} />
            <Button title="Choose from gallery" onPress={this.pickFromGallery} />
            <Button title="Upload" onPress={this.uploadPhoto} />
            </View>
          </View>
          <Mutation mutation={CREATE_RECIPE}>
            {(createRecipe, { data, loading, error }) => (
              <ScrollView alwaysBounceVertical={false}>
                {!!data && <Text>{data.name}</Text>}
                <View style={containerStyle}>
                  <Text style={labelStyle}>Title:</Text>
                  <TextInput
                    value={this.state.title}
                    onChangeText={this.handleChangeTitle}
                    style={titleInputStyle}
                  />
                </View>
                <Text style={labelStyle}>Description:</Text>
                <TextInput
                  value={this.state.description}
                  onChangeText={this.handleChangeDescription}
                  style={descriptionInputStyle}
                  multiline={true}
                />
                <Text style={labelStyle}>Ingredients:</Text>
                <View style={inputContainerStyle}>
                  <TextInput
                    value={this.state.ingredient}
                    onChangeText={this.handleChangeIngredient}
                    style={textInputStyle}
                  />
                  <TouchableOpacity onPress={this.handleAddIngredient}>
                    <Text style={addButtonStyle}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={labelStyle}>Instructions:</Text>
                <View style={inputContainerStyle}>
                  <TextInput
                    value={this.state.instruction}
                    onChangeText={this.handleChangeInstruction}
                    style={textInputStyle}
                  />
                  <TouchableOpacity onPress={this.handleAddInstruction}>
                    <Text style={addButtonStyle}>+</Text>
                  </TouchableOpacity>
                </View>
                {this.state.title &&
                  this.state.description &&
                  this.state.ingredients &&
                  this.state.instructions && (
                    <TouchableOpacity
                      disabled={loading}
                      onPress={() => {
                        createRecipe({
                          variables: {
                            title: this.state.title,
                            description: this.state.description,
                            ingredients: this.state.ingredients,
                            instructions: this.state.instructions,
                            dateOfCreation: new Date(),
                            imageURL: this.state.imageURL
                          }
                        }),
                          this.setState({
                            title: "",
                            description: "",
                            instructions: [],
                            ingredients: [],
                            imageURL: ''
                          }),
                          this.props.navigation.navigate("Home");
                      }}
                      style={saveButtonStyle}
                    >
                      {loading ? (
                        <ActivityIndicator />
                      ) : (
                        <Text style={buttonTextStyle}>Save</Text>
                      )}
                    </TouchableOpacity>
                  )}
              </ScrollView>
            )}
          </Mutation>
        </ScrollView>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = {
  titleInputStyle: {
    borderWidth: 1.5,
    borderRadius: 8,
    width: 200,
    height: 30,
    fontSize: 18,
    padding: 5,
    borderColor: "#F6BB32",
    marginRight: 10
  },
  textInputStyle: {
    borderWidth: 1.5,
    borderRadius: 8,
    width: 300,
    height: 30,
    fontSize: 18,
    padding: 3,
    margin: 7,
    borderColor: "#F6BB32"
  },
  descriptionInputStyle: {
    borderWidth: 1.5,
    borderRadius: 8,
    width: 350,
    height: 100,
    margin: 12,
    fontSize: 18,
    padding: 5,
    borderColor: "#F6BB32"
  },
  saveButtonStyle: {
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
  labelStyle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 7
  },
  containerStyle: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  mainContainerStyle: {
    flex: 1,
    margin: 3,
    marginTop: 10
  },
  addButtonStyle: {
    fontSize: 35,
    fontWeight: "bold",
    marginRight: 5
  },
  inputContainerStyle: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  imageStyle: {
    width: 120,
    height: 110
  },
  imageBlockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 5,
    marginBottom: 20
  },
  imageContainer: {
    borderWidth: 1
  }
};

export default AddRecipeForm;
