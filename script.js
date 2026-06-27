let list = JSON.parse(localStorage.getItem("myEntries")) || [];
let todos = JSON.parse(localStorage.getItem("myTodos")) || [];
let mode = "login";

function loginClick() {
let user_val = document.getElementById("userInp").value.trim();
let password_val = document.getElementById("passInp").value.trim();

if(user_val === "" || password_val === "") {
alert("Please enter both username and password!");
return;
}

if(mode === "reg") {
localStorage.setItem("savedU", user_val);
localStorage.setItem("savedP", password_val);
alert("Account successfully created! Welcome to My Journal.");
document.getElementById("userInp").value = "";
document.getElementById("passInp").value = "";
go();
return; 
} 
    
let su = localStorage.getItem("savedU") || "admin";
let sp = localStorage.getItem("savedP") || "admin";

if(user_val === su && password_val === sp) {
alert("Login successful!");
go();
} else {
alert("Invalid login details! Try again. (Default back-door is admin/admin)");
}
}

function changeForm() {
if(mode === "login") {
mode = "reg";
document.getElementById("logTitle").innerText = "Create Your Account";
document.getElementById("logBtn").innerText = "Register & Login";
document.getElementById("switchText").innerText = "Already have an account? Login here";
} else {
mode = "login";
document.getElementById("logTitle").innerText = "Login Here";
document.getElementById("logBtn").innerText = "Login";
document.getElementById("switchText").innerText = "Don't have an account? Create one";
}
}

function go() {
document.getElementById("loginDiv").style.display = "none";
document.getElementById("mainApp").style.display = "block";
show();
showTodos();
}

function out() {
alert("Logged out safely!");
document.getElementById("loginDiv").style.display = "flex";
document.getElementById("mainApp").style.display = "none";
}

function add() {
let content = document.getElementById("txtBox").value.trim();
if(content === "") {
alert("Cannot save an empty journal entry!");
return;
}
let index_num = document.getElementById("editNum").value;
if(index_num !== "") {
list[index_num].text = content;
document.getElementById("editNum").value = "";
document.getElementById("subBtn").innerText = "Save Entry";
alert("Journal entry updated successfully!");
} else {
let dateObj = new Date();
let strDay = dateObj.toLocaleDateString();
let strTime = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
let entry_object = {
text: content,
day: strDay,
time: strTime
};
list.push(entry_object);
alert("New entry saved to your journal timeline!");
}
localStorage.setItem("myEntries", JSON.stringify(list));
document.getElementById("txtBox").value = "";
show();
}

function show(findText = "") {
let display_box = document.getElementById("allEntries");
display_box.innerHTML = "";
let groups = {};
let sortingOption = document.getElementById("sortSelect").value;

if (sortingOption === "newest") {
for (let index = list.length - 1; index >= 0; index--) {
let element = list[index];
if (findText !== "" && !element.text.toLowerCase().includes(findText.toLowerCase())) continue;
if (!groups[element.day]) groups[element.day] = [];
groups[element.day].push({ data: element, id: index });
}
} else {
for (let index = 0; index < list.length; index++) {
let element = list[index];
if (findText !== "" && !element.text.toLowerCase().includes(findText.toLowerCase())) continue;
if (!groups[element.day]) groups[element.day] = [];
groups[element.day].push({ data: element, id: index });
}
}

for(let key in groups) {
let componentSec = document.createElement("div");
componentSec.className = "day-section";
let headerTitle = document.createElement("div");
headerTitle.className = "day-date";
headerTitle.innerText = "📆 " + key;
componentSec.appendChild(headerTitle);
let subArray = groups[key];
for(let tracker = 0; tracker < subArray.length; tracker++) {
let details = subArray[tracker].data;
let referenceId = subArray[tracker].id;
let itemDiv = document.createElement("div");
itemDiv.className = "one-entry";
let placeholderText = details.text;
if(placeholderText.length > 60) {
placeholderText = placeholderText.substring(0, 60) + "... (Click to open full page)";
}
itemDiv.innerHTML = `
<div class="entry-time">🕒 Time: ${details.time}</div>
<div style="cursor:pointer;" onclick="showPop(${referenceId})"><strong>${placeholderText}</strong></div>
<div class="entry-links">
<span onclick="editIt(${referenceId})" style="color: blue;">✏️ Edit</span>
<span onclick="delIt(${referenceId})" style="color: red;">🗑️ Delete</span>
</div>
`;
componentSec.appendChild(itemDiv);
}
display_box.appendChild(componentSec);
}
}

function editIt(indexValue) {
document.getElementById("txtBox").value = list[indexValue].text;
document.getElementById("editNum").value = indexValue;
document.getElementById("subBtn").innerText = "Update This Entry";
document.getElementById("txtBox").focus();
}

function delIt(indexValue) {
if(confirm("Are you sure you want to delete this journal entry?")) {
list.splice(indexValue, 1);
localStorage.setItem("myEntries", JSON.stringify(list));
alert("Entry deleted.");
show();
}
}

function search() {
let searchWord = document.getElementById("findInp").value;
show(searchWord);
}

function showPop(indexValue) {
let activeElement = list[indexValue];
document.getElementById("popDate").innerText = "Date: " + activeElement.day + " | Time: " + activeElement.time;
document.getElementById("popText").innerText = activeElement.text;
document.getElementById("pop").style.display = "flex";
}

function hidePop() {
document.getElementById("pop").style.display = "none";
}

function pickTheme() {
let valueChoice = document.getElementById("chooseTheme").value;
document.body.className = valueChoice;
}

function playMusic(evt) {
let selectedFile = evt.target.files[0];
if(selectedFile) {
let playerObj = document.getElementById("audioTag");
playerObj.src = URL.createObjectURL(selectedFile);
playerObj.play();
alert("Playing your selected background music!");
}
}

function addTodo() {
let taskInputString = document.getElementById("todoInp").value.trim();
if(taskInputString === "") return;
todos.push(taskInputString);
localStorage.setItem("myTodos", JSON.stringify(todos));
document.getElementById("todoInp").value = "";
showTodos();
}

function delTodo(indexValue) {
todos.splice(indexValue, 1);
localStorage.setItem("myTodos", JSON.stringify(todos));
showTodos();
}

function showTodos() {
let targetUl = document.getElementById("todoList");
targetUl.innerHTML = "";
for(let index = 0; index < todos.length; index++) {
let itemLi = document.createElement("li");
itemLi.innerHTML = `
<span>${todos[index]}</span>
<button onclick="delTodo(${index})" style="color:red; margin-left:10px; padding:1px 5px; font-size:11px;">✕</button>
`;
targetUl.appendChild(itemLi);
}
}