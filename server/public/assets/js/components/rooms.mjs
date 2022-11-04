import {fetch, set} from '../api.mjs'

export const RoomElementComponent = {
    props: ['room'],
    data() {
        return { 
            residents: [],
            objects: [],
            typeName: null
        }
    },
    methods: {
        update_residents(event) {
            fetch("/residents/by?room_id=" + this.room.id).
                then(response => (this.residents = response.data));
        },
        update_objects(event) {
            fetch("/objects/by?room_id=" + this.room.id).
                then(response => {this.objects = response.data; console.log(this.objects)});
        },
        update_type(event) {
            fetch("/room_types/" + this.room.typeId).
                then(response => (this.typeName = response.data.name));
        }
    },
    mounted () {
        this.update_residents();
        this.update_type();
        this.update_objects();
    },
    template:
    `<li class="list-group-item d-flex flex-column">
        <h4>{{room.name}}</h4>
        <span style="margin: 3px 0px;">Тип: {{this.typeName}}</span>
        <span style="margin: 3px 0px;">Жители: <span v-for="(resident,index) in this.residents">{{resident.fio}}<span v-if="index != (this.residents.length - 1)">, </span></span></span>
        <span style="margin: 3px 0px;">Объекты: <span v-for="(object,index) in this.objects">{{object.name}}<span v-if="index != (this.objects.length - 1)">, </span></span></span>
    </li>`
}

export const RoomsComponent = {
    data() {
        return { 
            rooms: [],
        }
    },
    components: {
        'room-li-component': RoomElementComponent
    },
    methods: {
        update_rooms(event) {
            this.rooms = null
            fetch("/rooms/").
                then(response => (this.rooms = response.data));
        },
        create_room(event) {
            this.$parent.showRoom('new');
        }
    },
    mounted () {
        this.update_rooms();
    },
    template: `<ul class="list-group rooms">
                <room-li-component v-bind:room="room" v-for="room in rooms">   
                </room-li-component>
                </ul>
                <div class="btn-group btn-group-lg d-flex justify-content-around" role="group" style="margin: 10px;"><button class="btn btn-primary d-flex flex-grow-0" type="button" v-on:click="update_rooms" style="border-radius: 8px;">Обновить</button><button class="btn btn-secondary d-flex flex-grow-0" type="button" v-on:click="create_room" style="border-radius: 8px;">Создать</button><button class="btn btn-danger disabled d-flex flex-grow-0" type="button" v-on:click style="border-radius: 8px;" disabled>Удалить всё</button></div>`
}