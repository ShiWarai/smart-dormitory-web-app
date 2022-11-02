import {fetch, set} from '../api.mjs'

export const RoomComponent = {
    props: ['room'],
    data() {
        return { 
            residents: [],
            typeName: null
        }
    },
    methods: {
        update_residents(event) {
            fetch("/residents/by?room_id=" + this.room.id).
                then(response => (this.residents = response.data));
        },
        update_type(event) {
            fetch("/room_types/" + this.room.typeId).
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

export const RoomsComponent = {
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
            fetch("/rooms/").
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