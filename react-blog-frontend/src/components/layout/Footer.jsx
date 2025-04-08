import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Nepal Blog</h3>
            <p className="text-gray-300">
              Share your stories, experiences, and knowledge about Nepal's culture, heritage, and more.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/blogs/trending" className="text-gray-300 hover:text-white">Trending Blogs</Link></li>
              <li><Link to="/blogs/recommended" className="text-gray-300 hover:text-white">Recommended</Link></li>
              <li><Link to="/writers" className="text-gray-300 hover:text-white">Our Writers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="text-gray-300 hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaInstagram size={24} />
              </a>
              <a href="https://github.com/thebcatu" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaGithub size={24} />
              </a>
            </div>
            <p className="text-gray-300">Email: contact@nepalblog.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p>© {currentYear} Nepal Blog. All rights reserved.</p>
          <p className="text-sm mt-2">Created by Mahendra Mahara</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
