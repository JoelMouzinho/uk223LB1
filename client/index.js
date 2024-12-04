document.addEventListener("DOMContentLoaded", () => {
    // Überprüfen, ob ein Token im localStorage vorhanden ist
    const token = localStorage.getItem("token");
    console.log(token);
  
    if (!token) {
      window.location.href = "/login";
    }
  });