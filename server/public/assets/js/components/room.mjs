import {fetch, set, create} from '../api.mjs'

export const RoomComponent = {
    props: ['room'],
    data() {
        return { 
            roomTypes: [],
        }
    },
    methods: {
        update_types(event) {
            fetch("/room_types/").
                then(response => (this.roomTypes = response.data));
        },
        async create_room(event) {
            const response = await create("/rooms/", this.room);
            if(response.status == 201)
            {
                alert("Создана новая комната!");
                this.$parent.changeWindow('room', 'rooms');
            }
            else
                alert("Ошибка");
        }
    },
    mounted () {
        this.update_types();
    },
    template:
    `<h1 class="text-center form-heading">Комната</h1>
    <div style="min-width: 400px;">
        <form v-on:submit.prevent="create_room">
            <div class="mb-3"><input class="form-control" type="text" name="name" placeholder="Имя комнаты (номер)" v-model="room.name"/></div>
            <div class="mb-3"><select class="form-select" name="typeId" v-model="room.typeId" required>
                    <option :value="roomType.id" v-for="roomType in this.roomTypes">{{roomType.name}}</option>
                </select></div>
            <div class="mb-3"><textarea class="form-control" name="position" rows="6" placeholder="Положение" v-model="room.position"></textarea></div>
            <div class="d-flex"><button class="btn btn-primary d-block w-100" type="submit">Создать</button></div>
        </form>
    </div>`
}