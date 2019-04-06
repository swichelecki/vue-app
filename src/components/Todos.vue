<template>
    <div id="todo-wrapper">
        <div v-for="todo in todos" :key="todo.key" v-on:dragstart="dragStart" v-on:touchstart="touchStart" v-on:dragover="dragOver" v-on:touchmove="touchMove" v-on:dragend="dragEnd" v-on:touchend="touchEnd" draggable="true" class="todo-item" v-bind:class="{'is-complete': todo.completed}">
            <p>
                <!--<input type="checkbox" v-on:change="$emit('is-complete', todo.completed, todo.key)">-->
                {{todo.title}} - {{todo.due}}
            </p>
            <button @click="$emit('del-todo', todo.key)" class="del">delete <br>x</button>
        </div>
    </div>
</template>

<script>
let DRAG_EL = '';
let TODO_WRAPPER = '';
let OLD_INDEX = 0;
//let MOVE_OFFSET_X = 0;
let MOVE_OFFEST_Y = 0;
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

        },
        /*resetZ() {
            let todos = document.querySelectorAll('.todo-item');
            for (var i = todos.length - 1; i >=0; i--){
                todos[i].style.zIndex = 5;
            }
        },*/
        touchHandler(event){

            console.log('touchHandler called');

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

            let funct = "";
            switch(event.type)
            {
                case "touchstart": funct = "dragStart"; break;
                case "touchmove":  funct = "dragOver"; break;
                case "touchend":   funct = "dragEnd";   break;
                default:           return;
            }

            let final = 'this.' + funct + '(' + simulatedEvent + ');';
            console.log(final);


            event.preventDefault();
        },
        touchStart(e) {
            e.preventDefault();
            this.touchHandler(e);
            /*let todoItem = e.target.parentElement;
            let touch = e.touches[0];
            let subtractFromPageY = 0;
            let todos = document.querySelectorAll('.todo-item');
            for (var i = 0; i <= todos.length - 1; i++){
                if (todos[i] == todoItem) {
                    break;
                } else {
                    subtractFromPageY += todos[i].offsetHeight;
                }
            }
            MOVE_OFFEST_Y = todoItem.offsetTop - (touch.pageY + subtractFromPageY);
            this.resetZ();
            todoItem.style.zIndex = 10;*/
        },
        touchMove(e){
            this.touchHandler(e);
            /*let todoItem = e.target.parentElement;
            let touch = e.touches[0];

            let positionY = touch.pageY + MOVE_OFFEST_Y;
            const todoWrapper = document.getElementById('todo-wrapper');
            const rect = todoWrapper.getBoundingClientRect();
            console.log(rect.top);
            console.log(touch.pageY);

            if (touch.pageY >= rect.top) {
                todoItem.style.top = positionY + 'px';
            } else {
                e.stopPropagation();
            }*/
        },
        touchEnd(e){
            this.touchHandler(e);
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

    .hold {
        /*box-shadow: 0 0 20px #61dafb;*/
    }

    .todo-item {
        position: relative;
        top: 0;
        left: 0;
        color: #353c43;
        background-color: #fff;
        padding: 15px 10px 15px 15px;
        /*border-bottom: 1px rgba(0,0,0,.12) solid;*/
        font-size: 18px;
        cursor: ns-resize;
        /*border-radius: 5px;*/
        margin-bottom: 1px;
        /*box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),
        0 3px 1px -2px rgba(0,0,0,.12);*/
    }

    .todo-item p {
        margin-right: 50px;
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

</style>
