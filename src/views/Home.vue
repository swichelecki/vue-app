<template>
  <div>
      <AddTodo v-on:add-todo="addTodo"/>
      <Todos v-bind:todos="todos" v-on:del-todo="deleteTodo" v-on:is-complete="markComplete"/>
  </div>
</template>

<script>
import AddTodo from '../components/AddTodo';
import Todos from '../components/Todos';
import * as firebase from 'firebase/app';
//import 'firebase/database';
import _ from 'lodash';
export default {
  name: 'Home',
  components: {
      AddTodo,
      Todos
  },
  data(){
      return {
          todos: [],
          completed: null
      }
  },
  methods: {
      deleteTodo(key) {
          //this.todos = this.todos.filter(todo => todo.id !== id);
          const todoItemsDatabaseRef = firebase.database().ref('items');
          todoItemsDatabaseRef.child(key).remove();
      },
      addTodo(newTodo) {
         // this.todos = [...this.todos, newTodo];
          const todoItemsDatabaseRef = firebase.database().ref('items');
          const addTodo = todoItemsDatabaseRef.push();
          addTodo.update(newTodo);
      },
      markComplete(value, sentKey) {
           let complete;
           this.todos.forEach(function(todo) {

              if (todo.key === sentKey) {
                  todo.completed = !value;
                  complete = todo;
              }

          });

          const key = complete.key;
          let editThisObjectInFirebase = firebase.database().ref().child('items').child(key);
          editThisObjectInFirebase.once('value', function(snapshot) {

              if (snapshot.val() === null) {
                  alert('Object does not exist');
              } else {
                  editThisObjectInFirebase.update(complete);
              }
          });

      },
      getData(values) {
        this.todos = [];
        const todosData = values;
        const todoObjects = _(todosData)
                            .keys()
                            .map(todoKey => {
                                let cloned = _.clone(todosData[todoKey]);
                                cloned.key = todoKey;
                                return cloned;
                            })
                            .value();

        let thisState = this.todos;
        todoObjects.forEach(function(item) {
            thisState.push(item);
        });

      }
  },
  created(){
      const todoItemsDatabaseRef = firebase.database().ref('items');
      todoItemsDatabaseRef.on('value', snapshot => {
          this.getData(snapshot.val());
      });
  }
}
</script>
