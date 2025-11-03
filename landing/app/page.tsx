export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6">
            The AI that makes you look like a <span className="text-blue-400">senior developer</span>
          </h1>
          <p className="text-2xl text-slate-300 mb-12">
            Never write commit messages again. Track your progress. Build better, faster.
          </p>
          
          {/* Install Command */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <code className="text-blue-300 text-lg">npm install -g builderos</code>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-16">
            <a 
              href="#pricing" 
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition"
            >
              Get Started Free
            </a>
            <a 
              href="#demo" 
              className="bg-slate-700 hover:bg-slate-600 px-8 py-4 rounded-lg text-lg font-semibold transition"
            >
              Watch Demo
            </a>
          </div>
        </div>

        {/* Demo */}
        <div id="demo" className="max-w-3xl mx-auto bg-slate-950 rounded-lg p-6 mb-20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <pre className="text-sm">
            <code className="text-slate-300">
{`$ bq
⚡ Quick commit mode...

✓ Staged all changes
✓ Generating commit message...
✓ feat: add user authentication with JWT
✓ Committed abc1234
  +89 -12 across 4 files

Free tier: 9 commits remaining this month`}
            </code>
          </pre>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI Commit Messages</h3>
            <p className="text-slate-300">Claude 4.5 Sonnet generates perfect, professional commits every time.</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">One Command</h3>
            <p className="text-slate-300">Type bq and you're done. No more "fix", "update", "changes".</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
            <p className="text-slate-300">See your growth with beautiful stats and streaks.</p>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Trial */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">7-Day Trial</h3>
              <div className="text-4xl font-bold mb-6">$0</div>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li>✓ Unlimited commits for 7 days</li>
                <li>✓ All features included</li>
                <li>✓ No credit card required</li>
              </ul>
              <button className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition">
                Start Trial
              </button>
            </div>

            {/* Pro */}
            <div className="bg-blue-600/20 backdrop-blur border-2 border-blue-500 rounded-lg p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-2">$9.99<span className="text-lg text-slate-300">/month</span></div>
              <div className="text-slate-300 mb-6">or $100/year (save $20)</div>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li>✓ Unlimited AI commits</li>
                <li>✓ Advanced stats</li>
                <li>✓ All platforms</li>
                <li>✓ Priority support</li>
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 border-t border-slate-700 pt-12">
          <p>Made with ❤️ for developers who want to focus on building, not git messages.</p>
          <div className="flex gap-6 justify-center mt-4">
            <a href="https://github.com/Arjun0606/builderOS" className="hover:text-blue-400">GitHub</a>
            <a href="https://twitter.com/builderos" className="hover:text-blue-400">Twitter</a>
            <a href="mailto:support@builderos.dev" className="hover:text-blue-400">Support</a>
          </div>
        </div>
      </div>
    </div>
  )
}

