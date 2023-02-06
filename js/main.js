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
                if(this.data.completedNum <= 50) localStorage.todo = JSON.stringify(this.note);
                else if(this.data.completedNum === 100) localStorage.todo3 = JSON.stringify(this.note);
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
            this.data.completedNum = (counterCompleted / (counterCompleted + counterNotCompleted)) * 100;
            this.column1Move();
            this.column2Move();
            if(this.data.completedNum <= 50) localStorage.todo = JSON.stringify(this.note);
            else if(this.data.completedNum === 100) localStorage.todo3 = JSON.stringify(this.note);
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
                <div v-for="(element, elementId) in note_data.tasks" :key="elementId">
                    <div class="set_task">
                        <p class="title_task">{{element.title}}</p>
                        <input @click="checkbox(elementId),column1Move() "  type="checkbox" v-model="element.completed" :class="{none: note_data.completedNum === 100}">
                    </div>
                </div>
                <div class="add_task" :class="{none: note_data.tasks.length >= 5}">                  
                    <div class="add_task_input">
                        <input required type="text" @keyup.enter="addTask" v-model="title" placeholder="Задача">
                    </div>
                    <button @click="addTask">Добавить</button>
            </div>
        </div>
    </div>
    
    `,
})


let app = new Vue({
    el: '#app',
    data: {
        id: 0,
        title: '',
        content: '',
        posts: [],
        list: ''
    },
    beforeMount() {
        if(localStorage.data) {
            this.posts = JSON.parse(localStorage.data)
        }
    },
    methods: {
            addPost: function () {
            if (this.title === '') {
                alert('Введите название')
            } else {
                this.id++;
                this.posts.push({ id: this.id, title: this.title, content: [], checkbox: [false], list: this.list});
                this.title = '';
            }
        },
        deletePost: function (index) {
            this.posts.splice(index, 1);
            localStorage.data = JSON.stringify(this.posts)
        },
        addContent: function (index) {
            if (this.content === '') {
                alert('Заполните поле')
            } else {
                this.posts[index].content.push(this.content);
                this.content = '';
            }
        },
        deleteContent: function (index,indexContent) {
            this.posts[index].content.splice(indexContent, 1);
            this.posts[index].checkbox.splice(indexContent, 1);
        },
        addCheckbox: function() {
            this.posts[index].checkbox[indexContent] = !this.posts[index].checkbox[indexContent]
        },
    },
    updated() {
        localStorage.data = JSON.stringify(this.posts)
    }
})