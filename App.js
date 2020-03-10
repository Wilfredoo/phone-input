import React from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput
} from "react-native";
import { Container, Item, Input, Icon } from "native-base";
import data from "./Countries";
const defaultFlag = data.filter(obj => obj.name === "Germany")[0].flag;

filterCountry = searchedCountry => {
  const lowerSearchedCountry = searchedCountry.toLowerCase();

  return data.filter(
    country =>
      country.name.toLowerCase().includes(lowerSearchedCountry) ||
      country.dial_code.includes(lowerSearchedCountry)
  );
};

export default class App extends React.Component {
  state = {
    flag: defaultFlag,
    modalVisible: false,
    phoneNumber: "",
    searchedCountry: ""
  };

  onChangeText(key, value) {
    this.setState({
      [key]: value
    });
  }

  showModal() {
    this.setState({ modalVisible: true });
  }
  hideModal() {
    this.setState({ modalVisible: false });
    this.refs.PhoneInput._root.focus();
  }

  async getCountry(country) {
    const countryData = await data;
    try {
      const countryCode = await countryData.filter(
        obj => obj.name === country
      )[0].dial_code;
      const countryFlag = await countryData.filter(
        obj => obj.name === country
      )[0].flag;
      this.setState({ phoneNumber: countryCode, flag: countryFlag });
      await this.hideModal();
    } catch (err) {
      console.log(err);
    }
  }

  // example from another project
  searchContacts = value => {
    const filteredPals = this.state.inMemoryPals.filter(pal => {
      console.warn("pal before lowercase", pal);
      let contactLowercase = (pal[0] + " " + pal[1]).toLowerCase();
      let searchTermLowercase = value.toLowerCase();
      return contactLowercase.indexOf(searchTermLowercase) > -1;
    });

    const filteredUsers = this.state.inMemoryUsers.filter(user => {
      console.warn("user before lowercase", user);
      let contactLowercase = (user[0] + " " + user[1]).toLowerCase();
      let searchTermLowercase = value.toLowerCase();
      return contactLowercase.indexOf(searchTermLowercase) > -1;
    });

    this.setState({ users: filteredUsers, pals: filteredPals }, () => {
      console.warn(".");
    });
  };

  handleChange = text => {
    this.setState({ searchedCountry: text }, () => {
      console.log("hi", this.state.text);
    });
  };

  render() {
    let { flag } = this.state;
    const defaultCode = "+49";
    const countryData = data;
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}
          >
            <View style={styles.container}>
              <Container style={styles.infoContainer}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.title}>Whats your number?</Text>
                  <Text style={styles.subtitle}>
                    Whether you are creating an account or signing back in,
                    let's start with your number
                  </Text>
                  <Item style={styles.itemStyle}>
                    <View>
                      <Text style={styles.inputFlag}>{flag}</Text>
                    </View>
                    <Icon
                      active
                      name="md-arrow-dropdown"
                      style={styles.iconStyle}
                      onPress={() => this.showModal()}
                    />
                    <Input
                      placeholder="+123 45678910"
                      placeholderTextColor="#adb4bc"
                      keyboardType={"phone-pad"}
                      returnKeyType="done"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={false}
                      ref="PhoneInput"
                      value={this.state.phoneNumber}
                      onChangeText={val => {
                        if (this.state.phoneNumber === "") {
                          this.onChangeText("phoneNumber", defaultCode + val);
                        } else {
                          this.onChangeText("phoneNumber", val);
                        }
                      }}
                    />
                    <Modal
                      animationType="slide" // fade
                      transparent={false}
                      visible={this.state.modalVisible}
                    >
                      <View style={styles.modalContainer}>
                        <View style={styles.modal}>
                          <TouchableOpacity onPress={() => this.hideModal()}>
                            <Icon name="arrow-back" />
                          </TouchableOpacity>
                          <TextInput
                            placeholder="Search"
                            onChangeText={text => this.handleChange(text)}
                          ></TextInput>
                          <FlatList
                            data={filterCountry(this.state.searchedCountry)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                              <TouchableWithoutFeedback
                                onPress={() => this.getCountry(item.name)}
                              >
                                <View
                                  style={[
                                    styles.countryStyle,
                                    {
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "space-between"
                                    }
                                  ]}
                                >
                                  <Text style={styles.flagIconList}>
                                    {item.flag}
                                  </Text>
                                  <Text style={styles.listText}>
                                    {item.name} ({item.dial_code})
                                  </Text>
                                </View>
                              </TouchableWithoutFeedback>
                            )}
                          />
                        </View>
                      </View>
                    </Modal>
                  </Item>
                </View>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column"
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: "bold"
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30
  },
  itemStyle: {
    marginBottom: 10
  },
  iconStyle: {
    color: "black",
    fontSize: 28,
    marginLeft: 15
  },
  buttonStyle: {
    alignItems: "center",
    padding: 14,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  textStyle: {
    padding: 5,
    fontSize: 20,
    fontWeight: "bold"
  },
  countryStyle: {
    flex: 1,
    borderTopColor: "#211f",
    borderTopWidth: 1,
    padding: 12
  },
  closeButtonStyle: {
    flex: 1,
    padding: 12,
    alignItems: "center"
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    color: "blue",
    fontSize: 20,
    marginBottom: 15
  },
  subtitle: { textAlign: "center", marginBottom: 20 },
  inputFlag: { fontSize: 30, marginLeft: 15 },
  modal: {
    flex: 10,
    paddingTop: 80
  },
  flagIconList: { fontSize: 30 },
  listText: { fontSize: 20 },
  modalContainer: { flex: 1 }
});
