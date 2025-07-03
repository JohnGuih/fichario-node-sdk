# Fichario Node SDK

TypeScript SDK for integration with Fichar.io API.

## Installation

```bash
npm install fichario-node-sdk
```

## Basic Usage

```typescript
import FicharioAPI from 'fichario-node-sdk'

// Authentication
const api = await FicharioAPI.new({
  login: 'your@email.com',
  password: 'your_password'
})

// Get users
const users = await api.getUsers()

// Get devices
const devices = await api.getDevices()

// Get device information
const deviceInfos = await api.getDeviceInfos({ deviceID: 'device_id' })

// Get device payloads
const payloads = await api.getDevicePayloads({ deviceID: 'device_id' })
```