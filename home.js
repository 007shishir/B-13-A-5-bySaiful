document.getElementById("allBtn").onclick = function () {
  console.log("All button clicked");
  setActiveButton(this);
};

document.getElementById("openBtn").onclick = function () {
  console.log("Open button clicked");
  setActiveButton(this);
};

document.getElementById("closedBtn").onclick = function () {
  console.log("Closed button clicked");
  setActiveButton(this);
};

const setActiveButton = (activeBtn) => {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("btn-primary");
  });
    activeBtn.classList.add("btn-primary");
};
