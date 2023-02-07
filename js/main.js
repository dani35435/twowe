let eventBus = new Vue();


Vue.component ("tabl",{
    props: {
        tabs_data: {
            type: Object,
            default() {
                return {}
            }
        },
        note: {
            type: Array,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            title: null,
            task: [],
        }
    },
    methods: {
        column1Move(){
            this.$emit('column1_move')
        },
        column2Move(){
            this.$emit('column2_move')
        },
        addTask() {
            if (this.title) {
                this.data.tasks.push({
                    title: this.title,
                    completed: false,
                });
                this.title = null;
                if(this.data.completNum <= 50) localStorage.todo = JSON.stringify(this.note);
                else if(this.data.completNum === 100) localStorage.todo3 = JSON.stringify(this.note);
                else localStorage.todo2 = JSON.stringify(this.note);
            }
        },
        checkbox(id) {
            this.data.tasks[id].completed = !this.data.tasks[id].completed;
            let counterCompleted = 0;
            let counterNotCompleted = 0;
            for (let el of this.data.tasks) {
                if (el.completed) {
                    counterCompleted++;
                } else {
                    counterNotCompleted++;
                }
            }
            this.data.completNum = (counterCompleted / (counterCompleted + counterNotCompleted)) * 100;
            this.column1Move();
            this.column2Move();
            if(this.data.completNum <= 50) localStorage.todo = JSON.stringify(this.note);
            else if(this.data.completNum === 100) localStorage.todo3 = JSON.stringify(this.note);
            else localStorage.todo2 = JSON.stringify(this.note);
        }

    },
    template: `
    <div class="list">
            <div class="create_task">
                <h3 class="title_block">{{data.noteTitle}}</h3>
                <button @click="delNote()">X</button>
            </div>
            <div class="task">
                <div v-for="(element, elementId) in data.tasks" :key="elementId">
                    <div class="set_task">
                        <p class="title_task">{{element.title}}</p>
                        <input @click="checkbox(elementId),column1Move() "  type="checkbox" v-model="element.completed" :class="{none: data.completNum === 100}">
                    </div>
                </div>
                <div class="add_task" :class="{none: data.tasks.length >= 5}">                  
                    <div class="add_task_input">
                        <input required type="text" @keyup.enter="addTask" v-model="title" placeholder="Задача">
                    </div>
                    <button @click="addTask">Добавить</button>
            </div>
        </div>
    </div>
    
    `,
})

Vue.component('center-list', {
    props: {
        data: {
            type: Object,
            default() {
                return {}
            }
        },
        note: {
            type: Array,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            taskTitle: null,
            task: [],
        }

    },
    methods: {
        addTask() {
            if (this.taskTitle) {
                this.data.tasks.push({
                    taskTitle: this.taskTitle,
                    completed: false,
                });
                this.taskTitle = null;
                localStorage.todo = JSON.stringify(this.note)
            }
        },
        checkbox(id){
            this.data.tasks[id].completed = !this.data.tasks[id].completed;
            let counterCompleted = 0;
            let counterNotCompleted = 0;
            for (let el of this.data.tasks) {
                if (el.completed) {
                    counterCompleted++;
                } else {
                    counterNotCompleted++;
                }
            }
            this.data.completedNum = (counterCompleted / (counterCompleted + counterNotCompleted)) * 100;
            localStorage.todo = JSON.stringify(this.note);
        },
    },
    template: `
    <div class="center-list">
        <div class="column column2" v-if="data.completedNum > 50">
            <div class="create_task">
                <h3 class="title_block">{{data.noteTitle}}</h3>
                <button @click="delNote()">X</button>
            </div>
            <div class="task">
                <div v-for="(element, elementId) in data.tasks" :key="elementId">
                    <div class="set_task">
                        <p class="title_task">{{element.taskTitle}}</p>
                        <input @click="checkbox(elementId)" type="checkbox" v-model="element.completed">
                    </div>
                </div>
                <div class="add_task">
                    <div class="add_task_input">
                        <input type="text" @keyup.enter="addTask" v-model="taskTitle" placeholder="Задача">
                    </div>
                    <button @click="addTask">Добавить</button>
                </div>
            </div>
        </div>
    </div>
    `,
})


let app = new Vue({
    el: '#app',
    data: {
        note: [],
        note2: [],
        note3: [],
        noteTitle: null,
        todos: [],
    },
    computed: {},
    mounted() {
        if (localStorage.todo) {
            this.note = JSON.parse(localStorage.todo);
        }
        if (localStorage.todo2) {
            this.note2 = JSON.parse(localStorage.todo2);
        }
        if (localStorage.todo3) {
            this.note3 = JSON.parse(localStorage.todo3);
        }
    },
    methods: {
        addInTodos() {
            this.todos.push({
                note: this.note,
                note2: this.note2,
                note3: this.note3
            })

        },
        createNote() {
            if (this.noteTitle) {
                this.note.push({
                    noteTitle: this.noteTitle,
                    tasks: [],
                    completNum: 0,
                });
                this.noteTitle = null;
                localStorage.todo = JSON.stringify(this.note);
            }
        },
        moveColumn1(){
            for (let i = 0; i < this.note.length; i++){
                if(this.note[i].completNum > 50){
                    this.note2.push(this.note[i])
                    this.note.splice(this.note[i], 1)
                }
            }
            localStorage.todo = JSON.stringify(this.note);
            localStorage.todo2 = JSON.stringify(this.note2);

        },
        moveColumn2(){
            for (let i = 0; i < this.note2.length; i++){
                if(this.note2[i].completNum === 100){
                    this.note3.push(this.note2[i])
                    this.note2.splice(this.note2[i], 1)
                }
            }
            localStorage.todo2 = JSON.stringify(this.note2);
            localStorage.todo3 = JSON.stringify(this.note3);
        },
    },
})