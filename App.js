import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Platform } from "react-native";
import styled from "styled-components/native";
import Constants from "expo-constants";

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

export default function App() {
  const [list, setList] = useState([{ id: 1, todo: "할 일 1" }]);
  const [todo, setTodo] = useState("");

  function handlePressSubmit() {
    if (validationCheck()) {
      if (list.length > 0) {
        const { id } = list[list.length - 1];
        setList([...list, { id: id + 1, todo }]);
        setTodo("");
      } else {
        setList([{ id: 1, todo }]);
        setTodo("");
      }
    }
  }

  function validationCheck() {
    if (!todo) {
      alert("할 일을 입력해 주세요.");
      return false;
    }
    return true;
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
                <TodoItemText>{l.todo}</TodoItemText>
                <TodoItemButton
                  title="삭제"
                  onPress={() => setList(list.filter((l2) => l.id !== l2.id))}
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
          <Input value={todo} onChangeText={(value) => setTodo(value)} />
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
