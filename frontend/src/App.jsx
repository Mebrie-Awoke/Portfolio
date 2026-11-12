import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Bot, FileDown, BrainCircuit, BriefcaseBusiness, Code2, Github, GraduationCap, Mail, Menu, MessageCircle, Send, Sparkles, X, Zap, Sun, Moon } from "lucide-react";

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
];

function Assistant() {
 const [open,setOpen]=useState(false);
 const [question,setQuestion]=useState("");
 const [loading,setLoading]=useState(false);
 const [messages,setMessages]=useState([{
  role:"assistant",
  text:"Hello! I'm Mebrie's portfolio assistant. Ask me about my experience, skills, projects, or education."
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
    <div><b>Portfolio AI</b><small><i/> Here to help</small></div>
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
   
  </aside>}
 </>;
}

function ContactForm(){
 const [values,setValues]=useState({name:"",email:"",subject:"",message:"",code:"",website:""});
 const [stage,setStage]=useState("details");
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");
 const [error,setError]=useState("");
 const api=async(path,body)=>{
  const response=await fetch(API+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.detail||"Something went wrong. Please try again.");
  return data;
 };
 const change=event=>setValues(current=>({...current,[event.target.name]:event.target.value}));
 async function requestCode(event){
  event.preventDefault();setBusy(true);setError("");setNotice("");
  try{const result=await api("/api/contact/send-code",{email:values.email,website:values.website});setStage("verify");setNotice(result.message||"Check your inbox for the verification code.");}
  catch(err){setError(err.message);}
  finally{setBusy(false);}
 }
 async function verifyAndSend(event){
  event.preventDefault();setBusy(true);setError("");setNotice("");
  try{const result=await api("/api/contact/verify-and-send",values);setStage("sent");setNotice(result.message||"Your message has been sent.");}
  catch(err){setError(err.message);}
  finally{setBusy(false);}
 }
 return <div className="contact-form-card">
  {stage==="sent"?<div className="contact-success"><div className="success-mark">✓</div><h3>Message sent.</h3><p>Thanks for reaching out. Your verified message has been delivered to my inbox.</p><button type="button" className="form-secondary" onClick={()=>{setValues({name:"",email:"",subject:"",message:"",code:"",website:""});setStage("details");setNotice("");}}>Send another message</button></div>:<>
   <div className="form-heading"><span>LET'S CONNECT</span><h3>{stage==="verify"?"Verify your email":"Send me a message"}</h3><p>{stage==="verify"?"Enter the 6-digit code sent to "+values.email+".":"Your email will be verified before your message is delivered."}</p></div>
   {stage==="details"?<form onSubmit={requestCode} className="contact-form">
    <label>Your name<input name="name" value={values.name} onChange={change} required minLength={2} maxLength={100} placeholder="Your name"/></label>
    <label>Email address<input name="email" type="email" value={values.email} onChange={change} required maxLength={254} placeholder="you@example.com"/></label>
    <label>Subject<input name="subject" value={values.subject} onChange={change} required minLength={2} maxLength={150} placeholder="What is this about?"/></label>
    <label>Message<textarea name="message" value={values.message} onChange={change} required minLength={10} maxLength={5000} rows={5} placeholder="Tell me a little about it…"/></label>
    <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" value={values.website} onChange={change} tabIndex={-1} autoComplete="off"/></label>
    <button className="primary-button form-submit" disabled={busy}>{busy?"Sending code…":<>Verify email & continue <ArrowUpRight size={16}/></>}</button>
   </form>:<form onSubmit={verifyAndSend} className="contact-form">
    <label>6-digit verification code<input name="code" value={values.code} onChange={change} required inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} placeholder="000000"/></label>
    <p className="verification-hint">The code expires in 10 minutes. Check your spam folder if you don't see it.</p>
    <button className="primary-button form-submit" disabled={busy||values.code.length!==6}>{busy?"Verifying & sending…":<>Verify & send message <Send size={16}/></>}</button>
    <button type="button" className="form-secondary" onClick={()=>{setStage("details");setValues(current=>({...current,code:""}));setError("");setNotice("");}}>Back to edit message</button>
   </form>}
   {notice&&<p className="form-notice" role="status">{notice}</p>}
   {error&&<p className="form-error" role="alert">{error}</p>}
  </>}
 </div>;
}

export default function App(){
 const [menu,setMenu]=useState(false);
 const [theme,setTheme]=useState(()=>localStorage.getItem("portfolio-theme")||"light");
 useEffect(()=>{localStorage.setItem("portfolio-theme",theme);},[theme]);
 const nav=["About","Skills","Projects","Experience","Contact"];
 return <div className="site-shell" data-theme={theme}>
  <header className="topbar"><a className="brand" href="#home" aria-label="Mebrie Awoke home"><img className="brand-photo" src="/mebrie-profile.jpg" alt=""/><span>MA.</span></a><button className="theme-toggle" onClick={()=>setTheme(value=>value==="light"?"dark":"light")} aria-label={theme==="light"?"Switch to dark mode":"Switch to light mode"} title={theme==="light"?"Switch to dark mode":"Switch to light mode"}>{theme==="light"?<Moon size={18}/>:<Sun size={18}/>}</button><button className="mobile-menu" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation" aria-expanded={menu}>{menu?<X/>:<Menu/>}</button><nav className={menu?"nav-links show":"nav-links"}>{nav.map(n=><a key={n} href={"#"+n.toLowerCase()} onClick={()=>setMenu(false)}>{n}</a>)}<a className="nav-cta" href="#contact">Let's talk <ArrowUpRight size={15}/></a></nav></header>
  <main>
   <section className="hero section-wrap" id="home"><div className="hero-copy"><div className="eyebrow"><i/> AVAILABLE FOR OPPORTUNITIES</div><p className="hero-kicker">Hello, I'm</p><h1>Mebrie <span>Awoke.</span></h1><h2>AI/ML Engineer <i>×</i> Software Developer</h2><p className="hero-description">I build intelligent software systems that turn ideas and data into useful experiences. Focused on applied AI, machine learning, and backend engineering.</p><div className="hero-actions"><a className="primary-button" href="#projects">Explore my work <ArrowUpRight size={17}/></a><a className="text-button" href="#contact">Get in touch <ArrowUpRight size={16}/></a><a className="text-button" href="https://raw.githubusercontent.com/Mebrie-Awoke/Portfolio/main/frontend/Mebrie-Awoke.pdf" download="Mebrie-Awoke-CV.pdf"><FileDown size={16}/> Download CV</a></div><div className="hero-meta"><span><GraduationCap size={16}/> Information Science · AAU</span><span><i/> Addis Ababa, Ethiopia</span></div></div><div className="hero-art"><div className="orbit one"/><div className="orbit two"/><div className="hero-core"><img className="hero-profile-photo" src="/mebrie-profile.jpg" alt="Portrait of Mebrie Awoke"/><span>AI × SOFTWARE</span></div><div className="float-card python"><Code2 size={17}/> Python</div><div className="float-card rag"><Sparkles size={17}/> RAG systems</div><div className="float-card api"><Zap size={17}/> APIs</div><div className="art-caption">Curiosity → Engineering → Impact</div></div><a className="scroll-cue" href="#about"><ArrowDown size={15}/> SCROLL TO EXPLORE</a></section>
   <section className="intro-strip"><div><b>01</b> Curious by nature</div><div><b>02</b> Engineer by practice</div><div><b>03</b> AI for real-world problems</div></section>
   <section className="content-section section-wrap" id="about"><div className="section-label">01 / ABOUT ME</div><div className="about-grid"><h2 className="section-title">Building at the intersection of <span>AI and software.</span></h2><div className="about-copy"><p>I'm a self-taught software developer and fourth-year Information Science student at Addis Ababa University. My work spans backend and full-stack development, with a growing focus on artificial intelligence and machine learning.</p><p>I'm interested in natural language processing, computer vision, predictive modeling, and intelligent automation. I enjoy learning by building practical projects and exploring how technology can solve meaningful problems.</p><div className="education-card"><GraduationCap size={22}/><div><b>BSc in Information Science</b><span>Addis Ababa University · 2023 — Present</span></div></div></div></div></section>
   <section className="content-section section-wrap" id="skills"><div className="section-label">02 / TOOLKIT</div><div className="section-heading"><h2 className="section-title">Skills & <span>technologies.</span></h2><p>A growing toolkit across software engineering and applied AI.</p></div><div className="skills-grid">{skills.map(([title,...tags])=><article className="skill-card" key={title}><h3>{title}</h3><div className="skill-tags">{tags.map(t=><span key={t}>{t}</span>)}</div></article>)}</div></section>
   <section className="content-section section-wrap" id="projects"><div className="section-label">03 / SELECTED WORK</div><div className="section-heading"><h2 className="section-title">Projects with <span>purpose.</span></h2><p>Selected work in AI, software development, and data-driven applications.</p></div><div className="projects-grid">{projects.map(([num,name,type,desc,tags])=><article className="project-card" key={num}><div className="project-top"><b>{num}</b><ArrowUpRight size={18}/></div><p className="project-type">{type}</p><h3>{name}</h3><p className="project-description">{desc}</p><div className="project-stack">{tags.map(t=><span key={t}>{t}</span>)}</div></article>)}</div></section>
   <section className="content-section section-wrap" id="experience"><div className="section-label">04 / EXPERIENCE</div><div className="section-heading"><h2 className="section-title">Where I've <span>contributed.</span></h2><p>Professional experience and practical software development.</p></div><div className="timeline">{jobs.map(([role,company,detail],i)=><article className="timeline-item" key={role}><div className="timeline-marker">{String(i+1).padStart(2,"0")}</div><div><h3>{role}</h3><h4>{company}</h4><p>{detail}</p></div></article>)}</div></section>
   <section className="contact-section" id="contact"><div className="section-wrap contact-inner"><div className="section-label">05 / GET IN TOUCH</div><div className="contact-grid"><div className="contact-copy"><h2>Let's build something<br/><span>meaningful together.</span></h2><p>Have a project, opportunity, or idea in mind? Send me a message. I'll get back to you as soon as I can.</p><div className="contact-details"><a href="mailto:mebrieawoke941@gmail.com"><Mail size={17}/> mebrieawoke941@gmail.com</a><span><BriefcaseBusiness size={17}/> Addis Ababa, Ethiopia</span><a href="https://github.com/Mebrie-Awoke" target="_blank" rel="noreferrer"><Github size={17}/> GitHub profile</a></div></div><ContactForm/></div></div></section>
  </main><footer className="footer"><a className="brand" href="#home" aria-label="Mebrie Awoke home"><img className="brand-photo" src="/mebrie-profile.jpg" alt=""/><span>MA.</span></a><span>Designed & built by Mebrie Awoke Yizngaw</span><span>© {new Date().getFullYear()}</span></footer><Assistant/>
 </div>;
}
