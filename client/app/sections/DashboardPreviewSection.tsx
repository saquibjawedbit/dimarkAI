import React from "react"

export default function DashboardPreviewSection({ progressValue }: { progressValue: number }) {
  return (
    <div className={`relative transform transition-all duration-1000 delay-300 translate-y-0 opacity-100`}>
      <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border border-gray-200/50 hover:shadow-3xl transition-all duration-500 hover:scale-105">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Campaign Dashboard</h3>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-blue-600 animate-count-up">₹2,847</div>
              <div className="text-sm text-gray-600">Revenue Generated</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-bold text-green-600 animate-count-up">4.2x</div>
              <div className="text-sm text-gray-600">ROAS</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">AI Optimization</span>
              <span className="text-green-500 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Active
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-2000 ease-out"
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 text-right">{progressValue}% Optimized</div>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-float"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-30 animate-float-delayed"></div>
    </div>
  )
}
