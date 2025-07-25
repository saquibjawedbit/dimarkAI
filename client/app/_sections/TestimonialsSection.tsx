import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { testimonials } from "./constants/testimonials"
import React, { useState, useEffect } from "react"



export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-fade-in-up">
            What Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Customers</span>{" "}Say
          </h2>
        </div>
        <div className="max-w-4xl mx-auto relative">
          <Card className="bg-white border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-yellow-400 fill-current animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
                <p className="text-2xl text-gray-700 leading-relaxed italic animate-fade-in">
                  "{testimonials[currentTestimonial].quote}"
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4 animate-fade-in delay-200">
                <Avatar className="w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg">
                    {testimonials[currentTestimonial].avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</p>
                  <p className="text-gray-600">{testimonials[currentTestimonial].business}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentTestimonial
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
