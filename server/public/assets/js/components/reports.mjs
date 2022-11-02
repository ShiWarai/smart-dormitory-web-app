import {fetch, set} from '../api.mjs'

export const ReportComponent = {
    props: ['report'],
    data() {
        return { 
            resident: {fio: null},
            object: {name: null, typeName: null}
        }
    },
    methods: {
        update_resident(event) {
            fetch("/residents/by_id/" + this.report.residentId).
                then(response => (this.resident = response.data));
        },
        async update_object(event) {
            this.object = (await fetch("/objects/" + this.report.objectId)).data;
            this.object.typeName = (await fetch("/object_types/" + this.object.typeId)).data.name;
        },
    },
    mounted () {
        this.update_resident();
        this.update_object();
    },
    template:
    `<li class="list-group-item d-flex flex-column">
        <div class="container">
            <div class="row d-flex flex-row justify-content-between align-items-start">
                <div class="col-auto col-md-6 flex-grow-1">
                    <div>
                        <h3>Поломка #{{report.id}}</h3>
                        <h4>{{this.object.name}} (тип: {{this.object.typeName}})</h4>
                    </div>
                </div>
                <div class="col-md-6" style="width: auto;">
                    <h5>Сообщил: {{this.resident.fio}}</h5>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12" style="margin-top: 8px;">
                    <h6>Описание:</h6>
                    <div class="description"><span>{{report.description}}</span></div>
                </div>
            </div>
        </div>
    </li>`
}

export const ReportsComponent = {
    data() {
        return { 
            reports: [],
        }
    },
    components: {
        'report-component': ReportComponent
    },
    methods: {
        update_reports(event) {
            this.reports = null
            fetch("/reports/").
                then(response => (this.reports = response.data));
        }
    },
    mounted () {
        this.update_reports();
    },
    template: `<ul class="list-group reports">
                <report-component v-bind:report="report" v-for="report in reports">   
                </report-component>
                </ul>
                <div class="btn-group btn-group-lg d-flex justify-content-around" role="group" style="margin: 10px;"><button class="btn btn-primary d-flex flex-grow-0" type="button" v-on:click="update_reports" style="border-radius: 8px;">Обновить</button><button class="btn btn-danger disabled d-flex flex-grow-0" type="button" v-on:click style="border-radius: 8px;" disabled>Удалить всё</button></div>`
}