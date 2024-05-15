const wrapper = document.querySelector(".wrapper");
const LoginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const LoginBtn = document.querySelector(".Btnlogin-popup");
const iconClose = document.querySelector(".icon-close");

registerLink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

LoginLink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

LoginBtn.addEventListener("click", () => {
  wrapper.classList.add("active-popup");
});

iconClose.addEventListener("click", () => {
  wrapper.classList.remove("active-popup");
});
