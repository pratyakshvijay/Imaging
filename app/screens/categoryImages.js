import React, { useState } from "react";
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
  ScrollView,
} from "react-native";
import { Gallery } from "react-native-gallery-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("screen");

const Images = ({ navigation, route, navigator }) => {
  const [images, setImages] = React.useState([]);

  let getDataFromAsync = async () => {
    try {
      let items = await AsyncStorage.getItem("ImageCateArr");
      if (items) {
        let arrObj = [];
        let parsedObject = JSON.parse(items);
        for (let i = 0; i < parsedObject.length; i++) {
          if (parsedObject[i].title == route.params.title) {
            for (let j = 0; j < parsedObject[i].uri.length; j++) {
              // console.log("sfdsfdsfgds ", {
              //   src: parsedObject[i].uri[j],
              //   id: j,
              // });
              arrObj.push({
                src: parsedObject[i].uri[j],
                id: j,
              });
            }
          }
        }

        setImages(arrObj);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    getDataFromAsync();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Gallery
          borderColor="#000"
          images={images}
          activeIndex={0}
          navigator={navigator}
        />

        {/* Basic Usage */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff", //#709463
  },
});

export default Images;
