// Protect page access
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("fpg_token");
  const user = localStorage.getItem("fpg_user");

  if (!token || !user) {
    window.location.href = "/login";
  } else {
    try {
      const userObj = JSON.parse(user);
      const nameElement = document.getElementById("userName");
      if (nameElement) {
        nameElement.textContent = userObj.name;
      }
    } catch (e) {
      localStorage.removeItem("fpg_token");
      localStorage.removeItem("fpg_user");
      window.location.href = "/login";
    }
  }
});

// Logout function
function logout() {
  localStorage.removeItem("fpg_token");
  localStorage.removeItem("fpg_user");
  window.location.href = "/login";
}
