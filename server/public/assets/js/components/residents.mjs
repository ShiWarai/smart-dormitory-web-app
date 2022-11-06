import {fetch, set, remove} from '../api.mjs'

export const ResidentComponent = {
    props: ['resident'],
    data() {
        return {
            roomName: null,
        }
    },
    computed: {
        roleName() {
            switch(this.resident.roleId) {
                case 0:
                    return 'комендант';
                case 1:
                    return 'охрана';
                case 2:
                    return 'персонал';
                case 3:
                    return 'житель';
            }
        }
    },
    methods: {
        edit_resident(event) {
            this.$parent.edit_resident(this.resident);
        },
        async remove_resident(event) {
            const response = await remove("/residents/" + this.resident.studentId);
            
            if(response.status == 200) {
                alert("Житель удалён!");
                this.$parent.update_residents();
            }
            else
                alert("Ошибка");
        },
        update_room(event) {
            fetch("/rooms/" + this.resident.roomId).
                then(response => (this.roomName = response.data.name));
        }
    },
    mounted () {
        this.update_room();
    },
    template:
    `<li class="list-group-item d-flex flex-column">
        <div>
            <div class="row">
                <div class="col-md-12 d-flex flex-row justify-content-between align-items-center">
                    <h4 style="margin: 0px;">{{resident.fio}}</h4>
                    <div class="d-flex flex-row">
                        <button class="btn btn-primary btn-edit d-flex flex-grow-0" type="button" v-on:click="edit_resident"><img src="assets/img/edit.svg" width="24" height="24" style="filter: invert(100%);"/></button>
                        <button class="btn btn-danger btn-delete d-flex flex-grow-0" type="button" data-bs-toggle="tooltip" title="Удалить" v-on:click="remove_resident">X</button>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col d-flex flex-column"><span>Роль: {{this.roleName}}</span><span>Комната: {{this.roomName}}</span></div>
            </div>
        </div>
    </li>`
}

export const ResidentsComponent = {
    data() {
        return { 
            residents: [],
        }
    },
    components: {
        'resident-component': ResidentComponent
    },
    methods: {
        create_resident() {
            this.$parent.showResident('create');
        },
        edit_resident(resident) {
            this.$parent.showResident('edit', resident);
        },
        update_residents(event) {
            this.residents = null
            fetch("/residents/").
                then(response => (this.residents = response.data));
        }
    },
    mounted () {
        this.update_residents();
    },
    template: `<ul class="list-group residents">
                    <resident-component v-bind:resident="resident" v-for="resident in residents">   
                </resident-component>
                </ul>
                <div class="btn-group btn-group-lg d-flex justify-content-around toolbar" role="group">
                    <button class="btn btn-primary d-flex flex-grow-0" type="button" v-on:click="update_residents" style="border-radius: 8px;">Обновить</button><button class="btn btn-secondary d-flex flex-grow-0" type="button" v-on:click="create_resident" style="border-radius: 8px;">Создать</button>
                </div>`
}