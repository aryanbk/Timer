document.addEventListener("DOMContentLoaded", (event) => {
	let startTime;
	let updatedTime;
	let difference;
	let tInterval;
	let taskName;
	let catName;
	let running = false;

	const startButton = document.getElementById("startButton");
	const stopButton = document.getElementById("stopButton");
	const resetButton = document.getElementById("resetButton");
	const clearButton = document.getElementById("clearButton");
	const timerDisplay = document.getElementById("timer");
	const timeDisplay = document.getElementById("time");
	const timesheetTable = document.getElementById("timesheetTable");
	const taskInput = document.getElementById("task-name");
	const catInput = document.getElementById("category");
	const date = new Date();

	startButton.addEventListener("click", startTimer);
	stopButton.addEventListener("click", stopTimer);
	resetButton.addEventListener("click", resetTimer);
	clearButton.addEventListener("click", clearTimer);

	function startTimer() {
		if (!running && taskInput.value.trim() != "") {
			taskName = taskInput.value.trim().toLowerCase();
			catName = catInput.value.trim().toLowerCase();
			startTime = new Date().getTime();
			tInterval = setInterval(getShowTime, 1);
			running = true;
		}
	}

	function stopTimer() {
		if (running) {
			clearInterval(tInterval);
			addTimeSheet();
			running = false;
		}
	}

	function resetTimer() {
		clearInterval(tInterval);
		timerDisplay.innerHTML = "00:00:00";
		running = false;
	}

	function getShowTime() {
		updatedTime = new Date().getTime();
		difference = updatedTime - startTime;

		let hours = Math.floor(
			(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((difference % (1000 * 60)) / 1000);

		timerDisplay.innerHTML =
			(hours < 10 ? "0" + hours : hours) +
			":" +
			(minutes < 10 ? "0" + minutes : minutes) +
			":" +
			(seconds < 10 ? "0" + seconds : seconds);
	}

	function addTimeSheet() {
		const timeSheet = {
			time: timerDisplay.innerHTML,
			task: taskName,
			category: catName,
		};
		const timeSheets = getStoredTimeSheets();
		timeSheets.push(timeSheet);
		localStorage.setItem("timeSheets", JSON.stringify(timeSheets));
		displayTimeSheets();
	}

	function getStoredTimeSheets() {
		const timeSheets = localStorage.getItem("timeSheets");
		console.log(localStorage);
		return timeSheets ? JSON.parse(timeSheets) : [];
	}

	function displayTimeSheets() {
		const timeSheets = getStoredTimeSheets();
		timesheetTable.innerHTML = "";
		timeSheets.forEach((timeSheet) => {
			const tr = document.createElement("tr");
			const tdTime = document.createElement("td");
			const tdTask = document.createElement("td");
			const tdCat = document.createElement("td");

			tdTime.innerText = timeSheet.time;
			tdTask.innerText = timeSheet.task;
			tdCat.innerText = timeSheet.category;

			tr.appendChild(tdTime);
			tr.appendChild(tdTask);
			tr.appendChild(tdCat);

			timesheetTable.appendChild(tr);
		});
	}
	function updateTime() {
		timeDisplay.innerText =
			date.getDate() + " - " + date.getHours() + ":" + date.getMinutes();
	}
	function clearTimer() {
		localStorage.clear();
	}

	displayTimeSheets();
	updateTime();
});
