document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Verhindert das Standardverhalten des Formulars
  
      // Formulardaten abrufen
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      try {
        // POST-Anfrage an den Server
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Erfolg: Token speichern und weiterleiten
          localStorage.setItem("token", data.token); // JWT speichern
          alert("Login successful!");
          window.location.href = "/"; // Weiterleitung zur Dashboard-Seite
        } else {
          // Fehler: Fehlermeldung anzeigen
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    });
  });