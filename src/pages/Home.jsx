import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 w-full overflow-x-hidden">
      {/* Social & Nav Bar */}
      <nav className="w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tighter text-white">SIRPREET DHILLON</h2>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest font-bold">
            <a href="https://github.com/siri-dhillon" target="_blank" className="hover:text-blue-400 transition">GitHub</a>
            <a href="https://linkedin.com/in/sirpreet" target="_blank" className="hover:text-blue-400 transition">LinkedIn</a>
            <a href="https://huggingface.co/Sirpreet" target="_blank" className="hover:text-blue-400 transition">Hugging Face</a>
          </div>
        </div>
      </nav>

      {/* Main Stacked Content */}
      <main className="max-w-4xl mx-auto px-6 py-20 space-y-32">
        
        {/* Section 1: Identity (Centered) */}
        <section className="flex flex-col items-center text-center space-y-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-25"></div>
            <img 
              src="/images/headshot.jpg" 
              alt="Sirpreet Dhillon" 
              className="relative rounded-full w-48 h-48 object-cover border-2 border-slate-800 shadow-2xl"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold text-white tracking-tight">Software & AI Engineer</h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mx-auto">
              I specialize in building scalable data infrastructure and autonomous systems. 
              Bachelor of Applied Science in Computer Engineering from Simon Fraser University.
            </p>
          </div>
        </section>

        {/* Section 2: Technical Expertise (Stacked) */}
        <section className="space-y-12">
          <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em] text-center">Technical Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "AI & Machine Learning", desc: "Deep Neural Networks, TensorFlow, PyTorch, RAG Architecture." },
              { title: "Robotics & Autonomy", desc: "ROS, SLAM Algorithms, LiDAR Data, Hardware Interfaces." },
              { title: "Cloud & DevOps", desc: "AWS Certified, Serverless Pipelines, CI/CD Workflows." },
              { title: "Languages", desc: "Python, C++, SQL, Bash Scripting." }
            ].map((item) => (
              <div key={item.title} className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl hover:border-slate-700 transition">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Professional Impact (Stacked) */}
        <section className="space-y-12 bg-slate-900/20 py-16 px-8 rounded-[40px] border border-slate-900">
          <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em] text-center">Impact & Results</h2>
          <div className="max-w-2xl mx-auto space-y-10">
            <div className="flex gap-6">
              <span className="text-3xl">🏎️</span>
              <div>
                <h4 className="text-white font-bold text-lg">Ford Motor Company</h4>
                <p className="text-slate-400 mt-1">Authored automation scripts that reduced testing runtime by 6.25%.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <span className="text-3xl">🏥</span>
              <div>
                <h4 className="text-white font-bold text-lg">Medical Imaging Infrastructure</h4>
                <p className="text-slate-400 mt-1">Designed ETL pipelines achieving 100% data accuracy for clinical research.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Projects (Featured Tile) */}
        <section className="space-y-12 pb-20">
          <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em] text-center">Featured Projects</h2>
          <Link to="/project-ai" className="group block relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-[40px] p-12 hover:border-blue-500/50 transition-all duration-500">
            <div className="flex flex-col items-center text-center space-y-6">
              <span className="text-5xl">🤖</span>
              <h3 className="text-3xl font-bold text-white">Professional Alter Ego</h3>
              <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
                A RAG-powered digital twin built to automate job-hunt engagement. 
                Experience a live interaction with my AI advocate.
              </p>
              <span className="text-blue-400 font-bold text-sm group-hover:translate-x-2 transition-transform">Launch Case Study & Demo →</span>
            </div>
          </Link>
        </section>

      </main>

      <footer className="py-12 text-center text-slate-600 text-[10px] tracking-widest uppercase border-t border-slate-900">
        SFU Computer Engineering • Class of 2023
      </footer>
    </div>
  );
}