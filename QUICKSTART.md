# Quick Start Guide - Multi-Resource Task Scheduler

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Maven (Required for Backend)

**Option A: Run the installation script (Recommended)**

Open PowerShell **as Administrator** and run:

```powershell
cd c:\Users\sahan\OneDrive\Desktop\task_scheduling
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\install-maven.ps1
```

After installation completes, **restart your terminal**.

**Option B: Manual Installation**

1. Download Maven from: https://maven.apache.org/download.cgi
2. Extract to `C:\Program Files\Apache\Maven`
3. Add `C:\Program Files\Apache\Maven\bin` to your PATH
4. Set MAVEN_HOME environment variable

### Step 2: Verify Maven Installation

Open a **new terminal** and run:

```powershell
mvn -version
```

You should see Maven version information.

### Step 3: Start the Backend

```powershell
cd c:\Users\sahan\OneDrive\Desktop\task_scheduling\backend
mvn clean install
mvn spring-boot:run
```

Wait for the message:
```
========================================
  Multi-Resource Task Scheduler Started
  Port: 8080
========================================
```

### Step 4: Start the Frontend

Open a **new terminal** (keep backend running) and run:

```powershell
cd c:\Users\sahan\OneDrive\Desktop\task_scheduling\frontend
npm start
```

Browser will automatically open to `http://localhost:3000`

---

## 🎯 Quick Test

Once both servers are running:

1. **Add Task T1:**
   - Task ID: `T1`
   - Start: `0`
   - End: `5`
   - Resources: `CPU, RAM`

2. **Add Task T2:**
   - Task ID: `T2`
   - Start: `3`
   - End: `8`
   - Resources: `CPU`

3. **Observe Results:**
   - Conflicts section shows: T1 ↔ T2 (CPU conflict)
   - Schedule shows: Only T1 (earliest finish time)
   - Gantt chart: T1 is green, T2 is red

---

## 📚 Full Documentation

See [README.md](./README.md) for:
- Complete algorithm explanations
- Data structure justifications
- Time complexity analysis
- More test scenarios

See [walkthrough.md](./.gemini/antigravity/brain/d75e33ba-5cb4-4a7b-80a0-0fcb8799fc97/walkthrough.md) for:
- Detailed project walkthrough
- Verification checklist
- Testing scenarios

---

## 🚨 Troubleshooting

**Maven not found after installation?**
- Restart your terminal
- Check PATH: `echo $env:Path`
- Verify: `mvn -version`

**Port 8080 already in use?**
- Stop other applications using port 8080
- Or change port in `backend/src/main/resources/application.properties`

**Frontend can't connect to backend?**
- Ensure backend is running on port 8080
- Check browser console for errors
- Verify CORS is enabled in backend

---

## 🎓 What This Project Demonstrates

✅ **Interval Hypergraph** - Multi-resource modeling  
✅ **HashMap** - O(1) resource-to-task mapping  
✅ **HashSet** - O(1) membership testing  
✅ **PriorityQueue** - O(log n) greedy scheduling  
✅ **Algorithms** - All O(n log n) or better  
✅ **No Database** - Pure in-memory DSA focus  

---

**Ready to explore advanced Data Structures and Algorithms!** 🚀
