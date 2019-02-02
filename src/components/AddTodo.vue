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
            <input type="submit" value="Submit" class="btn">
        </form>
    </div>
</template>

<script>
import uuid from 'uuid';
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
            const newTodo = {
                key: uuid.v4(),
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
    }

    input[type="text"] {
        flex: 8;
        padding: 10px;
        font-size: 16px;
        outline: none;
        border: 1px solid #ccc;
    }

    input[type="submit"] {
        flex: 1;
        font-size: 16px;
        outline: none;
    }

    select {
        flex: 1;
        appearance: none;
        padding: 10px;
        font-size: 16px;
        outline: none;
        border: 1px solid #ccc;
        border-radius: 0;
    }
</style>
