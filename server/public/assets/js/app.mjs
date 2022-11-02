import {fetch, set, options} from './api.mjs'
import {RoomsComponent} from './components/rooms.mjs'
import {RoomComponent} from './components/room.mjs'
import {ObjectsComponent} from './components/objects.mjs'
import {ReportsComponent} from './components/reports.mjs'
import {ResidentsComponent} from './components/residents.mjs'

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
                this.user = response.data;
                this.authorized = true;
                
                this.changeWindow('login', 'rooms');
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
                    this.currentRoom = {id: null, name: null};
                    break;
            }
            
            this.changeWindow(this.currentPage, 'room');
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
        ReportsComponent
    }
}

const app = Vue.createApp(SmartDormitoryApp);
app.mount('#body');