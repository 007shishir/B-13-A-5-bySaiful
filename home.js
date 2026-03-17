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

    setLoader(true); // Show loader while data is being fetched

    filtered.forEach((issue) => {
        console.log("Rendering issue:", issue);
        const div = document.createElement("div");
        div.onclick = () => showModal(issue.id);
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
        setLoader(false); // Hide loader after rendering is done
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


setLoader = (isLoading) => {
  const loader = document.getElementById("loading");
  loader.classList.toggle("hidden", !isLoading);
};


showModal = (id) => {
  const modal = document.getElementById("issueModal");
  modal.classList.remove("hidden");

  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then((response) => response.json())
    .then((data) => {
      const issue = data.data;

      const modalContent = `
      <dialog id="issue_modal" class="modal modal-open">
          <div class="modal-box max-w-2xl border border-base-300 shadow-2xl">
              
              <div class="flex justify-between items-start mb-4">
                  <div>
                      <h3 class="font-bold text-2xl flex items-center gap-2">
                          <i class="fa-solid fa-circle-dot text-success"></i> 
                          ${issue.title || 'Sample Issue Title'}
                          <span class="text-base-content/30 font-light">${issue.id || '1'}</span>
                      </h3>
                      <div class="flex gap-2 mt-2">
                          <div class="badge badge-error badge-outline gap-1">
                              <i class="fa-solid fa-triangle-exclamation text-xs"></i> ${issue.priority || 'HIGH'}
                          </div>
                          <div class="badge badge-success gap-1 text-white">
                              <i class="fa-solid fa-door-open text-xs"></i> ${issue.status || 'OPEN'}
                          </div>
                      </div>
                  </div>
                  <button class="btn btn-sm btn-circle btn-ghost" onclick="closeModal()">✕</button>
              </div>

              <div class="py-4">
                  <h4 class="text-xs font-bold uppercase text-base-content/50 mb-1">Description</h4>
                  <p class="text-base-content/80 leading-relaxed">
                      ${issue.description || 'description goes here'}
                  </p>
              </div>

              <div class="divider my-1"></div>

              <div class="grid grid-cols-2 gap-4 py-4">
                  <div class="flex items-center gap-3">
                      <div class="avatar placeholder">
                          <div class="bg-neutral text-neutral-content rounded-full w-8">
                              <span class="text-xs">${(issue.author || 'JD').substring(0,2).toUpperCase()}</span>
                          </div>
                      </div>
                      <div>
                          <div class="text-xs font-bold text-base-content/50 uppercase">Author</div>
                          <div class="text-sm">${issue.author || 'john_doe'}</div>
                      </div>
                  </div>

                  <div class="flex items-center gap-3">
                      <div class="avatar placeholder">
                          <div class="bg-primary text-primary-content rounded-full w-8">
                              <span class="text-xs">${(issue.assignee || 'JS').substring(0,2).toUpperCase()}</span>
                          </div>
                      </div>
                      <div>
                          <div class="text-xs font-bold text-base-content/50 uppercase">Assignee</div>
                          <div class="text-sm font-semibold">${issue.assignee || 'jane_smith'}</div>
                      </div>
                  </div>
              </div>

              <div class="bg-base-200 p-4 rounded-xl space-y-4">
                  <div>
                      <div class="text-xs font-bold text-base-content/50 uppercase mb-2">Labels</div>
                      <div class="flex gap-2">
                          ${issue.labels ? issue.labels.map(label => `<span class="badge badge-md"><i class="fa-solid fa-tag mr-1 text-xs"></i> ${label}</span>`).join(' ') : ''}
                      </div>
                  </div>
                  
                  <div class="flex justify-between text-xs text-base-content/60">
                      <span><i class="fa-regular fa-calendar-plus mr-1"></i> Created ${new Date(issue.createdAt).toLocaleDateString()}</span>
                      <span><i class="fa-regular fa-clock mr-1"></i> Updated ${new Date(issue.updatedAt).toLocaleDateString()}</span>
                  </div>
              </div>

              <div class="modal-action">
                  <button class="btn btn-ghost" onclick="closeModal()">Close</button>
              </div>
          </div>
      </dialog>
      `;

      modal.innerHTML = modalContent;
    });
};

const closeModal = () => {
  const modal = document.getElementById("issueModal");
  modal.classList.add("hidden");
  modal.innerHTML = "";
};