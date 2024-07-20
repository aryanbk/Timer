document.addEventListener("DOMContentLoaded", () => {
	// Timer variables
	let startTime;
	let timerInterval;
	let isRunning = false;

	// DOM elements
	const startButton = document.getElementById("startButton");
	const stopButton = document.getElementById("stopButton");
	const resetButton = document.getElementById("resetButton");
	const clearButton = document.getElementById("clearButton");
	const currentTimerDisplay = document.getElementById("currentTimer");
	const timesheetTable = document.getElementById("timesheetTable");
	const taskInput = document.getElementById("task-name");
	const categoryInput = document.getElementById("category");
	const currentDateTimeDisplay = document.getElementById("currentDateTime");
	const totalTimeWorkedDisplay = document.getElementById("totalTimeWorked");
	const todayTimeDisplay = document.getElementById("todayTime");
	const updateDateButton = document.getElementById("updateDateButton");

	// Event listeners
	startButton.addEventListener("click", startTimer);
	stopButton.addEventListener("click", stopTimer);
	resetButton.addEventListener("click", resetTimer);
	clearButton.addEventListener("click", clearAllData);
	updateDateButton.addEventListener("click", updateCurrentDate);

	let currentDate = getCurrentDateFromStorage();

	function updateCurrentDate() {
		currentDate = new Date();
		saveCurrentDateToStorage(currentDate);
		updateDateTimeDisplay();
		displayTotalTimeForCurrentDate();
	}

	function startTimer() {
		if (!isRunning && taskInput.value.trim() !== "") {
			startTime = new Date().getTime();
			timerInterval = setInterval(updateTimerDisplay, 1000);
			isRunning = true;
			saveCurrentDateToStorage(currentDate);
		}
	}

	function stopTimer() {
		if (isRunning) {
			clearInterval(timerInterval);
			addTimesheet();
			isRunning = false;
			currentTimerDisplay.textContent = "00:00:00";
		}
	}

	function resetTimer() {
		clearInterval(timerInterval);
		currentTimerDisplay.textContent = "00:00:00";
		isRunning = false;
	}

	function updateTimerDisplay() {
		const elapsedTime = new Date().getTime() - startTime;
		const formattedTime = formatTime(elapsedTime);
		currentTimerDisplay.textContent = formattedTime;
	}

	function addTimesheet() {
		const timesheet = {
			time: currentTimerDisplay.textContent,
			task: taskInput.value.trim().toLowerCase(),
			category: categoryInput.value.trim().toLowerCase(),
			date: formatDate(currentDate),
		};
		const timesheets = getStoredTimesheets();
		timesheets.push(timesheet);
		localStorage.setItem("timesheets", JSON.stringify(timesheets));
		displayTimesheets();
		displayTotalTimeForCurrentDate();
		displayTotalTimeWorked();
	}

	function getStoredTimesheets() {
		const timesheets = localStorage.getItem("timesheets");
		return timesheets ? JSON.parse(timesheets) : [];
	}

	function displayTimesheets() {
		const timesheets = getStoredTimesheets();
		timesheetTable.innerHTML = "";
		timesheets.forEach((timesheet) => {
			const row = timesheetTable.insertRow();
			row.insertCell().textContent = timesheet.time;
			row.insertCell().textContent = timesheet.task;
			row.insertCell().textContent = timesheet.category;
			row.insertCell().textContent = timesheet.date;
		});
	}

	function displayTotalTimeWorked() {
		const timesheets = getStoredTimesheets();
		const totalSeconds = timesheets.reduce((total, timesheet) => {
			return total + timeToSeconds(timesheet.time);
		}, 0);
		const totalTime = formatTimeHHMM(totalSeconds);
		totalTimeWorkedDisplay.textContent = "Total " + totalTime;
	}

	function displayTotalTimeForCurrentDate() {
		const timesheets = getStoredTimesheets();
		const totalSeconds = timesheets.reduce((total, timesheet) => {
			if (timesheet.date === formatDate(currentDate)) {
				return total + timeToSeconds(timesheet.time);
			}
			return total;
		}, 0);
		const totalTime = formatTimeHHMM(totalSeconds);
		todayTimeDisplay.textContent = "Today " + totalTime;
	}

	function clearAllData() {
		localStorage.clear();
		displayTimesheets();
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

	function formatDateMMMDD(date) {
		const options = { day: "2-digit", month: "short" };
		return date.toLocaleDateString("en-US", options).toLowerCase();
	}

	function formatDateMMDD(date) {
		return date
			.toLocaleDateString("en-US", {
				month: "2-digit",
				day: "2-digit",
			})
			.replace("/", "-");
	}

	function formatDate(date) {
		return formatDateMMDD(date);
	}

	function updateDateTimeDisplay() {
		const now = new Date();
		const formattedDate = formatDate(currentDate);
		const formattedTime = now.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
		currentDateTimeDisplay.textContent = `Timer ${formattedDate} ${formattedTime}`;
	}

	function formatTime(milliseconds) {
		const totalSeconds = Math.floor(milliseconds / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		return [hours, minutes, seconds]
			.map((num) => num.toString().padStart(2, "0"))
			.join(":");
	}

	function timeToSeconds(timeString) {
		const [hours, minutes, seconds] = timeString.split(":").map(Number);
		return hours * 3600 + minutes * 60 + seconds;
	}

	function formatTimeHHMM(seconds) {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}`;
	}

	function updateEntryDate(entryNumber, newDate) {
		let timesheets = JSON.parse(localStorage.getItem("timesheets") || "[]");

		if (entryNumber > 0 && entryNumber <= timesheets.length) {
			timesheets[entryNumber - 1].date = newDate;
			localStorage.setItem("timesheets", JSON.stringify(timesheets));

			const timesheetTable = document.getElementById("timesheetTable");
			timesheetTable.innerHTML = "";
			timesheets.forEach((timesheet) => {
				const row = timesheetTable.insertRow();
				row.insertCell().textContent = timesheet.time;
				row.insertCell().textContent = timesheet.task;
				row.insertCell().textContent = timesheet.category;
				row.insertCell().textContent = timesheet.date;
			});

			const today = new Date()
				.toLocaleDateString("en-US", {
					month: "2-digit",
					day: "2-digit",
				})
				.replace("/", "-");

			const totalSeconds = timesheets.reduce(
				(total, timesheet) => total + timeToSeconds(timesheet.time),
				0
			);
			const totalTime = formatTimeHHMM(totalSeconds);
			document.getElementById("totalTimeWorked").textContent =
				"Total " + totalTime;

			const todaySeconds = timesheets.reduce((total, timesheet) => {
				return timesheet.date === today
					? total + timeToSeconds(timesheet.time)
					: total;
			}, 0);
			const todayTime = formatTimeHHMM(todaySeconds);
			document.getElementById("todayTime").textContent =
				"Today " + todayTime;

			console.log(`Entry ${entryNumber} updated to date: ${newDate}`);
		} else {
			console.log(
				"Invalid entry number. Please provide a valid entry number."
			);
		}

		function timeToSeconds(timeString) {
			const [hours, minutes, seconds] = timeString.split(":").map(Number);
			return hours * 3600 + minutes * 60 + seconds;
		}

		function formatTimeHHMM(seconds) {
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			return `${hours.toString().padStart(2, "0")}:${minutes
				.toString()
				.padStart(2, "0")}`;
		}
	}

	// Initial setup
	document.title = "Timer";
	updateDateTimeDisplay();
	displayTimesheets();
	displayTotalTimeWorked();
	displayTotalTimeForCurrentDate();
	setInterval(updateDateTimeDisplay, 60000);
});
