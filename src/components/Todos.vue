<template>
    <div id="todo-wrapper">
        <div v-for="todo in todos" :key="todo.key" :data-key="todo.key" v-on:dragstart="dragStart" v-on:touchstart="touchStart" v-on:dragover="dragOver" v-on:touchmove="touchMove" v-on:dragend="dragEnd" v-on:touchend="touchEnd" draggable="true" class="todo-item" v-bind:class="{'is-complete': todo.completed}">
            <p>
                <!--<input type="checkbox" v-on:change="$emit('is-complete', todo.completed, todo.key)">-->
                {{todo.title}} <span v-if="todo.due">-</span> {{todo.due}}
            </p>
            <button @click="$emit('del-todo', todo.key)" class="del">delete <br>x</button>
        </div>
    </div>
</template>

<script>

let DRAG_EL = '';
let TODO_WRAPPER = '';
let OLD_INDEX = 0;
let LIST = '';

export default {
    name: "Todos",
    props: ["todos"],
    methods: {
        markComplete() {
            this.todo.completed = !this.todo.completed
        },
        dragStart(e) {
            if (window.innerWidth >= 600) {
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
            }
        },
        dragOver(e) {
            e.preventDefault();
            if (window.innerWidth >= 600) {
                e.dataTransfer.dropEffect = 'move';

                let target = e.target;
                if (target && target !== DRAG_EL && target.nodeName == 'DIV') {

                    TODO_WRAPPER.insertBefore(DRAG_EL, target.nextSibling || target);

                }
            }
        },
        dragEnd(e) {
            e.preventDefault();
            if (window.innerWidth >= 600) {
                const todoNodes = document.querySelectorAll('#todo-wrapper div');

                let newIndex = 0;

                for (var i = 0; i < todoNodes.length; i++) {

                    todoNodes[i].index = i;
                    newIndex = e.target.index;

                }

                DRAG_EL.classList.remove('ghost');

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
        },
        touchHandler(event){
            event.preventDefault();
            var touches = event.changedTouches,
                first = touches[0],
                type = "";
            switch(event.type)
            {
                case "touchstart": type = "dragstart"; break;
                case "touchmove":  type = "dragover"; break;
                case "touchend":   type = "dragend";   break;
                default:           return;
            }

            // initMouseEvent(type, canBubble, cancelable, view, clickCount,
            //                screenX, screenY, clientX, clientY, ctrlKey,
            //                altKey, shiftKey, metaKey, button, relatedTarget);

            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                          first.screenX, first.screenY,
                                          first.clientX, first.clientY, false,
                                          false, false, false, 0/*left*/, null);

            first.target.dispatchEvent(simulatedEvent);

            const todoNodes = document.querySelectorAll('#todo-wrapper div');

            for (var i = 0; i < todoNodes.length; i++) {

                todoNodes[i].index = i;
                OLD_INDEX = simulatedEvent.target.parentElement.index;

            }

            LIST = document.getElementById('todo-wrapper');
            new Slip(LIST);

            LIST.addEventListener('slip:reorder', function(simulatedEvent) {
                simulatedEvent.target.parentNode.insertBefore(simulatedEvent.target, simulatedEvent.detail.insertBefore);
            });

        },
        touchStart(e) {
            e.preventDefault();

            if (e.target.classList.contains('del')) {

                this.$emit('del-todo', e.target.parentElement.dataset.key);

            }

            this.touchHandler(e);
        },
        touchMove(){

        },
        touchEnd(event){
            event.preventDefault();

            const todoNodes = LIST.children;
            let startingIndex = 0;
            let newIndex = 0;
            let movedNodesUp = null;
            let movedNodesDown = null;

            for (var i = 0; i < todoNodes.length; i++) {

                if (todoNodes[i].getAttribute('style').indexOf('z-index') > -1){
                    //console.log('has z-index ', todoNodes[i]);
                    startingIndex = todoNodes[i].index;
                }

                if (todoNodes[i].getAttribute('style').indexOf('transform: translate(0px, 55px)') > -1){
                    //console.log('node moves down ', todoNodes[i]);
                    movedNodesDown = movedNodesDown + 1;
                }

                if (todoNodes[i].getAttribute('style').indexOf('transform: translate(0px, -55px)') > -1){
                    //console.log('node moves up ', todoNodes[i]);
                    movedNodesUp = movedNodesUp + 1;
                }

                if (startingIndex && movedNodesUp == null) {
                    //console.log('moving up from anywhere');
                    newIndex = (startingIndex - movedNodesDown);
                } else if (startingIndex >= 0 && movedNodesUp != null) {
                    //console.log('moving down NEW');
                    newIndex = (startingIndex + movedNodesUp);
                } else {
                    //console.log('moving down');
                    newIndex = (startingIndex + movedNodesUp);
                }

            }

            //console.log('STARTING INDEX ', startingIndex);
            //console.log("NEW INDEX", newIndex);
            //console.log("MOVED NODES DOWN", movedNodesDown);
            //console.log("MOVED NODES UP", movedNodesUp);

            const todos = this.todos;

            const getReorderedList = (startingIndex, newIndex, todos) => {

                const movedTodo = todos.find((todo, index) => index === startingIndex);
                const remainingTodos = todos.filter((todo, index) => index !== startingIndex);
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

            const reorderedTodos = getReorderedList(startingIndex, newIndex, todos);

            this.$emit('reordered-todos', reorderedTodos);

        }
    }
}
</script>

<style scoped>

    #todo-wrapper{
        position: relative;
    }

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

    .todo-item {
        position: relative;
        top: 0;
        left: 0;
        color: #353c43;
        background-color: #fff;
        padding: 15px 10px 15px 15px;
        font-size: 18px;
        cursor: ns-resize;
        margin-bottom: 1px;
    }

    .todo-item p {
        margin-right: 55px;
    }

    .del {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #e60000;
        border: 1px #cc0000 solid;
        color: #fff;
        border: none;
        padding: 5px 5px 5px 8px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 200;
        outline: none;
    }

    @media (min-width:600px){

        .del:hover {
            background: #FF0000;
            border: 1px #e60000 solid;
            top: 9px;
            right: 9px;
        }

        .del:active {
            background: #b30000;
            border: 1px #b30000 solid;
            top: 9px;
            right: 9px;
        }

    }

</style>
