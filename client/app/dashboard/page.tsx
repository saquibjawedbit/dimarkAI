"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Bot,
  BarChart3,
  Target,
  Palette,
  DollarSign,
  Eye,
  MousePointer,
  Zap,
  Plus,
  Bell,
  Search,
} from "lucide-react"

export default function DashboardPage() {

  const stats = [
    {
      title: "Total Revenue",
      value: "$12,847",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active Campaigns",
      value: "24",
      change: "+3",
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Impressions",
      value: "1.2M",
      change: "+18.2%",
      icon: Eye,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Click Rate",
      value: "3.4%",
      change: "+0.8%",
      icon: MousePointer,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  const recentCampaigns = [
    {
      name: "Summer Sale 2024",
      status: "Active",
      budget: "$2,500",
      performance: "High",
      impressions: "45.2K",
    },
    {
      name: "Product Launch",
      status: "Active",
      budget: "$1,800",
      performance: "Medium",
      impressions: "32.1K",
    },
    {
      name: "Brand Awareness",
      status: "Paused",
      budget: "$3,200",
      performance: "Low",
      impressions: "28.5K",
    },
  ]

  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-6" >
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center flex-1 justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
            <p className="text-sm text-gray-500">
              Welcome back, John! Here's what's happening with your campaigns.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="relative bg-transparent">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>
      </header >

      {/* Main Content */}
      < main className="flex-1 p-6 space-y-6" >
        {/* Stats Grid */}
        < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" >
          {
            stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last month</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div >

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Campaigns */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Campaigns</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCampaigns.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge
                          variant={campaign.status === "Active" ? "default" : "secondary"}
                          className={
                            campaign.status === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {campaign.status}
                        </Badge>
                        <span className="text-sm text-gray-500">Budget: {campaign.budget}</span>
                        <span className="text-sm text-gray-500">{campaign.impressions} impressions</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          campaign.performance === "High"
                            ? "border-green-200 text-green-700"
                            : campaign.performance === "Medium"
                              ? "border-yellow-200 text-yellow-700"
                              : "border-red-200 text-red-700"
                        }
                      >
                        {campaign.performance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                <Zap className="w-4 h-4 mr-2" />
                Create AI Campaign
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Palette className="w-4 h-4 mr-2" />
                Design Banner
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Target className="w-4 h-4 mr-2" />
                Audience Insights
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">AI Insights</CardTitle>
                <p className="text-sm text-gray-600">Powered by DiMark AI</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Your "Summer Sale 2024" campaign is performing 23% better than similar campaigns
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Consider increasing the budget by 15% for optimal results
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Audience engagement is highest between 2-4 PM on weekdays
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Adjust your ad scheduling to maximize reach</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New targeting opportunity detected</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Expand to "Fitness Enthusiasts" audience for 18% potential reach increase
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
