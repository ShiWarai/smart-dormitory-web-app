import {fetch, set, remove} from '../api.mjs'

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
        async remove_room(event) {
            if(this.residents.length == 0 && this.objects.length == 0) {
                const response = await remove("/rooms/" + this.room.id);

                if(response.status == 200) {
                    alert("Комната удалена!");
                    this.$parent.update_rooms();
                }
                else
                    alert("Ошибка");
            } else {
                alert("Вы не можете удалить данную комнату - в ней есть сущности");
            }
        },
        update_residents(event) {
            fetch("/residents/by?room_id=" + this.room.id).
                then(response => (this.residents = response.data));
        },
        update_objects(event) {
            fetch("/objects/by?room_id=" + this.room.id).
                then(response => (this.objects = response.data));
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
    <div class="container">
        <div class="row">
            <div class="col-md-12 d-flex flex-row justify-content-between">
                <h4>{{room.name}}</h4>
                <button class="btn btn-danger btn-delete d-flex flex-grow-0" type="button" data-bs-toggle="tooltip" title="Удалить" v-on:click="remove_room">X</button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 d-flex flex-column">
                <span style="margin: 3px 0px;">Тип: {{this.typeName}}</span>
                <span style="margin: 3px 0px;">Жители: <span v-for="(resident,index) in this.residents">{{resident.fio}}<span v-if="index != (this.residents.length - 1)">, </span></span></span>
                <span style="margin: 3px 0px;">Объекты: <span v-for="(object,index) in this.objects">{{object.name}}<span v-if="index != (this.objects.length - 1)">, </span></span></span>
            </div>
        </div>
    </div>
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
            this.$parent.showRoom('create');
        }
    },
    mounted () {
        this.update_rooms();
    },
    template: `<ul class="list-group rooms">
                <room-li-component v-bind:room="room" v-for="room in rooms">   
                </room-li-component>
                </ul>
                <div class="btn-group btn-group-lg d-flex justify-content-around" role="group" style="margin: 10px;"><button class="btn btn-primary d-flex flex-grow-0" type="button" v-on:click="update_rooms" style="border-radius: 8px;">Обновить</button><button class="btn btn-secondary d-flex flex-grow-0" type="button" v-on:click="create_room" style="border-radius: 8px;">Создать</button></div>`
}