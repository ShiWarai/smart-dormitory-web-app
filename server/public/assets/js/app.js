username = "7412369"
password = "1111"

function update_element(endpoint) {
    return axios.get(HOST + endpoint, {
                        auth: {
                            username: username,
                            password: password
                        }
                    })
}

const RoomComponent = {
    props: ['room'],
    data() {
        return { 
            residents: [],
            typeName: null
        }
    },
    computed: {
        typeName: function () {

        },
        residents: function () {
            return this.firstName + ' ' + this.lastName
        }
    },
    methods: {
        update_residents(event) {
            update_element("/residents/by?room_id=" + this.room.id).
                then(response => (this.residents = response.data));
        },
        update_type(event) {
            update_element("/room_types/" + this.room.typeId).
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
    props: ['rooms'],
    components: {
        'room-component': RoomComponent
    },
    template: `<ul class="list-group rooms">
                <room-component v-bind:room="room" v-for="room in rooms">   
                </room-component>
                </ul>`
}

const SmartDormitoryApp = {
    data() {
        return { 
            rooms: [],
        }
    },
    components: 
    {
        RoomsComponent
    },
    methods: {
        update_rooms(event) {
            update_element("/rooms/").
                then(response => (this.rooms = response.data));
        },
    },
    mounted () {
        this.update_rooms();
    }
}

app = Vue.createApp(SmartDormitoryApp);
app.mount('#app');