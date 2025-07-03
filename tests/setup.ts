import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import dotenv from 'dotenv'

// Load environment variables for tests
dotenv.config({ path: '.env.test' })

// Global configurations for all tests
beforeAll(() => {
  // Global setup that runs once before all tests
  console.log('🚀 Starting test suite...')
})

afterAll(() => {
  // Global cleanup that runs once after all tests
  console.log('✅ Test suite finished!')
})

beforeEach(() => {
  // Setup that runs before each individual test
  // Here you can reset mocks, clear state, etc.
})

afterEach(() => {
  // Cleanup that runs after each individual test
  // Here you can clear mocks, restore state, etc.
})

// Global Vitest configurations
export const testTimeout = 30000 // 30 seconds
export const retryAttempts = 3