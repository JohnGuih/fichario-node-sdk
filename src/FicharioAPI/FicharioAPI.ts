import { AuthExpectedType, AuthType, DeviceInfoType, DevicePayloadType, DeviceType, FicharioAPISchema, FicharioAPIType, RequestOptionsType, UserType, authExpectedSchema, authSchema, deviceInfoSchema, devicePayloadSchema, deviceSchema, getCompaniesExpectedSchema, getCompaniesExpectedType, getDevicePayloadsType, requestOptionsSchema, userSchema } from './FicharioAPI.types';
import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { A } from 'vitest/dist/reporters-P7C2ytIv';
dotenv.config();

class FicharioAPI implements FicharioAPIType {
    token: string;
    company: string;

    constructor({ token = "", company = "" } = {}) {
        this.token = token;
        this.company = company;
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

            const response = await this.makeRequest(config);

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async makeRequest(config: any, retries = 6): Promise<AxiosResponse<any, any>> {
        try {
            const response = await axios(config);
            return response;
        } catch (error: any) {
            if (retries > 0 && error.response && (error.response.status === 502 || error.response.status === 429)) {
                console.error(`Erro na requisição: ${error.response.status} - ${error.response.statusText}`);
                console.log(JSON.stringify(config, null, 2));
                console.error('Retrying in 10 seconds...');
                await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds
                return this.makeRequest(config, retries - 1);
            } else {
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
            }
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

    async getDevices({ admin = true } = {}): Promise<Array<DeviceType>> {
        const endpoint = admin ?
            `/admin/companies/${this.company}/devices/list` :
            `/devices`;
        const options: RequestOptionsType = {
            method: 'GET',
            path: endpoint,
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

    async getDeviceInfos({ deviceID, admin = true }: {deviceID: string, admin?: boolean}): Promise<Array<DeviceInfoType>> {
        if (!deviceID) throw new Error("getDeviceInfos ERROR: deviceID missing");

        let endpoint = admin ?
            `/admin/companies/${this.company}/devices/${deviceID}/data/deviceInfo` :
            `/data/deviceinfos/${deviceID}`;

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

    async getDevicePayloads({ deviceID, complete = false, startDate = "", endDate = "", debug = false, admin = true }: getDevicePayloadsType ): Promise<Array<DevicePayloadType>> {
        if (!deviceID) throw new Error("getDevicePayloads ERROR: deviceID missing");

        let endpoint = admin ?
            `/admin/companies/${this.company}/devices/${deviceID}/data/payload` :
            `/data/payloads/${deviceID}`;

        const params = new URLSearchParams();
        if (complete) params.append('complete', 'true');
        if (startDate) params.append('strDate', startDate);
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