import {fetch, set} from '../api.mjs'

export const ResidentComponent = {
    props: ['resident'],
    data() {
        return { 
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
        update_role(event) {
        }
    },
    mounted () {
        this.update_role();
    },
    template:
    `<li class="list-group-item d-flex flex-column">
        <h4>{{resident.fio}}</h4>
        <span>Роль: {{this.roleName}}</span>
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
                <div class="btn-group btn-group-lg d-flex justify-content-around" role="group" style="margin: 10px;"><button class="btn btn-primary d-flex flex-grow-0" type="button" v-on:click="update_residents" style="border-radius: 8px;">Обновить</button>`
}