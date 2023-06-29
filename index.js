
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');

const connection = mysql.createConnection({
    host: '3.144.105.214',
    user: 'root',
    password: 'root',
    database: 'mydb'
});

const app = express();
const port = 3000;

let intervalId; // Variable para almacenar el identificador del setInterval

// Función para mostrar la tabla de usuarios
function showTable() {
    connection.query('SELECT * FROM `user`;', function (err, results, fields) {
        if (err) {
            console.error(err);
        } else {
            console.log(results);
        }
    });
}

// Función para ingresar datos periódicamente usando setInterval
function enterData() {
    const delayInSeconds = 2;
    const delayInMillis = delayInSeconds * 1000;

    intervalId = setInterval(() => {
        const name = faker.person.fullName();
        const email = faker.internet.email();
        const address = faker.location.streetAddress();

        console.log(name + " " + email + " " + address);

        const query = "CALL agregar_user (?,?,?)";
        const params = [name, email, address];
        connection.query(query, params, (err, result) => {
            if (err) {
                console.error(err);
            }
        });
    }, delayInMillis);
}

// Función para cancelar el setInterval
function cancelDataEntry() {
    clearInterval(intervalId);
    console.log("Inserción de datos periódica cancelada.");
}

// Función para mostrar el menú y procesar la entrada del usuario
function showMenu() {
    console.log("----- Menú -----");
    console.log("1. Ver tabla");
    console.log("2. Ingresar datos");
    console.log("3. Cancelar inserción de datos");
    console.log("4. Salir");

    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Ingrese la opción deseada: ", (option) => {
        switch (option) {
            case '1':
                showTable();
                break;
            case '2':
                enterData();
                break;
            case '3':
                cancelDataEntry();
                break;
            case '4':
                rl.close();
                connection.end();
                process.exit(0);
                break;
            default:
                console.log("Opción inválida.");
                break;
        }

        rl.close();
        showMenu();
    });
}

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto: ${port}`);
    showMenu();
});
