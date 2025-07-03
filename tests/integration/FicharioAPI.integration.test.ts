import { describe, it, expect, beforeAll, beforeEach, test, vi } from 'vitest'
import FicharioAPI from '../../src/FicharioAPI/FicharioAPI'
import { assert } from 'console'
import { DeviceType } from '../../src'
import { deviceInfoSchema, devicePayloadSchema, deviceSchema, userSchema, UserType } from '../../src/FicharioAPI/FicharioAPI.types'

// ⚠️ WARNING: These are integration tests that make real API calls
// You need to configure environment variables in the .env.test file

describe('FicharioAPI - Integration Tests', () => {
  let ficharioAPI: FicharioAPI
  let isAuthenticated = false
  let userFicharioAPI: FicharioAPI
  let userIsAuthenticated = false
  
  test('Authentication Master', async () => {
    console.log('🚀 Starting authentication for all tests...')
    
    try {
      // Check if credentials are configured
      if (!process.env.FICHARIO_EMAIL_MASTER || !process.env.FICHARIO_PASSWORD_MASTER) {
        console.warn('⚠️  Credentials not configured. Configure FICHARIO_EMAIL_MASTER and FICHARIO_PASSWORD_MASTER')
        return
      }
      
      // Authenticate once
      ficharioAPI = new FicharioAPI()
      
      await ficharioAPI.auth({
        login: process.env.FICHARIO_EMAIL_MASTER,
        password: process.env.FICHARIO_PASSWORD_MASTER
      })
      
      expect(ficharioAPI.token).toBeDefined()
      
      await ficharioAPI.getCompanyID()
      
      expect(ficharioAPI.company).toBeDefined()
      
      if(ficharioAPI.company && ficharioAPI.token) {
        isAuthenticated = true
      }
      
    } catch (error) {
      console.error('❌ Authentication failed:', error)
      throw error
    }
  }, 30000)
  
  test.skipIf(!process.env.FICHARIO_EMAIL || !process.env.FICHARIO_PASSWORD)('Authentication User', async () => {
    try {
      // Check if credentials are configured
      if (!process.env.FICHARIO_EMAIL || !process.env.FICHARIO_PASSWORD) {
        console.warn('⚠️  Credentials not configured. Configure FICHARIO_EMAIL and FICHARIO_PASSWORD')
        return
      }
      
      // Authenticate once
      userFicharioAPI = new FicharioAPI()

      await userFicharioAPI.auth({
        login: process.env.FICHARIO_EMAIL,
        password: process.env.FICHARIO_PASSWORD
      })
      
      expect(userFicharioAPI.token).toBeDefined()
      
      if(userFicharioAPI.token) {
        userIsAuthenticated = true
      }
      
    } catch (error) {
      console.error('❌ Authentication failed:', error)
      throw error
    }
  }, 30000)
  
  describe.skipIf(!process.env.FICHARIO_EMAIL || !process.env.FICHARIO_PASSWORD)('Standard API', () => {
    let userDevices: Array<DeviceType>
    
    beforeEach(() => {
      // Check if authentication was successful
      if (!userIsAuthenticated) {
        throw new Error('Authentication failed. Cannot run tests.')
      }
    })
    
    test('getDevices', async () => {
      userDevices = await userFicharioAPI.getDevices()
      
      let parsed = deviceSchema.array().parse(userDevices)
      expect(parsed).toEqual(userDevices)
    }, 30000)
    
    test('getDeviceInfos', async () => {
      if(userDevices.length === 0) throw new Error('Get devices failed, cannot get device infos')
        let ramdomDevice = userDevices[Math.floor(Math.random() * userDevices.length)]
      const deviceInfos = await userFicharioAPI.getDeviceInfos({ deviceID: ramdomDevice._id})
      
      let parsed = deviceInfoSchema.array().parse(deviceInfos)
      expect(parsed).toEqual(deviceInfos)
    }, 30000)
    
    test('getDevicePayloads', async () => {
      if(userDevices.length === 0) throw new Error('Get devices failed, cannot get device payloads')
        let ramdomDevice = userDevices[Math.floor(Math.random() * userDevices.length)]
      const devicePayloads = await userFicharioAPI.getDevicePayloads({ deviceID: ramdomDevice._id})
      
      let parsed = devicePayloadSchema.array().parse(devicePayloads)
      expect(parsed).toEqual(devicePayloads)
    }, 30000)
  })
  
  describe('Admin API', () => {
    let devices: Array<DeviceType>

    beforeEach(() => {
      // Check if authentication was successful
      if (!isAuthenticated) {
        throw new Error('Authentication failed. Cannot run tests.')
      }
    })
    
    test('getUsers', async () => {
      const users = await ficharioAPI.getUsers()
      
      let parsed = userSchema.array().parse(users)
      expect(parsed).toEqual(users)
    }, 30000)
    
    test('getDevices', async () => {
      devices = await ficharioAPI.getDevices({ admin: true })
      
      let parsed = deviceSchema.array().parse(devices)
      expect(parsed).toEqual(devices)
    }, 30000)
    
    test('getDeviceInfos', async () => {
      if(devices.length === 0) throw new Error('Get devices failed, cannot get device infos')
        let ramdomDevice = devices[Math.floor(Math.random() * devices.length)]
      const deviceInfos = await ficharioAPI.getDeviceInfos({ deviceID: ramdomDevice._id })
      
      let parsed = deviceInfoSchema.array().parse(deviceInfos)
      expect(parsed).toEqual(deviceInfos)
    }, 30000)
    
    test('getDevicePayloads', async () => {
      if(devices.length === 0) throw new Error('Get devices failed, cannot get device payloads')
        let ramdomDevice = devices[Math.floor(Math.random() * devices.length)]
      const devicePayloads = await ficharioAPI.getDevicePayloads({ deviceID: ramdomDevice._id })
      
      let parsed = devicePayloadSchema.array().parse(devicePayloads)
      expect(parsed).toEqual(devicePayloads)
    }, 30000)
  })
}) 