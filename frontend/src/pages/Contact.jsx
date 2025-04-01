import React, { useState } from 'react'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSubmitStatus(''), 3000)
      } catch (error) {
        setSubmitStatus('error')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="mt-4 text-gray-600">We'd love to hear from you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <HiOutlinePhone className="text-primary w-6 h-6" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">+1 234 567 890</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <HiOutlineMail className="text-primary w-6 h-6" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">contact@bookstore.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <HiOutlineLocationMarker className="text-primary w-6 h-6" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600">123 Book Street, Reading City, 12345</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Added Social Links Section */}
              <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                <p className="mb-6 opacity-90">Follow us on social media for updates and book recommendations</p>
                <div className="flex space-x-4">
                  {/* Social links can be added here */}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary ${errors.name ? 'border-red-500' : ''}`}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value})
                      if(errors.name) setErrors({...errors, name: ''})
                    }}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary ${errors.email ? 'border-red-500' : ''}`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value})
                      if(errors.email) setErrors({...errors, email: ''})
                    }}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject (Optional)</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary ${errors.message ? 'border-red-500' : ''}`}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({...formData, message: e.target.value})
                      if(errors.message) setErrors({...errors, message: ''})
                    }}
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl
                    hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300
                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {submitStatus === 'success' && (
                  <p className="text-green-600 text-center mt-4">
                    Thank you for your message. We'll get back to you soon!
                  </p>
                )}

                {submitStatus === 'error' && (
                  <p className="text-red-600 text-center mt-4">
                    Something went wrong. Please try again later.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
