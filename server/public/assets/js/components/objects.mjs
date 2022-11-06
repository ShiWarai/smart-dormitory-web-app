import {fetch, set, remove} from '../api.mjs'

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
        edit_object(event) {
            this.$parent.edit_object(this.object);
        },
        async remove_object(event) {
            const response = await remove("/objects/" + this.object.id);
            
            if(response.status == 200) {
                alert("Объект удалён!");
                this.$parent.update_objects();
            }
            else
                alert("Ошибка");
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
        <div class="container">
            <div class="row d-flex flex-row justify-content-between align-items-start">
                <div class="col-auto col-md-6 flex-grow-1">
                    <h4>{{object.name}}</h4>
                </div>
                <div class="col-md-6" style="width: auto;">
                    <div class="d-flex align-items-center my-auto form-check form-switch" style="padding: 0px;">
                        <input class="form-check-input" type="checkbox" style="width: 48px;height: 24px;margin: 0px;" v-model="this.status" v-on:change="change_status"/>
                        <button class="btn btn-primary btn-edit d-flex flex-grow-0" type="button" v-on:click="edit_object"><img src="assets/img/edit.svg" width="24" height="24" style="filter: invert(100%);" /></button>
                        <button class="btn btn-danger d-flex flex-grow-0 btn-delete" type="button" v-on:click="remove_object">X</button>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 d-flex flex-column">
                    <span style="margin: 3px 0px;">Тип: {{this.typeName}}</span>
                    <span style="margin: 3px 0px;">Статус: {{this.statusName}}</span>
                </div>
            </div>
        </div>
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
        create_object() {
            this.$parent.showObject('create');
        },
        edit_object(object) {
            this.$parent.showObject('edit', object);
        },
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
                <div class="btn-group btn-group-lg d-flex justify-content-around toolbar" role="group"><button class="btn btn-primary d-flex flex-grow-0" type="button" v-on:click="update_objects" style="border-radius: 8px;">Обновить</button><button class="btn btn-secondary d-flex flex-grow-0" type="button" v-on:click="create_object" style="border-radius: 8px;">Создать</button></div>`
}