import { Bot, Twitter, Linkedin, Instagram } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="py-12 bg-gray-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-3 mb-4 md:mb-0 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              DiMark AI
            </span>
          </div>
          <div className="flex space-x-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors duration-300 hover:scale-105 transform">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-300 hover:scale-105 transform">Pricing</a>
            <a href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 transform">Contact</a>
            <a href="#privacy" className="hover:text-white transition-colors duration-300 hover:scale-105 transform">Privacy</a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 DiMark AI. All rights reserved. Powered by DiMark AI</p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110 group">
              <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110 group">
              <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110 group">
              <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
