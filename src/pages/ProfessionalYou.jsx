import { Link } from 'react-router-dom';

export default function ProfessionalYou() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 w-full overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
          <Link to="/" className="text-slate-400 hover:text-white transition font-medium flex items-center gap-2">
            <span>←</span> Portfolio Home
          </Link>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-500">Case Study: Agentic RAG</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20 space-y-32">
        
        {/* 1. Header & Executive Summary */}
        <section className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">Professional Alter Ego</h1>
          <div className="flex flex-wrap justify-center gap-3">
            {['LangChain', 'OpenAI GPT-4o', 'ChromaDB', 'GraphQL', 'Pushover API'].map(tech => (
              <span key={tech} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
            A specialized AI advocate built to bridge the gap between static resumes and recruiter engagement. 
            By leveraging <strong>Retrieval-Augmented Generation (RAG)</strong>, the agent provides validated 
            insights into my SFU engineering background and professional achievements.
          </p>
        </section>

        {/* 2. Problem & Evolution (The "Pivot") */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em]">The Engineering Challenge</h2>
            <h3 className="text-3xl font-bold text-white">From Scraping to RAG</h3>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[40px] space-y-6">
            <p className="text-slate-400 leading-relaxed">
              Initially, I architected a system to perform <strong>live LinkedIn scraping</strong> to ensure up-to-date data. However, due to restrictive anti-scraping policies and API rate limits, I pivoted to a persistent vector-store approach.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-800">
              <div>
                <h4 className="text-white font-bold mb-2">The Solution: ChromaDB</h4>
                <p className="text-sm text-slate-500">Implemented a local vector database using ChromaDB to store high-density embeddings of my SFU transcripts, GitHub documentation, and professional project logs.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">The Outcome: Zero Hallucination</h4>
                <p className="text-sm text-slate-500">By forcing the LLM to ground its answers in retrieved context, I eliminated common "hallucinations" regarding dates, degree specifics, and project roles.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Deep Technical Architecture */}
        <section className="space-y-12">
          <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em] text-center">System Architecture</h2>
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 space-y-4">
                <h4 className="text-2xl font-bold text-white">Persistent RAG Pipeline</h4>
                <p className="text-slate-400 leading-relaxed">
                  The system uses <strong>PyPDFLoader</strong> to ingest career documentation, which is then split into semantic chunks using <strong>RecursiveCharacterTextSplitter</strong>. This ensures that the context provided to the LLM maintains its technical meaning without cutting off critical engineering details.
                </p>
              </div>
              <div className="md:w-1/2 bg-slate-900 p-8 rounded-3xl border border-slate-800">
                <code className="text-xs text-blue-300 space-y-2">
                  <p>// Chunking Strategy</p>
                  <p>chunk_size=1000,</p>
                  <p>chunk_overlap=150,</p>
                  <p>vector_store=ChromaDB</p>
                </code>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="md:w-1/2 space-y-4">
                <h4 className="text-2xl font-bold text-white">Agentic Tool-Use</h4>
                <p className="text-slate-400 leading-relaxed">
                  Beyond simple chat, the agent is equipped with a <strong>custom GitHub tool</strong>. Using the GitHub GraphQL API, it can fetch my pinned repositories and live commit data to answer questions about my most recent codebases in real-time.
                </p>
              </div>
              <div className="md:w-1/2 bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center">
                 <span className="text-5xl">📊</span>
                 <p className="text-xs text-slate-500 mt-4">Live GraphQL Integration</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Real-Time Lead Capture (Pushover) */}
        <section className="space-y-12">
           <div className="text-center space-y-4">
              <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em]">Closing the Loop</h2>
              <h3 className="text-3xl font-bold text-white">Instant Recruiter Notifications</h3>
           </div>
           <div className="flex flex-col items-center space-y-8">
             <div className="bg-slate-900 p-4 rounded-[40px] border border-slate-800 relative">
                
                <img 
                  src="/pushover-proof.jpeg" 
                  alt="Pushover Proof" 
                  className="rounded-[32px] w-full max-w-xs shadow-2xl"
                />
             </div>
             <p className="text-slate-400 text-center max-w-2xl">
               Integrated the <strong>Pushover API</strong> to handle lead capture. When a user expresses interest, the agent triggers a POST request to my mobile device, allowing for immediate follow-up on potential career opportunities.
             </p>
           </div>
        </section>

        {/* 5. Live Interactive Demo */}
        <section className="space-y-12 pb-20">
           <div className="text-center space-y-4">
              <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em]">Interactive Experience</h2>
              <h3 className="text-3xl font-bold text-white">Converse with the Agent</h3>
           </div>
           <div className="bg-slate-900 rounded-[40px] border border-slate-800 shadow-2xl overflow-hidden h-[800px] w-full relative">
              <div className="absolute top-0 w-full bg-slate-800/50 backdrop-blur px-6 py-3 flex items-center justify-between border-b border-slate-700 z-10">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Instance: hf-space-prod-01</span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
              </div>
              <iframe
                src="https://sirpreet-professional-alter-ego.hf.space"
                className="w-full h-full border-none pt-12"
                title="Live Agent Demo"
              ></iframe>
           </div>
        </section>
      </main>

      <footer className="py-12 text-center text-slate-600 text-[10px] tracking-widest uppercase border-t border-slate-900">
        Engineered by Sirpreet Dhillon • 2026
      </footer>
    </div>
  );
}