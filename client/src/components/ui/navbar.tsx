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
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="inline-block">
                <Link href="/">
                  <span className="text-2xl font-bold cursor-pointer">PRA</span>
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <div key={link.href} className="inline-flex items-center">
                  <Link href={link.href}>
                    <span className={`${
                      isActive(link.href)
                        ? 'border-b-2 border-secondary text-white'
                        : 'border-transparent hover:border-white border-b-2 text-white'
                      } px-1 pt-1 font-medium cursor-pointer inline-block`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <>
                <div className="mr-2">
                  <Link href="/dashboard">
                    <Button variant="default" className="bg-secondary hover:bg-blue-600 text-white">
                      Dashboard
                    </Button>
                  </Link>
                </div>
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
                <div className="mr-2">
                  <Link href="/login">
                    <Button variant="default" className="bg-secondary hover:bg-blue-600 text-white">
                      Login
                    </Button>
                  </Link>
                </div>
                <div>
                  <Link href="/signup">
                    <Button variant="outline" className="bg-white text-primary hover:bg-gray-100">
                      Sign Up
                    </Button>
                  </Link>
                </div>
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
                    <div key={link.href} className="block">
                      <Link 
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className={`${
                          isActive(link.href)
                            ? 'bg-primary-700 text-white'
                            : 'text-white hover:bg-primary-700'
                          } px-3 py-2 rounded-md text-base font-medium block cursor-pointer`}
                        >
                          {link.label}
                        </span>
                      </Link>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-primary-700">
                    {isAuthenticated ? (
                      <>
                        <div className="block">
                          <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                            <span className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-700 cursor-pointer">
                              Dashboard
                            </span>
                          </Link>
                        </div>
                        <div 
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-700 cursor-pointer"
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="block">
                          <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                            <span className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-700 cursor-pointer">
                              Login
                            </span>
                          </Link>
                        </div>
                        <div className="block">
                          <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                            <span className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-700 cursor-pointer">
                              Sign Up
                            </span>
                          </Link>
                        </div>
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
