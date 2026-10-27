const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'local_storage.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read data from disk
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (!parsed.resumes) parsed.resumes = [];
      return parsed;
    }
  } catch (err) {
    console.error('Error reading local_storage.json:', err.message);
  }
  return { users: [], interviews: [], resumes: [] };
}

// Helper to save data to disk
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local_storage.json:', err.message);
  }
}

// Persistent Store for when MongoDB is not connected
const memoryStore = {
  get data() {
    return loadData();
  },

  async findUserByEmail(email) {
    if (!email) return null;
    const { users } = loadData();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) return null;

    return {
      ...found,
      async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, found.password);
      }
    };
  },

  async findUserById(id) {
    if (!id) return null;
    const { users } = loadData();
    const found = users.find(u => String(u._id) === String(id) || String(u.id) === String(id));
    if (!found) return null;

    return {
      ...found,
      async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, found.password);
      }
    };
  },

  async createUser({ fullName, email, password }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const data = loadData();

    const user = {
      _id: id,
      id: id,
      fullName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      totalInterviews: 0,
      totalPracticeTime: 0,
      createdAt: new Date().toISOString()
    };

    data.users.push(user);
    saveData(data);

    return {
      ...user,
      async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, user.password);
      }
    };
  },

  async saveInterview(interviewData) {
    const id = 'int_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const data = loadData();

    const interview = {
      _id: id,
      id: id,
      ...interviewData,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    data.interviews.unshift(interview);

    // Update user stats
    const user = data.users.find(u => String(u._id) === String(interviewData.userId) || String(u.id) === String(interviewData.userId));
    if (user) {
      user.totalInterviews = (user.totalInterviews || 0) + 1;
      user.totalPracticeTime = (user.totalPracticeTime || 0) + (interviewData.duration || 0);
    }

    saveData(data);
    return interview;
  },

  async getUserInterviews(userId) {
    const { interviews } = loadData();
    return interviews.filter(i => String(i.userId) === String(userId));
  },

  async getInterviewById(id, userId) {
    const { interviews } = loadData();
    return interviews.find(i => String(i._id) === String(id) && String(i.userId) === String(userId)) || null;
  },

  async getUserResume(userId) {
    const { resumes } = loadData();
    return resumes.find(r => String(r.userId) === String(userId) || String(r.user) === String(userId)) || null;
  },

  async saveUserResume(resumeData, userId) {
    const data = loadData();
    if (!data.resumes) data.resumes = [];

    const existingIdx = data.resumes.findIndex(r => String(r.userId) === String(userId) || String(r.user) === String(userId));
    if (existingIdx !== -1) {
      data.resumes[existingIdx] = {
        ...data.resumes[existingIdx],
        ...resumeData,
        userId,
        user: userId,
        updatedAt: new Date().toISOString()
      };
      saveData(data);
      return data.resumes[existingIdx];
    } else {
      const id = 'res_' + Date.now();
      const newResume = {
        _id: id,
        id,
        ...resumeData,
        userId,
        user: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.resumes.unshift(newResume);
      saveData(data);
      return newResume;
    }
  },

  async deleteUserResume(id, userId) {
    const data = loadData();
    if (!data.resumes) return false;
    const initialLen = data.resumes.length;
    data.resumes = data.resumes.filter(r => !(String(r._id) === String(id) && (String(r.userId) === String(userId) || String(r.user) === String(userId))));
    saveData(data);
    return data.resumes.length < initialLen;
  }
};

module.exports = memoryStore;
