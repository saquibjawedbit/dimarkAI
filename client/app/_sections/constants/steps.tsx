import { BarChart3, Bot, Facebook } from "lucide-react";

export const steps = [
  {
    step: "01",
    title: "Connect your Facebook Page",
    description: "Securely link your Facebook Business account with our one-click integration.",
    icon: Facebook,
    gradient: "from-blue-500 to-indigo-600",
    delay: "delay-100",
  },
  {
    step: "02",
    title: "AI Agent generates tailored ads",
    description: "Our intelligent system analyzes your brand and creates high-converting ad campaigns.",
    icon: Bot,
    gradient: "from-indigo-500 to-purple-600",
    delay: "delay-200",
  },
  {
    step: "03",
    title: "Live monitoring & optimization",
    description: "Watch as AI continuously optimizes your campaigns for maximum ROI in real-time.",
    icon: BarChart3,
    gradient: "from-green-500 to-emerald-600",
    delay: "delay-300",
  },
]
