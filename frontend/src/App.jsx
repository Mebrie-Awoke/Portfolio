import { useState } from "react";
import { ArrowDown, ArrowUpRight, Bot, BrainCircuit, BriefcaseBusiness, Code2, Github, GraduationCap, Mail, Menu, MessageCircle, Send, Sparkles, X, Zap } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const skills = [
 ["Programming","Python","JavaScript","SQL","Java","C++","HTML5","CSS3"],
 ["AI / ML","PyTorch","scikit-learn","Deep Learning","CNNs","Transfer Learning"],
 ["NLP / GenAI","Transformers","LLMs","RAG","LangChain","Hugging Face","Semantic Search"],
 ["Backend","FastAPI","Django","Flask","REST APIs"],
 ["Frontend","React","React Native"],
 ["Data & Tools","MongoDB","ChromaDB","Git","GitHub","VS Code"]
];
const projects = [
 ["01","SmartFarm","AI-integrated agriculture","An agricultural technology project exploring how software and AI-oriented functionality can support agricultural activities and access to useful information.",["Python","JavaScript","Machine Learning"]],
 ["02","RAG Chatbots","Conversational AI","AI-powered assistants including Adwa Victory and Medibot. The medical assistant retrieves information from PDF documents using embeddings and ChromaDB, then generates contextual answers with LangChain and Groq.",["Python","LangChain","ChromaDB","Groq"]],
 ["03","HireLens","Resume & job matching","A job-fit application comparing resume content with job descriptions, highlighting matching and missing skills, and providing career recommendations.",["Python","FastAPI","React"]],
 ["04","Telegram RAG Assistant","AI integration","A Telegram conversational application exploring retrieval-based responses and language-model integration through backend services.",["Python","RAG","Groq API","Telegram API"]],
 ["05","Music Recommendation","Machine learning","A recommendation engine that analyzes music data and preferences to support personalized song discovery.",["Python","Pandas","scikit-learn"]]
];
const jobs = [
 ["Innovation Intern","Arada Subcity","Contributing to software development and digital service initiatives, including practical solutions, APIs, and database design."],
 ["Website & Mobile App Developer Intern","Orient PLC","Worked on an e-commerce platform, implementing application features and connecting frontend and backend functionality."],
 ["Full-Stack Freelancer","Upwork","Developed web applications and software solutions across frontend and backend components."],
 ["Backend Developer","Additional experience","This role is listed in the CV without an employer or dates; further details can be provided on request."]
];

function Assistant() {
 const [open,setOpen]=useState(false);
 const [question,setQuestion]=useState("");
 const [loading,setLoading]=useState(false);
 const [messages,setMessages]=useState([{
  role:"assistant",
  text:"Hi! I'm Mebrie's portfolio assistant. Ask me about his experience, skills, projects, or education."
 }]);

 async function submit(event){
  event.preventDefault();
  const q=question.trim();
  if(q.length<2||loading)return;

  setMessages(items=>[...items,{role:"user",text:q}]);
  setQuestion("");
  setLoading(true);

  try{
   const response=await fetch(API+"/api/chat",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({question:q})
   });
   let data={};
   try{data=await response.json();}catch{/* Handle a non-JSON server response below. */}
   if(!response.ok){
    const detail=typeof data.detail==="string"?data.detail:"The assistant is temporarily unavailable.";
    throw new Error(detail);
   }
   setMessages(items=>[...items,{
    role:"assistant",
    text:data.answer||"I couldn't generate an answer. Please try again.",
    sources:Array.isArray(data.sources)?data.sources:[]
   }]);
  }catch(error){
   setMessages(items=>[...items,{
    role:"assistant",
    text:error.name==="TypeError"
     ?"Couldn't connect to the assistant. Check your connection and try again."
     :(error.message||"Something went wrong. Please try again.")
   }]);
  }finally{
   setLoading(false);
  }
 }

 return <>
  <button className="assistant-launch" onClick={()=>setOpen(value=>!value)}
   aria-label={open?"Close AI assistant":"Open AI assistant"} aria-expanded={open}>
   {open?<X size={20}/>:<><MessageCircle size={19}/> Ask my AI</>}
  </button>
  {open&&<aside className="chat-panel" aria-label="Portfolio AI assistant">
   <div className="chat-head">
    <div className="bot-avatar"><Bot size={19}/></div>
    <div><b>Portfolio AI</b><small><i/> RAG-powered assistant</small></div>
    <button className="icon-button" onClick={()=>setOpen(false)} aria-label="Close chat"><X size={18}/></button>
   </div>
   <div className="chat-messages" aria-live="polite" aria-relevant="additions">
    {messages.map((message,index)=><div key={index} className={"chat-message "+message.role}>
     <span>{message.text}</span>
     {message.sources?.length>0&&<details className="chat-sources">
      <summary>View {message.sources.length} retrieved source{message.sources.length===1?"":"s"}</summary>
      {message.sources.map((source,sourceIndex)=><p key={sourceIndex}><b>{source.section}</b><br/>{source.excerpt}</p>)}
     </details>}
    </div>)}
    {loading&&<div className="chat-message assistant">Searching portfolio knowledge…</div>}
   </div>
   <form className="chat-form" onSubmit={submit}>
    <input value={question} onChange={event=>setQuestion(event.target.value)}
     placeholder="Ask about my projects…" maxLength={1000} aria-label="Your question"/>
    <button disabled={loading||question.trim().length<2} aria-label="Send question"><Send size={17}/></button>
   </form>
   <p className="chat-note">Answers are grounded in information from the CV and portfolio.</p>
  </aside>}
 </>;
}

export default function App(){
 const [menu,setMenu]=useState(false),nav=["About","Skills","Projects","Experience","Contact"];
 return <div className="site-shell">
  <header className="topbar"><a className="brand" href="#home">MA<span>.</span></a><button className="mobile-menu" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation" aria-expanded={menu}>{menu?<X/>:<Menu/>}</button><nav className={menu?"nav-links show":"nav-links"}>{nav.map(n=><a key={n} href={"#"+n.toLowerCase()} onClick={()=>setMenu(false)}>{n}</a>)}<a className="nav-cta" href="mailto:mebrieawoke941@gmail.com">Let's talk <ArrowUpRight size={15}/></a></nav></header>
  <main>
   <section className="hero section-wrap" id="home"><div className="hero-copy"><div className="eyebrow"><i/> AVAILABLE FOR OPPORTUNITIES</div><p className="hero-kicker">Hello, I'm</p><h1>Mebrie <span>Awoke.</span></h1><h2>AI/ML Engineer <i>×</i> Software Developer</h2><p className="hero-description">I build intelligent software systems that turn ideas and data into useful experiences. Focused on applied AI, machine learning, and backend engineering.</p><div className="hero-actions"><a className="primary-button" href="#projects">Explore my work <ArrowUpRight size={17}/></a><a className="text-button" href="mailto:mebrieawoke941@gmail.com">Get in touch <ArrowUpRight size={16}/></a></div><div className="hero-meta"><span><GraduationCap size={16}/> Information Science · AAU</span><span><i/> Addis Ababa, Ethiopia</span></div></div><div className="hero-art"><div className="orbit one"/><div className="orbit two"/><div className="hero-core"><BrainCircuit size={76}/><span>AI × SOFTWARE</span></div><div className="float-card python"><Code2 size={17}/> Python</div><div className="float-card rag"><Sparkles size={17}/> RAG systems</div><div className="float-card api"><Zap size={17}/> APIs</div><div className="art-caption">Curiosity → Engineering → Impact</div></div><a className="scroll-cue" href="#about"><ArrowDown size={15}/> SCROLL TO EXPLORE</a></section>
   <section className="intro-strip"><div><b>01</b> Curious by nature</div><div><b>02</b> Engineer by practice</div><div><b>03</b> AI for real-world problems</div></section>
   <section className="content-section section-wrap" id="about"><div className="section-label">01 / ABOUT ME</div><div className="about-grid"><h2 className="section-title">Building at the intersection of <span>AI and software.</span></h2><div className="about-copy"><p>I'm a self-taught software developer and fourth-year Information Science student at Addis Ababa University. My work spans backend and full-stack development, with a growing focus on artificial intelligence and machine learning.</p><p>I'm interested in natural language processing, computer vision, predictive modeling, and intelligent automation. I enjoy learning by building practical projects and exploring how technology can solve meaningful problems.</p><div className="education-card"><GraduationCap size={22}/><div><b>BSc in Information Science</b><span>Addis Ababa University · 2023 — Present</span></div></div></div></div></section>
   <section className="content-section section-wrap" id="skills"><div className="section-label">02 / TOOLKIT</div><div className="section-heading"><h2 className="section-title">Skills & <span>technologies.</span></h2><p>A growing toolkit across software engineering and applied AI.</p></div><div className="skills-grid">{skills.map(([title,...tags])=><article className="skill-card" key={title}><h3>{title}</h3><div className="skill-tags">{tags.map(t=><span key={t}>{t}</span>)}</div></article>)}</div></section>
   <section className="content-section section-wrap" id="projects"><div className="section-label">03 / SELECTED WORK</div><div className="section-heading"><h2 className="section-title">Projects with <span>purpose.</span></h2><p>A selection of projects and technical explorations from my CV.</p></div><div className="projects-grid">{projects.map(([num,name,type,desc,tags])=><article className="project-card" key={num}><div className="project-top"><b>{num}</b><ArrowUpRight size={18}/></div><p className="project-type">{type}</p><h3>{name}</h3><p className="project-description">{desc}</p><div className="project-stack">{tags.map(t=><span key={t}>{t}</span>)}</div></article>)}</div><p className="project-footnote">Repository links will be added after verifying each public project repository.</p></section>
   <section className="content-section section-wrap" id="experience"><div className="section-label">04 / EXPERIENCE</div><div className="section-heading"><h2 className="section-title">Where I've <span>contributed.</span></h2><p>Professional experience and practical software development.</p></div><div className="timeline">{jobs.map(([role,company,detail],i)=><article className="timeline-item" key={role}><div className="timeline-marker">{String(i+1).padStart(2,"0")}</div><div><h3>{role}</h3><h4>{company}</h4><p>{detail}</p></div></article>)}</div></section>
   <section className="contact-section" id="contact"><div className="section-wrap contact-inner"><div className="section-label">05 / GET IN TOUCH</div><h2>Have a meaningful<br/><span>problem to solve?</span></h2><p>I'm interested in opportunities to contribute to practical software and AI/ML solutions.</p><a className="primary-button" href="mailto:mebrieawoke941@gmail.com">Start a conversation <ArrowUpRight size={17}/></a><div className="contact-details"><a href="mailto:mebrieawoke941@gmail.com"><Mail size={17}/> mebrieawoke941@gmail.com</a><span><BriefcaseBusiness size={17}/> Addis Ababa, Ethiopia</span><a href="tel:+251922545447">+251 922 545 447</a><a href="https://github.com/Mebrie-Awoke" target="_blank" rel="noreferrer"><Github size={17}/> GitHub profile</a></div></div></section>
  </main><footer className="footer"><a className="brand" href="#home">MA<span>.</span></a><span>Designed & built by Mebrie Awoke Yizngaw</span><span>© {new Date().getFullYear()}</span></footer><Assistant/>
 </div>;
}
