const OpenAI = require('openai');

const ROLE_TEMPLATES = {
  'Frontend Developer': {
    summary: (name) =>
      `Detail-oriented Frontend Engineer skilled in building modern, responsive, and accessible web interfaces using React.js, TypeScript, and CSS architectures. Experienced in optimizing client-side performance, state management, and seamless RESTful API integration.`,
    recommendedSkills: ['React.js', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'Redux / Zustand', 'HTML5 & CSS3', 'Vite', 'REST APIs'],
    actionVerbs: ['Architected', 'Implemented', 'Optimized', 'Integrated', 'Engineered', 'Streamlined'],
  },
  'Full Stack Developer': {
    summary: (name) =>
      `Versatile Full Stack Developer proficient in designing scalable web applications with React.js, Node.js, Express, and MongoDB/SQL. Passionate about writing clean, maintainable code, implementing secure JWT authentication, and designing high-throughput REST APIs.`,
    recommendedSkills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'RESTful APIs', 'JWT & Auth', 'Docker', 'Git'],
    actionVerbs: ['Architected', 'Developed', 'Deployed', 'Optimized', 'Refactored', 'Designed'],
  },
  'Software Engineer': {
    summary: (name) =>
      `Results-driven Software Engineer with strong foundations in Data Structures, Algorithms, Object-Oriented Design, and distributed backend systems. Adept at solving complex computational problems and delivering robust, scalable software solutions.`,
    recommendedSkills: ['Data Structures & Algorithms', 'C++', 'Java', 'Python', 'Object-Oriented Programming', 'System Design', 'Git', 'SQL'],
    actionVerbs: ['Engineered', 'Developed', 'Spearheaded', 'Optimized', 'Formulated', 'Implemented'],
  },
  'AI/ML Engineer': {
    summary: (name) =>
      `Innovator in Artificial Intelligence & Data Science with hands-on experience in machine learning pipelines, deep learning models, natural language processing, and data analytics. Skilled at preprocessing complex datasets and deploying inference endpoints.`,
    recommendedSkills: ['Python', 'PyTorch / TensorFlow', 'Scikit-Learn', 'Pandas & NumPy', 'NLP & LLMs', 'Data Preprocessing', 'FastAPI', 'Model Evaluation'],
    actionVerbs: ['Trained', 'Fine-tuned', 'Engineered', 'Evaluated', 'Preprocessed', 'Deployed'],
  },
  'Data Scientist': {
    summary: (name) =>
      `Analytical Data Scientist experienced in exploratory data analysis, statistical modeling, machine learning, and data visualization. Proven ability to uncover actionable business insights and communicate quantitative findings.`,
    recommendedSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Data Visualization', 'Statistical Analysis', 'A/B Testing'],
    actionVerbs: ['Analyzed', 'Derived', 'Visualized', 'Modeled', 'Synthesized', 'Automated'],
  },
  'Backend Engineer': {
    summary: (name) =>
      `Performance-focused Backend Engineer skilled in architecting microservices, database schema design, and asynchronous message handling. Committed to building secure, fault-tolerant APIs with high availability.`,
    recommendedSkills: ['Node.js', 'Java / Go', 'Express.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'RESTful APIs'],
    actionVerbs: ['Constructed', 'Orchestrated', 'Benchmarked', 'Secured', 'Scaled', 'Automated'],
  },
};

function heuristicEnhance(resumeData, targetRole = 'Software Engineer') {
  const roleConfig = ROLE_TEMPLATES[targetRole] || ROLE_TEMPLATES['Software Engineer'];
  const name = resumeData.personalInfo?.fullName || 'Candidate';

  const enhancedSummary = roleConfig.summary(name);

  const existingTech = new Set(resumeData.skills?.technical || []);
  const existingFrameworks = new Set(resumeData.skills?.frameworks || []);
  const existingTools = new Set(resumeData.skills?.tools || []);

  const updatedSkills = {
    technical: Array.from(existingTech),
    frameworks: Array.from(existingFrameworks),
    tools: Array.from(existingTools),
    soft: resumeData.skills?.soft?.length
      ? resumeData.skills.soft
      : ['Critical Thinking', 'Problem Solving', 'Team Leadership', 'Agile Methodologies', 'Effective Communication'],
  };

  if (updatedSkills.technical.length < 5) {
    roleConfig.recommendedSkills.slice(0, 4).forEach((skill) => {
      if (!updatedSkills.technical.includes(skill)) updatedSkills.technical.push(skill);
    });
  }

  const enhancedProjects = (resumeData.projects || []).map((proj, idx) => {
    const verb = roleConfig.actionVerbs[idx % roleConfig.actionVerbs.length];
    const highlights = proj.highlights && proj.highlights.length > 0
      ? proj.highlights.map((h) => {
          if (!/^[A-Z][a-z]+ed\b/.test(h)) {
            return `${verb} ${h.charAt(0).toLowerCase() + h.slice(1)}`;
          }
          return h;
        })
      : [
          `${verb} ${proj.title} utilizing ${proj.techStack?.slice(0, 3).join(', ') || 'modern engineering best practices'}.`,
          `Enhanced code reliability, performance metrics, and adherence to clean architecture principles.`
        ];

    return {
      ...proj,
      highlights,
    };
  });

  const enhancedExperience = (resumeData.experience || []).map((exp, idx) => {
    const verb = roleConfig.actionVerbs[(idx + 2) % roleConfig.actionVerbs.length];
    const highlights = exp.highlights && exp.highlights.length > 0
      ? exp.highlights
      : [
          `${verb} project deliverables within an agile team, collaborating on feature implementations and bug fixes.`,
          `Participated in peer code reviews, continuous integration workflows, and technical design discussions.`
        ];
    return {
      ...exp,
      highlights,
    };
  });

  return {
    ...resumeData,
    targetRole,
    summary: enhancedSummary,
    skills: updatedSkills,
    projects: enhancedProjects,
    experience: enhancedExperience,
    enhancementSource: 'Intelligent Role-Tailored Heuristics',
  };
}

async function enhanceResumeWithAI(resumeData, targetRole = 'Software Engineer') {
  const apiKey = process.env.OPENAI_API_KEY;
  const isKeyAvailable =
    apiKey &&
    apiKey.trim() !== '' &&
    apiKey.trim() !== 'your_openai_api_key_here_or_leave_blank_for_offline_demo' &&
    apiKey.startsWith('sk-');

  if (!isKeyAvailable) {
    return heuristicEnhance(resumeData, targetRole);
  }

  try {
    const openai = new OpenAI({ apiKey: apiKey.trim() });
    const prompt = `You are a top technical recruiter and resume strategist.
Improve the following resume specifically for the target role: "${targetRole}".
Requirements:
1. Write a compelling, concise 3-4 sentence professional summary highlighting candidate strengths.
2. Polish each project's bullet points using strong action verbs (e.g. Architected, Engineered, Optimized) and impact metrics where appropriate. DO NOT invent fake company names or fake degrees.
3. Organize and categorize skills into: technical, frameworks, tools, soft.
4. Return ONLY valid JSON matching the exact same input structure.

Resume Data:
${JSON.stringify(resumeData, null, 2)}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return {
      ...parsed,
      targetRole,
      enhancementSource: 'OpenAI GPT-4o-mini',
    };
  } catch (error) {
    console.warn('OpenAI enhancement failed, falling back to heuristic engine:', error.message);
    return heuristicEnhance(resumeData, targetRole);
  }
}

module.exports = {
  enhanceResumeWithAI,
  heuristicEnhance,
};
