document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const createPostBtn = document.getElementById("createPostBtn");
  const postContent = document.getElementById("postContent");
  const postsContainer = document.getElementById("postsContainer");

  // Logout-Event
  logoutBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Verhindert das Standardverhalten des Links

    // Token aus dem localStorage löschen
    localStorage.removeItem("token");

    // Weiterleitung zur Login-Seite
    window.location.href = "/login";
  });

  // Holen der Beiträge, wenn die Seite geladen wird
  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // Weiterleitung zur Login-Seite, wenn kein Token vorhanden ist
    }

    try {
      const response = await fetch("/posts", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);  // Logge die Antwort, um zu sehen, was zurückkommt
        if (data.posts && Array.isArray(data.posts)) {
          // Beiträge in den Feed einfügen
          data.posts.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.classList.add("bg-gray-800", "p-4", "rounded-md");
            postElement.innerHTML = `
              <div class="flex items-center mb-2">
                <div class="w-10 h-10 bg-gray-600 rounded-full mr-3"></div>
                <div>
                  <h3 class="text-md font-bold">${post.name}</h3>
                  <p class="text-gray-400 text-sm">${new Date(post.date).toLocaleString()}</p>
                </div>
              </div>
              <p class="text-gray-300 mb-3">${post.content}</p>
            `;
            postsContainer.appendChild(postElement);
          });
        } else {
          alert("Keine Beiträge gefunden oder das Antwortformat ist fehlerhaft.");
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching posts.");
    }
  };

  // Beim Klick auf den Button wird ein neuer Beitrag erstellt
  createPostBtn.addEventListener("click", async () => {
    const content = postContent.value.trim();

    if (!content) {
      alert("Post content cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token"); // Token wird hier neu abgerufen
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (response.ok) {
        postContent.value = "";
        fetchPosts();
      } else {
        console.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the post.");
    }
  });

  // Beiträge beim Laden der Seite abrufen
  fetchPosts();
});