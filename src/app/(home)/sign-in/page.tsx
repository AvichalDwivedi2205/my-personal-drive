import { SignInButton } from "@clerk/nextjs";
import { Cloud, Shield, Zap, Upload } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="mb-6 bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
            Welcome Back
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-neutral-400 md:text-2xl">
            Sign in to access your secure, fast, and easy file storage platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center animate-slide-in hover-lift">
            <div className="mx-auto w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
              <Cloud className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-200">Cloud Storage</h3>
            <p className="text-neutral-400">Securely store and access your files from anywhere</p>
          </div>
          
          <div className="text-center animate-slide-in hover-lift" style={{ animationDelay: '0.1s' }}>
            <div className="mx-auto w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-200">Secure Access</h3>
            <p className="text-neutral-400">Advanced security with encrypted file storage</p>
          </div>
          
          <div className="text-center animate-slide-in hover-lift" style={{ animationDelay: '0.2s' }}>
            <div className="mx-auto w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-200">Lightning Fast</h3>
            <p className="text-neutral-400">Quick uploads and instant file access</p>
          </div>
        </div>

        {/* Sign In Section */}
        <div className="text-center animate-scale-in">
          <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-8 max-w-md mx-auto">
            <div className="mb-6">
              <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-200 mb-2">Ready to get started?</h2>
              <p className="text-neutral-400">Sign in to your account and start managing your files</p>
            </div>
            
            <SignInButton forceRedirectUrl={"/drive"}>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 transform hover:scale-105">
                Sign In to Your Drive
              </button>
            </SignInButton>
            
            <p className="text-xs text-neutral-500 mt-4">
              By signing in, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-neutral-500 animate-fade-in">
          © {new Date().getFullYear()} T3 Drive. All rights reserved.
        </footer>
      </div>
    </div>
  );
}