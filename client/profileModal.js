document.addEventListener("DOMContentLoaded", () => {
    const editProfileBtn = document.getElementById("editProfileBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const editProfileModal = document.getElementById("editProfileModal");
    const editProfileForm = document.getElementById("editProfileForm");
  
    // Öffnen des Modals, wenn der Benutzer auf "Edit Profile" klickt
    editProfileBtn.addEventListener("click", () => {
      editProfileModal.classList.remove("hidden");
    });
  
    // Schließen des Modals
    closeModalBtn.addEventListener("click", () => {
      editProfileModal.classList.add("hidden");
    });
  
    // Formular-Submit-Logik (z.B. zum Speichern von Änderungen)
    editProfileForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const username = document.getElementById("username").value;
      const bio = document.getElementById("bio").value;
      const profilePic = document.getElementById("profilePic").value;
  
      // Hier könntest du eine API-Anfrage an den Server senden, um das Profil zu aktualisieren
  
      console.log("Updated Profile:", { username, bio, profilePic });
  
      // Modal schließen nach dem Absenden
      editProfileModal.classList.add("hidden");
      alert("Profile updated successfully!");
    });
  });