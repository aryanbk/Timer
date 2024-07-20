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
	const timesheetTable = document.getElementById("timesheetTable");
	const taskInput = document.getElementById("task-name");
	const catInput = document.getElementById("category");
	const headingDisplay = document.getElementById("h1");
	const totalTimeWorkedDisplay = document.getElementById("totalTimeWorked");
	const totalTimeForCurrentDateDisplay = document.getElementById("todayTime");
	const updateDateButton = document.getElementById("updateDateButton");

	startButton.addEventListener("click", startTimer);
	stopButton.addEventListener("click", stopTimer);
	resetButton.addEventListener("click", resetTimer);
	clearButton.addEventListener("click", clearTimer);

	let currentDate = getCurrentDateFromStorage();

	updateDateButton.addEventListener("click", updateCurrentDate);

	function updateCurrentDate() {
		currentDate = new Date();
		saveCurrentDateToStorage(currentDate);
		updateHeading();
		displayTotalTimeForCurrentDate();
	}

	function startTimer() {
		if (!running && taskInput.value.trim() != "") {
			taskName = taskInput.value.trim().toLowerCase();
			catName = catInput.value.trim().toLowerCase();
			startTime = new Date().getTime();
			tInterval = setInterval(getShowTime, 1);
			running = true;
			saveCurrentDateToStorage(currentDate);
		}
	}

	function stopTimer() {
		if (running) {
			clearInterval(tInterval);
			addTimeSheet();
			running = false;
			timerDisplay.innerHTML = "00:00:00";
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
			date: formatDate(currentDate),
		};
		const timeSheets = getStoredTimeSheets();
		timeSheets.push(timeSheet);
		localStorage.setItem("timeSheets", JSON.stringify(timeSheets));
		displayTimeSheets();
		displayTotalTimeWorked();
	}

	function getStoredTimeSheets() {
		const timeSheets = localStorage.getItem("timeSheets");
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
			const tdDate = document.createElement("td");

			tdTime.innerText = timeSheet.time;
			tdTask.innerText = timeSheet.task;
			tdCat.innerText = timeSheet.category;
			tdDate.innerText = timeSheet.date;

			tr.appendChild(tdTime);
			tr.appendChild(tdTask);
			tr.appendChild(tdCat);
			tr.appendChild(tdDate);

			timesheetTable.appendChild(tr);
		});
	}

	function displayTodayTime() {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		headingDisplay.innerText =
			"Timer  " +
			(hours < 10 ? "0" + hours : hours) +
			":" +
			(minutes < 10 ? "0" + minutes : minutes);
	}

	function displayTotalTimeWorked() {
		const timeSheets = getStoredTimeSheets();
		let totalSeconds = 0;

		timeSheets.forEach((timeSheet) => {
			const [hours, minutes, seconds] = timeSheet.time
				.split(":")
				.map(Number);
			totalSeconds += hours * 3600 + minutes * 60 + seconds;
		});

		const totalHours = Math.floor(totalSeconds / 3600);
		const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
		const totalTime =
			(totalHours < 10 ? "0" + totalHours : totalHours) +
			":" +
			(totalMinutes < 10 ? "0" + totalMinutes : totalMinutes);

		totalTimeWorkedDisplay.innerText = "Total " + totalTime;
	}

	function displayTotalTimeForCurrentDate() {
		const timeSheets = getStoredTimeSheets();
		let totalSeconds = 0;

		timeSheets.forEach((timeSheet) => {
			if (timeSheet.date === formatDate(currentDate)) {
				const [hours, minutes, seconds] = timeSheet.time
					.split(":")
					.map(Number);
				totalSeconds += hours * 3600 + minutes * 60 + seconds;
			}
		});

		const totalHours = Math.floor(totalSeconds / 3600);
		const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
		const totalTime =
			(totalHours < 10 ? "0" + totalHours : totalHours) +
			":" +
			(totalMinutes < 10 ? "0" + totalMinutes : totalMinutes);

		totalTimeForCurrentDateDisplay.innerText = "Today " + totalTime;
	}

	function clearTimer() {
		localStorage.clear();
		displayTimeSheets();
		displayTotalTimeWorked();
		displayTotalTimeForCurrentDate();
	}

	function getCurrentDateFromStorage() {
		const storedDate = localStorage.getItem("currentDate");
		return storedDate ? new Date(storedDate) : new Date();
	}

	function saveCurrentDateToStorage(date) {
		localStorage.setItem("currentDate", date.toISOString());
	}

	function formatDate(date) {
		const options = { day: "2-digit", month: "short" };
		return date.toLocaleDateString("en-US", options).toLowerCase();
	}

	function updateHeading() {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		const formattedDate = formatDate(currentDate);
		headingDisplay.innerText = `Timer ${formattedDate} ${
			hours < 10 ? "0" + hours : hours
		}:${minutes < 10 ? "0" + minutes : minutes}`;
	}

	// Initial setup
	document.title = "Timer";
	updateHeading();
	displayTimeSheets();
	displayTotalTimeWorked();
	displayTotalTimeForCurrentDate();
	setInterval(updateHeading, 60000);

	console.log("Formatted Date:", formatDate(currentDate));
});
