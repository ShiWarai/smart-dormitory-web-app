import {fetch, set} from '../api.mjs'

export const ObjectComponent = {
    props: ['objectProp'],
    data() {
        return { 
            object: this.objectProp,
            typeName: null,
            roomName: null,
            statusName: null,
            status: this.objectProp.statusId == 100
        }
    },
    methods: {
        update(event) {
            fetch("/objects/" + this.object.id).
                then(response => {this.object = response.data; this.update_type(); this.update_status()});
            
        },
        update_type(event) {
            fetch("/object_types/" + this.object.typeId).
                then(response => (this.typeName = response.data.name));
        },
        update_room(event) {
            fetch("/rooms/" + this.object.roomId).
                then(response => (this.roomName = response.data.name));
        },
        update_status(event) {
            fetch("/status_types/" + this.object.statusId).
                then(response => (this.statusName = response.data.description));
        },
        async set_status(newStatus) {
            const response = await set("/objects/status/" + this.object.id + "/" + newStatus, null)
            return response.status;
        },
        async change_status(event) {
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
        this.update_room();
        this.update_status();
    },
    template:
    `<li class="list-group-item d-flex flex-row justify-content-between">
    <div>
        <div class="d-flex flex-column">
            <h4>{{this.object.name}}</h4>
            <span style="margin: 3px 0px;">Тип: {{this.typeName}}</span>
            <span>Комната: {{this.roomName}}</span>
            <span style="margin: 3px 0px;">Статус: {{this.statusName}}</span>
        </div>
    </div>
    <div class="d-flex align-items-center form-check form-switch"><input class="form-check-input" type="checkbox" style="width: 48px;height: 24px;margin: 0px;" :name="object.id" v-model="this.status" v-on:change="change_status"/></div>
    </li>`
}

export const ObjectsComponent = {
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
            fetch("/objects/").
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
                <div class="btn-group btn-group-lg d-flex justify-content-around" role="group" style="margin: 10px;"><button class="btn btn-primary d-flex flex-grow-0" type="button" v-on:click="update_objects" style="border-radius: 8px;">Обновить</button></div>`
}