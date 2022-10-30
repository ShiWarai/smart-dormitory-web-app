function update_element(endpoint) {
    return axios
            .get(HOST + endpoint)
}

const ContactFormComponent = {
    props: ['contact', 'editable', 'senadble'],
    data() {
        return {
            new_contact: null
        }
    },
    methods: {
        create_contact(event) {
            axios
                .post(HOST + "/contacts/", this.new_contact);
            update_element("/contacts").
                then(response => (this.$parent.contacts = response.data));
        }
    },
    beforeMount () {
        if(!this.contact){
            this.new_contact = {
                username: "",
                email: "",
                telephone: "",
                mobile: "",
                home: ""
            }
        } else 
        {
            this.new_contact = this.contact;
        }
    },
    template: 
    `<form>
        <div>
            <div class="mb-3"><input class="form-control" type="text" name="username" placeholder="Имя" v-model="new_contact.username" :readonly="!editable"/></div>
            <div class="mb-3"><input class="form-control" type="email" name="email" placeholder="Электронная почта" v-model="new_contact.email" :readonly="!editable"/></div>
            <div class="mb-3"><input class="form-control" type="tel" name="telephone" placeholder="Телефон" v-model="new_contact.telephone" :readonly="!editable"/></div>
            <div class="mb-3"><input class="form-control" type="tel" name="mobile" placeholder="Мобильный" v-model="new_contact.mobile" :readonly="!editable"/></div>
            <div class="mb-3"><input class="form-control" type="tel" name="home" placeholder="Домашний" v-model="new_contact.home" :readonly="!editable"/></div>
            <div v-if="senadble"><button class="btn btn-primary d-block w-100" type="button" v-on:click="create_contact()">Создать</button></div>
        </div>
    </form>`
}

const ContactComponent = {
    props: ['contact'],
    template:
    `<li class="list-group-item d-flex flex-column">
        <h4>ID: {{contact._id}}</h4>
        <h5>{{contact.username}}</h5>
        <span style="margin: 3px 0px;">E-mail: {{contact.email}}</span><span style="margin: 3px 0px;">Телефон: {{contact.telephone}}</span>
        <span style="margin: 3px 0px;">Мобильный телефон: {{contact.mobile}}</span>
        <span style="margin: 3px 0px;">Домашний телефон: {{contact.home}}</span>
    </li>`
}

const ContactsComponent = {
    props: ['contacts'],
    components: {
        'contact-component': ContactComponent
    },
    template: `<ul class="list-group contacts">
                <contact-component v-bind:contact="contact" v-for="contact in contacts">   
                </contact-component>
                </ul>`
}

const ContactsApp = {
    data() {
        return { 
            found_contact: null,
            contacts: [],
            search_id: null
        }
    },
    components: 
    {
        ContactComponent,
        ContactsComponent,
        ContactFormComponent
    },
    methods: {
        update_list(event) {
            update_element("/contacts").
                then(response => (this.contacts = response.data));
        },
        clear_list(event) {
            axios
                .delete(HOST + "/contacts");
            this.contacts = [];
        },
        update_search(event) {
            if(this.search_id !== "") {
                this.found_contact = null;
                update_element("/contact/" + this.search_id).
                    then(response => (this.found_contact = response.data));
            } else 
            {
                this.found_contact = null;
            }
        },
        update_found_contact(event) {
            axios
                .put(HOST + "/contact/" + this.search_id, this.found_contact);
            
            update_element("/contacts").
                then(response => (this.contacts = response.data));
        },
        delete_found_contact(event) {
            axios
                .delete(HOST + "/contact/" + this.search_id);
            this.found_contact = null;
            
            update_element("/contacts").
                then(response => (this.contacts = response.data));
        }
    },
    mounted () {
        update_element("/contacts").
            then(response => (this.contacts = response.data));
    }
}

app = Vue.createApp(ContactsApp);
app.mount('#app');