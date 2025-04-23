// This is a placeholder for the Supabase client
// In a real application, you would initialize the Supabase client here

export const createClient = () => {
  // In a real application with Supabase integration:
  // return createClientComponentClient()

  // For now, we'll return a mock client with the methods we need
  return {
    auth: {
      signInWithPassword: async ({ email, password }) => {
        // Simulate authentication
        if (email && password) {
          return { data: { user: { email } }, error: null }
        }
        return { data: null, error: new Error("Invalid credentials") }
      },
      signUp: async ({ email, password, options }) => {
        // Simulate user registration
        if (email && password) {
          return { data: { user: { email } }, error: null }
        }
        return { data: null, error: new Error("Registration failed") }
      },
    },
    from: (table) => ({
      select: () => ({
        eq: (field, value) => ({
          // Simulate database query
          data: mockData[table]?.filter((item) => item[field] === value) || [],
          error: null,
        }),
      }),
      insert: (data) => {
        // Simulate inserting data
        if (!mockData[table]) mockData[table] = []
        mockData[table].push(data)
        return { data, error: null }
      },
      update: (data) => ({
        eq: (field, value) => {
          // Simulate updating data
          if (mockData[table]) {
            const index = mockData[table].findIndex((item) => item[field] === value)
            if (index !== -1) {
              mockData[table][index] = { ...mockData[table][index], ...data }
            }
          }
          return { data, error: null }
        },
      }),
    }),
  }
}

// Mock data for demonstration
const mockData = {
  users: [
    { id: 1, email: "tenant@example.com", user_type: "tenant", name: "John Doe" },
    { id: 2, email: "landlord@example.com", user_type: "landlord", name: "Jane Smith" },
  ],
  properties: [
    {
      id: 1,
      title: "Spacious 1BHK in Koramangala",
      type: "apartment",
      price: 15000,
      city: "Bangalore",
      owner_id: 2,
      lat: 12.9352,
      lng: 77.6245,
    },
    {
      id: 2,
      title: "Single Room in Indiranagar",
      type: "private",
      price: 8000,
      city: "Bangalore",
      owner_id: 2,
      lat: 12.9784,
      lng: 77.6408,
    },
    {
      id: 3,
      title: "2BHK Apartment in Powai",
      type: "apartment",
      price: 25000,
      city: "Mumbai",
      owner_id: 2,
      lat: 19.1176,
      lng: 72.906,
    },
  ],
}
