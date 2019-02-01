<template>
    <div>
        <div v-bind:key="todo.id" v-for="todo in todos">
            <TodoItem v-bind:todo="todo" v-on:del-todo="$emit('del-todo', todo.key)" v-on:is-complete="$emit('is-complete', todo.completed, todo.key)"/>
        </div>
    </div>
</template>

<script>
import TodoItem from './TodoItem';
export default {
    name: "Todos",
    components: {
        TodoItem
    },
    props: ["todos"]
}
</script>

<style scoped>
</style>
