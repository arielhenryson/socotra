/// <reference path="../core/_all.d.ts" />


import {Model} from  './model.mod';
import * as validator from '../core/lib/generic/validation';
import {AppEmail}  from '../services/appEmail.service';

const config = require('../config/config.json');
const path = require("path");
const fs = require('fs');

export class Auth extends Model {
    constructor() {
        super();
    }

    private async sendMailToNewUser(newUser) {
        let emailObj = new AppEmail();

        let data = {
            to: newUser.email,
            activationKey: newUser.activationKey,
        };


        let template = await emailObj.render('signup', data);

        const emailOptions = {
            subject: config.appName + " account activation",
            to: newUser.email,
            html: template
        };
        emailObj.send(emailOptions);
    }

    private makeNewUser(email: string, password: string) {
        const solt = this.makeNewSolt();
        const hashPassword = this.hash(password, solt);
        const activationKey = this.makeNewSolt();
        const newUser = this.makeDoc({
            email: email,
            solt: solt,
            password: hashPassword,
            verified: false,
            activationKey: activationKey
        });

        this.sendMailToNewUser(newUser);

        return new Promise((resolve) => {
            this.db.collection("users").insert(newUser, (err) => {
                if (err) {
                    resolve(false);
                    return;
                }

                resolve(true);
                return;
            });
        });
    }

    public async createUser(email: string, password: string) {
        // check if the client send email and password
        // for creating the new user and if not reject the request
        if (typeof email === "undefined") {
            return {
                error: 1,
                msg: "Missing email value"
            };
        }

        if (typeof password === "undefined") {
            return {
                error: 2,
                msg: "Missing password value"
            };
        }

        email = email.toLocaleLowerCase();

        if (!validator.isValidEmail(email)) {
            return {
                error: 3,
                msg: "invalid email value"
            };
        }

        if (!validator.isValidPassword(password)) {
            return {
                error: 4,
                msg: "invalid password At least one number, one lowercase and one uppercase letter at least six characters"
            };
        }

        const isUserExists = await this.DBHelper.isUserEmailExists(email);
        if (isUserExists) {
            return {
                error: 1,
                msg: 'User is alrady exsist'
            };
        }

        const makeUser = await this.makeNewUser(email, password);
        if (!makeUser) {
            return {
                error: 2,
                msg: 'Cant write to DB'
            };
        }

        return {
            error: 0,
            msg: 'successfully create new user'
        };
    }
}