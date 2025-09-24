// contexts/TodoContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const TodoContext = createContext({
  todos: [],
  setTodos: () => {},
  toggleTodoCompletion: () => {}, 
  addTodo: () => {},
  deleteTodo: () => {}, // ★★★ 새로 추가된 To-do 삭제 함수! ★★★
});

const TODO_STORAGE_KEY = '@todo_list_data';

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]); 
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem(TODO_STORAGE_KEY);
        if (storedTodos !== null) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.error("AsyncStorage에서 To-do 리스트 로드 실패:", error);
      } finally {
        setIsLoaded(true); 
      }
    };
    loadTodos();
  }, []);

  useEffect(() => {
    if (isLoaded) { 
      AsyncStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
        .catch(error => console.error("AsyncStorage에 To-do 리스트 저장 실패:", error));
    }
  }, [todos, isLoaded]);

  const toggleTodoCompletion = (id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const addTodo = (task) => {
    if (!task.trim()) return; 
    const newTodo = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
      task: task,
      completed: false,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  // ★★★ To-do를 삭제하는 함수 ★★★
  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const contextValue = {
    todos,
    setTodos,
    toggleTodoCompletion, 
    addTodo,
    deleteTodo, // 새로 추가된 deleteTodo 함수도 contextValue에 포함!
  };

  if (!isLoaded) {
    return null; 
  }

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}