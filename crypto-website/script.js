// ===============================
// 🔐 CRYPTO PRO - CLEAN PRO SCRIPT
// ===============================

// ===== SAFE FIREBASE INIT =====
let auth = null;

try {
    if (window.firebase) {
        firebase.initializeApp({
            apiKey: "YOUR_KEY"
        });
        auth = firebase.auth();
    }
} catch (e) {
    console.warn("Firebase not loaded - using LocalStorage");
}

// ===== INIT =====
window.onload = () => {
    loadTheme();
    checkLogin();
    setupEvents();
};

// ===== GLOBAL UTIL =====
const $ = (id) => document.getElementById(id);

function showToast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
}

function showLoader() { document.body.classList.add("loading"); }
function hideLoader() { document.body.classList.remove("loading"); }

// ===============================
// 🔐 AUTH SYSTEM (CLEAN)
// ===============================

function signup() {
    let user = document.getElementById("username").value.trim();
    let pass = document.getElementById("authPassword").value.trim();

    if (!user || !pass) {
        showToast("Fill all fields");
        return;
    }

    if (pass.length < 6) {
        showToast("Password must be at least 6 characters");
        return;
    }

    if (localStorage.getItem("user_" + user)) {
        showToast("User already exists");
        return;
    }

    localStorage.setItem("user_" + user, pass);
    showToast("Signup successful! Now login.");
}

function login() {
    let user = document.getElementById("username").value.trim();
    let pass = document.getElementById("authPassword").value.trim();

    if (!user || !pass) {
        showToast("Enter username & password");
        return;
    }

    let stored = localStorage.getItem("user_" + user);

    if (!stored) {
        showToast("User not found. Please signup.");
        return;
    }

    if (stored !== pass) {
        showToast("Wrong password");
        return;
    }

    // SUCCESS
    localStorage.setItem("loggedUser", user);
    showApp();
    showToast("Login successful 🚀");
}

function logout() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("guestUser");

    document.getElementById("app").style.display = "none";
    document.getElementById("navbar").style.display = "none";
    document.getElementById("authBox").style.display = "flex";

    showToast("Logged out");
}

function checkLogin() {
    let logged = localStorage.getItem("loggedUser");
    let guest = localStorage.getItem("guestUser");

    // ✅ If ANY user exists → open app
    if (logged || guest) {
        document.getElementById("authBox").style.display = "none";
        document.getElementById("app").style.display = "block";
        document.getElementById("navbar").style.display = "flex";

        showSection("dashboard");
        return;
    }

    // ❌ Only show login if NO user
    document.getElementById("authBox").style.display = "flex";
    document.getElementById("app").style.display = "none";
    document.getElementById("navbar").style.display = "none";
}

function showApp() {
    document.getElementById("authBox").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("navbar").style.display = "flex";

    showSection("dashboard");
    loadHistory();
}
function continueAsGuest() {
    localStorage.setItem("guestUser", "true");

    // Direct UI switch (IMPORTANT)
    document.getElementById("authBox").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("navbar").style.display = "flex";

    showSection("dashboard");

    showToast("Guest mode activated 🚀");
}

// ===============================
// 🔐 PASSWORD MANAGEMENT (UPGRADED)
// ===============================

function openForgot() {
    $("forgotModal").style.display = "flex";
}
function closeForgot() {
    $("forgotModal").style.display = "none";
}
let resetVerified = false;

function verifyUser() {
    let user = document.getElementById("resetUser").value.trim();

    if (!user) {
        showToast("Enter username/email first");
        return;
    }

    if (localStorage.getItem("user_" + user)) {
        resetVerified = true;
        showToast("User verified ✅");
    } else {
        showToast("User not found");
    }
}
// RESET (SIMULATED SAFE FLOW)
function resetPassword() {
    let user = document.getElementById("resetUser").value.trim();
    let newPass = document.getElementById("newPass").value.trim();

    if (!user || !newPass) {
        showToast("Fill all fields");
        return;
    }

    if (newPass.length < 6) {
        showToast("Password must be at least 6 characters");
        return;
    }

    let stored = localStorage.getItem("user_" + user);

    if (!stored) {
        showToast("User not found");
        return;
    }

    // ✅ Direct reset (like forgot password)
    localStorage.setItem("user_" + user, newPass);

    showToast("Password reset successful 🔑");

    closeForgot();
}

// CHANGE PASSWORD (LOGGED IN USER)
function changePassword() {
    let user = localStorage.getItem("loggedUser");

    if (!user) {
        showToast("Please login first");
        return;
    }

    let oldPass = document.getElementById("oldPass").value.trim();
    let newPass = document.getElementById("newPass2").value.trim();

    if (!oldPass || !newPass) {
        showToast("Fill all fields");
        return;
    }

    if (newPass.length < 6) {
        showToast("New password too weak");
        return;
    }

    let stored = localStorage.getItem("user_" + user);

    if (!stored) {
        showToast("User not found");
        return;
    }

    if (stored !== oldPass) {
        showToast("Incorrect old password");
        return;
    }

    // ✅ Update password
    localStorage.setItem("user_" + user, newPass);

    showToast("Password changed successfully 🔐");

    // Clear inputs
    document.getElementById("oldPass").value = "";
    document.getElementById("newPass2").value = "";

    closeChange();
}
// ===============================
// 🔐 ENCRYPTION CORE
// ===============================

function caesar(text, shift) {
    return text.split('').map(c => {
        if (/[a-z]/i.test(c)) {
            let base = c === c.toUpperCase() ? 65 : 97;
            return String.fromCharCode((c.charCodeAt(0) - base + shift + 26) % 26 + base);
        }
        return c;
    }).join('');
}

function xorCipher(text, key) {
    return text.split('').map(c =>
        String.fromCharCode(c.charCodeAt(0) ^ key)
    ).join('');
}

function aesEncrypt(text, pass) {
    return CryptoJS.AES.encrypt(text, pass).toString();
}

function aesDecrypt(text, pass) {
    try {
        let bytes = CryptoJS.AES.decrypt(text, pass);
        let result = bytes.toString(CryptoJS.enc.Utf8);
        if (!result) throw "error";
        return result;
    } catch {
        showToast("Wrong password");
        return "";
    }
}

// ===============================
// 🚀 MAIN ACTIONS
// ===============================

function encrypt() {
    let text = $("input").value;
    let pass = $("password").value;
    let algo = $("algo").value;

    if (!text) return showToast("Enter text");

    showLoader();

    setTimeout(() => {
        let result =
            algo === "aes" ? aesEncrypt(text, pass) :
            algo === "caesar" ? caesar(text, 3) :
            xorCipher(text, 3);

        $("output").value = result;
        addHistory(result);

        hideLoader();
        showToast("Encrypted ✔");
    }, 300);
}

function decrypt() {
    let text = $("input").value;
    let pass = $("password").value;
    let algo = $("algo").value;

    if (!text) return showToast("Enter text");

    showLoader();

    setTimeout(() => {
        let result =
            algo === "aes" ? aesDecrypt(text, pass) :
            algo === "caesar" ? caesar(text, 23) :
            xorCipher(text, 3);

        $("output").value = result;

        hideLoader();
        showToast("Decrypted ✔");
    }, 300);
}

// ===============================
// 📂 FILE SYSTEM
// ===============================

function loadFile() {
    let file = $("fileInput").files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = e => {
        $("input").value = e.target.result;
        showToast("File loaded");
    };
    reader.readAsText(file);
}

function downloadFile() {
    let text = $("output").value;
    if (!text) return showToast("No output");

    let blob = new Blob([text]);
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "encrypted.txt";
    a.click();
}

// ===============================
// 📜 HISTORY
// ===============================

function addHistory(text) {
    let user = localStorage.getItem("loggedUser");
    let data = JSON.parse(localStorage.getItem(user + "_history")) || [];

    data.push({ text, time: new Date().toLocaleString() });

    localStorage.setItem(user + "_history", JSON.stringify(data));
    loadHistory();
}

function loadHistory() {
    let user = localStorage.getItem("loggedUser");
    let data = JSON.parse(localStorage.getItem(user + "_history")) || [];

    let list = $("history");
    list.innerHTML = "";

    data.reverse().forEach(item => {
        let li = document.createElement("li");
        li.innerText = item.text.substring(0, 30);
        li.onclick = () => $("input").value = item.text;
        list.appendChild(li);
    });
}

// ===============================
// 🎨 UI SYSTEM
// ===============================

function toggleTheme() {
    document.body.classList.toggle("light");
    localStorage.setItem("theme",
        document.body.classList.contains("light") ? "light" : "dark"
    );
}

function loadTheme() {
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
    }
}

function copyText() {
    navigator.clipboard.writeText($("output").value);
    showToast("Copied!");
}

// ===============================
// 🎯 EVENTS SETUP
// ===============================

function setupEvents() {
    $("password")?.addEventListener("input", passwordStrength);
}

// PASSWORD STRENGTH (CLEAN BAR)
function passwordStrength() {
    let val = $("password").value;
    let bar = $("strength");

    let strength = val.length > 8 ? "100%" :
                   val.length > 4 ? "60%" :
                   val.length > 0 ? "30%" : "0%";

    bar.style.width = strength;
}

// ===============================
// 🧠 LEARN SECTION
// ===============================

function openTopic(type) {
    let box = document.getElementById("learnDetail");

    if (type === "aes") {
        box.innerHTML = `
        <h3>🔐 AES (Advanced Encryption Standard)</h3>

        <p>
        AES is a modern symmetric encryption algorithm widely used across the globe 
        to secure sensitive data. It is trusted by governments, banks, and major tech companies.
        </p>

        <p>
        It works by transforming readable data (plaintext) into unreadable data (ciphertext) 
        using complex substitution and permutation techniques.
        </p>

        <ul>
            <li>✔ Key sizes: 128, 192, 256 bits</li>
            <li>✔ Extremely secure and fast</li>
            <li>✔ Used in HTTPS, VPNs, banking systems</li>
        </ul>

        <p>
        AES is considered practically unbreakable with current computing power when used correctly.
        </p>

        <a href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard" target="_blank">
        🌐 Read Full Documentation
        </a>
        `;
    }

    if (type === "caesar") {
        box.innerHTML = `
        <h3>📜 Caesar Cipher</h3>

        <p>
        The Caesar Cipher is one of the oldest and simplest encryption techniques, 
        used by Julius Caesar to protect military messages.
        </p>

        <p>
        It works by shifting each letter in the text by a fixed number of positions 
        in the alphabet.
        </p>

        <ul>
            <li>✔ Very easy to implement</li>
            <li>✔ Good for learning cryptography basics</li>
            <li>❌ Not secure for real-world use</li>
        </ul>

        <p>
        Today, it is mainly used for educational purposes to understand how encryption works.
        </p>

        <a href="https://en.wikipedia.org/wiki/Caesar_cipher" target="_blank">
        🌐 Learn More
        </a>
        `;
    }

    if (type === "xor") {
        box.innerHTML = `
        <h3>⚡ XOR Cipher</h3>

        <p>
        XOR encryption uses a bitwise operation where each bit of the data 
        is compared with a key using the XOR logic.
        </p>

        <p>
        It is extremely fast and forms the foundation of many modern encryption systems 
        when combined with other algorithms.
        </p>

        <ul>
            <li>✔ Very fast and lightweight</li>
            <li>✔ Used in low-level systems</li>
            <li>✔ Same function for encrypt & decrypt</li>
        </ul>

        <p>
        While simple alone, XOR becomes powerful when combined with complex key systems.
        </p>

        <a href="https://en.wikipedia.org/wiki/XOR_cipher" target="_blank">
        🌐 Explore More
        </a>
        `;
    }
}
// ================= NAVIGATION SYSTEM =================

// Show selected page
function showSection(id) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.style.display = "none";
    });

    const activePage = document.getElementById(id);
    if (activePage) {
        activePage.style.display = "block";
    }
}

