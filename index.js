let buttonContainer = document.querySelector(".buttons");

let buttonIds = Array.from(document.querySelectorAll("button")).map(
	(item) => item.id
);

buttonContainer.addEventListener("click", (e) => {
	console.log(buttonIds.includes(e.target.id));
});
