import React, { useState, useEffect } from "react";
import {
  Alert,
  TextInput,
  Pressable,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Button,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const folderPath = "https://img.icons8.com/color/344/image.png";

const { width, height } = Dimensions.get("screen");

const categoriesArr = [
  {
    id: "Portrait",
    uri: [],
    title: "Portrait",
  },
  {
    id: "Landscape",
    uri: [],
    title: "Landscape",
  },
  {
    id: "Abstract",
    uri: [],
    title: "Abstract",
  },
];

const Home = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [dataSource, setDataSource] = useState(categoriesArr);
  //const [modalVisible, setModalVisible] = useState(false);
  const [category, setCatagory] = useState("");
  const [modalForImageVisible, setModalForImageVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Portrait");
  const [pickerType, setPickerType] = useState("");

  let openModalForSelectCategory = (pickerType) => {
    setModalForImageVisible(true);
    setPickerType(pickerType);
  };
  const addCategory = async () => {
    try {
      let check = false;
      for (let i = 0; i < dataSource.length; i++) {
        if (category != "") {
          if (dataSource[i].title == category) {
            alert("Category name can not be same ");
            check = true;
            break;
          }
        } else {
          if (pickerType == "library") {
            pickImage("exist");
          } else if (pickerType == "camera") {
            clickImage("exist");
          }
          check = true;
          break;
        }
      }

      if (check == false) {
        let itemToPush = { id: category, uri: [], title: category };
        let items = await AsyncStorage.getItem("ImageCateArr");
        let parsedObject = JSON.parse(items);
        let tempArr = parsedObject;
        tempArr.push(itemToPush);
        await AsyncStorage.setItem("ImageCateArr", JSON.stringify(tempArr));
        setDataSource([...dataSource, itemToPush]);
        // setDataSource((categoriesArr) => [
        //   ...categoriesArr,
        //   { id: category, title: category },
        // ]);
        if (pickerType == "library") {
          pickImage("new");
        } else if (pickerType == "camera") {
          clickImage("new");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  let setDataFromAsyncStorage = async () => {
    try {
      let items = await AsyncStorage.getItem("ImageCateArr");
      if (items) {
        let parsedObject = JSON.parse(items);
        setDataSource(parsedObject);
      } else {
        await AsyncStorage.setItem(
          "ImageCateArr",
          JSON.stringify(categoriesArr)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setDataFromAsyncStorage();
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  let saveImageUrlToCategory = async (existOrNew, uri) => {
    try {
      let categoryName;
      if (existOrNew == "new") {
        let items = await AsyncStorage.getItem("ImageCateArr");
        let parsedObject = JSON.parse(items);
        let tempArr = parsedObject;
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i].title == category) {
            tempArr[i].uri.push(uri);
            categoryName = category;
          }
        }
        setDataSource(tempArr);
        await AsyncStorage.setItem("ImageCateArr", JSON.stringify(tempArr));
      } else if (existOrNew == "exist") {
        let items = await AsyncStorage.getItem("ImageCateArr");
        let parsedObject = JSON.parse(items);
        let tempArr = parsedObject;
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i].title == selectedCategory) {
            tempArr[i].uri.push(uri);
            categoryName = selectedCategory;
          }
        }
        setDataSource(tempArr);
        await AsyncStorage.setItem("ImageCateArr", JSON.stringify(tempArr));
      }
      setModalForImageVisible(false);
      Alert.alert("Success", "Image added successfully to " + categoryName);
      setCatagory("");
    } catch (error) {
      console.log(error);
    }
  };
  const pickImage = async (existOrNew) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        saveImageUrlToCategory(existOrNew, result.uri);
        setImage(result.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clickImage = async (existOrNew) => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        saveImageUrlToCategory(existOrNew, result.uri);
        setImage(result.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dataSource}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "column",
              margin: 0,
              padding: 5,
              alignItems: "center",
            }}
            onPress={() =>
              navigation.navigate("Category Screen", { title: item.title })
            }
          >
            <Image style={styles.imageThumbnail} source={{ uri: folderPath }} />
            <Text
              style={{
                textAlign: "center",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        //Setting the number of column
        numColumns={2}
        keyExtractor={(item, index) => index}
      />
      {/* <Button
        color="#7b9671"
        title="Add Category"
        onPress={() => setModalVisible(true)}
      /> */}
      <Button
        color="#7b9671"
        title="Add Image"
        onPress={() => openModalForSelectCategory("library")}
      />
      <Button
        color="#7b9671"
        title="Use Camera"
        onPress={() => openModalForSelectCategory("camera")}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalForImageVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalForImageVisible(!modalForImageVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.textStyle, { fontSize: 20 }]}>
              Select Category or add a new Category
            </Text>

            <Picker
              mode={"dialog"}
              style={styles.picker}
              itemStyle={styles.itemStyle}
              selectedValue={selectedCategory}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedCategory(itemValue)
              }
            >
              {dataSource.length > 0 &&
                dataSource.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.title}
                    value={item.title}
                  />
                ))}
              {/* <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" /> */}
            </Picker>
            <Text
              style={[styles.textStyle, { fontSize: 20, color: "#919492" }]}
            >
              OR
            </Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setCatagory(text)}
              placeholder="Enter a New Category Name"
              placeholderTextColor="grey"
            />
            <View style={{ flexDirection: "row", margin: 10 }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => addCategory()}
              >
                <Text style={styles.textStyle}>Add Image</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalForImageVisible(!modalForImageVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: width * 0.9,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 2,
  },
  buttonClose: {
    borderWidth: 1.5,
    borderColor: "#7b9671",
  },
  textStyle: {
    color: "#7b9671",
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,

    backgroundColor: "#fff", //#709463
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    resizeMode: "contain",
  },
  textInput: {
    width: "100%",
    borderRadius: 10,
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 5,
  },
  itemStyle: {
    fontSize: 15,
    height: 75,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  picker: {
    width: 100,
  },
});

export default Home;
