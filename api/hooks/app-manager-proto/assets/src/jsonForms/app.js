import {createApp} from 'vue';
import App from './App.vue'

/**
interface Istep {
    mountDivId: string,
    uischema: string,
    jsonschema: string,
    dataInputId: string,
    languages: ...
}
*/

 // id, uischema, jsonschema, data
export function MountJSONForm(formData){
    console.log(formData, "FORM DATA")
    let app = createApp(App);
    app.config.devtools = true;
    const appInstance = app.mount(formData.mountDivId); // '#installStep'

    appInstance.validationCallback = formData.validationCallback

    // generate data object for input form
    appInstance.initializeData(formData.jsonSchema, formData.uiSchema)

    // if form validation is ok mountInputId have to receive value from form
    appInstance.addOutput(formData.mountDivOutput)

    return appInstance
}

window.MountJSONForm = MountJSONForm

console.log("json-form")
