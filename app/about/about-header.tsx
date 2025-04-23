import Link from "next/link"

export function AboutHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          RoomGroom
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-gray-600 hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-primary font-medium">
                About
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-gray-600 hover:text-primary">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-gray-600 hover:text-primary">
                Register
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
