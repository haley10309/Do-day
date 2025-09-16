import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f7",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  todoItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
});
