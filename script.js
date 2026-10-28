"use strict";

/* =========================================================
   Online Quiz Application - script.js
   1. Settings        2. Question bank     3. App state
   4. Helpers         5. Screens           6. Starting a quiz
   7. Showing a question                   8. Navigation
   9. Timer          10. Submit and score 11. Results
  12. Review  12b. Study notes  13. Confirmation box  14. Event listeners
   ========================================================= */

/* ---------- 1. Settings ---------- */
const QUESTIONS_PER_QUIZ = 10;
const QUIZ_TIME_SECONDS = 5 * 60;               // 5 minutes
const RING_CIRCUMFERENCE = 2 * Math.PI * 54;    // circle radius is 54 in the SVG

// Which question levels to use first for each chosen difficulty.
// If a level has fewer than 10 questions, the next level fills the gap.
const DIFFICULTY_ORDER = {
  Easy:   ["easy", "medium", "hard"],
  Medium: ["medium", "easy", "hard"],
  Hard:   ["hard", "medium", "easy"]
};

/* ---------- 2. Question bank ----------
   Each question is an object:
   difficulty : "easy" | "medium" | "hard"
   question   : the text shown to the student
   options    : four answer choices
   answer     : index (0-3) of the correct option
*/
const questionBank = {
  "General Knowledge": [
    // Easy
    { difficulty: "easy", question: "What is the capital city of France?",
      options: ["Madrid", "Paris", "Rome", "Berlin"], answer: 1 },
    { difficulty: "easy", question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Jupiter", "Mars", "Mercury"], answer: 2 },
    { difficulty: "easy", question: "How many continents are there on Earth?",
      options: ["5", "6", "8", "7"], answer: 3 },
    { difficulty: "easy", question: "Which is the largest ocean on Earth?",
      options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], answer: 0 },
    { difficulty: "easy", question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Quartz"], answer: 2 },

    // Medium
    { difficulty: "medium", question: "What is the chemical symbol for gold?",
      options: ["Ag", "Au", "Gd", "Go"], answer: 1 },
    { difficulty: "medium", question: "Which country gifted the Statue of Liberty to the United States?",
      options: ["United Kingdom", "Spain", "Germany", "France"], answer: 3 },
    { difficulty: "medium", question: "Which is the smallest country in the world by area?",
      options: ["Monaco", "Vatican City", "San Marino", "Malta"], answer: 1 },
    { difficulty: "medium", question: "In which year did India gain independence from British rule?",
      options: ["1942", "1950", "1947", "1935"], answer: 2 },
    { difficulty: "medium", question: "Which gas do plants absorb from the air for photosynthesis?",
      options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], answer: 1 },

    // Hard
    { difficulty: "hard", question: "Which scientist is credited with discovering penicillin?",
      options: ["Louis Pasteur", "Marie Curie", "Alexander Fleming", "Joseph Lister"], answer: 2 },
    { difficulty: "hard", question: "Which city hosted the first modern Olympic Games in 1896?",
      options: ["Paris", "Athens", "London", "Rome"], answer: 1 },
    { difficulty: "hard", question: "Which language has the most native speakers in the world?",
      options: ["English", "Spanish", "Hindi", "Mandarin Chinese"], answer: 3 },
    { difficulty: "hard", question: "Which treaty formally ended World War I with Germany in 1919?",
      options: ["Treaty of Versailles", "Treaty of Paris", "Treaty of Vienna", "Treaty of Tordesillas"], answer: 0 },
    { difficulty: "hard", question: "Which planet in our solar system has the shortest day?",
      options: ["Earth", "Mars", "Saturn", "Jupiter"], answer: 3 }
  ],

  "Computer Science": [
    // Easy
    { difficulty: "easy", question: "What does CPU stand for?",
      options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Utility"], answer: 0 },
    { difficulty: "easy", question: "Which of these is an input device?",
      options: ["Monitor", "Printer", "Keyboard", "Speaker"], answer: 2 },
    { difficulty: "easy", question: "Which number system is used by computers internally?",
      options: ["Decimal", "Binary", "Octal", "Roman"], answer: 1 },
    { difficulty: "easy", question: "Which of the following is an operating system?",
      options: ["Python", "HTML", "Oracle", "Linux"], answer: 3 },
    { difficulty: "easy", question: "How many bits are there in one byte?",
      options: ["8", "4", "16", "2"], answer: 0 },

    // Medium
    { difficulty: "medium", question: "Which data structure follows the LIFO (Last In, First Out) principle?",
      options: ["Queue", "Array", "Stack", "Tree"], answer: 2 },
    { difficulty: "medium", question: "What is the time complexity of binary search on a sorted array?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answer: 1 },
    { difficulty: "medium", question: "What does SQL stand for?",
      options: ["Simple Question Language", "Sequential Query Logic", "Structured Query Language", "Standard Quick Language"], answer: 2 },
    { difficulty: "medium", question: "Which type of memory loses its data when the power is switched off?",
      options: ["ROM", "RAM", "Hard disk", "Flash drive"], answer: 1 },
    { difficulty: "medium", question: "Which sorting algorithm repeatedly swaps adjacent elements that are in the wrong order?",
      options: ["Bubble sort", "Merge sort", "Quick sort", "Heap sort"], answer: 0 },

    // Hard
    { difficulty: "hard", question: "What is the worst-case time complexity of Quick Sort?",
      options: ["O(n log n)", "O(n)", "O(log n)", "O(n\u00B2)"], answer: 3 },
    { difficulty: "hard", question: "Which data structure is normally used to implement Breadth-First Search (BFS)?",
      options: ["Stack", "Queue", "Heap", "Hash table"], answer: 1 },
    { difficulty: "hard", question: "In the OSI model, which layer is responsible for routing packets between networks?",
      options: ["Data Link layer", "Transport layer", "Network layer", "Session layer"], answer: 2 },
    { difficulty: "hard", question: "Which CPU scheduling algorithm can cause starvation of long processes?",
      options: ["Round Robin", "First Come First Served", "Priority with aging", "Shortest Job First"], answer: 3 },
    { difficulty: "hard", question: "What does ACID stand for in database transactions?",
      options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Control, Integrity, Data", "Atomicity, Concurrency, Integrity, Dependency", "Availability, Consistency, Isolation, Durability"], answer: 0 }
  ],

  "Web Development": [
    // Easy
    { difficulty: "easy", question: "What does HTML stand for?",
      options: ["Hyper Trainer Marking Language", "HyperText Markup Language", "High Text Machine Language", "HyperText Markdown Language"], answer: 1 },
    { difficulty: "easy", question: "Which HTML tag creates the largest heading?",
      options: ["<h6>", "<head>", "<heading>", "<h1>"], answer: 3 },
    { difficulty: "easy", question: "Which CSS property is used to change the text colour of an element?",
      options: ["font-color", "text-style", "color", "background"], answer: 2 },
    { difficulty: "easy", question: "Which HTML tag is used to create a hyperlink?",
      options: ["<a>", "<link>", "<href>", "<url>"], answer: 0 },
    { difficulty: "easy", question: "Which language is mainly used to add interactivity to web pages?",
      options: ["CSS", "JavaScript", "SQL", "XML"], answer: 1 },

    // Medium
    { difficulty: "medium", question: "Which CSS property controls the space between an element's content and its border?",
      options: ["margin", "spacing", "padding", "gap"], answer: 2 },
    { difficulty: "medium", question: "Which JavaScript method selects an element using its id?",
      options: ["document.getElementById()", "document.getElement()", "document.query()", "document.selectId()"], answer: 0 },
    { difficulty: "medium", question: "Which HTML attribute provides alternate text for an image?",
      options: ["title", "src", "caption", "alt"], answer: 3 },
    { difficulty: "medium", question: "Which CSS declaration turns an element into a flex container?",
      options: ["display: flex;", "position: flex;", "flex: container;", "layout: flex;"], answer: 0 },
    { difficulty: "medium", question: "Which symbol is used to select an element by id in CSS?",
      options: [".", "*", "&", "#"], answer: 3 },

    // Hard
    { difficulty: "hard", question: "Which JavaScript keyword declares a block-scoped variable that can be reassigned?",
      options: ["var", "let", "const", "static"], answer: 1 },
    { difficulty: "hard", question: "What does the === operator do in JavaScript?",
      options: ["Assigns a value", "Compares values only", "Compares both value and type", "Checks if a variable exists"], answer: 2 },
    { difficulty: "hard", question: "Which HTTP status code means \"Not Found\"?",
      options: ["200", "301", "500", "404"], answer: 3 },
    { difficulty: "hard", question: "Which event fires when the HTML document has been fully parsed, without waiting for images?",
      options: ["load", "DOMContentLoaded", "ready", "domparsed"], answer: 1 },
    { difficulty: "hard", question: "Which array method returns a new array by applying a function to every element?",
      options: ["forEach()", "filter()", "reduce()", "map()"], answer: 3 }
  ],

  // ============================================================
  // Syllabus subjects (Web Programming, R2023). 5 easy, 5 medium and
  // 5 hard questions each.
  // ============================================================
  // Unit I - WWW, E-mail, Telnet, FTP, IP address, URL, DNS, browsers, web servers
  "Web Basics & Internet": [
    // Easy
    { difficulty: "easy", question: "What does WWW stand for?",
      options: ["World Wide Web", "World Web Window", "Wide World Web", "Web World Wide"], answer: 0 },
    { difficulty: "easy", question: "Who invented the World Wide Web?",
      options: ["Bill Gates", "Steve Jobs", "Vint Cerf", "Tim Berners-Lee"], answer: 3 },
    { difficulty: "easy", question: "Which of these is a web browser?",
      options: ["Apache", "Gmail", "Mozilla Firefox", "Google Search"], answer: 2 },
    { difficulty: "easy", question: "What does ISP stand for?",
      options: ["Internal System Protocol", "Internet Service Provider", "Internet Security Program", "Integrated Service Platform"], answer: 1 },
    { difficulty: "easy", question: "What does URL stand for?",
      options: ["Uniform Resource Locator", "Universal Resource Link", "Uniform Reference Locator", "Unified Resource Location"], answer: 0 },

    // Medium
    { difficulty: "medium", question: "Which protocol is specifically designed for uploading and downloading files between a client and a server?",
      options: ["HTTP", "SMTP", "DNS", "FTP"], answer: 3 },
    { difficulty: "medium", question: "What is the job of a Domain Name Server (DNS)?",
      options: ["Encrypt web traffic", "Store website files", "Translate domain names into IP addresses", "Send e-mails"], answer: 2 },
    { difficulty: "medium", question: "Which protocol is used to send e-mail from a client to a mail server?",
      options: ["POP3", "SMTP", "IMAP", "FTP"], answer: 1 },
    { difficulty: "medium", question: "Which of these is a valid IPv4 address?",
      options: ["192.168.1.1", "2001:db8::1", "www.example.com", "AB:CD:EF:12"], answer: 0 },
    { difficulty: "medium", question: "Which tool lets you log in to and control a remote computer through a text-based terminal session?",
      options: ["FTP", "HTTP", "SMTP", "Telnet"], answer: 3 },

    // Hard
    { difficulty: "hard", question: "What is the main difference between a web server and an application server?",
      options: ["A web server runs only on Linux, while an application server runs only on Windows", "A web server stores databases, while an application server stores images", "A web server mainly delivers static content over HTTP, while an application server runs business logic", "There is no difference between the two"], answer: 2 },
    { difficulty: "hard", question: "Which cloud service model provides virtual machines and storage over the internet?",
      options: ["SaaS (Software as a Service)", "IaaS (Infrastructure as a Service)", "PaaS (Platform as a Service)", "DaaS (Desktop as a Service)"], answer: 1 },
    { difficulty: "hard", question: "Which class of HTTP status codes indicates a server error?",
      options: ["5xx", "2xx", "3xx", "4xx"], answer: 0 },
    { difficulty: "hard", question: "In the URL https://www.example.com:8080/index.html, what does 8080 represent?",
      options: ["The protocol", "The domain name", "The query string", "The port number"], answer: 3 },
    { difficulty: "hard", question: "Which phase of the web introduced user-generated content, blogs and social media?",
      options: ["Web 1.0", "Web 3.0", "Web 2.0", "The pre-web ARPANET era"], answer: 2 }
  ],

  // Unit I - HTML tags, structure, lists, images, CSS rules, selectors, box model
  "HTML & CSS": [
    // Easy
    { difficulty: "easy", question: "Which tag defines the root element of an HTML page?",
      options: ["<head>", "<html>", "<body>", "<root>"], answer: 1 },
    { difficulty: "easy", question: "Which tag is used to display an image in HTML?",
      options: ["<img>", "<image>", "<pic>", "<src>"], answer: 0 },
    { difficulty: "easy", question: "Which tag creates an unordered (bulleted) list?",
      options: ["<ol>", "<li>", "<dl>", "<ul>"], answer: 3 },
    { difficulty: "easy", question: "Which CSS property changes the background colour of an element?",
      options: ["color", "bgcolor", "background-color", "fill"], answer: 2 },
    { difficulty: "easy", question: "Which of these is a correctly written CSS rule?",
      options: ["p = { color: red }", "p { color: red; }", "p ( color = red )", "<p> color: red; </p>"], answer: 1 },

    // Medium
    { difficulty: "medium", question: "Which HTML5 element is meant for a self-contained piece of content, such as a blog post?",
      options: ["<article>", "<span>", "<aside>", "<footer>"], answer: 0 },
    { difficulty: "medium", question: "Which HTML5 element holds content related to the main content, such as a sidebar?",
      options: ["<main>", "<header>", "<nav>", "<aside>"], answer: 3 },
    { difficulty: "medium", question: "Which CSS selector targets every element that has the class box?",
      options: ["#box", "box", ".box", "&box"], answer: 2 },
    { difficulty: "medium", question: "How do <div> and <span> differ?",
      options: ["<div> is inline and <span> is block-level", "<div> is a block-level element and <span> is inline", "Both are block-level elements", "Both are inline elements"], answer: 1 },
    { difficulty: "medium", question: "Which HTML attribute applies CSS directly to a single element?",
      options: ["style", "class", "css", "id"], answer: 0 },

    // Hard
    { difficulty: "hard", question: "Which of these has the highest priority in the CSS cascade (without !important)?",
      options: ["A rule in an external stylesheet", "A rule in an internal <style> block", "The browser's default style", "An inline style attribute"], answer: 3 },
    { difficulty: "hard", question: "Which selector has the highest specificity?",
      options: ["Element selector (p)", "Class selector (.note)", "ID selector (#note)", "Universal selector (*)"], answer: 2 },
    { difficulty: "hard", question: "With the default content-box model, an element's rendered width equals:",
      options: ["content width only", "content width + padding + border", "content width + margin only", "padding + border + margin only"], answer: 1 },
    { difficulty: "hard", question: "Which declaration centres a block element horizontally when it has a fixed width?",
      options: ["margin: 0 auto;", "text-align: center;", "float: center;", "align: middle;"], answer: 0 },
    { difficulty: "hard", question: "Which CSS property sets the height of a line of text, controlling the space between lines?",
      options: ["letter-spacing", "word-spacing", "text-indent", "line-height"], answer: 3 }
  ],

  // Unit I - Version control with Git, GitHub and hosting a website
  "Git & Hosting": [
    // Easy
    { difficulty: "easy", question: "What is Git?",
      options: ["A web browser", "A programming language", "A distributed version control system", "A database server"], answer: 2 },
    { difficulty: "easy", question: "Which command creates a new, empty Git repository in the current folder?",
      options: ["git start", "git init", "git new", "git create"], answer: 1 },
    { difficulty: "easy", question: "Which command copies an existing remote repository to your computer?",
      options: ["git clone", "git copy", "git fork", "git download"], answer: 0 },
    { difficulty: "easy", question: "What is web hosting?",
      options: ["A tool for designing logos", "A programming language for web pages", "A type of web browser", "A service that stores a website on a server so people can reach it on the internet"], answer: 3 },
    { difficulty: "easy", question: "What is GitHub?",
      options: ["A text editor", "An operating system", "An online service for hosting Git repositories", "A CSS framework"], answer: 2 },

    // Medium
    { difficulty: "medium", question: "Which command stages all changes in the current folder for the next commit?",
      options: ["git commit .", "git add .", "git push .", "git stage-all"], answer: 1 },
    { difficulty: "medium", question: "Which command saves the staged changes to the repository with a message?",
      options: ["git commit -m \"message\"", "git save -m \"message\"", "git push -m \"message\"", "git add -m \"message\""], answer: 0 },
    { difficulty: "medium", question: "Which command uploads your local commits to a remote repository?",
      options: ["git pull", "git fetch", "git merge", "git push"], answer: 3 },
    { difficulty: "medium", question: "Which command downloads remote changes and merges them into your current branch?",
      options: ["git push", "git init", "git pull", "git remote"], answer: 2 },
    { difficulty: "medium", question: "Which command creates a new branch named feature?",
      options: ["git new feature", "git branch feature", "git make feature", "git fork feature"], answer: 1 },

    // Hard
    { difficulty: "hard", question: "What does a Git commit represent?",
      options: ["A snapshot of the staged changes saved in the project history", "A copy of the remote server", "A temporary branch", "A merge conflict"], answer: 0 },
    { difficulty: "hard", question: "Which file tells Git which files or folders to ignore?",
      options: ["ignore.txt", ".gitconfig", ".gitkeep", ".gitignore"], answer: 3 },
    { difficulty: "hard", question: "What does git merge do?",
      options: ["Deletes a branch", "Uploads files to the server", "Combines the history of another branch into the current branch", "Creates a new repository"], answer: 2 },
    { difficulty: "hard", question: "Which GitHub feature can publish a static website directly from a repository?",
      options: ["GitHub Actions", "GitHub Pages", "GitHub Gists", "GitHub Sponsors"], answer: 1 },
    { difficulty: "hard", question: "Which sequence correctly publishes new local changes to GitHub?",
      options: ["git add, git commit, git push", "git push, git add, git commit", "git commit, git clone, git add", "git init, git pull, git push"], answer: 0 }
  ],

  // Unit II - Client-side programming: functions, DOM, forms, events, loops, canvas
  "JavaScript": [
    // Easy
    { difficulty: "easy", question: "Which HTML tag is used to add JavaScript to a web page?",
      options: ["<javascript>", "<js>", "<code>", "<script>"], answer: 3 },
    { difficulty: "easy", question: "Which function shows a message in a pop-up dialog box?",
      options: ["display()", "popup()", "alert()", "msg()"], answer: 2 },
    { difficulty: "easy", question: "Which keyword declares a variable in JavaScript?",
      options: ["int", "var", "dim", "string"], answer: 1 },
    { difficulty: "easy", question: "Which symbol starts a single-line comment in JavaScript?",
      options: ["//", "#", "<!-- -->", "**"], answer: 0 },
    { difficulty: "easy", question: "Which event handler attribute runs when a user clicks an element?",
      options: ["onchange", "onmouseover", "onload", "onclick"], answer: 3 },

    // Medium
    { difficulty: "medium", question: "Which loop always runs its body at least once?",
      options: ["for", "while", "do...while", "for...in"], answer: 2 },
    { difficulty: "medium", question: "Which method gives keyboard focus to a form control?",
      options: ["select()", "focus()", "blur()", "reset()"], answer: 1 },
    { difficulty: "medium", question: "Which statement changes the text colour of an element stored in the variable box?",
      options: ["box.style.color = \"red\";", "box.color = \"red\";", "box.css(\"color\", \"red\");", "box.style = color: red;"], answer: 0 },
    { difficulty: "medium", question: "Which method sets every control of a form back to its default value?",
      options: ["form.clear()", "form.refresh()", "form.default()", "form.reset()"], answer: 3 },
    { difficulty: "medium", question: "How do you include an external JavaScript file named app.js?",
      options: ["<script href=\"app.js\"></script>", "<js file=\"app.js\"></js>", "<script src=\"app.js\"></script>", "<link src=\"app.js\">"], answer: 2 },

    // Hard
    { difficulty: "hard", question: "Which property reads the text typed into an <input type=\"text\"> element?",
      options: ["innerHTML", "value", "textContent", "text"], answer: 1 },
    { difficulty: "hard", question: "Which property tells whether a checkbox is ticked?",
      options: ["checked", "selected", "value", "active"], answer: 0 },
    { difficulty: "hard", question: "Which method attaches an event handler to an element without replacing existing handlers?",
      options: ["onEvent()", "attachHandler()", "listenTo()", "addEventListener()"], answer: 3 },
    { difficulty: "hard", question: "Which CSS property, changed with JavaScript, decides which overlapping element appears on top?",
      options: ["order", "stack-level", "z-index", "layer"], answer: 2 },
    { difficulty: "hard", question: "Which method of a canvas element returns the object used for drawing 2D shapes?",
      options: ["drawShapes()", "getContext(\"2d\")", "createGraphics()", "getCanvas(\"2d\")"], answer: 1 }
  ],

  // Unit III - Server-side programming: variables, arrays, functions, files, databases
  "PHP": [
    // Easy
    { difficulty: "easy", question: "What does PHP stand for?",
      options: ["PHP: Hypertext Preprocessor", "Private Hypertext Processor", "Programmed HTML Pages", "Pre-Hyper Processing"], answer: 0 },
    { difficulty: "easy", question: "Where is PHP code executed?",
      options: ["In the web browser", "Only inside the database", "On the DNS server", "On the web server"], answer: 3 },
    { difficulty: "easy", question: "Which symbol must every PHP variable name start with?",
      options: ["@", "&", "$", "%"], answer: 2 },
    { difficulty: "easy", question: "Which tags enclose PHP code?",
      options: ["<php> ... </php>", "<?php ... ?>", "<% ... %>", "<script php> ... </script>"], answer: 1 },
    { difficulty: "easy", question: "Which statement is commonly used to output text in PHP?",
      options: ["echo", "print_out", "write_page", "console.log"], answer: 0 },

    // Medium
    { difficulty: "medium", question: "Which function defines a constant in PHP?",
      options: ["const_define()", "constant_set()", "var_const()", "define()"], answer: 3 },
    { difficulty: "medium", question: "Which line correctly creates an indexed array in PHP?",
      options: ["$a = (1, 2, 3);", "$a = new Array[1, 2, 3];", "$a = array(1, 2, 3);", "array $a = 1, 2, 3;"], answer: 2 },
    { difficulty: "medium", question: "Which operator joins two strings in PHP?",
      options: ["+ (plus)", ". (dot)", "& (ampersand)", ":: (double colon)"], answer: 1 },
    { difficulty: "medium", question: "Which function returns the number of elements in an array?",
      options: ["count()", "size()", "length()", "total()"], answer: 0 },
    { difficulty: "medium", question: "Which superglobal collects data sent by a form that uses method=\"post\"?",
      options: ["$_GET", "$_FORM", "$_SERVER", "$_POST"], answer: 3 },

    // Hard
    { difficulty: "hard", question: "Which function opens a file for reading or writing in PHP?",
      options: ["open()", "file_open()", "fopen()", "readfile()"], answer: 2 },
    { difficulty: "hard", question: "Which PHP extension gives a database-independent way to connect to MySQL and other databases?",
      options: ["cURL", "PDO", "GD", "JSON"], answer: 1 },
    { difficulty: "hard", question: "What does this code print? echo 10 % 3;",
      options: ["1", "3", "0", "3.33"], answer: 0 },
    { difficulty: "hard", question: "What is the safest way to put user input into an SQL query?",
      options: ["Join the input directly into the query string", "Use echo() before running the query", "Check the length with strlen() only", "Use prepared statements with bound parameters"], answer: 3 },
    { difficulty: "hard", question: "How does require differ from include in PHP?",
      options: ["If the file is missing, include stops the script with a fatal error, while require only gives a warning", "They behave identically in every case", "If the file is missing, require stops the script with a fatal error, while include only gives a warning", "include can load only HTML files"], answer: 2 }
  ],

  // Unit III - Grid system, components, navigation, plugins and flexbox utilities
  "Bootstrap": [
    // Easy
    { difficulty: "easy", question: "What is Bootstrap?",
      options: ["A database system", "A front-end framework for building responsive websites", "A server-side language", "A version-control tool"], answer: 1 },
    { difficulty: "easy", question: "Which company originally created Bootstrap?",
      options: ["Twitter", "Google", "Facebook", "Microsoft"], answer: 0 },
    { difficulty: "easy", question: "Which class creates a fixed-width, centred container in Bootstrap?",
      options: [".wrapper", ".box", ".holder", ".container"], answer: 3 },
    { difficulty: "easy", question: "Which meta tag helps Bootstrap pages scale properly on mobile devices?",
      options: ["charset", "description", "viewport", "author"], answer: 2 },
    { difficulty: "easy", question: "Which classes give a button the standard blue primary style?",
      options: ["button blue", "btn btn-primary", "btn-blue", "btn primary-blue"], answer: 1 },

    // Medium
    { difficulty: "medium", question: "How many columns does the Bootstrap grid have in each row?",
      options: ["12", "6", "8", "16"], answer: 0 },
    { difficulty: "medium", question: "Which class creates a row inside a Bootstrap container?",
      options: [".line", ".section", ".strip", ".row"], answer: 3 },
    { difficulty: "medium", question: "Which class turns an element into a flex container in Bootstrap?",
      options: [".flexbox", ".flex-on", ".d-flex", ".display-flex"], answer: 2 },
    { difficulty: "medium", question: "Which class makes an image scale with its parent in Bootstrap 5?",
      options: [".img-flex", ".img-fluid", ".image-auto", ".pic-responsive"], answer: 1 },
    { difficulty: "medium", question: "In the class col-md-6, what does md stand for?",
      options: ["The medium screen breakpoint", "Media device", "Maximum display", "Mobile design"], answer: 0 },

    // Hard
    { difficulty: "hard", question: "Two divs with class col-md-6 sit inside one row. What happens on a phone screen narrower than 768px?",
      options: ["They stay side by side", "They disappear", "They overlap each other", "The columns stack vertically, one below the other"], answer: 3 },
    { difficulty: "hard", question: "Which Bootstrap component gives a navigation bar that collapses behind a toggle button on small screens?",
      options: ["Carousel", "Tooltip", "Navbar", "Breadcrumb"], answer: 2 },
    { difficulty: "hard", question: "Which Bootstrap JavaScript plugin shows a dialog box over the page content?",
      options: ["Collapse", "Modal", "Scrollspy", "Carousel"], answer: 1 },
    { difficulty: "hard", question: "Which utility class adds spacing of level 3 to the top margin of an element?",
      options: ["mt-3", "mp-3", "m-top-3", "margin-3"], answer: 0 },
    { difficulty: "hard", question: "Which class centres flex items horizontally inside a flex container?",
      options: ["align-center", "text-center-flex", "flex-center", "justify-content-center"], answer: 3 }
  ],

  // Unit IV - React setup, JSX, components, lifecycle, constructors, Dev Tools
  "ReactJS": [
    // Easy
    { difficulty: "easy", question: "Which company developed ReactJS?",
      options: ["Google", "Microsoft", "Facebook (Meta)", "Twitter"], answer: 2 },
    { difficulty: "easy", question: "What is ReactJS?",
      options: ["A database", "A JavaScript library for building user interfaces", "A CSS framework", "A server-side language"], answer: 1 },
    { difficulty: "easy", question: "What does JSX stand for?",
      options: ["JavaScript XML", "JavaScript Extension", "Java Syntax Extension", "JSON Extra"], answer: 0 },
    { difficulty: "easy", question: "Which command creates a new React app with Create React App?",
      options: ["npm make react myapp", "react new myapp", "node init react", "npx create-react-app myapp"], answer: 3 },
    { difficulty: "easy", question: "What is a React component?",
      options: ["A CSS file", "A database table", "A reusable, independent piece of the user interface", "A server route"], answer: 2 },

    // Medium
    { difficulty: "medium", question: "How must the name of a React component begin?",
      options: ["With a lowercase letter", "With a capital letter", "With an underscore", "With a number"], answer: 1 },
    { difficulty: "medium", question: "In JSX, which attribute applies a CSS class to an element?",
      options: ["className", "class", "cssClass", "styleClass"], answer: 0 },
    { difficulty: "medium", question: "Which JSX line correctly shows the value of a variable called name?",
      options: ["<h1>Hello (name)</h1>", "<h1>Hello <%= name %></h1>", "<h1>Hello {{name}}</h1>", "<h1>Hello {name}</h1>"], answer: 3 },
    { difficulty: "medium", question: "What must a class component's constructor call before using this?",
      options: ["render()", "setState()", "super(props)", "this.state()"], answer: 2 },
    { difficulty: "medium", question: "Which JSX feature lets you return several sibling elements without adding an extra DOM node?",
      options: ["A <div> wrapper", "A Fragment (<>...</>)", "A comma between the elements", "Two return statements"], answer: 1 },

    // Hard
    { difficulty: "hard", question: "Which lifecycle method runs right after a class component is first added to the DOM?",
      options: ["componentDidMount()", "componentWillUnmount()", "shouldComponentUpdate()", "getDerivedStateFromProps()"], answer: 0 },
    { difficulty: "hard", question: "Which lifecycle method is the right place to clear timers before a class component is removed?",
      options: ["componentDidMount()", "render()", "constructor()", "componentWillUnmount()"], answer: 3 },
    { difficulty: "hard", question: "What is the main difference between ReactJS and React Native?",
      options: ["ReactJS builds mobile apps, while React Native builds web pages", "React Native works only with PHP", "ReactJS builds web user interfaces for the browser, while React Native builds native mobile apps", "They are exactly the same library"], answer: 2 },
    { difficulty: "hard", question: "Which browser extension helps you inspect React components, props and state?",
      options: ["JSON Viewer", "React Developer Tools", "Postman", "Wappalyzer"], answer: 1 },
    { difficulty: "hard", question: "What does React do with the Virtual DOM when state changes?",
      options: ["It compares the new version with the old one and updates only the parts of the real DOM that changed", "It replaces the entire real DOM every time", "It saves the page in a database", "It reloads the whole web page"], answer: 0 }
  ],

  // Unit V - State, props, prop validation, hooks, routing and deployment
  "React Dataflow": [
    // Easy
    { difficulty: "easy", question: "In which direction does data normally flow between React components?",
      options: ["From child to parent only", "Only through global variables", "Through a database", "From parent to child through props"], answer: 3 },
    { difficulty: "easy", question: "Which hook adds state to a function component?",
      options: ["useEffect", "useRoute", "useState", "useStore"], answer: 2 },
    { difficulty: "easy", question: "Should a component change the props it receives?",
      options: ["Yes, props can be changed freely", "No, props are read-only", "Only inside render()", "Only in class components"], answer: 1 },
    { difficulty: "easy", question: "What does useState return?",
      options: ["An array with the current value and a function to update it", "A single string", "A promise", "An object of props"], answer: 0 },
    { difficulty: "easy", question: "How do you pass the value Asha to a child component as a prop called name?",
      options: ["<Child (name=Asha) />", "<Child>name: Asha</Child>", "<Child.name = \"Asha\" />", "<Child name=\"Asha\" />"], answer: 3 },

    // Medium
    { difficulty: "medium", question: "Which hook is used for side effects such as fetching data after a render?",
      options: ["useState", "useMemo", "useEffect", "useReducer"], answer: 2 },
    { difficulty: "medium", question: "What is the correct way to increase a state value called count?",
      options: ["count = count + 1", "setCount(count + 1)", "count++", "this.count = count + 1"], answer: 1 },
    { difficulty: "medium", question: "Which library is commonly used for routing in React web apps?",
      options: ["react-router-dom", "react-routing-php", "express-router", "router-js-core"], answer: 0 },
    { difficulty: "medium", question: "Which package is commonly used to validate prop types at runtime?",
      options: ["type-check-dom", "react-validate-core", "props-checker", "prop-types"], answer: 3 },
    { difficulty: "medium", question: "How do you apply an inline style in React?",
      options: ["style=\"color: red\"", "css=\"color: red\"", "style={{ color: \"red\" }}", "class={color: red}"], answer: 2 },

    // Hard
    { difficulty: "hard", question: "What happens when the state of a React component changes?",
      options: ["The whole page reloads", "The component re-renders with the new state", "The server restarts", "Nothing until the user refreshes"], answer: 1 },
    { difficulty: "hard", question: "Which dependency array makes useEffect run only once, after the first render?",
      options: ["[]", "[count]", "{}", "No array at all"], answer: 0 },
    { difficulty: "hard", question: "In React Router, which component maps a URL path to the UI that should be shown?",
      options: ["Link", "State", "Props", "Route"], answer: 3 },
    { difficulty: "hard", question: "How can a child component send data back to its parent?",
      options: ["By changing the parent's props", "By writing directly to the parent's state", "By calling a function the parent passed down as a prop", "It is not possible in React"], answer: 2 },
    { difficulty: "hard", question: "Which command creates an optimised production build of a Create React App project?",
      options: ["npm start", "npm run build", "npm test", "npm run dev"], answer: 1 }
  ]
};

/* ---------- 2b. Subjects: Units I to V and the general subjects ----------
   The value of each radio button on the home page is a key of this object.
   sources : which parts of the question bank the quiz draws from
   notesId : id of the <template> in index.html that holds the study notes
             (null = no notes for this subject)
*/
const quizSubjects = {
  unit1: {
    fullName: "Unit I \u00B7 Web Basics, HTML and CSS",
    label: "Unit I",
    title: "Web Basics, HTML and CSS",
    sources: ["Web Basics & Internet", "HTML & CSS", "Git & Hosting"],
    notesId: "notes-unit1"
  },
  unit2: {
    fullName: "Unit II \u00B7 Client-Side Programming: JavaScript",
    label: "Unit II",
    title: "Client-Side Programming: JavaScript",
    sources: ["JavaScript"],
    notesId: "notes-unit2"
  },
  unit3: {
    fullName: "Unit III \u00B7 Server-Side Programming: PHP and Bootstrap",
    label: "Unit III",
    title: "Server-Side Programming: PHP and Bootstrap",
    sources: ["PHP", "Bootstrap"],
    notesId: "notes-unit3"
  },
  unit4: {
    fullName: "Unit IV \u00B7 ReactJS",
    label: "Unit IV",
    title: "ReactJS",
    sources: ["ReactJS"],
    notesId: "notes-unit4"
  },
  unit5: {
    fullName: "Unit V \u00B7 React Dataflow",
    label: "Unit V",
    title: "React Dataflow",
    sources: ["React Dataflow"],
    notesId: "notes-unit5"
  },
  "General Knowledge": { fullName: "General Knowledge", label: "General Knowledge", title: "General Knowledge", sources: ["General Knowledge"], notesId: null },
  "Computer Science": { fullName: "Computer Science", label: "Computer Science", title: "Computer Science", sources: ["Computer Science"], notesId: null },
  "Web Development": { fullName: "Web Development", label: "Web Development", title: "Web Development", sources: ["Web Development"], notesId: null }
};

/* ---------- 3. App state ---------- */
const state = {
  studentName: "",
  subjectKey: "",     // key of quizSubjects, for example "unit1"
  category: "",       // the name shown on screen, for example "Unit I \u00B7 Web Basics, HTML and CSS"
  difficulty: "",
  questions: [],      // the 10 questions chosen for this quiz
  answers: [],        // chosen option index per question (null = unanswered)
  currentIndex: 0,
  timeLeft: QUIZ_TIME_SECONDS,
  timerId: null,
  isSubmitted: false, // stops the score being calculated twice
  results: null
};

/* ---------- 4. Helpers ---------- */
const $ = (id) => document.getElementById(id);

const screens = {
  welcome: $("welcome-screen"),
  notes: $("notes-screen"),
  quiz: $("quiz-screen"),
  result: $("result-screen"),
  review: $("review-screen")
};

// Returns a new, randomly ordered copy of an array (Fisher-Yates shuffle)
function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pad(number) {
  return String(number).padStart(2, "0");
}

// 305 seconds -> "05:05" (used by the countdown)
function formatClock(seconds) {
  return pad(Math.floor(seconds / 60)) + ":" + pad(seconds % 60);
}

// 95 seconds -> "1m 35s" (used on the results page)
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes === 0 ? rest + "s" : minutes + "m " + rest + "s";
}

function countAnswered() {
  return state.answers.filter((answer) => answer !== null).length;
}

function getPerformanceMessage(percent) {
  if (percent >= 90) return "Excellent work!";
  if (percent >= 70) return "Great job!";
  if (percent >= 50) return "Good effort! Keep learning.";
  return "Keep practicing. You can improve!";
}

/* ---------- 5. Screens ---------- */
function showScreen(name) {
  Object.keys(screens).forEach((key) => {
    screens[key].classList.toggle("active", key === name);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- 6. Starting a quiz ---------- */

// Picks 10 questions for the subject, using the chosen difficulty first
function pickQuestions(subjectKey, difficulty) {
  // a unit can combine several parts of the question bank
  const pool = quizSubjects[subjectKey].sources.flatMap((source) => questionBank[source]);
  let picked = [];

  DIFFICULTY_ORDER[difficulty].forEach((level) => {
    const stillNeeded = QUESTIONS_PER_QUIZ - picked.length;
    if (stillNeeded <= 0) return;
    const matching = shuffle(pool.filter((q) => q.difficulty === level));
    picked = picked.concat(matching.slice(0, stillNeeded));
  });

  return shuffle(picked);
}

function startQuiz(name, subjectKey, difficulty) {
  stopTimer();   // makes sure an old timer never keeps running

  state.studentName = name;
  state.subjectKey = subjectKey;
  state.category = quizSubjects[subjectKey].fullName;
  state.difficulty = difficulty;
  state.questions = pickQuestions(subjectKey, difficulty);
  state.answers = state.questions.map(() => null);
  state.currentIndex = 0;
  state.isSubmitted = false;
  state.results = null;

  $("quiz-student-name").textContent = name;
  $("student-avatar").textContent = name.charAt(0).toUpperCase();
  $("quiz-category").textContent = state.category;
  $("quiz-difficulty").textContent = difficulty;

  closeModal();
  renderQuestion();
  startTimer();
  showScreen("quiz");
}

// Returns the cleaned name. If the name is not valid it shows an error and returns "".
function readValidName() {
  const nameInput = $("student-name");
  const name = nameInput.value.trim().replace(/\s+/g, " ");

  let message = "";
  if (name === "") {
    message = "Please enter your name to start the quiz.";
  } else if (name.length < 2) {
    message = "Your name must be at least 2 characters long.";
  }

  if (message) {
    $("name-error").textContent = message;
    nameInput.classList.add("invalid");
    nameInput.focus();
    return "";
  }

  clearNameError();
  return name;
}

function getSelectedSubject() {
  return document.querySelector('input[name="category"]:checked').value;
}

function getSelectedDifficulty() {
  return document.querySelector('input[name="difficulty"]:checked').value;
}

function handleStartForm(event) {
  event.preventDefault();

  const name = readValidName();
  if (name === "") return;

  startQuiz(name, getSelectedSubject(), getSelectedDifficulty());
}

function clearNameError() {
  $("name-error").textContent = "";
  $("student-name").classList.remove("invalid");
}

/* ---------- 7. Showing a question ---------- */
function renderQuestion() {
  const total = state.questions.length;
  const question = state.questions[state.currentIndex];
  const isLast = state.currentIndex === total - 1;

  $("question-counter").textContent = "Question " + (state.currentIndex + 1) + " of " + total;
  $("question-text").textContent = question.question;

  renderOptions();
  updateProgress();
  updateAnsweredCount();
  clearWarning();

  $("prev-btn").disabled = state.currentIndex === 0;
  $("next-btn").hidden = isLast;
  $("submit-btn").hidden = !isLast;

  playQuestionAnimation();
}

function renderOptions() {
  const question = state.questions[state.currentIndex];
  const selected = state.answers[state.currentIndex];
  const container = $("options");
  container.innerHTML = "";

  question.options.forEach((optionText, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option" + (index === selected ? " selected" : "");
    button.setAttribute("aria-pressed", index === selected ? "true" : "false");

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);   // A, B, C, D

    const text = document.createElement("span");
    text.className = "option-text";
    text.textContent = optionText;

    const check = document.createElement("span");
    check.className = "option-check";
    check.setAttribute("aria-hidden", "true");
    check.textContent = "\u2713";

    button.append(letter, text, check);
    button.addEventListener("click", () => selectAnswer(index));
    container.appendChild(button);
  });
}

function selectAnswer(index) {
  if (state.isSubmitted) return;
  state.answers[state.currentIndex] = index;   // replaces any earlier choice
  renderOptions();
  updateAnsweredCount();
  clearWarning();
}

function updateProgress() {
  const percent = ((state.currentIndex + 1) / state.questions.length) * 100;
  $("progress-fill").style.width = percent + "%";
  $("progress-bar").setAttribute("aria-valuenow", Math.round(percent));
}

function updateAnsweredCount() {
  $("answered-counter").textContent = "Answered: " + countAnswered() + "/" + state.questions.length;
}

function playQuestionAnimation() {
  const area = $("question-area");
  area.classList.remove("animate");
  void area.offsetWidth;   // forces the browser to restart the animation
  area.classList.add("animate");
}

function showWarning(message) {
  const warning = $("quiz-warning");
  warning.textContent = message;
  warning.classList.remove("shake");
  void warning.offsetWidth;
  warning.classList.add("shake");
}

function clearWarning() {
  $("quiz-warning").textContent = "";
}

/* ---------- 8. Navigation ---------- */
function goNext() {
  if (state.answers[state.currentIndex] === null) {
    showWarning("\u26A0\uFE0F Please select an answer before moving to the next question.");
    return;
  }
  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex++;
    renderQuestion();
  }
}

function goPrevious() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderQuestion();
  }
}

/* ---------- 9. Timer ---------- */
function startTimer() {
  state.timeLeft = QUIZ_TIME_SECONDS;
  updateTimerDisplay();
  state.timerId = setInterval(tick, 1000);
}

function stopTimer() {
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function tick() {
  if (state.isSubmitted) return;
  state.timeLeft--;
  updateTimerDisplay();

  if (state.timeLeft <= 0) {
    submitQuiz(true);   // time is over, so submit automatically
  }
}

function updateTimerDisplay() {
  $("timer-text").textContent = formatClock(Math.max(state.timeLeft, 0));
  $("timer-box").classList.toggle("timer-danger", state.timeLeft <= 60);
}

/* ---------- 10. Submit and score ---------- */
function handleSubmitClick() {
  const unanswered = state.questions.length - countAnswered();
  const message = unanswered === 0
    ? "You have answered every question. Once submitted, you cannot change your answers."
    : "You still have " + unanswered + " unanswered question" + (unanswered === 1 ? "" : "s") +
      ". Once submitted, you cannot change your answers.";

  openModal("Submit the quiz?", message, "Yes, Submit", () => submitQuiz(false));
}

function submitQuiz(timeExpired) {
  if (state.isSubmitted) return;   // never calculate the score twice
  state.isSubmitted = true;
  stopTimer();
  closeModal();

  state.results = calculateResults();
  showResults(timeExpired === true);
  showScreen("result");
}

function calculateResults() {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  state.questions.forEach((question, index) => {
    const chosen = state.answers[index];
    if (chosen === null) {
      unanswered++;
    } else if (chosen === question.answer) {
      correct++;
    } else {
      incorrect++;
    }
  });

  const total = state.questions.length;
  return {
    total: total,
    correct: correct,
    incorrect: incorrect,
    unanswered: unanswered,
    percent: Math.round((correct / total) * 100),
    timeTaken: QUIZ_TIME_SECONDS - Math.max(state.timeLeft, 0)
  };
}

/* ---------- 11. Results ---------- */
function showResults(timeExpired) {
  const r = state.results;

  $("result-greeting").textContent = "Well done, " + state.studentName + "!";
  $("result-message").textContent = getPerformanceMessage(r.percent);
  $("score-percent").textContent = r.percent + "%";
  $("score-fraction").textContent = r.correct + "/" + r.total;
  $("stat-correct").textContent = r.correct;
  $("stat-incorrect").textContent = r.incorrect;
  $("stat-unanswered").textContent = r.unanswered;
  $("stat-time").textContent = formatDuration(r.timeTaken);
  $("result-meta").textContent = state.category + " \u2022 " + state.difficulty + " difficulty";

  $("result-notes-btn").hidden = !hasNotes(state.subjectKey);

  const notice = $("result-notice");
  notice.hidden = !timeExpired;
  if (timeExpired) {
    notice.textContent = "\u23F0 Time is up! Your quiz was submitted automatically.";
  }

  animateRing(r.percent);
}

// Fills the circular score indicator
function animateRing(percent) {
  const ring = $("ring-fill");
  ring.style.strokeDasharray = RING_CIRCUMFERENCE;
  ring.style.transition = "none";
  ring.style.strokeDashoffset = RING_CIRCUMFERENCE;   // start empty
  void ring.getBoundingClientRect();
  ring.style.transition = "";
  setTimeout(() => {
    ring.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - percent / 100);
  }, 50);
}

/* ---------- 12. Answer review ---------- */
function renderReview() {
  const r = state.results;
  const list = $("review-list");
  list.innerHTML = "";

  $("review-summary").textContent =
    r.correct + " correct \u2022 " + r.incorrect + " incorrect \u2022 " + r.unanswered + " unanswered";

  state.questions.forEach((question, index) => {
    const chosen = state.answers[index];
    let status = "unanswered";
    let label = "\u2796 Not answered";
    if (chosen !== null && chosen === question.answer) {
      status = "correct";
      label = "\u2714 Correct";
    } else if (chosen !== null) {
      status = "incorrect";
      label = "\u2718 Incorrect";
    }

    const item = document.createElement("article");
    item.className = "review-item is-" + status;

    const top = document.createElement("div");
    top.className = "review-top";
    const number = document.createElement("span");
    number.className = "review-number";
    number.textContent = "Question " + (index + 1);
    const badge = document.createElement("span");
    badge.className = "status-badge";
    badge.textContent = label;
    top.append(number, badge);

    const text = document.createElement("h3");
    text.className = "review-question";
    text.textContent = question.question;

    const yourAnswer = document.createElement("p");
    yourAnswer.className = "review-answer";
    const yourLabel = document.createElement("strong");
    yourLabel.textContent = "Your answer: ";
    yourAnswer.append(yourLabel, document.createTextNode(
      chosen === null ? "Not answered" : question.options[chosen]
    ));

    const correctAnswer = document.createElement("p");
    correctAnswer.className = "review-answer";
    const correctLabel = document.createElement("strong");
    correctLabel.textContent = "Correct answer: ";
    correctAnswer.append(correctLabel, document.createTextNode(question.options[question.answer]));

    item.append(top, text, yourAnswer, correctAnswer);
    list.appendChild(item);
  });
}

function openReview() {
  renderReview();
  showScreen("review");
}

/* ---------- 12b. Study notes ---------- */
let notesSubjectKey = "";           // which subject's notes are open
let notesReturnScreen = "welcome";  // where the Back button goes ("welcome" or "result")

function hasNotes(subjectKey) {
  return quizSubjects[subjectKey].notesId !== null;
}

// The Study Notes button on the home page only shows for subjects that have notes
function updateNotesButton() {
  $("notes-btn").hidden = !hasNotes(getSelectedSubject());
}

function openNotes(subjectKey, returnScreen) {
  const subject = quizSubjects[subjectKey];
  const template = $(subject.notesId);
  if (!template) return;

  notesSubjectKey = subjectKey;
  notesReturnScreen = returnScreen;

  const questionCount = subject.sources.reduce((sum, source) => sum + questionBank[source].length, 0);
  $("notes-unit-label").textContent = subject.label;
  $("notes-title").textContent = subject.title;
  $("notes-count").textContent = questionCount + " practice questions \u2022 each quiz picks 10";

  // copy the notes (written as HTML in index.html) onto the page
  const body = $("notes-body");
  body.replaceChildren(template.content.cloneNode(true));
  buildNotesContents(body);

  showScreen("notes");
}

// Makes the "On this page" list from the <h2> headings of the notes
function buildNotesContents(body) {
  const list = $("notes-contents");
  list.innerHTML = "";

  const headings = body.querySelectorAll("h2");
  headings.forEach((heading, index) => {
    heading.id = "notes-section-" + (index + 1);

    const link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    const item = document.createElement("li");
    item.appendChild(link);
    list.appendChild(item);
  });

  $("notes-contents-box").hidden = headings.length < 2;
}

// "Take the Quiz" button on the notes page
function startQuizFromNotes() {
  const name = readValidName();   // the name is typed on the home page
  if (name === "") {
    showScreen("welcome");
    $("student-name").focus();
    return;
  }

  // make the home page selection match the notes that were being read
  document.querySelector('input[name="category"][value="' + notesSubjectKey + '"]').checked = true;
  updateNotesButton();
  startQuiz(name, notesSubjectKey, getSelectedDifficulty());
}

/* ---------- 13. Confirmation box ---------- */
let pendingAction = null;

function openModal(title, message, confirmText, onConfirm) {
  $("modal-title").textContent = title;
  $("modal-message").textContent = message;
  $("modal-confirm").textContent = confirmText;
  pendingAction = onConfirm;
  $("modal").hidden = false;
  $("modal-confirm").focus();
}

function closeModal() {
  $("modal").hidden = true;
  pendingAction = null;
}

function confirmModal() {
  const action = pendingAction;
  closeModal();
  if (action) action();
}

function handleExitClick() {
  openModal(
    "Exit the quiz?",
    "Your progress will be lost and you will return to the home page.",
    "Yes, Exit",
    goHome
  );
}

function goHome() {
  stopTimer();
  closeModal();
  showScreen("welcome");
}

function restartQuiz() {
  // Same student, subject and difficulty, but fresh questions and empty answers
  startQuiz(state.studentName, state.subjectKey, state.difficulty);
}

/* ---------- 14. Event listeners ---------- */
$("start-form").addEventListener("submit", handleStartForm);
$("student-name").addEventListener("input", clearNameError);

$("prev-btn").addEventListener("click", goPrevious);
$("next-btn").addEventListener("click", goNext);
$("submit-btn").addEventListener("click", handleSubmitClick);
$("exit-btn").addEventListener("click", handleExitClick);

$("start-form").addEventListener("change", updateNotesButton);
$("notes-btn").addEventListener("click", () => openNotes(getSelectedSubject(), "welcome"));
$("result-notes-btn").addEventListener("click", () => openNotes(state.subjectKey, "result"));
$("notes-back-btn").addEventListener("click", () => showScreen(notesReturnScreen));
$("notes-back-btn-bottom").addEventListener("click", () => showScreen(notesReturnScreen));
$("notes-start-btn").addEventListener("click", startQuizFromNotes);
$("notes-start-btn-bottom").addEventListener("click", startQuizFromNotes);

$("review-btn").addEventListener("click", openReview);
$("restart-btn").addEventListener("click", restartQuiz);
$("home-btn").addEventListener("click", goHome);

$("review-back-btn").addEventListener("click", () => showScreen("result"));
$("review-back-btn-bottom").addEventListener("click", () => showScreen("result"));
$("review-restart-btn").addEventListener("click", restartQuiz);

$("modal-confirm").addEventListener("click", confirmModal);
$("modal-cancel").addEventListener("click", closeModal);
$("modal").addEventListener("click", (event) => {
  if (event.target === $("modal")) closeModal();   // click on the dark background
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("modal").hidden) closeModal();
});

// show or hide the Study Notes button for the subject selected at start-up
updateNotesButton();