import {fetch, set, create} from '../api.mjs'

export const ObjectComponent = {
    props: ['object', 'mode'],
    data() {
        return {
            types: [],
            rooms: [],
            statuses: []
        }
    },
    computed: {
        modeName() {
            return this.mode == 'edit' ? "Изменить" : "Создать";
        }
    },
    methods: {
        update() {
            this.update_types();
            this.update_rooms();
            this.update_statuses();
        },
        update_types(event) {
            fetch("/object_types/").
                then(response => (this.types = response.data));
        },
        update_rooms(event) {
            fetch("/rooms/").
                then(response => (this.rooms = response.data));
        },
        update_statuses(event) {
            fetch("/status_types/").
                then(response => (this.statuses = response.data));
        },
        async create_object(event) {
            if(this.object.description == null)
                delete this.object.description;
            
            if(this.object.cloudId == null)
                delete this.object.cloudId;
            
            if(this.mode == 'create') {
                console.log(this.object);
                const response = await create("/objects/", this.object);
                
                if(response.status == 201)
                {
                    alert("Создан новый объект!");
                    this.$parent.changeWindow('object', 'objects');
                }
                else
                    alert("Ошибка");
            } else {
                const response = await set("/objects/" + this.object.id, this.object);
                
                if(response.status == 200)
                {
                    alert("Изменён объект!");
                    this.$parent.changeWindow('object', 'objects');
                }
                else
                    alert("Ошибка");
            }
        }
    },
    mounted () {
        this.update();
    },
    template:
    `
    <h1 class="text-center form-heading">Объект</h1>
    <div class="form-block">
        <form v-on:submit.prevent="create_object">
            <div class="mb-3"><input class="form-control" type="text" name="name" placeholder="Имя" v-model="object.name" required /></div>
            <div class="mb-3"><textarea class="form-control" name="description" v-model="object.description" placeholder="Описание"></textarea></div>
            <div class="mb-3"><select class="form-select" name="typeId" v-model="object.typeId" required>
                    <option :value="type.id" v-for="type in this.types">{{type.name}}</option>
                </select></div>
            <div class="mb-3"><select class="form-select" name="roomId" v-model="object.roomId" required>
                    <option :value="room.id" v-for="room in this.rooms">{{room.name}}</option>
                </select></div>
            <div class="mb-3"><select class="form-select" name="statusId" v-model="object.statusId" required>
                    <option :value="status.id" v-for="status in this.statuses">{{status.description}}</option>
                </select></div>
            <div class="mb-3"><input class="form-control" type="text" name="cloudId" placeholder="ID в облаке Smarthings" v-model="object.cloudId"/></div>
            <div class="d-flex">
                <button class="btn btn-primary d-block w-100" type="submit">{{this.modeName}}</button>
            </div>
        </form>
    </div>
    `
}