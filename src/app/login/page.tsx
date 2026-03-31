'use client'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Form fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (isLogin) {
                await axios.post('/api/auth/login', { email, password })
            } else {
                await axios.post('/api/auth/register', { email, password, name })
            }
            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-zinc-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-zinc-200"
            >
                <div className="text-center mb-8">
                    <div className="text-2xl font-semibold tracking-tight cursor-pointer inline-block" onClick={() => router.push('/')}>
                        Support <span className="text-zinc-400">AI</span>
                    </div>
                </div>

                <div className="flex bg-zinc-100 rounded-lg p-1 mb-8">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition ${isLogin ? 'bg-white shadow text-black' : 'text-zinc-500 hover:text-black'}`}
                        onClick={() => { setIsLogin(true); setError(''); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition ${!isLogin ? 'bg-white shadow text-black' : 'text-zinc-500 hover:text-black'}`}
                        onClick={() => { setIsLogin(false); setError(''); }}
                    >
                        Create Account
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                                placeholder="John Doe"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-medium">
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className="w-full mt-4 bg-black text-white font-medium py-3 rounded-xl disabled:opacity-70 transition"
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}
