<template>
    <div class="todo-item" v-bind:class="{'is-complete': todo.completed}">
        <p>
            <input type="checkbox" v-on:change="$emit('is-complete', todo.completed, todo.key)">
            {{todo.title}} - {{todo.due}}
            <button @click="$emit('del-todo', todo.key)" class="del"><strong>X</strong></button>
        </p>
    </div>
</template>

<script>
export default{
    name: "TodoItem",
    props: ["todo"],
    methods: {
        markComplete() {
            this.todo.completed = !this.todo.completed
        }
    }
}
</script>

<style scoped>

    input[type='checkbox'] {
        margin: 0 10px 0 5px;
        font-size: 20px;
    }

    .todo-item {
        background: #f4f4f4;
        padding: 10px;
        border-bottom: 1px #ccc dotted;
        font-size: 18px;
    }

    .is-complete {
        text-decoration: line-through;
    }

    .del {
        background: #c9302c;
        color: #fff;
        border: none;
        padding: 5px 8px;
        border-radius: 50%;
        cursor: pointer;
        float: right;
        outline: none;
    }
</style>
