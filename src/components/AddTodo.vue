<template>
    <div>
        <form @submit="addTodo">
            <input type="text" v-model="title" name="title" placeholder="Add Todo..." onfocus="this.placeholder = ''"
onblur="this.placeholder = 'Add Todo...'">
            <select id="select">
                <option>Due Date</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="never">Never</option>
            </select>
            <button type="submit" class="btn">Submit</button>
        </form>
    </div>
</template>

<script>
import * as firebase from 'firebase';
let KEY;
export default {
    name: 'AddTodo',
    data(){
        return {
            title: ''
        }
    },
    methods: {
        addTodo(e) {
            e.preventDefault();
            const select = document.getElementById('select');
            const form = document.querySelector('form');
            const opt = select.options[select.selectedIndex];

            const TodoItemsDatabaseRef = firebase.database().ref('items');
            TodoItemsDatabaseRef.on("value", function(snapshot) {
                let id = snapshot.numChildren();
                KEY = id + 1;
            });

            const newTodo = {
                key: KEY,
                title: this.title,
                due: opt.text,
                completed: false
            }
            this.$emit('add-todo', newTodo);
            form.reset();
        }
    }
}
</script>

<style scoped>
    form {
        display: flex;
        background-color: #fff;
        padding-bottom: 10px;
    }

    input[type="text"] {
        width: 67%;
        margin: 0 10px;
        padding: 10px;
        font-size: 16px;
        color: #353c43;
        outline: none;
        border: 1px solid whitesmoke;
        background-color: whitesmoke;
        border-radius: 20px;
        font-weight: 200;
    }

    .btn {
        display: inline-block;
        border: none;
        background: #484848;
        border: 1px #3b3b3b solid;
        font-weight: 200;
        color: #fff;
        padding: 7px 20px;
        cursor: pointer;
        font-size: 16px;
        flex: 1;
        font-size: 16px;
        outline: none;
        border-radius: 0;
        margin: 0 10px;
        border-radius: 5px;
    }

    select {
        flex: 1;
        color: #353c43;
        font-weight: 200;
        padding: 10px 10px 10px 15px;
        font-size: 16px;
        outline: none;
        border: 1px solid whitesmoke;
        background-color: whitesmoke;
        border-radius: 20px;
        cursor: pointer;
    }
</style>
