// Basic Load Balancer Simulation (client-only)

const servers = [
  { name: "Server A", users: [] },
  { name: "Server B", users: [] },
  { name: "Server C", users: [] },
];
let rrIndex = 0;

function getStrategy() {
  return document.getElementById("strategy").value;
}

function assignUser(username) {
  const strategy = getStrategy();
  let target;

  if (strategy === "round_robin") {
    target = servers[rrIndex % servers.length];
    rrIndex++;
  } else if (strategy === "least_connections") {
    target = servers.reduce((a, b) => (a.users.length < b.users.length ? a : b));
  } else {
    target = servers[Math.floor(Math.random() * servers.length)];
  }

  target.users.push(username);
  updateUI();
  return target.name;
}

function goToInfo() {
  // Redirect to another page
  window.location.href = "loadbalancing.html";
}


function updateUI() {
  const container = document.getElementById("servers");
  container.innerHTML = "";

  let total = 0;
  servers.forEach((s) => (total += s.users.length));
  document.getElementById("totalUsers").textContent = total;

  servers.forEach((server) => {
    const loadPct = Math.min(100, (server.users.length / 10) * 100);
    const div = document.createElement("div");
    div.className = "server-card";
    div.innerHTML = `
      <div class="server-header">
        <h4>${server.name}</h4>
        <span class="badge">${server.users.length}</span>
      </div>
      <div class="bar"><div class="bar-fill" style="width:${loadPct}%"></div></div>
      <div class="users-list">
        ${server.users
          .slice(-6)
          .map((u) => `<div class="user-chip">${u}</div>`)
          .join("")}
        ${server.users.length > 6 ? `<div class="user-chip">+${server.users.length - 6} more</div>` : ""}
      </div>
    `;
    container.appendChild(div);
  });
}

document.getElementById("loginBtn").addEventListener("click", () => {
  const usernameInput = document.getElementById("username");
  const name = usernameInput.value.trim();
  if (!name) return alert("Enter a username!");
  const assigned = assignUser(name);
  document.getElementById("assignedText").textContent =
    "Assigned to: " + assigned;
  usernameInput.value = "";
});

document.getElementById("simulateBtn").addEventListener("click", () => {
  for (let i = 0; i < 20; i++) {
    assignUser("user-" + Math.floor(Math.random() * 1000));
  }
});

function scrollToMain() {
  document.querySelector(".container").scrollIntoView({ behavior: "smooth" });
}

// Initial UI
updateUI();
