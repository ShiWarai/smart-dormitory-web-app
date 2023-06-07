import {fetch, set, create} from '../api.mjs'

export const ObjectTypeComponent = {
    props: ['object_type', 'mode'],
    data() {
        return { 
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
            this.update_statuses();
        },
        update_statuses(event) {
            fetch("/status_types/").
                then(response => (this.statuses = response.data));
        },
        async create_object_type(event) {
            
            if(this.mode == 'create') {
                const response = await create("/object_types/", this.object_type);
                
                if(response.status == 201)
                {
                    alert("Создан новый тип объекта!");
                    this.$parent.changeWindow('object-type', 'object-types');
                }
                else
                    alert("Ошибка");
            } else {
                const response = await set("/object_types/" + this.object_type.id, this.object_type);
                
                if(response.status == 200)
                {
                    alert("Изменён тип объекта!");
                    this.$parent.changeWindow('object-type', 'object-types');
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
    <h1 class="text-center form-heading">Тип объекта</h1>
    <div class="form-block">
        <form v-on:submit.prevent="create_object_type">
            <div class="mb-3">
                Имя типа
                <input class="form-control" type="text" placeholder="Имя" v-model="object_type.name" required/>
            </div>
            <div class="mb-3">
                Схема поведения
                <textarea class="form-control" rows="6" placeholder="Схема поведения" v-model="object_type.schema"></textarea>
            </div>
            <div class="mb-3">
                Доступные типы состояния
                <select class="form-select" v-model="object_type.statusTypes" multiple>
                    <option :value="status.id" v-for="status in this.statuses">{{status.description}}</option>
                </select>
            </div>
            <div class="d-flex">
                <button class="btn btn-primary d-block w-100" type="submit">{{this.modeName}}</button>
            </div>
        </form>
    </div>
    `
}