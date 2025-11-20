export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600 mx-auto"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 rounded-full animate-ping opacity-20 mx-auto"></div>
        </div>
        <h2 className="mt-6 text-xl font-semibold text-slate-700">Loading...</h2>
        <p className="mt-2 text-sm text-slate-500">Please wait while we prepare your experience</p>
      </div>
    </div>
  )
}
