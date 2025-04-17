import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

// Creating a simplified NavBar that doesn't depend on auth
export function NavBar() {
  const [location] = useLocation();
  // Temporarily we'll have a simple implementation without auth
  const isAuthenticated = false;
  const logout = () => console.log('Logout clicked');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', protected: false },
    { href: '/about', label: 'About', protected: false },
    { href: '/knowledge-center', label: 'Knowledge Center', protected: false },
  ];
  
  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold cursor-pointer">PRA</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                >
                  <a className={`${
                    isActive(link.href)
                      ? 'border-b-2 border-secondary text-white'
                      : 'border-transparent hover:border-white border-b-2 text-white'
                    } px-1 pt-1 font-medium`}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="default" className="bg-secondary hover:bg-blue-600 text-white mr-2">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="default" className="bg-secondary hover:bg-blue-600 text-white mr-2">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="bg-white text-primary hover:bg-gray-100">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-700 focus:outline-none">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-primary text-white w-64 pt-10">
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <a className={`${
                        isActive(link.href)
                          ? 'bg-primary-700 text-white'
                          : 'text-white hover:bg-primary-700'
                        } px-3 py-2 rounded-md text-base font-medium`}
                      >
                        {link.label}
                      </a>
                    </Link>
                  ))}
                  
                  <div className="pt-4 border-t border-primary-700">
                    {isAuthenticated ? (
                      <>
                        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <a className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-700">
                            Dashboard
                          </a>
                        </Link>
                        <a 
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-700 cursor-pointer"
                        >
                          Logout
                        </a>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                          <a className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-700">
                            Login
                          </a>
                        </Link>
                        <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                          <a className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-700">
                            Sign Up
                          </a>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
