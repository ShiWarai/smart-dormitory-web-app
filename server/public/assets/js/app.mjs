import {fetch, set, options} from './api.mjs'
import {RoomsComponent} from './components/rooms.mjs'
import {RoomComponent} from './components/room.mjs'
import {ObjectsComponent} from './components/objects.mjs'
import {ReportsComponent} from './components/reports.mjs'
import {ResidentsComponent} from './components/residents.mjs'
import {ResidentComponent} from './components/resident.mjs'

const SmartDormitoryApp = {
    data() {
        return { 
            currentPage: 'login',
            user: {
                studentId: "1234567",
                password: "1111",
            },
            authorized: false,
            login_error: null,
            currentRoom: null,
            currentResident: null,
        }
    },
    methods: {
        async authorize(event) {
            options.auth.username = this.user.studentId;
            options.auth.password = this.user.password;
            
            const response = 
                  await fetch("/residents/" + this.user.studentId);
            
            if (response.status == 200) 
            {
                if(response.data.roleId == 0){
                    this.user = response.data;
                    this.authorized = true;
                
                    this.changeWindow('login', 'residents');
                } else {
                    this.authorized = false;

                    this.changeWindow('login', 'login');
                    this.login_error = "Нет доступа";
                }
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
        },
        showRoom(status, room) {
            switch(status) {
                case 'new':
                    this.currentRoom = {id: null, name: null, typeId: null, position: "{}"};
                    break;
            }
            
            this.changeWindow(this.currentPage, 'room');
        },
        showResident(status, resident) {
            switch(status) {
                case 'new':
                    this.currentResident = {id: null, fio: null, birthdate: null, roleId: null, roomId: null, studentId: null, password: null};
                    break;
            }
            
            this.changeWindow(this.currentPage, 'resident');
        }
    },
    mounted () {
        // Check connection
        fetch("/ping", false).
            then(response => (this.login_error = (response.status == 200) ? null : "Ошибка подключения")).
            catch(error => (this.login_error = (error.response) ? null : "Проблема с подключением к серверу"))
    },
    components: 
    {
        RoomsComponent,
        RoomComponent,
        ObjectsComponent,
        ResidentsComponent,
        ResidentComponent,
        ReportsComponent
    }
}

const app = Vue.createApp(SmartDormitoryApp);
app.mount('#body');