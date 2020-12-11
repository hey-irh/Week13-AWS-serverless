const h2 = document.querySelector("h2");
const inputName = document.querySelector("#name");
const inputRole = document.querySelector("#role");
const inputIndustry = document.querySelector("#industry");
const button = document.querySelector("button");

button.addEventListener("click", handleSubmit);

async function getBootcampers() {
  const response = await fetch(
    "https://bsm95uhv4e.execute-api.eu-west-1.amazonaws.com/dev/"
  );
  const data = await response.json();

  data.forEach((bootcamper, i) => {
    let p = document.createElement("p");
    p.innerText = `${data[i].name} - 
     Desired Role: ${data[i].desiredRole} 
     Industry: ${data[i].industry} `;
    h2.appendChild(p);
  });

  console.log(data);
}

getBootcampers();

function handleSubmit(event) {
  event.preventDefault();
  addBootcamper();
}

async function addBootcamper() {
  console.log(gatherFormData());
  const response = await fetch(
    `https://bsm95uhv4e.execute-api.eu-west-1.amazonaws.com/dev/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gatherFormData()),
    }
  );
  const data = await response.json();
  console.log(data);
}

function gatherFormData() {
  const name = inputName.value;
  const desiredRole = inputRole.value;
  const industry = inputIndustry.value;
  return {
    name,
    desiredRole,
    industry,
  };
}
