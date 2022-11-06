import {fetch, set, remove} from '../api.mjs'

export const ReportComponent = {
    props: ['reportProp'],
    data() {
        return { 
            report: this.reportProp,
            resident: {fio: null},
            object: {name: null, typeName: null}
        }
    },
    methods: {
        update() {            
            this.update_resident();
            this.update_object();
        },
        async remove_report(event) {
            const response = await remove("/reports/" + this.report.id);
            
            if(response.status == 200) {
                alert("Репорт удалён!");
                this.$parent.update_reports();
            }
            else
                alert("Ошибка");
        },
        update_resident(event) {
            fetch("/residents/by_id/" + this.report.residentId).
                then(response => (this.resident = response.data));
        },
        async update_object(event) {
            this.object = (await fetch("/objects/" + this.report.objectId)).data;
            this.object.typeName = (await fetch("/object_types/" + this.object.typeId)).data.name;
        },
        async change_status(event) {
            const response = await set("/reports/" + this.report.id + "/is_done", this.report.isDone, true);
            
            if(response.status != 200)
                this.report.isDone = !this.report.isDone;
        }
    },
    mounted () {
        this.update();
    },
    template:
    `<li class="list-group-item d-flex flex-column">
        <div>
            <div class="row d-flex flex-row justify-content-between align-items-start">
                <div class="col-auto col-md-6 flex-grow-1">
                    <div>
                        <h3>Поломка #{{report.id}}</h3>
                        <h4>{{this.object.name}} (тип: {{object.typeName}})</h4>
                    </div>
                </div>
                <div class="col-md-6" style="width: auto;">
                    <h5>Сообщил: {{resident.fio}}</h5>
                    <div class="d-flex form-check form-switch">Устранена: <input class="form-check-input" type="checkbox" v-model="report.isDone" v-on:change="change_status"/>
                    <button class="btn btn-danger btn-delete d-flex flex-grow-0" style="margin-left: 8px" type="button" data-bs-toggle="tooltip" title="Удалить" v-on:click="remove_report">X</button>
                    </div>
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
        },
        async remove_reports(event) {
            const result = confirm("Вы уверены, что хотите удалить все репорты?");
            
            if(result) {
                const response = await remove("/reports/");

                if(response.status == 200) {
                    alert("Репорты удалены!");
                    this.update_reports();
                }
                else
                    alert("Ошибка");
            }
        }
    },
    mounted () {
        this.update_reports();
    },
    template: `<ul class="list-group reports">
                <report-component v-bind:reportProp="report" v-for="report in reports">   
                </report-component>
                </ul>
                <div class="btn-group btn-group-lg d-flex justify-content-around toolbar" role="group"><button class="btn btn-primary d-flex flex-grow-0" type="button" v-on:click="update_reports" style="border-radius: 8px;">Обновить</button><button class="btn btn-danger d-flex flex-grow-0" type="button" v-on:click="remove_reports" style="border-radius: 8px;">Удалить всё</button></div>`
}