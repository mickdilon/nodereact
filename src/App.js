import React from 'react';
import './App.css';
import { gapi } from 'gapi-script';

import GoogleLogin from 'react-google-login'; //Modulo para inicio de sesion
import { CSVLink, CSVDownload } from "react-csv"; //Modulo para Exportar a CSV

//Variables para generar conexion con google Calendar.
//let gapi = window.gapi

let CLIENT_ID = "89494462392-2trpa7ro91h1pe1adtckkchdnuab9tg0.apps.googleusercontent.com"
let API_KEY = "AIzaSyASZGX37K-6bD7hvRnM08_8EcYNVChrTLI"
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
let SCOPES = "https://www.googleapis.com/auth/calendar.events"


const csvData = [
    ["Nombre_Completo"],
    ["Miguel Angel"]
];

/**Evento para enlace con Google Calendar */
const handleClick = () => {
    gapi.load('client:auth2', () => { //Autentificacion por protocolo v_auth_2
        console.log('loaded client')

        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
        })

        /**'calendar', 'v3', () => console.log('Enlazado!') */
        gapi.client.load('calendar', 'v3', () => console.log('Enlazado!')) //Carga de peticion de conexion

        gapi.auth2.getAuthInstance().signIn()
            .then(() => {

                var event = { //Datos de evento para envio
                    'summary': 'Nuevo Evento!',
                    'location': 'Online for Zoom',
                    'description': 'Revision de prueba de Mick',
                    'start': {
                        'dateTime': '2021-09-17T09:00:00-07:00',
                        'timeZone': 'America/Los_Angeles'
                    },
                    'end': {
                        'dateTime': '2021-09-17T17:00:00-07:00',
                        'timeZone': 'America/Los_Angeles'
                    },
                    'recurrence': [
                        'RRULE:FREQ=DAILY;COUNT=2'
                    ],
                    'attendees': [
                        { 'email': 'ingmiguelangelgc@gmail.com' },
                        { 'email': 'ingmiguelangelgc@gmail.com' }
                    ],
                    'reminders': {
                        'useDefault': false,
                        'overrides': [
                            { 'method': 'email', 'minutes': 24 * 60 },
                            { 'method': 'popup', 'minutes': 10 }
                        ]
                    }
                }

                var request = gapi.client.calendar.events.insert({
                    'calendarId': 'primary',
                    'resource': event,
                })

                request.execute(event => {
                    console.log(event)
                    window.open(event.htmlLink)
                })

            })
    })
}

/*Retorna de respuesta de sesion Google*/
const responseGoogle = (response) => {
    console.log(response);
}





function App() {

    return ( <
        div className = "App" >

        <
        p > 1. - Integración de inicio de sesión con google: < /p><
        GoogleLogin clientId = '89494462392-2trpa7ro91h1pe1adtckkchdnuab9tg0.apps.googleusercontent.com'
        buttonText = 'Iniciar Sesion'
        onSuccess = { responseGoogle }
        onFailure = { responseGoogle }
        cookiePolicy = { 'single_host_origin' }
        /><p > 2. - Asignacion de evento en google Calendar: < /p > <
        button style = {
            { width: 100, height: 50 }
        }
        onClick = { handleClick } > Add Event < /button>   <
        p > 3. - Exportar a CSV: < /p >

        <
        form >
        <
        label >
        Nombre Completo:
        <
        textarea name = "name"
        placeholder = "Introduce su nombre" >
        <
        /
        textarea > < /
        label > <
        input type = "submit"
        value = "Submit" / >
        <
        /form>

        <
        CSVLink data = { csvData } > Descargar CSV < /CSVLink >

        <
        p > 4. - Consumo de API: < /p >

        <
        /div >
    );
}

export default App;