// i want to test the FicharioAPI class

import FicharioAPI from './FicharioAPI';
import { AuthType } from './FicharioAPI.types';
import { describe, it, expect } from 'vitest';
import dotenv from 'dotenv';
dotenv.config();


describe('FicharioAPI', () => {
    it('method auth() should add token to FicharioAPI instance', async () => {
        const data: AuthType = {
            login: process.env.FICHARIO_EMAIL_MASTER || "",
            password: process.env.FICHARIO_PASSWORD_MASTER || "",
        };

        const ficharioAPI = new FicharioAPI();
        await ficharioAPI.auth(data);

        expect(ficharioAPI.token).toBeTruthy();
    });
    
    it('method getCompany() should add company ID to FicharioAPI instance', async () => {
        const data: AuthType = {
            login: process.env.FICHARIO_EMAIL_MASTER || "",
            password: process.env.FICHARIO_PASSWORD_MASTER || "",
        };

        const ficharioAPI = new FicharioAPI();
        await ficharioAPI.auth(data);
        await ficharioAPI.getCompanyID();

        expect(ficharioAPI.company).toBeTruthy();
    });

    it('static method new() should create a new instance', async () => {
        const data: AuthType = {
            login: process.env.FICHARIO_EMAIL_MASTER || "",
            password: process.env.FICHARIO_PASSWORD_MASTER || "",
        };
        const ficharioAPI = await FicharioAPI.new(data);
        expect(ficharioAPI).toBeInstanceOf(FicharioAPI);
    });

    it('method getUsers should return array of users', async () => {
        const data: AuthType = {
            login: process.env.FICHARIO_EMAIL_MASTER || "",
            password: process.env.FICHARIO_PASSWORD_MASTER || "",
        };
        const ficharioAPI = await FicharioAPI.new(data);
        const users = await ficharioAPI.getUsers();
        expect(users).toBeInstanceOf(Array);
    });

    it('method getUserDevices should return array of devices', async () => {
        const data: AuthType = {
            login: process.env.FICHARIO_EMAIL_MASTER || "",
            password: process.env.FICHARIO_PASSWORD_MASTER || "",
        };
        const ficharioAPI = await FicharioAPI.new(data);
        const devices = await ficharioAPI.getDevices();
        expect(devices).toBeInstanceOf(Array);
    });

    it('method getDeviceInfos should return array of deviceInfos', async () => {
        const data: AuthType = {
            login: process.env.FICHARIO_EMAIL_MASTER || "",
            password: process.env.FICHARIO_PASSWORD_MASTER || "",
        };
        const ficharioAPI = await FicharioAPI.new(data);
        const devices = await ficharioAPI.getDevices();
        const ramdomIndex = Math.floor(Math.random() * devices.length);
        const device = devices[ramdomIndex];
        const deviceInfos = await ficharioAPI.getDeviceInfos(device._id);
        expect(deviceInfos).toBeInstanceOf(Array);
    });

    it('method getDevicePayloads should return array of devicePayloads', async () => {
        const data: AuthType = {
            login: process.env.FICHARIO_EMAIL_MASTER || "",
            password: process.env.FICHARIO_PASSWORD_MASTER || "",
        };
        const ficharioAPI = await FicharioAPI.new(data);
        const devices = await ficharioAPI.getDevices();
        const ramdomIndex = Math.floor(Math.random() * devices.length);
        const device = devices[ramdomIndex];
        const devicePayloads = await ficharioAPI.getDevicePayloads(device._id);
        expect(devicePayloads).toBeInstanceOf(Array);
    });
});