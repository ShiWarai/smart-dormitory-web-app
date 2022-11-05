import {fetch, set, create} from '../api.mjs'

export const ResidentComponent = {
    props: ['resident', 'mode'],
    data() {
        return { 
            roles: [],
            rooms: []
        }
    },
    computed: {
        modeName() {
            return this.mode == 'edit' ? "Изменить" : "Создать";
        }
    },
    methods: {
        update() {
            this.update_roles();
            this.update_rooms();
        },
        update_roles(event) {
            fetch("/roles/").
                then(response => (this.roles = response.data));
        },
        update_rooms(event) {
            fetch("/rooms/").
                then(response => (this.rooms = response.data));
        },
        async create_resident(event) {
            if(this.resident.roomId == null)
                delete this.resident.roomId;
            
            if(this.resident.password == null)
                delete this.resident.password;
            
            if(this.mode == 'create') {
                const response = await create("/residents/", this.resident);
                
                if(response.status == 201)
                {
                    alert("Создан новый житель!");
                    this.$parent.changeWindow('resident', 'residents');
                }
                else
                    alert("Ошибка");
            } else {
                const response = await set("/residents/" + this.resident.studentId, this.resident);
                
                if(response.status == 200)
                {
                    alert("Изменён житель!");
                    this.$parent.changeWindow('resident', 'residents');
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
    <h1 class="text-center form-heading">Житель</h1>
    <div style="min-width: 400px;">
        <form v-on:submit.prevent="create_resident">
            <div class="mb-3"><input class="form-control" type="text" name="fio" placeholder="ФИО" v-model="resident.fio" required /></div>
            <div class="mb-3"><input class="form-control" name="birthdate" placeholder="Дата рождения" type="date" v-model="resident.birthdate"/></div>
            <div class="mb-3"><select class="form-select" name="roleId" v-model="resident.roleId" required>
                    <option :value="role.id" v-for="role in this.roles">{{role.name}}</option>
                </select></div>
            <div class="mb-3"><select class="form-select" name="roomId" v-model="resident.roomId" required>
                    <option value="null" selected>-</option>
                    <option :value="room.id" v-for="room in this.rooms">{{room.name}}</option>
                </select></div>
            <div class="mb-3"><input class="form-control" type="text" name="studentId" placeholder="Номер студенческого (7 цифр)" pattern="[0-9]{7}" v-model="resident.studentId" required /></div>
            <div class="mb-3"><input v-if="this.mode == 'create'" class="form-control" type="password" name="password" placeholder="Пароль (4 цифры)" pattern="[0-9]{4}" v-model="resident.password" required/>
            <input v-if="this.mode == 'edit'" class="form-control" type="password" name="password" placeholder="Пароль (4 цифры)" v-model="resident.password"/>
            </div>
            <div class="d-flex">
                <button class="btn btn-primary d-block w-100" type="submit">{{this.modeName}}</button>
            </div>
        </form>
    </div>
    `
}