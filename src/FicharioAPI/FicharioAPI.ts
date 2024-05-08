import { AuthExpectedType, AuthType, DeviceInfoType, DevicePayloadType, DeviceType, FicharioAPISchema, FicharioAPIType, RequestOptionsType, UserType, authExpectedSchema, authSchema, deviceInfoSchema, devicePayloadSchema, deviceSchema, getCompaniesExpectedSchema, getCompaniesExpectedType, requestOptionsSchema, userSchema } from './FicharioAPI.types';
import axios from 'axios';
import dotenv from 'dotenv';
import { A } from 'vitest/dist/reporters-P7C2ytIv';
dotenv.config();

class FicharioAPI implements FicharioAPIType {
    token: string;
    company: string;

    constructor() {
        this.token = "";
        this.company = "";
    }

    static async new(data: AuthType): Promise<FicharioAPI> {
        const ficharioAPI = new FicharioAPI();

        try {
            await ficharioAPI.auth(data)
        } catch (error) {
            throw error;
        }

        try {
            await ficharioAPI.getCompanyID();
        } catch (error) {
            throw error;
        }

        // console.log(`Conexão com fichar.io estabelecida!`)

        return ficharioAPI;
    }

    async auth(data: AuthType): Promise<this> {
        try {
            data = authSchema.parse(data);
        } catch (error) {
            throw error;
        }

        let response: AuthExpectedType;
        try {
            const options: RequestOptionsType = {
                method: 'POST',
                path: '/auth',
                data: data,
            };
            response = await this.request(options) as AuthExpectedType;
        } catch (error) {
            throw error;
        }

        try {
            response = authExpectedSchema.parse(response);
        } catch (error) {
            throw error;
        }

        try {
            this.token = response.token;
            return this;
        } catch (error) {
            throw error;
        }
    }

    async getCompanyID(): Promise<this> {
        let response: getCompaniesExpectedType;
        try {
            const options: RequestOptionsType = {
                method: 'GET',
                path: '/admin/listCompanies',
            };
            response = await this.request(options) as getCompaniesExpectedType;
        } catch (error) {
            throw error;
        }

        try {
            response = getCompaniesExpectedSchema.parse(response);
            this.company = response[0]._id;
            return this;
        } catch (error) {
            throw error;
        }
    }

    async request(options: RequestOptionsType): Promise<unknown> {
        try {
            options = requestOptionsSchema.parse(options);
        } catch (error) {
            throw error;
        }

        try {
            const url = "https://api.fichar.io" + options.path;
            const config: any = {
                method: options.method,
                url: url,
            }

            if (options.data) config.data = options.data;

            if (this.token) {
                config.headers = {
                    Authorization: `Bearer ${this.token}`,
                };
            }

            // console.log(`Fazendo requisição para ${options.method} ${url}`)
            // if (options.data) console.log(`Com dados: ${JSON.stringify(options.data)}`)

            const response = await axios(config).catch((error) => {
                if (error.response) {
                    console.error(`Erro na requisição: ${error.response.status} - ${error.response.statusText}`);
                    console.error(error.response.data)
                } else if (error.request) {
                    console.error(`Erro na requisição: ${error.request}`);
                } else {
                    console.error(`Erro na requisição: ${error.message}`);
                }
                throw {
                    error: "Falha na requisição ao Fichário",
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getUsers(): Promise<Array<UserType>> {
        const options: RequestOptionsType = {
            method: 'GET',
            path: `/admin/companies/${this.company}/listUsers`,
        };

        let response: Array<UserType>;
        try {
            response = await this.request(options) as Array<UserType>;
        } catch (error) {
            throw error;
        }

        try {
            response = userSchema.array().parse(response);
        } catch (error) {
            throw error;
        }

        response = response.filter((user) => user.active);
        return response;
    }

    async getDevices(): Promise<Array<DeviceType>> {
        const options: RequestOptionsType = {
            method: 'GET',
            path: `/admin/companies/${this.company}/devices/list`,
        };

        let response: Array<DeviceType>;
        try {
            response = await this.request(options) as Array<DeviceType>;
        } catch (error) {
            throw error;
        }

        try {
            response = deviceSchema.array().parse(response);
        } catch (error) {
            throw error;
        }

        return response;
    }

    async getDeviceInfos(deviceID: string): Promise<Array<DeviceInfoType>> {
        let endpoint = `/admin/companies/${this.company}/devices/${deviceID}/data/deviceInfo`;

        const options: RequestOptionsType = {
            method: 'GET',
            path: endpoint,
        };

        let response: Array<DeviceInfoType>;
        try {
            response = await this.request(options) as Array<DeviceInfoType>;
        } catch (error) {
            throw error;
        }

        try {
            response = deviceInfoSchema.array().parse(response);
        } catch (error) {
            throw error;
        }

        return response;
    }

    async getDevicePayloads(deviceID: string, { complete = false, startDate = "", endDate = "", debug = false } = {}, { admin = true } = {}): Promise<Array<DevicePayloadType>> {
        let endpoint = admin ?
            `/admin/companies/${this.company}/devices/${deviceID}/data/payload` :
            `/data/payloads/${deviceID}`;

        const params = new URLSearchParams();
        if (complete) params.append('complete', 'true');
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        if (params.toString()) endpoint += '?' + params.toString();
        
        if (debug) console.log("FICHARIO: Request URL endpoint - ", endpoint)

        const options: RequestOptionsType = {
            method: 'GET',
            path: endpoint,
        };

        let response: Array<DevicePayloadType>;
        try {
            if (debug) console.log("FICHARIO: Request options - ", options)
            response = await this.request(options) as Array<DevicePayloadType>;
        } catch (error) {
            throw error;
        }

        try {
            response = devicePayloadSchema.array().parse(response);
        } catch (error) {
            throw error;
        }

        return response;
    }
}

export default FicharioAPI;