import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import '../styles/CategorySelect.css';

const categories = [
  {
    name: 'Python',
    icon: '🐍',
    color: '#3776AB',
    gradient: 'linear-gradient(135deg, #3776AB, #FFD43B)',
    desc: 'Data types, OOP, decorators, GIL, list comprehensions, generators, and more.',
    topics: ['Variables & Data Types', 'OOP Concepts', 'Decorators', 'File Handling', 'Libraries'],
    difficulty: 'Beginner Friendly',
    questions: 5
  },
  {
    name: 'Java',
    icon: '☕',
    color: '#ED8B00',
    gradient: 'linear-gradient(135deg, #ED8B00, #f5c842)',
    desc: 'OOP principles, collections framework, exception handling, and multithreading.',
    topics: ['OOP Principles', 'Collections', 'Exception Handling', 'Multithreading', 'JVM'],
    difficulty: 'Intermediate',
    questions: 5
  },
  {
    name: 'C++',
    icon: '⚙️',
    color: '#00599C',
    gradient: 'linear-gradient(135deg, #00599C, #004482)',
    desc: 'Pointers, references, RAII, polymorphism, STL, and memory management.',
    topics: ['Pointers & References', 'OOP', 'STL', 'Memory Management', 'Templates'],
    difficulty: 'Advanced',
    questions: 5
  },
  {
    name: 'DSA',
    icon: '💡',
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #9C27B0, #E040FB)',
    desc: 'Arrays, linked lists, stacks, queues, trees, graphs, and algorithms.',
    topics: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Sorting', 'Dynamic Programming'],
    difficulty: 'Advanced',
    questions: 5
  },
  {
    name: 'DBMS',
    icon: '🗄️',
    color: '#E91E63',
    gradient: 'linear-gradient(135deg, #E91E63, #F06292)',
    desc: 'SQL joins, ACID properties, normalization, indexing, and transactions.',
    topics: ['SQL Queries', 'ACID Properties', 'Normalization', 'Indexing', 'Transactions'],
    difficulty: 'Intermediate',
    questions: 5
  },
  {
    name: 'HR',
    icon: '👤',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50, #81C784)',
    desc: 'Behavioral questions, situational responses, strengths, weaknesses, and goals.',
    topics: ['Tell Me About Yourself', 'Strengths & Weaknesses', 'Career Goals', 'STAR Method', 'Company Fit'],
    difficulty: 'All Levels',
    questions: 5
  },
  {
    name: 'FULLSTACK',
    icon: '🌐',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    desc: 'Frontend, backend, APIs, databases, authentication, and full-stack architecture.',
    topics: ['React & UI', 'Node.js & Express', 'REST APIs', 'Databases & CRUD', 'Auth & Git'],
    difficulty: 'Advanced',
    questions: 5
  }
];

const difficultyColor = {
  'Beginner Friendly': '#4CAF50',
  'Intermediate': '#FF9800',
  'Advanced': '#F44336',
  'All Levels': '#2196F3'
};

const CategorySelect = () => {
  return (
    <Layout>
      <div className="category-page">
        <div className="category-header">
          <h1>🎯 Select Interview Category</h1>
          <p>Choose a topic to practice. Each interview has 5 questions and gives instant feedback.</p>
        </div>
        <div className="category-grid">
          {categories.map(cat => (
            <div key={cat.name} className="cat-card">
              <div className="cat-card-header" style={{ background: cat.gradient }}>
                <div className="cat-card-icon">{cat.icon}</div>
                <div className="cat-card-badge" style={{ background: difficultyColor[cat.difficulty] }}>
                  {cat.difficulty}
                </div>
              </div>
              <div className="cat-card-body">
                <h2>{cat.name}</h2>
                <p>{cat.desc}</p>
                <div className="topic-tags">
                  {cat.topics.map(t => <span key={t} className="topic-tag">{t}</span>)}
                </div>
                <div className="cat-meta">
                  <span>❓ {cat.questions} Questions</span>
                  <span>⏱ ~10-15 min</span>
                </div>
              </div>
              <div className="cat-card-footer">
                <Link to={`/interview/${cat.name}`} className="btn-start-cat" style={{ background: cat.color }}>
                  Start {cat.name} Interview →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategorySelect;
