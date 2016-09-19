/// <reference path="../core/_all.d.ts" />


"use strict";
import {Activation} from '../models/activation.mod';

module.exports = (req, res) => {
    const activationKey: string = req.params.activationKey;
    
    const ActivationObj = new Activation();
    const results = ActivationObj.activateAccount(activationKey);
    results.then((data) => {
        console.log(data);
        res.send(data);
    });
};