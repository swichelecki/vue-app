<template>
  <div>
      <AddTodo v-on:add-todo="addTodo"/>
      <Todos v-bind:todos="todos" v-on:del-todo="deleteTodo" v-on:reordered-todos="reorderedTodos" v-on:is-complete="markComplete"/>
  </div>
</template>

<script>
import AddTodo from '../components/AddTodo';
import Todos from '../components/Todos';
import * as firebase from 'firebase';
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
          let promise1 = '';
          promise1 = Promise.resolve(todoItemsDatabaseRef.child(key).remove());

          promise1.then(function() {

              if (window.innerWidth <= 600) {

                  const todoWrapper = document.getElementById('todo-wrapper');
                  const height = window.innerHeight;
                  const wrapperTop = todoWrapper.getBoundingClientRect().top;
                  const todoWrapperHeight = (height - wrapperTop);

                  const todoNodes = document.querySelectorAll('#todo-wrapper div');
                  let todoHeight = 0;

                  todoNodes.forEach((item) => {
                          todoHeight += item.clientHeight;
                  });

                  if (todoHeight < todoWrapperHeight) {

                      todoWrapper.removeAttribute("style");
                      todoWrapper.classList.remove('mobile-scroll');

                  }

              }

          });
      },
      addTodo(newTodo) {
         // this.todos = [...this.todos, newTodo];
          const todoItemsDatabaseRef = firebase.database().ref('items');
          const addTodo = todoItemsDatabaseRef.push();
          let promise1 = '';
          promise1 = Promise.resolve(addTodo.set(newTodo));

          promise1.then(function() {

              if (window.innerWidth <= 600) {

                  const todoWrapper = document.getElementById('todo-wrapper');
                  const height = window.innerHeight;
                  const wrapperTop = todoWrapper.getBoundingClientRect().top;
                  const todoWrapperHeight = (height - wrapperTop);

                  const todoNodes = document.querySelectorAll('#todo-wrapper div');
                  let todoHeight = 0;

                  todoNodes.forEach((item) => {
                          todoHeight += item.clientHeight;
                  });

                  if (todoHeight > todoWrapperHeight) {

                      todoWrapper.setAttribute('style', 'height: ' + todoWrapperHeight + 'px;');
                      todoWrapper.classList.add('mobile-scroll');

                  }

              }

          });
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
        let promise1 = '';
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
            promise1 = Promise.resolve(thisState.push(item));

            promise1.then(function() {

                if (window.innerWidth <= 600) {

                    const todoWrapper = document.getElementById('todo-wrapper');
                    const height = window.innerHeight;
                    const wrapperTop = todoWrapper.getBoundingClientRect().top;
                    const todoWrapperHeight = (height - wrapperTop);

                    const todoNodes = document.querySelectorAll('#todo-wrapper div');
                    let todoHeight = 0;

                    todoNodes.forEach((item) => {
                            todoHeight += item.clientHeight;
                    });

                    if (todoHeight > todoWrapperHeight) {

                        todoWrapper.setAttribute('style', 'height: ' + todoWrapperHeight + 'px;');
                        todoWrapper.classList.add('mobile-scroll');

                    }

                }

            });
            
        });

    },
    reorderedTodos(reorderedTodos) {
        const oldTodoItemsDatabaseRef = firebase.database().ref('items');
        oldTodoItemsDatabaseRef.remove();
        const newTodoItemsDatabaseRef = firebase.database().ref('items');
        reorderedTodos.forEach((item) => {
            newTodoItemsDatabaseRef.push(item);
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

<style scoped>

    .mobile-scroll {
        overflow-y: scroll;
    }

    .mobile-scroll::-webkit-scrollbar {
        width: 1em;
        background-color: whitesmoke;
    }

    .mobile-scroll::-webkit-scrollbar-thumb {
        background-color: #d9d9d9;
    }

</style>
