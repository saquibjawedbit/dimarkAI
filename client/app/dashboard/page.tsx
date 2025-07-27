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

  const stats: { Icon: React.ElementType; value: string; title: string }[] = [
    { Icon: DollarSign, value: "$12,847", title: "Total Revenue" },
    { Icon: Target, value: "24", title: "Active Campaigns" },
    { Icon: Eye, value: "1.2M", title: "Impressions" },
    { Icon: MousePointer, value: "3.4%", title: "Click Rate" },
  ];
  const campaigns: { name: string; status: string; budget: string; perf: string; imp: string }[] = [
    { name: "Summer Sale 2024", status: "Active", budget: "₹2,500", perf: "High", imp: "45.2K" },
    { name: "Product Launch", status: "Active", budget: "₹1,800", perf: "Medium", imp: "32.1K" },
    { name: "Brand Awareness", status: "Paused", budget: "₹3,200", perf: "Low", imp: "28.5K" },
  ];

  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-black bg-white px-6" >
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center flex-1 justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
            <p className="text-sm text-gray-500">Welcome back, John! Here's what's happening with your campaigns.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="relative bg-transparent">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="outline" size="sm"><Search className="w-4 h-4" /></Button>
            <Button className="bg-black text-white hover:bg-gray-900"><Plus className="w-4 h-4 mr-2 text-white" /> <span className="text-white">New Campaign</span></Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ Icon, value, title }, i) => (
            <Card key={i} className="border border-black shadow-sm bg-white p-4 flex flex-col items-center justify-center">
              <Icon className="w-7 h-7 text-black mb-2" />
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{title}</div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Campaigns */}
          <Card className="lg:col-span-2 border border-black shadow-sm bg-white transition hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-black">Recent Campaigns</CardTitle>
                <Button variant="outline" size="sm" className="border-black text-black">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {campaigns.map(({ name, status, budget, perf, imp }, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 group">
                    <div>
                      <div className="font-medium text-black group-hover:text-gray-900 transition">{name}</div>
                      <div className="text-xs text-gray-500">Budget: <span className="font-semibold">{budget}</span> • {imp} impressions</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {status === "Active" ? (
                        <Badge className="border-black bg-black text-white px-2 py-1 text-xs">{status}</Badge>
                      ) : status === "Paused" ? (
                        <Badge className="border-black bg-black text-white px-2 py-1 text-xs">{status}</Badge>
                      ) : (
                        <Badge className="border-black text-black px-2 py-1 text-xs">{status}</Badge>
                      )}
                      <Badge variant="outline" className="border-black text-black px-2 py-1 text-xs">{perf}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-black shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-black">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { Icon: Zap, label: "Create AI Campaign" },
                { Icon: Palette, label: "Design Banner" },
                { Icon: BarChart3, label: "View Analytics" },
                { Icon: Target, label: "Audience Insights" },
              ].map(({ Icon, label }, i) => (
                <Button key={i} className="w-full justify-start bg-black text-white hover:bg-gray-900 text-sm">
                  <Icon className="w-4 h-4 mr-2 text-white" /><span className="text-white">{label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="border border-black shadow-sm bg-white">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-black">AI Insights</CardTitle>
                <p className="text-xs text-gray-500">Powered by DiMark AI</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-black">Your "Summer Sale 2024" campaign is performing 23% better than similar campaigns</p>
                  <p className="text-xs text-gray-500 mt-1">Consider increasing the budget by 15% for optimal results</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-black">Audience engagement is highest between 2-4 PM on weekdays</p>
                  <p className="text-xs text-gray-500 mt-1">Adjust your ad scheduling to maximize reach</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-black">New targeting opportunity detected</p>
                  <p className="text-xs text-gray-500 mt-1">Expand to "Fitness Enthusiasts" audience for 18% potential reach increase</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
