let eventBus = new Vue();

Vue.component('note', {
    props: {
        record_data: {
            type: Object,
            default() {
                return {}
            }
        },

        notes: {
            type: Array,
            default() {
                return {}
            }
        },

        idColumn: {
            type: Object,
            default() {
                return {}
            }
        },

        about:{
            type: Object,
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
        column1Move() {
            this.$emit('column1_move')
        },

        delNote() {
            this.$emit('del_note')
        },

        column2ChangeLeft() {
            this.$emit('column2_move_left')
        },

        column2Move() {
            this.$emit('column2_move')
        },

        addTask() {
            if (this.taskTitle) {
                this.record_data.tasks.push({
                    taskTitle: this.taskTitle,
                    completed: false,
                });
                this.taskTitle = null;
                this.updateCompletedNum();
                this.save();
            }
        },

        updateCompletedNum() {
            let counterCompleted = 0;
            let counterNotCompleted = 0;
            for (let el of this.record_data.tasks) {
                if (el.completed) {
                    counterCompleted++;
                } else {
                    counterNotCompleted++;
                }
            }
            this.record_data.completedNum = (counterCompleted / (counterCompleted + counterNotCompleted)) * 100;
        },

        checkbox(id) {
            this.record_data.tasks[id].completed = !this.record_data.tasks[id].completed;
            this.updateCompletedNum();
            this.save();
        },

        save() {
            if (this.idColumn === 1 && this.record_data.completedNum <= 50) localStorage.todo = JSON.stringify(this.notes);
            else if (this.idColumn === 3 && this.record_data.completedNum === 100) localStorage.todo3 = JSON.stringify(this.notes);
            else localStorage.todo2 = JSON.stringify(this.notes);
        }
    },

    template: `
    <div class="note" >
            <div class="note_title_block">
                <h2 class="note_title">{{record_data.note}}</h2>
                <button @click="delNote()">X</button>
            </div>
            <div class="tasks">
                <div v-for="(element, elementId) in record_data.tasks" :key="elementId" class="task">
                    <div class="set_task">
                        <h3 class="title_task">{{element.taskTitle}}</h3>
                        <input @click="checkbox(elementId),column1Move(),column2Move(),column2ChangeLeft()" 
                               type="checkbox" 
                               v-model="element.completed" 
                               :class="{none: record_data.completedNum === 100, disabled: record_data.completedNum > 50 && element.completed && about.lengthColumn1 === 3}" >
                    </div>
                    
                    <div class="date" v-if="record_data.date">
                        <p>{{record_data.time}}</p>
                        <p>{{record_data.date}}</p>
                    </div>
                </div>
                <div class="add_task" :class="{none: record_data.tasks.length >= 5 || record_data.completedNum === 100}">                  
                    <div class="add_task_input">
                        <input required type="text" @keyup.enter="addTask(),column2ChangeLeft()" v-model="taskTitle" placeholder="Задача">
                    </div>
                    <button @click="addTask(),column2ChangeLeft()">Добавить</button>
                    <div class="line"></div>
            </div>
        </div>
    </div>
    `,
})

let app = new Vue({
    el: '#app',
    data: {
        note: null,
        recordOne: null,
        recordTwo: null,
        recordThree: null,
        completed: false,
        about:{
            signal: false,
            bufColumn: [],
            id: null,
            lengthColumn1: null
        },

        column1: {
            notes: [],
            idColumn: 1
        },

        column2: {
            notes: [],
            idColumn: 2
        },

        column3: {
            notes: [],
            idColumn: 3
        }
    },

    computed: {

    },
    mounted() {
        if (localStorage.todo) {
            this.column1.notes = JSON.parse(localStorage.todo)
        }
        if (localStorage.todo2) {
            this.column2.notes = JSON.parse(localStorage.todo2)
        }
        if (localStorage.todo3) {
            this.column3.notes = JSON.parse(localStorage.todo3)
        }
        if (localStorage.about){
            this.about = JSON.parse(localStorage.about)
        }
    },

    methods: {
        creatingRecord() {
            if (this.note && this.column1.notes.length < 3 && this.recordOne && this.recordTwo && this.recordThree) {
                this.column1.notes.push({
                    note: this.note,
                    tasks: [
                        {
                            taskTitle: this.recordOne,
                            completed: this.completed
                        },
                        {
                            taskTitle: this.recordTwo,
                            completed: this.completed
                        },
                        {
                            taskTitle: this.recordThree,
                            completed: this.completed
                        }
                    ],
                    completedNum: 0,
                });
                this.note = null;
                this.recordOne = null;
                this.recordTwo = null;
                this.recordThree = null
                localStorage.todo = JSON.stringify(this.column1.notes);
            }
            this.length()
        },

        changeColumn1(id) {
            if (this.column1.notes[id].completedNum > 50 && this.column2.notes.length <= 5) {
                if (this.column2.notes.length === 5) {
                    this.about.signal = true;
                    this.about.bufColumn.push(this.column1.notes[id])
                    this.about.id = id
                }

                else if(this.about.bufColumn[0] && this.column2.notes.length === 4){
                    this.column2.notes.push(this.about.bufColumn[0])
                    this.about.bufColumn.splice(0, 1)
                    this.column1.notes.splice(this.about.id, 1)
                }

                else {
                    this.column2.notes.push(this.column1.notes[id])
                    this.column1.notes.splice(id, 1)
                }
            }
            this.length()
            localStorage.todo = JSON.stringify(this.column1.notes);
            localStorage.todo2 = JSON.stringify(this.column2.notes);
            localStorage.about = JSON.stringify(this.about)
        },

        changeColumn2(id) {
            if (this.column2.notes[id].completedNum === 100) {
                this.times(id);
                this.column3.notes.push(this.column2.notes[id]);
                this.column2.notes.splice(id, 1);
                this.changeColumn1(this.about.id)
                this.about.signal = false
            }
            localStorage.todo2 = JSON.stringify(this.column2.notes);
            localStorage.todo3 = JSON.stringify(this.column3.notes);
            localStorage.about = JSON.stringify(this.about)
        },

        changeColumn2Left(id) {
            if (this.column2.notes[id].completedNum <= 50) {
                this.column1.notes.unshift(this.column2.notes[id]);
                this.column2.notes.splice(id, 1);
                this.changeColumn1(this.about.id)
            }
            this.length()
            localStorage.todo = JSON.stringify(this.column1.notes);
            localStorage.todo2 = JSON.stringify(this.column2.notes);
        },

        delete1(id) {
            this.column1.notes.splice(id, 1);
            this.length()
            localStorage.todo = JSON.stringify(this.column1.notes);
        },

        delete2(id) {
            this.column2.notes.splice(id, 1);
            this.about.signal = false
            this.changeColumn1(this.about.id)
            localStorage.about = JSON.stringify(this.about)
            localStorage.todo2 = JSON.stringify(this.column2.notes);
        },

        delete3(id) {
            this.column3.notes.splice(id, 1);
            localStorage.todo3 = JSON.stringify(this.column3.notes);
        },

        times(id) {
            let Data = new Date();
            this.column2.notes[id].time = Data.getHours() + ':' + Data.getMinutes();
            this.column2.notes[id].date = Data.getDate() + ':' + Data.getMonth() + ':' + Data.getFullYear();
        },

        length(){
            this.about.lengthColumn1 = this.column1.notes.length;
            localStorage.about = JSON.stringify(this.about)
        }
    },
})