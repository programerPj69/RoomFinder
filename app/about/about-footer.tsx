export function AboutFooter() {
  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} RoomGroom. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2">
            Find your perfect room with RoomGroom - connecting tenants and landlords.
          </p>
        </div>
      </div>
    </footer>
  )
}
