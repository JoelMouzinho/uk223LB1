document.addEventListener("DOMContentLoaded", () => {
  // Überprüfen, ob ein Token im localStorage vorhanden ist
  const token = localStorage.getItem("token");
  console.log(token);

  if (!token) {
    window.location.href = "/login";
  }

  const logoutBtn = document.getElementById("logoutBtn");

  // Logout-Event
  logoutBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Verhindert das Standardverhalten des Links

    // Token aus dem localStorage löschen
    localStorage.removeItem("token");

    // Weiterleitung zur Login-Seite
    window.location.href = "/login";
  });

});