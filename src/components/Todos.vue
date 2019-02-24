<template>
    <div id="todo-wrapper">
        <div v-for="todo in todos" :key="todo.key" v-on:dragstart="dragStart" v-on:dragover="dragOver" v-on:dragend="dragEnd" draggable="true" class="todo-item" v-bind:class="{'is-complete': todo.completed}">
            <p>
                <input type="checkbox" v-on:change="$emit('is-complete', todo.completed, todo.key)">
                {{todo.title}} - {{todo.due}}
                <button @click="$emit('del-todo', todo.key)" class="del"><strong>X</strong></button>
            </p>
        </div>
    </div>
</template>

<script>
let DRAG_EL = '';
let TODO_WRAPPER = '';
let OLD_INDEX = 0;
export default {
    name: "Todos",
    props: ["todos"],
    methods: {
        markComplete() {
            this.todo.completed = !this.todo.completed
        },
        dragStart(e) {
            TODO_WRAPPER = document.querySelector('#todo-wrapper');
            const todoNodes = document.querySelectorAll('#todo-wrapper div');

            for (var i = 0; i < todoNodes.length; i++) {

                todoNodes[i].index = i;
                OLD_INDEX = e.target.index;
            }

            DRAG_EL = e.target;

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('Text', DRAG_EL.textContent);

            setTimeout(function() {

                DRAG_EL.classList.add('ghost');

            }, 0);
        },
        dragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            let target = e.target;
            if (target && target !== DRAG_EL && target.nodeName == 'DIV') {

                TODO_WRAPPER.insertBefore(DRAG_EL, target.nextSibling || target);

            }

        },
        dragEnd(e) {
            e.preventDefault();
            const todoNodes = document.querySelectorAll('#todo-wrapper div');

            let newIndex = 0;

            for (var i = 0; i < todoNodes.length; i++) {

                todoNodes[i].index = i;
                newIndex = e.target.index;

            }

            DRAG_EL.classList.remove('ghost');
            /*DRAG_EL.classList.add('hold');
            setTimeout(function(){
                DRAG_EL.classList.remove('hold');
            }, 300);*/

            const todos = this.todos;

            const getReorderedList = (OLD_INDEX, newIndex, todos) => {

                const movedTodo = todos.find((todo, index) => index === OLD_INDEX);
                const remainingTodos = todos.filter((todo, index) => index !== OLD_INDEX);
                const reorderedTodos = [];

                remainingTodos.forEach((todo, index) => {

                    if (index === newIndex) {

                        reorderedTodos.push(movedTodo);
                        reorderedTodos.push(todo);

                    } else {

                        reorderedTodos.push(todo);

                    }

                });

                if (newIndex === remainingTodos.length) reorderedTodos.push(movedTodo);

                return reorderedTodos;

            }

            const reorderedTodos = getReorderedList(OLD_INDEX, newIndex, todos);

            this.$emit('reordered-todos', reorderedTodos);

        }
    }
}
</script>

<style scoped>

    .ghost {
        opacity: .4;
    }

    input[type='checkbox'] {
        margin: 0 10px 0 5px;
        font-size: 20px;
    }

    .ns-resize-cursor {
        cursor: ns-resize;
    }

    .hold {
        /*box-shadow: 0 0 20px #61dafb;*/
    }

    .todo-item {
        background-color: #f4f4f4;
        padding: 10px;
        border-bottom: 1px #ccc dotted;
        font-size: 18px;
        cursor: ns-resize;
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
