import {fetch, set, remove} from '../api.mjs'

export const ObjectTypeComponent = {
    props: ['object_type'],
    data() {
        return {
        }
    },
    computed: {
    },
    methods: {
        edit_object_type(event) {
            this.$parent.edit_object_type(this.object_type);
        },
        async remove_object_type(event) {
            const response = await remove("/object_types/" + this.object_type.id);
            if(response.status == 200) {
                alert("Тип объекта удалён!");
                this.$parent.update_object_types();
            }
            else
                alert("Ошибка");
        }
    },
    mounted () {
    },
    template:
    `<li class="list-group-item d-flex flex-column">
        <div>
            <div class="row">
                <div class="col-md-12 d-flex flex-row justify-content-between align-items-center">
                    <h4 style="margin: 0px;">Тип #{{object_type.id}}: {{object_type.name}}</h4>
                    <div class="d-flex flex-row">
                        <button class="btn btn-primary btn-edit d-flex flex-grow-0" type="button" v-on:click="edit_object_type"><img src="assets/img/edit.svg" width="24" height="24" style="filter: invert(100%);"/></button>
                        <button class="btn btn-danger btn-delete d-flex flex-grow-0" type="button" data-bs-toggle="tooltip" title="Удалить" v-on:click="remove_object_type">X</button>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col d-flex flex-column">
                    <span>Разрешённые состояния: <span v-for="(status,index) in object_type.statusTypes">{{status}}<span v-if="index != (object_type.statusTypes.length - 1)">, </span></span></span>
                    <span class="schema-title">Схема поведения:</span>
                    <textarea v-model="object_type.schema" readonly></textarea>
                </div>
            </div>
        </div>
    </li>`
}

export const ObjectTypesComponent = {
    data() {
        return { 
            object_types: [],
        }
    },
    components: {
        'object-type-component': ObjectTypeComponent
    },
    methods: {
        create_object_type() {
            this.$parent.showObjectType('create');
        },
        edit_object_type(object_type) {
            this.$parent.showObjectType('edit', object_type);
        },
        update_object_types(event) {
            this.object_types = null;
            fetch("/object_types/").
                then(response => (this.object_types = response.data));
        }
    },
    mounted () {
        this.update_object_types();
    },
    template: `<ul class="list-group object-types">
                    <object-type-component v-bind:object_type="object_type" v-for="object_type in object_types">   
                </object-type-component>
                </ul>
                <div class="btn-group btn-group-lg d-flex justify-content-around toolbar" role="group">
                    <button class="btn btn-primary d-flex flex-grow-0" type="button" v-on:click="update_object_types" style="border-radius: 8px;">Обновить</button>
                    <button class="btn btn-secondary d-flex flex-grow-0" type="button" v-on:click="create_object_type" style="border-radius: 8px;">Создать</button>
                </div>`
}