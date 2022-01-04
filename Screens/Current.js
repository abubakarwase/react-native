import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Alert,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  View,
  Image,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import Header from "../Components/Header";

const openWeatherApiKey = "791dfc9b2c35ae8601f4a2978b8308b9";
let url = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherApiKey}`;

const Current = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    setRefreshing(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status != "granted") {
      Alert.alert("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    // const response = await fetch(
    //   `${url}&lat=31.520370&lon=74.358749`
    // ); for testing to current location (Lahore)

    const response = await fetch(
      `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
    );
    const data = await response.json();

    if (!response.ok) {
      Alert.alert(`Error reteriving weather data: ${data.message}`);
    } else {
      setForecast(data);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const current = forecast.current.weather[0];

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header />
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                loadForecast;
              }}
              refreshing={refreshing}
            />
          }
        >
          <Text style={styles.title}>Current Weather</Text>
          <Text style={{ alignItems: "center", textAlign: "center" }}></Text>
          <View style={styles.current}>
            <Image
              style={styles.largeIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
              }}
            />
          </View>
          <View>
            <Text style={styles.currentTemp}>
              {Math.ceil(forecast.current.temp)}°C
            </Text>
          </View>
          <Text style={styles.currentDescription}>
            {current.description.toUpperCase()}
          </Text>
          <View style={styles.extraInfo}>
            <View style={styles.info}>
              <Image
                source={require("../assets/temp.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                  marginLeft: 50,
                }}
              />
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "center" }}
              >
                Feels Like
              </Text>
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "center" }}
              >
                {Math.ceil(forecast.current.feels_like)}°C
              </Text>
            </View>
            <View style={styles.info}>
              <Image
                source={require("../assets/humidity.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                  marginLeft: 50,
                }}
              />
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "center" }}
              >
                Humidity
              </Text>
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "center" }}
              >
                {forecast.current.humidity}%{" "}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.subtitle}>Hourly Forecast</Text>
            <FlatList
              horizontal
              data={forecast.hourly.slice(0, 24)}
              keyExtractor={(Item, index) => index.toString()}
              renderItem={(hour) => {
                const weather = hour.item.weather[0];
                var dt = new Date(hour.item.dt * 1000);
                return (
                  <View style={styles.hour}>
                    <Text>{dt.toLocaleTimeString().replace(/:\d+ /, " ")}</Text>
                    <Text>{Math.ceil(hour.item.temp)}°C</Text>
                    <Image
                      style={styles.smallIcon}
                      source={{
                        uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                      }}
                    />
                    <Text>{weather.description}</Text>
                  </View>
                );
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffa69e",
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft: 7,
    color: "#ffa69e",
  },
  container: {
    flex: 1,
    backgroundColor: "#e3f2fd",
  },
  loading: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  current: {
    marginLeft: "10%",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  currentDescription: {
    width: "100%",
    textAlign: "center",
    fontWeight: "200",
    fontSize: 24,
    marginBottom: 5,
  },
  hour: {
    padding: 6,
    alignItems: "center",
  },
  largeIcon: {
    width: 300,
    height: 250,
  },
  smallIcon: {
    width: 100,
    height: 100,
  },
  extraInfo: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    padding: 10,
  },
  info: {
    width: Dimensions.get("screen").width / 2.5,
    backgroundColor: "rgba(0,0,0, 0.5)",
    padding: 10,
    borderRadius: 15,
    justifyContent: "center",
  },
});

export default Current;
