document.addEventListener("DOMContentLoaded", () => {
    const editProfileBtn = document.getElementById("editProfileBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const editProfileModal = document.getElementById("editProfileModal");
    const editProfileForm = document.getElementById("editProfileForm");
  
    // Öffnen des Modals, wenn der Benutzer auf "Edit Profile" klickt
    editProfileBtn.addEventListener("click", async () => {
      // Abrufen des Tokens aus dem localStorage
      const token = localStorage.getItem("token");
  
      if (!token) {
        window.location.href = "/login"; // Wenn kein Token vorhanden, zurück zur Login-Seite
        return;
      }
  
      try {
        // Anfrage an das Backend, um das Profil abzurufen
        const response = await fetch("/auth/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Daten in das Formular einfügen
          document.getElementById("username").value = data.name;
          document.getElementById("email").value = data.email;
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching the profile data.");
      }
  
      // Öffnen des Modals
      editProfileModal.classList.remove("hidden");
    });
  
    // Schließen des Modals
    closeModalBtn.addEventListener("click", () => {
      editProfileModal.classList.add("hidden");
    });
  
    // Formular-Submit-Logik (z.B. zum Speichern von Änderungen)
    editProfileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("You must be logged in to update your profile.");
        return;
      }
  
      try {
        // Anfrage an das Backend, um das Profil zu aktualisieren
        const response = await fetch("/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ name: username, email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Profile updated successfully!");
          window.location.reload(); // Seite neu laden, um die Änderungen anzuzeigen
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while updating the profile.");
      }
  
      // Modal schließen nach dem Absenden
      editProfileModal.classList.add("hidden");
    });
  });