import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Platform } from "react-native";
import styled from "styled-components/native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import produce from "immer";

const Container = styled.SafeAreaView`
  flex: 1;
  padding-top: ${Constants.statusBarHeight}px;
`;

// 키보드 동작성 감지 컴포넌트
const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1;
`;

const Contents = styled.ScrollView`
  flex: 1;
  padding: 8px 24px;
`;

const TodoItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 8px;
`;

const TodoItemText = styled.Text`
  font-size: 20px;
  flex: 1;
`;

const TodoItemButton = styled.Button``;

const InputContainer = styled.View`
  flex-direction: row;
  padding: 8px 24px;
`;

const Input = styled.TextInput`
  border: 1px solid #e5e5e5;
  flex: 1;
`;

const Button = styled.Button``;

const Check = styled.TouchableOpacity`
  margin-right: 4px;
`;

const CheckIcon = styled.Text`
  font-size: 20px;
`;

export default function App() {
  const [list, setList] = useState([]);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const data = await AsyncStorage.getItem("list");
      if (data) {
        setList(JSON.parse(data));
      }
    } catch (err) {
      alert(err.message);
    }
  }

  function handlePressSubmit() {
    if (validationCheck()) {
      if (list.length > 0) {
        const { id } = list[list.length - 1];
        const value = [...list, { id: id + 1, todo, done: false }];
        setListAndStore(value);
        setTodo("");
      } else {
        const value = [{ id: 1, todo, done: false }];
        setListAndStore(value);
        setTodo("");
      }
    }
  }

  async function setListAndStore(value) {
    setList(value);
    await AsyncStorage.setItem("list", JSON.stringify(value));
  }

  function handlePressDeleteTodo(id) {
    const value = list.filter((l2) => id !== l2.id);
    setListAndStore(value);
  }

  function handleChangeTodo(value) {
    setTodo(value);
  }

  function validationCheck() {
    if (!todo) {
      alert("할 일을 입력해 주세요.");
      return false;
    }
    return true;
  }

  function handlePressCheck(item) {
    setListAndStore(
      produce(list, (draft) => {
        const index = list.indexOf(item);
        draft[index].done = !list[index].done;
      })
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Contents>
          {list.length > 0 ? (
            list.map((l) => (
              <TodoItem key={l.id}>
                <Check onPress={() => handlePressCheck(l)}>
                  <CheckIcon>{l.done ? "☑️" : "✅"}</CheckIcon>
                </Check>
                <TodoItemText>{l.todo}</TodoItemText>
                <TodoItemButton
                  title="삭제"
                  onPress={() => handlePressDeleteTodo(l.id)}
                />
              </TodoItem>
            ))
          ) : (
            <TodoItem>
              <TodoItemText>할 일이 없습니다.</TodoItemText>
            </TodoItem>
          )}
        </Contents>
        <InputContainer>
          <Input
            value={todo}
            onChangeText={(value) => handleChangeTodo(value)}
            returnKeyType="done"
            multiline={true}
            blurOnSubmit={true}
            onSubmitEditing={() => handlePressSubmit()}
          />
          <Button title="전송" onPress={() => handlePressSubmit()} />
        </InputContainer>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
