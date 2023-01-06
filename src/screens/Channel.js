import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { db, createMessage, getCurrentUser } from "../utils/firebase-auth";
import styled, { ThemeContext } from "styled-components/native";
import {
  collection,
  onSnapshot,
  query,
  doc,
  orderBy,
} from "firebase/firestore";
import { Alert } from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";
import { MaterialIcons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const SendButton = (props) => {
  const theme = useContext(ThemeContext);

  return (
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 4,
      }}
    >
      <MaterialIcons
        name="send"
        size={24}
        color={props.text ? theme.sendButtonActive : theme.sendButtonInactive}
      />
    </Send>
  );
};

const Channel = ({ navigation, route }) => {
  const theme = useContext(ThemeContext);
  const { uid, name, photoUrl } = getCurrentUser();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const docRef = doc(db, "channels", route.params.id);
    const collectionQuery = query(
      collection(db, `${docRef.path}/messages`),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setMessages(list);
    });
    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: route.params.title || "Channel" });
  }, []);

  const _handleMessageSend = async (messageList) => {
    const newMessage = messageList[0];
    try {
      await createMessage({ channelId: route.params.id, message: newMessage });
    } catch (e) {
      Alert.alert("Send Message Error", e.message);
    }
  };

  return (
    <Container>
      <GiftedChat
        listViewProps={{
          style: { backgroundColor: theme.background },
        }}
        placeholder="Enter a message"
        messages={messages}
        user={{ _id: uid, name, avatar: photoUrl }}
        onSend={_handleMessageSend}
        alwaysShowSend={true}
        textInputProps={{
          autoCapitalize: "none",
          autoCorrect: false,
          textContentType: "none",
          underlineColorAndroid: "transparent",
        }}
        multiline={false}
        renderUsernameOnMessage={true}
        scrollToBottom={true}
        renderSend={(props) => <SendButton {...props} />}
      />
    </Container>
  );
};

export default Channel;
