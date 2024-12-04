document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
  
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Verhindert das Standardverhalten des Formulars
  
      // Formulardaten abrufen
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
  
      try {
        // POST-Anfrage an den Server
        const response = await fetch("/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, confirmPassword }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          window.location.href = "/login"; // Erfolgsmeldung
        } else {
          console.error(error);// Fehlermeldung
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    });
  });