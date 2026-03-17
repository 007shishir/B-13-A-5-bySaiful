let originalIssueData = [];
let issueData = [];

fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
  .then((response) => response.json())
  .then((data) => {
    originalIssueData = data.data;
    issueData = [...originalIssueData];
    console.log("Fetched issue data:", issueData);
    // You can call a function here to render the issues on the page
    renderIssues("allBtn");
  });

  const renderIssues = (type) => {
    const issueContainer = document.getElementById("issueContainer");
    issueContainer.innerHTML = ""; // Clear existing issues

    let filtered = [];
    if (type === "allBtn") {
        filtered = [...originalIssueData];
        setIssuesCount(filtered);
    } else if (type === "openBtn") {
        filtered = originalIssueData.filter((issue) => issue.status === "open");
        setIssuesCount(filtered);
    } else if (type === "closedBtn") {
        filtered = originalIssueData.filter((issue) => issue.status === "closed");
        setIssuesCount(filtered);
    }

    filtered.forEach((issue) => {
        console.log("Rendering issue:", issue);
        const div = document.createElement("div");
        div.innerHTML = `
        
        <div class="card bg-base-100 shadow-md border border-t-4 ${issue.status === 'closed' ? 'border-red-500' : 'border-green-500'}">
            <div class="card-body p-4">
              <div class="flex items-start justify-between gap-4  pt-3">
                <div><img src="./assets/Open-Status.png" alt=""></div>
                <span class="badge badge-sm ${issue.priority === 'high' ? 'badge-error' : 'badge-info'}">${issue.priority}</span>
              </div>

           <h3 class="text-lg font-semibold">${issue.title || 'Sample Issue'}</h3>

              <p class="text-sm text-base-content/70 mt-2">
                ${issue.description || 'Description here'}
              </p>

              <div class="flex flex-wrap gap-2 mt-4">
                <span class="badge badge-outline badge-xs">${issue.labels?.join('</span><span class="badge badge-outline badge-xs">') || 'BUG'}</span>
              </div>

              <div class="mt-4 border-t border-base-200 pt-3 text-xs text-base-content/70">
                <div class="flex items-center gap-2">
                  <i class="fa-solid fa-user fa-xs"></i>
                  <span>#${issue.number || 1} by ${issue.user?.login || 'john_doe'}</span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <i class="fa-regular fa-calendar fa-xs"></i>
                  <span>${new Date(issue.created_at).toLocaleDateString() || '1/15/2024'}</span>
                </div>
              </div>
            </div>
          </div>

        `;
        issueContainer.appendChild(div);
      });
  };

document.getElementById("allBtn").onclick = function () {
  console.log("All button clicked");
  setActiveButton(this);
  renderIssues("allBtn");
};

document.getElementById("openBtn").onclick = function () {
  console.log("Open button clicked");
  setActiveButton(this);
  renderIssues("openBtn");
};

document.getElementById("closedBtn").onclick = function () {
  console.log("Closed button clicked");
  setActiveButton(this);
  renderIssues("closedBtn");
};

const setActiveButton = (activeBtn) => {
  // Select the actual buttons inside the filter container (not the container itself)
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("btn-primary");
  });

  // Add the primary style to the clicked button
  activeBtn.classList.add("btn-primary");
};



const setIssuesCount = (dataArr) => {
  const countIssue = document.getElementById("countIssues");
  countIssue.innerHTML= `
  ${dataArr.length} Issues
  `
}