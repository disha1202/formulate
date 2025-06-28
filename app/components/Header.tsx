import { Sparkles } from "lucide-react"

const Header = () => {
    return (
        <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Formulate
                </h1>
                <p className="text-sm text-gray-500">Create stunning forms with ease</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Header