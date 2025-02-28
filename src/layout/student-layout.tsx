import { Outlet, useLocation } from "react-router-dom"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { useState } from "react"
import supabase from "@/lib/supabase"


export default function StudentLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Logout function
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      // Redirect to login page or home page after logout
      window.location.href = '/signin' // Adjust the redirect URL as needed
    } catch (error) {
      console.error('Error while logging out')
    }
  }

  // Define navigation items
  const navItems = [
    { name: "Jobs", href: "/student/jobs" },
    { name: "Your Applications", href: "/student/applications" },
    { name: "Interview Questions", href: "/student/generate" },
    { name: "Account", href: "/student/account" },
  ]

  // Generate breadcrumb items based on current path
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x)
    return pathnames.map((value, index) => {
      const href = `/${pathnames.slice(0, index + 1).join("/")}`
      const isLast = index === pathnames.length - 1
      return (
        <BreadcrumbItem key={href}>
          {isLast ? (
            <BreadcrumbPage>{value.charAt(0).toUpperCase() + value.slice(1)}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={href}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      )
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-[#2c3e50] text-white shadow-md z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/student/jobs" className="text-xl font-bold flex items-center">
              <span className="max-w-[50px]">TalentTrek</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 items-center">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded hover:bg-[#3498db] transition-colors duration-300"
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
            >
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle menu"
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`fixed top-0 right-0 h-full bg-[#2c3e50] z-50 overflow-x-hidden transition-all duration-300 md:hidden ${
            isMobileMenuOpen ? "w-64" : "w-0"
          }`}
        >
          <div className="flex flex-col h-full pt-20 px-4">
            <button
              aria-label="Close menu"
              className="absolute top-4 right-4 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-2 px-4 hover:bg-[#3498db] rounded transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <button
                onClick={handleLogout}
                className="block py-2 px-4 text-left hover:bg-red-600 rounded transition-colors duration-300"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {/* Page Content */}
        <div className="container mx-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}