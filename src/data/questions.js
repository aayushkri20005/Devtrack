// Each row is "Difficulty|Question|Answer". The category is the group it sits in.
const raw = {
  DSA: [
    "Easy|What is the difference between an array and a linked list?|An array stores items in one continuous block with O(1) index access. A linked list stores nodes connected by pointers, so insert and delete are O(1) at a known node but access is O(n).",
    "Easy|What is a stack and where is it used?|A last-in, first-out structure. Used for function calls, undo, and matching brackets.",
    "Medium|What is the time complexity of binary search and why?|O(log n), because every comparison halves the search range.",
    "Medium|How does a hash map handle collisions?|Usually by chaining (a list per bucket) or open addressing (probing for the next free slot).",
    "Medium|When would you use BFS instead of DFS?|When you need the shortest path in an unweighted graph or want to explore level by level.",
    "Hard|What is dynamic programming?|Solving a problem by combining answers to overlapping subproblems and storing them so each is computed once.",
  ],
  OOP: [
    "Easy|What are the four pillars of OOP?|Encapsulation, abstraction, inheritance and polymorphism.",
    "Easy|What is polymorphism?|The same interface behaving differently for different types, through overloading (compile time) or overriding (run time).",
    "Easy|What is encapsulation?|Keeping data and the methods that use it inside one class, and hiding the internals behind access modifiers.",
    "Medium|What is the difference between an abstract class and an interface?|An abstract class can hold state and implemented methods. An interface only describes a contract, and a class can implement many of them.",
    "Medium|What is a virtual function in C++?|A member function that is resolved at run time through the vtable, so the derived version runs through a base pointer.",
    "Hard|What is the diamond problem?|Ambiguity when a class inherits from two classes that share a base. C++ solves it with virtual inheritance.",
  ],
  DBMS: [
    "Easy|What is normalization?|Organising tables to remove redundancy and update anomalies, using normal forms such as 1NF, 2NF, 3NF and BCNF.",
    "Easy|What is ACID?|Atomicity, Consistency, Isolation and Durability: the properties that make a transaction reliable.",
    "Easy|What is a primary key?|A column, or set of columns, that uniquely identifies each row and cannot be null.",
    "Medium|What is the difference between INNER JOIN and LEFT JOIN?|INNER JOIN returns only matching rows. LEFT JOIN returns every row from the left table, with nulls where there is no match.",
    "Medium|What is an index and what does it cost?|A structure, usually a B-tree, that speeds up reads. It costs extra storage and slows down writes.",
    "Hard|What are the transaction isolation levels?|Read Uncommitted, Read Committed, Repeatable Read and Serializable. Each one prevents more anomalies: dirty reads, non-repeatable reads, then phantom reads.",
  ],
  "Operating Systems": [
    "Easy|What is a process?|A program in execution, with its own memory space, resources and at least one thread.",
    "Easy|What is the difference between a process and a thread?|Processes have separate memory. Threads share the memory of their process, so they are lighter to create and switch.",
    "Medium|What is a deadlock?|Processes waiting on each other forever. It needs mutual exclusion, hold and wait, no preemption and circular wait.",
    "Medium|What is virtual memory?|A technique that gives each process a large private address space by mapping pages to RAM or disk on demand.",
    "Medium|What is a context switch?|Saving the state of the running process and loading the state of the next one so the CPU can be shared.",
    "Hard|What is the difference between a mutex and a semaphore?|A mutex is a lock owned by one thread. A semaphore is a counter that lets up to N threads in and has no owner.",
  ],
  "Computer Networks": [
    "Easy|What is TCP?|A connection-oriented transport protocol that gives reliable, ordered delivery with flow and congestion control.",
    "Easy|What is the difference between TCP and UDP?|TCP is reliable and ordered but slower. UDP is connectionless and fast, with no delivery guarantee.",
    "Easy|What is DNS?|The system that turns domain names into IP addresses.",
    "Medium|What happens when you type a URL into the browser?|DNS lookup, TCP handshake, TLS handshake, HTTP request, server response, then the browser parses and renders the page.",
    "Medium|What is the TCP three-way handshake?|SYN, SYN-ACK, ACK. It sets up sequence numbers before any data is sent.",
    "Hard|How does HTTPS keep data secure?|TLS checks the server certificate, agrees on a shared key, then encrypts all traffic with that key.",
  ],
  JavaScript: [
    "Easy|What is the difference between let, const and var?|var is function scoped and hoisted. let and const are block scoped, and const cannot be reassigned.",
    "Easy|What is the difference between == and ===?|== converts types before comparing. === compares value and type with no conversion.",
    "Medium|What is a closure?|A function that remembers the variables of the scope it was created in, even after that scope has finished.",
    "Medium|What is the event loop?|The mechanism that runs the call stack, then microtasks such as promises, then tasks such as timers. It lets single-threaded JavaScript be asynchronous.",
    "Medium|What is a promise?|An object for a value that will arrive later. It is pending, fulfilled or rejected.",
    "Hard|What is the difference between debounce and throttle?|Debounce waits until calls stop for a set time. Throttle runs at most once in each time window.",
  ],
  React: [
    "Easy|What is the Virtual DOM?|A lightweight copy of the DOM in memory. React compares versions and updates only the parts of the real DOM that changed.",
    "Easy|What is useEffect?|A hook that runs side effects after render, such as fetching, subscriptions and timers. The dependency array controls when it runs again.",
    "Easy|What is the difference between state and props?|Props are passed in by the parent and are read only. State is owned by the component and can change.",
    "Medium|Why do lists need keys?|Keys let React match items between renders so it can reuse DOM nodes and keep state with the right item.",
    "Medium|What is Context used for?|Sharing values such as theme or user with many components without passing props through every level.",
    "Hard|What causes unnecessary re-renders and how do you reduce them?|New object or function props on every render, and state kept too high in the tree. Move state down, and use memo, useMemo or useCallback where it is measured to help.",
  ],
  "HR / Behavioral": [
    "Easy|Tell me about yourself.|Give a one-minute summary: education, key projects, skills, and why you want this role.",
    "Easy|Why do you want to join this company?|Connect the company's products or values to your own skills and goals. Be specific.",
    "Easy|What are your strengths and weaknesses?|Pick a real strength with an example, and a real weakness with the steps you are taking to improve it.",
    "Medium|Describe a challenge you faced in a project.|Use STAR: Situation, Task, Action, Result. Focus on what you did yourself.",
    "Medium|Tell me about a time you disagreed with a teammate.|Show that you listened, used facts, and reached a decision together without making it personal.",
    "Hard|Where do you see yourself in five years?|Show growth in the same direction as the role, such as deeper technical skill and more ownership.",
  ],
};

export const categories = Object.keys(raw);

export default Object.entries(raw).flatMap(([category, rows]) =>
  rows.map((row) => {
    const [difficulty, question, answer] = row.split("|");
    return { category, difficulty, question, answer };
  })
);
