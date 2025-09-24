// components/CustomTodoModal.js
import React from "react";
import { 
  Modal, View, Text, TextInput, Button, 
  TouchableWithoutFeedback, StyleSheet 
} from "react-native";

export default function CustomTodoModal({
  visible,
  value,
  onChangeText,
  onCancel,
  onAdd,
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>새로운 할 일 추가</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="추가할 할 일을 입력하세요"
                value={value}
                onChangeText={onChangeText}
                autoFocus={true}
                onSubmitEditing={onAdd}
              />
              <View style={styles.modalButtonContainer}>
                <Button title="취소" onPress={onCancel} color="#FF6347" />
                <Button title="추가" onPress={onAdd} color="#4CAF50" />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
