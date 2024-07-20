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
	const todayTimeDisplay = document.getElementById("h1");
	const totalTimeWorkedDisplay = document.getElementById("totalTimeWorked");

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

			tdTime.innerText = timeSheet.time;
			tdTask.innerText = timeSheet.task;
			tdCat.innerText = timeSheet.category;

			tr.appendChild(tdTime);
			tr.appendChild(tdTask);
			tr.appendChild(tdCat);

			timesheetTable.appendChild(tr);
		});
	}

	function displayTodayTime() {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		todayTimeDisplay.innerText =
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

	function clearTimer() {
		localStorage.clear();
		displayTimeSheets();
		displayTotalTimeWorked();
	}

	window.onbeforeunload = function () {
		return "Current timer will be lost if you refresh the page. Are you sure?";
	};

	displayTimeSheets();
	displayTodayTime();
	displayTotalTimeWorked();
	setInterval(displayTodayTime, 60000); // Update today's time every minute
});
