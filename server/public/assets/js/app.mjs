import {fetch, set} from './api.mjs'

const options =   {
                auth: {
                    username: "",
                    password: ""
                },
                validateStatus: function (status) {
                    return status < 500;
                }
            }

const RoomComponent = {
    props: ['room'],
    data() {
        return { 
            residents: [],
            typeName: null
        }
    },
    methods: {
        update_residents(event) {
            fetch("/residents/by?room_id=" + this.room.id, options).
                then(response => (this.residents = response.data));
        },
        update_type(event) {
            fetch("/room_types/" + this.room.typeId, options).
                then(response => (this.typeName = response.data.name));
        }
    },
    mounted () {
        this.update_residents();
        this.update_type();
    },
    template:
    `<li class="list-group-item d-flex flex-column">
        <h4>{{room.name}}</h4>
        <span style="margin: 3px 0px;">Тип: {{this.typeName}}</span>
        <span style="margin: 3px 0px;">Жители: <span v-for="(resident,index) in this.residents">{{resident.fio}}<span v-if="index != (residents.length - 1)">, </span></span></span>
    </li>`
}

const RoomsComponent = {
    data() {
        return { 
            rooms: [],
        }
    },
    components: {
        'room-component': RoomComponent
    },
    methods: {
        update_rooms(event) {
            this.rooms = null
            fetch("/rooms/", options).
                then(response => (this.rooms = response.data));
        }
    },
    mounted () {
        this.update_rooms();
    },
    template: `<ul class="list-group rooms">
                <room-component v-bind:room="room" v-for="room in rooms">   
                </room-component>
                </ul>
                <div class="btn-group btn-group-lg d-flex justify-content-around" role="group" style="margin: 10px;"><button class="btn btn-primary d-flex flex-grow-0" type="button" v-on:click="update_rooms" style="border-radius: 8px;">Обновить</button><button class="btn btn-danger disabled d-flex flex-grow-0" type="button" v-on:click style="border-radius: 8px;" disabled>Удалить всё</button></div>`
}


const ObjectComponent = {
    props: ['objectProp'],
    data() {
        return { 
            object: this.objectProp,
            typeName: null,
            statusName: null,
            status: this.objectProp.statusId == 100
        }
    },
    methods: {
        update_type(event) {
            fetch("/object_types/" + this.object.typeId, options).
                then(response => (this.typeName = response.data.name));
        },
        update_status(event) {
            fetch("/status_types/" + this.object.statusId, options).
                then(response => (this.statusName = response.data.description));
        },
        update() {
            fetch("/objects/" + this.object.id, options).
                then(response => {this.object = response.data; this.update_type(); this.update_status()});
            
        },
        async set_status(newStatus) {
            const response = await set("/objects/status/" + this.object.id + "/" + newStatus, null, options)
            return response.status;
        },
        async changeStatus(event) {
            let newStatus = this.status ? 100 : 200;
            const statusCode = await this.set_status(this.status ? 100 : 200);
            
            if(statusCode == 200)
               this.update();
            else
                this.status = !this.status;
        }
    },
    mounted () {
        this.update_type();
        this.update_status();
    },
    template:
    `<li class="list-group-item d-flex flex-row justify-content-between">
    <div>
        <div class="d-flex flex-column">
            <h4>{{this.object.name}}</h4>
            <span style="margin: 3px 0px;">Тип: {{this.typeName}}
            </span><span style="margin: 3px 0px;">Статус: {{this.statusName}}</span>
        </div>
    </div>
    <div class="d-flex align-items-center form-check form-switch"><input class="form-check-input" type="checkbox" style="width: 48px;height: 24px;margin: 0px;" :name="object.id" v-model="this.status" v-on:change="changeStatus"/></div>
    </li>`
}

const ObjectsComponent = {
    data() {
        return { 
            objects: [],
        }
    },
    components: {
        'object-component': ObjectComponent
    },
    methods: {
        update_objects(event) {
            this.objects = null;
            fetch("/objects/", options).
                then(response => (this.objects = response.data));
        }
    },
    mounted () {
        this.update_objects();
    },
    template: `<ul class="list-group objects">
                <object-component v-bind:objectProp="object" v-for="object in objects">   
                </object-component>
                </ul>
                <div class="btn-group btn-group-lg d-flex justify-content-around" role="group" style="margin: 10px;"><button class="btn btn-primary d-flex flex-grow-0" type="button" v-on:click="update_objects" style="border-radius: 8px;">Обновить</button><button class="btn btn-danger disabled d-flex flex-grow-0" type="button" v-on:click style="border-radius: 8px;" disabled>Удалить всё</button></div>`
}

const SmartDormitoryApp = {
    data() {
        return { 
            currentPage: 'login',
            user: {
                studentId: null,
                password: null,
            },
            authorized: false,
            login_error: null
        }
    },
    methods: {
        async authorize(event) {
            options.auth.username = this.user.studentId;
            options.auth.password = this.user.password;
            
            const response = 
                  await fetch("/residents/" + this.user.studentId, options);
            
            if (response.status == 200) 
            {
                this.user = response.data;
                this.authorized = true;
                
                this.changeWindow('login', 'rooms')
            } else {
                this.authorized = false;
                
                this.changeWindow('login', 'login');
                this.login_error = "Неправильные данные";
            }
        },
        logout(event) {
            this.user = {
                studentId: null,
                password: null,
            };
            this.authorized = false;
            
            this.changeWindow(this.currentPage, 'login');
            this.login_error = null;
        },
        changeWindowHandle(event) {
            this.changeWindow(this.currentPage, event.target.name);
        },
        changeWindow(oldW, newW) {
            if(this.authorized) {
                this.currentPage = newW;
            } else {
                this.login_error = "Не авторизован";
                this.currentPage = 'login';
            }
        }
    },
    components: 
    {
        RoomsComponent,
        ObjectsComponent
    }
}

const app = Vue.createApp(SmartDormitoryApp);
app.mount('#body');