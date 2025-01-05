'use client'

import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline'
import LoadingDots from '@/components/LoadingDots'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [emailData, setEmailData] = useState({
    recipient: '',
    subject: '',
    prompt: ''
  })
  const [generatedEmail, setGeneratedEmail] = useState('')

  const handleGenerate = async () => {
    if (!emailData.prompt || !emailData.subject) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })
      
      const data = await response.json()
      if (data.email) {
        setGeneratedEmail(data.email)
        toast.success('Email generated!')
      }
    } catch (error) {
      toast.error('Failed to generate email')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => {
    const mailtoLink = `mailto:${emailData.recipient}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(generatedEmail)}`
    window.location.href = mailtoLink
  }

  return (
    <div className="min-h-screen p-8 relative bg-gradient-to-br from-orange-300 via-pink-300 to-purple-300 animate-gradient-xy">
    <Toaster position="top-center" />
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800"
        >
          AI Email Generator
        </motion.h1>
        <p className="text-gray-600">Craft the perfect email in seconds</p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black p-8 rounded-xl shadow-lg space-y-6 border border-gray-100"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-500">Recipient Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full p-3 border border-gray-200 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
              value={emailData.recipient}
              onChange={(e) => setEmailData({ ...emailData, recipient: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-500">Subject</label>
            <input
              type="text"
              placeholder="Enter email subject"
              className="w-full p-3 border border-gray-200 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Description</label>
            <textarea
              placeholder="Describe what you want in the email..."
              className="w-full p-3 border border-gray-200 text-black rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
              value={emailData.prompt}
              onChange={(e) => setEmailData({ ...emailData, prompt: e.target.value })}
            />
          </div>
        </div>
        
        <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={handleGenerate}
  disabled={loading}
  className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2 font-medium"
>
  <SparklesIcon className="w-5 h-5" />
  <span className="flex items-center">
    {loading ? (
      <>
        Generating
        <LoadingDots />
      </>
    ) : (
      'Generate Email'
    )}
  </span>
</motion.button>
      </motion.div>
      
      {generatedEmail && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black p-8 rounded-xl shadow-lg space-y-6 border border-gray-100"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-500">Generated Email</label>
            <textarea
              className="w-full p-3 border border-gray-200 text-black rounded-lg h-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
              value={generatedEmail}
              onChange={(e) => setGeneratedEmail(e.target.value)}
            />
          </div>
          
          <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={handleSend}
  disabled={loading}
  className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium"
>
  <PaperAirplaneIcon className="w-5 h-5" />
  <span className="flex items-center">
    {loading ? (
      <>
        Opening
        <LoadingDots />
      </>
    ) : (
      'Open in Email Client'
    )}
  </span>
</motion.button>
        </motion.div>
      )}
    </motion.div>
  </div>
  )
}