import {
    ShoppingBag,
    Utensils,
    Dumbbell,
    Camera,
    Coffee,
    Briefcase,
    Heart,
    Car,
    Home,
    Palette,
    Music,
    BookOpen,
    Plane
} from "lucide-react"

export const businessTypes = [
    { id: "ecommerce", name: "E-commerce", icon: ShoppingBag, color: "bg-blue-500" },
    { id: "restaurant", name: "Restaurant", icon: Utensils, color: "bg-green-500" },
    { id: "fitness", name: "Fitness & Gym", icon: Dumbbell, color: "bg-purple-500" },
    { id: "photography", name: "Photography", icon: Camera, color: "bg-pink-500" },
    { id: "coffee", name: "Coffee Shop", icon: Coffee, color: "bg-orange-500" },
    { id: "consulting", name: "Consulting", icon: Briefcase, color: "bg-indigo-500" },
    { id: "healthcare", name: "Healthcare", icon: Heart, color: "bg-red-500" },
    { id: "automotive", name: "Automotive", icon: Car, color: "bg-gray-500" },
    { id: "realestate", name: "Real Estate", icon: Home, color: "bg-emerald-500" },
    { id: "creative", name: "Creative Services", icon: Palette, color: "bg-yellow-500" },
    { id: "entertainment", name: "Entertainment", icon: Music, color: "bg-violet-500" },
    { id: "education", name: "Education", icon: BookOpen, color: "bg-cyan-500" },
    { id: "travel", name: "Travel & Tourism", icon: Plane, color: "bg-teal-500" },
]

export const budgetRanges = [
    { id: "small", label: "$100 - $500/month", description: "Perfect for small local businesses" },
    { id: "medium", label: "$500 - $2,000/month", description: "Great for growing businesses" },
    { id: "large", label: "$2,000 - $10,000/month", description: "Ideal for established companies" },
    { id: "enterprise", label: "$10,000+/month", description: "For large enterprises and agencies" },
]

export const goals = [
    { id: "awareness", name: "Brand Awareness", description: "Get your business known in your area" },
    { id: "leads", name: "Generate Leads", description: "Collect contact information from potential customers" },
    { id: "sales", name: "Drive Sales", description: "Increase direct sales and revenue" },
    { id: "traffic", name: "Website Traffic", description: "Bring more visitors to your website" },
    { id: "engagement", name: "Social Engagement", description: "Build a community around your brand" },
    { id: "app", name: "App Downloads", description: "Promote your mobile application" },
]
