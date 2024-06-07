import { boolean, z } from 'zod';

export const FicharioAPISchema = z.object({
    token: z.string(),
    company: z.string(),
});
export type FicharioAPIType = z.infer<typeof FicharioAPISchema>;

export const requestOptionsSchema = z.object({
    method: z.string(),
    path: z.string(),
    data: z.any().nullable(),
});
export type RequestOptionsType = z.infer<typeof requestOptionsSchema>;

export const authSchema = z.object({
    login: z.string(),
    password: z.string(),
});
export type AuthType = z.infer<typeof authSchema>;

export const authExpectedSchema = z.object({
    user: z.object({
        name: z.string(),
        email: z.string(),
    }),
    token: z.string(),
    profile: z.string(),
});
export type AuthExpectedType = z.infer<typeof authExpectedSchema>;

export const getCompaniesExpectedSchema = z.array(z.object({
    _id: z.string(),
    name: z.string(),
    trueName: z.string(),
}));
export type getCompaniesExpectedType = z.infer<typeof getCompaniesExpectedSchema>;

export const userSchema = z.object({
    _id: z.string(),
    active: z.boolean(),
    name: z.string(),
    email: z.string(),
    username: z.string(),
    createdAt: z.string(),
    tokenPwdRecover: z.string(),
    lastLogin: z.string().optional(), 
});
export type UserType = z.infer<typeof userSchema>;

export const deviceSchema = z.object({
    _id: z.string(),
    public: z.boolean(),
    active: z.boolean(),
    local: z.string(),
    description: z.string(),
    createdAt: z.string(),
    lastSeen: z.string().optional(),
    owner: z.string(),
    activeAlarms: z.boolean(),
});
export type DeviceType = z.infer<typeof deviceSchema>;

export const deviceInfoSchema = z.object({
    _id: z.string().nullable(),
    altitude: z.number().nullable(),
    createdAt: z.string().nullable(),
    device: z.string().nullable(),
    flag: z.string().nullable(),
    ip: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    mqttMsg: z.string().nullable(),
    orientation: z.number().nullable(),
    timezone: z.number().nullable(),
    uptime: z.number().nullable(),
});
export type DeviceInfoType = z.infer<typeof deviceInfoSchema>;

export const devicePayloadSchema = z.object({
    _id: z.string(),
    hwId: z.string(),
    timestamp: z.string(),
    val: z.number(),
    unt: z.string(),
    min: z.number(),
    max: z.number(),
    trg: z.number(),
    des: z.string(),
});
export type DevicePayloadType = z.infer<typeof devicePayloadSchema>;

export type getDevicePayloadsType = { 
    deviceID: string
    complete?: boolean
    startDate?: string
    endDate?: string
    debug?: boolean
    admin?: boolean 
}