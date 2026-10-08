import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center mb-4">
              <img src="/logo.png" alt="FuturePath" className="h-8 w-auto" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Empowering youth with the skills, certifications, and job connections to build a
              brighter future.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/courses" className="hover:text-brand-green transition-colors">Courses</Link></li>
              <li><Link href="/jobs" className="hover:text-brand-green transition-colors">Job Board</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-green transition-colors">Dashboard</Link></li>
              <li><Link href="/profile" className="hover:text-brand-green transition-colors">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-brand-green transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-green transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-green transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-green transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} FuturePath. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Built with care for the next generation.
          </p>
        </div>
      </div>
    </footer>
  );
}
